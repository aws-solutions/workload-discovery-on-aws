const {createAssociatedRelationship, createResourceIdKey, createResourceNameKey} = require("../utils");
const {AWS_S3_ACCOUNT_PUBLIC_ACCESS_BLOCK} = require("../constants");

function createEnvironmentVariableRelationships(
    {resourceMap, envVarResourceIdentifierToIdMap, dbUrlToIdMap},
    {accountId, awsRegion},
    variables
) {
    //TODO: add env var name as a property of the edge
    return Object.values(variables).reduce((acc, val) => {
        if (resourceMap.has(val)) {
            const {resourceType, arn} = resourceMap.get(val);
            acc.push(createAssociatedRelationship(resourceType, {arn}));
        } else {
            // this branch assumes all resources are in the same region
            const resourceIdKey = createResourceIdKey({resourceId: val, accountId, awsRegion});
            const resourceNameKey = createResourceNameKey({resourceName: val, accountId, awsRegion});

            const id = envVarResourceIdentifierToIdMap.get(resourceIdKey)
                ?? envVarResourceIdentifierToIdMap.get(resourceNameKey)
                ?? dbUrlToIdMap.get(val);

            if(resourceMap.has(id)) {
                const {resourceType, resourceId} = resourceMap.get(id);

                // The resourceId of the AWS::S3::AccountPublicAccessBlock resource type is the accountId where it resides.
                // We need to filter out environment variables that have AWS account IDs because otherwise we will create
                // an erroneous relationship between the resource and the AWS::S3::AccountPublicAccessBlock
                if(resourceId !== accountId && resourceType !== AWS_S3_ACCOUNT_PUBLIC_ACCESS_BLOCK) {
                    acc.push(createAssociatedRelationship(resourceType, {arn: id}));
                }
            }
        }
        return acc;
    }, []);
}

module.exports = createEnvironmentVariableRelationships;