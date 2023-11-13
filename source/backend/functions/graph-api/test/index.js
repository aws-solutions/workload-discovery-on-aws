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
                cap: sinon.stub().returnsThis(),
                addE: sinon.stub().returnsThis(),
                by: sinon.stub().returnsThis(),
                both: sinon.stub().returnsThis(),
                bothE: sinon.stub().returnsThis(),
                or: sinon.stub().returnsThis(),
                outE: sinon.stub().returnsThis(),
                inV: sinon.stub().returnsThis(),
                otherV: sinon.stub().returnsThis(),
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

        describe('deleteResources', () => {

            it('should handle empty list of ids', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                const ids = [];

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'deleteResources',
                    },
                    arguments: {
                        resourceIds: ids
                    }
                }, {});

                assert.notStrictEqual(actual, ids);
                assert.deepEqual(actual, ids);
            });

            it('should return ids of deleted relationships', async () => {
                const mockGremlinClient = createMockGremlinClient({nextValue: {}});

                const ids = [
                    'id1',
                    'id2',
                    'id3'
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

        describe('getResourceGraph', () => {

            it('should reject invalid arns', async () => {
                const mockGremlinClient = createMockGremlinClient({
                    nextValues: []
                });

                return handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResourceGraph',
                    },
                    arguments: {
                        ids: [
                            'notArn1',
                            'notArn2'
                        ]
                    }
                }, {}).catch(err => assert.deepEqual(err.message, 'The following ARNs are invalid: notArn1,notArn2'));
            });

            it('should handle empty list of ids', async () => {
                const mockGremlinClient = createMockGremlinClient({
                    nextValues: ['should not be returned']
                });

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResourceGraph',
                    },
                    arguments: {
                        ids: []
                    }
                }, {});

                assert.deepEqual(actual, {nodes: [], edges: []});
            });

            it('should return nodes and edges related to the supplied ids', async () => {
                const mockGremlinClient = createMockGremlinClient({
                    nextValue: {
                        nodes: [{
                            id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:function1',
                            label: 'AWS_LAMBDA_FUNCTION',
                            md5Hash: '',
                            prop1: 'prop1Val',
                            prop2: 'prop2Val'
                        }, {
                            id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:function2',
                            label: 'AWS_LAMBDA_FUNCTION',
                            md5Hash: '',
                            prop1: 'prop1Val',
                            prop2: 'prop2Val'
                        }, {
                            id: 'iamRoleArn',
                            label: 'AWS_IAM_ROLE',
                            md5Hash: '',
                            prop1: 'prop1IamVal',
                            prop2: 'prop2IamVal'
                        }
                        ],
                        edges: [{
                            id: 'edgeId1',
                            label: 'CONTAINED_IN',
                            source: {
                                id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:function1',
                                label: 'AWS_LAMBDA_FUNCTION'
                            },
                            target: {id: 'vpcArn', label: 'AWS_EC2_VPC'}
                        }, {
                            id: 'edgeId2',
                            label: 'IS_ASSOCIATED_WITH',
                            source: {
                                id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:function1',
                                label: 'AWS_LAMBDA_FUNCTION'
                            },
                            target: {id: 'iamRoleArn', label: 'AWS_IAM_ROLE'}
                        }]
                    }
                });

                const ids = [
                    'arn:aws:lambda:eu-west-1:xxxxxx:function:function1',
                    'arn:aws:lambda:eu-west-1:xxxxxx:function:function2'
                ];

                const actual = await handler(mockGremlinClient)({
                    info: {
                        fieldName: 'getResourceGraph',
                    },
                    arguments: {
                        ids
                    }
                }, {});

                assert.deepEqual(actual.edges, [{
                    id: 'edgeId1',
                    label: 'CONTAINED_IN',
                    source: {
                        id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:function1',
                        label: 'AWS_LAMBDA_FUNCTION'
                    },
                    target: {id: 'vpcArn', label: 'AWS_EC2_VPC'}
                }, {
                    id: 'edgeId2',
                    label: 'IS_ASSOCIATED_WITH',
                    source: {
                        id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:function1',
                        label: 'AWS_LAMBDA_FUNCTION'
                    },
                    target: {id: 'iamRoleArn', label: 'AWS_IAM_ROLE'}
                }]);

                assert.deepEqual(actual.nodes, [
                    {
                        id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:function1',
                        label: 'AWS_LAMBDA_FUNCTION',
                        md5Hash: '',
                        properties: {
                            prop1: 'prop1Val',
                            prop2: 'prop2Val'
                        }
                    },
                    {
                        id: 'arn:aws:lambda:eu-west-1:xxxxxx:function:function2',
                        label: 'AWS_LAMBDA_FUNCTION',
                        md5Hash: '',
                        properties: {
                            prop1: 'prop1Val',
                            prop2: 'prop2Val'
                        }
                    },
                    {
                        id: 'iamRoleArn',
                        label: 'AWS_IAM_ROLE',
                        md5Hash: '',
                        properties: {
                            prop1: 'prop1IamVal',
                            prop2: 'prop2IamVal'
                        }
                    }
                ])

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