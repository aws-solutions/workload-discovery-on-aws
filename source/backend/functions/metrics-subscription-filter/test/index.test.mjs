// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import zlib from 'node:zlib';
import sinon from 'sinon';
import {afterAll, afterEach, describe, it, beforeAll, beforeEach} from 'vitest';
import {assert} from 'chai';
import {_handler} from '../src/index.mjs';
import {server} from './mocks/node.mjs';
import {
    METRICS_URL,
    METRICS_UUID,
    SOLUTION_ID,
    SOLUTION_VERSION,
} from './contants.mjs';
import {promisify} from 'node:util';

const gzip = promisify(zlib.gzip);

describe('index.js', () => {
    beforeAll(() => {
        const mockedDate = new Date('2024-01-01');
        sinon.useFakeTimers(mockedDate);
        server.listen();
    });

    beforeEach(() => {
        sinon.reset();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => server.close());

    const env = {
        METRICS_URL,
        METRICS_UUID,
        SOLUTION_ID,
        SOLUTION_VERSION,
    };

    describe('handler', () => {
        it('should send multiple operational metrics to the metrics endpoint', async () => {
            const eventData = {
                logEvents: [
                    {
                        message: JSON.stringify({
                            metricEvent: {
                                type: 'ApplicationCreatedHappyPath1',
                                resourceCount: 2,
                                unprocessedResourceCount: 0,
                                regions: ['eu-west-1', 'us-east-1'],
                            },
                        }),
                    },
                    {
                        message: JSON.stringify({
                            metricEvent: {
                                type: 'ApplicationCreatedHappyPath2',
                                resourceCount: 10,
                                unprocessedResourceCount: 10,
                                regions: ['eu-west-1', 'us-east-1'],
                            },
                        }),
                    },
                ],
            };

            const zipped = await gzip(JSON.stringify(eventData));

            const data = zipped.toString('base64');

            const {failures, successes} = await _handler(env)({
                awslogs: {
                    data,
                },
            });

            assert.lengthOf(failures, 0);

            const happyPath1Expected = successes.find(
                x => x.event_name === 'ApplicationCreatedHappyPath1'
            );
            const happyPath2Expected = successes.find(
                x => x.event_name === 'ApplicationCreatedHappyPath2'
            );

            assert.deepEqual(happyPath1Expected, {
                event_name: 'ApplicationCreatedHappyPath1',
                solution: 'SO0075',
                timestamp: '2024-01-01 00:00:00.0',
                uuid: 'e88870c0-b832-439e-ad77-d414308150f4',
                version: SOLUTION_VERSION,
                context_version: '1',
                context: {
                    resourceCount: 2,
                    unprocessedResourceCount: 0,
                    regions: ['eu-west-1', 'us-east-1'],
                },
            });

            assert.deepEqual(happyPath2Expected, {
                event_name: 'ApplicationCreatedHappyPath2',
                solution: 'SO0075',
                timestamp: '2024-01-01 00:00:00.0',
                uuid: 'e88870c0-b832-439e-ad77-d414308150f4',
                version: SOLUTION_VERSION,
                context_version: '1',
                context: {
                    resourceCount: 10,
                    unprocessedResourceCount: 10,
                    regions: ['eu-west-1', 'us-east-1'],
                },
            });
        });

        it('should handle partial failure when sending multiple operational metrics to the metrics endpoint', async () => {
            const eventData = {
                logEvents: [
                    {
                        message: JSON.stringify({
                            metricEvent: {
                                type: 'ApplicationCreatedSuccess',
                                resourceCount: 2,
                                unprocessedResourceCount: 0,
                                regions: ['eu-west-1', 'us-east-1'],
                            },
                        }),
                    },
                    {
                        message: JSON.stringify({
                            metricEvent: {
                                type: 'ApplicationCreatedFailure',
                                resourceCount: 10,
                                unprocessedResourceCount: 10,
                                regions: ['eu-west-1', 'us-east-1'],
                            },
                        }),
                    },
                ],
            };

            const zipped = await gzip(JSON.stringify(eventData));

            const data = zipped.toString('base64');

            const {failures, successes} = await _handler(env)({
                awslogs: {
                    data,
                },
            });

            assert.lengthOf(successes, 1);
            assert.lengthOf(failures, 1);

            const successExpected = successes.find(
                x => x.event_name === 'ApplicationCreatedSuccess'
            );
            const failureExpected = failures.find(
                x => x.message === 'Http error 400 received from server'
            );

            assert.instanceOf(failureExpected, Error);

            assert.deepEqual(successExpected, {
                event_name: 'ApplicationCreatedSuccess',
                solution: 'SO0075',
                timestamp: '2024-01-01 00:00:00.0',
                uuid: 'e88870c0-b832-439e-ad77-d414308150f4',
                version: SOLUTION_VERSION,
                context_version: '1',
                context: {
                    resourceCount: 2,
                    unprocessedResourceCount: 0,
                    regions: ['eu-west-1', 'us-east-1'],
                },
            });
        });
    });
});
