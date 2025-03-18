import {assert, afterAll, beforeAll, describe, it} from 'vitest';
import pThrottle from 'p-throttle';
import {mockClient} from 'aws-sdk-client-mock';
import sinon from 'sinon';
import {
    APIGatewayClient,
    GetAuthorizersCommand,
    GetMethodCommand,
    GetResourcesCommand,
} from '@aws-sdk/client-api-gateway';
import {
    ServiceCatalogAppRegistryClient,
    GetApplicationCommand,
    ListApplicationsCommand
} from '@aws-sdk/client-service-catalog-appregistry';
import {
    BatchGetAggregateResourceConfigCommand,
    DescribeConfigurationRecordersCommand,
    DescribeDeliveryChannelsCommand,
    ConfigServiceClient,
    DescribeConfigurationAggregatorsCommand,
    ListAggregateDiscoveredResourcesCommand,
    SelectAggregateResourceConfigCommand,
} from '@aws-sdk/client-config-service';
import {
    DescribeStreamCommand,
    DynamoDBStreamsClient
} from '@aws-sdk/client-dynamodb-streams';
import {
    DescribeNatGatewaysCommand,
    DescribeRegionsCommand,
    DescribeSpotFleetRequestsCommand,
    DescribeSpotInstanceRequestsCommand,
    DescribeTransitGatewayAttachmentsCommand,
    EC2Client
} from '@aws-sdk/client-ec2';
import {
    DescribeContainerInstancesCommand,
    DescribeTasksCommand,
    ECSClient,
    ListContainerInstancesCommand,
    ListTasksCommand
} from '@aws-sdk/client-ecs';
import {
    DescribeLoadBalancersCommand,
    ElasticLoadBalancingClient
} from '@aws-sdk/client-elastic-load-balancing';
import {
    DescribeTargetGroupsCommand,
    DescribeTargetHealthCommand,
    ElasticLoadBalancingV2Client
} from '@aws-sdk/client-elastic-load-balancing-v2';
import {
    DescribeNodegroupCommand,
    EKSClient,
    ListNodegroupsCommand
} from '@aws-sdk/client-eks';
import {
    IAMClient,
    ListPoliciesCommand
} from '@aws-sdk/client-iam';
import {
    LambdaClient,
    ListEventSourceMappingsCommand,
    ListFunctionsCommand
} from '@aws-sdk/client-lambda';
import {
    MediaConnectClient, ListFlowsCommand
} from '@aws-sdk/client-mediaconnect';
import {
    ListDomainNamesCommand,
    DescribeDomainsCommand,
    OpenSearchClient
} from '@aws-sdk/client-opensearch';
import {
    OrganizationsClient,
    ListRootsCommand,
    DescribeOrganizationCommand,
    ListAccountsCommand,
    ListAccountsForParentCommand,
    ListOrganizationalUnitsForParentCommand
} from '@aws-sdk/client-organizations';
import {
    ListSubscriptionsCommand,
    SNSClient
} from '@aws-sdk/client-sns';
import {
    AssumeRoleCommand,
    STSClient
} from '@aws-sdk/client-sts';
import {OPENSEARCH} from '../src/lib/constants.mjs';
import {ListDataSourcesCommand, AppSyncClient, ListResolversCommand} from '@aws-sdk/client-appsync';
import {throttledPaginator, createAwsClient} from '../src/lib/awsClient.mjs';

const awsClient = createAwsClient();
const EU_WEST_1 = 'eu-west-1';

