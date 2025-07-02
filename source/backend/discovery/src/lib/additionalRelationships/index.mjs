import * as R from 'ramda';
import {iterate} from 'iterare';
import addBatchedRelationships from './addBatchedRelationships.mjs';
import addIndividualRelationships from './addIndividualRelationships.mjs';
import createLookUpMaps from './createLookUpMaps.mjs';
import {
    EC2,
    AWS_EC2_SUBNET,
    AWS_TAGS_TAG,
    AWS_CLOUDFORMATION_STACK,
    AWS_CONFIG_RESOURCE_COMPLIANCE,
    AWS_EC2_VPC,
    VPC,
    CONTAINS,
} from '../constants.mjs';
import {
    createArn,
    createContainedInVpcRelationship,
    resourceTypesToNormalizeSet,
    isQualifiedRelationshipName,
} from '../utils.mjs';

function getSubnetInfo(resourceMap, accountId, awsRegion, subnetIds) {
    const {availabilityZones, vpcId} = subnetIds.reduce(
        (acc, subnetId) => {
            const subnetArn = createArn({
                service: EC2,
                accountId,
                region: awsRegion,
                resource: `subnet/${subnetId}`,
            });

            // we may not have ingested the subnets
            if (resourceMap.has(subnetArn)) {
                const {
                    configuration: {vpcId},
                    availabilityZone,
                } = resourceMap.get(subnetArn);
                if (acc.vpcId == null) acc.vpcId = vpcId;
                acc.availabilityZones.add(availabilityZone);
            }

            return acc;
        },
        {availabilityZones: new Set()}
    );

    return {vpcId, availabilityZones: Array.from(availabilityZones).sort()};
}

function shouldNormaliseRelationship(rel) {
    return (
        resourceTypesToNormalizeSet.has(rel.resourceType) &&
        !isQualifiedRelationshipName(rel.relationshipName)
    );
}

/**
 * AWS Config qualifies some relationship names based on the resource type, e.g., the `Is contained in `
 * relationship becomes `Is contained in Subnet`. However, Config does not do this consistently, it will
 * use `Is contained in Subnet` for EC2 instances but the unqualified `Is contained in ` for lambda
 * functions. Note that the space at the end of the unqualified relationship name also comes from Config.
 * This function aims to make the relationship names consistent across all resource types regardless of whether
 * they originate from Config or Workload Discovery.
 * */
function normaliseRelationshipNames(resource) {
    if (
        ![AWS_TAGS_TAG, AWS_CONFIG_RESOURCE_COMPLIANCE].includes(
            resource.resourceType
        )
    ) {
        const {relationships} = resource;

        iterate(relationships)
            .filter(shouldNormaliseRelationship)
            .forEach(rel => {
                const {resourceType, relationshipName} = rel;

                const [, , relSuffix] = resourceType.split('::');
                // VPC is in camelcase
                if (
                    !relationshipName
                        .toLowerCase()
                        .includes(relSuffix.toLowerCase())
                ) {
                    rel.relationshipName =
                        relationshipName +
                        (resourceType === AWS_EC2_VPC ? VPC : relSuffix);
                }
            });
    }

    return resource;
}

const addVpcInfo = R.curry((resourceMap, resource) => {
    if (
        ![
            AWS_TAGS_TAG,
            AWS_CONFIG_RESOURCE_COMPLIANCE,
            AWS_CLOUDFORMATION_STACK,
        ].includes(resource.resourceType)
    ) {
        const {accountId, awsRegion, relationships} = resource;

        const vpcArray = relationships
            .filter(x => x.resourceType === AWS_EC2_VPC)
            .map(x => x.resourceId);

        const subnetIds = relationships
            .filter(
                x =>
                    x.resourceType === AWS_EC2_SUBNET &&
                    !x.relationshipName.includes(CONTAINS)
            )
            .map(x => x.resourceId)
            .sort();

        if (!R.isEmpty(vpcArray)) {
            resource.vpcId = R.head(vpcArray);
        }

        if (!R.isEmpty(subnetIds)) {
            const {vpcId, availabilityZones} = getSubnetInfo(
                resourceMap,
                accountId,
                awsRegion,
                subnetIds
            );
            if (R.isEmpty(vpcArray) && vpcId != null) {
                relationships.push(createContainedInVpcRelationship(vpcId));
                resource.vpcId = vpcId;
            }
            if (!R.isEmpty(availabilityZones)) {
                resource.availabilityZone = availabilityZones.join(',');
            }
        }

        if (subnetIds.length === 1) {
            resource.subnetId = R.head(subnetIds);
        }
    }

    return resource;
});

// for performance reasons, each handler mutates the items in `resources`
export const addAdditionalRelationships = R.curry(
    async (accountsMap, awsClient, resources) => {
        const resourceMap = new Map(
            resources.map(resource => [resource.id, resource])
        );

        const lookUpMaps = {
            accountsMap,
            ...createLookUpMaps(resources),
            resourceMap,
        };

        await addBatchedRelationships(lookUpMaps, awsClient);

        await addIndividualRelationships(lookUpMaps, awsClient, resources);

        return resources.map(
            R.compose(addVpcInfo(resourceMap), normaliseRelationshipNames)
        );
    }
);
