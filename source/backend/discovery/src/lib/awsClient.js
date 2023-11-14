// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const logger = require('./logger');
const pThrottle = require('p-throttle');
const {parse: parseArn} = require("@aws-sdk/util-arn-parser");
const {customUserAgent} = require('./config');
const {
    Organizations,
    OrganizationsClient,
    paginateListAccounts,
    paginateListAccountsForParent,
    paginateListOrganizationalUnitsForParent
} = require("@aws-sdk/client-organizations");
const {APIGateway, APIGatewayClient, paginateGetResources} = require("@aws-sdk/client-api-gateway");
const {
    CognitoIdentityProviderClient,
    CognitoIdentityProvider,
    paginateListUserPools
} = require('@aws-sdk/client-cognito-identity-provider');
const {LambdaClient, paginateListFunctions, paginateListEventSourceMappings} = require('@aws-sdk/client-lambda');
const {
    ECSClient,
    ECS,
    paginateListContainerInstances,
    paginateListTasks
} = require("@aws-sdk/client-ecs");
const {EKSClient, EKS, paginateListNodegroups} = require("@aws-sdk/client-eks");
const {
    EC2,
    EC2Client,
    paginateDescribeSpotInstanceRequests,
    paginateDescribeSpotFleetRequests,
    paginateDescribeTransitGatewayAttachments
} = require('@aws-sdk/client-ec2')
const R = require("ramda");
const {ElasticLoadBalancing} = require("@aws-sdk/client-elastic-load-balancing");
const {
    ElasticLoadBalancingV2,
    ElasticLoadBalancingV2Client,
    paginateDescribeTargetGroups
} = require("@aws-sdk/client-elastic-load-balancing-v2");
const {IAMClient, paginateListPolicies}  = require("@aws-sdk/client-iam");
const {STS} = require("@aws-sdk/client-sts");
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const {AWS, OPENSEARCH, GLOBAL} = require("./constants");
const {
    ConfigServiceClient,
    ConfigService,
    paginateListAggregateDiscoveredResources,
    paginateSelectAggregateResourceConfig,
} = require("@aws-sdk/client-config-service");
const {
    OpenSearch
} = require('@aws-sdk/client-opensearch');
const {
    DynamoDBStreams
} = require('@aws-sdk/client-dynamodb-streams')
const {SNSClient, paginateListSubscriptions} = require('@aws-sdk/client-sns');
const {memoize} = require('./utils');

// We want to share throttling limits across instances of clients so we memoize this
// function that each factory function calls to create its throttlers during
// instantiation.
const createThrottler = memoize((name, credentials, region, throttleParams) => {
    return pThrottle(throttleParams);
});

function throttledPaginator(throttler, paginator) {
    const getPage = throttler(async () => paginator.next());

    return (async function* () {
        while(true) {
            const {done, value} = await getPage();
            if(done) return {done};
            yield value;
        }
    })();
}

function createOrganizationsClient(credentials, region) {
    const organizationsClient = new Organizations({customUserAgent, region, credentials});

    const paginatorConfig = {
        pageSize: 20,
        client: new OrganizationsClient({customUserAgent, region, credentials})
    };

    const getAllAccountsThrottler = createThrottler('getAllAccounts', credentials, region, {
        limit: 1,
        interval: 1000
    });

    const getAllFromParentThrottler = createThrottler('getAllFromParent', credentials, region, {
        limit: 1,
        interval: 1000
    });

    async function getAllAccounts() {
        const listAccountsPaginator = paginateListAccounts(paginatorConfig, {});

        const accounts = []

        for await (const {Accounts} of throttledPaginator(getAllAccountsThrottler, listAccountsPaginator)) {
            accounts.push(...Accounts);
        }

        return accounts;
    }

    async function getAllAccountsFromParent(ouId) {
        const ouIds = [ouId];

        // we will do these serially so as not to encounter rate limiting
        for(const id of ouIds) {
            const paginator =
                throttledPaginator(getAllFromParentThrottler, paginateListOrganizationalUnitsForParent(paginatorConfig, {ParentId: id}));
            for await (const {OrganizationalUnits} of paginator) {
                ouIds.push(...OrganizationalUnits.map(x => x.Id));
            }
        }

        const accounts = [];

        for(const id of ouIds) {
            const paginator =
                throttledPaginator(getAllFromParentThrottler, paginateListAccountsForParent(paginatorConfig, {ParentId: id}));
            for await (const {Accounts} of paginator) {
                accounts.push(...Accounts);
            }
        }

        return accounts;
    }

    return {
        async getAllActiveAccountsFromParent(ouId) {
            const {Roots} = await organizationsClient.listRoots({});
            const {Id: rootId, Arn: managementAccountArn} = Roots[0];
            const managementAccountId = parseArn(managementAccountArn).accountId;

            const accounts = await (ouId === rootId ? getAllAccounts() : getAllAccountsFromParent(ouId));

            const activeAccounts = accounts
                .filter(account => account.Status === 'ACTIVE')
                .map(account => {
                    if(account.Id === managementAccountId) {
                        account.isManagementAccount = true;
                    }
                    return account;
                });

            logger.info(`All active accounts from organization unit ${ouId} retrieved, ${activeAccounts.length} retrieved.`);

            return activeAccounts;
        }
    };
}

