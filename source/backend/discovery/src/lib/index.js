const R = require('ramda')
const logger = require('./logger');
const {initialise} = require('./intialisation');
const getAllConfigResources = require('./aggregator/getAllConfigResources');
const {createAdditionalResources} = require('./additionalResources');
const {createAdditionalRelationships} = require('./additionalRelationships');
const createResourceAndRelationshipDeltas = require('./createResourceAndRelationshipDeltas');
const {createSaveObject} = require('./persistence/transformers');
const {writeResourcesAndRelationships} = require('./persistence');

async function discoverResources(appSync, awsClient, config) {
    logger.info('Beginning discovery of resources');
    const {accountsMap, apiClient, configServiceClient} = await initialise(awsClient, appSync, config);

    return getAllConfigResources(configServiceClient, accountsMap, config.configAggregator)
        .then(createAdditionalResources(accountsMap, awsClient))
        .then(createAdditionalRelationships(accountsMap, awsClient))
        .then(R.map(createSaveObject))
        .then(createResourceAndRelationshipDeltas(apiClient))
        .then(writeResourcesAndRelationships(apiClient))
        .then(() => apiClient.updateAccountsCrawledTime(Array.from(accountsMap.keys())));
}

module.exports = {
    discoverResources
}
