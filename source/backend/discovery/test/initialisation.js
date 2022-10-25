const {assert} = require('chai');
const sinon = require('sinon');
const {ACCESS_DENIED} = require('../src/lib/constants')
const {initialise} = require('../src/lib/intialisation');

describe('initialisation', () => {
    const ACCOUNT_X = 'xxxxxxxxxxxx';
    const ACCOUNT_Y = 'yyyyyyyyyyyy';
    const EU_WEST_1= 'eu-west-1';

    describe('initialise', () => {

        const defaultMockAwsClient = {
            createEcsClient() {
                return {
                    getAllClusterTasks: async arn => [
                        {taskDefinitionArn: `arn:aws:ecs:eu-west-1:${ACCOUNT_X}:task-definition/workload-discovery-taskgroup:1`}
                    ]
                }
            },
            createConfigServiceClient() {
                return {}
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

        it('should throw when no accounts to scan', async () => {
            const mockAppSync = () => {
                return {
                    getAccounts: async () => []
                }
            };

            return initialise(defaultMockAwsClient, mockAppSync, defaultConfig)
                .catch(err => assert.strictEqual(err.message, 'No accounts to scan') );

        });

        it('should handle errors when retrieving credential by assuming the discovery role', async () => {
            const mockAwsClient = {
                createStsClient() {
                    const accessError = new Error();
                    accessError.Code = ACCESS_DENIED;

                    return {
                        getCurrentCredentials: async () => {
                            return {accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};
                        },
                        getCredentials: sinon.stub()
                            .onFirstCall().rejects(accessError)
                            .onSecondCall().resolves({accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'})
                    }
                }
            };

            const mockAppSync = () => {
                return {
                    getAccounts: async () => [
                        {accountId: ACCOUNT_X, regions: [{name: EU_WEST_1}]},
                        {accountId: ACCOUNT_Y, regions: [{name: EU_WEST_1}]}
                    ]
                }
            };

            const {accountsMap} = await initialise({...defaultMockAwsClient, ...mockAwsClient}, mockAppSync, defaultConfig);
            assert.strictEqual(accountsMap.size, 1)
        });

    });

});