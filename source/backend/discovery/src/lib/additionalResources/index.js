const R = require("ramda");
const {PromisePool} = require("@supercharge/promise-pool");
const {
    createArn,
    createConfigObject,
} = require('../utils');
const {
    AWS_TAGS_TAG,
    GLOBAL,
    NOT_APPLICABLE,
    TAG,
    TAGS,
    IS_ASSOCIATED_WITH
} = require('../constants');
const logger = require('../logger');
const createAllBatchResources = require('./createAllBatchResources');
const {createFirstOrderHandlers} = require('./firstOrderHandlers');
const {createSecondOrderHandlers} = require('./secondOrderHandlers')

const createTag = R.curry((accountId, {key, value}) => {
    const resourceName = `${key}=${value}`;
    const arn = createArn({
        service: TAGS, accountId, resource: `${TAG}/${resourceName}`
    });
    return createConfigObject({
        arn,
        accountId,
        awsRegion: GLOBAL,
        availabilityZone: NOT_APPLICABLE,
        resourceType: AWS_TAGS_TAG,
        resourceId: arn,
        resourceName
    }, {});
});

function createTags(resources) {
    const resourceMap = resources.reduce((acc, {accountId, awsRegion, resourceId, resourceName, resourceType, tags = []}) => {
        tags
            .map(createTag(accountId))
            .forEach(tag => {
                const {id, relationships} = tag;
                if (!acc.has(id)) {
                    relationships.push({
                        relationshipName: IS_ASSOCIATED_WITH,
                        resourceId,
                        resourceName,
                        resourceType,
                        awsRegion
                    })
                    acc.set(id, tag);
                } else {
                    acc.get(id).relationships.push({
                        relationshipName: IS_ASSOCIATED_WITH,
                        resourceId,
                        resourceName,
                        resourceType,
                        awsRegion
                    });
                }
            })
        return acc;
    }, new Map());

    return Array.from(resourceMap.values());
}

async function createAdditionalResources(accountsMap, awsClient, resources) {
    const credentialsTuples = Array.from(accountsMap.entries());

    const batchResources = await createAllBatchResources(credentialsTuples, awsClient);

    batchResources.forEach(resource => resources.push(resource));

    const firstOrderHandlers = createFirstOrderHandlers(accountsMap, awsClient);

    const secondOrderHandlers = createSecondOrderHandlers(accountsMap, awsClient);

    const firstOrderResourceTypes = new Set(R.keys(firstOrderHandlers));

    const {results: firstResults, errors: firstErrors} = await PromisePool
        .withConcurrency(15)
        .for(resources.filter(({resourceType}) => firstOrderResourceTypes.has(resourceType)))
        .process(async resource => {
            const handler = firstOrderHandlers[resource.resourceType];
            return handler(resource);
        });

    logger.error(`There were ${firstErrors.length} errors when adding first order additional resources.`);
    logger.debug('Errors: ', {firstErrors});

    firstResults.flat().forEach(resource => resources.push(resource));

    const secondOrderResourceTypes = new Set(R.keys(secondOrderHandlers));

    const {results: secondResults, errors: secondErrors} = await PromisePool
        .withConcurrency(10)
        .for(firstResults.flat().filter(({resourceType}) => secondOrderResourceTypes.has(resourceType)))
        .process(async resource => {
            const handler = secondOrderHandlers[resource.resourceType];
            return handler(resource);
        });

    logger.error(`There were ${secondErrors.length} errors when adding second order additional resources.`);
    logger.debug('Errors: ', {secondErrors});

    secondResults.flat().forEach(resource => resources.push(resource));

    const tags = createTags(resources);

    tags.forEach(tag => resources.push(tag))

    return resources;
}

module.exports = {
    createAdditionalResources: R.curry(createAdditionalResources)
};