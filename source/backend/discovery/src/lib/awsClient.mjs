// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import logger from './logger.mjs';
import pThrottle from 'p-throttle';
import {ConfiguredRetryStrategy} from '@smithy/util-retry';
import {customUserAgent} from './config.mjs';
import {
    ServiceCatalogAppRegistry,
    ServiceCatalogAppRegistryClient,
    paginateListApplications
} from '@aws-sdk/client-service-catalog-appregistry';
import {
    Organizations,
    OrganizationsClient,
    paginateListAccounts,
    paginateListAccountsForParent,
    paginateListOrganizationalUnitsForParent
} from "@aws-sdk/client-organizations";
import {APIGateway, APIGatewayClient, paginateGetResources} from '@aws-sdk/client-api-gateway';
import {AppSync} from '@aws-sdk/client-appsync';
import {LambdaClient, paginateListFunctions, paginateListEventSourceMappings} from '@aws-sdk/client-lambda';
import {
    ECSClient,
    ECS,
    paginateListContainerInstances,
    paginateListTasks
} from "@aws-sdk/client-ecs";
import {EKSClient, EKS, paginateListNodegroups} from '@aws-sdk/client-eks';
import {
    EC2,
    EC2Client,
    paginateDescribeSpotInstanceRequests,
    paginateDescribeSpotFleetRequests,
    paginateDescribeTransitGatewayAttachments
} from '@aws-sdk/client-ec2'
import * as R from "ramda";
import {ElasticLoadBalancing} from '@aws-sdk/client-elastic-load-balancing';
import {
    ElasticLoadBalancingV2,
    ElasticLoadBalancingV2Client,
    paginateDescribeTargetGroups
} from "@aws-sdk/client-elastic-load-balancing-v2";
import {IAMClient, paginateListPolicies} from '@aws-sdk/client-iam';
import {STS} from "@aws-sdk/client-sts";
import {fromNodeProviderChain} from '@aws-sdk/credential-providers';
import {AWS, OPENSEARCH, GLOBAL} from './constants.mjs';
import {
    ConfigServiceClient,
    ConfigService,
    paginateListAggregateDiscoveredResources,
    paginateSelectAggregateResourceConfig,
} from '@aws-sdk/client-config-service';
import {
    MediaConnectClient, paginateListFlows
} from '@aws-sdk/client-mediaconnect';
import {
    OpenSearch
} from '@aws-sdk/client-opensearch';
import {
    DynamoDBStreams
} from '@aws-sdk/client-dynamodb-streams'
import {SNSClient, paginateListSubscriptions} from '@aws-sdk/client-sns';
import {memoize} from './utils.mjs';

const RETRY_EXPONENTIAL_RATE = 2;

// We want to share throttling limits across instances of clients so we memoize this
// function that each factory function calls to create its throttlers during
// instantiation.
const createThrottler = memoize((name, credentials, region, throttleParams) => {
    return pThrottle(throttleParams);
});

export function throttledPaginator(throttler, paginator) {
    const getPage = throttler(async () => paginator.next());

    return (async function* () {
        while(true) {
            const {done, value} = await getPage();
            if(done) return {done};
            yield value;
        }
    })();
}

export function createServiceCatalogAppRegistryClient(credentials, region) {
    const appRegistryClient = new ServiceCatalogAppRegistry({customUserAgent, region, credentials});

    const paginatorConfig = {
        pageSize: 20,
        client: new ServiceCatalogAppRegistryClient({customUserAgent, region, credentials})
    };

    const listApplicationsPaginatorThrottler = createThrottler('listApplicationsPaginated', credentials, region, {
        limit: 5,
        interval: 1000
    });

    const getApplicationThrottler = createThrottler('getApplication', credentials, region, {
        limit: 5,
        interval: 1000
    });

    const getApplication = getApplicationThrottler((application) => {
        return appRegistryClient.getApplication({application});
    });

    const listApplicationsPaginator = paginateListApplications(paginatorConfig, {});

    return {
        async getAllApplications() {
            const applications = [];

            for await (const result of throttledPaginator(listApplicationsPaginatorThrottler, listApplicationsPaginator)) {
                for(const {name} of result.applications) {
                    const application = await getApplication(name);
                    applications.push(application)
                }
            }

            return applications;
        }
    }
}

