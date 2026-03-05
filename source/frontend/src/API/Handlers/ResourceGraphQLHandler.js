// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {client} from '../graphqlClient';
import * as queries from '../GraphQL/queries';
import * as mutations from '../GraphQL/mutations';
import * as R from 'ramda';

export const getResources = variables => {
    return client.graphql({query: queries.getResources, variables});
};

export const getResourceGraph = variables => {
    return client.graphql({query: queries.getResourceGraph, variables});
};

export const getResourceGraphPaginated = ({ids, pageSize = 500}) => {
    async function getResourceGraphRec(
        pagination,
        resourceGraph = {nodes: [], edges: []}
    ) {
        const {end} = pagination;
        const {nodes, edges} = await getResourceGraph({ids, pagination}).then(
            R.pathOr({nodes: [], edges: []}, ['data', 'getResourceGraph'])
        );

        if (R.isEmpty(nodes) && R.isEmpty(edges)) return resourceGraph;

        return getResourceGraphRec(
            {start: end, end: end + pageSize},
            {
                nodes: [...resourceGraph.nodes, ...nodes],
                edges: [...resourceGraph.edges, ...edges],
            }
        );
    }

    return getResourceGraphRec({start: 0, end: pageSize});
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
