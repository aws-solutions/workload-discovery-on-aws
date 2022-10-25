const R = require('ramda');
const {build: buildArn} = require('@aws-sdk/util-arn-parser');

const {
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
    SECURITY_GROUP
} = require('./constants');

const crypto = require('crypto');

function hash(data) {
    const algo = 'md5';
    let shasum = crypto.createHash(algo).update(JSON.stringify(data));
    return "" + shasum.digest('hex');
}

const createRelationship = R.curry((relationshipName, resourceType, {arn, relNameSuffix, resourceName, resourceId, awsRegion, accountId}) => {
    const relationship = {relationshipName, resourceType}
    if(arn != null) {
        relationship.arn = arn;
    }
    if(resourceName != null) {
        relationship.resourceName = resourceName;
    }
    if(relNameSuffix != null) {
        relationship.relationshipName = relationshipName + ' ' + relNameSuffix;
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

const chinaRegions = new Map([[CN_NORTH_1, AWS_CN], [CN_NORTHWEST_1, AWS_CN]]);
const govRegions = new Map([[US_GOV_EAST_1, AWS_US_GOV], [US_GOV_WEST_1, AWS_US_GOV]]);

function createArn({service, accountId = '', region = '', resource}) {
    const partition = chinaRegions.get(region) ?? govRegions.get(region) ?? AWS;
    return buildArn({ service, partition, region, accountId, resource});
}

function createArnWithResourceType({resourceType, accountId = '', awsRegion: region = '', resourceId}) {
    const [, service, resource] = resourceType.toLowerCase().split('::');
    return createArn({ service, region, accountId, resource: `${resource}/${resourceId}`});
}

function isObject(val) {
    return typeof val === 'object' && !Array.isArray(val) && val !== null;
}

function objKeysToCamelCase(obj) {
    return Object.entries(obj).reduce((acc, [k, v]) => {
        acc[k.replace(/^./, k[0].toLowerCase())] = v;
        return acc
    }, {});
}

function objToKeyNameArray(obj) {
    return Object.entries(obj).map(([key, value]) => {
        return {
            key,
            value
        }
    });
}

function normaliseTags(tags = []) {
    return isObject(tags) ? objToKeyNameArray(tags) : tags.map(objKeysToCamelCase);
}

function createConfigObject({arn, accountId, awsRegion, availabilityZone, resourceType, resourceId, resourceName, relationships = []}, configuration) {
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

function isString(value) {
    return typeof value === 'string' && Object.prototype.toString.call(value) === "[object String]"
}

function isDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

module.exports = {
    createContainsRelationship: createRelationship(CONTAINS),
    createAssociatedRelationship: createRelationship(IS_ASSOCIATED_WITH),
    createAttachedRelationship: createRelationship(IS_ATTACHED_TO),
    createContainedInRelationship: createRelationship(IS_CONTAINED_IN),
    createContainedInVpcRelationship: resourceId => createRelationship(IS_CONTAINED_IN + VPC, AWS_EC2_VPC, {resourceId}),
    createContainedInSubnetRelationship: resourceId => createRelationship(IS_CONTAINED_IN + SUBNET, AWS_EC2_SUBNET, {resourceId}),
    createAssociatedSecurityGroupRelationship: resourceId => createRelationship(IS_ASSOCIATED_WITH + SECURITY_GROUP, AWS_EC2_SECURITY_GROUP, {resourceId}),
    createArn,
    createArnWithResourceType,
    createConfigObject,
    hash,
    isDate,
    isString
}