function createOpenSearchClient(credentials, region) {
    const OpenSearchClient = new OpenSearch({customUserAgent, region, credentials});

    return {
        async getAllOpenSearchDomains() {
            const {DomainNames} = await OpenSearchClient.listDomainNames({EngineType: OPENSEARCH});

            const domains = [];

            // The describeDomain API can only handle 5 domain names per request. Also, we send these
            // requests serially to reduce the chance of any rate limiting.
            for(const batch of R.splitEvery(5, DomainNames)) {
                const {DomainStatusList} = await OpenSearchClient.describeDomains({DomainNames: batch.map(x => x.DomainName)})
                domains.push(...DomainStatusList);
            }

            return domains;
        }
    };
}

function createApiGatewayClient(credentials, region) {
    const apiGatewayClient = new APIGateway({customUserAgent, region, credentials});

    const apiGatewayPaginatorConfig = {
        pageSize: 100,
        client: new APIGatewayClient({customUserAgent, region, credentials})
    }

    // The API Gateway rate limits are _per account_ so we set the region to global
    const getResourcesThrottler = createThrottler('apiGatewayGetResources', credentials, GLOBAL, {
        limit: 5,
        interval: 2000
    });

    const totalOperationsThrottler = createThrottler('apiGatewayTotalOperations', credentials, GLOBAL, {
        limit: 10,
        interval: 1000
    });

    return {
        getResources: totalOperationsThrottler(getResourcesThrottler(async restApiId => {
            const getResourcesPaginator = paginateGetResources(apiGatewayPaginatorConfig, {restApiId});

            const apiResources = [];
            for await (const {items} of getResourcesPaginator) {
                apiResources.push(...items);
            }
            return apiResources;
        })),
        getMethod: totalOperationsThrottler(async (httpMethod, resourceId, restApiId) => {
            return apiGatewayClient.getMethod({
                httpMethod, resourceId, restApiId
            });
        }),
        getAuthorizers: totalOperationsThrottler(async restApiId => {
            return apiGatewayClient.getAuthorizers({restApiId})
                .then(R.prop('items'))
        })
    };
}

