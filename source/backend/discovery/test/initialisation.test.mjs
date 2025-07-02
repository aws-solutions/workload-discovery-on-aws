// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {afterEach, assert, describe, it, vi} from 'vitest';
import {initialise} from '../src/lib/intialisation.mjs';
import {AWS_ORGANIZATIONS} from '../src/lib/constants.mjs';
import {
    AggregatorNotFoundError,
    OrgAggregatorValidationError,
    RequiredServicesTimeoutError,
} from '../src/lib/errors.mjs';
import {generateAwsApiEndpoints} from './generator.mjs';

describe('initialisation', () => {
    const ACCOUNT_X = 'xxxxxxxxxxxx';
    const ACCOUNT_Y = 'yyyyyyyyyyyy';
    const EU_WEST_1 = 'eu-west-1';
    const US_EAST_1 = 'us-east-1';

    describe('initialise', () => {

        afterEach(() => {
            vi.restoreAllMocks();
        });

        const defaultMockAwsClient = {
            createEcsClient() {
                return {
                    getAllClusterTasks: async arn => [
                        {
                            taskDefinitionArn: `arn:aws:ecs:eu-west-1:${ACCOUNT_X}:task-definition/workload-discovery-taskgroup:1`,
                        },
                    ],
                };
            },
            createEc2Client() {
                return {
                    async getAllRegions() {
                        return [];
                    },
                    async getNatGateways() {
                        return [
                            {NatGatewayId: 'nat-11111111'},
                            {NatGatewayId: 'nat-22222222'},
                        ];
                    },
                };
            },
            createConfigServiceClient() {
                return {};
            },
            createOrganizationsClient() {
                return {
                    async getAllAccounts() {
                        return [];
                    },
                    async getRootAccount() {
                        return {
                            Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`,
                        };
                    },
                };
            },
            createStsClient() {
                return {
                    getCurrentCredentials: async () => {
                        return {
                            accessKeyId: 'accessKeyId',
                            secretAccessKey: 'secretAccessKey',
                            sessionToken: 'sessionToken',
                        };
                    },
                    getCredentials: async role => {},
                };
            },
        };

        const defaultAppSync = () => {
            return {
                getAccounts: async () => [
                    {accountId: ACCOUNT_X, regions: [{name: EU_WEST_1}]},
                ],
                createPaginator: async function* () {
                    yield [];
                },
                getResources: async () => []
            };
        };

        const defaultConfig = {
            region: EU_WEST_1,
            rootAccountId: ACCOUNT_X,
            cluster: 'testCluster',
            configAggregator: 'configAggregator',
        };

        describe('VPC connectivity checks', () => {
            const endpoints = generateAwsApiEndpoints(EU_WEST_1);
            const graphgQlUrl = endpoints.find(x => x.service === 'AppSync API').url;

            function createTimeoutSignal() {
                const abortController = new AbortController();
                const error = new Error();
                error.name = 'TimeoutError';
                abortController.abort(error);
                return abortController.signal;
            }

            it('should not throw when all AWS API test requests respond successfully', async () => {
                return initialise(
                    {...defaultMockAwsClient},
                    defaultAppSync,
                    {...defaultConfig, graphgQlUrl, isUsingOrganizations: true},
                );
            });

            it('should not throw on TimeoutError when listing NAT Gateways', async () => {
                const mockAwsClient = {
                    createEc2Client: () => ({
                        async getNatGateways() {
                            const error = new Error();
                            error.name = 'TimeoutError';
                            throw error;
                        },
                    }),
                };

                return initialise(
                    {...defaultMockAwsClient, ...mockAwsClient},
                    defaultAppSync,
                    {...defaultConfig, graphgQlUrl, isUsingOrganizations: true},
                );
            });

            it('should throw on non TimeoutError when listing NAT Gateways', async () => {
                const mockAwsClient = {
                    createEc2Client: () => ({
                        async getNatGateways() {
                            const error = new Error();
                            error.name = 'NotTimeoutError';
                            throw error;
                        },
                    }),
                };

                return initialise(
                    {...defaultMockAwsClient, ...mockAwsClient},
                    defaultAppSync,
                    {...defaultConfig, graphgQlUrl, isUsingOrganizations: true},
                ).then(() => {
                    throw new Error('Expected error not thrown.');
                }).catch(err => {
                    assert.strictEqual(err.name, 'NotTimeoutError');
                });
            });

            it('should throw RequiredServicesTimeoutError if AWS API test requests time out',
                async () => {
                    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(createTimeoutSignal());

                    return initialise(
                        {...defaultMockAwsClient},
                        defaultAppSync,
                        {...defaultConfig, graphgQlUrl, isUsingOrganizations: true},
                    )
                        .then(() => {
                            throw new Error('Expected function to throw but it did not');
                        })
                        .catch(err => {
                            assert.instanceOf(err, RequiredServicesTimeoutError);
                            assert.deepEqual(err.services.toSorted(), endpoints.map(x => x.service).toSorted());
                        });
                });
        });

        it('should throw if another copy of the ECS task is running', async () => {
            const mockAwsClient = {
                createEcsClient() {
                    return {
                        getAllClusterTasks: async () => [
                            {
                                taskDefinitionArn: `arn:aws:ecs:eu-west-1:${ACCOUNT_X}:task-definition/workload-discovery-taskgroup:1`,
                            },
                            {
                                taskDefinitionArn: `arn:aws:ecs:eu-west-1:${ACCOUNT_X}:task-definition/workload-discovery-taskgroup:2`,
                            },
                        ],
                    };
                },
            };

            return initialise(
                {...defaultMockAwsClient, ...mockAwsClient},
                defaultAppSync,
                defaultConfig
            ).catch(err =>
                assert.strictEqual(
                    err.message,
                    'Discovery process ECS task is already running in cluster.'
                )
            );
        });

        it('should throw AggregatorNotFoundError if config aggregator does not exist in AWS organization', async () => {
            const mockAwsClient = {
                createConfigServiceClient() {
                    return {
                        async getConfigAggregator() {
                            const error = new Error();
                            error.name =
                                'NoSuchConfigurationAggregatorException';
                            throw error;
                        },
                    };
                },
            };

            return initialise(
                {...defaultMockAwsClient, ...mockAwsClient},
                defaultAppSync,
                {...defaultConfig, crossAccountDiscovery: AWS_ORGANIZATIONS}
            )
                .then(() => {
                    throw new Error('Expected error not thrown.');
                })
                .catch(err => {
                    assert.instanceOf(err, AggregatorNotFoundError);
                    assert.strictEqual(
                        err.message,
                        `Aggregator ${defaultConfig.configAggregator} was not found`
                    );
                });
        });

        it('should throw OrgAggregatorValidationError if config aggregator is not org wide in AWS organization mode', async () => {
            const mockAwsClient = {
                createConfigServiceClient() {
                    return {
                        async getConfigAggregator() {
                            return {};
                        },
                    };
                },
            };

            return initialise(
                {...defaultMockAwsClient, ...mockAwsClient},
                defaultAppSync,
                {...defaultConfig, crossAccountDiscovery: AWS_ORGANIZATIONS}
            )
                .then(() => {
                    throw new Error('Expected error not thrown.');
                })
                .catch(err => {
                    assert.instanceOf(err, OrgAggregatorValidationError);
                    assert.strictEqual(
                        err.message,
                        'Config aggregator is not an organization wide aggregator'
                    );
                });
        });
    });
});
