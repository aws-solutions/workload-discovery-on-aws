// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const pThrottle = require('p-throttle');
const {customUserAgent} = require('./config');
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
const {AWS, OPENSEARCH} = require("./constants");
const {
    ConfigServiceClient,
    ConfigService,
    paginateListAggregateDiscoveredResources,
    paginateSelectAggregateResourceConfig,
} = require("@aws-sdk/client-config-service");
const {
    OpenSearch
} = require('@aws-sdk/client-opensearch');
const {SNSClient, paginateListSubscriptions} = require('@aws-sdk/client-sns');

// The API Gateway rate limits are _per account_ so we have to create any
// throttlers outside the factory function
const apiGatewayThrottlers = {
    getResourcesThrottlers: new Map(),
    totalOperationsThrottlers: new Map()
}

// The ELB rate limits are for all LB type so we have to create any
// throttlers outside the ELB and ELBv2 factory functions
const elbThrottlers = {
    describeThrottlers: new Map()
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

function createApiGatewayClient(accountId, credentials, region) {
    const apiGatewayClient = new APIGateway({customUserAgent, region, credentials});

    const apiGatewayPaginatorConfig = {
        pageSize: 100,
        client: new APIGatewayClient({customUserAgent, region, credentials})
    }

    const {getResourcesThrottlers, totalOperationsThrottlers} = apiGatewayThrottlers;

    if (!getResourcesThrottlers.has(accountId)) {
        getResourcesThrottlers.set(accountId, pThrottle({
            limit: 5,
            interval: 2000
        }))
    }

    if (!totalOperationsThrottlers.has(accountId)) {
        totalOperationsThrottlers.set(accountId, pThrottle({
            limit: 10,
            interval: 1000
        }))
    }

    const getResourcesThrottler = getResourcesThrottlers.get(accountId);
    const totalOperationsThrottler = totalOperationsThrottlers.get(accountId);

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

    const batchGetAggregateResourceConfigThrottler = pThrottle({
        limit: 15,
        interval: 1000
    });

    const batchGetAggregateResourceConfig = batchGetAggregateResourceConfigThrottler((ConfigurationAggregatorName, ResourceIdentifiers) => {
        return configClient.batchGetAggregateResourceConfig({ConfigurationAggregatorName, ResourceIdentifiers})
    })

    return {
        async getAllAggregatorResources(aggregatorName, {excludes: {resourceTypes: excludedResourceTypes = []}}) {
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

            for await (const page of paginator) {
                resources.push(...R.map(JSON.parse, page.Results));
            }

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
    const ec2PaginatorConfig = {
        client: new EC2Client({customUserAgent, region, credentials}),
        pageSize: 100
    };

    return {
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

    // describeContainerInstances and describeTasks share the same throttling bucket,
    // the refill rate is 20 so we split it evenly between them
    const describeContainerInstancesThrottler = pThrottle({
        limit: 10,
        interval: 1000
    });

    const describeTasksThrottler = pThrottle({
        limit: 10,
        interval: 1000
    });

    const describeContainerInstances = describeContainerInstancesThrottler((cluster, containerInstances) => {
        return ecsClient.describeContainerInstances({cluster, containerInstances});
    })

    const describeTasks = describeTasksThrottler((cluster, tasks) => {
        return ecsClient.describeTasks({cluster, tasks});
    })

    return {
        async getAllClusterInstances(clusterArn) {
            const listContainerInstancesPaginator = paginateListContainerInstances(ecsPaginatorConfig, {
                cluster: clusterArn
            });

            const instances = [];

            for await (const {containerInstanceArns} of listContainerInstancesPaginator) {
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

            for await (const {taskArns} of listTaskPaginator) {
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

            for await (const {taskArns} of listTaskPaginator) {
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
    const describeNodegroupThrottler = pThrottle({
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

// this function mutates the elbThrottlers variable
function getElbDescribeThrottler(elbThrottlers, accountId, region) {
    if(!elbThrottlers.describeThrottlers.has(accountId)) {
        elbThrottlers.describeThrottlers.set(accountId, new Map());
    }

    if(!elbThrottlers.describeThrottlers.get(accountId).has(region)) {
        elbThrottlers.describeThrottlers.get(accountId).set(region, pThrottle({
            limit: 10,
            interval: 1000
        }));
    }

    return elbThrottlers.describeThrottlers.get(accountId).get(region);
}

function createElbClient(accountId, credentials, region) {
    const elbClient = new ElasticLoadBalancing({credentials, region});

    // ELB rate limits for describe* calls are shared amongst all LB types
    const describeThrottler = getElbDescribeThrottler(elbThrottlers, accountId, region);

    return {
        getLoadBalancerInstances: describeThrottler(async resourceId => {
            const lb = await elbClient.describeLoadBalancers({
                LoadBalancerNames: [resourceId],
            });

            const instances = lb.LoadBalancerDescriptions[0]?.Instances ?? [];

            return instances.map(x => x.InstanceId);
        })
    };
}

function createElbV2Client(accountId, credentials, region) {
    const elbClientV2 = new ElasticLoadBalancingV2({credentials, region});
    const elbV2PaginatorConfig = {
        client: new ElasticLoadBalancingV2Client({customUserAgent, region, credentials}),
        pageSize: 100
    };

    // ELB rate limits for describe* calls are shared amongst all LB types
    const describeThrottler = getElbDescribeThrottler(elbThrottlers, accountId, region);

    return {
        describeTargetHealth: describeThrottler(async arn => {
            const {TargetHealthDescriptions = []} = await elbClientV2.describeTargetHealth({
                TargetGroupArn: arn
            });
            return TargetHealthDescriptions;
        }),
        getAllTargetGroups: describeThrottler(async () => {
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
    const describeUserPoolThrottler = pThrottle({
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

module.exports = {
    createApiGatewayClient,
    createConfigServiceClient,
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