function createConfigServiceClient(credentials, region) {
    const configClient = new ConfigService({credentials, region});

    const paginatorConfig = {
        client: new ConfigServiceClient({credentials, region}),
        pageSize: 100
    };

    const selectAggregateResourceConfigThrottler = createThrottler(
        'selectAggregateResourceConfig', credentials, region, {
            limit: 8,
            interval: 1000
        }
    );

    const batchGetAggregateResourceConfigThrottler = createThrottler(
        'batchGetAggregateResourceConfig', credentials, region, {
            limit: 15,
            interval: 1000
        }
    );

    const batchGetAggregateResourceConfig = batchGetAggregateResourceConfigThrottler((ConfigurationAggregatorName, ResourceIdentifiers) => {
        return configClient.batchGetAggregateResourceConfig({ConfigurationAggregatorName, ResourceIdentifiers})
    })

    return {
        async getConfigAggregator(aggregatorName) {
            const {ConfigurationAggregators} = await configClient.describeConfigurationAggregators({
                ConfigurationAggregatorNames: [aggregatorName]
            });
            return ConfigurationAggregators[0];
        },
        async getAllAggregatorResources(aggregatorName, {excludes: {resourceTypes: excludedResourceTypes = []}}) {
            logger.info('Getting resources with advanced query');
            const excludedResourceTypesSqlList = excludedResourceTypes.map(rt => `'${rt}'`).join(',');
            const excludesResourceTypesWhere = R.isEmpty(excludedResourceTypes) ?
                '' : `WHERE resourceType NOT IN (${excludedResourceTypesSqlList})`;

            const Expression = `SELECT
              *,
              configuration,
              configurationItemStatus,
              relationships,
              tags
              ${excludesResourceTypesWhere}
            `
            const paginator = paginateSelectAggregateResourceConfig(paginatorConfig, {
                ConfigurationAggregatorName: aggregatorName, Expression
            });

            const resources = []

            for await (const page of throttledPaginator(selectAggregateResourceConfigThrottler, paginator)) {
                resources.push(...R.map(JSON.parse, page.Results));
            }

            logger.info(`${resources.length} resources downloaded from Config advanced query`);
            return resources;
        },
        async getAggregatorResources(aggregatorName, resourceType) {
            const resources = [];

            const paginator = paginateListAggregateDiscoveredResources(paginatorConfig,{
                ConfigurationAggregatorName: aggregatorName,
                ResourceType: resourceType
            });

            for await (const {ResourceIdentifiers} of paginator) {
                if(!R.isEmpty(ResourceIdentifiers)) {
                    const {BaseConfigurationItems} = await batchGetAggregateResourceConfig(aggregatorName, ResourceIdentifiers);
                    resources.push(...BaseConfigurationItems);
                }
            }

            return resources;
        }
    };
}

function createLambdaClient(credentials, region) {
    const lambdaPaginatorConfig = {
        client: new LambdaClient({customUserAgent, region, credentials}),
        pageSize: 100
    };

    return {
        async getAllFunctions() {
            const functions = [];
            const listFunctions = paginateListFunctions(lambdaPaginatorConfig, {});

            for await (const {Functions} of listFunctions) {
                functions.push(...Functions);
            }
            return functions;
        },
        async listEventSourceMappings(arn) {
            const mappings = [];
            const listEventSourceMappingsPaginator = paginateListEventSourceMappings(lambdaPaginatorConfig, {
                FunctionName: arn
            });

            for await (const {EventSourceMappings} of listEventSourceMappingsPaginator) {
                mappings.push(...EventSourceMappings)
            }
            return mappings;
        }
    };
}

function createEc2Client(credentials, region) {
    const ec2Client = new EC2({customUserAgent, credentials, region});

    const ec2PaginatorConfig = {
        client: new EC2Client({customUserAgent, region, credentials}),
        pageSize: 100
    };

    return {
        async getAllRegions() {
            const { Regions } = await ec2Client.describeRegions({});
            return Regions.map(x => ({name: x.RegionName}));
        },
        async getAllSpotInstanceRequests() {
            const siPaginator = paginateDescribeSpotInstanceRequests(ec2PaginatorConfig, {});

            const spotInstanceRequests = [];
            for await (const {SpotInstanceRequests} of siPaginator) {
                spotInstanceRequests.push(...SpotInstanceRequests);
            }
            return spotInstanceRequests;
        },
        async getAllSpotFleetRequests() {
            const sfPaginator = paginateDescribeSpotFleetRequests(ec2PaginatorConfig, {});

            const spotFleetRequests = [];

            for await (const {SpotFleetRequestConfigs} of sfPaginator) {
                spotFleetRequests.push(...SpotFleetRequestConfigs);
            }
            return spotFleetRequests;
        },
        async getAllTransitGatewayAttachments(Filters) {
            const paginator = paginateDescribeTransitGatewayAttachments(ec2PaginatorConfig, {Filters});
            const attachments = [];
            for await (const {TransitGatewayAttachments} of paginator) {
                attachments.push(...TransitGatewayAttachments);
            }
            return attachments;
        }
    }
}

