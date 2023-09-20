// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {beforeAll, afterAll, afterEach, describe, it, vi} from 'vitest'
import sinon from 'sinon';
import {assert} from 'chai';
import {setGlobalDispatcher, getGlobalDispatcher} from 'undici';
import ConnectionClosedAgent from './mocks/agents/ConnectionClosed.mjs'
import GenericGqlError from './mocks/agents/GenericGqlError.mjs'
import TimeoutError from './mocks/agents/TimeoutError.mjs';
import ResponseTooLarge from './mocks/agents/ResponseTooLarge.mjs';
import {AWS_ORGANIZATIONS, SELF_MANAGED} from '../src/constants.mjs';
import {createClient, createPaginator} from '../src/index.mjs';
import GenericSuccess from './mocks/agents/GenericSuccess.mjs';

const FUNCTION_RESPONSE_SIZE_TOO_LARGE = 'Function.ResponseSizeTooLarge';
const AWS_LAMBDA_FUNCTION = 'AWS::Lambda::Function';

const ACCOUNT_IDX = 'xxxxxxxxxxxx';
const EU_WEST_1 = 'eu-west-1';

const credentials = {
    'accessKeyId': 'accessKeyId',
    'secretAccessKey': 'secretAccessKey'
};

function generateBaseResource(resourceType, num) {
    return {
        id: 'arn' + num,
        resourceId: 'resourceId' + num,
        resourceName: 'resourceName' + num, resourceType,
        accountId: ACCOUNT_IDX,
        arn: 'arn' + num,
        awsRegion: EU_WEST_1,
        relationships: [],
        tags: [],
        configuration: {a: num}
    };
}

