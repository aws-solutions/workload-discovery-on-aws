// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import {PromisePool} from '@supercharge/promise-pool';
import {
    createArn,
    createConfigObject
} from '../utils.mjs';
import {
    AWS_TAGS_TAG,
    GLOBAL,
    NOT_APPLICABLE,
    TAG,
    TAGS,
    IS_ASSOCIATED_WITH
} from '../constants.mjs';
import logger from '../logger.mjs';
import createAllBatchResources from './createAllBatchResources.mjs';
import {createFirstOrderHandlers} from './firstOrderHandlers.mjs';
import {createSecondOrderHandlers} from './secondOrderHandlers.mjs';

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

export const getAllSdkResources = R.curry(async (accountsMap, awsClient, resources) => {
    logger.profile('Time to get all resources from AWS SDK');
    const resourcesCopy = [...resources];

    const credentialsTuples = Array.from(accountsMap.entries());

    const batchResources = await createAllBatchResources(credentialsTuples, awsClient);

    batchResources.forEach(resource => resourcesCopy.push(resource));

    const firstOrderHandlers = createFirstOrderHandlers(accountsMap, awsClient);

    const secondOrderHandlers = createSecondOrderHandlers(accountsMap, awsClient);

    const firstOrderResourceTypes = new Set(R.keys(firstOrderHandlers));

    const {results: firstResults, errors: firstErrors} = await PromisePool
        .withConcurrency(15)
        .for(resourcesCopy.filter(({resourceType}) => firstOrderResourceTypes.has(resourceType)))
        .process(async resource => {
            const handler = firstOrderHandlers[resource.resourceType];
            return handler(resource);
        });

    logger.error(`There were ${firstErrors.length} errors when adding first order SDK resources.`);
    logger.debug('Errors: ', {firstErrors});

    firstResults.flat().forEach(resource => resourcesCopy.push(resource) );

    const secondOrderResourceTypes = new Set(R.keys(secondOrderHandlers));

    const {results: secondResults, errors: secondErrors} = await PromisePool
        .withConcurrency(10)
        .for(firstResults.flat().filter(({resourceType}) => secondOrderResourceTypes.has(resourceType)))
        .process(async resource => {
            const handler = secondOrderHandlers[resource.resourceType];
            return handler(resource);
        });

    logger.error(`There were ${secondErrors.length} errors when adding second order SDK resources.`);
    logger.debug('Errors: ', {secondErrors});

    secondResults.flat().forEach(resource => resourcesCopy.push(resource));

    const tags = createTags(resourcesCopy);

    tags.forEach(tag => resourcesCopy.push(tag))

    logger.profile('Time to get all resources from AWS SDK');

    return resourcesCopy;
});