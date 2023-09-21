// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require('ramda');
const logger = require("../logger");

async function persistResourcesAndRelationships(apiClient, deltas) {
    const {
        resourceIdsToDelete, resourcesToStore, resourcesToUpdate,
        linksToAdd, linksToDelete
    } = deltas;

    logger.info(`Deleting ${resourceIdsToDelete.length} resources...`);
    logger.profile('Total time to upload');
    await apiClient.deleteResources({concurrency: 5, batchSize: 50}, resourceIdsToDelete);

    logger.info(`Updating ${resourcesToUpdate.length} resources...`);
    await apiClient.updateResources({concurrency: 10, batchSize: 10}, resourcesToUpdate);

    logger.info(`Storing ${resourcesToStore.length} resources...`);
    await apiClient.storeResources({concurrency: 10, batchSize: 10}, resourcesToStore);

    logger.info(`Deleting ${linksToDelete.length} relationships...`);
    await apiClient.deleteRelationships({concurrency: 5, batchSize: 50}, linksToDelete);

    logger.info(`Storing ${linksToAdd.length} relationships...`);
    await apiClient.storeRelationships({concurrency: 10, batchSize: 20}, linksToAdd);

    logger.profile('Total time to upload');
}

async function persistAccounts({isUsingOrganizations}, apiClient, accounts) {
    if(isUsingOrganizations) {
        const [accountsToDelete, accountsToStore] = R.partition(account => account.toDelete, accounts);
        const [accountsToAdd, accountsToUpdate] = R.partition(account => account.lastCrawled == null, accountsToStore);

        logger.info(`Adding ${accountsToAdd.length} accounts...`);
        logger.info(`Updating ${accountsToUpdate.length} accounts...`);
        logger.info(`Deleting ${accountsToDelete.length} accounts...`);

        return Promise.all([
            apiClient.addCrawledAccounts(accountsToAdd),
            apiClient.updateCrawledAccounts(accountsToUpdate),
            apiClient.deleteAccounts(accountsToDelete.map(x => x.accountId))
        ]);
    } else {
        logger.info(`Updating ${accounts.length} accounts...`);
        return apiClient.updateCrawledAccounts(accounts);
    }
}

module.exports = {
    persistResourcesAndRelationships: R.curry(persistResourcesAndRelationships),
    persistAccounts
}