describe('index', () => {

    describe('createClient', () => {

        it('should throw an error if crossAccountDiscovery parameter value is not SELF_MANAGED or AWS_ORGANIZATIONS', () => {
            assert.throws(() => {
                createClient({
                    credentials,
                    apiUrl: 'https://workload-discovery.appsync-api.eu-west-1.amazonaws.com/graphql',
                    crossAccountDiscovery: 'XXXXX'
                })
            }, 'The crossAccountDiscovery parameter must one of: AWS_ORGANIZATIONS,SELF_MANAGED.');
        });


        it('should throw an error if AppSync URL is not valid', () => {
            assert.throws(() => {
                createClient({
                    credentials,
                    apiUrl: 'https://www.example.com/graphql',
                    crossAccountDiscovery: AWS_ORGANIZATIONS
                })
            }, 'The apiUrl parameter value is not a valid AppSync URL.');
        });

        it('should exclude APIs that write to Neptune and OpenSearch in SELF_MANAGED mode', () => {
            const client = createClient({
                credentials,
                apiUrl: 'https://workload-discovery.appsync-api.eu-west-1.amazonaws.com/graphql',
                crossAccountDiscovery: 'SELF_MANAGED'
            });

            const excluded = new Set(
                [
                    'deleteRelationships',
                    'deleteResources',
                    'addRelationships',
                    'addResources',
                    'updateResources',
                    'indexResources',
                    'deleteIndexedResources',
                    'updateIndexedResources'
                ]
            );

            Object.keys(client).forEach(name => {
                if(excluded.has(name)) throw new Error(`The ${name} operation should be excluded from the client`);
            });
        });

        it('should exclude account import APIs and APIs that write to Neptune and OpenSearch in AWS_ORGANIZATIONS mode', () => {
            const client = createClient({
                credentials,
                apiUrl: 'https://workload-discovery.appsync-api.eu-west-1.amazonaws.com/graphql',
                crossAccountDiscovery: 'AWS_ORGANIZATIONS'
            });

            const excluded = new Set(
                [
                    'deleteRelationships',
                    'deleteResources',
                    'addRelationships',
                    'addResources',
                    'updateResources',
                    'indexResources',
                    'deleteIndexedResources',
                    'updateIndexedResources',
                    'getGlobalTemplate',
                    'getRegionalTemplate',
                    'addAccounts',
                    'deleteAccounts',
                    'updateAccount',
                    'deleteRegions',
                    'addRegions',
                    'updateRegions'
                ]
            );

            Object.keys(client).forEach(name => {
                if(excluded.has(name)) throw new Error(`The ${name} operation should be excluded from the client`);
            });
        });

    });

    describe('client', () => {
        const client = createClient({
            credentials,
            apiUrl: 'https://workload-discovery.appsync-api.eu-west-1.amazonaws.com/graphql',
            crossAccountDiscovery: 'SELF_MANAGED'
        });

        let globalDispatcher = null;

        beforeAll(() => {
            globalDispatcher = getGlobalDispatcher();
        });

        afterAll(() => {
            setGlobalDispatcher(globalDispatcher);
        })

        afterEach(() => {
            vi.unstubAllEnvs();
        });

        describe('credentials', () => {

            it('should use provider chain when no credentials are found', async () => {
                vi.stubEnv('AWS_ACCESS_KEY_ID', 'accessKeyId');
                vi.stubEnv('AWS_SECRET_ACCESS_KEY', 'secretAccessKey');
                vi.stubEnv('AWS_SESSION_TOKEN', 'optionalSessionToken');

                setGlobalDispatcher(GenericSuccess);

                const client = createClient({
                    apiUrl: 'https://workload-discovery.appsync-api.eu-west-1.amazonaws.com/graphql',
                    crossAccountDiscovery: 'SELF_MANAGED'
                });

                const actual = await client.sendRequest('custom GQL query', {});
                assert.deepEqual(actual, ['success']);
            });

        });

        describe('errors', () => {

            it('should recover from premature connection closed error', async () => {
                setGlobalDispatcher(ConnectionClosedAgent)

                const actual = await client.getResources();
                assert.deepEqual(actual, []);
            });

            it('should return response too large errors', async () => {
                setGlobalDispatcher(ResponseTooLarge)

                return client.getResources()
                    .then(() => {
                        throw new Error('Expected promise to be rejected but was fulfilled.')
                    })
                    .catch(err => assert.deepEqual(err.message, 'Function.ResponseSizeTooLarge'));
            });

            it('should retry on timeout errors', async () => {
                setGlobalDispatcher(TimeoutError)
                const actual = await client.getResources();
                assert.deepEqual(actual, ['success']);
            });

            it('should throw GraphQL errors', async () => {
                setGlobalDispatcher(GenericGqlError)

                return client.getResources()
                    .then(() => {
                        throw new Error('Expected promise to be rejected but was fulfilled.')
                    })
                    .catch(err => assert.deepEqual(err.message, '[{"message":"Validation error"}]'));
            });

        });

        describe('getRegion', async () => {

            it('should get inferred WD region', () => {
                const client = createClient({
                    credentials,
                    apiUrl: 'https://workload-discovery.appsync-api.us-east-1.amazonaws.com/graphql',
                    crossAccountDiscovery: 'SELF_MANAGED'
                });
                const actual = client.getRegion();
                assert.strictEqual(actual, 'us-east-1');
            });

        });

        describe('Queries and Mutations', () => {

            it('should execute custom GraphQL query', async () => {
                setGlobalDispatcher(GenericSuccess);

                const actual = await client.sendRequest('custom GQL query', {});
                assert.deepEqual(actual, ['success']);
            });

            Object.entries(client).forEach(([name, operation]) => {
                if (name !== 'sendRequest' && name !== 'getRegion') {
                    it(`should execute ${name} operation`, async () => {
                        setGlobalDispatcher(GenericSuccess)
                        const actual = await operation({});
                        assert.deepEqual(actual, ['success']);
                    });
                }
            });

        });

    });

    describe('createPaginator', () => {

        it('should throw on errors', async () => {
            const mockGetResources = sinon.stub();

            mockGetResources
                .withArgs({pagination: {start: 0, end: 1}})
                .rejects(new Error('test error'))

            const getResourcesPaginator = createPaginator(mockGetResources, {pageSize: 1});

            try {
                for await (const page of getResourcesPaginator()) {}
            } catch(err) {
                assert.deepEqual(err.message, 'test error');
            }
        });

        it('should throw for non paginated queries', async () => {
            const mockGetAccount = sinon.stub();

            mockGetAccount
                .withArgs({pagination: {start: 0, end: 1}})
                .resolves({
                    accountId: '123456789012',
                    regions: ['eu-west-1']
                })

            const getAccountPaginator = createPaginator(mockGetAccount, {pageSize: 1});

            try {
                for await (const page of getAccountPaginator({})) {}
            } catch(err) {
                assert.deepEqual(err.message, 'This operation is not paginated.');
            }
        });

        it('should handle multiple page results for queries that return an array', async () => {
            const resources = [1,2, 3].map(i => {
                const properties = generateBaseResource(AWS_LAMBDA_FUNCTION, i);
                return {id: properties.id, label: 'label', md5Hash: '', properties};
            })

            const mockGetResources = sinon.stub();

            mockGetResources
                .withArgs({pagination: {start: 0, end: 1}})
                .resolves([resources[0]])
                .withArgs({pagination: {start: 1, end: 2}})
                .resolves([resources[1]])
                .withArgs({pagination: {start: 2, end: 3}})
                .resolves([resources[2]])
                .withArgs({pagination: {start: 3, end: 4}})
                .resolves([]);

            const getResourcesPaginator = createPaginator(mockGetResources, {pageSize: 1});

            const actual = [];

            for await (const page of getResourcesPaginator()) {
                actual.push(...page);
            }

            assert.deepEqual(actual, resources);
        });

        [
            'costForServiceQuery',
            'costForResourceQuery',
            'resourcesByCostQuery',
            'resourcesByCostByDayQuery',
        ].forEach(query => {
            it(`should handle multiple page results for ${query}`, async () => {
                const mockCostQuery = sinon.stub();

                mockCostQuery
                    .withArgs({[query]: {pagination: {start: 0, end: 1}}})
                    .resolves({costItems: ['cost1']})
                    .withArgs({[query]: {pagination: {start: 1, end: 2}}})
                    .resolves({costItems: ['cost2']})
                    .withArgs({[query]: {pagination: {start: 2, end: 3}}})
                    .resolves({costItems: ['cost3']})
                    .withArgs({[query]: {pagination: {start: 3, end: 4}}})
                    .resolves({costItems: []});

                const getCostPaginator = createPaginator(mockCostQuery, {pageSize: 1});

                const actual = [];

                for await (const page of getCostPaginator({[query]: {}})) {
                    actual.push(page);
                }

                assert.deepEqual(actual, [
                    {costItems: ['cost1']},
                    {costItems: ['cost2']},
                    {costItems: ['cost3']}
                ]);
            });
        });

        it('should handle multiple page results for getResourceGraph query', async () => {
            const getResourceGraphQuery = sinon.stub();

            getResourceGraphQuery
                .withArgs({pagination: {start: 0, end: 1}})
                .resolves({nodes: ['node1'], edges: ['edge1']})
                .withArgs({pagination: {start: 1, end: 2}})
                .resolves({nodes: ['node2'], edges: ['edge2']})
                .withArgs({pagination: {start: 2, end: 3}})
                .resolves({nodes: ['node3'], edges: ['edge3']})
                .withArgs({pagination: {start: 3, end: 4}})
                .resolves({nodes: [], edges: []});

            const getResourceGraphPaginator = createPaginator(getResourceGraphQuery, {pageSize: 1});

            const actual = [];

            for await (const page of getResourceGraphPaginator()) {
                actual.push(page);
            }

            assert.deepEqual(actual, [
                {nodes: ['node1'], edges: ['edge1']},
                {nodes: ['node2'], edges: ['edge2']},
                {nodes: ['node3'], edges: ['edge3']}
            ]);
        });

        it('should handle resource too large errors', async () => {
            const resources = [1,2].map(i => {
                const properties = generateBaseResource(AWS_LAMBDA_FUNCTION, i);
                return {id: properties.id, label: 'label', md5Hash: '', properties};
            })

            const mockGetResources = sinon.stub();

            mockGetResources
                .withArgs({pagination: {start: 0, end: 1000}})
                .rejects(new Error(FUNCTION_RESPONSE_SIZE_TOO_LARGE))
                .withArgs({pagination: {start: 0, end: 500}})
                .rejects(new Error(FUNCTION_RESPONSE_SIZE_TOO_LARGE))
                .withArgs({pagination: {start: 0, end: 250}})
                .resolves([resources[0]])
                .withArgs({pagination: {start: 250, end: 1250}})
                .rejects(new Error(FUNCTION_RESPONSE_SIZE_TOO_LARGE))
                .withArgs({pagination: {start: 250, end: 750}})
                .resolves([resources[1]])
                .withArgs({pagination: {start: 750, end: 1750}})
                .resolves([]);

            const getResourcesPaginator = createPaginator(mockGetResources, {pageSize: 1000});

            const actual = [];

            for await (const page of getResourcesPaginator()) {
                actual.push(...page);
            }

            assert.deepEqual(actual, resources);
        });

    });

});