// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {assert} = require('chai');
const sinon = require('sinon');
const {ACCESS_DENIED} = require('../src/lib/constants')
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

        it('should throw when no accounts to scan', async () => {
            const mockAppSync = () => {
                return {
                    getAccounts: async () => [],
                    createPaginator: async () => {}
                }
            };

            return initialise(defaultMockAwsClient, mockAppSync, defaultConfig)
                .then(() => {
                    throw new Error('Expected promise to be rejected but was fullfilled.')
                })
                .catch(err => assert.strictEqual(err.message, 'No accounts to scan.') );

        });

        it('should throw when no accounts because IAM role not installed', async () => {
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
                            .onSecondCall().rejects(accessError)
                    }
                }
            };

            const mockAppSync = () => {
                return {
                    getAccounts: async () => [
                        {accountId: ACCOUNT_X, regions: [{name: EU_WEST_1}]},
                        {accountId: ACCOUNT_Y, regions: [{name: EU_WEST_1}]}
                    ],
                    createPaginator: async () => {}
                }
            };

            return initialise({...defaultMockAwsClient, ...mockAwsClient}, mockAppSync, defaultConfig)
                .then(() => {
                    throw new Error('Expected promise to be rejected but was fullfilled.')
                })
                .catch(err => assert.strictEqual(err.message, 'No accounts to scan.') );

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
                    ],
                    createPaginator: async () => {}
                }
            };

            const {accounts} = await initialise({...defaultMockAwsClient, ...mockAwsClient}, mockAppSync, defaultConfig);
            const accX = accounts.find(x => x.accountId === ACCOUNT_X);
            const accY = accounts.find(x => x.accountId === ACCOUNT_Y);

            assert.isFalse(accX.isIamRoleDeployed);
            assert.isTrue(accY.isIamRoleDeployed);
        });

        it('should retrieve accounts when not in AWS Organization', async () => {
            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCurrentCredentials: async () => {
                            return {accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};
                        },
                        getCredentials: sinon.stub()
                            .onFirstCall().resolves({accessKeyId: 'accessKeyIdX', secretAccessKey: 'secretAccessKeyX', sessionToken: 'sessionTokenX'})
                            .onSecondCall().resolves({accessKeyId: 'accessKeyIdY', secretAccessKey: 'secretAccessKeyY', sessionToken: 'sessionTokenY'})
                    }
                },
                createConfigServiceClient() {
                    return {
                        async getConfigAggregator() {
                            return {
                                OrganizationAggregationSource: {
                                    AllAwsRegions: true
                                }
                            };
                        }
                    }
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}]
                        }
                    };
                }
            };

            const mockAppSync = () => {
                return {
                    createPaginator: async () => {},
                    async getAccounts() {
                        return [
                            {accountId: ACCOUNT_X, name: 'Account X', regions: [{name: EU_WEST_1}, {name: US_EAST_1}]},
                            {accountId: ACCOUNT_Y, name: 'Account Y', regions: [{name: EU_WEST_1}]}
                        ]
                    }
                }
            };

            const {accounts} = await initialise({...defaultMockAwsClient, ...mockAwsClient}, mockAppSync, {
                ...defaultConfig, isUsingOrganizations: false});
            const accX = accounts.find(x => x.accountId === ACCOUNT_X);
            const accY = accounts.find(x => x.accountId === ACCOUNT_Y);

            assert.deepEqual(accX, {
                accountId: ACCOUNT_X,
                credentials: {
                    accessKeyId: 'accessKeyIdX',
                    secretAccessKey: 'secretAccessKeyX',
                    sessionToken: 'sessionTokenX',
                },
                name: 'Account X',
                isIamRoleDeployed: true,
                regions: [
                    EU_WEST_1,
                    US_EAST_1
                ]
            });
            assert.deepEqual(accY, {
                accountId: ACCOUNT_Y,
                credentials: {
                    accessKeyId: 'accessKeyIdY',
                    secretAccessKey: 'secretAccessKeyY',
                    sessionToken: 'sessionTokenY',
                },
                name: 'Account Y',
                isIamRoleDeployed: true,
                regions: [
                    EU_WEST_1
                ]
            });

        });

        it('should retrieve accounts from AWS Organizations', async () => {
            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCurrentCredentials: async () => {
                            return {accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};
                        },
                        getCredentials: sinon.stub()
                            .onFirstCall().resolves({accessKeyId: 'accessKeyIdX', secretAccessKey: 'secretAccessKeyX', sessionToken: 'sessionTokenX'})
                            .onSecondCall().resolves({accessKeyId: 'accessKeyIdY', secretAccessKey: 'secretAccessKeyY', sessionToken: 'sessionTokenY'})
                    }
                },
                createConfigServiceClient() {
                    return {
                        async getConfigAggregator() {
                            return {
                                OrganizationAggregationSource: {
                                    AllAwsRegions: true
                                }
                            };
                        }
                    }
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}]
                        }
                    };
                },
                createOrganizationsClient() {
                    return {
                        async getAllAccounts() {
                            return [
                                {Id: ACCOUNT_X, Name: 'Account X', Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`},
                                {Id: ACCOUNT_Y, Name: 'Account Y', Arn: `arn:aws:organizations:::${ACCOUNT_Y}:account/o-exampleorgid/:${ACCOUNT_Y}`}
                            ]
                        },
                        async getRootAccount() {
                            return {
                                Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`
                            }
                        }
                    }
                }
            };

            const mockAppSync = () => {
                return {
                    createPaginator: async () => {},
                    getAccounts: async () => []
                }
            };

            const {accounts} = await initialise({...defaultMockAwsClient, ...mockAwsClient}, mockAppSync, {
                ...defaultConfig, isUsingOrganizations: true});
            const accX = accounts.find(x => x.accountId === ACCOUNT_X);
            const accY = accounts.find(x => x.accountId === ACCOUNT_Y);

            assert.deepEqual(accX, {
                accountId: ACCOUNT_X,
                credentials: {
                    accessKeyId: 'accessKeyIdX',
                    secretAccessKey: 'secretAccessKeyX',
                    sessionToken: 'sessionTokenX',
                },
                name: 'Account X',
                organizationId: 'o-exampleorgid',
                isIamRoleDeployed: true,
                isManagementAccount: true,
                regions: [
                    EU_WEST_1,
                    US_EAST_1
                ]
            });
            assert.deepEqual(accY, {
                accountId: ACCOUNT_Y,
                credentials: {
                    accessKeyId: 'accessKeyIdY',
                    secretAccessKey: 'secretAccessKeyY',
                    sessionToken: 'sessionTokenY',
                },
                name: 'Account Y',
                organizationId: 'o-exampleorgid',
                isIamRoleDeployed: true,
                isManagementAccount: false,
                regions: [
                    EU_WEST_1,
                    US_EAST_1
                ]
            });

        });

        it('should add last crawled time to accounts from AWS Organizations', async () => {
            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCurrentCredentials: async () => {
                            return {accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};
                        },
                        getCredentials: sinon.stub()
                            .onFirstCall().resolves({accessKeyId: 'accessKeyIdX', secretAccessKey: 'secretAccessKeyX', sessionToken: 'sessionTokenX'})
                            .onSecondCall().resolves({accessKeyId: 'accessKeyIdY', secretAccessKey: 'secretAccessKeyY', sessionToken: 'sessionTokenY'})
                    }
                },
                createConfigServiceClient() {
                    return {
                        async getConfigAggregator() {
                            return {
                                OrganizationAggregationSource: {
                                    AllAwsRegions: true
                                }
                            };
                        }
                    }
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}]
                        }
                    };
                },
                createOrganizationsClient() {
                    return {
                        async getAllAccounts() {
                            return [
                                {Id: ACCOUNT_X, Name: 'Account X', Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`},
                                {Id: ACCOUNT_Y, Name: 'Account Y', Arn: `arn:aws:organizations:::${ACCOUNT_Y}:account/o-exampleorgid/:${ACCOUNT_Y}`}
                            ]
                        },
                        async getRootAccount() {
                            return {
                                Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`
                            }
                        }
                    }
                }
            };

            const mockAppSync = () => {
                return {
                    createPaginator: async () => {},
                    getAccounts: async () => [
                        {
                            accountId: ACCOUNT_X,
                            name: 'Account X',
                            lastCrawled: new Date('2022-10-25').toISOString(),
                            regions: [{name: EU_WEST_1}, {name: US_EAST_1}]},
                    ]
                }
            };

            const {accounts} = await initialise({...defaultMockAwsClient, ...mockAwsClient}, mockAppSync, {
                ...defaultConfig, isUsingOrganizations: true});
            const accX = accounts.find(x => x.accountId === ACCOUNT_X);
            const accY = accounts.find(x => x.accountId === ACCOUNT_Y);

            assert.deepEqual(accX, {
                accountId: ACCOUNT_X,
                credentials: {
                    accessKeyId: 'accessKeyIdX',
                    secretAccessKey: 'secretAccessKeyX',
                    sessionToken: 'sessionTokenX',
                },
                name: 'Account X',
                organizationId: 'o-exampleorgid',
                isIamRoleDeployed: true,
                isManagementAccount: true,
                lastCrawled: '2022-10-25T00:00:00.000Z',
                regions: [
                    EU_WEST_1,
                    US_EAST_1
                ]
            });
            assert.deepEqual(accY, {
                accountId: ACCOUNT_Y,
                credentials: {
                    accessKeyId: 'accessKeyIdY',
                    secretAccessKey: 'secretAccessKeyY',
                    sessionToken: 'sessionTokenY',
                },
                name: 'Account Y',
                organizationId: 'o-exampleorgid',
                isIamRoleDeployed: true,
                isManagementAccount: false,
                regions: [
                    EU_WEST_1,
                    US_EAST_1
                ]
            });

        });

    });

});