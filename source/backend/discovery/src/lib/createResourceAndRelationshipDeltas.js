// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require("ramda");
const {iterate} = require('iterare');
const logger = require('./logger');
const {
    GLOBAL,
    AWS_IAM_AWS_MANAGED_POLICY,
    AWS,
    AWS_IAM_INLINE_POLICY,
    AWS_IAM_USER,
    AWS_IAM_ROLE,
    AWS_IAM_POLICY,
    AWS_IAM_GROUP,
    AWS_TAGS_TAG,
    UNKNOWN
} = require("./constants");
const {resourceTypesToHash} = require('./utils')

function createLookUpMaps(resources) {
    const resourceMap = new Map();
    const resourceIdentifierToIdMap = new Map();

    for(let resource of resources) {
        const {id, resourceId, resourceType, resourceName, accountId, awsRegion} = resource;

        if(resourceName != null) {
            resourceIdentifierToIdMap.set(
                createResourceNameKey({resourceType, resourceName, accountId, awsRegion}),
                id);
        }
        resourceIdentifierToIdMap.set(
            createResourceIdKey({resourceType, resourceId, accountId, awsRegion}),
            id);

        resourceMap.set(id, resource);
    }

    return {
        resourceMap,
        resourceIdentifierToIdMap
    }
}

function createResourceNameKey({resourceName, resourceType, accountId, awsRegion}) {
    return `${resourceType}_${resourceName}_${accountId}_${awsRegion}`;
}

function createResourceIdKey({resourceId, resourceType, accountId, awsRegion}) {
    return `${resourceType}_${resourceId}_${accountId}_${awsRegion}`;
}

const globalResourceTypes = new Set([
    AWS_IAM_INLINE_POLICY,
    AWS_IAM_USER,
    AWS_IAM_ROLE,
    AWS_IAM_POLICY,
    AWS_IAM_GROUP,
    AWS_IAM_AWS_MANAGED_POLICY
]);

function isGlobalResourceType(resourceType) {
    return globalResourceTypes.has(resourceType);
}

const createLinksFromRelationships = R.curry((resourceIdentifierToIdMap, resourceMap, resource) => {
    const  {id: source, accountId: sourceAccountId, awsRegion: sourceRegion, relationships = []} = resource;

    return relationships.map(({arn, resourceId, resourceType, resourceName, relationshipName, awsRegion: targetRegion, accountId: targetAccountId}) => {
        const awsRegion = targetRegion ?? (isGlobalResourceType(resourceType) ? GLOBAL : sourceRegion);
        const accountId = resourceType === AWS_IAM_AWS_MANAGED_POLICY ? AWS : (targetAccountId ?? sourceAccountId);

        const findId = arn ?? (resourceId == null ?
            resourceIdentifierToIdMap.get(createResourceNameKey({resourceType, resourceName, accountId, awsRegion})) :
            resourceIdentifierToIdMap.get(createResourceIdKey({resourceType, resourceId, accountId, awsRegion})));
        const {id: target} = resourceMap.get(findId) ?? {id: UNKNOWN};

        return {
            source,
            target,
            label: relationshipName.trim().toUpperCase().replace(/ /g, '_')
        }
    });
});

function getLinkChanges(configLinks, dbLinks) {
    const linksToAdd = iterate(configLinks.values())
        .filter(({source, label, target}) => target !== UNKNOWN && !dbLinks.has(`${source}_${label}_${target}`))
        .toArray();

    const linksToDelete  = iterate(dbLinks.values())
        .filter(({source, label, target}) => target !== UNKNOWN && !configLinks.has(`${source}_${label}_${target}`))
        .map(x => x.id)
        .toArray();

    return {linksToAdd, linksToDelete};
}

function createUpdate(dbResourcesMap) {
    return ({id, md5Hash, properties}) => {
        const {properties: dbProperties} = dbResourcesMap.get(id);
        return {
            id,
            md5Hash,
            properties: Object.entries(properties).reduce((acc, [k, v]) => {
                if(dbProperties[k] !== v) acc[k] = v;
                return acc;
            }, {})
        }
    }
}

function createStore({id, resourceType, md5Hash, properties}) {
    return {
        id,
        md5Hash,
        label: resourceType.replace(/::/g, "_"),
        properties
    }
}

function getResourceChanges(configResources, dbResourcesMap) {
    const configResourceIds = Array.from(configResources.keys());
    const dbResourceIds = Array.from(dbResourcesMap.keys());
    const intersection = R.intersection(configResourceIds, dbResourceIds);

    const addIds = new Set(R.difference(configResourceIds, dbResourceIds))
    const updateIds = new Set(intersection.filter(id => {
        const resource = configResources.get(id);
        const dbResource = dbResourcesMap.get(id);
        if(resourceTypesToHash.has(resource.resourceType)) {
            return resource.md5Hash !== dbResource.md5Hash;
        }
        return resource.resourceType !== AWS_TAGS_TAG && resource.properties.configurationItemCaptureTime !== dbResource.properties.configurationItemCaptureTime
    }));

    return {
        resourcesToStore: iterate(configResources.values()).filter(x => addIds.has(x.id)).map(createStore).toArray(),
        resourceIdsToDelete: R.difference(dbResourceIds, configResourceIds),
        resourcesToUpdate: iterate(configResources.values()).filter(x => updateIds.has(x.id)).map(createUpdate(dbResourcesMap)).toArray()
    }
}

function createResourceAndRelationshipDeltas(dbResourcesMap, dbLinksMap, resources) {
    const {resourceIdentifierToIdMap, resourceMap} = createLookUpMaps(resources);

    const links = resources.flatMap(createLinksFromRelationships(resourceIdentifierToIdMap, resourceMap));
    const configLinksMap = new Map(links.map(x => [`${x.source}_${x.label}_${x.target}`, x]));

    const {linksToAdd, linksToDelete} = getLinkChanges(configLinksMap, dbLinksMap);

    const {resourceIdsToDelete, resourcesToStore, resourcesToUpdate} = getResourceChanges(resourceMap, dbResourcesMap);

    return {
        resourceIdsToDelete, resourcesToStore, resourcesToUpdate,
        linksToAdd, linksToDelete
    }
}

module.exports = R.curry(createResourceAndRelationshipDeltas);