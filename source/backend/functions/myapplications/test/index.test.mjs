// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, it, vi} from 'vitest';
import {assert} from 'chai';
import {_handler} from '../src/index.mjs';
import * as R from 'ramda';

const AWS_ACCOUNT_ID_1 = '111111111111';
const AWS_ACCOUNT_ID_2 = '222222222222';
const AWS_ACCOUNT_ID_3 = '333333333333';
const AWS_ACCOUNT_ID_4 = '444444444444';
const EU_WEST_1 = 'eu-west-1';
const EU_WEST_2 = 'eu-west-2';
const GLOBAL = 'global';

const EXTERNAL_ID = 'stsExternalId'

const APPLICATION_NAME = 'testApplication';
const APPLICATION_TAG = 'myApplicationTag';

describe('index.js', () => {
    const mockLambdaContext = {};

    const mockEnv = {
        AWS_ACCOUNT_ID: AWS_ACCOUNT_ID_1,
        AWS_REGION: EU_WEST_1,
        EXTERNAL_ID,
    };

    class defaultMockServiceCatalogAppRegistry {
        async createApplication() {
            return {
                application: {applicationTag: APPLICATION_TAG},
            };
        }
    }

    class defaultMockResourceGroupsTaggingAPI {
        constructor({region}) {
            if(region === GLOBAL) throw new Error('global region cannot be used to tag resources');
        }

        async tagResources() {
            return {
                FailedResourcesMap: {},
            };
        }
    }

    function defaultCredentialProvider() {
        return {
            accessKeyId: 'accessKeyId',
            secretAccessKey: 'secretAccessKey',
            sessionToken: 'sessionToken',
        };
    }

    const defaultMockDependencies = {
        ServiceCatalogAppRegistry: defaultMockServiceCatalogAppRegistry,
        ResourceGroupsTaggingAPI: defaultMockResourceGroupsTaggingAPI,
        credentialProvider: defaultCredentialProvider,
    };

    describe('handler', () => {
        describe('createApplication', () => {
            it('should throw if any required environment variables are missing', async () => {
                return _handler(defaultMockDependencies, {})(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: 'sameNameApplication',
                            resources: [],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                ).catch(err => {
                    assert.deepEqual(
                        err.message,
                        'Unable to retrieve environment variables'
                    );
                });
            });

            it('should reject payloads with empty resource arrays', async () => {
                return _handler(defaultMockDependencies, mockEnv)(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: 'sameNameApplication',
                            resources: [],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                ).catch(err => {
                    assert.deepEqual(
                        err.message,
                        'Validation error for resources: Array must contain at least 1 element(s)'
                    );
                });
            });

            it('should validate the payload fields are present', async () => {
                return _handler(defaultMockDependencies, mockEnv)(
                    {
                        arguments: {},
                        identity: {username: 'iam:f1f5b46a233d4b1f9e70a6465992ec02'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                ).catch(err => {
                    const errorMessages = err.message.split('\n');

                    assert.deepEqual(errorMessages, [
                        'Validation error for accountId: Required',
                        'Validation error for region: Required',
                        'Validation error for name: Required',
                        'Validation error for resources: Required',
                    ]);
                });
            });

            it('should validate the payload types when present', async () => {
                return _handler(defaultMockDependencies, mockEnv)(
                    {
                        arguments: {
                            accountId: 'xxxx',
                            region: 'ddss',
                            name: '^%$%',
                            resources: [
                                {
                                    accountId: AWS_ACCOUNT_ID_1,
                                    region: EU_WEST_1,
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                                },
                                {
                                    accountId: 'yyyy',
                                    region: 'fdfvdf',
                                    id: 'notArn',
                                },
                                {},
                                {
                                    accountId: AWS_ACCOUNT_ID_1,
                                    region: EU_WEST_1,
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET/' + 'x'.repeat(5000),
                                },
                            ],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                ).catch(err => {
                    const errorMessages = err.message.split('\n');

                    assert.deepEqual(errorMessages, [
                        'Validation error for accountId: Not a valid account ID',
                        "Validation error for region: Invalid enum value. Expected 'af-south-1' | 'ap-east-1' | 'ap-northeast-1' | 'ap-northeast-2' | 'ap-northeast-3' | 'ap-south-1' | 'ap-south-2' | 'ap-southeast-1' | 'ap-southeast-2' | 'ap-southeast-3' | 'ap-southeast-4' | 'ca-central-1' | 'ca-west-1' | 'cn-north-1' | 'cn-northwest-1' | 'eu-central-1' | 'eu-central-2' | 'eu-north-1' | 'eu-south-1' | 'eu-south-2' | 'eu-west-1' | 'eu-west-2' | 'eu-west-3' | 'me-central-1' | 'me-south-1' | 'sa-east-1' | 'us-east-1' | 'us-east-2' | 'us-gov-east-1' | 'us-gov-west-1' | 'us-west-1' | 'us-west-2', received 'ddss'",
                        'Validation error for name: Application name must satisfy the following pattern: [-.\\w]+',
                        'Validation error for resources/1/id: Not a valid ARN',
                        'Validation error for resources/1/accountId: Not a valid account ID',
                        "Validation error for resources/1/region: Invalid enum value. Expected 'global' | 'af-south-1' | 'ap-east-1' | 'ap-northeast-1' | 'ap-northeast-2' | 'ap-northeast-3' | 'ap-south-1' | 'ap-south-2' | 'ap-southeast-1' | 'ap-southeast-2' | 'ap-southeast-3' | 'ap-southeast-4' | 'ca-central-1' | 'ca-west-1' | 'cn-north-1' | 'cn-northwest-1' | 'eu-central-1' | 'eu-central-2' | 'eu-north-1' | 'eu-south-1' | 'eu-south-2' | 'eu-west-1' | 'eu-west-2' | 'eu-west-3' | 'me-central-1' | 'me-south-1' | 'sa-east-1' | 'us-east-1' | 'us-east-2' | 'us-gov-east-1' | 'us-gov-west-1' | 'us-west-1' | 'us-west-2', received 'fdfvdf'",
                        'Validation error for resources/2/id: Required',
                        'Validation error for resources/2/accountId: Required',
                        'Validation error for resources/2/region: Required',
                        'Validation error for resources/3/id: String must contain at most 4096 character(s)',
                    ]);
                });
            });

            it('should reject attempt to create application using global region', async () => {
                return _handler(
                    {
                        ...defaultMockDependencies
                    },
                    mockEnv
                )(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: GLOBAL,
                            name: 'globalApplication',
                            resources: [
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                                    accountId: AWS_ACCOUNT_ID_1,
                                    region: EU_WEST_1,
                                },
                            ],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                ).catch(err => {
                    assert.strictEqual(
                        err.message,
                        "Validation error for region: Invalid enum value. Expected 'af-south-1' | 'ap-east-1' | 'ap-northeast-1' | 'ap-northeast-2' | 'ap-northeast-3' | 'ap-south-1' | 'ap-south-2' | 'ap-southeast-1' | 'ap-southeast-2' | 'ap-southeast-3' | 'ap-southeast-4' | 'ca-central-1' | 'ca-west-1' | 'cn-north-1' | 'cn-northwest-1' | 'eu-central-1' | 'eu-central-2' | 'eu-north-1' | 'eu-south-1' | 'eu-south-2' | 'eu-west-1' | 'eu-west-2' | 'eu-west-3' | 'me-central-1' | 'me-south-1' | 'sa-east-1' | 'us-east-1' | 'us-east-2' | 'us-gov-east-1' | 'us-gov-west-1' | 'us-west-1' | 'us-west-2', received 'global'"
                    );
                });
            });

            it('should handle error when application with same name already exists', async () => {
                class mockErrorServiceCatalogAppRegistry {
                    async createApplication() {
                        throw new Error(
                            "You already own an application 'sameNameApplication'"
                        );
                    }
                }

                return _handler(
                    {
                        ...defaultMockDependencies,
                        ServiceCatalogAppRegistry:
                            mockErrorServiceCatalogAppRegistry,
                    },
                    mockEnv
                )(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: 'sameNameApplication',
                            resources: [
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                                    accountId: AWS_ACCOUNT_ID_1,
                                    region: EU_WEST_1,
                                },
                            ],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                ).catch(err => {
                    assert.strictEqual(
                        err.message,
                        'An application with the name sameNameApplication already exists.'
                    );
                });
            });

            it('should assume role using external ID', async () => {
                const mockCredentialProvider = (
                    {wdAccountId, wdRegion, externalId},
                    {accountId, region}
                ) => {
                    if (externalId == null) {
                        throw new Error('External ID missing');
                    }

                    return {
                        accessKeyId: 'accessKeyId',
                        secretAccessKey: 'secretAccessKey',
                        sessionToken: 'sessionToken',
                    };
                };

                return _handler(
                    {
                        ...defaultMockDependencies,
                        credentialProvider: mockCredentialProvider,
                    },
                    mockEnv
                )(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: APPLICATION_NAME,
                            resources: [
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                                    region: EU_WEST_1,
                                    accountId: AWS_ACCOUNT_ID_1,
                                }
                            ],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                );
            });

            it('should fail the operation for multiple accounts if one role tagging cannot be assumed', async () => {
                const mockCredentialProvider = (
                    {wdAccountId, wdRegion, externalId},
                    {accountId, region}
                ) => {
                    if (accountId !== AWS_ACCOUNT_ID_1) {
                        throw new Error('Unable to assume role');
                    }

                    return {
                        accessKeyId: 'accessKeyId',
                        secretAccessKey: 'secretAccessKey',
                        sessionToken: 'sessionToken',
                    };
                };

                const ps = _handler(
                    {
                        ...defaultMockDependencies,
                        credentialProvider: mockCredentialProvider,
                    },
                    mockEnv
                )(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: APPLICATION_NAME,
                            resources: [
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                                    region: EU_WEST_1,
                                    accountId: AWS_ACCOUNT_ID_1,
                                },
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET1',
                                    region: EU_WEST_1,
                                    accountId: AWS_ACCOUNT_ID_1,
                                },
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET2',
                                    region: EU_WEST_2,
                                    accountId: AWS_ACCOUNT_ID_3,
                                },
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET3',
                                    region: EU_WEST_2,
                                    accountId: AWS_ACCOUNT_ID_3,
                                },
                            ],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                );

                return ps
                    .then(result => {
                        throw Error(
                            `Function should throw an error. Got result ${result}`
                        );
                    })
                    .catch(err => {
                        assert.equal(err.message, 'Unable to assume role');
                    });
            });

            it('should handle partial failures of tagging operation', async () => {
                class partialFailureMockResourceGroupsTaggingAPI {
                    async tagResources({ResourceARNList}) {
                        const failedArn = ResourceARNList.find(x =>
                            [
                                'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                                'arn:aws:s3:::DOC-EXAMPLE-BUCKET2',
                            ].includes(x)
                        );
                        const FailedResourcesMap =
                            failedArn == null ? {} : {[failedArn]: {}};

                        return {
                            FailedResourcesMap,
                        };
                    }
                }

                const actual = await _handler(
                    {
                        ...defaultMockDependencies,
                        ResourceGroupsTaggingAPI:
                            partialFailureMockResourceGroupsTaggingAPI,
                    },
                    mockEnv
                )(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: APPLICATION_NAME,
                            resources: [
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                                    region: EU_WEST_1,
                                    accountId: AWS_ACCOUNT_ID_1,
                                },
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET1',
                                    region: EU_WEST_1,
                                    accountId: AWS_ACCOUNT_ID_1,
                                },
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET2',
                                    region: EU_WEST_2,
                                    accountId: AWS_ACCOUNT_ID_2,
                                },
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET3',
                                    region: EU_WEST_2,
                                    accountId: AWS_ACCOUNT_ID_2,
                                },
                            ],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                );

                assert.deepEqual(actual, {
                    applicationTag: APPLICATION_TAG,
                    name: APPLICATION_NAME,
                    unprocessedResources: [
                        'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                        'arn:aws:s3:::DOC-EXAMPLE-BUCKET2',
                    ],
                });
            });

            it('should tag global resources', async () => {
                const actual = await _handler(
                    {
                        ...defaultMockDependencies
                    },
                    mockEnv
                )(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: APPLICATION_NAME,
                            resources: [
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET',
                                    region: EU_WEST_1,
                                    accountId: AWS_ACCOUNT_ID_1,
                                },
                                {
                                    id: 'arn:aws:s3:::DOC-EXAMPLE-BUCKET1',
                                    region: EU_WEST_1,
                                    accountId: AWS_ACCOUNT_ID_1,
                                },
                                {
                                    id: `arn:aws:iam::${AWS_ACCOUNT_ID_1}:role/myRole`,
                                    region: GLOBAL,
                                    accountId: AWS_ACCOUNT_ID_1,
                                }
                            ],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                );

                assert.deepEqual(actual, {
                    applicationTag: APPLICATION_TAG,
                    name: APPLICATION_NAME,
                    unprocessedResources: [],
                });
            });

            it('should support china and gov-cloud regions', async () => {
                const actual = await _handler(
                    {
                        ...defaultMockDependencies,
                    },
                    mockEnv
                )(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: APPLICATION_NAME,
                            resources: [
                                {
                                    accountId: AWS_ACCOUNT_ID_3,
                                    region: 'cn-north-1',
                                    id: 'arn:aws-cn:s3:::DOC-EXAMPLE-BUCKET',
                                },
                                {
                                    accountId: AWS_ACCOUNT_ID_3,
                                    region: 'cn-northwest-1',
                                    id: 'arn:aws-cn:s3:::DOC-EXAMPLE-BUCKET1',
                                },
                                {
                                    accountId: AWS_ACCOUNT_ID_4,
                                    region: 'us-gov-west-1',
                                    id: 'arn:aws-us-gov:s3:::DOC-EXAMPLE-BUCKET2',
                                },
                                {
                                    accountId: AWS_ACCOUNT_ID_4,
                                    region: 'us-gov-east-1',
                                    id: 'arn:aws-us-gov:s3:::DOC-EXAMPLE-BUCKET3',
                                },
                            ],
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                );

                assert.deepEqual(actual, {
                    applicationTag: APPLICATION_TAG,
                    name: APPLICATION_NAME,
                    unprocessedResources: [],
                });
            });

            it('should support >20 resources in a diagram', async () => {
                const MockResourceGroupsTaggingAPI = vi.fn();
                MockResourceGroupsTaggingAPI.prototype.tagResources = vi
                    .fn()
                    .mockImplementation(() =>
                        Promise.resolve({
                            FailedResourcesMap: {},
                        })
                    );

                const RESOURCE_COUNT = 30;

                const actual = await _handler(
                    {
                        ServiceCatalogAppRegistry:
                        defaultMockServiceCatalogAppRegistry,
                        credentialProvider: defaultCredentialProvider,
                        ResourceGroupsTaggingAPI: MockResourceGroupsTaggingAPI,
                    },
                    mockEnv
                )(
                    {
                        arguments: {
                            accountId: AWS_ACCOUNT_ID_1,
                            region: EU_WEST_1,
                            name: APPLICATION_NAME,
                            resources: R.times(
                                i => ({
                                    accountId: AWS_ACCOUNT_ID_1,
                                    region: 'eu-west-1',
                                    id: `arn:aws-cn:s3:::DOC-EXAMPLE-BUCKET${i}`,
                                }),
                                RESOURCE_COUNT
                            ),
                        },
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'createApplication',
                        },
                    },
                    {}
                );

                assert.deepEqual(actual, {
                    applicationTag: APPLICATION_TAG,
                    name: APPLICATION_NAME,
                    unprocessedResources: [],
                });

                const {calls} =
                    MockResourceGroupsTaggingAPI.prototype.tagResources.mock;

                assert.equal(calls.length, 2);
            });
        });

        describe('unknown field', () => {
            it('should reject payloads with unknown query', async () => {
                const actual = await _handler(defaultMockDependencies, mockEnv)(
                    {
                        arguments: {},
                        identity: {sub: '00000000-1111-2222-3333-000000000000'},
                        info: {
                            fieldName: 'foo',
                        },
                    },
                    mockLambdaContext
                ).catch(err =>
                    assert.strictEqual(
                        err.message,
                        'Unknown field, unable to resolve foo.'
                    )
                );
            });
        });
    });
});
