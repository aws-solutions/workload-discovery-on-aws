const R = require("ramda");
const addBatchedRelationships = require('./addBatchedRelationships');
const addIndividualRelationships = require('./addIndividualRelationships');
const createLookUpMaps = require('./createLookUpMaps');
const logger = require("../logger");
const {
    AWS_EC2_INSTANCE,
    AWS_EC2_NETWORK_INTERFACE,
    AWS_EC2_SUBNET,
    AWS_EC2_VOLUME,
    AWS_IAM_ROLE,
    AWS_TAGS_TAG,
    AWS_CONFIG_RESOURCE_COMPLIANCE,
    AWS_EC2_VPC,
    VPC,
    CONTAINS
} = require("../constants");

/**
 * Config appends the resource type to relationship names for these types but does not do so
 * consistently
 **/
const resourceTypesToNormalize = new Set([
    AWS_EC2_INSTANCE,
    AWS_EC2_NETWORK_INTERFACE,
    AWS_EC2_SUBNET,
    AWS_EC2_VOLUME,
    AWS_IAM_ROLE
])

function normaliseRelationshipNames(resource) {
    if (resource.resourceType !== AWS_TAGS_TAG && resource.resourceType !== AWS_CONFIG_RESOURCE_COMPLIANCE) {
        const {relationships} = resource;
        relationships.forEach(rel => {
            const {resourceType, relationshipName} = rel;
            if(resourceTypesToNormalize.has(resourceType)) {
                const [,, relSuffix] = resourceType.split('::');
                // VPC is in camelcase
                if(resourceType === AWS_EC2_VPC && !relationshipName.includes(VPC)) {
                    rel.relationshipName = relationshipName + VPC;
                } else if(!relationshipName.includes(relSuffix)){
                    rel.relationshipName = relationshipName + relSuffix;
                }
            }
        });
    }
    return resource;
}

function addVpcInfo(resource) {
    if (resource.resourceType !== AWS_TAGS_TAG && resource.resourceType !== AWS_CONFIG_RESOURCE_COMPLIANCE) {
        const {relationships} = resource;

        const [vpcId] = relationships
            .filter(x => x.resourceType === AWS_EC2_VPC)
            .map(x => x.resourceId);

        if (vpcId != null) resource.vpcId = vpcId;

        const subnetIds = relationships
            .filter(x => x.resourceType === AWS_EC2_SUBNET && !x.relationshipName.includes(CONTAINS))
            .map(x => x.resourceId)
            .sort();

        if (subnetIds.length === 1) {
            resource.subnetId = R.head(subnetIds);
        }
    }
    return resource;
}

module.exports = {
    // for performance reasons, each handler mutates the items in `resources`
    createAdditionalRelationships: R.curry(async (accountsMap, awsClient, resources) =>  {
        const resourceMap = new Map(resources.map(resource => ([resource.id, resource])));

        const lookUpMaps = {
            accountsMap,
            ...createLookUpMaps(resources)
        };

        await addBatchedRelationships(lookUpMaps, awsClient);

        await addIndividualRelationships(lookUpMaps, awsClient, resources)

        return resources
            .map(R.compose(addVpcInfo, normaliseRelationshipNames));
    })
}