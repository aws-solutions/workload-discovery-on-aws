// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require('ramda');
const logger = require("../logger");
const {AWS_ORGANIZATIONS} = require("../constants");

async function persistResourcesAndRelationships(apiClient, deltas) {
    const {
        resourceIdsToDelete, resourcesToStore, resourcesToUpdate,
        linksToAdd, linksToDelete
    } = deltas;

    logger.info(`Deleting ${resourceIdsToDelete.length} resources`);
    logger.profile('Total time to upload');
    await apiClient.deleteResources({concurrency: 5, batchSize: 50}, resourceIdsToDelete);

    logger.info(`Updating ${resourcesToUpdate.length} resources`);
    await apiClient.updateResources({concurrency: 10, batchSize: 10}, resourcesToUpdate);

    logger.info(`Storing ${resourcesToStore.length} resources...`);
    await apiClient.storeResources({concurrency: 10, batchSize: 10}, resourcesToStore);

    logger.info(`Deleting ${linksToDelete.length} relationships...`);
    await apiClient.deleteRelationships({concurrency: 5, batchSize: 50}, linksToDelete);

    logger.info(`Storing ${linksToAdd.length} relationships...`);
    await apiClient.storeRelationships({concurrency: 10, batchSize: 20}, linksToAdd);

    logger.profile('Total time to upload');
}

async function persistAccountData(config, apiClient, accountsMap) {
    if(config.crossAccountDiscovery === AWS_ORGANIZATIONS) {
        return apiClient.addCrawledAccounts(Array.from(accountsMap.values()));
    } else {
        return apiClient.updateAccountsCrawledTime(Array.from(accountsMap.keys()));
    }
}

module.exports = {
    persistResourcesAndRelationships: R.curry(persistResourcesAndRelationships),
    persistAccountData
}