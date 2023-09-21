// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require('ramda')
const logger = require('./logger');
const {initialise} = require('./intialisation');
const getAllConfigResources = require('./aggregator/getAllConfigResources');
const {getAllSdkResources} = require('./sdkResources');
const {addAdditionalRelationships} = require('./additionalRelationships');
const createResourceAndRelationshipDeltas = require('./createResourceAndRelationshipDeltas');
const {createSaveObject} = require('./persistence/transformers');
const {persistResourcesAndRelationships, persistAccounts} = require('./persistence');
const {GLOBAL} = require("./constants");

async function discoverResources(appSync, awsClient, config) {
    logger.info('Beginning discovery of resources');
    const {apiClient, configServiceClient} = await initialise(awsClient, appSync, config);

    const [accounts, dbLinksMap, dbResourcesMap, configResources] = await Promise.all([
        apiClient.getAccounts(),
        apiClient.getDbRelationshipsMap(),
        apiClient.getDbResourcesMap(),
        getAllConfigResources(configServiceClient, config.configAggregator)
    ]);

    const accountsMap = new Map(accounts.filter(x => x.isIamRoleDeployed && !x.toDelete).map(x => [x.accountId, x]));

    return Promise.resolve(configResources)
        .then(R.filter(({accountId, awsRegion}) => {
            // resources from removed accounts/regions can take a while to be deleted from the Config aggregator
            return (accountsMap.has(accountId) && awsRegion === GLOBAL) || (accountsMap.get(accountId)?.regions ?? []).includes(awsRegion);
        }))
        .then(getAllSdkResources(accountsMap, awsClient))
        .then(addAdditionalRelationships(accountsMap, awsClient))
        .then(R.map(createSaveObject))
        .then(createResourceAndRelationshipDeltas(dbResourcesMap, dbLinksMap))
        .then(persistResourcesAndRelationships(apiClient))
        .then(() => persistAccounts(config, apiClient, accounts));
}

module.exports = {
    discoverResources
}
