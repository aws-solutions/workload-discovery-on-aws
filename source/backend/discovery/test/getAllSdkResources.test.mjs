// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import {
    AWS,
    AWS_IAM_AWS_MANAGED_POLICY,
    RESOURCE_DISCOVERED,
    NOT_APPLICABLE,
    GLOBAL,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    MULTIPLE_AVAILABILITY_ZONES,
    AWS_EC2_SPOT_FLEET,
    IS_ASSOCIATED_WITH,
    AWS_EC2_INSTANCE,
    AWS_EC2_SPOT,
    AWS_API_GATEWAY_RESOURCE,
    IS_CONTAINED_IN,
    AWS_API_GATEWAY_REST_API,
    AWS_API_GATEWAY_AUTHORIZER,
    AWS_DYNAMODB_STREAM,
    AWS_DYNAMODB_TABLE,
    AWS_ECS_TASK, AWS_ECS_SERVICE,
    AWS_EKS_NODE_GROUP,
    AWS_EKS_CLUSTER,
    AWS_IAM_INLINE_POLICY,
    AWS_IAM_ROLE,
    AWS_IAM_USER,
    AWS_API_GATEWAY_METHOD,
    GET,
    POST,
    NOT_FOUND_EXCEPTION,
    AWS_SQS_QUEUE,
    AWS_TAGS_TAG,
    AWS_OPENSEARCH_DOMAIN,
    AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION,
    AWS_APPSYNC_GRAPHQLAPI,
    AWS_APPSYNC_DATASOURCE,
    AWS_APPSYNC_RESOLVER, AWS_MEDIA_CONNECT_FLOW
} from '../src/lib/constants.mjs';
import * as sdkResources from '../src/lib/sdkResources/index.mjs';
import {generate} from "./generator.mjs";

const EU_WEST_2 = 'eu-west-2';
const EU_WEST_2_A = EU_WEST_2 + 'a';
const US_WEST_2 = 'us-west-2';

const ACCESS_KEY_X = 'accessKeyIdX';
const ACCESS_KEY_Z = 'accessKeyIdz';

const ACCOUNT_X = 'xxxxxxxxxxxx';
const ACCOUNT_Z = 'zzzzzzzzzzzz';

