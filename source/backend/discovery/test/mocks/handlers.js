// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {generateAwsApiEndpoints} from '../generator.mjs';
import {graphql, http, HttpResponse} from 'msw';

const awsApoEndpoints = generateAwsApiEndpoints('eu-west-1');

const GRAPHQL_URL = 'https://www.workload-discovery/graphql';
const api = graphql.link(GRAPHQL_URL);

const httpHandlers = awsApoEndpoints.map(endpoint =>
    http.get(endpoint.url + '*', () => {
        return HttpResponse.json({}, {status: 200});
    })
);

const graphqlHandlers = [
    api.query('getAccounts', () => {
        return HttpResponse.json({
            data: {
                getAccounts: [
                    {
                        accountId: 'xxxxxxxxxxxx',
                        name: 'Account X',
                        regions: [{name: 'eu-west-1'}, {name: 'us-east-1'}],
                    },
                    {
                        accountId: 'yyyyyyyyyyyy',
                        name: 'Account Y',
                        regions: [{name: 'eu-west-1'}],
                    },
                ],
            },
        });
    }),
    api.query('getResources', () => {
        return HttpResponse.json({
            data: {getResources: []},
        });
    }),
    api.query('getRelationships', () => {
        return HttpResponse.json({
            data: {getRelationships: []},
        });
    }),
    api.mutation('addRelationships', () => {
        return HttpResponse.json({
            data: {addRelationships: []},
        });
    }),
    api.mutation('addResources', () => {
        return HttpResponse.json({
            data: {addResources: []},
        });
    }),
    api.mutation('indexResources', () => {
        return HttpResponse.json({
            data: {indexResources: {unprocessedResources: []}},
        });
    }),
    api.mutation('deleteIndexedResources', () => {
        return HttpResponse.json({
            data: {deleteIndexedResources: {unprocessedResources: []}},
        });
    }),
    api.mutation('deleteResources', () => {
        return HttpResponse.json({
            data: {deleteResources: []},
        });
    }),
    api.mutation('updateIndexedResources', () => {
        return HttpResponse.json({
            data: {updateIndexedResources: {unprocessedResources: []}},
        });
    }),
    api.mutation('updateResources', () => {
        return HttpResponse.json({
            data: {updateResources: []},
        });
    }),
    api.mutation('deleteRelationships', () => {
        return HttpResponse.json({
            data: {deleteRelationships: []},
        });
    }),
    api.mutation('updateAccount', ({variables}) => {
        return HttpResponse.json({
            data: {updateAccount: {...variables}},
        });
    }),
    api.mutation('updateRegions', ({variables}) => {
        return HttpResponse.json({
            data: {updateRegions: {...variables}},
        });
    }),
    api.mutation('addAccounts', () => {
        return HttpResponse.json({
            data: {addAccounts: {unprocessedAccounts: []}},
        });
    }),
    api.mutation('deleteAccounts', () => {
        return HttpResponse.json({
            data: {deleteAccounts: {unprocessedAccounts: []}},
        });
    }),
];

const handlers = [...httpHandlers, ...graphqlHandlers];

export default handlers;
