// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {graphql, rest} from "msw";
import getCostForResource from './fixtures/getCostForResource/default.json';
import getCostForService from './fixtures/getCostForService/default.json';
import getResourcesMetadataResponse from "./fixtures/getResourcesMetadata/default.json";
import getResourcesAccountMetadataResponse from "./fixtures/getResourcesAccountMetadata/default.json";
import getResourcesRegionMetadataResponse from "./fixtures/getResourcesRegionMetadata/default.json";
import getResourcesByCostResponse from './fixtures/getResourcesByCost/default.json';
import getAccounts from './fixtures/getAccounts/default.json';
import getResourceGraph from './fixtures/getResourceGraph/default.json';
import deleteRegions from './fixtures/deleteRegions/default.json'
import * as R from "ramda";
import mockStorageProvider from "./MockStorageProvider";

const {getResourcesRegionMetadata: accounts} = getResourcesRegionMetadataResponse;

const defaultResources = accounts.flatMap(({accountId, regions}) => {
    return regions.flatMap(({name: region, resourceTypes}) => {
        return resourceTypes.flatMap(({count, type: resourceType}) => {
            const resources = [];
            for(let i = 0; i < count; i++) {
                const id = `arn:aws:${accountId}:${region}:${resourceType}:${i}`
                const label = resourceType.replace(/::/g, "_");
                resources.push({
                    id,
                    label,
                    properties: {
                        arn: id,
                        resourceType,
                        accountId,
                        awsRegion: region,
                        availabilityZone: 'availabilityZone',
                        configuration: JSON.stringify({
                            key: label + i,
                            ...(resourceType === 'AWS::EC2::Subnet' ? {state: {value: 'available'}} : {})
                        }),
                        title: id + 'Title',
                        tags: JSON.stringify([
                            {tag:`arnTag=${id}`, value: id, key: 'arnTag'}
                        ])
                    }
                });
            }
            return resources;
        });
    });
});

export function createSearchResourceHandler(initialResources) {
    return (req, res, ctx) => {
        const {accounts = [], resourceTypes, text} = req.variables;
        const accountIds = accounts.map(x => x.accountId);

        const resources = initialResources
            .filter(({properties: {accountId}} ) => R.isEmpty(accountIds) || accountIds.includes(accountId))
            .filter(({properties: {resourceType}}) => resourceTypes == null || resourceTypes.includes(resourceType))
            .filter(resource => R.isEmpty(text) || JSON.stringify(resource).toLowerCase().includes(text.toLowerCase()));

        return res(ctx.data({
            searchResources: {
                resources,
                count: resources.length
            }
        }));
    }
}

export function createGetResourceGraphHandler(resourceGraph) {
    return (req, res, ctx) => {
        const {pagination: {start}} = req.variables;
        const {getResourceGraph: {nodes, edges}} = resourceGraph;

        if (nodes.length < start && edges.length < start) {
            return res(ctx.data({
                getResourceGraph: {
                    nodes: [], edges: []
                }
            }));
        }
        return res(ctx.data(getResourceGraph));
    }
}

const handlers = [
    graphql.query('SearchResources', createSearchResourceHandler(defaultResources)),
    graphql.query('GetResourceGraph', createGetResourceGraphHandler(getResourceGraph)),
    graphql.mutation('DeleteRegions', (req, res, ctx) => {
        return res(ctx.data(deleteRegions));
    }),
    graphql.query('GetResourcesMetadata', (req, res, ctx) => {
        return res(ctx.data(getResourcesMetadataResponse));
    }),
    graphql.query('GetResourcesAccountMetadata', (req, res, ctx) => {
        const {accounts, resourceTypes} = req.variables;
        const accountIds = (accounts ?? []).map(x => x.accountId);

        const {getResourcesAccountMetadata} = getResourcesAccountMetadataResponse;
        const filteredResponse = getResourcesAccountMetadata
            .filter(({accountId}) => R.isEmpty(accountIds) || accountIds.includes(accountId))

        return res(ctx.data({getResourcesAccountMetadata: filteredResponse}));
    }),
    graphql.query('GetResourcesRegionMetadata', (req, res, ctx) => {
        const {accounts} = req.variables;
        const accountIds = (accounts ?? []).map(x => x.accountId);

        const {getResourcesRegionMetadata} = getResourcesRegionMetadataResponse;

        const filteredResponse = getResourcesRegionMetadata
            .filter(({accountId}) => R.isEmpty(accountIds) || accountIds.includes(accountId))

        return res(ctx.data({getResourcesRegionMetadata: filteredResponse}));
    }),
    graphql.query('GetResourcesByCost', (req, res, ctx) => {
        return res(ctx.data(getResourcesByCostResponse));
    }),
    graphql.query('GetCostForResource', (req, res, ctx) => {
        return res(ctx.data(getCostForResource));
    }),
    graphql.query('GetCostForService', (req, res, ctx) => {
        return res(ctx.data(getCostForService));
    }),
    graphql.query('GetAccounts', (req, res, ctx) => {
        return res(ctx.data(getAccounts));
    }),
    graphql.query('GetGlobalTemplate', (req, res, ctx) => {
        return res(ctx.data({getGlobalTemplate: 'Global Template'}));
    }),
    graphql.query('GetRegionalTemplate', (req, res, ctx) => {
        return res(ctx.data({getRegionalTemplate: 'Regional Template'}));
    }),
    graphql.query('ExportToDrawIo', (req, res, ctx) => {
        return res(ctx.data({exportToDrawIo: 'https://mock-drawdiagrams.net'}));
    }),
    rest.get('https://www.mock-s3.com/:level/:type/:name', async (req, res, ctx) => {
        const {level, name, type} = req.params
        const key = `${level}/${type}/${name}`;
        return res(ctx.json(await mockStorageProvider._getObject(key)))
    })
];

export default handlers;