// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {promisify} from 'node:util';
import zlib from 'node:zlib';
import {Logger} from '@aws-lambda-powertools/logger';
import * as R from 'ramda';
import {z} from 'zod';

const gunzip = promisify(zlib.gunzip);

const logger = new Logger({serviceName: 'WdMyApplicationLogSubscription'});

const envSchema = z.object({
    METRICS_URL: z.string().url(),
    METRICS_UUID: z.string().uuid(),
    SOLUTION_ID: z.string(),
    SOLUTION_VERSION: z.string(),
});

async function post(url, options, payload) {
    const res = await fetch(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(payload),
    });

    const body = await res.json();

    if (!res.ok) {
        logger.error(`Error sending post request to ${url}`, {body});
        throw new Error(`Http error ${res.status} received from server`);
    }

    return body;
}

function createMetricPayload(
    {metricsUuid, solutionId, solutionVersion},
    {type, ...metric}
) {
    return {
        event_name: type,
        solution: solutionId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 21),
        uuid: metricsUuid,
        version: solutionVersion,
        context_version: '1',
        context: metric,
    };
}

export function _handler(env) {
    return async event => {
        const {
            METRICS_URL: metricsUrl,
            METRICS_UUID: metricsUuid,
            SOLUTION_ID: solutionId,
            SOLUTION_VERSION: solutionVersion,
        } = envSchema.parse(env);

        const payload = Buffer.from(event.awslogs.data, 'base64');

        const unzipped = await gunzip(payload);

        const {logEvents = []} = JSON.parse(unzipped.toString());

        logger.info('Log events parsed successfully', {logEvents});

        return Promise.resolve(logEvents)
            .then(
                R.map(logEvent => {
                    const {metricEvent} = JSON.parse(logEvent.message);
                    return createMetricPayload(
                        {metricsUuid, solutionId, solutionVersion},
                        metricEvent
                    );
                })
            )
            .then(
                R.map(payload => {
                    return post(
                        metricsUrl,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                        payload
                    );
                })
            )
            .then(ps => Promise.allSettled(ps))
            .then(results => {
                const [rawFailures, rawSuccesses] = R.partition(
                    res => res.status === 'rejected',
                    results
                );

                const failures = rawFailures.map(x => x.reason);

                logger.info(
                    `There were ${failures.length} errors sending metrics.`
                );

                if (!R.isEmpty(failures)) {
                    logger.error('Errors:', {errors: failures});
                }

                return {failures, successes: rawSuccesses.map(x => x.value)};
            });
    };
}

export const handler = _handler(process.env);
