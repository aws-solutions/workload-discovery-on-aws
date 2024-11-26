// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import logger from '../logger.mjs';

export const persistResourcesAndRelationships = R.curry(async (apiClient, deltas) => {
    const {
        resourceIdsToDelete, resourcesToStore, resourcesToUpdate,
        linksToAdd, linksToDelete
    } = deltas;

    logger.info(`Deleting ${resourceIdsToDelete.length} resources...`);
    logger.profile('Total time to upload');
    const {errors: deleteResourcesErrors} = await apiClient.deleteResources({concurrency: 5, batchSize: 50}, resourceIdsToDelete);

    logger.info(`Updating ${resourcesToUpdate.length} resources...`);
    await apiClient.updateResources({concurrency: 10, batchSize: 10}, resourcesToUpdate);

    logger.info(`Storing ${resourcesToStore.length} resources...`);
    const {errors: storeResourcesErrors} = await apiClient.storeResources({concurrency: 10, batchSize: 10}, resourcesToStore);

    logger.info(`Deleting ${linksToDelete.length} relationships...`);
    await apiClient.deleteRelationships({concurrency: 5, batchSize: 50}, linksToDelete);

    logger.info(`Storing ${linksToAdd.length} relationships...`);
    await apiClient.storeRelationships({concurrency: 10, batchSize: 20}, linksToAdd);

    logger.profile('Total time to upload');

    return {
        failedDeletes: deleteResourcesErrors.flatMap(x => x.item),
        failedStores: storeResourcesErrors.flatMap(x => x.item.map(x => x.id))
    };
});

export const persistAccounts = R.curry(async ({isUsingOrganizations}, apiClient, accounts, resourcesRegionMetadata) => {
    const accountsWithMetadata = accounts.map(({accountId, ...props}) => {
        return {
            accountId,
            ...props,
            resourcesRegionMetadata: resourcesRegionMetadata.get(accountId)
        }
    });

    if(isUsingOrganizations) {
        const [accountsToDelete, accountsToStore] = R.partition(account => account.toDelete, accountsWithMetadata);
        const [accountsToAdd, accountsToUpdate] = R.partition(account => account.lastCrawled == null, accountsToStore);

        logger.info(`Adding ${accountsToAdd.length} accounts...`);
        logger.info(`Updating ${accountsToUpdate.length} accounts...`);
        logger.info(`Deleting ${accountsToDelete.length} accounts...`);

        const results = await Promise.allSettled([
            apiClient.addCrawledAccounts(accountsToAdd),
            apiClient.updateCrawledAccounts(accountsToUpdate),
            apiClient.deleteAccounts(accountsToDelete.map(x => x.accountId))
        ]);

        results.filter(x => x.status === 'rejected').forEach(res => {
            logger.error('Error', {reason: {message: res.reason.message, stack: res.reason.stack}});
        });
    } else {
        logger.info(`Updating ${accountsWithMetadata.length} accounts...`);
        return apiClient.updateCrawledAccounts(accountsWithMetadata);
    }
});

export const processPersistenceFailures = R.curry((dbResourcesMap, resources, {failedDeletes, failedStores}) => {
    const resourceMap = new Map(resources.map(x => [x.id, x]));
    failedStores.forEach(id => resourceMap.delete(id));
    failedDeletes.forEach(id => resourceMap.set(id, dbResourcesMap.get(id)));
    return Array.from(resourceMap.values());
});
