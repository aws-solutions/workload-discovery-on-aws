const rewire = require('rewire');
const sinon = require('sinon');
const {assert} = require('chai');
const results = require("./fixtures/searchResources.json");

const index = rewire('../src/index');

describe('index.js', () => {

    describe('handler', () => {
        const handler_ = index.__get__('handler');

        describe('indexResources', () => {

            it('should handle errors from indexing resources', async () => {
                const handler = handler_({
                    bulk: async () => {
                        return {
                            body: {
                                errors: true, items: [
                                    {
                                        index: {
                                            _index: "index1",
                                            _id: "1",
                                            "error": {}
                                        }
                                    }, {
                                        index: {
                                            _index: "index1",
                                            _id: "2",
                                            "error": {}
                                        }
                                    }
                                ]
                            }
                        }
                    }
                });

                const actual = await handler({
                    arguments: {
                        resources: [{id: 1, foo: '1'}, {id: 2, bar: '2'}]
                    },
                    info: {
                        fieldName: 'indexResources'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedResources: ['1', '2']
                });
            });

        });

        describe('deleteIndexedResources', () => {

            it('should handle errors from deleting resources', async () => {
                const handler = handler_({
                    bulk: async () => {
                        return {
                            body: {
                                errors: true, items: [
                                    {
                                        delete: {
                                            _index: "index1",
                                            _id: "1",
                                            "error": {}
                                        }
                                    }, {
                                        delete: {
                                            _index: "index1",
                                            _id: "2",
                                            "error": {}
                                        }
                                    }
                                ]
                            }
                        }
                    }
                });

                const actual = await handler({
                    arguments: {
                        resourceIds: [1, 2]
                    },
                    info: {
                        fieldName: 'deleteIndexedResources'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedResources: ['1', '2']
                });
            });

        });

        describe('updateIndexedResources', () => {

            it('should handle errors from updating resources', async () => {
                const handler = handler_({
                    bulk: async () => {
                        return {
                            body: {
                                errors: true, items: [
                                    {
                                        update: {
                                            _index: "index1",
                                            _id: "1",
                                            "error": {}
                                        }
                                    }, {
                                        update: {
                                            _index: "index1",
                                            _id: "2",
                                            "error": {}
                                        }
                                    }
                                ]
                            }
                        }
                    }
                });

                const actual = await handler({
                    arguments: {
                        resources: [{id: 1, foo: '1'}, {id: 2, bar: '2'}]
                    },
                    info: {
                        fieldName: 'updateIndexedResources'
                    }
                });

                assert.deepEqual(actual, {
                    unprocessedResources: ['1', '2']
                });
            });

        });

        describe('searchResources', () => {

            it('should reject requests with a page size of over 1000', async () => {
                const handler = handler_({
                    search: async () => {
                        return {};
                    }
                });

                return handler({
                    arguments: {
                        text: 'lambdaArn',
                        accounts: [{accountId: 'xxxxxxxxxxx', regions: [{name: 'eu-west-1'}]}],
                        resourceTypes: ['AWS::Lambda::Function'],
                        pagination: {start: 0, end: 2000}
                    },
                    info: {
                        fieldName: 'searchResources'
                    }
                }).catch(err => assert.strictEqual(err.message, 'Maximum page size is 1000.'));
            });

            it('should return search values in same format as neptune', async () => {
                const results = require('./fixtures/searchResources.json')
                const handler = handler_({
                    search: async () => {
                        return results;
                    }
                });

                const actual = await handler({
                    arguments: {
                        text: 'lambdaArn',
                        accounts: [{accountId: 'xxxxxxxxxxx', regions: [{name: 'eu-west-1'}]}],
                        resourceTypes: ['AWS::Lambda::Function']
                    },
                    info: {
                        fieldName: 'searchResources'
                    }
                });

                assert.deepEqual(actual, {
                    count: 1,
                    resources: [{
                        id: 'lambdaArn',
                        label: 'AWS_Lambda_Function',
                        md5hash: '',
                        properties: {
                            accountId: 'xxxxxxxxxxxx',
                            arn: 'lambdaArn',
                            availabilityZone: 'eu-west-1a,eu-west-1b',
                            awsRegion: 'eu-west-1',
                            configuration: '{}',
                            loggedInURL: 'N/A',
                            private: void 0,
                            loginURL: 'lambdaLoginUrl',
                            resourceId: 'lambdaResourceId',
                            resourceName: 'lambdaResourceName',
                            resourceType: 'AWS::Lambda::Function',
                            resourceValue: void 0,
                            state: 'N/A',
                            tags: '[]',
                            title: 'lambdaTitle',
                            vpcId: 'lambdaVpcId',
                            subnetId: void 0
                        }
                    }]
                });
            });

        });

        describe('unknown field', () => {

            it('should reject payloads with unknown query', async () => {
                const handler = index.__get__('handler')({});

                return handler({
                    arguments: {},
                    info: {
                        fieldName: 'foo'
                    }
                }).catch(err => assert.strictEqual(err.message, 'Unknown field, unable to resolve foo.'));
            });

        });

    });

});