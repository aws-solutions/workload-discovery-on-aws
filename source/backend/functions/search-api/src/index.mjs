// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Client} from '@opensearch-project/opensearch';
import createAwsOpensearchConnector from 'aws-opensearch-connector';
import {Logger} from '@aws-lambda-powertools/logger';
import * as R from 'ramda';

const domain = process.env.ES_DOMAIN; // e.g. search-domain.region.es.amazonaws.com

const INDEX = 'data';

const logger = new Logger({serviceName: 'WdSearchApi'});

const osClient = new Client({
    ...createAwsOpensearchConnector({}),
    node: `https://${domain}`,
});

function unprocessedResourcesHandler(key, items) {
    return items.reduce((acc, {[key]: {error, _id}}) => {
        if (error != null) {
            console.log(
                'Error writing item to index: ' + JSON.stringify(error)
            );
            acc.push(_id);
        }
        return acc;
    }, []);
}

async function indexResources(osClient, resources) {
    const body = resources.flatMap(doc => {
        return [{index: {_index: INDEX, _id: doc.id}}, doc];
    });

    const {
        body: {errors, items},
    } = await osClient.bulk({body});

    const unprocessedResources =
        errors === false ? [] : unprocessedResourcesHandler('index', items);

    return {unprocessedResources};
}

async function updateResources(osClient, resources) {
    const body = resources.flatMap(doc => {
        return [{update: {_index: INDEX, _id: doc.id}}, {doc}];
    });

    const {
        body: {errors, items},
    } = await osClient.bulk({body});

    const unprocessedResources =
        errors === false ? [] : unprocessedResourcesHandler('update', items);

    return {unprocessedResources};
}

async function deleteIndexedResources(osClient, resourceIds) {
    const body = resourceIds.map(id => {
        return {delete: {_index: INDEX, _id: id}};
    });

    const {
        body: {errors, items},
    } = await osClient.bulk({body});

    const unprocessedResources =
        errors === false ? [] : unprocessedResourcesHandler('delete', items);

    return {unprocessedResources};
}

function createProperties(properties) {
    return {
        accountId: properties.accountId,
        arn: properties.arn,
        availabilityZone: properties.availabilityZone,
        awsRegion: properties.awsRegion,
        configuration: properties.configuration ?? '{}',
        loggedInURL: properties.loggedInURL ?? 'N/A',
        loginURL: properties.loginURL ?? 'N/A',
        resourceId: properties.resourceId,
        private: properties.private,
        resourceName: properties.resourceName,
        resourceType: properties.resourceType,
        resourceValue: properties.resourceValue,
        state: properties.state ?? 'N/A',
        subnetId: properties.subnetId,
        tags: properties.tags,
        title: properties.title,
        vpcId: properties.vpcId,
    };
}

async function searchResources(
    osClient,
    text,
    {start = 0, end = 25},
    accounts,
    resourceTypes
) {
    const accountsBoolQuery = accounts.map(({accountId, regions}) => {
        const regionQuery = R.isNil(regions)
            ? []
            : [
                  {
                      terms: {
                          'properties.awsRegion.keyword': regions.map(
                              x => x.name
                          ),
                      },
                  },
              ];

        return {
            bool: {
                must: [
                    {
                        term: {
                            'properties.accountId.keyword': accountId,
                        },
                    },
                    ...regionQuery,
                ],
            },
        };
    });

    const accountsQuery = R.isEmpty(accountsBoolQuery)
        ? []
        : [
              {
                  bool: {
                      should: accountsBoolQuery,
                  },
              },
          ];

    const resourceTypeQuery = R.isEmpty(resourceTypes)
        ? []
        : [{terms: {'properties.resourceType.keyword': resourceTypes}}];

    return osClient
        .search({
            index: INDEX,
            from: start,
            size: end - start,
            body: {
                min_score: 0.1,
                query: {
                    bool: {
                        should: [
                            {
                                multi_match: {query: text},
                            },
                            {
                                wildcard: {
                                    'properties.resourceId': `*${text}*`,
                                },
                            },
                            {
                                wildcard: {
                                    'properties.resourceName': `*${text}*`,
                                },
                            },
                            {
                                wildcard: {
                                    'properties.arn': `*${text}*`,
                                },
                            },
                            {
                                wildcard: {
                                    label: `*${text}*`,
                                },
                            },
                        ],
                        filter: [...accountsQuery, ...resourceTypeQuery],
                    },
                },
            },
        })
        .then(({body: {hits}}) => {
            const resources = (hits.hits ?? []).map(({_source}) => {
                const {id, label, md5hash = '', properties} = _source;
                return {
                    id,
                    label,
                    md5hash,
                    properties: createProperties(properties),
                };
            });

            return {
                count: hits.total.value,
                resources,
            };
        });
}

function deleteIndex(osClient, index) {
    return osClient.indices.delete({index});
}

const MAX_PAGE_SIZE = 1000;

export function _handler(osClient) {
    return async event => {
        const fieldName = event.info.fieldName;

        const userId = event.identity.sub ?? event.identity.username;
        logger.info(`User ${userId} invoked the ${fieldName} operation.`);

        const args = event.arguments;
        logger.info(
            'GraphQL arguments:',
            {arguments: args, operation: fieldName}
        );

        switch (fieldName) {
            case 'indexResources':
                return indexResources(osClient, args.resources);
            case 'deleteIndex':
                return deleteIndex(osClient, INDEX);
            case 'deleteIndexedResources':
                return deleteIndexedResources(osClient, args.resourceIds);
            case 'searchResources':
                const pagination = args.pagination ?? {start: 0, end: 25};

                if (pagination.end - pagination.start > MAX_PAGE_SIZE) {
                    return Promise.reject(
                        new Error(`Maximum page size is ${MAX_PAGE_SIZE}.`)
                    );
                }
                const resourceTypes = args.resourceTypes ?? [];
                const accounts = args.accounts ?? [];
                return searchResources(
                    osClient,
                    args.text,
                    pagination,
                    accounts,
                    resourceTypes
                );
            case 'updateIndexedResources':
                return updateResources(osClient, args.resources);
            default:
                return Promise.reject(
                    new Error(
                        `Unknown field, unable to resolve ${fieldName}.`
                    )
                );
        }
    };
}

export const handler = _handler(osClient);