describe('getAllSdkResources', () => {

    const credentialsX = {accessKeyId: ACCESS_KEY_X, secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};
    const credentialsZ = {accessKeyId: ACCESS_KEY_Z, secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};

    const mockAwsClient = {
        createAppSyncClient(){
            return {
                listDataSources: async ()=> [],
                listResolvers: async ()=> [],
            }
        },
        createIamClient() {
            return {
                getAllAttachedAwsManagedPolices: async () => [],
            }
        },
        createElbV2Client() {
            return {
                describeTargetHealth: async arn => [],
                getAllTargetGroups: async arn => []
            }
        },
        createEc2Client() {
            return {
                getAllSpotInstanceRequests: async () => [],
                getAllSpotFleetRequests: async () => []
            }
        },
        createEcsClient() {
            return {
                getAllClusterInstances: async arn => [],
                getAllServiceTasks: async () => []
            }
        },
        createEksClient() {
            return {
                listNodeGroups: async arn => []
            }
        },
        createApiGatewayClient(accountId, credentials, region) {
            return {
                getResources: async () => [],
                getAuthorizers: async () => []
            }
        },
        createDynamoDBStreamsClient(credentials, region) {
            return {
                describeStream: async (streamArn) => [],
            }
        },
        createMediaConnectClient(credentials, region) {
            return {
                getAllFlows: async (streamArn) => [],
            }
        },
        createOpenSearchClient(credentials, region) {
            return {
                getAllOpenSearchDomains: async (streamArn) => []
            }
        },
        createServiceCatalogAppRegistryClient(credentials, region) {
            return {
                getAllApplications: async (streamArn) => []
            }
        }
    };

    describe('getAdditionalResources', () => {

        const getAllSdkResources = sdkResources.getAllSdkResources(new Map(
            [[
                ACCOUNT_X,
                {
                    credentials: credentialsX,
                    regions: [
                        'eu-west-2'
                    ]
                }
            ], [
                ACCOUNT_Z,
                {
                    credentials: credentialsZ,
                    regions: [
                        'us-west-2'
                    ]
                }
            ]]
        ));

        describe(AWS_IAM_AWS_MANAGED_POLICY, () => {

            it('should discover AWS managed policy resources', async () => {
                const {default: {euWest2, usWest2}} = await import('./fixtures/additionalResources/iam/awsManagedPolicy.json', {with: {type: 'json' }});

                const mockIamClient = {
                    createIamClient(credentials, region) {
                        return {
                            async getAllAttachedAwsManagedPolices() {
                                if(credentials.accessKeyId === ACCESS_KEY_X) {
                                    return euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z) {
                                    return usWest2;
                                }
                            }
                        };
                    }
                }

                const arn1 = 'managedPolicyArn1'
                const arn2 = 'managedPolicyArn2'

                const actual = await getAllSdkResources({...mockAwsClient, ...mockIamClient}, []);

                const actualRole1 = actual.find(x => x.arn === arn1);
                const actualRole2 = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualRole1, {
                    id: arn1,
                    accountId: AWS.toLowerCase(),
                    arn: arn1,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {
                        Arn: arn1,
                        PolicyName: 'policyName1'
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: 'policyName1',
                    resourceType: AWS_IAM_AWS_MANAGED_POLICY,
                    tags: [],
                    relationships: []
                });

                assert.deepEqual(actualRole2, {
                    id: arn2,
                    accountId: AWS.toLowerCase(),
                    arn: arn2,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {
                        Arn: arn2,
                        PolicyName: 'policyName2'
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: 'policyName2',
                    resourceType: AWS_IAM_AWS_MANAGED_POLICY,
                    tags: [],
                    relationships: []
                });
            });

            it('should discover AWS managed policy resources when some regions fail', async () => {
                const {default: {euWest2}} = await import('./fixtures/additionalResources/iam/awsManagedPolicy.json', {with: {type: 'json' }});

                const mockIamClient = {
                    createIamClient(credentials, region) {
                        return {
                            async getAllAttachedAwsManagedPolices() {
                                if(credentials.accessKeyId === ACCESS_KEY_X) {
                                    return euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z) {
                                    throw new Error();
                                }
                            }
                        };
                    }
                }

                const arn1 = 'managedPolicyArn1'

                const actual = await getAllSdkResources({...mockAwsClient, ...mockIamClient}, []);

                const actualRole1 = actual.find(x => x.arn === arn1);

                assert.strictEqual(actual.length, 1);
                assert.deepEqual(actualRole1, {
                    id: arn1,
                    accountId: AWS.toLowerCase(),
                    arn: arn1,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {
                        Arn: arn1,
                        PolicyName: 'policyName1'
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: 'policyName1',
                    resourceType: AWS_IAM_AWS_MANAGED_POLICY,
                    tags: [],
                    relationships: []
                });

            });

        });

        describe(AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP, () => {

            it('should discover ALB target groups', async () => {
                const {default: {euWest2, usWest2}} = await import('./fixtures//additionalResources/alb/targetGroups.json', {with: {type: 'json' }});

                const mockElbV2Client = {
                    createElbV2Client(credentials, region) {
                        return {
                            describeTargetHealth: async arn => [],
                            async getAllTargetGroups() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    return usWest2;
                                }
                            }
                        }
                    }
                }

                const arn1 = 'targetGroupArn1';
                const arn2 = 'targetGroupArn2';

                const actual = await getAllSdkResources({...mockAwsClient, ...mockElbV2Client}, []);

                const actualTg1 = actual.find(x => x.arn === arn1);
                const actualTg2 = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualTg1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        TargetGroupArn: arn1
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
                    tags: [],
                    relationships: []
                });

                assert.deepEqual(actualTg2, {
                    id: arn2,
                    accountId: ACCOUNT_Z,
                    arn: arn2,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: US_WEST_2,
                    configuration: {
                        TargetGroupArn: arn2
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: arn2,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
                    tags: [],
                    relationships: []
                });

            });

            it('should discover ALB target groups when some regions fail', async () => {
                const {default: {euWest2}} = await import('./fixtures//additionalResources/alb/targetGroups.json', {with: {type: 'json' }});

                const mockElbV2Client = {
                    createElbV2Client(credentials, region) {
                        return {
                            describeTargetHealth: async arn => [],
                            async getAllTargetGroups() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    throw new Error();
                                }
                            }
                        }
                    }
                }

                const arn1 = 'targetGroupArn1';

                const actual = await getAllSdkResources({...mockAwsClient, ...mockElbV2Client}, []);

                const actualTg1 = actual.find(x => x.arn === arn1);

                assert.strictEqual(actual.length, 1);
                assert.deepEqual(actualTg1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        TargetGroupArn: arn1
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
                    tags: [],
                    relationships: []
                });

            });

        });

        describe(AWS_EC2_SPOT, () => {

            it('should discover spot instances', async () => {
                const {default: {instanceRequests}} = await import('./fixtures//additionalResources/spot/instance.json', {with: {type: 'json' }});

                const mockEc2Client = {
                    createEc2Client(credentials, region) {
                        return {
                            async getAllSpotInstanceRequests() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return instanceRequests.euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    return instanceRequests.usWest2;
                                }
                            },
                            async getAllSpotFleetRequests() {
                                return [];
                            }
                        }
                    }
                }

                const spotInstanceRequestId1 = 'spotInstanceRequestId1';
                const spotInstanceRequestId2 = 'spotInstanceRequestId2';

                const arn1 = `arn:aws:ec2:${EU_WEST_2}:${ACCOUNT_X}:spot-instance-request/${spotInstanceRequestId1}`;
                const arn2 = `arn:aws:ec2:${US_WEST_2}:${ACCOUNT_Z}:spot-instance-request/${spotInstanceRequestId2}`;

                const instanceId1 = "instanceId1";
                const instanceId2 = "instanceId2";

                const actual = await getAllSdkResources({...mockAwsClient, ...mockEc2Client}, []);

                const actualSpotFleet1 = actual.find(x => x.arn === arn1);
                const actualSpotFleet2 = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualSpotFleet1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        InstanceId: instanceId1,
                        SpotInstanceRequestId: spotInstanceRequestId1,
                        Tags: []
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_EC2_SPOT,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: instanceId1,
                            resourceType: AWS_EC2_INSTANCE
                        }
                    ]
                });

                assert.deepEqual(actualSpotFleet2, {
                    id: arn2,
                    accountId: ACCOUNT_Z,
                    arn: arn2,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: US_WEST_2,
                    configuration: {
                        InstanceId: instanceId2,
                        SpotInstanceRequestId: spotInstanceRequestId2,
                        Tags: []
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: arn2,
                    resourceType: AWS_EC2_SPOT,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: instanceId2,
                            resourceType: AWS_EC2_INSTANCE
                        }
                    ]
                });

            });

            it('should discover spot instances when some regions fail', async () => {
                const {default: {instanceRequests}} = await import('./fixtures//additionalResources/spot/instance.json', {with: {type: 'json' }});

                const mockEc2lient = {
                    createEc2Client(credentials, region) {
                        return {
                            async getAllSpotInstanceRequests() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return instanceRequests.euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    throw new Error();
                                }
                            },
                            async getAllSpotFleetRequests() {
                                return [];
                            }
                        }
                    }
                }

                const spotInstanceRequestId1 = 'spotInstanceRequestId1';

                const arn1 = `arn:aws:ec2:${EU_WEST_2}:${ACCOUNT_X}:spot-instance-request/${spotInstanceRequestId1}`;

                const instanceId1 = "instanceId1";

                const actual = await getAllSdkResources({...mockAwsClient, ...mockEc2lient}, []);

                const actualSpotFleet1 = actual.find(x => x.arn === arn1);

                assert.strictEqual(actual.length, 1);
                assert.deepEqual(actualSpotFleet1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        InstanceId: instanceId1,
                        SpotInstanceRequestId: spotInstanceRequestId1,
                        Tags: []
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_EC2_SPOT,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: instanceId1,
                            resourceType: AWS_EC2_INSTANCE
                        }
                    ]
                });
            });

        });

        describe(AWS_EC2_SPOT_FLEET, () => {

            it('should discover spot fleets', async () => {
                const {default: {fleetRequests, instanceRequests}} = await import('./fixtures//additionalResources/spot/fleet.json', {with: {type: 'json' }});

                const mockEc2lient = {
                    createEc2Client(credentials, region) {
                        return {
                            async getAllSpotInstanceRequests() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return instanceRequests.euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    return instanceRequests.usWest2;
                                }
                            },
                            async getAllSpotFleetRequests() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return fleetRequests.euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    return fleetRequests.usWest2;
                                }
                            }
                        }
                    }
                }

                const arn1 = `arn:aws:ec2:${EU_WEST_2}:${ACCOUNT_X}:spot-fleet-request/spotFleetRequestId1`;
                const arn2 = `arn:aws:ec2:${US_WEST_2}:${ACCOUNT_Z}:spot-fleet-request/spotFleetRequestId2`;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockEc2lient}, []);

                const actualSpotFleet1 = actual.find(x => x.arn === arn1);
                const actualSpotFleet2 = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualSpotFleet1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        SpotFleetRequestId: 'spotFleetRequestId1',
                        SpotFleetRequestConfig: {
                            OnDemandFulfilledCapacity: 0
                        }
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_EC2_SPOT_FLEET,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: 'instanceId1',
                            resourceType: AWS_EC2_INSTANCE
                        }
                    ]
                });

                assert.deepEqual(actualSpotFleet2, {
                    id: arn2,
                    accountId: ACCOUNT_Z,
                    arn: arn2,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: US_WEST_2,
                    configuration: {
                        SpotFleetRequestId: 'spotFleetRequestId2',
                        SpotFleetRequestConfig: {
                            OnDemandFulfilledCapacity: 1
                        }
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: arn2,
                    resourceType: AWS_EC2_SPOT_FLEET,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: 'instanceId2',
                            resourceType: AWS_EC2_INSTANCE
                        }
                    ]
                });

            });

            it('should discover spot fleets if some regions fail', async () => {
                const {default: {fleetRequests, instanceRequests}} = await import('./fixtures//additionalResources/spot/fleet.json', {with: {type: 'json' }});

                const mockEc2lient = {
                    createEc2Client(credentials, region) {
                        return {
                            async getAllSpotInstanceRequests() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return instanceRequests.euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    throw new Error();
                                }
                            },
                            async getAllSpotFleetRequests() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return fleetRequests.euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    return fleetRequests.usWest2;
                                }
                            }
                        }
                    }
                }

                const arn1 = `arn:aws:ec2:${EU_WEST_2}:${ACCOUNT_X}:spot-fleet-request/spotFleetRequestId1`;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockEc2lient}, []);

                const actualSpotFleet1 = actual.find(x => x.arn === arn1);

                assert.strictEqual(actual.length, 1);
                assert.deepEqual(actualSpotFleet1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        SpotFleetRequestId: 'spotFleetRequestId1',
                        SpotFleetRequestConfig: {
                            OnDemandFulfilledCapacity: 0
                        }
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_EC2_SPOT_FLEET,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: 'instanceId1',
                            resourceType: AWS_EC2_INSTANCE
                        }
                    ]
                });
            });

        });

        describe(AWS_API_GATEWAY_RESOURCE, () => {

            it('should discover API Gateway resources', async () => {
                const {default: schema} = await import('./fixtures//additionalResources/apigateway/resources.json', {with: {type: 'json' }});
                const {restApi, apiGwResource} = generate(schema);

                const mockApiGatewayClient = {
                    createApiGatewayClient(credentials, region) {
                        return {
                            getAuthorizers: async restApi => [],
                            async getResources() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [apiGwResource];
                                }
                            },
                            async getMethod() {
                                const notFoundError = new Error();
                                notFoundError.name = NOT_FOUND_EXCEPTION;
                                throw notFoundError;
                            }
                        }
                    }
                }

                const arn = `arn:aws:apigateway:${EU_WEST_2}::/restapis/${restApi.configuration.id}/resources/${apiGwResource.id}`;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockApiGatewayClient}, [restApi]);

                const actualApiGwResource = actual.find(x => x.arn === arn);

                assert.deepEqual(actualApiGwResource, {
                    id: arn,
                    accountId: ACCOUNT_X,
                    arn: arn,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        RestApiId: restApi.configuration.id,
                        id: apiGwResource.id
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn,
                    resourceName: arn,
                    resourceType: AWS_API_GATEWAY_RESOURCE,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_CONTAINED_IN,
                            resourceId: restApi.configuration.id,
                            resourceType: AWS_API_GATEWAY_REST_API
                        }
                    ]
                });

            });

        });

        describe(AWS_API_GATEWAY_METHOD, () => {

            it('should handle resources that have unsupported http verbs', async () => {
                const {default: schema} = await import('./fixtures//additionalResources/apigateway/method.json', {with: {type: 'json' }});
                const {restApi, apiGwResource, getMethod, postMethod} = generate(schema);

                const mockApiGatewayClient = {
                    createApiGatewayClient(accountId, credentials, region) {
                        return {
                            getResources: async restApi => {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [apiGwResource];
                                }
                            },
                            getAuthorizers: async restApi => [],
                            async getMethod(httpMethod) {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    const notFoundError = new Error();
                                    notFoundError.name = NOT_FOUND_EXCEPTION;
                                    throw notFoundError;
                                }
                            }
                        }
                    }
                }

                const actual = await getAllSdkResources({...mockAwsClient, ...mockApiGatewayClient}, [restApi]);

                assert.deepEqual(actual.filter(x => x.resourceType === AWS_API_GATEWAY_METHOD), []);
            });

            it('should discover API Gateway methods', async () => {
                const {default: schema} = await import('./fixtures//additionalResources/apigateway/method.json', {with: {type: 'json' }});
                const {restApi, apiGwResource, getMethod, postMethod} = generate(schema);

                const mockApiGatewayClient = {
                    createApiGatewayClient(credentials, region) {
                        return {
                            getResources: async restApi => {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [apiGwResource];
                                }
                            },
                            getAuthorizers: async restApi => [],
                            async getMethod(httpMethod) {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    if(httpMethod === GET) {
                                        return getMethod;
                                    } else if(httpMethod === POST) {
                                        return postMethod;
                                    } else {
                                        const notFoundError = new Error();
                                        notFoundError.name = 'NotFoundException';
                                        throw notFoundError;
                                    }
                                }
                            }
                        }
                    }
                }

                const apiGatewayResourceArn = `arn:aws:apigateway:${EU_WEST_2}::/restapis/${restApi.configuration.id}/resources/${apiGwResource.id}`;
                const arn1 = `arn:aws:apigateway:${EU_WEST_2}::/restapis/${restApi.configuration.id}/resources/${apiGwResource.id}/methods/${GET}`;
                const arn2 = `arn:aws:apigateway:${EU_WEST_2}::/restapis/${restApi.configuration.id}/resources/${apiGwResource.id}/methods/${POST}`;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockApiGatewayClient}, [restApi]);

                const actualGetMethod = actual.find(x => x.arn === arn1);
                const actualPostMethod = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualGetMethod, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        RestApiId: restApi.configuration.id,
                        ResourceId: apiGwResource.id,
                        httpMethod: GET
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_API_GATEWAY_METHOD,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_CONTAINED_IN,
                            resourceId: apiGatewayResourceArn,
                            resourceType: AWS_API_GATEWAY_RESOURCE
                        }
                    ]
                });

                assert.deepEqual(actualPostMethod, {
                    id: arn2,
                    accountId: ACCOUNT_X,
                    arn: arn2,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        RestApiId: restApi.configuration.id,
                        ResourceId: apiGwResource.id,
                        httpMethod: POST
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: arn2,
                    resourceType: AWS_API_GATEWAY_METHOD,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_CONTAINED_IN,
                            resourceId: apiGatewayResourceArn,
                            resourceType: AWS_API_GATEWAY_RESOURCE
                        }
                    ]
                });

            });

        });

        describe(AWS_API_GATEWAY_AUTHORIZER, () => {

            it('should discover API Gateway authorizers with no providers', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/apigateway/authorizerNoProvider.json', {with: { type: 'json' }});
                const {restApi, apiGwAuthorizer} = generate(schema);

                const mockApiGatewayClient = {
                    createApiGatewayClient(credentials, region) {
                        return {
                            getResources: async restApi => [],
                            async getAuthorizers(restApi) {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [apiGwAuthorizer];
                                }
                            }
                        }
                    }
                }

                const arn = `arn:aws:apigateway:${EU_WEST_2}::/restapis/${restApi.configuration.id}/authorizers/${apiGwAuthorizer.id}`;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockApiGatewayClient}, [restApi]);

                const actualApiGwResource = actual.find(x => x.arn === arn);

                assert.deepEqual(actualApiGwResource, {
                    id: arn,
                    accountId: ACCOUNT_X,
                    arn: arn,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        RestApiId: restApi.configuration.id,
                        id: apiGwAuthorizer.id
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn,
                    resourceName: arn,
                    resourceType: AWS_API_GATEWAY_AUTHORIZER,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_CONTAINED_IN,
                            resourceId: restApi.configuration.id,
                            resourceType: AWS_API_GATEWAY_REST_API
                        }
                    ]
                });

            });

            it('should discover API Gateway Cognito authorizers', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/apigateway/authorizer.json', {with: {type: 'json' }});
                const {restApi, cognito, apiGwAuthorizer} = generate(schema);

                const mockApiGatewayClient = {
                    createApiGatewayClient(credentials, region) {
                        return {
                            getResources: async restApi => [],
                            async getAuthorizers(restApi) {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [apiGwAuthorizer];
                                }
                            }
                        }
                    }
                }

                const arn = `arn:aws:apigateway:${EU_WEST_2}::/restapis/${restApi.configuration.id}/authorizers/${apiGwAuthorizer.id}`;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockApiGatewayClient}, [restApi]);

                const actualApiGwResource = actual.find(x => x.arn === arn);

                assert.deepEqual(actualApiGwResource, {
                    id: arn,
                    accountId: ACCOUNT_X,
                    arn: arn,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        RestApiId: restApi.configuration.id,
                        id: apiGwAuthorizer.id,
                        providerARNs: [
                            'cognitoArn'
                        ]
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn,
                    resourceName: arn,
                    resourceType: AWS_API_GATEWAY_AUTHORIZER,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_CONTAINED_IN,
                            resourceId: restApi.configuration.id,
                            resourceType: AWS_API_GATEWAY_REST_API
                        },
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            arn: cognito.arn
                        }
                    ]
                });

            });

        });

        describe(AWS_ECS_TASK, () => {

            it('should discover ECS tasks', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/ecs/task.json', {with: {type: 'json' }});
                const {ecsService, ecsTask} = generate(schema);

                const mockEcsClientClient = {
                    createEcsClient(credentials, region) {
                        return {
                            async getAllServiceTasks() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [ecsTask];
                                }
                            }
                        }
                    },
                }

                const arn = ecsTask.taskArn;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockEcsClientClient}, [ecsService]);

                const actualEcsTask = actual.find(x => x.arn === arn);

                assert.deepEqual(actualEcsTask, {
                    id: arn,
                    accountId: ACCOUNT_X,
                    arn: arn,
                    availabilityZone: EU_WEST_2_A ,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        availabilityZone: EU_WEST_2_A ,
                        taskArn: arn
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn,
                    resourceName: arn,
                    resourceType: AWS_ECS_TASK,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: ecsService.resourceId,
                            resourceType: AWS_ECS_SERVICE
                        }
                    ]
                });

            });

        });

        describe(AWS_EKS_NODE_GROUP, () => {

            it('should discover EKS node groups', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/eks/nodeGroup.json', {with: {type: 'json' }});
                const {eksCluster, nodeGroup} = generate(schema);

                const mockEksClientClient = {
                    createEksClient(credentials, region) {
                        return {
                            async listNodeGroups() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [nodeGroup];
                                }
                            }
                        }
                    }
                }

                const arn = nodeGroup.nodegroupArn;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockEksClientClient}, [eksCluster]);

                const actualEksNodeGroup = actual.find(x => x.arn === arn);

                assert.deepEqual(actualEksNodeGroup, {
                    id: arn,
                    accountId: ACCOUNT_X,
                    arn: arn,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        nodegroupArn: nodeGroup.nodegroupArn,
                        nodegroupName: nodeGroup.nodegroupName
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn,
                    resourceName: nodeGroup.nodegroupName,
                    resourceType: AWS_EKS_NODE_GROUP,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_CONTAINED_IN,
                            resourceId: eksCluster.resourceId,
                            resourceType: AWS_EKS_CLUSTER
                        }
                    ]
                });

            });

        });

        describe(AWS_MEDIA_CONNECT_FLOW, () => {

            it('should discover Media Connect flows', async () => {
                const {default: {euWest2, usWest2}} = await import('./fixtures/additionalResources/mediaconnect/flows.json', {with: {type: 'json' }});

                const mockMediaConnectClient = {
                    createMediaConnectClient(credentials, region) {
                        return {
                            getAllFlows: async () => {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    return usWest2;
                                }
                            }
                        }
                    }
                }

                const arn1 = 'flowArn1';
                const name1 = 'flowName1';
                const arn2 = 'flowArn2';
                const name2 = 'flowName2';

                const actual = await getAllSdkResources({...mockAwsClient, ...mockMediaConnectClient}, []);

                const actualFlow1 = actual.find(x => x.arn === arn1);
                const actualFlow2 = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualFlow1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: EU_WEST_2 + 'a',
                    awsRegion: EU_WEST_2,
                    configuration: {
                        FlowArn: arn1,
                        AvailabilityZone: EU_WEST_2 + 'a',
                        Name: name1
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: name1,
                    resourceType: AWS_MEDIA_CONNECT_FLOW,
                    tags: [],
                    relationships: []
                });

                assert.deepEqual(actualFlow2, {
                    id: arn2,
                    accountId: ACCOUNT_Z,
                    arn: arn2,
                    availabilityZone: US_WEST_2 + 'a',
                    awsRegion: US_WEST_2,
                    configuration: {
                        FlowArn: arn2,
                        AvailabilityZone: US_WEST_2 + 'a',
                        Name: name2
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: name2,
                    resourceType: AWS_MEDIA_CONNECT_FLOW,
                    tags: [],
                    relationships: []
                });

            });

            it('should discover Media Connect flows some regions fail', async () => {
                const {default: {euWest2}} = await import('./fixtures/additionalResources/mediaconnect/flows.json', {with: {type: 'json' }});

                const mockMediaConnectClient = {
                    createMediaConnectClient(credentials, region) {
                        return {
                            getAllFlows: async () => {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    throw new Error();
                                }
                            }
                        }
                    }
                }

                const arn1 = 'flowArn1';
                const name1 = 'flowName1';

                const actual = await getAllSdkResources({...mockAwsClient, ...mockMediaConnectClient}, []);

                const actualPool1 = actual.find(x => x.arn === arn1);

                assert.deepEqual(actualPool1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: EU_WEST_2 + 'a',
                    awsRegion: EU_WEST_2,
                    configuration: {
                        FlowArn: arn1,
                        AvailabilityZone: EU_WEST_2 + 'a',
                        Name: name1
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: name1,
                    resourceType: AWS_MEDIA_CONNECT_FLOW,
                    tags: [],
                    relationships: []
                });

            });

        });

        describe(AWS_OPENSEARCH_DOMAIN, () => {

            it('should discover OpenSearch domains', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/opensearch/domain.json', {with: {type: 'json' }});
                const {domain} = generate(schema);

                const mockOpenSearchClientClient = {
                    createOpenSearchClient(credentials, region) {
                        return {
                            async getAllOpenSearchDomains() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [domain];
                                }
                            }
                        }
                    }
                }

                const arn = domain.ARN;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockOpenSearchClientClient}, []);

                const actualDomain = actual.find(x => x.arn === arn);

                assert.deepEqual(actualDomain, {
                    id: arn,
                    accountId: ACCOUNT_X,
                    arn: arn,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        ARN: domain.ARN,
                        DomainName: domain.DomainName
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: domain.DomainName,
                    resourceName: domain.DomainName,
                    resourceType: AWS_OPENSEARCH_DOMAIN,
                    tags: [],
                    relationships: []
                });

            });

        });

        describe(AWS_IAM_INLINE_POLICY, () => {

            it('should create inline iam policy from iam role', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/iam/inlinePolicy/role.json', {with: {type: 'json' }});
                const {inlinePolicy1, inlinePolicy2, role} = generate(schema);

                const actual = await getAllSdkResources(mockAwsClient, [role]);

                const arn1 = `${role.arn}/inlinePolicy/${inlinePolicy1.policyName}`;
                const arn2 = `${role.arn}/inlinePolicy/${inlinePolicy2.policyName}`;

                const actualInlinePolcy1 = actual.find(x => x.arn === arn1);
                const actualInlinePolcy2 = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualInlinePolcy1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {
                        ...inlinePolicy1
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_IAM_INLINE_POLICY,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceName: role.resourceName,
                            resourceType: AWS_IAM_ROLE
                        }
                    ]
                });

                assert.deepEqual(actualInlinePolcy2, {
                    id: arn2,
                    accountId: ACCOUNT_X,
                    arn: arn2,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {
                        ...inlinePolicy2
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: arn2,
                    resourceType: AWS_IAM_INLINE_POLICY,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceName: role.resourceName,
                            resourceType: AWS_IAM_ROLE
                        }
                    ]
                });

            });

            it('should create inline iam policy from iam uder', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/iam/inlinePolicy/user.json', {with: {type: 'json' }});
                const {inlinePolicy, user} = generate(schema);

                const actual = await getAllSdkResources(mockAwsClient, [user]);

                const arn = `${user.arn}/inlinePolicy/${inlinePolicy.policyName}`;

                const actualInlinePolcy = actual.find(x => x.arn === arn);

                assert.deepEqual(actualInlinePolcy, {
                    id: arn,
                    accountId: ACCOUNT_X,
                    arn: arn,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {
                        ...inlinePolicy
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn,
                    resourceName: arn,
                    resourceType: AWS_IAM_INLINE_POLICY,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceName: user.resourceName,
                            resourceType: AWS_IAM_USER
                        }
                    ]
                });
            });

        });

        describe(AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION, () => {

            it('should discover App Registry applications', async () => {
                const {default: {euWest2, usWest2}} = await import('./fixtures/additionalResources/appregistry/application.json', {with: {type: 'json' }});

                const mockAppRegistryClient = {
                    createServiceCatalogAppRegistryClient(credentials, region) {
                        return {
                            getAllApplications: async () => {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    return usWest2;
                                }
                            }
                        }
                    }
                }

                const arn1 = 'applicationArn1'
                const arn2 = 'applicationArn2'

                const name1 = 'applicationName1'
                const name2 = 'applicationName2'

                const actual = await getAllSdkResources({...mockAwsClient, ...mockAppRegistryClient}, []);

                const actualApplication1 = actual.find(x => x.arn === arn1);
                const actualApplication2 = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualApplication1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        arn: arn1,
                        name: name1
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: name1,
                    resourceType: AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION,
                    tags: [],
                    relationships: []
                });

                assert.deepEqual(actualApplication2, {
                    id: arn2,
                    accountId: ACCOUNT_Z,
                    arn: arn2,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: US_WEST_2,
                    configuration: {
                        arn: arn2,
                        name: name2
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: name2,
                    resourceType: AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION,
                    tags: [],
                    relationships: []
                });

            });

            it('should discover App Registry applications even when some regions fail', async () => {
                const {default: {euWest2}} = await import('./fixtures/additionalResources/appregistry/application.json', {with: {type: 'json' }});

                const mockAppRegistryClient = {
                    createServiceCatalogAppRegistryClient(credentials, region) {
                        return {
                            getAllApplications: async () => {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return euWest2;
                                } else if(credentials.accessKeyId === ACCESS_KEY_Z && region === US_WEST_2) {
                                    throw new Error();
                                }
                            }
                        }
                    }
                }

                const arn1 = 'applicationArn1'
                const name1 = 'applicationName1'

                const actual = await getAllSdkResources({...mockAwsClient, ...mockAppRegistryClient}, []);

                assert.strictEqual(actual.length, 1);

                const actualApplication1 = actual.find(x => x.arn === arn1);

                assert.deepEqual(actualApplication1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        arn: arn1,
                        name: name1
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: name1,
                    resourceType: AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION,
                    tags: [],
                    relationships: []
                });

            });

        });

        describe(AWS_TAGS_TAG, () => {

            it('should create tags from resources', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/tags/tag.json', {with: {type: 'json' }});
                const {tagInfo, ec2Instance, sqsQueue, forecast} = generate(schema);

                const actual = await getAllSdkResources(mockAwsClient, [ec2Instance, sqsQueue, forecast]);

                const arn1 = `arn:aws:tags::${ACCOUNT_X}:tag/${tagInfo.applicationName}=${tagInfo.applicationValue}`;
                const arn2 = `arn:aws:tags::${ACCOUNT_X}:tag/${tagInfo.sqsName}=${tagInfo.sqsValue}`;

                const actualTag1 = actual.find(x => x.arn === arn1);
                const actualTag2 = actual.find(x => x.arn === arn2);

                assert.deepEqual(actualTag1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {},
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: `${tagInfo.applicationName}=${tagInfo.applicationValue}`,
                    resourceType: AWS_TAGS_TAG,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: ec2Instance.resourceId,
                            resourceName: ec2Instance.resourceName,
                            resourceType: AWS_EC2_INSTANCE,
                            awsRegion: EU_WEST_2
                        },
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: sqsQueue.resourceId,
                            resourceName: sqsQueue.resourceName,
                            resourceType: AWS_SQS_QUEUE,
                            awsRegion: EU_WEST_2
                        }
                    ]
                });

                assert.deepEqual(actualTag2, {
                    id: arn2,
                    accountId: ACCOUNT_X,
                    arn: arn2,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {},
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn2,
                    resourceName: `${tagInfo.sqsName}=${tagInfo.sqsValue}`,
                    resourceType: AWS_TAGS_TAG,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: sqsQueue.resourceId,
                            resourceName: sqsQueue.resourceName,
                            resourceType: AWS_SQS_QUEUE,
                            awsRegion: EU_WEST_2
                        }
                    ]
                });
            });

            it('should handle tags field that is an object', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/tags/object.json', {with: {type: 'json' }});
                const {eksCluster, nodeGroup} = generate(schema);

                const mockEksClientClient = {
                    createEksClient(credentials, region) {
                        return {
                            async listNodeGroups() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return [nodeGroup];
                                }
                            }
                        }
                    },
                }

                const arn = nodeGroup.nodegroupArn;
                const tagArn1 = `arn:aws:tags::${ACCOUNT_X}:tag/tag1=value1`;
                const tagArn2 = `arn:aws:tags::${ACCOUNT_X}:tag/tag2=value2`;

                const actual = await getAllSdkResources({...mockAwsClient, ...mockEksClientClient}, [eksCluster]);

                const actualEksNodeGroup = actual.find(x => x.arn === arn);
                const actualTag1 = actual.find(x => x.arn === tagArn1);
                const actualTag2 = actual.find(x => x.arn === tagArn2);

                assert.deepEqual(actualEksNodeGroup, {
                    id: arn,
                    accountId: ACCOUNT_X,
                    arn: arn,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        nodegroupArn: nodeGroup.nodegroupArn,
                        nodegroupName: nodeGroup.nodegroupName,
                        tags: {
                            tag1: 'value1',
                            tag2: 'value2'
                        }
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn,
                    resourceName: nodeGroup.nodegroupName,
                    resourceType: AWS_EKS_NODE_GROUP,
                    tags: [
                        {
                            key: 'tag1',
                            value: 'value1'
                        },
                        {
                            key: 'tag2',
                            value: 'value2'
                        }
                    ],
                    relationships: [
                        {
                            relationshipName: IS_CONTAINED_IN,
                            resourceId: eksCluster.resourceId,
                            resourceType: AWS_EKS_CLUSTER
                        }
                    ]
                });

                assert.deepEqual(actualTag1, {
                    id: tagArn1,
                    accountId: ACCOUNT_X,
                    arn: tagArn1,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {},
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: tagArn1,
                    resourceName: 'tag1=value1',
                    resourceType: AWS_TAGS_TAG,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: actualEksNodeGroup.resourceId,
                            resourceName: actualEksNodeGroup.resourceName,
                            resourceType: AWS_EKS_NODE_GROUP,
                            awsRegion: EU_WEST_2
                        }
                    ]
                });

                assert.deepEqual(actualTag2, {
                    id: tagArn2,
                    accountId: ACCOUNT_X,
                    arn: tagArn2,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {},
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: tagArn2,
                    resourceName: 'tag2=value2',
                    resourceType: AWS_TAGS_TAG,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: actualEksNodeGroup.resourceId,
                            resourceName: actualEksNodeGroup.resourceName,
                            resourceType: AWS_EKS_NODE_GROUP,
                            awsRegion: EU_WEST_2
                        }
                    ]
                });

            });

            it('should handle Tags field in upper camel case', async () => {
                const {default: schema} = await import('./fixtures/additionalResources/tags/camelCase.json', {with: {type: 'json' }});
                const {tagInfo, instanceRequests} = generate(schema);

                const mockEc2Client = {
                    createEc2Client(credentials, region) {
                        return {
                            async getAllSpotInstanceRequests() {
                                if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                    return instanceRequests.euWest2;
                                }
                            },
                            async getAllSpotFleetRequests() {
                                return [];
                            }
                        }
                    }
                }

                const spotInstanceRequestId1 = 'spotInstanceRequestId1';

                const arn1 = `arn:aws:ec2:${EU_WEST_2}:${ACCOUNT_X}:spot-instance-request/${spotInstanceRequestId1}`;
                const tagArn = `arn:aws:tags::${ACCOUNT_X}:tag/${tagInfo.testTagKey}=${tagInfo.testTagValue}`;

                const instanceId1 = "instanceId1";

                const actual = await getAllSdkResources({...mockAwsClient, ...mockEc2Client}, []);

                const actualSpotFleet1 = actual.find(x => x.arn === arn1);
                const actualTag = actual.find(x => x.arn === tagArn);

                assert.deepEqual(actualSpotFleet1, {
                    id: arn1,
                    accountId: ACCOUNT_X,
                    arn: arn1,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    awsRegion: EU_WEST_2,
                    configuration: {
                        InstanceId: instanceId1,
                        SpotInstanceRequestId: spotInstanceRequestId1,
                        Tags: [
                            {
                                Key: tagInfo.testTagKey,
                                Value: tagInfo.testTagValue
                            }
                        ]
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: arn1,
                    resourceName: arn1,
                    resourceType: AWS_EC2_SPOT,
                    tags: [
                        {
                            key: tagInfo.testTagKey,
                            value: tagInfo.testTagValue
                        }
                    ],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: instanceId1,
                            resourceType: AWS_EC2_INSTANCE
                        }
                    ]
                });

                assert.deepEqual(actualTag, {
                    id: tagArn,
                    accountId: ACCOUNT_X,
                    arn: tagArn,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: GLOBAL,
                    configuration: {},
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: tagArn,
                    resourceName: `${tagInfo.testTagKey}=${tagInfo.testTagValue}`,
                    resourceType: AWS_TAGS_TAG,
                    tags: [],
                    relationships: [
                        {
                            relationshipName: IS_ASSOCIATED_WITH,
                            resourceId: actualSpotFleet1.resourceId,
                            resourceName: actualSpotFleet1.resourceName,
                            resourceType: AWS_EC2_SPOT,
                            awsRegion: EU_WEST_2
                        }
                    ]
                });
            });
            describe(AWS_DYNAMODB_STREAM, () => {

                it('should discover DynamoDB Streams', async () => {
                    const {default: schema} = await import('./fixtures/additionalResources/dynamodb/stream.json', {with: {type: 'json' }});
                    const {table, stream} = generate(schema);

                    const mockDynamoDBStreamsClient = {
                        createDynamoDBStreamsClient(credentials, region) {
                            return {
                                async describeStream(streamArn) {
                                    if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                        return { StreamArn: stream.arn }
                                    }
                                }
                            }
                        }
                    }
                    const arn = `arn:aws:dynamodb:${EU_WEST_2}:${ACCOUNT_X}:table/test/stream`;

                    const actual = await getAllSdkResources({...mockAwsClient, ...mockDynamoDBStreamsClient}, [table]);

                    const actualDynamoDBStreamResource = actual.find(x => x.arn === arn);

                    assert.deepEqual(actualDynamoDBStreamResource, {
                        id: arn,
                        accountId: ACCOUNT_X,
                        awsRegion: EU_WEST_2,
                        availabilityZone: NOT_APPLICABLE,
                        arn: arn,
                        resourceId: arn,
                        resourceName: arn,
                        resourceType: AWS_DYNAMODB_STREAM,
                        relationships: [],
                        configuration: {
                            StreamArn: "arn:aws:dynamodb:eu-west-2:xxxxxxxxxxxx:table/test/stream"
                        },
                        configurationItemStatus: "ResourceDiscovered",
                        tags: []
                    });

                });

            });

            describe(AWS_DYNAMODB_TABLE, () => {

                it('should discover DynamoDB Tables without streams', async () => {
                    const {default: schema} = await import('./fixtures/relationships/dynamodb/table.json', {with: {type: 'json' }});
                    const {tableNoStream} = generate(schema);

                    const arn = `arn:aws:dynamodb:${EU_WEST_2}:${ACCOUNT_X}:table/test`;

                    const actual = await getAllSdkResources({...mockAwsClient}, [tableNoStream]);
                    const actualDynamoDBTableResource = actual.find(x => x.arn === arn);

                    assert.lengthOf(actual, 1);

                    assert.deepEqual(actualDynamoDBTableResource, {
                        id: arn,
                        accountId: ACCOUNT_X,
                        awsRegion: EU_WEST_2,
                        availabilityZone: NOT_APPLICABLE,
                        arn: arn,
                        resourceId: arn,
                        resourceName: arn,
                        resourceType: AWS_DYNAMODB_TABLE,
                        relationships: [],
                        configuration: {}
                    });

                });

            });

            describe(AWS_APPSYNC_GRAPHQLAPI, () => {
                it('should discover GraphQL Data Sources', async () => {
                    const {default: schema} = await import('./fixtures/additionalResources/appsync/graphQlApi.json', {with: {type: 'json' }});
                    const {graphQLApi, dataSource} = generate(schema);
    
                    const mockAppSyncClient = {
                        createAppSyncClient(credentials, region) {
                            return {
                                async listDataSources() {
                                    if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                        return [dataSource];
                                    }
                                },
                                listResolvers : async () => [],
                            }
                        }
                    }
    
                    const arn = dataSource.dataSourceArn;
                    const actual = await getAllSdkResources({...mockAwsClient, ...mockAppSyncClient}, [graphQLApi]);
                    const actualAppSyncDataSource = actual.find(x => x.arn === arn);


                    
                    assert.deepEqual(actualAppSyncDataSource, {
                        id: arn,
                        accountId: ACCOUNT_X,
                        arn: arn,
                        availabilityZone: NOT_APPLICABLE,
                        awsRegion: EU_WEST_2,
                        configuration: {
                            dataSourceArn: "DataSourceArn",
                            name: "DataSourceArn",
                            apiId: "random-id"
                        },
                        configurationItemStatus: RESOURCE_DISCOVERED,
                        resourceId: arn,
                        resourceName: dataSource.name,
                        resourceType: AWS_APPSYNC_DATASOURCE,
                        tags: [],
                        relationships: []
                    });
    
                });

                it('should discover GraphQL Query Resolvers', async () => {
                    const {default: schema} = await import('./fixtures/additionalResources/appsync/graphQlApi.json', {with: {type: 'json' }});
                    const {graphQLApi, queryResolver} = generate(schema);
    
                    const mockAppSyncClient = {
                        createAppSyncClient(credentials, region) {
                            return {
                                async listResolvers() {
                                    if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                        return [queryResolver];
                                    }
                                },
                                listDataSources : async () => [],
                            }
                        }
                    }

                    const arn = queryResolver.resolverArn;
                    const actual = await getAllSdkResources({...mockAwsClient, ...mockAppSyncClient}, [graphQLApi]);
                    const actualQueryResolver = actual.find(x => x.arn === arn);

                    assert.deepEqual(actualQueryResolver, {
                        id: arn,
                        accountId: ACCOUNT_X,
                        arn: arn,
                        availabilityZone: NOT_APPLICABLE,
                        awsRegion: EU_WEST_2,
                        configuration: {
                            fieldName: "QueryFieldName",
                            resolverArn: "ResolverArn",
                            typeName: "Query",
                            apiId: "random-id",
                            dataSourceName: "DataSourceName"
                        },
                        configurationItemStatus: RESOURCE_DISCOVERED,
                        resourceId: arn,
                        resourceName: queryResolver.fieldName,
                        resourceType: AWS_APPSYNC_RESOLVER,
                        tags: [],
                        relationships: [
                            {
                                relationshipName: IS_CONTAINED_IN,
                                resourceId: graphQLApi.resourceId,
                                resourceType: AWS_APPSYNC_GRAPHQLAPI
                            },
                            {
                                relationshipName: IS_ASSOCIATED_WITH,
                                resourceName: "DataSourceName",
                                resourceType: AWS_APPSYNC_DATASOURCE
                            }
                        ]
                    });
                });

                it('should discover GraphQL Mutation Resolvers', async () => {
                    const {default: schema} = await import('./fixtures/additionalResources/appsync/graphQlApi.json', {with: {type: 'json' }});
                    const {graphQLApi, mutationResolver} = generate(schema);
    
                    const mockAppSyncClient = {
                        createAppSyncClient(credentials, region) {
                            return {
                                async listResolvers() {
                                    if(credentials.accessKeyId === ACCESS_KEY_X && region === EU_WEST_2) {
                                        return [mutationResolver];
                                    }
                                },
                                listDataSources : async () => [],
                            }
                        }
                    }

                    const arn = mutationResolver.resolverArn;
                    const actual = await getAllSdkResources({...mockAwsClient, ...mockAppSyncClient}, [graphQLApi]);
                    const actualMutationResolver = actual.find(x => x.arn === arn);

                    assert.deepEqual(actualMutationResolver, {
                        id: arn,
                        accountId: ACCOUNT_X,
                        arn: arn,
                        availabilityZone: NOT_APPLICABLE,
                        awsRegion: EU_WEST_2,
                        configuration: {
                            fieldName: "MutationFieldName",
                            resolverArn: "ResolverArn",
                            typeName: "Mutation",
                            apiId: "random-id",
                            dataSourceName: "DataSourceName"
                        },
                        configurationItemStatus: RESOURCE_DISCOVERED,
                        resourceId: arn,
                        resourceName: mutationResolver.fieldName,
                        resourceType: AWS_APPSYNC_RESOLVER,
                        tags: [],
                        relationships: [
                            {
                                relationshipName: IS_CONTAINED_IN,
                                resourceId: graphQLApi.resourceId,
                                resourceType: AWS_APPSYNC_GRAPHQLAPI
                            },
                            {
                                relationshipName: IS_ASSOCIATED_WITH,
                                resourceName: "DataSourceName",
                                resourceType: AWS_APPSYNC_DATASOURCE
                            }
                        ]
                    });
    
                });
    
            });

        });

    });

});