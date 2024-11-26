// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import {build as buildArn} from '@aws-sdk/util-arn-parser';
import logger from './logger.mjs';
import {
    AWS,
    AWS_CN,
    AWS_US_GOV,
    CONTAINS,
    AWS_EC2_SECURITY_GROUP,
    IS_ASSOCIATED_WITH,
    IS_ATTACHED_TO,
    IS_CONTAINED_IN,
    SUBNET,
    VPC,
    AWS_EC2_VPC,
    AWS_EC2_SUBNET,
    CN_NORTH_1,
    CN_NORTHWEST_1,
    US_GOV_EAST_1,
    US_GOV_WEST_1,
    RESOURCE_DISCOVERED,
    SECURITY_GROUP,
    AWS_API_GATEWAY_METHOD,
    AWS_API_GATEWAY_RESOURCE,
    AWS_COGNITO_USER_POOL,
    AWS_ECS_TASK,
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
    AWS_EKS_NODE_GROUP,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_IAM_AWS_MANAGED_POLICY,
    AWS_DYNAMODB_STREAM,
    AWS_EC2_SPOT,
    AWS_EC2_SPOT_FLEET,
    AWS_IAM_INLINE_POLICY,
    AWS_OPENSEARCH_DOMAIN,
    AWS_EC2_INSTANCE,
    AWS_EC2_NETWORK_INTERFACE,
    AWS_EC2_VOLUME,
    AWS_IAM_ROLE
} from './constants.mjs';
import crypto from 'crypto';

export function hash(data) {
    const algo = 'md5';
    let shasum = crypto.createHash(algo).update(JSON.stringify(data)); //NOSONAR - hashing algorithm is only used for comparing two JS objects
    return "" + shasum.digest('hex');
}

export const createRelationship = R.curry((relationshipName, resourceType, {arn, relNameSuffix, resourceName, resourceId, awsRegion, accountId}) => {
    const relationship = {relationshipName}
    if(arn != null) {
        relationship.arn = arn;
    }
    if(resourceType != null) {
        relationship.resourceType = resourceType;
    }
    if(resourceName != null) {
        relationship.resourceName = resourceName;
    }
    if(relNameSuffix != null) {
        relationship.relationshipName = relationshipName + relNameSuffix;
    }
    if(resourceId != null) {
        relationship.resourceId = resourceId;
    }
    if(accountId != null) {
        relationship.accountId = accountId;
    }
    if(awsRegion != null) {
        relationship.awsRegion = awsRegion;
    }
    return relationship;
});

export const createContainsRelationship = createRelationship(CONTAINS);

export const createAssociatedRelationship = createRelationship(IS_ASSOCIATED_WITH);

export const createAttachedRelationship = createRelationship(IS_ATTACHED_TO);

export const createContainedInRelationship = createRelationship(IS_CONTAINED_IN);

export function createContainedInVpcRelationship(resourceId) {
    return createRelationship(IS_CONTAINED_IN + VPC, AWS_EC2_VPC, {resourceId});
}

export function createContainedInSubnetRelationship(resourceId) {
    return createRelationship(IS_CONTAINED_IN + SUBNET, AWS_EC2_SUBNET, {resourceId});
}

export function createAssociatedSecurityGroupRelationship(resourceId) {
    return createRelationship(IS_ASSOCIATED_WITH + SECURITY_GROUP, AWS_EC2_SECURITY_GROUP, {resourceId})
}

export const createArnRelationship = R.curry((relationshipName, arn) => {
    return createRelationship(relationshipName, null, {arn});
});

const chinaRegions = new Map([[CN_NORTH_1, AWS_CN], [CN_NORTHWEST_1, AWS_CN]]);
const govRegions = new Map([[US_GOV_EAST_1, AWS_US_GOV], [US_GOV_WEST_1, AWS_US_GOV]]);

export function createArn({service, accountId = '', region = '', resource}) {
    const partition = chinaRegions.get(region) ?? govRegions.get(region) ?? AWS;
    return buildArn({ service, partition, region, accountId, resource});
}

