// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {graphql, HttpResponse} from 'msw';
import {server} from '../../../mocks/server';
import {
    getResourceGraphPaginated,
    searchResources,
} from '../../../../API/Handlers/ResourceGraphQLHandler';
import {
    RESOLVER_CODE_SIZE_ERROR,
    FUNCTION_RESPONSE_SIZE_TOO_LARGE,
} from '../../../../Utils/API/AdaptivePagination';
import {withResolvers} from '../../testUtils';

function makeNodes(count, offset = 0) {
    return Array.from({length: count}, (_, i) => ({
        id: `node-${offset + i}`,
        label: `Node_${offset + i}`,
        md5Hash: '',
        properties: {
            accountId: '111111111111',
            arn: `arn:aws:ec2:us-east-1:111111111111:instance/i-${offset + i}`,
            availabilityZone: 'us-east-1a',
            awsRegion: 'us-east-1',
            resourceType: 'AWS::EC2::Instance',
            title: `instance-${offset + i}`,
        },
    }));
}

function makeEdges(count, offset = 0) {
    return Array.from({length: count}, (_, i) => ({
        id: `edge-${offset + i}`,
        label: 'IS_ASSOCIATED_WITH',
        source: {id: `node-${offset + i}`, label: `Node_${offset + i}`},
        target: {id: `node-${offset + i + 1}`, label: `Node_${offset + i + 1}`},
    }));
}

describe('getResourceGraphPaginated', () => {
    it('accumulates results across multiple pages', async () => {
        const page1Nodes = makeNodes(3, 0);
        const page1Edges = makeEdges(2, 0);
        const page2Nodes = makeNodes(2, 3);
        const page2Edges = makeEdges(1, 2);

        let callCount = 0;
        server.use(
            graphql.query('GetResourceGraph', ({variables}) => {
                callCount++;
                const {start} = variables.pagination;
                if (start === 0) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: page1Nodes,
                                edges: page1Edges,
                            },
                        },
                    });
                }
                if (callCount <= 2) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: page2Nodes,
                                edges: page2Edges,
                            },
                        },
                    });
                }
                return HttpResponse.json({
                    data: {
                        getResourceGraph: {nodes: [], edges: []},
                    },
                });
            })
        );

        const result = await getResourceGraphPaginated({
            ids: ['arn:test'],
            pageSize: 3,
        });

        expect(result.nodes).toHaveLength(5);
        expect(result.edges).toHaveLength(3);
        expect(result.nodes).toEqual([...page1Nodes, ...page2Nodes]);
        expect(result.edges).toEqual([...page1Edges, ...page2Edges]);
    });

    it('returns empty when first page is empty', async () => {
        server.use(
            graphql.query('GetResourceGraph', () => {
                return HttpResponse.json({
                    data: {
                        getResourceGraph: {nodes: [], edges: []},
                    },
                });
            })
        );

        const result = await getResourceGraphPaginated({
            ids: ['arn:test'],
            pageSize: 10,
        });

        expect(result.nodes).toEqual([]);
        expect(result.edges).toEqual([]);
    });

    it('halves page size on payload-too-large and retries', async () => {
        const nodes = makeNodes(2);
        const edges = makeEdges(1);
        const paginationLog = [];

        server.use(
            graphql.query('GetResourceGraph', ({variables}) => {
                const {start, end} = variables.pagination;
                paginationLog.push({start, end});

                if (start === 0 && end === 10) {
                    return HttpResponse.json({
                        errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}],
                    });
                }
                if (start === 0 && end === 5) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {nodes, edges},
                        },
                    });
                }
                return HttpResponse.json({
                    data: {
                        getResourceGraph: {nodes: [], edges: []},
                    },
                });
            })
        );

        const result = await getResourceGraphPaginated({
            ids: ['arn:test'],
            pageSize: 10,
        });

        expect(paginationLog[0]).toEqual({start: 0, end: 10});
        expect(paginationLog[1]).toEqual({start: 0, end: 5});
        expect(result.nodes).toEqual(nodes);
        expect(result.edges).toEqual(edges);
    });

    it('gradually ramps page size back up after halving', async () => {
        const paginationLog = [];

        server.use(
            graphql.query('GetResourceGraph', ({variables}) => {
                const {start, end} = variables.pagination;
                paginationLog.push({start, end});

                // Full size (10) fails
                if (end - start === 10) {
                    return HttpResponse.json({
                        errors: [{message: RESOLVER_CODE_SIZE_ERROR}],
                    });
                }
                // Half size (5) and double (10) would fail, but ramped sizes succeed
                if (start === 0 && end === 5) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: makeNodes(5, 0),
                                edges: [],
                            },
                        },
                    });
                }
                // After success at 5, ramps to min(10, 5*2)=10, which fails again
                // Then halves to 5 again
                if (start === 5 && end === 10) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: makeNodes(5, 5),
                                edges: [],
                            },
                        },
                    });
                }
                return HttpResponse.json({
                    data: {
                        getResourceGraph: {nodes: [], edges: []},
                    },
                });
            })
        );

        const result = await getResourceGraphPaginated({
            ids: ['arn:test'],
            pageSize: 10,
        });

        // start=0: tries 10 (fails), tries 5 (succeeds)
        // start=5: ramps to min(10, 5*2)=10, so end=15 (fails), halves to 5, end=10 (succeeds)
        // start=10: ramps to min(10, 5*2)=10, end=20 (fails), halves to 5, end=15 (empty)
        expect(paginationLog).toEqual([
            {start: 0, end: 10},
            {start: 0, end: 5},
            {start: 5, end: 15},
            {start: 5, end: 10},
            {start: 10, end: 20},
            {start: 10, end: 15},
        ]);
        expect(result.nodes).toHaveLength(10);
    });

    it('halves multiple times if needed', async () => {
        const paginationLog = [];

        server.use(
            graphql.query('GetResourceGraph', ({variables}) => {
                const {start, end} = variables.pagination;
                paginationLog.push({start, end});

                if (end - start > 2) {
                    return HttpResponse.json({
                        errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}],
                    });
                }
                if (start === 0 && end === 2) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: makeNodes(2, 0),
                                edges: [],
                            },
                        },
                    });
                }
                return HttpResponse.json({
                    data: {
                        getResourceGraph: {nodes: [], edges: []},
                    },
                });
            })
        );

        const result = await getResourceGraphPaginated({
            ids: ['arn:test'],
            pageSize: 8,
        });

        // Page 1: 8 -> fails, 4 -> fails, 2 -> succeeds (2 nodes)
        // Page 2: ramps to min(8, 2*2)=4, so start=2, end=6 -> fails, halves to 2, end=4 -> empty
        expect(paginationLog).toEqual([
            {start: 0, end: 8},
            {start: 0, end: 4},
            {start: 0, end: 2},
            {start: 2, end: 6},
            {start: 2, end: 4},
        ]);
        expect(result.nodes).toHaveLength(2);
    });

    it('throws non-payload errors', async () => {
        server.use(
            graphql.query('GetResourceGraph', () => {
                return HttpResponse.json({
                    errors: [{message: 'Internal server error'}],
                });
            })
        );

        await expect(
            getResourceGraphPaginated({ids: ['arn:test'], pageSize: 10})
        ).rejects.toMatchObject({
            errors: [{message: 'Internal server error'}],
        });
    });
});

