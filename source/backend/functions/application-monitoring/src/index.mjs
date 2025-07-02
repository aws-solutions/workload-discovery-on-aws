// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ApplicationInsights} from '@aws-sdk/client-application-insights';
import {Logger} from '@aws-lambda-powertools/logger';
import pThrottle from 'p-throttle';
import * as R from 'ramda';
import {z} from 'zod';
import {parse as parseArn, build as buildArn} from '@aws-sdk/util-arn-parser';

const logger = new Logger({serviceName: 'WdApplicationMonitoring'});

const SECOND = 1000
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const discoveryTaskFrequencyMap = {
    '15mins': 15 * MINUTE,
    '1hr': 1 * HOUR,
    '2hrs': 2 * HOUR,
    '4hrs': 4 * HOUR,
    '8hrs': 8 * HOUR,
    '12hrs': 12 * HOUR,
    '24hrs': 24 * HOUR,
};

const envSchema = z.object({
    ACCOUNT_ID: z.string().regex(/^(\d{12})$/, {message: 'Not a valid AWS account ID.'}),
    APPLICATION_RESOURCE_GROUP: z.string().regex(/[a-zA-Z0-9.\-_]*/),
    AWS_REGION: z.string(),
    DISCOVERY_TASK_FREQUENCY: z.enum(Object.keys(discoveryTaskFrequencyMap)),
});


const LogContentSchema = z.object({
    natGateways: z.array(z.string()).default([]),
    services: z.array(z.string()),
});

const describeProblemObservationsThrottler = pThrottle({
    limit: 3,
    interval: 1000,
});

async function getApplicationProblems({listProblems, describeProblemObservations}, {
    applicationResourceGroup,
    discoveryTaskFrequency,
}) {
    const {ProblemList} = await listProblems({
        ResourceGroupName: applicationResourceGroup,
        StartTime: new Date(Date.now() - discoveryTaskFrequencyMap[discoveryTaskFrequency]),
        EndTime: new Date(Date.now()),
    });

    return Promise.resolve(ProblemList)
        .then(R.reject(p => ['RESOLVED', 'IGNORE'].includes(p.Status)))
        .then(R.map((async x => {
            const {RelatedObservations} = await describeProblemObservations(x.Id);
            return RelatedObservations.ObservationList;
        })))
        .then(ps => Promise.all(ps))
        .then(R.chain(R.filter(o => {
            if (o.SourceType !== 'LOG') return false;
            // This transient connection error happens due to a bug in the Gremlin client library
            // used by the lambda that queries Neptune. The bug results in the client
            // returning null for any queries issued to the database for all subsequent lambda
            // invocations. The only way to recover is to crash the lambda to allow a
            // fresh lambda instance to take over. We filter this error out here as it is expected
            // and can safely be ignored.
            return !(o.SourceARN.includes('GremlinAppSyncFunction') && o.LogText.includes('Connection closed prematurely'));
        })))
        .then(R.map(o => {
            const {region, partition, accountId} = parseArn(o.SourceARN);

            const vpcConfigErrorProps = o.LogFilter === 'VpcConfigurationAwsServiceChecks' ?
                {
                    ...LogContentSchema.parse(JSON.parse(o.LogText)),
                    __typename: 'VpcConfigLogProblem'
                } : {};

            return {
                __typename: 'GenericLogProblem',
                name: o.LogFilter,
                sourceArn: o.SourceARN,
                logGroupArn: buildArn({
                    region, partition, accountId, service: 'logs', resource: `log-group:${o.LogGroup}`,
                }),
                ...vpcConfigErrorProps,
            };
        }))
        .then(logProblems => {
            return {logProblems};
        });
}

export function _handler(env, appInsightsClient) {
    // All Application Insights APIs support 5TPS so we must throttle our requests. The throttler
    // is created outside the handler so it will be shared across invocations.
    const describeProblemObservations = describeProblemObservationsThrottler(async ProblemId => {
        return appInsightsClient.describeProblemObservations({ProblemId});
    });

    const listProblems = describeProblemObservationsThrottler(async params => {
        return appInsightsClient.listProblems({params});
    });

    return async event => {
        const {
            APPLICATION_RESOURCE_GROUP: applicationResourceGroup,
            DISCOVERY_TASK_FREQUENCY: discoveryTaskFrequency,
        } = envSchema.parse(env);

        const fieldName = event.info.fieldName;

        const userId = event.identity.sub ?? event.identity.username;
        logger.info(`User ${userId} invoked the ${fieldName} operation.`);

        const args = event.arguments;
        logger.info(
            'GraphQL arguments:',
            {arguments: args, operation: fieldName},
        );

        switch (fieldName) {
            case 'getApplicationProblems': {
                return getApplicationProblems({
                    listProblems,
                    describeProblemObservations,
                }, {
                    applicationResourceGroup, discoveryTaskFrequency,
                });
            }
            default: {
                return Promise.reject(
                    new Error(
                        `Unknown field, unable to resolve ${fieldName}.`,
                    ),
                );
            }
        }
    };
}

export const handler = _handler(process.env, new ApplicationInsights());
