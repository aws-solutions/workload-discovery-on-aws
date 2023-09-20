// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {assert} = require('chai');
const {initialise} = require('../src/lib/intialisation');

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
            cluster: 'testCluster'
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

    });

});