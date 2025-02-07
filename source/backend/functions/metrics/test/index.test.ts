// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {afterAll, describe, it, beforeAll, beforeEach, vi} from 'vitest';
import {assert} from 'chai';
import {mockClient} from 'aws-sdk-client-mock';
import {
    S3Client,
    HeadObjectCommand,
    ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import {server} from './mocks/node.js';
import {handler, MetricsPayload} from '../src/index.js';
import * as sinon from 'sinon';
import {
    METRICS_URL,
    METRICS_UUID,
    SOLUTION_ID,
    SOLUTION_VERSION,
} from './constants.js';

const s3Mock = mockClient(S3Client);

const defaultEnv = {
    METRICS_UUID,
    METRICS_URL,
    SOLUTION_ID,
    SOLUTION_VERSION,
    REGION: 'us-east-2',
    COST_BUCKET: 'testCostFeatureBucket',
    DIAGRAMS_BUCKET: 'testDiagramBucket',
    IDENTITY_TYPE: 'SAML',
    GRAPHQL_API_ENDPOINT:
        'https://mock.appsync-api.us-east-2.amazonaws.com/graphql',
    AWS_ACCESS_KEY_ID: 'mock-access-key-id',
    AWS_SECRET_ACCESS_KEY: 'mock-secret-access-key-id',
    CROSS_ACCOUNT_DISCOVERY: 'AWS_ORGANIZATIONS',
    OPENSEARCH_INSTANCE_TYPE: 'db.t3.medium',
    NEPTUNE_INSTANCE_CLASS: 't3.small.search',
};

function stubEnvs(env: Record<string, string>) {
    Object.entries(env).forEach(([key, value]) => {
        vi.stubEnv(key, value);
    });
}

describe('index.js', () => {
    beforeAll(() => {
        server.listen();
    });

    afterAll(() => {
        server.close();
        vi.unstubAllEnvs();
    });

    beforeEach(() => {
        s3Mock.reset();
        sinon.reset();
    });

    describe('handler', () => {

        it('should reject identity type that is not Cognito, Google, OIDC or SAML', async () => {
            stubEnvs({...defaultEnv,IDENTITY_TYPE: 'incorrect' });

            return handler()
                .catch(err => {
                    assert.strictEqual(err.errors[0].message, "Invalid enum value. Expected 'Cognito' | 'Google' | 'OIDC' | 'SAML', received 'incorrect'")
                });
        });

        it('should send metric data in v2 event format', async () => {
            stubEnvs(defaultEnv);

            s3Mock
                .on(ListObjectsV2Command, {
                    Bucket: process.env.DIAGRAMS_BUCKET,
                    Prefix: 'private/',
                })
                .resolvesOnce({
                    Contents: [{Key: 'test'}, {Key: 'test2'}],
                    KeyCount: 2,
                });
            s3Mock
                .on(ListObjectsV2Command, {
                    Bucket: process.env.DIAGRAMS_BUCKET,
                    Prefix: 'public/',
                })
                .resolvesOnce({
                    Contents: [{Key: 'test'}, {Key: 'test2'}],
                    KeyCount: 2,
                });
            s3Mock
                .on(HeadObjectCommand, {
                    Bucket: process.env.COST_BUCKET,
                    Key: 'aws-programmatic-access-test-object',
                })
                .resolves({
                    ContentLength: 500,
                });

            const mockedDate = new Date('2024-01-01');
            sinon.useFakeTimers(mockedDate);

            const actual = await handler();

            const expected: MetricsPayload = {
                event_name: 'DeploymentInfoEvent',
                solution: SOLUTION_ID,
                timestamp: '2024-01-01 00:00:00.0',
                uuid: METRICS_UUID,
                version: SOLUTION_VERSION,
                context_version: '2',
                context: {
                    totalDiagrams: 4,
                    costFeatureEnabled: true,
                    crossAccountDiscovery: 'AWS_ORGANIZATIONS',
                    identityType: 'SAML',
                    totalAccounts: 100,
                    totalResources: 495000,
                    medianAccountResources: 4950,
                    averageAccountResources: 4950,
                    maxAccountResources: 9900,
                    neptuneInstanceClass: 't3.small.search',
                    openSearchInstanceType: 'db.t3.medium',
                },
            };

            assert.deepEqual(actual, expected);
        });
    });
});
