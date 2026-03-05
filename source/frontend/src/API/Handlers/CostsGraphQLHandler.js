// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {client} from '../graphqlClient';
import * as queries from '../GraphQL/queries';

export const getCostReportProcessingStatus = variables => {
    return client.graphql({query: queries.getCostReportProcessingStatus, variables});
};

export const readResultsFromS3 = variables => {
    return client.graphql({query: queries.readResultsFromS3, variables});
};

export const getCostForResource = variables => {
    return client.graphql({query: queries.getCostForResource, variables});
};

export const getCostForService = variables => {
    return client.graphql({query: queries.getCostForService, variables});
};

export const getResourcesByCost = variables => {
    return client.graphql({query: queries.getResourcesByCost, variables});
};

export const getResourcesByCostByDay = variables => {
    return client.graphql({query: queries.getResourcesByCostByDay, variables});
};

export function handleResponse(response) {
    if (!response || response.error)
        throw new Error('We could not complete that action. Please try again');
    else return response;
}