function createEcsClient(credentials, region) {
    const ecsClient = new ECS({customUserAgent, region, credentials});

    const ecsPaginatorConfig = {
        client: new ECSClient({customUserAgent, region, credentials}),
        pageSize: 100
    };

    // describeContainerInstances, describeTasks and listTasks share the same throttling bucket
    const ecsClusterResourceReadThrottler = createThrottler('ecsClusterResourceReadThrottler', credentials, region, {
        limit: 20,
        interval: 1000
    });

    const describeContainerInstances = ecsClusterResourceReadThrottler((cluster, containerInstances) => {
        return ecsClient.describeContainerInstances({cluster, containerInstances});
    })

    const describeTasks = ecsClusterResourceReadThrottler((cluster, tasks) => {
        return ecsClient.describeTasks({cluster, tasks});
    })

    return {
        async getAllClusterInstances(clusterArn) {
            const listContainerInstancesPaginator = paginateListContainerInstances(ecsPaginatorConfig, {
                cluster: clusterArn
            });

            const instances = [];

            for await (const {containerInstanceArns} of throttledPaginator(ecsClusterResourceReadThrottler, listContainerInstancesPaginator)) {
                if(!R.isEmpty(containerInstanceArns)) {
                    const {containerInstances} = await describeContainerInstances(clusterArn, containerInstanceArns);
                    instances.push(...containerInstances.map(x => x.ec2InstanceId))
                }
            }
            return instances;
        },
        async getAllServiceTasks(cluster, serviceName) {
            const serviceTasks = []
            const listTaskPaginator = paginateListTasks(ecsPaginatorConfig, {cluster, serviceName});

            for await (const {taskArns} of throttledPaginator(ecsClusterResourceReadThrottler, listTaskPaginator)) {
                if(!R.isEmpty(taskArns)) {
                    const {tasks} = await describeTasks(cluster, taskArns);
                    serviceTasks.push(...tasks);
                }
            }

            return serviceTasks;
        },
        async getAllClusterTasks(cluster) {
            const clusterTasks = []
            const listTaskPaginator = paginateListTasks(ecsPaginatorConfig, {cluster});

            for await (const {taskArns} of throttledPaginator(ecsClusterResourceReadThrottler, listTaskPaginator)) {
                if(!R.isEmpty(taskArns)) {
                    const {tasks} = await describeTasks(cluster, taskArns);
                    clusterTasks.push(...tasks);
                }
            }

            return clusterTasks;
        }
    };
}

function createEksClient(credentials, region) {
    const eksClient = new EKS({customUserAgent, region, credentials});

    const eksPaginatorConfig = {
        client: new EKSClient({customUserAgent, region, credentials}),
        pageSize: 100
    };
    // this API only has a TPS of 10 so we set it artificially low to avoid rate limiting
    const describeNodegroupThrottler = createThrottler('eksDescribeNodegroup', credentials, region, {
        limit: 5,
        interval: 1000
    });

    return {
        async listNodeGroups(clusterName) {
            const ngs = [];
            const listNodegroupsPaginator = paginateListNodegroups(eksPaginatorConfig, {
                clusterName
            });

            for await (const {nodegroups} of listNodegroupsPaginator) {
                const result = await Promise.all(nodegroups.map(describeNodegroupThrottler(async nodegroupName => {
                    const {nodegroup} = await eksClient.describeNodegroup({
                        nodegroupName, clusterName
                    });
                    return nodegroup;
                })));
                ngs.push(...result);
            }

            return ngs;
        }
    }

}

function createElbClient(credentials, region) {
    const elbClient = new ElasticLoadBalancing({credentials, region});

    // ELB rate limits for describe* calls are shared amongst all LB types
    const elbDescribeThrottler = createThrottler('elbDescribe', credentials, region, {
        limit: 10,
        interval: 1000
    });

    return {
        getLoadBalancerInstances: elbDescribeThrottler(async resourceId => {
            const lb = await elbClient.describeLoadBalancers({
                LoadBalancerNames: [resourceId],
            });

            const instances = lb.LoadBalancerDescriptions[0]?.Instances ?? [];

            return instances.map(x => x.InstanceId);
        })
    };
}

function createElbV2Client(credentials, region) {
    const elbClientV2 = new ElasticLoadBalancingV2({credentials, region});
    const elbV2PaginatorConfig = {
        client: new ElasticLoadBalancingV2Client({customUserAgent, region, credentials}),
        pageSize: 100
    };

    // ELB rate limits for describe* calls are shared amongst all LB types
    const elbDescribeThrottler = createThrottler('elbDescribe', credentials, region, {
        limit: 10,
        interval: 1000
    });

    return {
        describeTargetHealth: elbDescribeThrottler(async arn => {
            const {TargetHealthDescriptions = []} = await elbClientV2.describeTargetHealth({
                TargetGroupArn: arn
            });
            return TargetHealthDescriptions;
        }),
        getAllTargetGroups: elbDescribeThrottler(async () => {
            const tgPaginator = paginateDescribeTargetGroups(elbV2PaginatorConfig, {});

            const targetGroups = [];
            for await (const {TargetGroups} of tgPaginator) {
                targetGroups.push(...TargetGroups);
            }

            return targetGroups;
        }),
    };
}

