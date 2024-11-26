// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import {initialise} from '../src/lib/intialisation.mjs';
import {AWS_ORGANIZATIONS} from '../src/lib/constants.mjs';
import {AggregatorNotFoundError, OrgAggregatorValidationError} from '../src/lib/errors.mjs';

describe('initialisation', () => {
    const ACCOUNT_X = 'xxxxxxxxxxxx';
    const ACCOUNT_Y = 'yyyyyyyyyyyy';
    const EU_WEST_1= 'eu-west-1';
    const US_EAST_1= 'us-east-1';

    describe('initialise', () => {

        const defaultMockAwsClient = {
            createEcsClient() {
                return {
                    getAllClusterTasks: async arn => [
                        {taskDefinitionArn: `arn:aws:ecs:eu-west-1:${ACCOUNT_X}:task-definition/workload-discovery-taskgroup:1`}
                    ]
                }
            },
            createEc2Client() {
                return {
                    async getAllRegions() {
                        return []
                    }
                };
            },
            createConfigServiceClient() {
                return {}
            },
            createOrganizationsClient() {
                return {
                    async getAllAccounts() {
                        return []
                    },
                    async getRootAccount() {
                        return {
                            Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`
                        }
                    }
                }
            },
            createStsClient() {
                return {
                    getCurrentCredentials: async () => {
                        return {accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};
                    },
                    getCredentials: async role => {}
                }
            }
        };

        const defaultAppSync = () => {
            return {
                getAccounts: async () => [
                    {accountId: ACCOUNT_X, regions: [{name: EU_WEST_1}]}
                ]
            }
        };

        const defaultConfig = {
            region: EU_WEST_1,
            rootAccountId: ACCOUNT_X,
            cluster: 'testCluster',
            configAggregator: 'configAggregator'
        };

        it('should throw if another copy of the ECS task is running', async () => {
            const mockAwsClient = {
                createEcsClient() {
                    return {
                        getAllClusterTasks: async () => [
                            {taskDefinitionArn: `arn:aws:ecs:eu-west-1:${ACCOUNT_X}:task-definition/workload-discovery-taskgroup:1`},
                            {taskDefinitionArn: `arn:aws:ecs:eu-west-1:${ACCOUNT_X}:task-definition/workload-discovery-taskgroup:2`}
                        ]
                    }
                }
            };

            return initialise({...defaultMockAwsClient, ...mockAwsClient}, defaultAppSync, defaultConfig)
                .catch(err => assert.strictEqual(err.message, 'Discovery process ECS task is already running in cluster.'));
        });

        it('should throw AggregatorNotFoundError if config aggregator does not exist in AWS organization', async () => {
            const mockAwsClient = {
                createConfigServiceClient() {
                    return {
                        async getConfigAggregator() {
                            const error = new Error();
                            error.name = 'NoSuchConfigurationAggregatorException';
                            throw error;
                        }
                    }
                }
            };

            return initialise({...defaultMockAwsClient, ...mockAwsClient}, defaultAppSync, {...defaultConfig, crossAccountDiscovery: AWS_ORGANIZATIONS})
                .then(() => {
                    throw new Error('Expected error not thrown.');
                })
                .catch(err => {
                    assert.instanceOf(err, AggregatorNotFoundError);
                    assert.strictEqual(err.message, `Aggregator ${defaultConfig.configAggregator} was not found`);
                });
        });

        it('should throw OrgAggregatorValidationError if config aggregator is not org wide in AWS organization mode', async () => {
            const mockAwsClient = {
                createConfigServiceClient() {
                    return {
                        async getConfigAggregator() {
                            return {};
                        }
                    }
                }
            };

            return initialise({...defaultMockAwsClient, ...mockAwsClient}, defaultAppSync, {...defaultConfig, crossAccountDiscovery: AWS_ORGANIZATIONS})
                .then(() => {
                    throw new Error('Expected error not thrown.');
                })
                .catch(err => {
                    assert.instanceOf(err, OrgAggregatorValidationError);
                    assert.strictEqual(err.message, 'Config aggregator is not an organization wide aggregator');
                });
        });

    });

});