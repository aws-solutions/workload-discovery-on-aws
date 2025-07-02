// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    assert,
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    it,
    vi,
} from 'vitest';
import * as R from 'ramda';
import sinon from 'sinon';
import createAppSync from '../../src/lib/apiClient/appSync.mjs';
import {createApiClient} from '../../src/lib/apiClient/index.mjs';
import {setGlobalDispatcher, getGlobalDispatcher} from 'undici';
import {createSuccessThenError} from '../mocks/agents/utils.mjs';
import ConnectionClosedAgent from '../mocks/agents/ConnectionClosed.mjs';
import GetAccountsSelfManaged from '../mocks/agents/GetAccountsSelfManaged.mjs';
import GetAccountsOrgsEmpty from '../mocks/agents/GetAccountsOrgsEmpty.mjs';
import GetAccountsOrgsLastCrawled from '../mocks/agents/GetAccountsOrgsLastCrawled.mjs';
import GetAccountsOrgsDeleted from '../mocks/agents/GetAccountsOrgsDeleted.mjs';
import GetDbResourcesMapPagination from '../mocks/agents/GetDbResourcesMapPagination.mjs';
import GetDbResourcesMapParallel from '../mocks/agents/GetDbResourcesMapParallel.mjs';
import GetDbRelationshipsMapPagination from '../mocks/agents/GetDbRelationshipsMapPagination.mjs';
import GenericError from '../mocks/agents/GenericError.mjs';
import IndexResourcesPartialSuccess from '../mocks/agents/IndexResourcesPartialSuccess.mjs';
import DeleteIndexedResourcesPartialSuccess from '../mocks/agents/DeleteIndexedResourcesPartialSuccess.mjs';
import UpdateIndexedResourcesPartialSuccess from '../mocks/agents/UpdateIndexedResourcesPartialSuccess.mjs';
import {
    CONTAINS,
    AWS_LAMBDA_FUNCTION,
    FUNCTION_RESPONSE_SIZE_TOO_LARGE,
    ACCESS_DENIED,
    ACCESS_DENIED_EXCEPTION,
} from '../../src/lib/constants.mjs';
import {generateBaseResource} from '../generator.mjs';
import {UnprocessedOpenSearchResourcesError} from '../../src/lib/errors.mjs';
import UpdateCrawledAccounts from '../mocks/agents/UpdateCrawledAccounts.mjs';

const ACCOUNT_X = 'xxxxxxxxxxxx';
const ACCOUNT_Y = 'yyyyyyyyyyyy';
const ACCOUNT_Z = 'zzzzzzzzzzzz';
const EU_WEST_1 = 'eu-west-1';
const US_EAST_1 = 'us-east-1';
const US_EAST_2 = 'us-east-2';

