// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {client} from '../graphqlClient';
import * as queries from '../GraphQL/queries';
import * as mutations from '../GraphQL/mutations';
import * as R from 'ramda';
import {isPayloadTooLargeError} from '../../Utils/API/AdaptivePagination';

export const getResources = variables => {
    return client.graphql({query: queries.getResources, variables});
};

export const getResourceGraph = variables => {
    return client.graphql({query: queries.getResourceGraph, variables});
};

export const getResourceGraphPaginated = async ({ids, pageSize: PAGE_SIZE = 500}) => {
    let pageSize = PAGE_SIZE;
    let start = 0;
    let end = pageSize;
    const allNodes = [];
    const allEdges = [];

    let hasMore = true;
    while (hasMore) {
        try {
            const {nodes, edges} = await getResourceGraph({
                ids,
                pagination: {start, end},
            }).then(
                R.pathOr({nodes: [], edges: []}, ['data', 'getResourceGraph'])
            );

            if (R.isEmpty(nodes) && R.isEmpty(edges)) {
                hasMore = false;
            } else {
                allNodes.push(...nodes);
                allEdges.push(...edges);
                start = start + pageSize;
                pageSize = Math.min(PAGE_SIZE, pageSize * 2);
                end = start + pageSize;
            }
        } catch (err) {
            if (isPayloadTooLargeError(err) && pageSize > 1) {
                pageSize = Math.floor(pageSize / 2);
                end = start + pageSize;
            } else {
                throw err;
            }
        }
    }

    return {nodes: allNodes, edges: allEdges};
};

export const getResourcesMetadata = variables => {
    return client.graphql({query: queries.getResourcesMetadata, variables});
};

export const getResourcesAccountMetadata = variables => {
    return client.graphql({query: queries.getResourcesAccountMetadata, variables});
};

export const getResourcesRegionMetadata = variables => {
    return client.graphql({query: queries.getResourcesRegionMetadata, variables});
};

export const searchResources = variables => {
    return client.graphql({query: queries.searchResources, variables});
};

export const exportToDrawIo = variables => {
    return client.graphql({query: queries.exportToDrawIo, variables});
};

export const createApplication = variables => {
    return client.graphql({query: mutations.createApplication, variables});
};

export function handleResponse(response) {
    if (!response || response.error) {
        throw new InvalidRequestException(response.body.errors);
    } else return response;
}

class InvalidRequestException extends Error {
    constructor(errors = [], ...args) {
        super(errors.map(e => e.message).join(', '), ...args);
        this.errors = errors;
        this.name = this.constructor.name;
    }
}
