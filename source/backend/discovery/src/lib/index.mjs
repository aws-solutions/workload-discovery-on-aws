// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import logger from './logger.mjs';
import {initialise} from './intialisation.mjs';
import getAllConfigResources from './aggregator/getAllConfigResources.mjs';
import {getAllSdkResources} from './sdkResources/index.mjs';
import {addAdditionalRelationships} from './additionalRelationships/index.mjs';
import createResourceAndRelationshipDeltas from './createResourceAndRelationshipDeltas.mjs';
import {createSaveObject, createResourcesRegionMetadata} from './persistence/transformers.mjs';
import {persistResourcesAndRelationships, persistAccounts, processPersistenceFailures} from './persistence/index.mjs';
import {GLOBAL, RESOURCE_NOT_RECORDED} from "./constants.mjs";

const shouldDiscoverResource = R.curry((accountsMap, resource) => {
    const {accountId, awsRegion, configurationItemStatus} = resource;

    if(configurationItemStatus === RESOURCE_NOT_RECORDED) {
        return false;
    }
    // resources from removed accounts/regions can take a while to be deleted from the Config aggregator
    const regions = accountsMap.get(accountId)?.regions ?? [];
    return (accountsMap.has(accountId) && awsRegion === GLOBAL) || regions.includes(awsRegion);
});

export async function discoverResources(appSync, awsClient, config) {
    logger.info('Beginning discovery of resources');
    const {apiClient, configServiceClient} = await initialise(awsClient, appSync, config);

    const accounts = await apiClient.getAccounts();

    const [dbLinksMap, dbResourcesMap, configResources] = await Promise.all([
        apiClient.getDbRelationshipsMap(),
        apiClient.getDbResourcesMap(accounts),
        getAllConfigResources(configServiceClient, config.configAggregator)
    ]);

    const accountsMap = new Map(accounts
        .filter(x => x.isIamRoleDeployed && !x.toDelete)
        .map(account => [account.accountId, R.evolve({regions: R.map(x => x.name)}, account)])
    );

    const resources = await Promise.resolve(configResources)
        .then(R.filter(shouldDiscoverResource(accountsMap)))
        .then(getAllSdkResources(accountsMap, awsClient))
        .then(addAdditionalRelationships(accountsMap, awsClient))
        .then(R.map(createSaveObject));

    return Promise.resolve(resources)
        .then(createResourceAndRelationshipDeltas(dbResourcesMap, dbLinksMap))
        .then(persistResourcesAndRelationships(apiClient))
        .then(processPersistenceFailures(dbResourcesMap, resources))
        .then(createResourcesRegionMetadata)
        .then(persistAccounts(config, apiClient, accounts));
}