describe('awsClient', () => {

    const mockCredentials = {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        sessionToken: 'optionalSessionToken'
    };

    describe('throttledPaginator', () => {
        const throttler = pThrottle({
            limit: 1,
            interval: 10
        });

        it('should handle one page', async() => {
            const asyncGenerator = (async function* () {
                yield 1;
            })();

            const results = [];
            for await(const x of throttledPaginator(throttler, asyncGenerator)) {
                results.push(x);
            }
            assert.deepEqual(results, [1]);
        });

        it('should handle multiple pages', async() => {
            const asyncGenerator = (async function* () {
                yield* [1, 2, 3];
            })();

            const results = [];
            for await(const x of throttledPaginator(throttler, asyncGenerator)) {
                results.push(x);
            }
            assert.deepEqual(results, [1, 2, 3]);
        });

    });

    describe('apiGatewayClient', () => {
        const {
            getAuthorizers,
            getMethod,
            getResources,
        } = awsClient.createApiGatewayClient(mockCredentials, EU_WEST_1);

        describe('getAuthorizers', () => {

            it('should get authorizers', async () => {
                const mockApiGatewayClient = mockClient(APIGatewayClient);

                const authorizers = {
                    restApiId: [
                        {id: 'authorizerId1'},
                        {id: 'authorizerId2'},
                        {id: 'authorizerId3'},
                        {id: 'authorizerId4'}
                    ]
                };

                mockApiGatewayClient
                    .on(GetAuthorizersCommand)
                    .callsFake(({restApiId}) => {
                        return {items: authorizers[restApiId]};
                    });

                const actual = await getAuthorizers('restApiId');

                assert.deepEqual(actual, [
                    {id: 'authorizerId1'},
                    {id: 'authorizerId2'},
                    {id: 'authorizerId3'},
                    {id: 'authorizerId4'}
                ]);
            });

            it('should get methods', async () => {
                const mockApiGatewayClient = mockClient(APIGatewayClient);

                const methods = {
                    restApiId: {
                        resourceId: {
                            GET: {
                                httpMethod: 'GET'
                            }
                        }
                    }
                };

                mockApiGatewayClient
                    .on(GetMethodCommand)
                    .callsFake(({restApiId, resourceId, httpMethod}) => {
                        return methods[restApiId][resourceId][httpMethod];
                    });

                const actual = await getMethod('GET', 'resourceId', 'restApiId');

                assert.deepEqual(actual, {httpMethod: 'GET'});
            });

            it('should get resources', async () => {
                const mockApiGatewayClient = mockClient(APIGatewayClient);

                const resources = {
                    restApiId: {
                        items: [
                            {id: 'resourceId1'},
                            {id: 'resourceId2'},
                        ],
                        position: 'restApiId-position'
                    },
                    'restApiId-position': {
                        items: [
                            {id: 'resourceId3'},
                            {id: 'resourceId4'}
                        ]
                    }
                };

                mockApiGatewayClient
                    .on(GetResourcesCommand)
                    .callsFake(({restApiId, position}) => {
                        if(position != null) return resources[position];
                        return resources[restApiId];
                    });

                const actual = await getResources('restApiId');
                assert.deepEqual(actual, [
                    {
                        'id': 'resourceId1'
                    },
                    {
                        'id': 'resourceId2'
                    },
                    {
                        'id': 'resourceId3'
                    },
                    {
                        'id': 'resourceId4'
                    }
                ]);
            });

        });

    });

    describe('serviceCatalogAppRegistryClient', () => {
        const {
            getAllApplications
        } = awsClient.createServiceCatalogAppRegistryClient(mockCredentials, EU_WEST_1);

        describe('getAllApplications', () => {

            it('should return hydrated applications list', async () => {
                const mockAppRegistryClient = mockClient(ServiceCatalogAppRegistryClient);

                const listApplicationsResp = {
                    firstPage: {
                        applications: [
                            {name: 'applicationName1'},
                            {name: 'applicationName2'},
                        ],
                        nextToken: 'applicationToken'
                    },
                    applicationToken: {
                        applications: [
                            {name: 'applicationName3'},
                            {name: 'applicationName4'},
                        ]
                    }
                };

                mockAppRegistryClient
                    .on(ListApplicationsCommand)
                    .callsFake(({nextToken} ) => {
                        if(nextToken != null) return listApplicationsResp[nextToken];
                        return listApplicationsResp.firstPage;
                    });

                const applications = {
                    'applicationName1': {
                        name: 'applicationName1', applicationTag: {
                            awsApplication: 'applicationTag1'
                        }
                    },
                    'applicationName2': {
                        name: 'applicationName2', applicationTag: {
                            awsApplication: 'applicationTag2'
                        }
                    },
                    'applicationName3': {
                        name: 'applicationName3', applicationTag: {
                            awsApplication: 'applicationTag3'
                        }
                    },
                    'applicationName4': {
                        name: 'applicationName4', applicationTag: {
                            awsApplication: 'applicationTag4'
                        }
                    },
                }

                mockAppRegistryClient
                    .on(GetApplicationCommand)
                    .callsFake(({application}) => {
                        return applications[application];
                    });

                const actual = await getAllApplications();

                assert.deepEqual(actual, [
                    {
                        name: 'applicationName1', applicationTag: {
                            awsApplication: 'applicationTag1'
                        }
                    },
                    {
                        name: 'applicationName2', applicationTag: {
                            awsApplication: 'applicationTag2'
                        }
                    },
                    {
                        name: 'applicationName3', applicationTag: {
                            awsApplication: 'applicationTag3'
                        }
                    },
                    {
                        name: 'applicationName4', applicationTag: {
                            awsApplication: 'applicationTag4'
                        }
                    }
                ]);
            });

        });

    });

    describe('configServiceClient', () => {
        const {
            getAllAggregatorResources,
            getAggregatorResources,
            getConfigAggregator,
            isConfigEnabled
        } = awsClient.createConfigServiceClient(mockCredentials, EU_WEST_1);

        describe('isConfigEnabled', () => {

            it('should return false when recorder is present and delivery channel is not', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                mockConfigClient
                    .on(DescribeConfigurationRecordersCommand)
                    .resolves({
                        ConfigurationRecorders: [
                            {name: 'default'}
                        ]
                    });

                mockConfigClient
                    .on(DescribeDeliveryChannelsCommand)
                    .resolves({
                        DeliveryChannels: []
                    });

                const actual = await isConfigEnabled();
                assert.strictEqual(actual, false);
            });

            it('should return false when delivery channel is present amd recorder is not', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                mockConfigClient
                    .on(DescribeConfigurationRecordersCommand)
                    .resolves({
                        ConfigurationRecorders: []
                    });

                mockConfigClient
                    .on(DescribeDeliveryChannelsCommand)
                    .resolves({
                        DeliveryChannels: [
                            {name: 'delivery-channel'}
                        ]
                    });

                const actual = await isConfigEnabled();
                assert.strictEqual(actual, false);
            });

            it('should return false when neither recorder or delivery channel are present', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                mockConfigClient
                    .on(DescribeConfigurationRecordersCommand)
                    .resolves({
                        ConfigurationRecorders: []
                    });

                mockConfigClient
                    .on(DescribeDeliveryChannelsCommand)
                    .resolves({
                        DeliveryChannels: []
                    });

                const actual = await isConfigEnabled();
                assert.strictEqual(actual, false);
            });

            it('should return true when recorder and delivery channel are present', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                mockConfigClient
                    .on(DescribeConfigurationRecordersCommand)
                    .resolves({
                        ConfigurationRecorders: [
                            {name: 'default'}
                        ]
                    });

                mockConfigClient
                    .on(DescribeDeliveryChannelsCommand)
                    .resolves({
                        DeliveryChannels: [
                            {name: 'delivery-channel'}
                        ]
                    });

                const actual = await isConfigEnabled();
                assert.strictEqual(actual, true);
            });

        });

        describe('getAllAggregatorResources', () => {

            it('should get resources from Config aggregator', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                const resources = {
                    configAggregator: {
                        Results: [
                            JSON.stringify({arn: 'resourceArn1', resourceType: 'AWS::EC2::Instance'}),
                            JSON.stringify({arn: 'resourceArn2', resourceType: 'AWS::IAM::Role'})
                        ],
                        NextToken: 'configAggregator-token'
                    },
                    'configAggregator-token': {
                        Results: [
                            JSON.stringify({arn: 'resourceArn3', resourceType: 'AWS::Lambda::Function'}),
                            JSON.stringify({arn: 'resourceArn4', resourceType: 'AWS::S3::Bucket'})
                        ]
                    }
                };

                mockConfigClient
                    .on(SelectAggregateResourceConfigCommand)
                    .callsFake(({ConfigurationAggregatorName, Expression, NextToken}) => {
                        const expectedExpression =
                            'SELECT *, configuration, configurationItemStatus, relationships, supplementaryConfiguration, tags';

                        assert.strictEqual(
                            Expression.replace(/\s+/g, ' ').trim(), expectedExpression
                        );

                        if(NextToken != null) return resources[NextToken];
                        return resources[ConfigurationAggregatorName];
                    });

                const actual = await getAllAggregatorResources(
                    'configAggregator', {
                        excludes: {
                            resourceTypes: []
                        }
                    });

                assert.deepEqual(actual, [
                    {
                        arn: 'resourceArn1',
                        resourceType: 'AWS::EC2::Instance'
                    },
                    {
                        arn: 'resourceArn2',
                        resourceType: 'AWS::IAM::Role'
                    },
                    {
                        arn: 'resourceArn3',
                        resourceType: 'AWS::Lambda::Function'
                    },
                    {
                        arn: 'resourceArn4',
                        resourceType: 'AWS::S3::Bucket'
                    }
                ]);
            });

            // This test will be re-enabled when https://github.com/m-radzikowski/aws-sdk-client-mock/issues/205 is
            // resolved.
            it.skip('should retry getting resources if there is an error', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                mockConfigClient
                    .on(SelectAggregateResourceConfigCommand)
                    .rejectsOnce('reject')
                    .resolvesOnce({
                        Results: [
                            JSON.stringify({arn: 'resourceArn1', resourceType: 'AWS::EC2::Instance'}),
                            JSON.stringify({arn: 'resourceArn2', resourceType: 'AWS::IAM::Role'})
                        ]
                    })

                const actual = await getAllAggregatorResources(
                    'configAggregator', {
                        excludes: {
                            resourceTypes: []
                        }
                    });

                assert.deepEqual(actual, [
                    {
                        arn: 'resourceArn1',
                        resourceType: 'AWS::EC2::Instance'
                    },
                    {
                        arn: 'resourceArn2',
                        resourceType: 'AWS::IAM::Role'
                    }
                ]);
            });

            it('should filter by resource type when getting resources from Config aggregator', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                const resources = {
                    configAggregator: {
                        Results: [
                            JSON.stringify({arn: 'resourceArn1', resourceType: 'AWS::EC2::Instance'}),
                            JSON.stringify({arn: 'resourceArn2', resourceType: 'AWS::IAM::Role'})
                        ],
                        NextToken: 'configAggregator-token'
                    },
                    'configAggregator-token': {
                        Results: [
                            JSON.stringify({arn: 'resourceArn3', resourceType: 'AWS::Lambda::Function'}),
                            JSON.stringify({arn: 'resourceArn4', resourceType: 'AWS::S3::Bucket'})
                        ]
                    }
                };

                mockConfigClient
                    .on(SelectAggregateResourceConfigCommand)
                    .callsFake(({ConfigurationAggregatorName, Expression, NextToken}) => {
                        const expectedExpression =
                            `SELECT *, configuration, configurationItemStatus, relationships, supplementaryConfiguration, tags WHERE resourceType NOT IN ('AWS::RDS:DbInstance','AWS::EC2::VPC')`;

                        assert.strictEqual(
                            Expression.replace(/\s+/g, ' ').trim(), expectedExpression
                        );

                        if(NextToken != null) return resources[NextToken];
                        return resources[ConfigurationAggregatorName];
                    });

                const actual = await getAllAggregatorResources(
                    'configAggregator', {
                        excludes: {
                            resourceTypes: ['AWS::RDS:DbInstance', 'AWS::EC2::VPC']
                        }
                    });

                assert.deepEqual(actual, [
                    {
                        arn: 'resourceArn1',
                        resourceType: 'AWS::EC2::Instance'
                    },
                    {
                        arn: 'resourceArn2',
                        resourceType: 'AWS::IAM::Role'
                    },
                    {
                        arn: 'resourceArn3',
                        resourceType: 'AWS::Lambda::Function'
                    },
                    {
                        arn: 'resourceArn4',
                        resourceType: 'AWS::S3::Bucket'
                    }
                ]);
            });

        });

        describe('getAggregatorResources', () => {

            it('should get resources for specific resource types', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                const resourcesList = {
                    'AWS::EC2:instance': {
                        ResourceIdentifiers: [
                            {ResourceId: 'ResourceId1'},
                            {ResourceId: 'ResourceId2'}
                        ],
                        NextToken: 'AWS::EC2:instance-token'
                    },
                    'AWS::EC2:instance-token': {
                        ResourceIdentifiers: [
                            {ResourceId: 'ResourceId3'},
                            {ResourceId: 'ResourceId4'}
                        ]
                    }
                }

                mockConfigClient
                    .on(ListAggregateDiscoveredResourcesCommand)
                    .callsFake(({ResourceType, NextToken}) => {
                        if(NextToken != null) return resourcesList[NextToken];
                        return resourcesList[ResourceType];
                    });

                const resources = {
                    ResourceId1: {Arn: 'ResourceArn1'},
                    ResourceId2: {Arn: 'ResourceArn2'},
                    ResourceId3: {Arn: 'ResourceArn3'},
                    ResourceId4: {Arn: 'ResourceArn4'},
                };

                mockConfigClient
                    .on(BatchGetAggregateResourceConfigCommand)
                    .callsFake(({ResourceIdentifiers}) => {
                        return {
                            BaseConfigurationItems: ResourceIdentifiers.map(({ResourceId}) => {
                                return resources[ResourceId];
                            })
                        };
                    });

                const actual = await getAggregatorResources('aggregatorName', 'AWS::EC2:instance');

                assert.deepEqual(actual, [
                    {
                        Arn: 'ResourceArn1'
                    },
                    {
                        Arn: 'ResourceArn2'
                    },
                    {
                        Arn: 'ResourceArn3'
                    },
                    {
                        Arn: 'ResourceArn4'
                    }
                ]);
            });

        });

        describe('getConfigAggregator', () => {

            it('should get config aggregator', async () => {
                const mockConfigClient = mockClient(ConfigServiceClient);

                mockConfigClient
                    .on(DescribeConfigurationAggregatorsCommand)
                    .resolves({
                        ConfigurationAggregators: [{
                            ConfigurationAggregatorName: 'configAggregatorName'
                        }]
                    });

                const actual = await getConfigAggregator('configAggregatorName');

                assert.deepEqual(actual, {ConfigurationAggregatorName: 'configAggregatorName'});
            });

        });
    });

    describe('dynamoDBStreamsClient', () => {
        const {
            describeStream
        } = awsClient.createDynamoDBStreamsClient(mockCredentials, EU_WEST_1);

        describe('describeStream', () => {

            it('should get stream details', async () => {
                const mockDynamoDBStreamsClient = mockClient(DynamoDBStreamsClient);

                mockDynamoDBStreamsClient
                    .on(DescribeStreamCommand)
                    .resolves({
                        StreamDescription: {
                            StreamArn: 'streamArn1'
                        }
                    });

                const actual = await describeStream('streamArn1');

                assert.deepEqual(actual, {
                    StreamArn: 'streamArn1'
                });
            });

        });
    });

    describe('ec2Client', () => {
        const {
            getAllRegions,
            getNatGateways,
            getAllSpotFleetRequests,
            getAllSpotInstanceRequests,
            getAllTransitGatewayAttachments
        } = awsClient.createEc2Client(mockCredentials, EU_WEST_1);

        describe('getAllRegions', () => {

            it('should get all regions', async () => {
                const mockEc2Client = mockClient(EC2Client);

                mockEc2Client
                    .on(DescribeRegionsCommand)
                    .resolves({
                        Regions: [
                            {RegionName: 'eu-west-1'},
                            {RegionName: 'eu-west-2'},
                            {RegionName: 'us-east-1'}
                        ]
                    });

                const actual = await getAllRegions();

                assert.deepEqual(actual, [
                    {
                        name: 'eu-west-1'
                    },
                    {
                        name: 'eu-west-2'
                    },
                    {
                        name: 'us-east-1'
                    }
                ]);
            });

        });

        describe('getNatGateway', () => {

            it('should get nat gateways for a specific vpc', async () => {
                const mockEc2Client = mockClient(EC2Client);

                const vpcNatGateways = {
                    'vpc-test123': {
                        NatGateways: [
                            {
                                NatGatewayId: 'nat-12345678',
                                VpcId: 'vpc-test123',
                                State: 'available',
                                SubnetId: 'subnet-1a2b3c4d'
                            },
                            {
                                NatGatewayId: 'nat-87654321',
                                VpcId: 'vpc-test123',
                                State: 'available',
                                SubnetId: 'subnet-5e6f7g8h'
                            }
                        ]
                    }
                };

                mockEc2Client
                    .on(DescribeNatGatewaysCommand)
                    .callsFake((params) => {
                        const vpcId = params.Filter.find(filter =>
                            filter.Name === 'vpc-id'
                        )?.Values[0];

                        return vpcNatGateways[vpcId] ?? { NatGateways: [] };
                    });

                const actual = await getNatGateways('vpc-test123');
                assert.deepEqual(actual, vpcNatGateways['vpc-test123'].NatGateways);
            });

        });

        describe('getAllSpotFleetRequests', () => {

            it('should get all spot fleet requests', async () => {
                const mockEc2Client = mockClient(EC2Client);

                const spotFleets = {
                    firstPage: {
                        SpotFleetRequestConfigs: [
                            {SpotFleetRequestId: 'sfr-uuid1'},
                            {SpotFleetRequestId: 'sfr-uuid2'}
                        ],
                        NextToken: 'spotFleetRequest-token'
                    },
                    'spotFleetRequest-token': {
                        SpotFleetRequestConfigs: [
                            {SpotFleetRequestId: 'sfr-uuid3'},
                            {SpotFleetRequestId: 'sfr-uuid4'}
                        ]
                    }
                }

                mockEc2Client
                    .on(DescribeSpotFleetRequestsCommand)
                    .callsFake(({NextToken}) => {
                        if(NextToken != null) return spotFleets[NextToken];
                        return spotFleets.firstPage;
                    });

                const actual = await getAllSpotFleetRequests();

                assert.deepEqual(actual, [
                    {SpotFleetRequestId: 'sfr-uuid1'},
                    {SpotFleetRequestId: 'sfr-uuid2'},
                    {SpotFleetRequestId: 'sfr-uuid3'},
                    {SpotFleetRequestId: 'sfr-uuid4'}
                ]);
            });

        });

        describe('getAllSpotInstanceRequests', () => {

            it('should get all spot instance requests', async () => {
                const mockEc2Client = mockClient(EC2Client);

                const spotInstances = {
                    firstPage: {
                        SpotInstanceRequests: [
                            {SpotInstanceRequestId: 'sfi-1111111'},
                            {SpotInstanceRequestId: 'sfi-2222222'}
                        ],
                        NextToken: 'SpotInstanceRequests-token'
                    },
                    'SpotInstanceRequests-token': {
                        SpotInstanceRequests: [
                            {SpotInstanceRequestId: 'sfi-3333333'},
                            {SpotInstanceRequestId: 'sfi-4444444'}
                        ]
                    }
                }

                mockEc2Client
                    .on(DescribeSpotInstanceRequestsCommand)
                    .callsFake(({NextToken}) => {
                        if(NextToken != null) return spotInstances[NextToken];
                        return spotInstances.firstPage;
                    });

                const actual = await getAllSpotInstanceRequests();

                assert.deepEqual(actual, [
                    {
                        SpotInstanceRequestId: 'sfi-1111111'
                    },
                    {
                        SpotInstanceRequestId: 'sfi-2222222'
                    },
                    {
                        SpotInstanceRequestId: 'sfi-3333333'
                    },
                    {
                        SpotInstanceRequestId: 'sfi-4444444'
                    }
                ]);
            });

        });

        describe('getAllTransitGatewayAttachments', () => {

            it('should get all transit gateway attachments', async () => {
                const mockEc2Client = mockClient(EC2Client);

                const attachments = {
                    firstPage: {
                        TransitGatewayAttachments: [
                            {TransitGatewayId: 'tgw-111111111111', ResourceType: 'vpc'},
                            {TransitGatewayId: 'tgw-222222222222', ResourceType: 'direct-connect-gateway'}
                        ],
                        NextToken: 'attachments-token'
                    },
                    'attachments-token': {
                        TransitGatewayAttachments: [
                            {TransitGatewayId: 'tgw-333333333333', ResourceType: 'vpc'},
                            {TransitGatewayId: 'tgw-444444444444', ResourceType: 'direct-connect-gateway'}
                        ]
                    }
                };

                mockEc2Client
                    .on(DescribeTransitGatewayAttachmentsCommand)
                    .callsFake(({NextToken}) => {
                        if(NextToken != null) return attachments[NextToken];
                        return attachments.firstPage;
                    });

                const actual = await getAllTransitGatewayAttachments();

                assert.deepEqual(actual, [
                    {
                        TransitGatewayId: 'tgw-111111111111',
                        ResourceType: 'vpc'
                    },
                    {
                        TransitGatewayId: 'tgw-222222222222',
                        ResourceType: 'direct-connect-gateway'
                    },
                    {
                        TransitGatewayId: 'tgw-333333333333',
                        ResourceType: 'vpc'
                    },
                    {
                        TransitGatewayId: 'tgw-444444444444',
                        ResourceType: 'direct-connect-gateway'
                    }
                ]);
            });

            it('should get filtered list of transit gateway attachments', async () => {
                const mockEc2Client = mockClient(EC2Client);

                const attachments = {
                    vpc: {
                        TransitGatewayAttachments: [
                            {TransitGatewayId: 'tgw-111111111111', ResourceType: 'vpc'},
                            {TransitGatewayId: 'tgw-222222222222', ResourceType: 'vpc'}
                        ]
                    }
                };

                mockEc2Client
                    .on(DescribeTransitGatewayAttachmentsCommand)
                    .callsFake(({Filters}) => {
                        return attachments[Filters[0].Values[0]];
                    });

                const actual = await getAllTransitGatewayAttachments([{Name: 'resource-type', Values: ['vpc']}]);

                assert.deepEqual(actual, [
                    {
                        TransitGatewayId: 'tgw-111111111111',
                        ResourceType: 'vpc'
                    },
                    {
                        TransitGatewayId: 'tgw-222222222222',
                        ResourceType: 'vpc'
                    }
                ]);
            });

        });

    });

    describe('ecsClient', () => {
        const {
            getAllClusterInstances,
            getAllClusterTasks,
            getAllServiceTasks
        } = awsClient.createEcsClient(mockCredentials, EU_WEST_1);

        describe('getAllClusterInstances', () => {

            it('should get all EC2 instances associated with cluster', async () => {
                const mockEcsClient = mockClient(ECSClient);

                const instanceArns = {
                    cluster: {
                        containerInstanceArns: [
                            'containerInstanceArn1',
                            'containerInstanceArn2'
                        ],
                        nextToken: 'clusterToken'
                    },
                    clusterToken: {
                        containerInstanceArns: [
                            'containerInstanceArn3',
                            'containerInstanceArn4'
                        ]
                    }
                };

                mockEcsClient
                    .on(ListContainerInstancesCommand)
                    .callsFake(({cluster, nextToken} ) => {
                        if(nextToken != null) return instanceArns[nextToken];
                        return instanceArns[cluster];
                    });

                const instances = {
                    'containerInstanceArn1': {ec2InstanceId: 'i-1111111111'},
                    'containerInstanceArn2': {ec2InstanceId: 'i-2222222222'},
                    'containerInstanceArn3': {ec2InstanceId: 'i-3333333333'},
                    'containerInstanceArn4': {ec2InstanceId: 'i-4444444444'},
                }

                mockEcsClient
                    .on(DescribeContainerInstancesCommand)
                    .callsFake(({containerInstances}) => {
                        return {
                            containerInstances: containerInstances.map(arn => instances[arn])
                        };
                    });

                const actual = await getAllClusterInstances('cluster');

                assert.deepEqual(actual, [
                    'i-1111111111',
                    'i-2222222222',
                    'i-3333333333',
                    'i-4444444444'
                ]);
            });

        });

        describe('getAllClusterTasks', () => {

            it('should get all tasks running in a cluster', async () => {
                const mockEcsClient = mockClient(ECSClient);

                const taskArns = {
                    cluster: {
                        taskArns: [
                            'taskArn1',
                            'taskArn2'
                        ],
                        nextToken: 'taskToken'
                    },
                    taskToken: {
                        taskArns: [
                            'taskArn3',
                            'taskArn4'
                        ]
                    }
                };

                mockEcsClient
                    .on(ListTasksCommand)
                    .callsFake((input) => {
                        const {cluster, nextToken} = input;
                        if(nextToken != null) return taskArns[nextToken];
                        return taskArns[cluster];
                    });

                const tasksObj = {
                    taskArn1: {taskArn: 'taskArn1'},
                    taskArn2: {taskArn: 'taskArn2'},
                    taskArn3: {taskArn: 'taskArn3'},
                    taskArn4: {taskArn: 'taskArn4'}
                }

                mockEcsClient
                    .on(DescribeTasksCommand)
                    .callsFake(({tasks}) => {
                        return {
                            tasks: tasks.map(arn => tasksObj[arn])
                        };
                    });

                const actual = await getAllClusterTasks('cluster');

                assert.deepEqual(actual, [
                    {
                        taskArn: 'taskArn1'
                    },
                    {
                        taskArn: 'taskArn2'
                    },
                    {
                        taskArn: 'taskArn3'
                    },
                    {
                        taskArn: 'taskArn4'
                    }
                ])
            });
        });

        describe('getAllServiceTasks', () => {

            it('should get all tasks associated with a service', async () => {
                const mockEcsClient = mockClient(ECSClient);

                const taskArns = {
                    'cluster-service': {
                        taskArns: [
                            'taskArn1',
                            'taskArn2'
                        ],
                        nextToken: 'taskToken'
                    },
                    taskToken: {
                        taskArns: [
                            'taskArn3',
                            'taskArn4'
                        ]
                    }
                };

                mockEcsClient
                    .on(ListTasksCommand)
                    .callsFake((input) => {
                        const {cluster, serviceName, nextToken} = input;
                        if(nextToken != null) return taskArns[nextToken];
                        return taskArns[`${cluster}-${serviceName}`];
                    });

                const tasksObj = {
                    taskArn1: {taskArn: 'serviceTaskArn1'},
                    taskArn2: {taskArn: 'serviceTaskArn2'},
                    taskArn3: {taskArn: 'serviceTaskArn3'},
                    taskArn4: {taskArn: 'serviceTaskArn4'}
                }

                mockEcsClient
                    .on(DescribeTasksCommand)
                    .callsFake(({tasks}) => {
                        return {
                            tasks: tasks.map(arn => tasksObj[arn])
                        };
                    });

                const actual = await getAllServiceTasks('cluster', 'service');

                assert.deepEqual(actual, [
                    {
                        taskArn: 'serviceTaskArn1'
                    },
                    {
                        taskArn: 'serviceTaskArn2'
                    },
                    {
                        taskArn: 'serviceTaskArn3'
                    },
                    {
                        taskArn: 'serviceTaskArn4'
                    }
                ])
            });
        });

    });

    describe('elbClient', () => {
        const {
            getLoadBalancerInstances
        } = awsClient.createElbClient(mockCredentials, EU_WEST_1);

        describe('getLoadBalancerInstances', () => {

            it('should handle missing Instances field', async () => {
                const mockElbClient = mockClient(ElasticLoadBalancingClient);

                const elb = {
                    loadBalancer: {
                        LoadBalancerName: 'loadBalancer',
                    }
                }

                mockElbClient
                    .on(DescribeLoadBalancersCommand)
                    .callsFake(({LoadBalancerNames}) => {
                        return {
                            LoadBalancerDescriptions: [
                                elb[LoadBalancerNames[0]]
                            ]
                        }
                    });

                const actual = await getLoadBalancerInstances('loadBalancer');

                assert.deepEqual(actual, []);
            });

            it('should get EC2 instances associated with ELB', async () => {
                const mockElbClient = mockClient(ElasticLoadBalancingClient);

                const elb = {
                    loadBalancer: {
                        LoadBalancerName: 'loadBalancer',
                        Instances: [
                            {InstanceId: 'i-1111111111'},
                            {InstanceId: 'i-2222222222'},
                        ]
                    }
                }

                mockElbClient
                    .on(DescribeLoadBalancersCommand)
                    .callsFake(({LoadBalancerNames}) => {
                        return {
                            LoadBalancerDescriptions: [
                                elb[LoadBalancerNames[0]]
                            ]
                        }
                    });

                const actual = await getLoadBalancerInstances('loadBalancer');

                assert.deepEqual(actual, [
                    'i-1111111111',
                    'i-2222222222'
                ]);
            });

        });
    });

    describe('elbClient', () => {
        const {
            describeTargetHealth,
            getAllTargetGroups
        } = awsClient.createElbV2Client(mockCredentials, EU_WEST_1);

        describe('describeTargetHealth', () => {

            it('should get target health', async () => {
                const mockElbV2Client = mockClient(ElasticLoadBalancingV2Client);

                const targetHealth = {
                    targetGroupArn: {
                        TargetHealthDescriptions: [
                            {Target: {ID: 'i-111111111'}},
                            {Target: {ID: 'i-222222222'}},
                            {Target: {ID: 'i-333333333'}},
                        ]
                    }
                };

                mockElbV2Client
                    .on(DescribeTargetHealthCommand)
                    .callsFake(input => {
                        const {TargetGroupArn} = input;
                        return targetHealth[TargetGroupArn];
                    });

                const actual = await describeTargetHealth('targetGroupArn');

                assert.deepEqual(actual, [
                    {Target: {ID: 'i-111111111'}},
                    {Target: {ID: 'i-222222222'}},
                    {Target: {ID: 'i-333333333'}},
                ]);
            });

        });

        describe('getAllTargetGroups', () => {

            it('should get all target groups', async () => {
                const mockElbV2Client = mockClient(ElasticLoadBalancingV2Client);

                const targetGroups = {
                    firstPage: {
                        TargetGroups: [
                            {TargetGroupArn: 'targetGroupArn1'},
                            {TargetGroupArn: 'targetGroupArn2'}
                        ],
                        NextMarker: 'TargetGroups-marker'
                    },
                    'TargetGroups-marker': {
                        TargetGroups: [
                            {TargetGroupArn: 'targetGroupArn3'},
                            {TargetGroupArn: 'targetGroupArn4'}
                        ]
                    }
                };

                mockElbV2Client
                    .on(DescribeTargetGroupsCommand)
                    .callsFake(({TargetGroups, Marker}) => {
                        if(Marker != null) return targetGroups[Marker];
                        return targetGroups.firstPage;
                    });

                const actual = await getAllTargetGroups();

                assert.deepEqual(actual, [
                    {TargetGroupArn: 'targetGroupArn1'},
                    {TargetGroupArn: 'targetGroupArn2'},
                    {TargetGroupArn: 'targetGroupArn3'},
                    {TargetGroupArn: 'targetGroupArn4'}
                ]);
            });

        });

    });

    describe('eksClient', () => {
        const {
            listNodeGroups
        } = awsClient.createEksClient(mockCredentials, EU_WEST_1);

        describe('listNodeGroups', () => {

            it('should list all node groups in cluster', async () => {
                const mockEksClient = mockClient(EKSClient);

                const nodeGroupsList = {
                    'eksCluster': {
                        nodegroups: [
                            'nodegroup1',
                            'nodegroup2'
                        ],
                        nextToken: 'nodegroups-token'
                    },
                    'nodegroups-token': {
                        nodegroups: [
                            'nodegroup3',
                            'nodegroup4'
                        ]
                    }
                }

                mockEksClient
                    .on(ListNodegroupsCommand)
                    .callsFake(({clusterName, nextToken}) => {
                        if(nextToken != null) return nodeGroupsList[nextToken];
                        return nodeGroupsList[clusterName];
                    });

                const nodeGroups = {
                    nodegroup1: {nodegroupArn: 'nodegroupArn1'},
                    nodegroup2: {nodegroupArn: 'nodegroupArn2'},
                    nodegroup3: {nodegroupArn: 'nodegroupArn3'},
                    nodegroup4: {nodegroupArn: 'nodegroupArn4'},
                }

                mockEksClient
                    .on(DescribeNodegroupCommand)
                    .callsFake(({nodegroupName}) => {
                        return {
                            nodegroup: nodeGroups[nodegroupName]
                        };
                    })

                const actual = await listNodeGroups('eksCluster');

                assert.deepEqual(actual, [
                    {
                        nodegroupArn: 'nodegroupArn1'
                    },
                    {
                        nodegroupArn: 'nodegroupArn2'
                    },
                    {
                        nodegroupArn: 'nodegroupArn3'
                    },
                    {
                        nodegroupArn: 'nodegroupArn4'
                    }
                ]);
            });

        });
    });

    describe('appSyncClient', () => {
        describe('listDataSources', ()=> {
            const {
                listDataSources
            } = awsClient.createAppSyncClient(mockCredentials, EU_WEST_1);

            it("should list data sources", async ()=> {
                const mockAppSyncClient = mockClient(AppSyncClient);

                const dataSources = {
                    first : {
                        dataSources: [{
                            dataSourceArn: "dataSourceArn1",
                        }],
                        nextToken: "second"
                    },
                    second: {
                        dataSources: [{
                            dataSourceArn: "dataSourceArn2",
                        }],
                        nextToken: "third"
                    },
                    third: {
                        dataSources: [{
                            dataSourceArn: "dataSourceArn3",
                        }],
                        nextToken: null
                    }


                }

                mockAppSyncClient.on(ListDataSourcesCommand).callsFake(({nextToken}) => {

                    if(nextToken != null) return dataSources[nextToken];
                    return dataSources.first;
                })

                const actual = await listDataSources("fake-api")

                assert.deepEqual(actual, [{ dataSourceArn: "dataSourceArn1"}, {dataSourceArn:"dataSourceArn2"}, {dataSourceArn:"dataSourceArn3"}])
            })
        })

        describe('listResolvers', () => {
            const {
                listResolvers
            } = awsClient.createAppSyncClient(mockCredentials, EU_WEST_1);

            it("should list resolvers", async ()=> {
                const mockAppSyncClient = mockClient(AppSyncClient);
                const resolvers = {
                    first : {
                        resolvers: [{
                            resolverArn: "resolverArn1",
                        }],
                        nextToken: "second"
                    },
                    second: {
                        resolvers: [{
                            resolverArn: "resolverArn2",
                        }],
                        nextToken: "third"
                    },
                    third: {
                        resolvers: [{
                            resolverArn: "resolverArn3",
                        }],
                        nextToken: null
                    }
                }

                mockAppSyncClient.on(ListResolversCommand).callsFake(({nextToken}) => {
                    if(nextToken != null) return resolvers[nextToken];
                    return resolvers.first;
                })
                const actual = await listResolvers("fake-api", "Query")
                assert.deepEqual(actual, [{ resolverArn: "resolverArn1"}, { resolverArn: "resolverArn2"}, { resolverArn: "resolverArn3"}])
            })
        })

    })


    describe('iamClient', () => {
        const {
            getAllAttachedAwsManagedPolices
        } = awsClient.createIamClient(mockCredentials, EU_WEST_1);

        describe('getAllAttachedAwsManagedPolices', () => {

            it('should get all attached polices', async () => {
                const mockIamClient = mockClient(IAMClient);

                const attachedAwsManagedPolicies = {
                    'AWS-true': {
                        Policies: [
                            {Arn: 'policyArn1'},
                            {Arn: 'policyArn2'}
                        ],
                        Marker: 'policiesMarker'
                    },
                    policiesMarker: {
                        Policies: [
                            {Arn: 'policyArn3'},
                            {Arn: 'policyArn4'}
                        ]
                    }
                };

                mockIamClient
                    .on(ListPoliciesCommand)
                    .callsFake((input) => {
                        const {OnlyAttached, Scope, Marker} = input;
                        if(Marker != null) return attachedAwsManagedPolicies[Marker];
                        return attachedAwsManagedPolicies[`${Scope}-${OnlyAttached}`];
                    });

                const actual = await getAllAttachedAwsManagedPolices();

                assert.deepEqual(actual, [
                    {
                        Arn: 'policyArn1'
                    },
                    {
                        Arn: 'policyArn2'
                    },
                    {
                        Arn: 'policyArn3'
                    },
                    {
                        Arn: 'policyArn4'
                    }
                ]);
            });

        });
    });

    describe('lambdaClient', () => {
        const {
            getAllFunctions,
            listEventSourceMappings
        } = awsClient.createLambdaClient(mockCredentials, EU_WEST_1);

        describe('getAllFunctions', () => {

            it('should get all functions', async () => {
                const mockLambdaClient = mockClient(LambdaClient);

                const functions = {
                    firstPage: {
                        Functions: [
                            {FunctionName: 'Function1'},
                            {FunctionName: 'Function2'},
                        ],
                        NextMarker: 'listFunctionsMarker'
                    },
                    listFunctionsMarker: {
                        Functions: [
                            {FunctionName: 'Function3'},
                            {FunctionName: 'Function4'}
                        ]
                    }
                }

                mockLambdaClient
                    .on(ListFunctionsCommand)
                    .callsFake(({Marker}) => {
                        if(Marker != null) return functions[Marker];
                        return functions.firstPage;
                    });

                const actual = await getAllFunctions();

                assert.deepEqual(actual, [
                    {
                        FunctionName: 'Function1'
                    },
                    {
                        FunctionName: 'Function2'
                    },
                    {
                        FunctionName: 'Function3'
                    },
                    {
                        FunctionName: 'Function4'
                    }
                ]);
            });

        });

        describe('listEventSourceMappings', () => {

            it('should get event source mappings for specific function', async () => {
                const mockLambdaClient = mockClient(LambdaClient);

                const mappings = {
                    functionArn: {
                        EventSourceMappings: [
                            {EventSourceArn: 'EventSourceArn1'},
                        ],
                        NextMarker: 'listEventSourceMappingsMarker'
                    },
                    listEventSourceMappingsMarker: {
                        EventSourceMappings: [
                            {EventSourceArn: 'EventSourceArn2'},
                        ]
                    }
                }

                mockLambdaClient
                    .on(ListEventSourceMappingsCommand)
                    .callsFake(({FunctionName, Marker}) => {
                        if(Marker != null) return mappings[Marker];
                        return mappings[FunctionName];
                    });

                const actual = await listEventSourceMappings('functionArn');

                assert.deepEqual(actual, [
                    {
                        EventSourceArn: 'EventSourceArn1'
                    },
                    {
                        EventSourceArn: 'EventSourceArn2'
                    }
                ]);
            });

            it('should get all event source mappings', async () => {
                const mockLambdaClient = mockClient(LambdaClient);

                const mappings = {
                    firstPage: {
                        EventSourceMappings: [
                            {EventSourceArn: 'EventSourceArn1'},
                            {EventSourceArn: 'EventSourceArn2'},
                        ],
                        NextMarker: 'listEventSourceMappingsMarker'
                    },
                    listEventSourceMappingsMarker: {
                        EventSourceMappings: [
                            {EventSourceArn: 'EventSourceArn3'},
                            {EventSourceArn: 'EventSourceArn4'}
                        ]
                    }
                }

                mockLambdaClient
                    .on(ListEventSourceMappingsCommand)
                    .callsFake(({Marker}) => {
                        if(Marker != null) return mappings[Marker];
                        return mappings.firstPage;
                    });

                const actual = await listEventSourceMappings();

                assert.deepEqual(actual, [
                    {
                        EventSourceArn: 'EventSourceArn1'
                    },
                    {
                        EventSourceArn: 'EventSourceArn2'
                    },
                    {
                        EventSourceArn: 'EventSourceArn3'
                    },
                    {
                        EventSourceArn: 'EventSourceArn4'
                    }
                ]);
            });

        });
    });

    describe('mediaConnectClient', () => {
        const {getAllFlows} = awsClient.createMediaConnectClient(mockCredentials, EU_WEST_1);

        describe('getAllFlows', () => {

            it('should get all flows in paginated operation', async () => {
                const mockMediaConnectClient = mockClient(MediaConnectClient);

                const flows = {
                    firstPage: {
                        Flows: [
                            {FlowArn: 'FlowArn1'},
                            {FlowArn: 'FlowArn2'},
                        ],
                        NextToken: 'flowNextToken'
                    },
                    flowNextToken: {
                        Flows: [
                            {FlowArn: 'FlowArn3'},
                            {FlowArn: 'FlowArn4'}
                        ]
                    }
                };

                mockMediaConnectClient
                    .on(ListFlowsCommand)
                    .callsFake(({NextToken}) => {
                        if(NextToken != null) return flows[NextToken];
                        return flows.firstPage;
                    });

                const actual = await getAllFlows();

                assert.deepEqual(actual, [
                    {FlowArn: 'FlowArn1'},
                    {FlowArn: 'FlowArn2'},
                    {FlowArn: 'FlowArn3'},
                    {FlowArn: 'FlowArn4'}
                ]);
            });

        });

    });

    describe('openSearchClient', () => {
        const {getAllOpenSearchDomains} = awsClient.createOpenSearchClient(mockCredentials, EU_WEST_1);

        describe('getAllOpenSearchDomains', () => {

            it('should get OpenSearch domains', async () => {
                const mockOpenSearchClient = mockClient(OpenSearchClient);

                const domains = {
                    'opensearchdomai-abcdefgh1': {
                        ARN: 'domainArn1'
                    },
                    'opensearchdomai-abcdefgh2': {
                        ARN: 'domainArn2'
                    },
                    'opensearchdomai-abcdefgh3': {
                        ARN: 'domainArn3'
                    },
                    'opensearchdomai-abcdefgh4': {
                        ARN: 'domainArn4'
                    },
                    'opensearchdomai-abcdefgh5': {
                        ARN: 'domainArn5'
                    },
                    'opensearchdomai-abcdefgh6': {
                        ARN: 'domainArn6'
                    },
                    'opensearchdomai-abcdefgh7': {
                        ARN: 'domainArn7'
                    },
                    'opensearchdomai-abcdefgh8': {
                        ARN: 'domainArn8'
                    },
                    'opensearchdomai-abcdefgh9': {
                        ARN: 'domainArn9'
                    }
                }

                mockOpenSearchClient
                    .on(ListDomainNamesCommand, {EngineType: OPENSEARCH})
                    .resolves({
                        DomainNames: Object.keys(domains).map(DomainName => ({DomainName}))
                    });

                mockOpenSearchClient
                    .on(DescribeDomainsCommand)
                    .callsFake(({DomainNames}) => {
                        return {
                            DomainStatusList: DomainNames.map(domainName => domains[domainName])
                        };
                    });

                const actual = await getAllOpenSearchDomains();

                assert.deepEqual(actual, [
                    {
                        'ARN': 'domainArn1'
                    },
                    {
                        'ARN': 'domainArn2'
                    },
                    {
                        'ARN': 'domainArn3'
                    },
                    {
                        'ARN': 'domainArn4'
                    },
                    {
                        'ARN': 'domainArn5'
                    },
                    {
                        'ARN': 'domainArn6'
                    },
                    {
                        'ARN': 'domainArn7'
                    },
                    {
                        'ARN': 'domainArn8'
                    },
                    {
                        'ARN': 'domainArn9'
                    }
                ]);
            });

        });
    });

    describe('organizationsClient', () => {
        const {getAllActiveAccountsFromParent} = awsClient.createOrganizationsClient(mockCredentials, EU_WEST_1);

        describe('getAllActiveAccountsFromParent', () => {

            it('should get all accounts from root OU', async () => {
                const sandbox = sinon.createSandbox({
                    useFakeTimers: true
                });
                const mockOrganizationsClient = mockClient(OrganizationsClient, {sandbox});

                mockOrganizationsClient
                    .on(ListRootsCommand)
                    .resolves({
                        Roots: [
                            {
                                Id: 'r-xxxx',
                            }
                        ]
                    });

                mockOrganizationsClient
                    .on(DescribeOrganizationCommand)
                    .resolves({
                        Organization: {
                            MasterAccountId: 'xxxxxxxxxxxx'
                        }
                    });

                mockOrganizationsClient
                    .on(ListAccountsCommand)
                    .resolvesOnce({
                        Accounts: [
                            {Id: 'xxxxxxxxxxxx', Status: 'ACTIVE'},
                            {Id: 'yyyyyyyyyyyy', Status: 'ACTIVE'}
                        ],
                        NextToken: 'token'
                    })
                    .resolves({
                        Accounts: [
                            {Id: 'zzzzzzzzzzzz', Status: 'ACTIVE'},
                            {Id: 'inactive', Status: 'SUSPENDED'}
                        ],
                    });

                const actualP = getAllActiveAccountsFromParent('r-xxxx');

                await sandbox.clock.tickAsync(2000);

                assert.deepEqual(await actualP, [
                    {
                        Id: 'xxxxxxxxxxxx',
                        Status: 'ACTIVE',
                        isManagementAccount: true
                    },
                    {
                        Id: 'yyyyyyyyyyyy',
                        Status: 'ACTIVE'
                    },
                    {
                        Id: 'zzzzzzzzzzzz',
                        Status: 'ACTIVE'
                    }
                ]);

                sandbox.clock.restore();
            });

            it('should get all accounts from non-root OU', async () => {
                const sandbox = sinon.createSandbox({
                    useFakeTimers: true
                });
                const mockOrganizationsClient = mockClient(OrganizationsClient, {sandbox});

                mockOrganizationsClient
                    .on(ListRootsCommand)
                    .resolves({
                        Roots: [
                            {
                                Id: 'r-xxxx',
                            }
                        ]
                    });

                mockOrganizationsClient
                    .on(DescribeOrganizationCommand)
                    .resolves({
                        Organization: {
                            MasterAccountId: 'xxxxxxxxxxxx'
                        }
                    });

                const orgUnits = {
                    'ou-xxxx-1111111': {
                        OrganizationalUnits: [
                            {Id: 'ou-xxxx-2222222'},
                            {Id: 'ou-xxxx-3333333'},
                        ],
                        NextToken: 'ou-xxxx-1111111-token'
                    },
                    'ou-xxxx-1111111-token': {
                        OrganizationalUnits: [
                            {Id: 'ou-xxxx-4444444'}
                        ]
                    },
                    'ou-xxxx-2222222': {
                        OrganizationalUnits: [
                            {Id: 'ou-xxxx-5555555'}
                        ]
                    },
                    'ou-xxxx-3333333': {
                        OrganizationalUnits: []
                    },
                    'ou-xxxx-4444444': {
                        OrganizationalUnits: []
                    },
                    'ou-xxxx-5555555': {
                        OrganizationalUnits: [
                            {Id: 'ou-xxxx-6666666'}
                        ]
                    },
                    'ou-xxxx-6666666': {
                        OrganizationalUnits: []
                    },
                }

                mockOrganizationsClient
                    .on(ListOrganizationalUnitsForParentCommand)
                    .callsFake(({ParentId, NextToken}) => {
                        if(NextToken != null) return orgUnits[NextToken];
                        return orgUnits[ParentId];
                    });

                const orgUnitAccounts = {
                    'ou-xxxx-1111111': {
                        Accounts: [
                            {Id: 'aaaaaaaaaaaa', Status: 'ACTIVE'},
                            {Id: 'bbbbbbbbbbbb', Status: 'ACTIVE'},
                        ],
                        NextToken: 'ou-xxxx-1111111-token'
                    },
                    'ou-xxxx-1111111-token': {
                        Accounts: [
                            {Id: 'cccccccccccc', Status: 'ACTIVE'},
                            {Id: 'dddddddddddd', Status: 'SUSPENDED'},
                        ],
                    },
                    'ou-xxxx-2222222': {
                        Accounts: [
                            {Id: 'eeeeeeeeeeee', Status: 'ACTIVE'},
                            {Id: 'ffffffffffff', Status: 'ACTIVE'},
                        ]
                    },
                    'ou-xxxx-3333333': {
                        Accounts: [
                            {Id: 'gggggggggggg', Status: 'ACTIVE'},
                            {Id: 'hhhhhhhhhhhh', Status: 'ACTIVE'},
                        ]
                    },
                    'ou-xxxx-4444444': {
                        Accounts: [
                            {Id: 'iiiiiiiiiiii', Status: 'ACTIVE'}
                        ]
                    },
                    'ou-xxxx-5555555': {
                        Accounts: [
                            {Id: 'jjjjjjjjjjjj', Status: 'ACTIVE'},
                            {Id: 'kkkkkkkkkkkk', Status: 'SUSPENDED'},
                            {Id: 'llllllllllll', Status: 'PENDING_CLOSURE'}
                        ]
                    },
                    'ou-xxxx-6666666': {
                        Accounts: []
                    },
                };

                mockOrganizationsClient
                    .on(ListAccountsForParentCommand)
                    .callsFake(({ParentId, NextToken}) => {
                        if(NextToken != null) return orgUnitAccounts[NextToken];
                        if(ParentId != null) return orgUnitAccounts[ParentId];
                    });

                const actualP = getAllActiveAccountsFromParent('ou-xxxx-1111111');

                await sandbox.clock.tickAsync(30000);

                assert.deepEqual(await actualP, [
                    {
                        'Id': 'aaaaaaaaaaaa',
                        'Status': 'ACTIVE'
                    },
                    {
                        'Id': 'bbbbbbbbbbbb',
                        'Status': 'ACTIVE'
                    },
                    {
                        'Id': 'cccccccccccc',
                        'Status': 'ACTIVE'
                    },
                    {
                        'Id': 'eeeeeeeeeeee',
                        'Status': 'ACTIVE'
                    },
                    {
                        'Id': 'ffffffffffff',
                        'Status': 'ACTIVE'
                    },
                    {
                        'Id': 'gggggggggggg',
                        'Status': 'ACTIVE'
                    },
                    {
                        'Id': 'hhhhhhhhhhhh',
                        'Status': 'ACTIVE'
                    },
                    {
                        'Id': 'iiiiiiiiiiii',
                        'Status': 'ACTIVE'
                    },
                    {
                        'Id': 'jjjjjjjjjjjj',
                        'Status': 'ACTIVE'
                    }
                ]);

                sandbox.clock.restore();
            });

        });

    });

    describe('snsClient', () => {
        const {getAllSubscriptions} = awsClient.createSnsClient(mockCredentials, EU_WEST_1);

        describe('getAllSubscriptions', () => {

            it('should list all sns subscriptions', async () => {
                const mockSnsClient = mockClient(SNSClient);

                const snsSubscription = {
                    firstPage: {
                        Subscriptions: [
                            {SubscriptionArn: 'SubscriptionArn1'},
                            {SubscriptionArn: 'SubscriptionArn2'},
                        ],
                        NextToken: 'listSnsToken'
                    },
                    listSnsToken: {
                        Subscriptions: [
                            {SubscriptionArn: 'SubscriptionArn3'},
                            {SubscriptionArn: 'SubscriptionArn4'}
                        ]
                    }
                }

                mockSnsClient
                    .on(ListSubscriptionsCommand)
                    .callsFake(({NextToken}) => {
                        if(NextToken != null) return snsSubscription[NextToken];
                        return snsSubscription.firstPage;
                    });

                const actual = await getAllSubscriptions();
                assert.deepEqual(actual, [
                    {
                        SubscriptionArn: 'SubscriptionArn1'
                    },
                    {
                        SubscriptionArn: 'SubscriptionArn2'
                    },
                    {
                        SubscriptionArn: 'SubscriptionArn3'
                    },
                    {
                        SubscriptionArn: 'SubscriptionArn4'
                    }
                ]);
            });

        });
    });

    describe('stsClient', () => {
        const {
            getCredentials,
            getCurrentCredentials
        } = awsClient.createStsClient(mockCredentials, EU_WEST_1);

        describe('getAllAttachedAwsManagedPolices', () => {

            it('should get credentials for role', async () => {
                const mockStsClient = mockClient(STSClient);

                const credentials = {
                    role: {
                        Credentials: {
                            AccessKeyId: 'accessKeyId',
                            SecretAccessKey: 'secretAccessKey',
                            SessionToken: 'optionalSessionToken'
                        }
                    }
                };

                mockStsClient
                    .on(AssumeRoleCommand)
                    .callsFake(({RoleArn}) => {
                        return credentials[RoleArn];
                    });

                const actual = await getCredentials('role');

                assert.deepEqual(actual, {
                    accessKeyId: 'accessKeyId',
                    secretAccessKey: 'secretAccessKey',
                    sessionToken: 'optionalSessionToken'
                });
            });

            describe('getCurrentCredentials', () => {

                beforeAll(() => {
                    process.env.AWS_ACCESS_KEY_ID = 'accessKeyEnv';
                    process.env.AWS_SECRET_ACCESS_KEY = 'secretAccessKeyEnv';
                });

                afterAll(() => {
                    delete process.env.AWS_ACCESS_KEY_ID;
                    delete process.env.AWS_SECRET_ACCESS_KEY;
                });

                it('should get credentials for role', async () => {
                    const actual = await getCurrentCredentials();

                    assert.deepEqual(actual, {
                        accessKeyId: 'accessKeyEnv',
                        secretAccessKey: 'secretAccessKeyEnv'
                    });
                });

            });

        });
    });
});