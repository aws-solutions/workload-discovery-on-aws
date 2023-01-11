// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require('ramda')
const logger = require('./logger');
const {initialise} = require('./intialisation');
const getAllConfigResources = require('./aggregator/getAllConfigResources');
const {createAdditionalResources} = require('./additionalResources');
const {createAdditionalRelationships} = require('./additionalRelationships');
const createResourceAndRelationshipDeltas = require('./createResourceAndRelationshipDeltas');
const {createSaveObject} = require('./persistence/transformers');
const {writeResourcesAndRelationships} = require('./persistence');

function getAllResources(configServiceClient, awsClient, accountsMap, configAggregator) {
    return getAllConfigResources(configServiceClient, accountsMap, configAggregator)
        .then(createAdditionalResources(accountsMap, awsClient))
        .then(createAdditionalRelationships(accountsMap, awsClient))
}

async function discoverResources(appSync, awsClient, config) {
    logger.info('Beginning discovery of resources');
    const {accountsMap, apiClient, configServiceClient} = await initialise(awsClient, appSync, config);

    const [dbLinksMap, dbResourcesMap, resources] = await Promise.all([
        apiClient.getDbRelationshipsMap(),
        apiClient.getDbResourcesMap(),
        getAllResources(configServiceClient, awsClient, accountsMap, config.configAggregator)
    ]);

    return Promise.resolve(resources)
        .then(R.map(createSaveObject))
        .then(createResourceAndRelationshipDeltas(dbResourcesMap, dbLinksMap))
        .then(writeResourcesAndRelationships(apiClient))
        .then(() => apiClient.updateAccountsCrawledTime(Array.from(accountsMap.keys())));
}

module.exports = {
    discoverResources
}
