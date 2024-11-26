// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import {iterate} from 'iterare';
import {
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
} from './constants.mjs';
import {resourceTypesToHash} from './utils.mjs';

function createLookUpMaps(resources) {
    const resourcesMap = new Map();
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

        resourcesMap.set(id, resource);
    }

    return {
        resourcesMap,
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

const createLinksFromRelationships = R.curry((resourceIdentifierToIdMap, resourcesMap, resource) => {
    const  {id: source, accountId: sourceAccountId, awsRegion: sourceRegion, relationships = []} = resource;

    return relationships.map(({arn, resourceId, resourceType, resourceName, relationshipName, awsRegion: targetRegion, accountId: targetAccountId}) => {
        const awsRegion = targetRegion ?? (isGlobalResourceType(resourceType) ? GLOBAL : sourceRegion);
        const accountId = resourceType === AWS_IAM_AWS_MANAGED_POLICY ? AWS : (targetAccountId ?? sourceAccountId);

        const findId = arn ?? (resourceId == null ?
            resourceIdentifierToIdMap.get(createResourceNameKey({resourceType, resourceName, accountId, awsRegion})) :
            resourceIdentifierToIdMap.get(createResourceIdKey({resourceType, resourceId, accountId, awsRegion})));
        const {id: target} = resourcesMap.get(findId) ?? {id: UNKNOWN};

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

function getResourceChanges(resourcesMap, dbResourcesMap) {
    const resources = Array.from(resourcesMap.values());
    const dbResources = Array.from(dbResourcesMap.values());

    const resourcesToStore = iterate(resources)
        .filter(x => !dbResourcesMap.has(x.id))
        .map(createStore)
        .toArray();

    const resourcesToUpdate = iterate(resources)
        .filter(resource => {
            const {id} = resource;
            if(!dbResourcesMap.has(id)) return false;

            const dbResource = dbResourcesMap.get(id);
            if(resourceTypesToHash.has(resource.resourceType)) {
                return resource.md5Hash !== dbResource.md5Hash;
            }

            // we previously did not ingest the supplementaryConfiguration field so cannot rely on the
            // AWS Config configurationItemCaptureTime timestamp to ascertain if a resource has changed
            if(dbResource.properties.supplementaryConfiguration == null && resource.properties.supplementaryConfiguration != null) {
                return true;
            }

            return resource.resourceType !== AWS_TAGS_TAG && resource.properties.configurationItemCaptureTime !== dbResource.properties.configurationItemCaptureTime;
        })
        .map(createUpdate(dbResourcesMap))
        .toArray();

    const resourceIdsToDelete = iterate(dbResources)
        .filter(x => !resourcesMap.has(x.id))
        .map(x => x.id)
        .toArray();

    return {
        resourcesToStore,
        resourceIdsToDelete,
        resourcesToUpdate
    }
}

function createResourceAndRelationshipDeltas(dbResourcesMap, dbLinksMap, resources) {
    const {resourceIdentifierToIdMap, resourcesMap} = createLookUpMaps(resources);

    const links = resources.flatMap(createLinksFromRelationships(resourceIdentifierToIdMap, resourcesMap));
    const configLinksMap = new Map(links.map(x => [`${x.source}_${x.label}_${x.target}`, x]));

    const {linksToAdd, linksToDelete} = getLinkChanges(configLinksMap, dbLinksMap);

    const {resourceIdsToDelete, resourcesToStore, resourcesToUpdate} = getResourceChanges(resourcesMap, dbResourcesMap);

    return {
        resourceIdsToDelete, resourcesToStore, resourcesToUpdate,
        linksToAdd, linksToDelete
    }
}

export default R.curry(createResourceAndRelationshipDeltas);
