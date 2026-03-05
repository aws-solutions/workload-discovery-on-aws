// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {client} from '../graphqlClient';
import * as queries from '../GraphQL/queries';
import * as mutations from '../GraphQL/mutations';

// Query using a parameter
export const getAccounts = () => {
    return client.graphql({query: queries.getAccounts, variables: {}});
};

export const getAccount = variables => {
    return client.graphql({query: queries.getAccount, variables});
};

export const addAccounts = variables => {
    return client.graphql({query: mutations.addAccounts, variables});
};

export const addRegions = variables => {
    return client.graphql({query: mutations.addRegions, variables});
};

export const deleteRegions = variables => {
    return client.graphql({query: mutations.deleteRegions, variables});
};

export const deleteAccounts = variables => {
    return client.graphql({query: mutations.deleteAccounts, variables});
};

export const getApplicationProblems = variables => {
    return client.graphql({query: queries.getApplicationProblems, variables});
};

export const getGlobalTemplate = () => {
    return client.graphql({query: queries.getGlobalTemplate, variables: {}});
};

export const getRegionalTemplate = () => {
    return client.graphql({query: queries.getRegionalTemplate, variables: {}});
};

export function handleResponse(response) {
    if (!response || response.error) {
        throw new Error('We could not complete that action. Please try again');
    } else return response;
}
