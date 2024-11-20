// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {API, graphqlOperation} from 'aws-amplify';
import * as queries from '../GraphQL/queries';

export const readResultsFromS3 = params => {
    return API.graphql(graphqlOperation(queries.readResultsFromS3, params));
};

export const getCostForResource = params => {
    return API.graphql(graphqlOperation(queries.getCostForResource, params));
};

export const getCostForService = params => {
    return API.graphql(graphqlOperation(queries.getCostForService, params));
};

export const getResourcesByCost = params => {
    return API.graphql(graphqlOperation(queries.getResourcesByCost, params));
};

export const getResourcesByCostByDay = params => {
    return API.graphql(
        graphqlOperation(queries.getResourcesByCostByDay, params)
    );
};

export function handleResponse(response) {
    if (!response || response.error)
        throw new Error('We could not complete that action. Please try again');
    else return response;
}
