// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const rewire = require('rewire');
const sinon = require('sinon');
const {assert} = require('chai');
const index = rewire('../src/index');

describe('index.js', () => {

    describe('handler', () => {

        const handler = index.__get__('handler');

        function createMockGremlinClient({nextValues = [], nextValue, toListValue}) {
            const nextValuesStub = sinon.stub();

            nextValues.forEach((value, i) => nextValuesStub.onCall(i).resolves({value}));

            const g = {
                E: sinon.stub().returnsThis(),
                V: sinon.stub().returnsThis(),
                with_: sinon.stub().returnsThis(),
                aggregate: sinon.stub().returnsThis(),
                addE: sinon.stub().returnsThis(),
                by: sinon.stub().returnsThis(),
                both: sinon.stub().returnsThis(),
                or: sinon.stub().returnsThis(),
                outE: sinon.stub().returnsThis(),
                inV: sinon.stub().returnsThis(),
                to: sinon.stub().returnsThis(),
                has: sinon.stub().returnsThis(),
                hasLabel: sinon.stub().returnsThis(),
                fold: sinon.stub().returnsThis(),
                unfold: sinon.stub().returnsThis(),
                group: sinon.stub().returnsThis(),
                property: sinon.stub().returnsThis(),
                groupCount: sinon.stub().returnsThis(),
                select: sinon.stub().returnsThis(),
                range: sinon.stub().returnsThis(),
                elementMap: sinon.stub().returnsThis(),
                project: sinon.stub().returnsThis(),
                drop: sinon.stub().returnsThis(),
                next: nextValues.length === 0 ?
                    sinon.stub().resolves({value: nextValue}) : nextValuesStub,
                toList: sinon.stub().resolves(toListValue)
            }

            return {
                query: f => f(g),
                g
            }
        }

        const linkedNodesHierarchyTests = {
            lambda: {
                input: require('./fixtures/getLinkedNodesHierarchy/lambda-input.json'),
                expected: require('./fixtures/hierarchy/gremlin-lambda-expected.json')[0]
            },
            ec2: {
                input: require('./fixtures/getLinkedNodesHierarchy/ec2-input.json'),
                expected: require('./fixtures/hierarchy/gremlin-ec2-expected.json')[0]
            }
        };

        describe('getLinkedNodesHierarchy',  () => {

            it('should reject payloads with invalid arn', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                return handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getLinkedNodesHierarchy',
                    },
                    arguments: {id: 'foo'}
                }, {}).catch(err => assert.strictEqual(err.message, 'The id parameter must be a valid ARN.'));
            });

            it('should create a nested hierarchy from an id', async () => {
                const mockGremlinClient = createMockGremlinClient({
                    nextValue: linkedNodesHierarchyTests.lambda.input
                });

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getLinkedNodesHierarchy',
                    },
                    arguments: {id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:aws-perspective-xxxxxx-eu-we-GremlinFunction-194JBR0FRB0EM'}
                }, {})

                assert.deepEqual(actual, linkedNodesHierarchyTests.lambda.expected)
            });
        });

        describe('batchGetLinkedNodesHierarchy', () => {

            it('should reject invalid arns', async () => {
                const mockGremlinClient = createMockGremlinClient({
                    nextValues: []
                });

                return handler(mockGremlinClient)({
                    info: {
                        fieldName: 'batchGetLinkedNodesHierarchy',
                    },
                    arguments: {
                        ids: [
                            'notArn1',
                            'notArn2'
                        ]
                    }
                }, {}).catch(err => assert.deepEqual(err.message, 'The following ARNs are invalid: notArn1,notArn2'));
            });

            it('should return the ids of unprocessed items', async () => {
                const mockGremlinClient = createMockGremlinClient({
                    nextValues: [
                        null, null
                    ]
                });

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'batchGetLinkedNodesHierarchy',
                    },
                    arguments: {
                        ids: [
                            'arn:aws:lambda:eu-west-1:xxxxxx:function:aws-perspective-xxxxxx-eu-we-GremlinFunction-194JBR0FRB0EM',
                            'arn:aws:ec2:eu-west-1:xxxxxx:instance/i-038f307ddeb9caaec'
                        ]
                    }
                }, {})

                assert.deepEqual(actual, {
                    hierarchies: [],
                    notFound: [],
                    unprocessedResources: [
                        'arn:aws:lambda:eu-west-1:xxxxxx:function:aws-perspective-xxxxxx-eu-we-GremlinFunction-194JBR0FRB0EM',
                        'arn:aws:ec2:eu-west-1:xxxxxx:instance/i-038f307ddeb9caaec'
                    ]
                });
            });

            it('should return the ids of resources not found', async () => {
                const mockGremlinClient = createMockGremlinClient({
                    nextValues: [
                        [], []
                    ]
                });

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'batchGetLinkedNodesHierarchy',
                    },
                    arguments: {
                        ids: [
                            'arn:aws:lambda:eu-west-1:xxxxxx:function:aws-perspective-xxxxxx-eu-we-GremlinFunction-194JBR0FRB0EM',
                            'arn:aws:ec2:eu-west-1:xxxxxx:instance/i-038f307ddeb9caaec'
                        ]
                    }
                }, {})

                assert.deepEqual(actual, {
                    hierarchies: [],
                    notFound: [
                        'arn:aws:lambda:eu-west-1:xxxxxx:function:aws-perspective-xxxxxx-eu-we-GremlinFunction-194JBR0FRB0EM',
                        'arn:aws:ec2:eu-west-1:xxxxxx:instance/i-038f307ddeb9caaec'
                    ],
                    unprocessedResources: []
                });
            });

            it('should create a nested hierarchies for multiple id', async () => {
                const mockGremlinClient = createMockGremlinClient({
                    nextValues: [
                        linkedNodesHierarchyTests.lambda.input,
                        linkedNodesHierarchyTests.ec2.input
                    ]
                });

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'batchGetLinkedNodesHierarchy',
                    },
                    arguments: {
                        ids: [
                            'arn:aws:lambda:eu-west-1:xxxxxx:function:aws-perspective-xxxxxx-eu-we-GremlinFunction-194JBR0FRB0EM',
                            'arn:aws:ec2:eu-west-1:xxxxxx:instance/i-038f307ddeb9caaec'
                        ]
                    }
                }, {})

               assert.deepEqual(actual, {
                   hierarchies: [
                       {
                           parentId: 'arn:aws:lambda:eu-west-1:xxxxxx:function:aws-perspective-xxxxxx-eu-we-GremlinFunction-194JBR0FRB0EM',
                           hierarchy: linkedNodesHierarchyTests.lambda.expected
                       },
                       {
                           parentId: 'arn:aws:ec2:eu-west-1:xxxxxx:instance/i-038f307ddeb9caaec',
                           hierarchy: linkedNodesHierarchyTests.ec2.expected
                       }
                   ],
                   notFound: [],
                   unprocessedResources: []
               });
            });

        });

        describe('getResources', () => {

            const getResourcesTests = {
                lambda: {
                    input: require('./fixtures/getResources/lambdas-input.json'),
                    expected: require('./fixtures/getResources/lambdas-output.json')
                }
            };

            it('should return no resources when resourceTypes is empty', async () => {
                const mockGremlinClient = createMockGremlinClient({toListValue: {}});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResources',
                    },
                    arguments: {
                        resourceTypes: []
                    }
                }, {});

                assert.deepEqual(actual, []);
            });

            it('should get resources', async () => {
                const mockGremlinClient = createMockGremlinClient({toListValue: getResourcesTests.lambda.input});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResources',
                    },
                    arguments: {
                    }
                }, {});

                assert.deepEqual(actual, getResourcesTests.lambda.expected);
            });

            it('should get resources with accounts and resource filters', async () => {
                const mockGremlinClient = createMockGremlinClient({toListValue: getResourcesTests.lambda.input});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResources',
                    },
                    arguments: {
                        resourceTypes: ['AWS::Lambda::Function'],
                        accounts: [{accountId: 'accountId', regions: ['eu-west-1']}]
                    }
                }, {});

                assert.deepEqual(actual, getResourcesTests.lambda.expected);
            });

        });

        describe('deleteRelationships', () => {

            it('should return ids of deleted relationships', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                const ids = [
                    'id1',
                    'id2',
                    'id3'
                ];

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'deleteRelationships',
                    },
                    arguments: {
                        relationshipIds: ids
                    }
                }, {});

                assert.deepEqual(actual, ids);

            });

        });

        describe('addRelationships', () => {

            it('should handle empty relationships field', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'addRelationships',
                    },
                    arguments: {
                        relationships: []
                    }
                }, {});

                assert.deepEqual(actual, []);

            });

            it('should extract value on resolution', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: 'relResult'});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'addRelationships',
                    },
                    arguments: {
                        relationships: [
                            {source: 'sourceArn', label: 'CONTAINS', target: 'targetArn'}
                        ]
                    }
                }, {});

                assert.deepEqual(actual, 'relResult');

            });

        });

        describe('getRelationships', () => {

            it('ensure caching is enabled', async () => {
                const mockGremlinClient = createMockGremlinClient({toListValue: ['toListValue']});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getRelationships',
                    },
                    arguments: {
                    }
                }, {});

                sinon.assert.calledWith(mockGremlinClient.g.with_, 'Neptune#enableResultCacheWithTTL');
                assert.deepEqual(actual, ['toListValue']);
            });

        });

        describe('updateResources', () => {

            it('should return ids after updating resources', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'updateResources',
                    },
                    arguments: {
                        resources: [
                            {id: 'arn1', md5Hash: 'hash', properties: {a: 1}},
                            {id: 'arn2', md5Hash: '', properties: {b: 2}},
                        ]
                    }
                }, {});

                assert.deepEqual(actual, [{id: 'arn1'}, {id: 'arn2'}]);
            });

        });

        describe('getResourcesMetadata', () => {

            it('should get account and  counts', async () => {
                const resourceCounts = {
                    resourceTypes: [{type: 'AWS::Lambda::Function', count: 5}],
                    count: 5
                }
                const accounts = [
                    {accountId: 'accountId', regions: [{name: 'eu-west-1'}]}
                ]

                const mockGremlinClient = createMockGremlinClient({
                    nextValue: resourceCounts,
                    toListValue: accounts
                });

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResourcesMetadata',
                    },
                    arguments: {
                    }
                }, {});

                assert.deepEqual(actual, {
                    ...resourceCounts,
                    accounts
                });

            });

        });

        describe('getResourcesAccountMetadata', () => {

            it('should get resources account metadata without account filters', async () => {
                const mockGremlinClient = createMockGremlinClient({toListValue: ['toListValue']});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResourcesAccountMetadata',
                    },
                    arguments: {}
                }, {});

                assert.deepEqual(actual, ['toListValue']);
            });

            it('should get resources account metadata with account filters', async () => {
                const mockGremlinClient = createMockGremlinClient({toListValue: ['toListValue']});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResourcesAccountMetadata',
                    },
                    arguments: {
                        accounts: [{accountId: 'accountId', regions: ['eu-west-1', 'eu-west-2']}]
                    }
                }, {});

                assert.deepEqual(actual, ['toListValue']);
            });

        });

        describe('getResourcesRegionMetadata', () => {

            it('should get resources region metadata without account filters', async () => {
                const mockGremlinClient = createMockGremlinClient({toListValue: ['toListValue']});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResourcesRegionMetadata',
                    },
                    arguments: {}
                }, {});

                assert.deepEqual(actual, ['toListValue']);
            });

            it('should get resources region metadata with account filters', async () => {
                const mockGremlinClient = createMockGremlinClient({toListValue: ['toListValue']});

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResourcesRegionMetadata',
                    },
                    arguments: {
                        accounts: [{accountId: 'accountId', regions: ['eu-west-1', 'eu-west-2']}]
                    }
                }, {});

                assert.deepEqual(actual, ['toListValue']);
            });

        });

        describe('deleteResources', () => {

            it('should return ids of deleted resources', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                const ids = [
                    'arn:aws:lambda:eu-west-1:xxxxxx:function:function1',
                    'arn:aws:lambda:eu-west-1:xxxxxx:function:function2',
                    'arn:aws:lambda:eu-west-1:xxxxxx:function:function3'
                ];

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'deleteResources',
                    },
                    arguments: {
                        resourceIds: ids
                    }
                }, {});

                assert.deepEqual(actual, ids);

            });

        });

        describe('unknown query', () => {

            it('should reject payloads with unknown query', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                return handler(mockGremlinClient)({
                    info: {
                        fieldName: 'foo',
                    }
                }, {}).catch(err => assert.strictEqual(err.message, 'Unknown field, unable to resolve foo.'));
            });

        });

        describe('max page', () => {

            it('should reject payloads with page size greater than 2500', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                return handler(mockGremlinClient)({
                    arguments: {
                        pagination: {
                            start: 0,
                            end: 3000
                        }
                    },
                    info: {
                        fieldName: 'getResources',
                    }
                }, {}).catch(err => assert.strictEqual(err.message, 'Maximum page size is 2500.'));
            });

        });

    });

});