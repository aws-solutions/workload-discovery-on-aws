// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const rewire = require('rewire');
const dynamoDbLocal = require('dynamo-db-local');
const sinon = require('sinon');
const { DynamoDB, DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument, BatchWriteCommand, BatchGetCommand} = require('@aws-sdk/lib-dynamodb');
const {assert} = require('chai');
const {mockClient} = require('aws-sdk-client-mock');
const resourceRegionMetadataInput = require('./fixtures/resourceRegionMetadata/input.json');
const expected = require("./fixtures/getResourcesMetadata/default-expected.json");

const index = rewire('../src/index');

const endpoint = `http://localhost:${process.env.CODEBUILD_BUILD_ID == null ? 4567 : 9000}`;

const dbClient = new DynamoDB({
    region: 'eu-west-1',
    endpoint,
    credentials: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey'
    }
});

const docClient = DynamoDBDocument.from(dbClient);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createTable(TableName) {
    return dbClient.createTable({
        AttributeDefinitions: [
            {
                AttributeName: 'PK',
                AttributeType: 'S'
            },
            {
                AttributeName: 'SK',
                AttributeType: 'S'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'PK',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'SK',
                KeyType: 'RANGE'
            }
        ],
        TableName,
        BillingMode: 'PAY_PER_REQUEST'
    });
}

