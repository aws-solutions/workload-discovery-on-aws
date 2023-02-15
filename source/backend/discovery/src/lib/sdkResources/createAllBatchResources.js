// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require("ramda");
const {
    AWS, NOT_APPLICABLE,
    AWS_IAM_AWS_MANAGED_POLICY,
    MULTIPLE_AVAILABILITY_ZONES,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_COGNITO_USER_POOL,
    SPOT_FLEET_REQUEST_ID_TAG,
    EC2,
    SPOT_FLEET_REQUEST,
    AWS_EC2_SPOT_FLEET,
    AWS_EC2_INSTANCE,
    SPOT_INSTANCE_REQUEST,
    AWS_EC2_SPOT,
    AWS_OPENSEARCH_DOMAIN,
    GLOBAL,
    REGIONAL
} = require("../constants");
const {
    createArn,
    createAssociatedRelationship,
    createConfigObject
} = require("../utils");
const logger = require("../logger");

async function createAttachedAwsManagedPolices(awsClient, credentials, accountId, region) {
    const iamClient = awsClient.createIamClient(credentials, region)

    const managedPolices = await iamClient.getAllAttachedAwsManagedPolices();

    return managedPolices.map(policy => {
        return createConfigObject({
            arn: policy.Arn,
            accountId: AWS,
            awsRegion: region,
            availabilityZone: NOT_APPLICABLE,
            resourceType: AWS_IAM_AWS_MANAGED_POLICY,
            resourceId: policy.Arn,
            resourceName: policy.PolicyName
        }, policy);
    });
}

async function createTargetGroups(awsClient, credentials, accountId, region) {
    const elbV2Client = awsClient.createElbV2Client(accountId, credentials, region);

    const targetGroups = await elbV2Client.getAllTargetGroups();

    return targetGroups.map(targetGroup => {
        return createConfigObject({
            arn: targetGroup.TargetGroupArn,
            accountId,
            awsRegion: region,
            availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
            resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
            resourceId: targetGroup.TargetGroupArn,
            resourceName: targetGroup.TargetGroupArn
        }, targetGroup);
    })
}

async function createUserPools(awsClient, credentials, accountId, region) {
    const cognitoClient = awsClient.createCognitoClient(credentials, region)

    const userPools = await cognitoClient.getAllUserPools();

    return userPools.map(userPool => {
        return createConfigObject({
            arn: userPool.Arn,
            accountId,
            awsRegion: region,
            availabilityZone: NOT_APPLICABLE,
            resourceType: AWS_COGNITO_USER_POOL,
            resourceId: userPool.Arn,
            resourceName: userPool.Arn
        }, userPool);
    });
}

async function createSpotResources(awsClient, credentials, accountId, region) {
    const ec2Client = awsClient.createEc2Client(credentials, region);

    const spotInstanceRequests = await ec2Client.getAllSpotInstanceRequests();

    const groupedReqs = R.groupBy(x => {
        const sfReqId = x.Tags.find(x => x.Key === SPOT_FLEET_REQUEST_ID_TAG);
        return sfReqId == null ? 'spotInstanceRequests' : sfReqId.Value;
    }, spotInstanceRequests);

    const spotFleetRequests = (await ec2Client.getAllSpotFleetRequests()).map((request) => {
        const arn = createArn({
            service: EC2, region, accountId, resource: `${SPOT_FLEET_REQUEST}/${request.SpotFleetRequestId}`
        });
        return createConfigObject({
            arn,
            accountId,
            awsRegion: region,
            availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
            resourceType: AWS_EC2_SPOT_FLEET,
            resourceId: arn,
            resourceName: arn,
            relationships: groupedReqs[request.SpotFleetRequestId].map(({InstanceId}) => {
                return createAssociatedRelationship(AWS_EC2_INSTANCE, {resourceId: InstanceId});
            })
        }, request);
    });


    const spotInstanceRequestObjs = (groupedReqs.spotInstanceRequests ?? []).map(spiReq => {
        const arn = createArn({
            service: EC2, region, accountId, resource: `${SPOT_INSTANCE_REQUEST}/${spiReq.SpotInstanceRequestId}`
        });
        return createConfigObject({
            arn,
            accountId,
            awsRegion: region,
            availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
            resourceType: AWS_EC2_SPOT,
            resourceId: arn,
            resourceName: arn,
            relationships: [
                createAssociatedRelationship(AWS_EC2_INSTANCE, {resourceId: spiReq.InstanceId})
            ]
        }, spiReq);
    });

    return [...spotFleetRequests, ...spotInstanceRequestObjs];
}

async function createOpenSearchDomains(awsClient, credentials, accountId, region) {
    const openSearchClient = awsClient.createOpenSearchClient(credentials, region)

    const domains = await openSearchClient.getAllOpenSearchDomains();

    return domains.map(domain => {
        return createConfigObject({
            arn: domain.ARN,
            accountId,
            awsRegion: region,
            availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
            resourceType: AWS_OPENSEARCH_DOMAIN,
            resourceId: domain.DomainName,
            resourceName: domain.DomainName
        }, domain);
    });
}

const handleError = R.curry((handlerName, accountId, region, error) => {
    return {
        item: {handlerName, accountId, region},
        raw: error,
        message: error.message
    }
});

async function createAllBatchResources(credentialsTuples, awsClient) {
    const handlers = [
        [GLOBAL, createAttachedAwsManagedPolices],
        [REGIONAL, createUserPools],
        [REGIONAL, createTargetGroups],
        [REGIONAL, createOpenSearchDomains],
        [REGIONAL, createSpotResources]
    ];

    const {results, errors} = await Promise.all(handlers.flatMap(([serviceRegion, handler]) => {
        return credentialsTuples
            .flatMap(([accountId, {regions, credentials}]) => {
                const errorHandler = handleError(handler.name, accountId);
                return serviceRegion === GLOBAL
                    ? handler(awsClient, credentials, accountId, GLOBAL).catch(errorHandler(GLOBAL))
                    : regions.map(region => handler(awsClient, credentials, accountId, region).catch(errorHandler(region)));
            });
    })).then(R.reduce((acc, item) => {
        if (item.raw != null) {
            acc.errors.push(item);
        } else {
            acc.results.push(...item);
        }
        return acc;
    }, {results: [], errors: []}));

    logger.error(`There were ${errors.length} errors when adding batch SDK resources.`);
    logger.debug('Errors: ', {errors: errors});

    return results;
}

module.exports = createAllBatchResources;