export function createArnWithResourceType({resourceType, accountId = '', awsRegion: region = '', resourceId}) {
    const [, service, resource] = resourceType.toLowerCase().split('::');
    return createArn({ service, region, accountId, resource: `${resource}/${resourceId}`});
}

export function isObject(val) {
    return typeof val === 'object' && !Array.isArray(val) && val !== null;
}

function objKeysToCamelCase(obj) {
    return Object.entries(obj).reduce((acc, [k, v]) => {
        acc[k.replace(/^./, k[0].toLowerCase())] = v;
        return acc
    }, {});
}

export function objToKeyNameArray(obj) {
    return Object.entries(obj).map(([key, value]) => {
        return {
            key,
            value
        }
    });
}

export function normaliseTags(tags = []) {
    return isObject(tags) ? objToKeyNameArray(tags) : tags.map(objKeysToCamelCase);
}

export function createConfigObject({arn, accountId, awsRegion, availabilityZone, resourceType, resourceId, resourceName, relationships = []}, configuration) {
    const tags = normaliseTags(configuration.Tags ?? configuration.tags);

    return {
        id: arn,
        accountId,
        arn: arn ?? createArn({resourceType, accountId, awsRegion, resourceId}),
        availabilityZone,
        awsRegion,
        configuration: configuration,
        configurationItemStatus: RESOURCE_DISCOVERED,
        resourceId,
        resourceName,
        resourceType,
        tags,
        relationships
    }
}

export function isString(value) {
    return typeof value === 'string' && Object.prototype.toString.call(value) === "[object String]"
}

export function isDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

export function createResourceNameKey({resourceName, resourceType, accountId, awsRegion}) {
    const first = resourceType == null ? '' : `${resourceType}_`;
    return `${first}${resourceName}_${accountId}_${awsRegion}`;
}

export function createResourceIdKey({resourceId, resourceType, accountId, awsRegion}) {
    const first = resourceType == null ? '' : `${resourceType}_`;
    return `${first}${resourceId}_${accountId}_${awsRegion}`;
}

export const safeForEach = R.curry((f, xs) => {
    const errors = [];

    xs.forEach(item => {
        try {
            f(item);
        } catch(error) {
            errors.push({
                error,
                item
            })
        }
    });

    return {errors};
});

export const profileAsync = R.curry((message, f) => {
    return async (...args) => {
        logger.profile(message);
        const result = await f(...args);
        logger.profile(message);
        return result;
    }
});

export const memoize = R.memoizeWith((...args) => JSON.stringify(args));

export const resourceTypesToHash = new Set([
        AWS_API_GATEWAY_METHOD,
        AWS_API_GATEWAY_RESOURCE,
        AWS_DYNAMODB_STREAM,
        AWS_ECS_TASK,
        AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
        AWS_EKS_NODE_GROUP,
        AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
        AWS_IAM_AWS_MANAGED_POLICY,
        AWS_EC2_SPOT,
        AWS_EC2_SPOT_FLEET,
        AWS_IAM_INLINE_POLICY,
        AWS_COGNITO_USER_POOL,
        AWS_OPENSEARCH_DOMAIN
    ]
);

export const resourceTypesToNormalize = [
    AWS_EC2_INSTANCE,
    AWS_EC2_NETWORK_INTERFACE,
    AWS_EC2_SECURITY_GROUP,
    AWS_EC2_SUBNET,
    AWS_EC2_VOLUME,
    AWS_EC2_VPC,
    AWS_IAM_ROLE
];

export const resourceTypesToNormalizeSet = new Set(resourceTypesToNormalize);

const normalizedSuffixSet = new Set(resourceTypesToNormalize.map(resourceType => {
    const [,, relSuffix] = resourceType.split('::');
    return relSuffix.toLowerCase();
}));

export function isQualifiedRelationshipName(relationshipName) {
    return normalizedSuffixSet.has(relationshipName.split(' ').at(-1).toLowerCase());
}
