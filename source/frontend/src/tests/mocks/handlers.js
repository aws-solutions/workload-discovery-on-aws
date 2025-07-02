// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {graphql, http, HttpResponse} from 'msw';
import getCostForResource from './fixtures/getCostForResource/default.json';
import getCostForService from './fixtures/getCostForService/default.json';
import getResourcesMetadataResponse from './fixtures/getResourcesMetadata/default.json';
import getResourcesAccountMetadataResponse from './fixtures/getResourcesAccountMetadata/default.json';
import getResourcesRegionMetadataResponse from './fixtures/getResourcesRegionMetadata/default.json';
import getResourcesByCostResponse from './fixtures/getResourcesByCost/default.json';
import getAccounts from './fixtures/getAccounts/default.json';
import getResourceGraph from './fixtures/getResourceGraph/default.json';
import deleteRegions from './fixtures/deleteRegions/default.json';
import * as R from 'ramda';
import mockStorageProvider from './MockStorageProvider';

const {getResourcesRegionMetadata: accounts} =
    getResourcesRegionMetadataResponse;

const defaultResources = accounts.flatMap(({accountId, regions}) => {
    return regions.flatMap(({name: region, resourceTypes}) => {
        return resourceTypes.flatMap(({count, type: resourceType}) => {
            const resources = [];
            for (let i = 0; i < count; i++) {
                const id = `arn:aws:${accountId}:${region}:${resourceType}:${i}`;
                const label = resourceType.replace(/::/g, '_');
                resources.push({
                    id,
                    label,
                    properties: {
                        arn: id,
                        resourceType,
                        accountId,
                        awsRegion: region,
                        availabilityZone: 'availabilityZone',
                        configuration: JSON.stringify({
                            key: label + i,
                            ...(resourceType === 'AWS::EC2::Subnet'
                                ? {state: {value: 'available'}}
                                : {}),
                        }),
                        title: id + 'Title',
                        tags: JSON.stringify([
                            {tag: `arnTag=${id}`, value: id, key: 'arnTag'},
                        ]),
                    },
                });
            }
            return resources;
        });
    });
});

export function createSearchResourceHandler(initialResources) {
    return ({variables}) => {
        const {
            pagination: {start, end},
            accounts = [],
            resourceTypes,
            text,
        } = variables;
        const accountIds = accounts.map(x => x.accountId);

        const resources = initialResources
            .filter(
                ({properties: {accountId}}) =>
                    R.isEmpty(accountIds) || accountIds.includes(accountId)
            )
            .filter(
                ({properties: {resourceType}}) =>
                    resourceTypes == null ||
                    resourceTypes.includes(resourceType)
            )
            .filter(
                resource =>
                    R.isEmpty(text) ||
                    JSON.stringify(resource)
                        .toLowerCase()
                        .includes(text.toLowerCase())
            );

        if (resources.length < start) {
            return HttpResponse.json({
                data: {
                    searchResources: {
                        resources: [],
                        count: resources.length,
                    },
                },
            });
        }

        return HttpResponse.json({
            data: {
                searchResources: {
                    resources: resources.slice(start, end),
                    count: resources.length,
                },
            },
        });
    };
}

export function createGetResourceGraphHandler(resourceGraph) {
    return ({variables}) => {
        const {
            pagination: {start},
        } = variables;
        const {
            getResourceGraph: {nodes, edges},
        } = resourceGraph;

        if (nodes.length < start && edges.length < start) {
            return HttpResponse.json({
                data: {
                    getResourceGraph: {
                        nodes: [],
                        edges: [],
                    },
                },
            });
        }
        return HttpResponse.json({data: getResourceGraph});
    };
}

