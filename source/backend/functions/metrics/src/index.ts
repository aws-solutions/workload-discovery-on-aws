// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import aws4 from 'aws4';
import * as R from 'ramda';
import z from 'zod';
import {S3Client, S3, paginateListObjectsV2} from '@aws-sdk/client-s3';
import {Logger} from '@aws-lambda-powertools/logger';

const logger = new Logger({serviceName: 'WdMetricsLambda'});

const s3Client = new S3();

const METRIC_EVENT_VERSION = '1';

type DeploymentMetric = {
    costFeatureEnabled: boolean;
    crossAccountDiscovery: string;
    openSearchInstanceType: string;
    neptuneInstanceClass: string;
};

type DiagramMetric = {
    totalDiagrams: number;
};

type AccountMetric = {
    totalAccounts: number;
    totalResources: number;
    medianAccountResources: number;
    averageAccountResources: number;
    maxAccountResources: number;
};

type Metric = AccountMetric & DiagramMetric & DeploymentMetric;

type MetricMetadata = {
    metricsUuid: string;
    solutionId: string;
    solutionVersion: string;
};

export type MetricsPayload = {
    event_name: string;
    solution: string;
    timestamp: string;
    context: Metric;
    context_version: string;
    uuid: string;
    version: string;
};

const envSchema = z.object({
    COST_BUCKET: z.string(),
    CROSS_ACCOUNT_DISCOVERY: z.string(),
    DIAGRAMS_BUCKET: z.string(),
    GRAPHQL_API_ENDPOINT: z.string().url(),
    METRICS_URL: z.string().url(),
    METRICS_UUID: z.string().uuid(),
    SOLUTION_ID: z.string(),
    SOLUTION_VERSION: z.string(),
    OPENSEARCH_INSTANCE_TYPE: z.string(),
    NEPTUNE_INSTANCE_CLASS: z.string(),
});

function createMetricPayload(
    {metricsUuid, solutionId, solutionVersion}: MetricMetadata,
    type: string,
    metric: Metric
): MetricsPayload {
    return {
        event_name: type,
        solution: solutionId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 21),
        uuid: metricsUuid,
        version: solutionVersion,
        context_version: METRIC_EVENT_VERSION,
        context: metric,
    };
}

export async function handler(): Promise<MetricsPayload> {
    const {
        CROSS_ACCOUNT_DISCOVERY: crossAccountDiscovery,
        METRICS_URL: metricsUrl,
        METRICS_UUID: metricsUuid,
        SOLUTION_ID: solutionId,
        SOLUTION_VERSION: solutionVersion,
        GRAPHQL_API_ENDPOINT: graphQlApiEndpoint,
        DIAGRAMS_BUCKET: diagramsBucket,
        COST_BUCKET: costBucket,
        NEPTUNE_INSTANCE_CLASS: neptuneInstanceClass,
        OPENSEARCH_INSTANCE_TYPE: openSearchInstanceType,
    } = envSchema.parse(process.env);

    const [totalDiagrams, costFeatureEnabled, accountMetric] =
        await Promise.all([
            getDiagramsCount(diagramsBucket),
            checkCostFeature(costBucket),
            getAccountAndResourceCount(graphQlApiEndpoint),
        ]);

    const metricsPayload = createMetricPayload(
        {
            metricsUuid,
            solutionId,
            solutionVersion,
        },
        'DeploymentInfoEvent',
        {
            totalDiagrams,
            costFeatureEnabled,
            crossAccountDiscovery,
            openSearchInstanceType,
            neptuneInstanceClass,
            ...accountMetric,
        }
    );

    return sendMetrics(metricsUrl, metricsPayload)
        .then(() => metricsPayload)
        .then(
            R.tap(payload => logger.info('Metric sent successfully', {payload}))
        );
}

async function countS3Objects(Bucket: string, Prefix: string): Promise<number> {
    let count = 0;

    const listObjectsV2Paginator = paginateListObjectsV2(
        {
            client: new S3Client(),
            pageSize: 100,
        },
        {Prefix, Bucket}
    );

    for await (const s3Page of listObjectsV2Paginator) {
        count += s3Page?.KeyCount ?? 0;
    }

    return count;
}

async function getDiagramsCount(diagramsBucket: string): Promise<number> {
    logger.info('Retrieving diagram counts.');
    const [publicDiagramsCount, privateDiagramsCount] = await Promise.all([
        countS3Objects(diagramsBucket, 'public/'),
        countS3Objects(diagramsBucket, 'private/'),
    ]);

    const diagramsCount = publicDiagramsCount + privateDiagramsCount;
    logger.info(`${diagramsCount} diagrams retrieved.`);
    return diagramsCount;
}

