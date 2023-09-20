// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import aws4 from 'aws4';
import curry from 'lodash.curry';
import retry from 'async-retry';
import {fromNodeProviderChain} from '@aws-sdk/credential-providers';
import {request} from 'undici';

import logger from './logger.mjs';
import * as mutations from './mutations.mjs';
import * as queries from './queries.mjs';

import {
    CONNECTION_CLOSED_PREMATURELY,
    FUNCTION_RESPONSE_SIZE_TOO_LARGE,
    AWS_ORGANIZATIONS,
    ALLOWED_CROSS_ACCOUNT_DISCOVERY_VALUES
} from './constants.mjs'

const alwaysExclude = [
    'deleteRelationships',
    'deleteResources',
    'addRelationships',
    'addResources',
    'updateResources',
    'indexResources',
    'deleteIndexedResources',
    'updateIndexedResources',
];

const orgsExclude = [
    'getGlobalTemplate',
    'getRegionalTemplate',
    'addAccounts',
    'deleteAccounts',
    'updateAccount',
    'deleteRegions',
    'addRegions',
    'updateRegions'
]

function isUsingOrganizations(crossAccountDiscovery) {
    return crossAccountDiscovery === AWS_ORGANIZATIONS;
}

const costQueries = new Set([
    'costForServiceQuery',
    'costForResourceQuery',
    'resourcesByCostQuery',
    'resourcesByCostByDayQuery',
]);

function isCostQuery(variables) {
    const keys = Object.keys(variables);
    return keys.length === 1 && costQueries.has(keys[0]);
}

function isEmpty(array) {
    return array.length == 0;
}

function isPaginationComplete(response) {
    if(Array.isArray(response)) {
        return isEmpty(response);
    } else if(response.costItems != null) {
        return isEmpty(response.costItems);
    } else if(response.nodes != null && response.edges != null) {
        return isEmpty(response.nodes) && isEmpty(response.edges);
    } else {
        throw new Error('This operation is not paginated.');
    }
}

export function createPaginator(operation, { pageSize: PAGE_SIZE }) {
    return async function* (variables = {}) {
        let pageSize = PAGE_SIZE;
        let start = 0;
        let end = pageSize;
        let response = null;
        while (response == null || !isPaginationComplete(response)) {
            try {
                if(isCostQuery(variables)) {
                    const keys = Object.keys(variables);
                    const key = keys[0];
                    const args = { ...variables[key], pagination: { start, end } };
                    response = await operation({ [key]: { ...args } });
                } else {
                    response = await operation({...variables, pagination: { start, end } });
                }

                if(!isPaginationComplete(response)) yield response;

                start = start + pageSize;
                pageSize = PAGE_SIZE;
                end = end + pageSize;
            } catch (err) {
                if (err.message === FUNCTION_RESPONSE_SIZE_TOO_LARGE) {
                    pageSize = Math.floor(pageSize / 2);
                    logger.debug(`Lambda response size too large, reducing page size to ${pageSize}`);
                    end = start + pageSize;
                } else {
                    throw err;
                }
            }
        }
    };
}

function errorHandler(bail) {
    return body => {
        const {errors} = body;
        if (errors != null) {
            if (errors.length === 1) {
                const {errorType, message} = errors[0];
                // this transient error can happen due to a bug in the Gremlin client library
                // that the GraphQL lambda uses, 1 retry is normally sufficient
                if (message === CONNECTION_CLOSED_PREMATURELY) {
                    throw new Error(message);
                }
                if (errorType === FUNCTION_RESPONSE_SIZE_TOO_LARGE) {
                    return bail(new Error(errorType));
                }
            }
            logger.error('Error executing gql request', {errors: body.errors})
            return bail(new Error(JSON.stringify(errors)));
        }

        const [queryName] = Object.keys(body.data);
        return body.data[queryName];
    }
}

export function createClient({apiUrl, credentials, crossAccountDiscovery}) {
    if(!ALLOWED_CROSS_ACCOUNT_DISCOVERY_VALUES.includes(crossAccountDiscovery)) {
        throw new Error(`The crossAccountDiscovery parameter must one of: ${ALLOWED_CROSS_ACCOUNT_DISCOVERY_VALUES}.`);
    }

    const {groups: {region}} = apiUrl.match(/appsync-api\.(?<region>.*)\.amazonaws\.com/) ?? {groups: {}};

    if(region == null) {
        throw new Error(`The apiUrl parameter value is not a valid AppSync URL.`);
    }

    const url = new URL(apiUrl);

    const exclude = new Set([
        ...alwaysExclude,
        ...(isUsingOrganizations(crossAccountDiscovery) ? orgsExclude : [])
    ]);

    const sendRequest = curry(async (query, variables) => {
        if (credentials == null) {
            const CredentialsProvider = fromNodeProviderChain();
            credentials = await CredentialsProvider();
        }

        const method = 'POST';

        const signingOptions = {
            method,
            host: url.hostname,
            path: url.pathname,
            region,
            body: JSON.stringify({
                query,
                variables
            }),
            service: 'appsync'
        };

        const sig = aws4.sign(signingOptions, credentials);

        return retry(async bail => {
            return request(apiUrl, {
                method,
                headers: sig.headers,
                body: signingOptions.body
            })
                .catch(err => {
                    logger.error(`Error with HTTP request: ${err.message}`)
                    throw err;
                })
                .then(({body}) => body.json())
                .then(errorHandler(bail))
        }, {
            retries: 3,
            onRetry: (err, count) => {
                logger.error(`Retry attempt no ${count}: ${err.message}`);
            }
        });
    });

    const queryFunctions = Object.entries(queries).reduce((acc, [name, query]) => {
        if(!exclude.has(name)) acc[name] = (variables = {}) => sendRequest(query, variables);
        return acc;
    }, {});

    const mutationFunctions = Object.entries(mutations).reduce((acc, [name, mutation]) => {
        if(!exclude.has(name)) acc[name] = (variables = {}) => sendRequest(mutation, variables);
        return acc;
    }, {});

    return {
        getRegion: () => region,
        sendRequest,
        ...queryFunctions,
        ...mutationFunctions
    };
}
