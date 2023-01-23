const R = require("ramda");
const {PromisePool} = require("@supercharge/promise-pool");
const createBatchedHandlers = require('./createBatchedHandlers');
const createIndividualHandlers = require('./createIndividualHandlers');
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

        const credentialsTuples = Array.from(accountsMap.entries());

        const batchedHandlers = createBatchedHandlers(lookUpMaps, awsClient, resourceMap);

        const batchResults = await Promise.allSettled(Object.values(batchedHandlers).flatMap(handler => {
            return credentialsTuples
                .flatMap(([accountId, {regions, credentials}]) =>
                    regions.map(region => handler(credentials, accountId, region))
                );
        }));

        const batchErrors = batchResults.filter(x => x.status === 'rejected').map(({reason}) => ({error: reason.message}));
        logger.error(`There were ${batchErrors.length} errors when adding batch additional relationships.`);
        logger.debug('Errors: ', {errors: batchErrors});

        const handlers = createIndividualHandlers(lookUpMaps, awsClient, resources, resourceMap);

        const {errors} = await PromisePool
            .withConcurrency(30)
            .for(resources)
            .process(async resource => {
                const handler = handlers[resource.resourceType];
                if(handler != null) return handler(resource);
            });

        logger.error(`There were ${errors.length} errors when adding additional relationships.`);
        logger.debug('Errors: ', {errors});

        return Array.from(resourceMap.values())
            .map(R.compose(addVpcInfo, normaliseRelationshipNames));
    })
}