export function createOrganizationsClient(credentials, region) {
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
            const [{Roots}, {Organization}] = await Promise.all([
                organizationsClient.listRoots({}),
                organizationsClient.describeOrganization({})
            ]);
            const {Id: rootId} = Roots[0];
            const {MasterAccountId: managementAccountId} = Organization;

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

export function createOpenSearchClient(credentials, region) {
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

export function createApiGatewayClient(credentials, region) {
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

export function createAppSyncClient(credentials, region) {
    const appSyncClient = new AppSync({customUserAgent, credentials, region});
    const appSyncListThrottler = createThrottler('appSyncList', credentials, region, {
        limit: 5,
        interval: 1000
    });

    const throttledListDataSources = appSyncListThrottler(({apiId, nextToken}) => appSyncClient.listDataSources({apiId, nextToken}));
    const throttledListResolvers = appSyncListThrottler(({apiId, typeName, nextToken}) => appSyncClient.listResolvers({apiId, typeName, nextToken}));


    return {
        async listDataSources(apiId) {
            const results = [];

            let nextToken = null;
            do {
                const {dataSources, nextToken: nt} = await throttledListDataSources({apiId, nextToken})
                results.push(...dataSources)
                nextToken = nt
            } while (nextToken != null)

            return results
        },

        async listResolvers(apiId, typeName){
            const results = [];

            let nextToken = null;
            do {
                const {resolvers, nextToken: nt} = await throttledListResolvers({apiId, typeName, nextToken})
                results.push(...resolvers)
                nextToken = nt
            } while (nextToken != null)

            return results
        },
    }
}

export function createConfigServiceClient(credentials, region) {
    const configClient = new ConfigService({customUserAgent, credentials, region});

    const paginatorConfig = {
        client: new ConfigServiceClient({customUserAgent, credentials, region}),
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
              supplementaryConfiguration,
              tags
              ${excludesResourceTypesWhere}
            `
            const MAX_RETRIES = 5;

            const paginator = paginateSelectAggregateResourceConfig({
                client: new ConfigServiceClient({
                    customUserAgent,
                    credentials,
                    region,
                    // this code is a critical path so we use a lengthy exponential retry
                    // rate to give it as much chance to succeed in the face of any
                    // throttling errors: 0s -> 2s -> 6s -> 14s -> 30s -> Failure
                    retryStrategy: new ConfiguredRetryStrategy(
                        MAX_RETRIES,
                        attempt => 2000 * (RETRY_EXPONENTIAL_RATE ** attempt)
                    )
                }),
                pageSize: 100
            }, {
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
        },
        async isConfigEnabled() {
            const [{ConfigurationRecorders}, {DeliveryChannels}] = await Promise.all([
                configClient.describeConfigurationRecorders(),
                configClient.describeDeliveryChannels()
            ]);

            return !R.isEmpty(ConfigurationRecorders) && !R.isEmpty(DeliveryChannels);
        }
    };
}

export function createLambdaClient(credentials, region) {
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

export function createEc2Client(credentials, region) {
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

export function createEcsClient(credentials, region) {
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
        return ecsClient.describeTasks({cluster, tasks, include: ['TAGS']});
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
            const listTaskPaginator = paginateListTasks(ecsPaginatorConfig, {
                cluster, serviceName
            });

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
            const listTaskPaginator = paginateListTasks(ecsPaginatorConfig, {
                cluster, include: ['TAGS']
            });

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

export function createEksClient(credentials, region) {
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

export function createElbClient(credentials, region) {
    const elbClient = new ElasticLoadBalancing({customUserAgent, credentials, region});

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

export function createElbV2Client(credentials, region) {
    const elbClientV2 = new ElasticLoadBalancingV2({customUserAgent, credentials, region});
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

export function createIamClient(credentials, region) {
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

export function createMediaConnectClient(credentials, region) {
    const listFlowsPaginatorConfig = {
        client: new MediaConnectClient({customUserAgent, credentials, region}),
        pageSize: 20
    }

    const listFlowsPaginatorThrottler = createThrottler('mediaConnectListThrottler', credentials, region, {
        limit: 5,
        interval: 1000
    });

    return {
        async getAllFlows() {
            const listFlowsPaginator = paginateListFlows(listFlowsPaginatorConfig, {});

            const flows = [];

            for await (const {Flows} of throttledPaginator(listFlowsPaginatorThrottler, listFlowsPaginator)) {
                flows.push(...Flows);
            }

            return flows;
        }
    };
}

export function createSnsClient(credentials, region) {
    const snsPaginatorConfig = {
        client: new SNSClient({customUserAgent, credentials, region}),
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

export function createStsClient(credentials, region) {
    const params = (credentials == null && region == null) ? {} : {credentials, region}
    const sts = new STS({...params, customUserAgent});

    const CredentialsProvider = fromNodeProviderChain();

    return {
        async getCredentials(RoleArn) {
            const {Credentials} = await sts.assumeRole({
                    RoleArn,
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

export function createDynamoDBStreamsClient(credentials, region) {
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

export function createAwsClient() {
    return {
        createServiceCatalogAppRegistryClient,
        createOrganizationsClient,
        createApiGatewayClient,
        createAppSyncClient,
        createConfigServiceClient,
        createDynamoDBStreamsClient,
        createEc2Client,
        createEcsClient,
        createEksClient,
        createLambdaClient,
        createElbClient,
        createElbV2Client,
        createIamClient,
        createMediaConnectClient,
        createStsClient,
        createOpenSearchClient,
        createSnsClient
    }
};