function createIamClient(credentials, region) {
    const iamPaginatorConfig = {
        client: new IAMClient({customUserAgent, region, credentials}),
        pageSize: 100
    };

    return {
        async getAllAttachedAwsManagedPolices() {
            const listPoliciesPaginator = paginateListPolicies(iamPaginatorConfig, {
                Scope: AWS.toUpperCase(), OnlyAttached: true});

            const managedPolices = [];
            for await (const {Policies} of listPoliciesPaginator) {
                managedPolices.push(...Policies);
            }

            return managedPolices;
        }
    };
}

function createSnsClient(credentials, region) {
    const snsPaginatorConfig = {
        client: new SNSClient({credentials, region}),
        pageSize: 100
    }

    return {
        async getAllSubscriptions() {
            const listSubscriptionsPaginator = paginateListSubscriptions(snsPaginatorConfig, {});

            const subscriptions = [];
            for await (const {Subscriptions} of listSubscriptionsPaginator) {
                subscriptions.push(...Subscriptions);
            }

            return subscriptions;
        }
    }
}

function createStsClient(credentials, region) {
    const params = (credentials == null && region == null) ? {} : {credentials, region}
    const sts = new STS(params);

    const CredentialsProvider = fromNodeProviderChain();

    return {
        async getCredentials(role) {
            const {Credentials} = await sts.assumeRole({
                    RoleArn: `${role}`,
                    RoleSessionName: 'discovery'
                }
            );

            return {accessKeyId: Credentials.AccessKeyId, secretAccessKey: Credentials.SecretAccessKey, sessionToken: Credentials.SessionToken};
        },
        async getCurrentCredentials() {
            return CredentialsProvider();
        }
    };
}

function createCognitoClient(credentials, region) {
    const cognitoPaginatorConfig = {
        client: new CognitoIdentityProviderClient({customUserAgent, region, credentials}),
        pageSize: 60
    }

    const cognitoClient = new CognitoIdentityProvider({customUserAgent, region, credentials});

    // describeUserPool has an RPS of 15, we set this artificially low to avoid
    // being rate limited
    const describeUserPoolThrottler = createThrottler('cognitoDescribeUserPool', credentials, region, {
        limit: 7,
        interval: 1000
    });

    return {
        async getAllUserPools() {
            const upPaginator = paginateListUserPools(cognitoPaginatorConfig, {});

            const userPools = [];

            for await(const {UserPools} of upPaginator) {
                const throttledPromises = UserPools.map(describeUserPoolThrottler(({Id}) => cognitoClient.describeUserPool({UserPoolId: Id})));
                const pools = await Promise.all(throttledPromises);
                userPools.push(...pools.map(x => x.UserPool));
            }

            return userPools;
        }
    }

}

function createDynamoDBStreamsClient(credentials, region) {
    const dynamoDBStreamsClient = new DynamoDBStreams({customUserAgent, region, credentials});

    // this API only has a TPS of 10 so we set it artificially low to avoid rate limiting
    const describeStreamThrottler = createThrottler('dynamoDbDescribeStream', credentials, region, {
        limit: 8,
        interval: 1000
    });

    const describeStream = describeStreamThrottler(streamArn => dynamoDBStreamsClient.describeStream({StreamArn: streamArn}));

    return {
        async describeStream(streamArn) {
            const {StreamDescription} = await describeStream(streamArn);
            return StreamDescription;
        }
    }
}

module.exports = {
    createOrganizationsClient,
    createApiGatewayClient,
    createConfigServiceClient,
    createDynamoDBStreamsClient,
    createEc2Client,
    createEcsClient,
    createEksClient,
    createLambdaClient,
    createElbClient,
    createElbV2Client,
    createIamClient,
    createStsClient,
    createCognitoClient,
    createOpenSearchClient,
    createSnsClient
};