const R = require("ramda");
const createEnvironmentVariableRelationships = require('./createEnvironmentVariableRelationships');
const logger = require("../logger");
const {
    safeForEach,
    createAssociatedRelationship,
    createArn,
    createAttachedRelationship} = require("../utils");
const {
    VPC,
    EC2,
    TRANSIT_GATEWAY_ATTACHMENT,
    AWS_EC2_TRANSIT_GATEWAY,
    AWS_EC2_VPC,
    AWS_EC2_SUBNET,
    FULFILLED,
    SUBNET
} = require("../constants");

function createBatchedHandlers(lookUpMaps, awsClient) {
    const {
        envVarResourceIdentifierToIdMap,
        dbUrlToIdMap,
        resourceMap
    } = lookUpMaps;

    return {
        eventSources: async (credentials, accountId, region) => {
            const lambdaClient = awsClient.createLambdaClient(credentials, region);
            const eventSourceMappings = await lambdaClient.listEventSourceMappings();

            return safeForEach(({EventSourceArn, FunctionArn}) => {
                if(resourceMap.has(EventSourceArn) && resourceMap.has(FunctionArn)) {
                    const {resourceType} = resourceMap.get(EventSourceArn);
                    const lambda = resourceMap.get(FunctionArn);

                    lambda.relationships.push(createAssociatedRelationship(resourceType, {
                        arn: EventSourceArn
                    }));
                }
            }, eventSourceMappings);
        },
        functions: async (credentials, accountId, region) => {
            const lambdaClient = awsClient.createLambdaClient(credentials, region);

            const lambdas = await lambdaClient.getAllFunctions();

            return safeForEach(({FunctionArn, Environment = {}}) => {
                const lambda = resourceMap.get(FunctionArn);
                // a lambda may have been created between the time we got the data from config
                // and made our api request
                if(lambda != null && !R.isEmpty(Environment)) {
                    // The lambda API returns an error object if there are encrypted environment variables
                    // that the discovery process does not have permissions to decrypt
                    if(R.isNil(Environment.Error)) {
                        //TODO: add env var name as a property of the edge
                        lambda.relationships.push(...createEnvironmentVariableRelationships(
                            {resourceMap, envVarResourceIdentifierToIdMap, dbUrlToIdMap},
                            {accountId, awsRegion: region},
                            Environment.Variables));
                    }
                }
            }, lambdas);
        },
        snsSubscriptions: async (credentials, accountId, region) => {
            const snsClient = awsClient.createSnsClient(credentials, region);

            const subscriptions = await snsClient.getAllSubscriptions();

            return safeForEach(({Endpoint, TopicArn}) => {
                // an SNS topic may have been created between the time we got the data from config
                // and made our api request or the endpoint may have been created in a region that
                // has not been imported
                if(resourceMap.has(TopicArn) && resourceMap.has(Endpoint)) {
                    const snsTopic = resourceMap.get(TopicArn);
                    const {resourceType} = resourceMap.get(Endpoint);
                    snsTopic.relationships.push(createAssociatedRelationship(resourceType, {arn: Endpoint}));
                }
            }, subscriptions);
        },
        transitGatewayVpcAttachments: async (credentials, accountId, region) => {
            // Whilst AWS Config supports the AWS::EC2::TransitGatewayAttachment resource type,
            // it is missing information on the account that VPCs referred to by the attachment
            // are deployed in. Therefore we need to supplement this with info from the EC2 API.
            const ec2Client = awsClient.createEc2Client(credentials, region);

            const tgwAttachments = await ec2Client.getAllTransitGatewayAttachments([
                {Name: 'resource-type', Values: [VPC.toLowerCase()]}
            ]);

            return safeForEach(tgwAttachment => {
                const {
                    TransitGatewayAttachmentId, ResourceOwnerId, TransitGatewayOwnerId, TransitGatewayId
                } = tgwAttachment;
                const tgwAttachmentArn = createArn({
                    service: EC2, region, accountId, resource: `${TRANSIT_GATEWAY_ATTACHMENT}/${TransitGatewayAttachmentId}`}
                );

                if(resourceMap.has(tgwAttachmentArn)) {
                    const tgwAttachmentFromConfig = resourceMap.get(tgwAttachmentArn);
                    const {relationships, configuration: {SubnetIds, VpcId}} =  tgwAttachmentFromConfig;

                    relationships.push(
                        createAttachedRelationship(AWS_EC2_TRANSIT_GATEWAY, {accountId: TransitGatewayOwnerId, awsRegion: region, resourceId: TransitGatewayId}),
                        createAssociatedRelationship(AWS_EC2_VPC, {relNameSuffix: VPC, accountId: ResourceOwnerId, awsRegion: region, resourceId: VpcId}),
                        ...SubnetIds.map(subnetId => createAssociatedRelationship(AWS_EC2_SUBNET, {relNameSuffix: SUBNET, accountId: ResourceOwnerId, awsRegion: region, resourceId: subnetId}))
                    );
                }
            }, tgwAttachments);
        }
    }
}

function logErrors(results) {
    const errors = results.flatMap(({status, value, reason}) => {
        if(status === FULFILLED) {
            return value.errors;
        } else {
            return [{error: reason}]
        }
    });

    logger.error(`There were ${errors.length} errors when adding batch additional relationships.`);
    logger.debug('Errors: ', {errors: errors});
}

async function addBatchedRelationships(lookUpMaps, awsClient) {
    const credentialsTuples = Array.from(lookUpMaps.accountsMap.entries());

    const batchedHandlers = createBatchedHandlers(lookUpMaps, awsClient);

    const results = await Promise.allSettled(Object.values(batchedHandlers).flatMap(handler => {
        return credentialsTuples
            .flatMap( ([accountId, {regions, credentials}]) =>
                regions.map(region => handler(credentials, accountId, region))
            );
    }));

    logErrors(results);
}

module.exports = addBatchedRelationships