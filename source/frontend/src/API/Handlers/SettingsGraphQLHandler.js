// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {API, graphqlOperation} from 'aws-amplify';
import * as queries from '../GraphQL/queries';
import * as mutations from '../GraphQL/mutations';

// Query using a parameter
export const getAccounts = () => {
    return API.graphql(graphqlOperation(queries.getAccounts, {}));
};

export const getAccount = account => {
    return API.graphql(graphqlOperation(queries.getAccount, account));
};

export const addAccounts = params => {
    return API.graphql(graphqlOperation(mutations.addAccounts, params));
};

export const addRegions = params => {
    return API.graphql(graphqlOperation(mutations.addRegions, params));
};

export const deleteRegions = params => {
    return API.graphql(graphqlOperation(mutations.deleteRegions, params));
};

export const deleteAccounts = accountIds => {
    return API.graphql(graphqlOperation(mutations.deleteAccounts, accountIds));
};

export const getGlobalTemplate = () => {
    return API.graphql(graphqlOperation(queries.getGlobalTemplate, {}));
};

export const getRegionalTemplate = () => {
    return API.graphql(graphqlOperation(queries.getRegionalTemplate, {}));
};

export function handleResponse(response) {
    if (!response || response.error) {
        throw new Error('We could not complete that action. Please try again');
    } else return response;
}
