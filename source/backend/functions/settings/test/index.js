const rewire = require('rewire');
const index = rewire('../src');
const sinon = require('sinon');
const {assert} = require('chai');

describe('index.js', () => {
    
    const queryResult = {
        Items: [
            {
                PK: 'Account',
                SK: 'ACCNUMBER#123453#FOO'
            },
            {
                PK: 'Account',
                SK: 'ACCNUMBER#123453#BAR'
            },
            {
                PK: 'Account',
                SK: 'ACCNUMBER#123453#BAZ'
            },
            {
                PK: 'Account',
                SK: 'ACCNUMBER#54321#FOO'
            },
            {
                PK: 'Account',
                SK: 'ACCNUMBER#54321#BAR'
            }
        ]
    };

    const unprocessed =
        {
            'UnprocessedItems': {
                'Table_Name': [
                    {
                        'DeleteRequest': {
                            'Key': {
                                PK: 'Account',
                                SK: 'ACCNUMBER#123453#FOO'
                            }
                        }
                    },
                    {
                        'DeleteRequest': {
                            'Key': {
                                PK: 'Account',
                                SK: 'ACCNUMBER#123453#BAR'
                            }
                        }
                    }
                ]
            }
        };

    const empty = {UnprocessedItems: []};

    describe('getAccounts', () => {
        const getAccounts = index.__get__('getAccounts');

        const queryResult = {Items: [
                {
                    'lastCrawled': '2020-08-20T16:52:13.754Z',
                    'SK': 'ACCNUMBER#12345#METADATA',
                    'PK': 'Account',
                    'accountId': '12345',
                    'type': 'account'
                },
                {
                    'lastCrawled': '2020-08-20T16:52:13.582Z',
                    'SK': 'ACCNUMBER#12345#REGION#eu-west-1',
                    'PK': 'Account',
                    'accountId': '12345',
                    'name': 'eu-west-1',
                    'type': 'region'
                }, {
                    'lastCrawled': '2020-08-20T16:52:13.754Z',
                    'SK': 'ACCNUMBER#54321#METADATA',
                    'PK': 'Account',
                    'accountId': '54321',
                    'type': 'account'
                },
                {
                    'lastCrawled': '2020-08-20T16:52:13.582Z',
                    'SK': 'ACCNUMBER#54321#REGION#eu-west-1',
                    'PK': 'Account',
                    'accountId': '54321',
                    'name': 'eu-west-2',
                    'type': 'region'
                },
                {
                    'lastCrawled': '2020-08-20T16:52:13.582Z',
                    'SK': 'ACCNUMBER#54321#REGION#eu-west-1',
                    'PK': 'Account',
                    'accountId': '54321',
                    'name': 'eu-west-3',
                    'type': 'region'
                }
            ]};

            it('should return empty array when no results', async () => {
                const mockQuery = sinon.stub().returns({promise: () => Promise.resolve({Items: []})});

                const mockDocClient = {
                    query: mockQuery
                };

                const actual = await getAccounts(mockDocClient, 'Table_Name', ['12345', '54321']);
                assert.deepEqual(actual, []);
            });

            it('should return array of accounts with metadata', async () => {
                const expected = [
                    {
                        'regions': [
                            {
                                'lastCrawled': '2020-08-20T16:52:13.582Z',
                                'name': 'eu-west-1'
                            }
                        ],
                        'accountId': '12345',
                        'lastCrawled': '2020-08-20T16:52:13.754Z'
                    },
                    {
                        'regions': [
                            {
                                'lastCrawled': '2020-08-20T16:52:13.582Z',
                                'name': 'eu-west-2'
                            },
                            {
                                'lastCrawled': '2020-08-20T16:52:13.582Z',
                                'name': 'eu-west-3'
                            }
                        ],
                        'accountId': '54321',
                        'lastCrawled': '2020-08-20T16:52:13.754Z'
                    }
                ];

                const mockQuery = sinon.stub().returns({promise: () => Promise.resolve(queryResult)});

                const mockDocClient = {
                    query: mockQuery
                };

                const actual = await getAccounts(mockDocClient, 'Table_Name', ['12345', '54321']);
                assert.deepEqual(actual, expected);
            });
    });
    
    describe('deleteAccounts',  () => {

        const deleteAccounts = index.__get__('deleteAccounts');

        it('should handle config duplicate error', async () => {
            const mockQuery = sinon.stub().returns({promise: () => Promise.resolve(queryResult)});
            const mockBatchWrite = sinon.stub().returns({promise: () => Promise.resolve(empty)});

            const mockDocClient = {
                batchWrite: mockBatchWrite,
                query: mockQuery
            };

            const mockPutConfigurationAggregator = sinon.stub().returns({
                promise: async () => {
                    throw new Error('Your configuration aggregator contains duplicate accounts. Delete the duplicate accounts and try again.');
                }
            });
            const mockConfigService = {putConfigurationAggregator: mockPutConfigurationAggregator};

            const actual = await deleteAccounts(mockDocClient, mockConfigService, 'Table_Name', {
                configAggregator: 'agg',
                accountIds: ['123453', '54321']
            });

            assert.deepEqual(actual, {unprocessedAccounts: []});
        });

        it('should process accounts', async () => {
            const mockQuery = sinon.stub().returns({promise: () => Promise.resolve(queryResult)});
            const mockBatchWrite = sinon.stub().returns({promise: () => Promise.resolve(empty)});

            const mockDocClient = {
                batchWrite: mockBatchWrite,
                query: mockQuery
            };

            const mockPutConfigurationAggregator = sinon.stub().returns({promise: () => Promise.resolve({})});
            const mockConfigService = {putConfigurationAggregator: mockPutConfigurationAggregator};

            const actual = await deleteAccounts(mockDocClient, mockConfigService, 'Table_Name', {
                configAggregator: 'agg',
                accountIds: ['123453', '54321']
            });

            assert.deepEqual(actual, {unprocessedAccounts: []});
        });

        it('should batch when processing accounts with large numbers of regions', async () => {
            const queryResult = Array(30)
                .fill('1')
                .map((_, i) => ({
                    PK: 'Account',
                    SK: 'ACCNUMBER#123453#' + i
                }));

            const mockQuery = sinon.stub().returns({promise: () => Promise.resolve({Items: queryResult})});
            const mockBatchWrite = sinon.stub().returns({promise: () => Promise.resolve(empty)});

            const mockDocClient = {
                batchWrite: mockBatchWrite,
                query: mockQuery
            };

            const mockPutConfigurationAggregator = sinon.stub().returns({promise: () => Promise.resolve({})});
            const mockConfigService = {putConfigurationAggregator: mockPutConfigurationAggregator};

            const actual = await deleteAccounts(mockDocClient, mockConfigService, 'Table_Name', {
                configAggregator: 'agg',
                accountIds: ['123453']
            });

            assert.deepEqual(actual, {unprocessedAccounts: []});
            sinon.assert.calledTwice(mockBatchWrite);
        });

        it('should return unprocessed accounts', async () => {
            const mockQuery = sinon.stub().returns({promise: () => Promise.resolve(queryResult)});

            const mockBatchWrite = sinon.stub().returns({promise: () => Promise.resolve(unprocessed)});

            const mockDocClient = {
                batchWrite: mockBatchWrite,
                query: mockQuery
            };

            const mockPutConfigurationAggregator = sinon.stub().returns({promise: () => Promise.resolve({})});
            const mockConfigService = {putConfigurationAggregator: mockPutConfigurationAggregator};

            const actual = await deleteAccounts(mockDocClient, mockConfigService, 'Table_Name', {
                configAggregator: 'agg',
                accountIds: ['123453', '54321']
            });

            assert.deepEqual(actual, {unprocessedAccounts: [ '123453' ]});
        }).timeout(6250);

    });

    describe('batchWrite', () => {
        const batchWrite = index.__get__('batchWrite');

        it('should not retry if no unprocessed items', async () => {
            const mockBatchWrite = sinon.stub();
            mockBatchWrite.returns({promise: () => Promise.resolve(empty)});

            const actual = await batchWrite({batchWrite: mockBatchWrite}, 50, ['write']);
            assert.deepEqual(actual, empty);
        }).timeout(25);

        it('should retry unprocessed items', async () => {
            const mockBatchWrite = sinon.stub();
            mockBatchWrite.onFirstCall().returns({promise: () => Promise.resolve(unprocessed)});
            mockBatchWrite.onSecondCall().returns({promise: () => Promise.resolve(empty)});

            const actual = await batchWrite({batchWrite: mockBatchWrite}, 50, ['write']);
            assert.deepEqual(actual, empty);
        }).timeout(75);

        it('should return unprocessed items not processed after 3 attempts', async () => {
            const mockBatchWrite = sinon.stub();
            mockBatchWrite.returns({promise: () => Promise.resolve(unprocessed)});

            const actual = await batchWrite({batchWrite: mockBatchWrite}, 50, ['write']);
            assert.deepEqual(actual, unprocessed);
        }).timeout(325);
    })

});