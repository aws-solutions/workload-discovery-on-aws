const {assert} = require('chai');
const rewire = require('rewire');
const R = require('ramda');
const index = rewire('../src/index');

describe('json schema tests', () => {

    index.__set__('queryRunner', () => () => Promise.resolve('success'));
    index.__set__('queryRunnerG', () => () => Promise.resolve('success'));
    index.__set__('downloadCloudFormation', () => Promise.resolve('success'));
    index.__set__('getDiscoveryConfig', () => Promise.resolve('success'));
    index.__set__('storeDiscoveryConfig', () => Promise.resolve('success'));
    index.__set__('getMetaData', () => Promise.resolve('success'));

    const {handler} = index;

    const errRes = {
        statusCode: 400, headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };

    describe('all commands', () => {

        const commands = [
            'addNode',
            'addEdge',
            'viewAllNodesAndLinks',
            'viewAllNodes',
            'viewAllEdges',
            'downloadAccountCloudFormation',
            'downloadRegionCloudFormation',
            'getDiscoveryConfig',
            'storeDiscoveryConfig',
            'getImportMetaData',
            'deleteAllNodes',
            'getDeletedLinkedNodes',
            'linkedNodes',
            'linkedNodesHierarchy',
            'filterNodes',
            'filterNodesHierarchy',
            'runGremlin',
            'deleteNodes',
            'hardDeleteNodes',
            'getAllResources',
            'getNodeFromId'
        ];

        it('should reject payload with unsupported command', async () => {
            const actual = await handler({body: JSON.stringify({command: 'adNode'})});
            const expectedBody = {
                body: {
                    errors: [
                        {
                            end: {
                                column: 20,
                                line: 1,
                                offset: 19
                            },
                            error: '/command should be equal to one of the allowed values: ' + commands.join(', '),
                            path: '/command',
                            start: {
                                column: 12,
                                line: 1,
                                offset: 11
                            },
                            suggestion: 'Did you mean addNode?'
                        }
                    ]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});

        });

        it('should reject payload missing command parameter', async () => {
            const actual = await handler({body: JSON.stringify({})});
            const expectedBody = {
                body: {
                    errors: [{
                        start: {line: 1, column: 1, offset: 0},
                        error: ' should have required property \'command\'',
                        path: ''
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

    });

    // this will eventually be removed once all commands have schemas
    describe('commands without fully defined schema', () => {

        const commands = [
            'runGremlin'
        ];

        commands.forEach(command => {

            it(command + ' should accept payload with command parameter', async () => {
                const actual = await handler({body: JSON.stringify({command})});
                assert.deepEqual(actual, 'success');
            });

            it(command + ' should not validate parameters that are not command', async () => {
                const actual = await handler({body: JSON.stringify({command, foo: {bar: 'baz'}})});
                assert.deepEqual(actual, 'success');
            });

        });

    });

    describe('commands that do not require data parameter', () => {

        const commands = [
            'downloadAccountCloudFormation',
            'downloadRegionCloudFormation',
            'getDiscoveryConfig',
            'getImportMetaData',
        ];

        commands.forEach(command => {

            it(command + 'should accept json payload with no data parameter', async () => {
                const actual = await handler({
                    body: JSON.stringify({command})
                });
                assert.deepEqual(actual, 'success');
            });

        });

    });

    describe('commands requiring data parameter', () => {

        const commands = [
            'addNode',
            'addEdge',
            'getNodeFromId',
            'storeDiscoveryConfig',
            'getDeletedLinkedNodes',
            'hardDeleteNodes',
            'linkedNodes',
            'linkedNodesHierarchy',
            'filterNodes',
            'filterNodesHierarchy'
        ];

        commands.forEach(command => {

            it(command + ' should reject a payload missing the data parameter', async () => {
                const actual = await handler({body: JSON.stringify({command})});
                const expectedBody = {
                    body: {
                        errors: [{
                            start: {line: 1, column: 1, offset: 0},
                            error: ' should have required property \'data\'',
                            path: ''
                        }]
                    }
                };

                assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
            });

        });

    });

    describe('getNodeFromId', () => {

        it('should reject a payload missing the id parameter', async () => {
            const actual = await handler({body: JSON.stringify({command: 'getNodeFromId', data: {}})});
            const expectedBody = {
                body: {
                    errors: [{
                        error: '/data should have required property \'id\'',
                        path: '/data',
                        start: {
                            column: 35,
                            line: 1,
                            offset: 34
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should accept correctly formed json payload', async () => {
            const expected = await handler({body: JSON.stringify({command: 'getNodeFromId', data: {id: '1'}})});
            assert.deepEqual(expected, 'success');
        })

    });

    describe('addNode', () => {

        it('should reject a payload missing the id parameter', async () => {
            const actual = await handler({body: JSON.stringify({command: 'getNodeFromId', data: {}})});
            const expectedBody = {
                body: {
                    errors: [{
                        'error': '/data should have required property \'id\'',
                        'path': '/data',
                        'start': {
                            'column': 35,
                            'line': 1,
                            'offset': 34
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should reject json payload with incorrect properties type', async () => {
            const expected = await handler({
                body: JSON.stringify({
                    command: 'addNode',
                    data: {id: '1', properties: false}
                })
            });

            const expectedBody = {
                body: {
                    'errors': [
                        {
                            'end': {
                                'column': 57,
                                'line': 1,
                                'offset': 56
                            },
                            'error': '/data/properties: type should be object',
                            'path': '/data/properties',
                            'start': {
                                'column': 52,
                                'line': 1,
                                'offset': 51
                            }
                        }
                    ]
                }
            };
            assert.deepEqual(R.evolve({body: JSON.parse}, expected), {...errRes, ...expectedBody});
        });

        it('should accept json payload with id only', async () => {
            const expected = await handler({body: JSON.stringify({command: 'addNode', data: {id: '1'}})});
            assert.deepEqual(expected, 'success');
        });

        it('should accept json payload with id and properties', async () => {
            const expected = await handler({
                body: JSON.stringify({
                    command: 'addNode',
                    data: {id: '1', properties: {foo: 'bar', baz: 1}}
                })
            });
            assert.deepEqual(expected, 'success');
        })

    });

    describe('addEdge', () => {

        it('should reject a payload missing the source parameter', async () => {
            const actual = await handler({body: JSON.stringify({command: 'addEdge', data: {target: 't'}})});
            const expectedBody = {
                body: {
                    errors: [{
                        error: '/data should have required property \'source\'',
                        path: '/data',
                        start: {
                            column: 29,
                            line: 1,
                            offset: 28
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should reject a payload missing the target parameter', async () => {
            const actual = await handler({body: JSON.stringify({command: 'addEdge', data: {source: 's'}})});
            const expectedBody = {
                body: {
                    errors: [{
                        error: '/data should have required property \'target\'',
                        path: '/data',
                        start: {
                            column: 29,
                            line: 1,
                            offset: 28
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should reject json payload with incorrect source type', async () => {
            const expected = await handler({
                body: JSON.stringify({
                    command: 'addEdge',
                    data: {target: 1}
                })
            });

            const expectedBody = {
                body: {
                    errors: [
                        {
                            end: {
                                column: 40,
                                line: 1,
                                offset: 39
                            },
                            error: '/data/target: type should be string',
                            path: '/data/target',
                            start: {
                                column: 39,
                                line: 1,
                                offset: 38
                            }
                        }
                    ]
                }
            };
            assert.deepEqual(R.evolve({body: JSON.parse}, expected), {...errRes, ...expectedBody});
        });

        it('should reject json payload with incorrect target type', async () => {
            const expected = await handler({
                body: JSON.stringify({
                    command: 'addEdge',
                    data: {source: 1, target: 't'}
                })
            });

            const expectedBody = {
                body: {
                    errors: [
                        {
                            end: {
                                column: 40,
                                line: 1,
                                offset: 39
                            },
                            error: '/data/source: type should be string',
                            path: '/data/source',
                            start: {
                                column: 39,
                                line: 1,
                                offset: 38
                            }
                        }
                    ]
                }
            };
            assert.deepEqual(R.evolve({body: JSON.parse}, expected), {...errRes, ...expectedBody});
        });

        it('should accept json payload with source and target', async () => {
            const expected = await handler({
                body: JSON.stringify({
                    command: 'addEdge',
                    data: {source: 's', target: 't'}
                })
            });
            assert.deepEqual(expected, 'success');
        })

    });

    describe('commands that may use accountFilter parameter', () => {

        const commands = {
            viewAllNodesAndLinks: {},
            getAllResources: {},
            filterNodes: {resourceType: 'AWS::TAG'},
            filterNodesHierarchy: {resourceType: 'AWS::TAG'}
    };

        Object.entries(commands).forEach(([command, required]) => {

            it(command + 'should reject a payload with incorrect accountFilter type', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command,
                        data: {accountFilter: 123456789, ...required}
                    })
                });

                const expectedBody = {
                    body: {
                        errors: [{
                            end: {
                                column: 48 + command.length,
                                line: 1,
                                offset: 47 + command.length
                            },
                            error: '/data/accountFilter: type should be object',
                            path: '/data/accountFilter',
                            start: {
                                column: 39 + command.length,
                                line: 1,
                                offset: 38 + command.length
                            }
                        }]
                    }
                };

                assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
            });

            it(command + 'should reject a payload with incorrect accountFilter array type', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command,
                        data: {
                            accountFilter: {
                                123456789: [1, 2, 3]
                            },
                            ...required
                        }
                    })
                });

                const expectedBody = {
                    body: {
                        errors: [{
                            end: {
                                column: 54 + command.length,
                                line: 1,
                                offset: 53 + command.length
                            },
                            error: '/data/accountFilter/123456789/0: type should be string',
                            path: '/data/accountFilter/123456789/0',
                            start: {
                                column: 53 + command.length,
                                line: 1,
                                offset: 52 + command.length
                            }
                        }]
                    }
                };

                assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
            });

            it(command + 'should accept json payload with valid accountFilter array parameter', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command,
                        data: {
                            accountFilter: {
                                123456789: ['eu-west-1']
                            },
                            ...required
                        }
                    })
                });
                assert.deepEqual(actual, 'success');
            });

        });

    });

    describe('storeDiscoveryConfig', () => {

        it('should reject a payload missing the zoomConfiguration', async () => {
            const actual = await handler({body: JSON.stringify({command: 'storeDiscoveryConfig', data: {foo: 'bar'}})});
            const expectedBody = {
                body: {
                    errors: [{
                        error: '/data should have required property \'zoomConfiguration\'',
                        path: '/data',
                        start: {
                            column: 42,
                            line: 1,
                            offset: 41
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should reject a payload without importAccounts array', async () => {
            const actual = await handler({
                body: JSON.stringify({
                    command: 'storeDiscoveryConfig',
                    data: {zoomConfiguration: {}}
                })
            });

            const expectedBody = {
                body: {
                    errors: [{
                        error: '/data/zoomConfiguration should have required property \'importAccounts\'',
                        path: '/data/zoomConfiguration',
                        start: {
                            column: 63,
                            line: 1,
                            offset: 62
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should reject a payload with importAccounts array containing objects without accountId', async () => {
            const actual = await handler({
                body: JSON.stringify({
                    command: 'storeDiscoveryConfig',
                    data: {
                        zoomConfiguration: {
                            importAccounts: [{accountI: 1}]
                        }
                    }
                })
            });

            const expectedBody = {
                body: {
                    errors: [{
                        error: '/data/zoomConfiguration/importAccounts/0 should have required property \'accountId\'',
                        path: '/data/zoomConfiguration/importAccounts/0',
                        start: {
                            column: 82,
                            line: 1,
                            offset: 81
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should accept correct payload', async () => {
            const actual = await handler({
                body: JSON.stringify({
                    command: 'storeDiscoveryConfig',
                    data: {
                        zoomConfiguration: {
                            importAccounts: [{accountId: '123456789'}]
                        }
                    }
                })
            });

            assert.deepEqual(actual, 'success');
        });

    });

    describe('getDeletedLinkedNodes', () => {

        it('should reject a payload missing the id parameter', async () => {
            const actual = await handler({body: JSON.stringify({command: 'getDeletedLinkedNodes', data: {}})});
            const expectedBody = {
                body: {
                    errors: [{
                        'error': '/data should have required property \'id\'',
                        'path': '/data',
                        'start': {
                            'column': 43,
                            'line': 1,
                            'offset': 42
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should reject a payload missing the deleteDate parameter', async () => {
            const actual = await handler({
                body: JSON.stringify({
                    command: 'getDeletedLinkedNodes',
                    data: {id: '1'}
                })
            });

            const expectedBody = {
                body: {
                    errors: [{
                        'error': '/data should have required property \'deleteDate\'',
                        'path': '/data',
                        'start': {
                            'column': 43,
                            'line': 1,
                            'offset': 42
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should reject a payload with non-date the deleteDate parameter', async () => {
            const actual = await handler({
                body: JSON.stringify({
                    command: 'getDeletedLinkedNodes',
                    data: {id: '1', deleteDate: '123456'}
                })
            });

            const expectedBody = {
                body: {
                    errors: [{
                        end: {
                            column: 74,
                            line: 1,
                            offset: 73
                        },
                        error: '/data/deleteDate: format should match format "date-time"',
                        path: '/data/deleteDate',
                        start: {
                            column: 66,
                            line: 1,
                            offset: 65
                        }
                    }]
                }
            };

            assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
        });

        it('should accept json payload with id and properties', async () => {
            const actual = await handler({
                body: JSON.stringify({
                    command: 'getDeletedLinkedNodes',
                    data: {id: '1', deleteDate: '2020-02-13T16:32:44Z'}
                })
            });
            assert.deepEqual(actual, 'success');
        })

    });

    describe('deletion', () => {

        const commands = [
            'deleteNodes',
            'hardDeleteNodes'
        ];

        commands.forEach(command => {

            it(command + ' should reject a payload missing the nodes parameter', async () => {
                const actual = await handler({body: JSON.stringify({command, data: {}})});
                const expectedBody = {
                    body: {
                        errors: [{
                            error: '/data should have required property \'nodes\'',
                            path: '/data',
                            start: {
                                column: 22 + command.length,
                                line: 1,
                                offset: 21 + command.length
                            }
                        }]
                    }
                };

                assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
            });

            it(command + ' should reject a payload when nodes is not an array', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command, data: {
                            nodes: 'notArray'
                        }
                    })
                });

                const expectedBody = {
                    body: {
                        errors: [{
                            end: {
                                column: 41 + command.length,
                                line: 1,
                                offset: 40 + command.length
                            },
                            error: '/data/nodes: type should be array',
                            path: '/data/nodes',
                            start: {
                                column: 31 + command.length,
                                line: 1,
                                offset: 30 + command.length
                            }
                        }]
                    }
                };

                assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
            });

            it(command + ' should accept json payload with id and properties', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command, data: {
                            nodes: ['1', '2']
                        }
                    })
                });
                assert.deepEqual(actual, 'success');
            });

        });
    });

    describe('functions that accept deleteDate', () => {

        const commands = [
            'linkedNodes',
            'linkedNodesHierarchy'
        ];

        commands.forEach(command => {

            it(command + ' should reject a payload with non-date the deleteDate parameter', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command,
                        data: {id: '11', deleteDate: '123456'}
                    })
                });

                const expectedBody = {
                    body: {
                        errors: [{
                            end: {
                                column: 54 + command.length,
                                line: 1,
                                offset: 53 + command.length
                            },
                            error: '/data/deleteDate: format should match format "date-time"',
                            path: '/data/deleteDate',
                            start: {
                                column: 46 + command.length,
                                line: 1,
                                offset: 45 + command.length,
                            }
                        }]
                    }
                };

                assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
            });

            it(command + 'should accept json payload with id and properties', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command,
                        data: {id: '1', deleteDate: '2020-02-13T16:32:44Z'}
                    })
                });
                assert.deepEqual(actual, 'success');
            })

        });

    });

    describe('filtering', () => {

        const commands = [
            'filterNodes',
            'filterNodesHierarchy',
        ];

        commands.forEach(command => {

            it(command + ' should reject a payload missing the resourceType or resourceId parameter', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command, data: {
                            resourceValue: 'val'
                        }
                    })
                });

                const expectedBody = {
                    body: {
                        errors: [{
                            error: '/data should have required property \'resourceType\'',
                            path: '/data',
                            start: {
                                column: 22 + command.length,
                                line: 1,
                                offset: 21 + command.length
                            }
                        }]
                    }
                };

                assert.deepEqual(R.evolve({body: JSON.parse}, actual), {...errRes, ...expectedBody});
            });

            it(command + ' should accept json payload with only resourceId parameters', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command, data: {
                            resourceId: 'id'
                        }
                    })
                });
                assert.deepEqual(actual, 'success');
            });

            it(command + ' should accept json payload with only resourceType parameters', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command, data: {
                            resourceType: 'AWS::TAG'
                        }
                    })
                });
                assert.deepEqual(actual, 'success');
            });

            it(command + ' should accept json payload with all parameters', async () => {
                const actual = await handler({
                    body: JSON.stringify({
                        command, data: {
                            resourceId: 'id',
                            resourceType: 'AWS::TAG',
                            resourceValue: 'val'
                        }
                    })
                });
                assert.deepEqual(actual, 'success');
            });

        });
    });
});