describe('index.mjs', () => {
    let globalDispatcher = null;

    beforeAll(() => {
        globalDispatcher = getGlobalDispatcher();
    });

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const defaultMockAwsClient = {
        createEc2Client() {
            return {
                async getAllRegions() {
                    return [];
                },
            };
        },
        createConfigServiceClient() {
            return {
                async isConfigEnabled() {
                    return true;
                },
            };
        },
        createOrganizationsClient() {
            return {
                async getAllAccounts() {
                    return [];
                },
                async getRootAccount() {
                    return {
                        Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`,
                    };
                },
            };
        },
        createStsClient() {
            return {
                getCredentials: async role => {},
            };
        },
    };

    const defaultConfig = {
        isUsingOrganizations: false,
        rootAccountId: ACCOUNT_X,
    };

    const appSync = createAppSync({
        graphgQlUrl: 'https://www.workload-discovery/graphql',
    });
    const apiClient = createApiClient(
        defaultMockAwsClient,
        appSync,
        defaultConfig
    );

    describe('error', () => {
        it('should recover from premature connection closed error', async () => {
            setGlobalDispatcher(ConnectionClosedAgent);
            const resultPromise = apiClient.storeRelationships(
                {concurrency: 10, batchSize: 10},
                [
                    {
                        source: 'sourceArn',
                        target: 'targetArn',
                        label: CONTAINS,
                    },
                ]
            );

            // API requests retry with a gap of a second between each try so we need to advance
            // the Vitest fake timer by more than a second to ensure the retry completes
            await vi.advanceTimersByTimeAsync(2000);

            const actual = await resultPromise;

            assert.deepEqual(actual, {
                errors: [],
                results: [[]],
            });
        });
    });

    describe('getDbResourcesMap', () => {

        it('should page through server results', async () => {
            setGlobalDispatcher(GetDbResourcesMapPagination);
            const actual = await apiClient.getDbResourcesMap();
            assert.deepEqual(
                actual,
                new Map([
                    [
                        'arn1',
                        {
                            id: 'arn1',
                            label: 'label',
                            md5Hash: '',
                            properties: {
                                id: 'arn1',
                                resourceId: 'resourceId1',
                                resourceName: 'resourceName1',
                                resourceType: 'AWS::Lambda::Function',
                                accountId: 'xxxxxxxxxxxx',
                                arn: 'arn1',
                                awsRegion: 'eu-west-1',
                                relationships: [],
                                tags: [],
                                configuration: {
                                    a: 1,
                                },
                            },
                        },
                    ],
                ])
            );
        });

        it('should page through server results in parallel when accounts specified', async () => {
            setGlobalDispatcher(GetDbResourcesMapParallel);
            const actual = await apiClient.getDbResourcesMap(
                {accounts: [{accountId: ACCOUNT_X}, {accountId: ACCOUNT_Y}]}
            );

            assert.deepEqual(
                actual,
                new Map([
                    [
                        'arn1',
                        {
                            id: 'arn1',
                            label: 'label',
                            md5Hash: '',
                            properties: {
                                id: 'arn1',
                                resourceId: 'resourceId1',
                                resourceName: 'resourceName1',
                                resourceType: 'AWS::Lambda::Function',
                                accountId: ACCOUNT_X,
                                arn: 'arn1',
                                awsRegion: 'eu-west-1',
                                relationships: [],
                                tags: [],
                                configuration: {
                                    a: 1,
                                },
                            },
                        },
                    ],
                    [
                        'arn2',
                        {
                            id: 'arn2',
                            label: 'label',
                            md5Hash: '',
                            properties: {
                                id: 'arn2',
                                resourceId: 'resourceId2',
                                resourceName: 'resourceName2',
                                resourceType: 'AWS::Lambda::Function',
                                accountId: ACCOUNT_Y,
                                arn: 'arn2',
                                awsRegion: 'us-west-1',
                                relationships: [],
                                tags: [],
                                configuration: {
                                    a: 2,
                                },
                            },
                        },
                    ],
                ]),
            );
        });

        it('should handle resource to large errors', async () => {
            const resources = [1, 2].map(i => {
                const properties = generateBaseResource(
                    'xxxxxxxxxxxx',
                    'eu-west-1',
                    AWS_LAMBDA_FUNCTION,
                    i
                );
                return {
                    id: properties.id,
                    label: 'label',
                    md5Hash: '',
                    properties,
                };
            });

            const appSync = createAppSync({
                graphgQlUrl: 'https://www.workload-discovery/graphql',
            });
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

            const apiClient = createApiClient(
                defaultMockAwsClient,
                {...appSync, getResources: mockGetResources},
                defaultConfig
            );

            const actual = await apiClient.getDbResourcesMap();

            assert.deepEqual(
                actual,
                new Map(resources.map(resource => [resource.id, resource]))
            );
        });
    });

    describe('getDbRelationshipsMap', () => {
        it('should page through server results', async () => {
            setGlobalDispatcher(GetDbRelationshipsMapPagination);
            const actual = await apiClient.getDbRelationshipsMap();
            assert.deepEqual(
                actual,
                new Map([
                    [
                        'sourceArn_Contains _targetArn',
                        {
                            id: 'testId',
                            source: 'sourceArn',
                            target: 'targetArn',
                            label: CONTAINS,
                        },
                    ],
                ])
            );
        });
    });

    describe('storeResources', () => {
        it('should handle total failure writing resources to OpenSearch', async () => {
            setGlobalDispatcher(GenericError);
            const actual = await apiClient.storeResources(
                {concurrency: 10, batchSize: 10},
                [{}]
            );
            assert.strictEqual(
                actual.errors[0].message,
                '[{"message":"Validation error"}]'
            );
        });

        it('should handle partial success writing resources to OpenSearch', async () => {
            setGlobalDispatcher(IndexResourcesPartialSuccess);
            const actual = await apiClient.storeResources(
                {concurrency: 10, batchSize: 10},
                [
                    {
                        id: 'arn1',
                    },
                    {
                        id: 'arn2',
                    },
                    {
                        id: 'arn3',
                    },
                ]
            );

            assert.lengthOf(actual.errors, 1);
            assert.instanceOf(
                actual.errors[0].raw,
                UnprocessedOpenSearchResourcesError
            );
            assert.deepEqual(actual.errors[0].item, [{id: 'arn1'}]);
        });

        it('should handle errors writing resources to Neptune', async () => {
            setGlobalDispatcher(
                createSuccessThenError(
                    {
                        data: {
                            indexResources: {
                                unprocessedResources: [],
                            },
                        },
                    },
                    'Validation error'
                )
            );
            const actual = await apiClient.storeResources(
                {concurrency: 10, batchSize: 10},
                [{}]
            );
            assert.strictEqual(
                actual.errors[0].message,
                '[{"message":"Validation error"}]'
            );
        });
    });

    describe('deleteResources', () => {
        it('should handle total failure deleting resources from OpenSearch', async () => {
            setGlobalDispatcher(GenericError);
            const actual = await apiClient.deleteResources(
                {concurrency: 10, batchSize: 10},
                [{}]
            );
            assert.strictEqual(
                actual.errors[0].message,
                '[{"message":"Validation error"}]'
            );
        });

        it('should handle partial success deleting resources from OpenSearch', async () => {
            setGlobalDispatcher(DeleteIndexedResourcesPartialSuccess);
            const actual = await apiClient.deleteResources(
                {concurrency: 10, batchSize: 10},
                ['arn1', 'arn2', 'arn3']
            );

            assert.lengthOf(actual.errors, 1);
            assert.instanceOf(
                actual.errors[0].raw,
                UnprocessedOpenSearchResourcesError
            );
            assert.deepEqual(actual.errors[0].item, ['arn1']);
        });

        it('should handle errors deleting resources from Neptune', async () => {
            setGlobalDispatcher(
                createSuccessThenError(
                    {
                        data: {
                            deleteIndexedResources: {
                                unprocessedResources: [],
                            },
                        },
                    },
                    'Validation error'
                )
            );
            const actual = await apiClient.deleteResources(
                {concurrency: 10, batchSize: 10},
                [{}]
            );
            assert.strictEqual(
                actual.errors[0].message,
                '[{"message":"Validation error"}]'
            );
        });
    });

    describe('updateResources', () => {
        it('should handle total failure updating resources in OpenSearch', async () => {
            setGlobalDispatcher(GenericError);
            const actual = await apiClient.updateResources(
                {concurrency: 10, batchSize: 10},
                [{}]
            );
            assert.strictEqual(
                actual.errors[0].message,
                '[{"message":"Validation error"}]'
            );
        });

        it('should handle partial success deleting resources from OpenSearch', async () => {
            setGlobalDispatcher(UpdateIndexedResourcesPartialSuccess);
            const actual = await apiClient.updateResources(
                {concurrency: 10, batchSize: 10},
                [
                    {
                        id: 'arn1',
                    },
                    {
                        id: 'arn2',
                    },
                    {
                        id: 'arn3',
                    },
                ]
            );

            assert.lengthOf(actual.errors, 1);
            assert.instanceOf(
                actual.errors[0].raw,
                UnprocessedOpenSearchResourcesError
            );
            assert.deepEqual(actual.errors[0].item, [{id: 'arn1'}]);
        });

        it('should handle errors updating resources in Neptune', async () => {
            setGlobalDispatcher(
                createSuccessThenError(
                    {
                        data: {
                            updateIndexedResources: {
                                unprocessedResources: [],
                            },
                        },
                    },
                    'Validation error'
                )
            );
            const actual = await apiClient.updateResources(
                {concurrency: 10, batchSize: 10},
                [{}]
            );
            assert.strictEqual(
                actual.errors[0].message,
                '[{"message":"Validation error"}]'
            );
        });
    });

    describe('deleteRelationships', () => {
        it('should handle errors', async () => {
            setGlobalDispatcher(GenericError);
            const actual = await apiClient.deleteRelationships(
                {concurrency: 10, batchSize: 10},
                [{}]
            );
            assert.strictEqual(
                actual.errors[0].message,
                '[{"message":"Validation error"}]'
            );
        });
    });

    describe('updateCrawledAccounts', () => {
        it('should handle errors', async () => {
            setGlobalDispatcher(GenericError);
            const actual = await apiClient.updateCrawledAccounts([
                'xxxxxxxxxxxx',
            ]);
            assert.strictEqual(
                actual.errors[0].message,
                '[{"message":"Validation error"}]'
            );
        });

        it('should update account crawled time and region list', async () => {
            setGlobalDispatcher(UpdateCrawledAccounts);

            const accountX = {
                accountId: ACCOUNT_X,
                isIamRoleDeployed: true,
                name: 'Account X',
                regions: [
                    {name: EU_WEST_1, isConfigEnabled: true},
                    {name: US_EAST_1, isConfigEnabled: false},
                ],
            };

            const accountY = {
                accountId: ACCOUNT_Y,
                isIamRoleDeployed: true,
                name: 'Account Y',
                regions: [
                    {name: US_EAST_1, isConfigEnabled: true},
                    {name: US_EAST_2, isConfigEnabled: true},
                ],
            };

            const date = new Date('2024-01-01');
            vi.setSystemTime(date);

            const {results: actual} = await apiClient.updateCrawledAccounts([
                accountX,
                accountY,
            ]);

            assert.deepEqual(
                actual, [
                    {
                        ...accountX,
                        lastCrawled: '2024-01-01T00:00:00.000Z',
                    }, {
                        ...accountY,
                        lastCrawled: '2024-01-01T00:00:00.000Z',
                    },
                ],
            );
        });
    });

    describe('getAccounts', () => {
        it('should mark accounts that do not have the discovery role', async () => {
            setGlobalDispatcher(GetAccountsSelfManaged);

            const mockAwsClient = {
                createStsClient() {
                    const accessError = new Error();
                    accessError.Code = ACCESS_DENIED;

                    return {
                        getCredentials: sinon
                            .stub()
                            .onFirstCall()
                            .rejects(accessError)
                            .onSecondCall()
                            .resolves({
                                accessKeyId: 'accessKeyId',
                                secretAccessKey: 'secretAccessKey',
                                sessionToken: 'sessionToken',
                            }),
                    };
                },
            };

            const client = createApiClient(
                {...defaultMockAwsClient, ...mockAwsClient},
                appSync,
                defaultConfig
            );

            const accounts = await client.getAccounts();

            const accX = accounts.find(x => x.accountId === ACCOUNT_X);
            const accY = accounts.find(x => x.accountId === ACCOUNT_Y);

            assert.isFalse(accX.isIamRoleDeployed);
            assert.isTrue(accY.isIamRoleDeployed);
        });

        it('should retrieve accounts when not in AWS Organization', async () => {
            setGlobalDispatcher(GetAccountsSelfManaged);

            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCredentials: sinon
                            .stub()
                            .onFirstCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdX',
                                secretAccessKey: 'secretAccessKeyX',
                                sessionToken: 'sessionTokenX',
                            })
                            .onSecondCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdY',
                                secretAccessKey: 'secretAccessKeyY',
                                sessionToken: 'sessionTokenY',
                            }),
                    };
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}];
                        },
                    };
                },
            };

            const client = createApiClient(
                {...defaultMockAwsClient, ...mockAwsClient},
                appSync,
                {
                    ...defaultConfig,
                    isUsingOrganizations: false,
                }
            );

            const accounts = await client.getAccounts();

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
                    {isConfigEnabled: true, name: EU_WEST_1},
                    {isConfigEnabled: true, name: US_EAST_1},
                ],
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
                    {
                        isConfigEnabled: true,
                        name: EU_WEST_1,
                    },
                ],
            });
        });

        it('should retrieve accounts from AWS Organizations', async () => {
            setGlobalDispatcher(GetAccountsOrgsEmpty);

            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCredentials: sinon
                            .stub()
                            .onFirstCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdX',
                                secretAccessKey: 'secretAccessKeyX',
                                sessionToken: 'sessionTokenX',
                            })
                            .onSecondCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdY',
                                secretAccessKey: 'secretAccessKeyY',
                                sessionToken: 'sessionTokenY',
                            }),
                    };
                },
                createConfigServiceClient() {
                    return {
                        async isConfigEnabled() {
                            return true;
                        },
                        async getConfigAggregator() {
                            return {
                                OrganizationAggregationSource: {
                                    AllAwsRegions: true,
                                },
                            };
                        },
                    };
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}];
                        },
                    };
                },
                createOrganizationsClient() {
                    return {
                        async getAllActiveAccountsFromParent() {
                            return [
                                {
                                    Id: ACCOUNT_X,
                                    Name: 'Account X',
                                    isManagementAccount: true,
                                    Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`,
                                },
                                {
                                    Id: ACCOUNT_Y,
                                    Name: 'Account Y',
                                    Arn: `arn:aws:organizations:::${ACCOUNT_Y}:account/o-exampleorgid/:${ACCOUNT_Y}`,
                                },
                            ];
                        },
                    };
                },
            };

            const client = createApiClient(
                {...defaultMockAwsClient, ...mockAwsClient},
                appSync,
                {
                    ...defaultConfig,
                    isUsingOrganizations: true,
                }
            );

            const accounts = await client.getAccounts();

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
                    {isConfigEnabled: true, name: EU_WEST_1},
                    {isConfigEnabled: true, name: US_EAST_1},
                ],
                toDelete: false,
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
                regions: [
                    {isConfigEnabled: true, name: EU_WEST_1},
                    {isConfigEnabled: true, name: US_EAST_1},
                ],
                toDelete: false,
            });
        });

        it('should mark accounts for deletion in AWS Organizations', async () => {
            setGlobalDispatcher(GetAccountsOrgsDeleted);

            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCredentials: sinon
                            .stub()
                            .onFirstCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdX',
                                secretAccessKey: 'secretAccessKeyX',
                                sessionToken: 'sessionTokenX',
                            })
                            .onSecondCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdY',
                                secretAccessKey: 'secretAccessKeyY',
                                sessionToken: 'sessionTokenY',
                            })
                            .onThirdCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdZ',
                                secretAccessKey: 'secretAccessKeyZ',
                                sessionToken: 'sessionTokenZ',
                            }),
                    };
                },
                createConfigServiceClient() {
                    return {
                        async isConfigEnabled() {
                            return true;
                        },
                        async getConfigAggregator() {
                            return {
                                OrganizationAggregationSource: {
                                    AllAwsRegions: true,
                                },
                            };
                        },
                    };
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}];
                        },
                    };
                },
                createOrganizationsClient() {
                    return {
                        async getAllActiveAccountsFromParent() {
                            return [
                                {
                                    Id: ACCOUNT_X,
                                    Name: 'Account X',
                                    isManagementAccount: true,
                                    Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`,
                                },
                                {
                                    Id: ACCOUNT_Y,
                                    Name: 'Account Y',
                                    Arn: `arn:aws:organizations:::${ACCOUNT_Y}:account/o-exampleorgid/:${ACCOUNT_Y}`,
                                },
                            ];
                        },
                    };
                },
            };

            const client = createApiClient(
                {...defaultMockAwsClient, ...mockAwsClient},
                appSync,
                {
                    ...defaultConfig,
                    isUsingOrganizations: true,
                }
            );

            const accounts = await client.getAccounts();

            const accZ = accounts.find(x => x.accountId === ACCOUNT_Z);

            assert.deepEqual(accZ, {
                accountId: ACCOUNT_Z,
                credentials: {
                    accessKeyId: 'accessKeyIdZ',
                    secretAccessKey: 'secretAccessKeyZ',
                    sessionToken: 'sessionTokenZ',
                },
                name: 'Account Z',
                organizationId: 'o-exampleorgid',
                isIamRoleDeployed: true,

                regions: [
                    {isConfigEnabled: true, name: EU_WEST_1},
                    {isConfigEnabled: true, name: US_EAST_1},
                ],
                toDelete: true,
            });
        });

        it('should retain last crawled time from accounts from AWS Organizations', async () => {
            setGlobalDispatcher(GetAccountsOrgsLastCrawled);

            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCredentials: sinon
                            .stub()
                            .onFirstCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdX',
                                secretAccessKey: 'secretAccessKeyX',
                                sessionToken: 'sessionTokenX',
                            }),
                    };
                },
                createConfigServiceClient() {
                    return {
                        async isConfigEnabled() {
                            return true;
                        },
                        async getConfigAggregator() {
                            return {
                                OrganizationAggregationSource: {
                                    AllAwsRegions: true,
                                },
                            };
                        },
                    };
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}];
                        },
                    };
                },
                createOrganizationsClient() {
                    return {
                        async getAllActiveAccountsFromParent() {
                            return [
                                {
                                    Id: ACCOUNT_X,
                                    Name: 'Account X',
                                    isManagementAccount: true,
                                    Arn: `arn:aws:organizations::${ACCOUNT_X}:account/o-exampleorgid/:${ACCOUNT_X}`,
                                },
                            ];
                        },
                    };
                },
            };

            const client = createApiClient(
                {...defaultMockAwsClient, ...mockAwsClient},
                appSync,
                {
                    ...defaultConfig,
                    isUsingOrganizations: true,
                }
            );

            const accounts = await client.getAccounts();

            const accX = accounts.find(x => x.accountId === ACCOUNT_X);

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
                    {isConfigEnabled: true, name: EU_WEST_1},
                    {isConfigEnabled: true, name: US_EAST_1},
                ],
                toDelete: false,
            });
        });

        it('should handle accounts where global resources role does not have Config permissions', async () => {
            setGlobalDispatcher(GetAccountsSelfManaged);

            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCredentials: sinon
                            .stub()
                            .onFirstCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdX',
                                secretAccessKey: 'secretAccessKeyX',
                                sessionToken: 'sessionTokenX',
                            })
                            .onSecondCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdY',
                                secretAccessKey: 'secretAccessKeyY',
                                sessionToken: 'sessionTokenY',
                            }),
                    };
                },
                createConfigServiceClient(credentials, region) {
                    const accessDeniedError = new Error('Access denied');
                    accessDeniedError.name = ACCESS_DENIED_EXCEPTION;

                    return {
                        async isConfigEnabled() {
                            if (credentials.accessKeyId === 'accessKeyIdX')
                                throw accessDeniedError;
                            return true;
                        },
                    };
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}];
                        },
                    };
                },
            };

            const client = createApiClient(
                {...defaultMockAwsClient, ...mockAwsClient},
                appSync,
                {
                    ...defaultConfig,
                    isUsingOrganizations: false,
                }
            );

            const accounts = await client.getAccounts();

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
                    {isConfigEnabled: null, name: EU_WEST_1},
                    {isConfigEnabled: null, name: US_EAST_1},
                ],
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
                    {
                        isConfigEnabled: true,
                        name: EU_WEST_1,
                    },
                ],
            });
        });

        it('should identify regions in accounts where Config is not enabled', async () => {
            setGlobalDispatcher(GetAccountsSelfManaged);

            const mockAwsClient = {
                createStsClient() {
                    return {
                        getCredentials: sinon
                            .stub()
                            .onFirstCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdX',
                                secretAccessKey: 'secretAccessKeyX',
                                sessionToken: 'sessionTokenX',
                            })
                            .onSecondCall()
                            .resolves({
                                accessKeyId: 'accessKeyIdY',
                                secretAccessKey: 'secretAccessKeyY',
                                sessionToken: 'sessionTokenY',
                            }),
                    };
                },
                createConfigServiceClient(credentials, region) {
                    const accessDeniedError = new Error('Access denied');
                    accessDeniedError.name = ACCESS_DENIED_EXCEPTION;

                    return {
                        async isConfigEnabled() {
                            return region !== EU_WEST_1;
                        },
                    };
                },
                createEc2Client() {
                    return {
                        async getAllRegions() {
                            return [{name: EU_WEST_1}, {name: US_EAST_1}];
                        },
                    };
                },
            };

            const client = createApiClient(
                {...defaultMockAwsClient, ...mockAwsClient},
                appSync,
                {
                    ...defaultConfig,
                    isUsingOrganizations: false,
                }
            );

            const accounts = await client.getAccounts();

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
                    {isConfigEnabled: false, name: EU_WEST_1},
                    {isConfigEnabled: true, name: US_EAST_1},
                ],
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
                    {
                        isConfigEnabled: false,
                        name: EU_WEST_1,
                    },
                ],
            });
        });
    });

    describe('addCrawledAccounts', () => {
        it('should add last crawled time if account has deployed discovery IAM role', async () => {
            const mockAddAccount = vi.fn();
            const apiClient = createApiClient(
                defaultMockAwsClient,
                {
                    ...appSync,
                    addAccounts: mockAddAccount,
                },
                defaultConfig
            );

            const accountX = {
                accountId: ACCOUNT_X,
                credentials: {
                    accessKeyId: 'accessKeyIdX',
                    secretAccessKey: 'secretAccessKeyX',
                    sessionToken: 'sessionTokenX',
                },
                toDelete: false,
                name: 'Account X',
                isIamRoleDeployed: true,
                regions: [
                    {isConfigEnabled: false, name: EU_WEST_1},
                    {isConfigEnabled: true, name: US_EAST_1},
                ],
                resourcesRegionMetadata: {
                    accountId: ACCOUNT_X,
                    count: 2,
                    regions: [
                        {
                            name: EU_WEST_1,
                            resourceTypes: [
                                {
                                    count: 1,
                                    type: 'AWS::EC2::Instance',
                                },
                            ],
                        },
                        {
                            name: US_EAST_1,
                            resourceTypes: [
                                {
                                    count: 1,
                                    type: 'AWS::EC2::Instance',
                                },
                            ],
                        },
                    ],
                },
            };

            const date = new Date('2024-01-01');
            vi.setSystemTime(date);

            await apiClient.addCrawledAccounts([accountX]);

            const calls = mockAddAccount.mock.calls;

            assert.deepEqual(calls[0][0], [
                {
                    ...R.omit(['credentials', 'toDelete'], accountX),
                    lastCrawled: '2024-01-01T00:00:00.000Z',
                },
            ]);
        });

        it('should not update last crawled time if account has not deployed discovery IAM role', async () => {
            const mockAddAccount = vi.fn();
            const apiClient = createApiClient(
                defaultMockAwsClient,
                {
                    ...appSync,
                    addAccounts: mockAddAccount,
                },
                defaultConfig
            );

            const accountX = {
                accountId: ACCOUNT_X,
                credentials: {
                    accessKeyId: 'accessKeyIdX',
                    secretAccessKey: 'secretAccessKeyX',
                    sessionToken: 'sessionTokenX',
                },
                lastCrawled: '2023-01-01T00:00:00.000Z',
                toDelete: false,
                name: 'Account X',
                isIamRoleDeployed: false,
                regions: [
                    {isConfigEnabled: false, name: EU_WEST_1},
                    {isConfigEnabled: true, name: US_EAST_1},
                ],
                resourcesRegionMetadata: {
                    accountId: ACCOUNT_X,
                    count: 2,
                    regions: [
                        {
                            name: EU_WEST_1,
                            resourceTypes: [
                                {
                                    count: 1,
                                    type: 'AWS::EC2::Instance',
                                },
                            ],
                        },
                        {
                            name: US_EAST_1,
                            resourceTypes: [
                                {
                                    count: 1,
                                    type: 'AWS::EC2::Instance',
                                },
                            ],
                        },
                    ],
                },
            };

            await apiClient.addCrawledAccounts([accountX]);

            const calls = mockAddAccount.mock.calls;

            assert.deepEqual(calls[0][0], [
                {
                    ...R.omit(['credentials', 'toDelete'], accountX),
                    lastCrawled: '2023-01-01T00:00:00.000Z',
                },
            ]);
        });
    });

    afterAll(() => {
        setGlobalDispatcher(globalDispatcher);
    });
});
