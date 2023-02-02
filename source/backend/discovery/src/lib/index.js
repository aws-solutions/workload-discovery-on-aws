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
const {persistResourcesAndRelationships, persistAccountData} = require('./persistence');

async function getAllResources(configServiceClient, awsClient, accounts, configAggregator) {
    const accountsMap = new Map(accounts.filter(x => x.isIamRoleDeployed).map(x => [x.accountId, x]));
    return getAllConfigResources(configServiceClient, accountsMap, configAggregator)
        .then(getAllSdkResources(accountsMap, awsClient))
        .then(addAdditionalRelationships(accountsMap, awsClient))
}

async function discoverResources(appSync, awsClient, config) {
    logger.info('Beginning discovery of resources');
    const {accounts, apiClient, configServiceClient} = await initialise(awsClient, appSync, config);

    const [dbLinksMap, dbResourcesMap, resources] = await Promise.all([
        apiClient.getDbRelationshipsMap(),
        apiClient.getDbResourcesMap(),
        getAllResources(configServiceClient, awsClient, accounts, config.configAggregator)
    ]);

    return Promise.resolve(resources)
        .then(R.map(createSaveObject))
        .then(createResourceAndRelationshipDeltas(dbResourcesMap, dbLinksMap))
        .then(persistResourcesAndRelationships(apiClient))
        .then(() => persistAccountData(config, apiClient, accounts));
}

module.exports = {
    discoverResources
}