async function checkCostFeature(Bucket: string): Promise<boolean> {
    return s3Client
        .headObject({
            Bucket,
            Key: 'aws-programmatic-access-test-object',
        })
        .then(() => true)
        .catch(() => false)
        .then(
            R.tap(enabled =>
                logger.info(
                    `The cost feature is ${enabled ? '' : 'not'} enabled`
                )
            )
        );
}

type GraphQlError = {
    path: string[];
    errorType: string;
    locations: {line: string; column: string}[];
    message: string;
};

class AppSyncError extends Error {
    errors: GraphQlError[];

    constructor(msg: string, errors: GraphQlError[]) {
        super(msg);
        this.errors = errors;
    }
}

type Account = {
    accountId: string;
};

type getAccountsResponse = {
    getAccounts: Account[];
};

export type AccountMetadata = {
    accountId: string;
    count: number;
};

type getResourcesAccountMetadataResponse = {
    getResourcesAccountMetadata: AccountMetadata[];
};

type GqlData = getAccountsResponse | getResourcesAccountMetadataResponse;

type GqlResponse = {
    data?: GqlData;
    errors?: GraphQlError[];
};

function assertErrorsIsNull(
    gqlResponse: GqlResponse
): asserts gqlResponse is {data: GqlData} {
    const {errors, data} = gqlResponse;
    if (data == null && errors != null)
        throw new AppSyncError('There was an error making the request', errors);
}

type GqlVariables = {accounts: Account[]} | Record<string, never>;

async function makeGqlRequest(
    url: string,
    query: string,
    variables: GqlVariables
): Promise<GqlData> {
    const method = 'POST';
    const {hostname, pathname} = new URL(url);

    const signingOptions = {
        method,
        host: hostname,
        path: pathname,
        region: process.env.AWS_REGION,
        body: JSON.stringify({
            query,
            variables,
        }),
        service: 'appsync',
    };

    const sig = aws4.sign(signingOptions);

    const response: GqlResponse = await fetch(url, {
        method: method,
        headers: sig.headers as HeadersInit,
        body: signingOptions.body,
    }).then(res => res.json());

    assertErrorsIsNull(response);

    return response.data;
}

function assertIsGetAccountsResponse(
    data: GqlData
): asserts data is getAccountsResponse {
    if (!Boolean('getAccounts' in data))
        throw new Error('getAccounts response malformed');
}

async function getAccounts(url: string): Promise<Account[]> {
    const query = /* GraphQL */ `
        query GetAccounts {
            getAccounts {
                accountId
            }
        }
    `;

    return makeGqlRequest(url, query, {}).then(data => {
        assertIsGetAccountsResponse(data);
        return data.getAccounts;
    });
}

function assertIsGetResourcesAccountMetadataResponse(
    data: GqlData
): asserts data is getResourcesAccountMetadataResponse {
    if (!Boolean('getResourcesAccountMetadata' in data))
        throw new Error('getResourcesAccountMetadata response malformed');
}

async function getResourcesAccountMetadata(
    url: string,
    accounts: Account[]
): Promise<AccountMetadata[]> {
    const query = /* GraphQL */ `
        query GetResourcesAccountMetadata($accounts: [AccountInput]) {
            getResourcesAccountMetadata(accounts: $accounts) {
                accountId
                count
            }
        }
    `;

    return makeGqlRequest(url, query, {accounts}).then(data => {
        assertIsGetResourcesAccountMetadataResponse(data);
        return data.getResourcesAccountMetadata;
    });
}

async function getAccountAndResourceCount(url: string): Promise<AccountMetric> {
    const BATCH_SIZE = 50;
    logger.info('Retrieving account list');
    return getAccounts(url)
        .then(R.tap(() => logger.info('Accounts retrieved')))
        .then(R.reject((x: Account): boolean => x.accountId === 'aws'))
        .then(xs => R.splitEvery(BATCH_SIZE, xs))
        .then(
            R.tap(xs =>
                logger.info(
                    `Retrieving account metadata in ${xs.length} batches of ${BATCH_SIZE}`
                )
            )
        )
        .then(
            R.map((batch: Account[]): Promise<AccountMetadata[]> => {
                return getResourcesAccountMetadata(url, batch);
            })
        )
        .then(ps => Promise.all(ps))
        .then(R.tap(() => logger.info('Accounts metadata retrieved')))
        .then(
            R.chain((accounts: AccountMetadata[]): number[] =>
                accounts.map(x => x.count)
            )
        )
        .then((counts: number[]) => {
            return {
                totalAccounts: counts.length,
                totalResources: R.sum(counts),
                medianAccountResources: R.median(counts),
                averageAccountResources: R.mean(counts),
                maxAccountResources: Math.max(...counts),
            };
        });
}

async function sendMetrics(url: string, payload: MetricsPayload) {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}