describe('searchResources', () => {
    it('returns paginated search results', async () => {
        const resources = makeNodes(3).map(n => ({...n, properties: {...n.properties, tags: '[]', configuration: '{}'}}));

        server.use(
            graphql.query('SearchResources', ({variables}) => {
                const {start, end} = variables.pagination;
                return HttpResponse.json({
                    data: {
                        searchResources: {
                            count: 10,
                            resources: resources.slice(start, end),
                        },
                    },
                });
            })
        );

        const result = await searchResources({
            text: '',
            pagination: {start: 0, end: 3},
        });

        const data = result.data.searchResources;
        expect(data.count).toBe(10);
        expect(data.resources).toHaveLength(3);
    });

    it('returns empty results when start exceeds data', async () => {
        server.use(
            graphql.query('SearchResources', () => {
                return HttpResponse.json({
                    data: {
                        searchResources: {
                            count: 5,
                            resources: [],
                        },
                    },
                });
            })
        );

        const result = await searchResources({
            text: '',
            pagination: {start: 100, end: 120},
        });

        expect(result.data.searchResources.resources).toEqual([]);
    });

    it('rejects on server errors', async () => {
        server.use(
            graphql.query('SearchResources', () => {
                return HttpResponse.json({
                    errors: [{message: 'Something went wrong'}],
                });
            })
        );

        await expect(
            searchResources({
                text: '',
                pagination: {start: 0, end: 10},
            })
        ).rejects.toMatchObject({
            errors: [{message: 'Something went wrong'}],
        });
    });

    it('passes filter variables through', async () => {
        const {promise: varsPromise, resolve} = withResolvers();

        server.use(
            graphql.query('SearchResources', ({variables}) => {
                resolve(variables);
                return HttpResponse.json({
                    data: {
                        searchResources: {count: 0, resources: []},
                    },
                });
            })
        );

        await searchResources({
            text: 'lambda',
            pagination: {start: 0, end: 25},
            resourceTypes: ['AWS::Lambda::Function'],
            accounts: [{accountId: '111111111111'}],
        });

        const capturedVars = await varsPromise;
        expect(capturedVars.text).toBe('lambda');
        expect(capturedVars.pagination).toEqual({start: 0, end: 25});
        expect(capturedVars.resourceTypes).toEqual(['AWS::Lambda::Function']);
        expect(capturedVars.accounts).toEqual([{accountId: '111111111111'}]);
    });
});