describe('index.js', () => {

    describe('handler', () => {
        const mockEc2Client = {
            async describeRegions() {
                return {
                    Regions: [
                        {RegionName: 'eu-west-1'},
                        {RegionName: 'eu-west-2'},
                        {RegionName: 'eu-central-1'},
                        {RegionName: 'us-east-1'},
                        {RegionName: 'us-east-2'},
                    ]
                }
            }
        }

        let dynamoDbLocalProcess
        before(async function() {
            this.timeout(5000);
            dynamoDbLocalProcess = dynamoDbLocal.spawn({ port: 4567 });
            await sleep(2000);
        });

        const handler = index.__get__('handler');

        describe('addAccounts', () => {
            const DB_TABLE = 'addAccountsTable';

            const mockPutConfigurationAggregator = sinon.stub().resolves({})

            const mockConfig = {
                putConfigurationAggregator: mockPutConfigurationAggregator
            };

            beforeEach(async () => {
                await createTable(DB_TABLE);
            });

            it('should reject invalid account ids in accounts field', async () => {
                return handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            },
                            {
                                accountId: 'xxx',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    },
                                    {
                                        name: 'us-east-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                }).catch(err => {
                    assert.strictEqual(err.message, 'The following account ids are invalid: xxx');
                });
            });

            it('should reject invalid regions in accounts field', async () => {
                return handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'invalid-region'
                                    }
                                ]
                            },
                            {
                                accountId: '222222222222',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    },
                                    {
                                        name: 'us-east-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                }).catch(err => {
                    assert.strictEqual(err.message, 'The following regions are invalid: invalid-region');
                });
            });

            it('should add account', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            },
                            {
                                accountId: '222222222222',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    },
                                    {
                                        name: 'us-east-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111',
                                '222222222222'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1',
                                'eu-west-2',
                                'us-east-1',
                                'us-east-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        SK:'111111111111',
                        name: 'test',
                        accountId: '111111111111',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'eu-west-1'
                            },
                            {
                                name: 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    },
                    {
                        SK: '222222222222',
                        name: 'test',
                        accountId: '222222222222',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'us-east-1'
                            },
                            {
                                name: 'us-east-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should add account in AWS Organizations mode', async () => {
                const mockConfig = {
                    putConfigurationAggregator: sinon.stub().rejects(new Error(
                        'The configuration aggregator cannot be created because your aggregator source type changed for that aggregator.'
                    ))
                };

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test',
                                isManagementAccount: true,
                                isIamRoleDeployed: true,
                                organizationId: 'test-org',
                                lastCrawled: new Date('2011-06-21').toISOString(),
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            },
                            {
                                accountId: '222222222222',
                                name: 'test',
                                isManagementAccount: false,
                                isIamRoleDeployed: true,
                                organizationId: 'test-org',
                                lastCrawled: new Date('2014-04-09').toISOString(),
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    },
                                    {
                                        name: 'us-east-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        SK:'111111111111',
                        name: 'test',
                        accountId: '111111111111',
                        PK: 'Account',
                        isManagementAccount: true,
                        isIamRoleDeployed: true,
                        organizationId: 'test-org',
                        lastCrawled: '2011-06-21T00:00:00.000Z',
                        regions: [
                            {
                                name: 'eu-west-1'
                            },
                            {
                                name: 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    },
                    {
                        SK: '222222222222',
                        name: 'test',
                        accountId: '222222222222',
                        PK: 'Account',
                        isManagementAccount: false,
                        isIamRoleDeployed: true,
                        organizationId: 'test-org',
                        lastCrawled: '2014-04-09T00:00:00.000Z',
                        regions: [
                            {
                                name: 'us-east-1'
                            },
                            {
                                name: 'us-east-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should remove duplicate regions before adding account', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1',
                                'eu-west-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        SK:'111111111111',
                        name: 'test',
                        accountId: '111111111111',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'eu-west-1'
                            },
                            {
                                name: 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should overwrite account', async () => {
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '333333333333',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }],
                        accountId: '333333333333',
                        type: 'account'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '333333333333',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    },
                                    {
                                        name: 'us-east-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '333333333333'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'us-east-1',
                                'us-east-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        SK: '333333333333',
                        name: 'test',
                        accountId: '333333333333',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'us-east-1'
                            },
                            {
                                name: 'us-east-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should ignore duplicate accounts', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            },
                            {
                                accountId: '111111111111',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    },
                                    {
                                        name: 'us-east-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1',
                                'eu-west-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        SK: '111111111111',
                        name: 'test',
                        accountId: '111111111111',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'eu-west-1'
                            },
                            {
                                name: 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should handle unprocessed items that resolve after retry', async () => {
                const dynamoDB = new DynamoDBClient({
                    region: 'eu-west-1',
                    endpoint,
                    credentials: {
                        accessKeyId: 'accessKeyId',
                        secretAccessKey: 'secretAccessKey'
                    }
                });

                const docClient = DynamoDBDocument.from(dynamoDB);

                const ddbMock = mockClient(docClient);

                ddbMock
                    .on(BatchWriteCommand)
                    .resolvesOnce({UnprocessedItems: {
                            addAccountsTable: [
                                {
                                    PutRequest: {
                                        Item: {
                                            PK: 'Account',
                                            SK: '111111111111',
                                            type: 'account',
                                            accountId: '111111111111',
                                            name: 'test',
                                            regions: [
                                                {
                                                    name: 'eu-west-1'
                                                },
                                                {
                                                    name: 'eu-west-2'
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    PutRequest: {
                                        Item: {
                                            PK: 'Account',
                                            SK: '222222222222',
                                            type: 'account',
                                            accountId: '222222222222',
                                            name: 'test',
                                            regions: [
                                                {
                                                    name: 'us-east-1'
                                                },
                                                {
                                                    name: 'us-east-2'
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }});

                ddbMock.send.callThrough();

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator', RETRY_TIME: 10})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            },
                            {
                                accountId: '222222222222',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    },
                                    {
                                        name: 'us-east-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                assert.deepEqual(actual, {
                        unprocessedAccounts: []
                    }
                );

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111',
                                '222222222222'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1',
                                'eu-west-2',
                                'us-east-1',
                                'us-east-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        SK:'111111111111',
                        name: 'test',
                        accountId: '111111111111',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'eu-west-1'
                            },
                            {
                                name: 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    },
                    {
                        SK: '222222222222',
                        name: 'test',
                        accountId: '222222222222',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'us-east-1'
                            },
                            {
                                name: 'us-east-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should handle unprocessed items that do not resolve after retry', async () => {
                const dynamoDB = new DynamoDBClient({
                    region: 'eu-west-1',
                    endpoint,
                    credentials: {
                        accessKeyId: 'accessKeyId',
                        secretAccessKey: 'secretAccessKey'
                    }
                });

                const docClient = DynamoDBDocument.from(dynamoDB);

                const ddbMock = mockClient(docClient);

                ddbMock
                    .on(BatchWriteCommand)
                    .resolves({UnprocessedItems: {
                            addAccountsTable: [
                                {
                                    PutRequest: {
                                        Item: {
                                            PK: 'Account',
                                            SK: '111111111111',
                                            type: 'account',
                                            accountId: '111111111111',
                                            name: 'test',
                                            regions: [
                                                {
                                                    name: 'eu-west-1'
                                                },
                                                {
                                                    name: 'eu-west-2'
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    PutRequest: {
                                        Item: {
                                            PK: 'Account',
                                            SK: '222222222222',
                                            type: 'account',
                                            accountId: '222222222222',
                                            name: 'test',
                                            regions: [
                                                {
                                                    name: 'us-east-1'
                                                },
                                                {
                                                    name: 'us-east-2'
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }});

                ddbMock.send.callThrough();

                const actual = await handler(mockEc2Client, docClient, mockConfig, {
                    DB_TABLE,
                    RETRY_TIME: 10,
                    CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            },
                            {
                                accountId: '222222222222',
                                name: 'test',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    },
                                    {
                                        name: 'us-east-2'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                assert.deepEqual(actual, {
                        unprocessedAccounts: [
                            '111111111111',
                            '222222222222'
                        ]
                    }
                );

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111',
                                '222222222222'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1',
                                'eu-west-2',
                                'us-east-1',
                                'us-east-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, []);

            }).timeout(6250);

            afterEach(async function() {
                mockPutConfigurationAggregator.resetHistory();
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

        });

        describe('addRegions', () => {
            const DB_TABLE = 'addRegionsTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            before(async () => {
                await createTable(DB_TABLE);
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '111111111111',
                        name: 'testAccount',
                        lastCrawled: 'new Date()',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }],
                        accountId: '111111111111',
                        type: 'account'
                    }
                });
            });

            it('should add regions', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        regions: [
                            {name: 'eu-central-1'}
                        ]
                    },
                    info: {
                        fieldName: 'addRegions'
                    }
                });

                assert.deepEqual(actual, {
                    accountId: '111111111111',
                    regions: [
                        {name: 'eu-central-1'},
                        {name: "eu-west-1"},
                        {name: "eu-west-2"}
                    ],
                    lastCrawled: "new Date()",
                    name: "testAccount"
                });

                const {Item: actualDb} = await docClient.get({
                    TableName: DB_TABLE,
                    Key: {
                        PK: 'Account',
                        SK: '111111111111'
                    }});

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-central-1',
                                'eu-west-1',
                                'eu-west-2'
                            ]
                        }
                    ]
                });

                assert.deepEqual(actualDb, {
                    SK:'111111111111',
                    accountId: '111111111111',
                    PK: 'Account',
                    regions: [
                        {
                            name: 'eu-central-1'
                        },
                        {
                            name: 'eu-west-1'
                        },
                        {
                            name: 'eu-west-2'
                        }
                    ],
                    lastCrawled: 'new Date()',
                    name: 'testAccount',
                    type: 'account'
                });
            });

            it('should ignore duplicates regions', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        regions: [
                            {name: 'eu-central-1'},
                            {name: 'eu-central-1'}
                        ]
                    },
                    info: {
                        fieldName: 'addRegions'
                    }
                });

                assert.deepEqual(actual, {
                    accountId: '111111111111',
                    regions: [
                        {name: 'eu-central-1'},
                        {name: "eu-west-1"},
                        {name: "eu-west-2"}
                    ],
                    lastCrawled: 'new Date()',
                    name: 'testAccount'
                });

                const {Item: actualDb} = await docClient.get({
                    TableName: DB_TABLE,
                    Key: {
                        PK: 'Account',
                        SK: '111111111111'
                    }});

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-central-1',
                                'eu-west-1',
                                'eu-west-2'
                            ]
                        }
                    ]
                });

                assert.deepEqual(actualDb, {
                    SK:'111111111111',
                    accountId: '111111111111',
                    PK: 'Account',
                    lastCrawled: 'new Date()',
                    name: 'testAccount',
                    regions: [
                        {
                            name: 'eu-central-1'
                        },
                        {
                            name: 'eu-west-1'
                        },
                        {
                            name: 'eu-west-2'
                        }
                    ],
                    type: 'account'
                });
            });

            after(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

        });

        describe('deleteAccounts', () => {
            const DB_TABLE = 'deleteAccountsTable';
            const ACCOUNT_ID = 'xxxxxxxxxxxx';
            const AWS_REGION = 'ap-south-1';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            beforeEach(async () => {
                await createTable(DB_TABLE);
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '111111111111',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }],
                        accountId: '111111111111',
                        type: 'account'
                    }
                });
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '222222222222',
                        regions: [{
                            name: 'us-west-1'
                        }, {
                            name: 'us-west-2'
                        }],
                        accountId: '222222222222',
                        type: 'account'
                    }
                });
            });

            it('should reject invalid account ids in the accountIds field', async () => {
                return handler(mockEc2Client, docClient, mockConfig, {
                    ACCOUNT_ID,
                    AWS_REGION,
                    DB_TABLE,
                    RETRY_TIME: 10,
                    CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountIds: ['xxx', '222222222222', 'aws']
                    },
                    info: {
                        fieldName: 'deleteAccounts'
                    }
                }).catch(err => {
                    assert.strictEqual(err.message, 'The following account ids are invalid: xxx');
                });
            });

            it('should delete account', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {
                    ACCOUNT_ID,
                    AWS_REGION,
                    DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'
                })({
                    arguments: {
                        accountIds: ['222222222222']
                    },
                    info: {
                        fieldName: 'deleteAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1',
                                'eu-west-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        SK:'111111111111',
                        accountId: '111111111111',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'eu-west-1'
                            },
                            {
                                name: 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should delete account in AWS Organizations mode', async () => {
                const mockConfig = {
                    putConfigurationAggregator: sinon.stub().rejects(new Error(
                        'The configuration aggregator cannot be created because your aggregator source type changed for that aggregator.'
                    ))
                };

                const actual = await handler(mockEc2Client, docClient, mockConfig, {
                    ACCOUNT_ID,
                    AWS_REGION,
                    DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'
                })({
                    arguments: {
                        accountIds: ['222222222222']
                    },
                    info: {
                        fieldName: 'deleteAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        SK:'111111111111',
                        accountId: '111111111111',
                        PK: 'Account',
                        regions: [
                            {
                                name: 'eu-west-1'
                            },
                            {
                                name: 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should supply default account and region to aggregator when all accounts removed', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {
                    ACCOUNT_ID,
                    AWS_REGION,
                    DB_TABLE,
                    CONFIG_AGGREGATOR: 'aggregrator'
                })({
                    arguments: {
                        accountIds: ['111111111111', '222222222222']
                    },
                    info: {
                        fieldName: 'deleteAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                'xxxxxxxxxxxx'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'ap-south-1'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, []);
            });

            it('should handle unprocessed items that resolve after retry', async () => {
                const dynamoDB = new DynamoDBClient({
                    region: 'eu-west-1',
                    endpoint,
                    credentials: {
                        accessKeyId: 'accessKeyId',
                        secretAccessKey: 'secretAccessKey'
                    }
                });

                const docClient = DynamoDBDocument.from(dynamoDB);

                const ddbMock = mockClient(docClient);

                ddbMock
                    .on(BatchWriteCommand)
                    .resolvesOnce({
                        UnprocessedItems: {
                            deleteAccountsTable: [
                                {
                                    DeleteRequest: {
                                        Key: {
                                            PK: 'Account',
                                            SK: '222222222222'
                                        }
                                    }
                                }
                            ]
                        }
                    });

                ddbMock.send.callThrough();

                const actual = await handler(mockEc2Client, docClient, mockConfig, {
                    ACCOUNT_ID,
                    AWS_REGION,
                    DB_TABLE,
                    RETRY_TIME: 10,
                    CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountIds: ['222222222222']
                    },
                    info: {
                        fieldName: 'deleteAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: []
                });

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1',
                                'eu-west-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        PK: 'Account',
                        SK: '111111111111',
                        accountId: '111111111111',
                        regions: [
                            {
                                'name': 'eu-west-1'
                            },
                            {
                                'name': 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            it('should handle unprocessed items that do not resolve after retry', async () => {
                const dynamoDB = new DynamoDBClient({
                    region: 'eu-west-1',
                    endpoint,
                    credentials: {
                        accessKeyId: 'accessKeyId',
                        secretAccessKey: 'secretAccessKey'
                    }
                });

                const docClient = DynamoDBDocument.from(dynamoDB);

                const ddbMock = mockClient(docClient);

                ddbMock
                    .on(BatchWriteCommand)
                    .resolves({
                        UnprocessedItems: {
                            deleteAccountsTable: [
                                {
                                    DeleteRequest: {
                                        Key: {
                                            PK: 'Account',
                                            SK: '222222222222'
                                        }
                                    }
                                }
                            ]
                        }
                    });
                ddbMock.send.callThrough();

                const actual = await handler(mockEc2Client, docClient, mockConfig, {
                    ACCOUNT_ID,
                    AWS_REGION,
                    DB_TABLE,
                    RETRY_TIME: 10,
                    CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountIds: ['222222222222']
                    },
                    info: {
                        fieldName: 'deleteAccounts'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedAccounts: ['222222222222']
                });

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1',
                                'eu-west-2'
                            ]
                        }
                    ]
                });

                const {Items: actualDb} = await docClient.query({
                    TableName: DB_TABLE,
                    KeyConditionExpression: 'PK = :PK',
                    ExpressionAttributeValues: {
                        ':PK': 'Account'
                    }
                });

                assert.deepEqual(actualDb, [
                    {
                        PK: 'Account',
                        SK: '111111111111',
                        accountId: '111111111111',
                        regions: [
                            {
                                'name': 'eu-west-1'
                            },
                            {
                                'name': 'eu-west-2'
                            }
                        ],
                        type: 'account'
                    },
                    {
                        PK: 'Account',
                        SK: '222222222222',
                        accountId: '222222222222',
                        regions: [
                            {
                                name: 'us-west-1'
                            },
                            {
                                name: 'us-west-2'
                            }
                        ],
                        type: 'account'
                    }
                ]);
            });

            afterEach(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

        });

        describe('deleteRegions', () => {
            const DB_TABLE = 'deleteRegionsTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            before(async () => {
                await createTable(DB_TABLE);
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '111111111111',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }, {
                            name: 'eu-central-1'}
                        ],
                        accountId: '111111111111',
                        type: 'account'
                    }
                });
            });

            it('should reject invalid account id in accountId field', async () => {
                return handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: 'xxx',
                        regions: [
                            {name: 'eu-west-2'},
                            {name: 'eu-central-1'}
                        ]
                    },
                    info: {
                        fieldName: 'deleteRegions'
                    }
                }).catch(err => {
                    assert.strictEqual(err.message, 'xxx is not a valid AWS account id.');
                });
            });

            it('should reject invalid region in regions field', async () => {
                return handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        regions: [
                            {name: 'invalid-region'},
                            {name: 'eu-central-1'}
                        ]
                    },
                    info: {
                        fieldName: 'deleteRegions'
                    }
                }).catch(err => {
                    assert.strictEqual(err.message, 'The following regions are invalid: invalid-region');
                });
            });

            it('should reject deletions that remove all regions', async () => {
                return handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }, {
                            name: 'eu-central-1'}
                        ]
                    },
                    info: {
                        fieldName: 'deleteRegions'
                    }
                }).catch(err => {
                    assert.strictEqual(err.message, 'Unable to delete region(s), an account must have at least one region.');
                });
            });

            it('should delete regions', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        regions: [
                            {name: 'eu-west-2'},
                            {name: 'eu-central-1'}
                        ]
                    },
                    info: {
                        fieldName: 'deleteRegions'
                    }
                });

                assert.deepEqual(actual, {
                    accountId: '111111111111',
                    regions: [
                        {name: 'eu-west-1'}
                    ]
                });

                const {Item: actualDb} = await docClient.get({
                    TableName: DB_TABLE,
                    Key: {
                        PK: 'Account',
                        SK: '111111111111'
                    }});

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1'
                            ]
                        }
                    ]
                });

                assert.deepEqual(actualDb, {
                    SK:'111111111111',
                    accountId: '111111111111',
                    PK: 'Account',
                    regions: [
                        {
                            name: 'eu-west-1'
                        }
                    ],
                    type: 'account'
                });
            });

            it('should ignore duplicate regions', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        regions: [
                            {name: 'eu-west-2'},
                            {name: 'eu-west-2'},
                            {name: 'eu-central-1'}
                        ]
                    },
                    info: {
                        fieldName: 'deleteRegions'
                    }
                });

                assert.deepEqual(actual, {
                    accountId: '111111111111',
                    regions: [
                        {name: 'eu-west-1'}
                    ]
                });

                const {Item: actualDb} = await docClient.get({
                    TableName: DB_TABLE,
                    Key: {
                        PK: 'Account',
                        SK: '111111111111'
                    }});

                sinon.assert.calledWith(mockConfig.putConfigurationAggregator, {
                    ConfigurationAggregatorName: 'aggregrator',
                    AccountAggregationSources: [
                        {
                            AccountIds: [
                                '111111111111'
                            ],
                            AllAwsRegions: false,
                            AwsRegions: [
                                'eu-west-1'
                            ]
                        }
                    ]
                });

                assert.deepEqual(actualDb, {
                    SK:'111111111111',
                    accountId: '111111111111',
                    PK: 'Account',
                    regions: [
                        {
                            name: 'eu-west-1'
                        }
                    ],
                    type: 'account'
                });
            });


            after(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

        });

        describe('getAccounts', () => {
            const DB_TABLE = 'getAccountsTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            before(async () => {
                await createTable(DB_TABLE);
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '111111111111',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }],
                        accountId: '111111111111',
                        type: 'account'
                    }
                });
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '222222222222',
                        regions: [{
                            name: 'us-west-1'
                        }, {
                            name: 'us-west-2'
                        }],
                        accountId: '222222222222',
                        type: 'account'
                    }
                });
            });

            it('should get accounts', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    info: {
                        fieldName: 'getAccounts'
                    },
                    arguments: {}
                });

                assert.deepEqual(actual, [{
                    accountId: '111111111111',
                    regions: [{
                        name: 'eu-west-1'
                    }, {
                        name: 'eu-west-2'
                    }]
                },
                    {
                        accountId: '222222222222',
                        regions: [{
                            name: 'us-west-1'
                        }, {
                            name: 'us-west-2'
                        }]
                    }
                ]);
            });


            after(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

        });

        describe('getAccount', () => {
            const DB_TABLE = 'getAccountTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            before(async () => {
                await createTable(DB_TABLE);
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '111111111111',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }],
                        accountId: '111111111111',
                        type: 'account'
                    }
                });
            });

            it('should get account', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111'
                    },
                    info: {
                        fieldName: 'getAccount'
                    }
                });

                assert.deepEqual(actual, {
                    accountId: '111111111111',
                    regions: [{
                        name: 'eu-west-1'
                    }, {
                        name: 'eu-west-2'
                    }]
                });
            });


            after(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

        });

        describe('updateAccount', () => {
            const DB_TABLE = 'updateAccountTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            before(async () => {
                await createTable(DB_TABLE);
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '111111111111',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }],
                        accountId: '111111111111',
                        type: 'account'
                    }
                });
            });

            it('should update account', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        lastCrawled: 'new Date()'
                    },
                    info: {
                        fieldName: 'updateAccount'
                    }
                });

                assert.deepEqual(actual, {
                    accountId: '111111111111',
                    lastCrawled: 'new Date()'
                });

                const {Item: actualDb} = await docClient.get({
                    TableName: DB_TABLE,
                    Key: {
                        PK: 'Account',
                        SK: '111111111111'
                    }});

                assert.deepEqual(actualDb, {
                    SK:'111111111111',
                    accountId: '111111111111',
                    PK: 'Account',
                    lastCrawled: 'new Date()',
                    regions: [
                        {
                            name: 'eu-west-1'
                        },
                        {
                            name: 'eu-west-2'
                        }
                    ],
                    type: 'account'
                });

            });


            after(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

        });

        describe('updateRegions', () => {
            const DB_TABLE = 'updateRegionsTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            before(async () => {
                await createTable(DB_TABLE);
                await docClient.put({
                    TableName : DB_TABLE,
                    Item: {
                        PK: 'Account',
                        SK: '111111111111',
                        regions: [{
                            name: 'eu-west-1'
                        }, {
                            name: 'eu-west-2'
                        }],
                        accountId: '111111111111',
                        type: 'account'
                    }
                });
            });

            it('should update regions', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        regions: [
                            {name: 'eu-west-1', lastCrawled: 'new Date()1'},
                            {name: 'eu-west-2', lastCrawled: 'new Date()2'}
                        ]
                    },
                    info: {
                        fieldName: 'updateRegions'
                    }
                });

                assert.deepEqual(actual, {
                    accountId: '111111111111',
                    regions: [
                        {name: 'eu-west-1', lastCrawled: 'new Date()1'},
                        {name: 'eu-west-2', lastCrawled: 'new Date()2'}
                    ]
                });

                const {Item: actualDb} = await docClient.get({
                    TableName: DB_TABLE,
                    Key: {
                        PK: 'Account',
                        SK: '111111111111'
                    }});

                assert.deepEqual(actualDb, {
                    SK:'111111111111',
                    accountId: '111111111111',
                    PK: 'Account',
                    regions: [
                        {
                            name: 'eu-west-1',
                            lastCrawled: 'new Date()1'
                        },
                        {
                            name: 'eu-west-2',
                            lastCrawled: 'new Date()2'
                        }
                    ],
                    type: 'account'
                });
            });

            it('should ignore duplicate regions', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accountId: '111111111111',
                        regions: [
                            {name: 'eu-west-1', lastCrawled: 'new Date()1'},
                            {name: 'eu-west-2', lastCrawled: 'new Date()2'},
                            {name: 'eu-west-2', lastCrawled: 'new Date()2'}
                        ]
                    },
                    info: {
                        fieldName: 'updateRegions'
                    }
                });

                assert.deepEqual(actual, {
                    accountId: '111111111111',
                    regions: [
                        {name: 'eu-west-1', lastCrawled: 'new Date()1'},
                        {name: 'eu-west-2', lastCrawled: 'new Date()2'},
                        {name: 'eu-west-2', lastCrawled: 'new Date()2'}
                    ]
                });

                const {Item: actualDb} = await docClient.get({
                    TableName: DB_TABLE,
                    Key: {
                        PK: 'Account',
                        SK: '111111111111'
                    }});

                assert.deepEqual(actualDb, {
                    SK:'111111111111',
                    accountId: '111111111111',
                    PK: 'Account',
                    regions: [
                        {
                            name: 'eu-west-1',
                            lastCrawled: 'new Date()1'
                        },
                        {
                            name: 'eu-west-2',
                            lastCrawled: 'new Date()2'
                        }
                    ],
                    type: 'account'
                });
            });


            after(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

        });

        describe('getResourcesMetadata', () => {

            const DB_TABLE = 'getResourcesMetadataTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            beforeEach(async () => {
                await createTable(DB_TABLE);
            });

            afterEach(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

            it('should handle no accounts', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {},
                    info: {
                        fieldName: 'getResourcesMetadata'
                    }
                });

                assert.deepEqual(actual, {
                    accounts: [],
                    count: 0,
                    resourceTypes: []
                });
            });

            it('should ignore accounts with no metadata', async () => {
                const expected = require('./fixtures/getResourcesMetadata/no-metadata-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ]
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {},
                    info: {
                        fieldName: 'getResourcesMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

            it('should return meta data broken down by account and resource type', async () => {
                const expected = require('./fixtures/getResourcesMetadata/default-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {},
                    info: {
                        fieldName: 'getResourcesMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

        });

        describe('getResourcesAccountMetadata', () => {

            const DB_TABLE = 'getResourcesAccountMetadataTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            beforeEach(async () => {
                await createTable(DB_TABLE);
            });

            afterEach(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

            it('should handle no accounts', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {},
                    info: {
                        fieldName: 'getResourcesAccountMetadata'
                    }
                });

                assert.deepEqual(actual, []);
            });

            it('should ignore accounts with no metadata', async () => {
                const expected = require('./fixtures/getResourcesAccountMetadata/no-metadata-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: null
                    },
                    info: {
                        fieldName: 'getResourcesAccountMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

            it('should return per account metadata broken down by resource type', async () => {
                const expected = require('./fixtures/getResourcesAccountMetadata/default-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: null
                    },
                    info: {
                        fieldName: 'getResourcesAccountMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

            it('should return per account metadata broken down by resource type filtered by account', async () => {
                const expected = require('./fixtures/getResourcesAccountMetadata/account-filter-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [{accountId: '111111111111'}]
                    },
                    info: {
                        fieldName: 'getResourcesAccountMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

            it('should handle unprocessed keys that resolve after retry', async () => {
                const expected = require('./fixtures/getResourcesAccountMetadata/account-filter-expected.json');

                const dynamoDB = new DynamoDBClient({
                    region: 'eu-west-1',
                    endpoint,
                    credentials: {
                        accessKeyId: 'accessKeyId',
                        secretAccessKey: 'secretAccessKey'
                    }
                });

                const docClient = DynamoDBDocument.from(dynamoDB);

                const ddbMock = mockClient(docClient);

                ddbMock
                    .on(BatchGetCommand)
                    .resolvesOnce({
                        Responses: {
                            [DB_TABLE]: []
                        },
                        UnprocessedKeys: {
                            [DB_TABLE]: {
                                Keys: [
                                    {PK: 'Account', SK: '111111111111'}
                                ],
                                ProjectionExpression: 'resourcesRegionMetadata'
                            }
                        }
                    });

                ddbMock.send.callThrough();

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator', RETRY_TIME: 10})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [{accountId: '111111111111'}]
                    },
                    info: {
                        fieldName: 'getResourcesAccountMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

            it('should return per account metadata broken down by resource type filtered by account and region', async () => {
                const expected = require('./fixtures/getResourcesAccountMetadata/account-region-filter-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {accountId: '111111111111', regions: [{name: 'eu-west-1'}]},
                            {accountId: '222222222222'}
                        ]
                    },
                    info: {
                        fieldName: 'getResourcesAccountMetadata'
                    }
                });

                assert.deepEqual(actual.sort((a, b) => a.accountId - b.accountId), expected);
            });

        });

        describe('getResourcesRegionMetadata', () => {

            const DB_TABLE = 'getResourcesRegionMetadataTable';

            const mockConfig = {
                putConfigurationAggregator: sinon.stub().resolves({})
            };

            beforeEach(async () => {
                await createTable(DB_TABLE);
            });

            afterEach(async function() {
                return dbClient.deleteTable({TableName: DB_TABLE});
            });

            it('should handle no accounts', async () => {
                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {},
                    info: {
                        fieldName: 'getResourcesRegionMetadata'
                    }
                });

                assert.deepEqual(actual, []);
            });

            it('should ignore accounts with no metadata', async () => {
                const expected = require('./fixtures/getResourcesRegionMetadata/no-metadata-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ]
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: null
                    },
                    info: {
                        fieldName: 'getResourcesRegionMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

            it('should return per account metadata broken down by resource type', async () => {
                const expected = require('./fixtures/getResourcesRegionMetadata/default-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: null
                    },
                    info: {
                        fieldName: 'getResourcesRegionMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

            it('should return per account metadata broken down by resource type filtered by account', async () => {
                const expected = require('./fixtures/getResourcesRegionMetadata/account-filter-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [{accountId: '111111111111'}]
                    },
                    info: {
                        fieldName: 'getResourcesRegionMetadata'
                    }
                });

                assert.deepEqual(actual, expected);
            });

            it('should handle unprocessed keys that resolve after retry', async () => {
                const expected = require('./fixtures/getResourcesRegionMetadata/account-filter-expected.json');

                const dynamoDB = new DynamoDBClient({
                    region: 'eu-west-1',
                    endpoint,
                    credentials: {
                        accessKeyId: 'accessKeyId',
                        secretAccessKey: 'secretAccessKey'
                    }
                });

                const docClient = DynamoDBDocument.from(dynamoDB);

                const ddbMock = mockClient(docClient);

                ddbMock
                    .on(BatchGetCommand)
                    .resolvesOnce({
                        Responses: {
                            [DB_TABLE]: []
                        },
                        UnprocessedKeys: {
                            [DB_TABLE]: {
                                Keys: [
                                    {PK: 'Account', SK: '111111111111'}
                                ],
                                ProjectionExpression: 'resourcesRegionMetadata'
                            }
                        }
                    });

                ddbMock.send.callThrough();

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator', RETRY_TIME: 10})({
                    arguments: {
                        accounts: [{accountId: '111111111111'}]
                    },
                    info: {
                        fieldName: 'getResourcesRegionMetadata'
                    }
                });


                assert.deepEqual(actual, expected);
            });

            it('should return per account metadata broken down by resource type filtered by account and region', async () => {
                const expected = require('./fixtures/getResourcesRegionMetadata/account-region-filter-expected.json');

                await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {
                                accountId: '111111111111',
                                name: 'test111111111111',
                                regions: [
                                    {
                                        name: 'eu-west-1'
                                    },
                                    {
                                        name: 'eu-west-2'
                                    }
                                ],
                                ...resourceRegionMetadataInput['111111111111']
                            },
                            {
                                accountId: '222222222222',
                                name: 'test222222222222',
                                regions: [
                                    {
                                        name: 'us-east-1'
                                    }
                                ],
                                ...resourceRegionMetadataInput['222222222222']
                            }
                        ]
                    },
                    info: {
                        fieldName: 'addAccounts'
                    }
                });

                const actual = await handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {
                        accounts: [
                            {accountId: '111111111111', regions: [{name: 'eu-west-1'}]},
                            {accountId: '222222222222'}
                        ]
                    },
                    info: {
                        fieldName: 'getResourcesRegionMetadata'
                    }
                });

                assert.deepEqual(actual.sort((a, b) => a.accountId - b.accountId), expected);
            });

        });

        describe('unknown query', () => {

            it('should reject payloads with unknown query', async () => {

                const DB_TABLE = 'dbTable';

                const mockConfig = {
                    putConfigurationAggregator: sinon.stub().resolves({})
                };

                return handler(mockEc2Client, docClient, mockConfig, {DB_TABLE, CONFIG_AGGREGATOR: 'aggregrator'})({
                    arguments: {},
                    info: {
                        fieldName: 'foo',
                    }
                }, {}).catch(err => assert.strictEqual(err.message, 'Unknown field, unable to resolve foo.'));
            });

        });

        after(function(done) {
            dynamoDbLocalProcess.kill();
            done();
        })
    });

});