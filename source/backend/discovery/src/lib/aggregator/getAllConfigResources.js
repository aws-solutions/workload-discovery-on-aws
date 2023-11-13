// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {PromisePool} = require('@supercharge/promise-pool');
const R = require('ramda');
const logger = require("../logger");
const {
    AWS_KINESIS_STREAM,
    AWS_EKS_CLUSTER,
    AWS_ECS_TASK_DEFINITION,
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
    AWS_OPENSEARCH_DOMAIN,
    AWS_SSM_MANAGED_INSTANCE_INVENTORY
} = require("../constants");
const {createArnWithResourceType, isDate, isString, isObject, objToKeyNameArray} = require('../utils')

const unsupportedResourceTypes = [
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER
];

const resourceTypesToExclude = [
    ...unsupportedResourceTypes,
    // the configuration item that Config returns for OpenSearch is missing fields so we use the SDK instead
    AWS_OPENSEARCH_DOMAIN
]

async function getAdvancedQueryUnsupportedResources(configServiceClient, aggregatorName) {
    const {results, errors} = await PromisePool
        .withConcurrency(5)
        .for(unsupportedResourceTypes)
        .process(async resourceType => {
            return configServiceClient.getAggregatorResources(aggregatorName, resourceType);
        });

    logger.error(`There were ${errors.length} errors when importing resource types unsupported by advanced query.`);
    logger.debug('Errors: ', {errors});

    return results.flat();
}

function normaliseConfigurationItem(resource) {
    const {
        arn, resourceType, accountId, awsRegion, resourceId, configuration = {},
        tags = [], configurationItemCaptureTime
    } = resource;
    resource.arn = arn ?? createArnWithResourceType({resourceType, accountId, awsRegion, resourceId});
    resource.id = resource.arn;

    switch (resource.resourceType) {
        // resourceIds for these resource types are not unique per account
        case AWS_ECS_TASK_DEFINITION:
        case AWS_EKS_CLUSTER:
        case AWS_KINESIS_STREAM:
        case AWS_SSM_MANAGED_INSTANCE_INVENTORY:
            resource.resourceId = resource.arn;
            break;
        default:
            break;
    }

    resource.configuration = isString(configuration) ? JSON.parse(configuration) : configuration;
    resource.configurationItemCaptureTime = isDate(configurationItemCaptureTime) ?
        configurationItemCaptureTime.toISOString() : configurationItemCaptureTime;

    // the return type for tags is not always consistent, sometimes it returns an object where the key/value
    // pairs represent the tags names and values
    resource.tags = isObject(tags) ? objToKeyNameArray(tags) : tags;
    resource.relationships = resource.relationships ?? [];
    return resource;
}

async function getAllConfigResources(configServiceClient, configAggregatorName) {
    logger.profile('Time to download resources from Config');
    logger.info('Retrieving resources from Config.');

    return Promise.all([
        getAdvancedQueryUnsupportedResources(configServiceClient, configAggregatorName),
        // We need to exclude the resources we get from querying the aggregator without the SQL
        // API because it returns results in UpperCamelCase whereas the SQL API returns them in
        // camelCase. If these resource types get added to the SQL API we would have duplicates
        // with different casing schemes that could break downstream processing.
        configServiceClient.getAllAggregatorResources(configAggregatorName,
            {excludes: {resourceTypes: resourceTypesToExclude}}
        )
        ])
        .then(R.chain(R.map(normaliseConfigurationItem)))
        .then(R.tap(() => logger.profile('Time to download resources from Config')))
}

module.exports = getAllConfigResources;