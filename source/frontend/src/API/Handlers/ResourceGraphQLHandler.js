// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {API, graphqlOperation} from 'aws-amplify';
import * as queries from '../GraphQL/queries';
import * as mutations from '../GraphQL/mutations';
import * as R from 'ramda';

export const getResources = params => {
    return API.graphql(graphqlOperation(queries.getResources, params));
};

export const getResourceGraph = params => {
    return API.graphql(graphqlOperation(queries.getResourceGraph, params));
};

export const getResourceGraphPaginated = ({ids, pageSize = 250}) => {
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

export const getResourcesMetadata = params => {
    return API.graphql(graphqlOperation(queries.getResourcesMetadata, params));
};

export const getResourcesAccountMetadata = params => {
    return API.graphql(
        graphqlOperation(queries.getResourcesAccountMetadata, params)
    );
};

export const getResourcesRegionMetadata = params => {
    return API.graphql(
        graphqlOperation(queries.getResourcesRegionMetadata, params)
    );
};

export const searchResources = params => {
    return API.graphql(graphqlOperation(queries.searchResources, params));
};

export const exportToDrawIo = params => {
    return API.graphql(graphqlOperation(queries.exportToDrawIo, params));
};

export const createApplication = params => {
    return API.graphql(graphqlOperation(mutations.createApplication, params));
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