const handlers = [
    graphql.query(
        'SearchResources',
        createSearchResourceHandler(defaultResources)
    ),
    graphql.query(
        'GetResourceGraph',
        createGetResourceGraphHandler(getResourceGraph)
    ),
    graphql.mutation('DeleteRegions', () =>
        HttpResponse.json({data: deleteRegions})
    ),
    graphql.query('GetResourcesMetadata', () =>
        HttpResponse.json({data: getResourcesMetadataResponse})
    ),
    graphql.query('GetResourcesAccountMetadata', ({variables}) => {
        const {accounts, resourceTypes} = variables;
        const accountIds = (accounts ?? []).map(x => x.accountId);

        const {getResourcesAccountMetadata} =
            getResourcesAccountMetadataResponse;
        const filteredResponse = getResourcesAccountMetadata.filter(
            ({accountId}) =>
                R.isEmpty(accountIds) || accountIds.includes(accountId)
        );

        return HttpResponse.json({
            data: {getResourcesAccountMetadata: filteredResponse},
        });
    }),
    graphql.query('GetResourcesRegionMetadata', ({variables}) => {
        const {accounts} = variables;
        const accountIds = (accounts ?? []).map(x => x.accountId);

        const {getResourcesRegionMetadata} = getResourcesRegionMetadataResponse;

        const filteredResponse = getResourcesRegionMetadata.filter(
            ({accountId}) =>
                R.isEmpty(accountIds) || accountIds.includes(accountId)
        );

        return HttpResponse.json({
            data: {getResourcesRegionMetadata: filteredResponse},
        });
    }),
    graphql.query('GetResourcesByCost', () => {
        return HttpResponse.json({data: getResourcesByCostResponse});
    }),
    graphql.query('GetCostForResource', () => {
        return HttpResponse.json({data: getCostForResource});
    }),
    graphql.query('GetCostForService', () => {
        return HttpResponse.json({data: getCostForService});
    }),
    graphql.query('GetAccounts', () => {
        return HttpResponse.json({data: getAccounts});
    }),
    graphql.query('GetGlobalTemplate', () => {
        return HttpResponse.json({
            data: {getGlobalTemplate: 'Global Template'},
        });
    }),
    graphql.query('GetRegionalTemplate', () => {
        return HttpResponse.json({
            data: {getRegionalTemplate: 'Regional Template'},
        });
    }),
    graphql.query('GetCostReportProcessingStatus', () => {
        return HttpResponse.json({
            data: {
                getCostReportProcessingStatus: {
                    isEnabled: true,
                    crawler: {
                        errorMessage: null,
                        curProcessorLambdaArn:
                            'arn:aws:lambda:eu-west-1:xxxxxxxxxxxx:function:curProcessor',
                        logGroupArn:
                            'arn:aws:logs:eu-west-1:xxxxxxxxxxxx:log-group:/aws-glue/crawlers',
                        lastCrawled: '2025-03-18T15:23:25.000Z',
                        status: 'SUCCEEDED',
                    },
                    reports: {
                        curBucketArn: 'arn:aws:s3:::costandusagereportbucke',
                        lastDelivered: '2025-03-18T15:21:35.000Z',
                    },
                },
            },
        });
    }),
    graphql.query('GetRegionalTemplate', () => {
        return HttpResponse.json({
            data: {getRegionalTemplate: 'Regional Template'},
        });
    }),
    graphql.query('ExportToDrawIo', () => {
        return HttpResponse.json({
            data: {exportToDrawIo: 'https://app.diagrams.net/?src=about'},
        });
    }),
    graphql.query('GetApplicationProblems', () => {
        return HttpResponse.json({
            data: {
                getApplicationProblems: {
                    logProblems: [],
                },
            },
        });
    }),
    graphql.mutation('CreateApplication', ({variables}) => {
        const {name} = variables;
        return HttpResponse.json({
            data: {
                createApplication: {
                    applicationTag: 'myApplicationTag',
                    name,
                    unprocessedResources: [],
                },
            },
        });
    }),
    http.get('https://www.mock-s3.com/:type/:level/:name', async ({params}) => {
        const {type, level, name} = params;
        const key = `${type}/${level}/${name}`;
        return HttpResponse.json(await mockStorageProvider._getObject(key));
    }),
];

export default handlers;
