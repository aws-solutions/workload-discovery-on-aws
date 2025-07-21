// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import {parse as parseArn} from '@aws-sdk/util-arn-parser';
import {
    AWS,
    NOT_APPLICABLE,
    AWS_IAM_AWS_MANAGED_POLICY,
    MULTIPLE_AVAILABILITY_ZONES,
    AWS_BEDROCK_AGENT,
    AWS_BEDROCK_CUSTOM_MODEL,
    AWS_BEDROCK_IMPORTED_MODEL,
    AWS_BEDROCK_FOUNDATION_MODEL,
    AWS_BEDROCK_INFERENCE_PROFILE,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION,
    SPOT_FLEET_REQUEST_ID_TAG,
    EC2,
    SPOT_FLEET_REQUEST,
    AWS_EC2_SPOT_FLEET,
    AWS_EC2_INSTANCE,
    SPOT_INSTANCE_REQUEST,
    AWS_EC2_SPOT,
    AWS_MEDIA_CONNECT_FLOW,
    AWS_OPENSEARCH_DOMAIN,
    AWS_OPENSEARCH_SERVERLESS_COLLECTION,
    GLOBAL,
    REGIONAL,
    AWS_GLUE_CONNECTION,
    AWS_GLUE_CRAWLER,
    AWS_GLUE_DATABASE,
} from '../constants.mjs';
import {
    createArn,
    createArnWithResourceType,
    createAssociatedRelationship,
    createConfigObject,
} from '../utils.mjs';
import logger from '../logger.mjs';

async function createFoundationModels(
    awsClient,
    credentials,
    accountId,
    region
) {
    const bedrockClient = awsClient.createBedrockClient(
        credentials,
        region
    );

    const models = await bedrockClient.getAllFoundationModels();

    return models.map(model => {
        return createConfigObject(
            {
                arn: model.modelArn,
                accountId: AWS,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_BEDROCK_FOUNDATION_MODEL,
                resourceId: model.modelId,
                resourceName: model.modelName || model.modelId,
            },
            model
        );
    });
}

async function createCustomModels(
    awsClient,
    credentials,
    accountId,
    region
) {
    const bedrockClient = awsClient.createBedrockClient(
        credentials,
        region
    );

    const models = await bedrockClient.getAllCustomModels();

    return models.map(model => {
        const {resource} = parseArn(model.modelArn);
        const [, resourceId] = resource.split('/');

        return createConfigObject(
            {
                arn: model.modelArn,
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_BEDROCK_CUSTOM_MODEL,
                resourceId,
                resourceName: model.modelName,
            },
            model
        );
    });
}

async function createImportedModels(
    awsClient,
    credentials,
    accountId,
    region
) {
    const bedrockClient = awsClient.createBedrockClient(
        credentials,
        region
    );

    const models = await bedrockClient.getAllImportedModels();

    return models.map(model => {
        const {resource} = parseArn(model.modelArn);
        const [, resourceId] = resource.split('/');

        return createConfigObject(
            {
                arn: model.modelArn,
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_BEDROCK_IMPORTED_MODEL,
                resourceId,
                resourceName: model.modelName,
            },
            model
        );
    });
}

async function createInferenceProfiles(
    awsClient,
    credentials,
    accountId,
    region
) {
    const bedrockClient = awsClient.createBedrockClient(
        credentials,
        region
    );

    const profiles = await bedrockClient.listAllInferenceProfiles();

    return profiles.map(profile => {
        return createConfigObject(
            {
                arn: profile.inferenceProfileArn,
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_BEDROCK_INFERENCE_PROFILE,
                resourceId: profile.inferenceProfileId,
                resourceName: profile.name,
            },
            profile
        );
    });
}

async function createBedrockAgents(
    awsClient,
    credentials,
    accountId,
    region
) {
    const bedrockAgentClient = awsClient.createBedrockAgentClient(
        credentials,
        region
    );

    const agents = await bedrockAgentClient.getAllAgents();

    return agents.map(agent => {
        // Prompt configurations often contain HTML tags and URLs, which causes WAF
        // to reject the agent so we will remove these fields for now
        const promptConfigurations =
            agent.promptOverrideConfiguration.promptConfigurations
                .map(R.omit(['basePromptTemplate']))

        const promptOverrideConfiguration = {
            ...agent.promptOverrideConfiguration,
            promptConfigurations
        }

        return createConfigObject(
            {
                arn: agent.agentArn,
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_BEDROCK_AGENT,
                resourceId: agent.agentId,
                resourceName: agent.agentName,
            },
            {...agent, promptOverrideConfiguration},
        );
    });
}

async function createApplications(awsClient, credentials, accountId, region) {
    const appRegistryClient = awsClient.createServiceCatalogAppRegistryClient(
        credentials,
        region
    );

    const applications = await appRegistryClient.getAllApplications();

    return applications.map(application => {
        return createConfigObject(
            {
                arn: application.arn,
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION,
                resourceId: application.arn,
                resourceName: application.name,
            },
            application
        );
    });
}

async function createGlueCrawlers(
    awsClient,
    credentials,
    accountId,
    region
) {
    const glueClient = awsClient.createGlueClient(
        credentials,
        region
    );

    const crawlers = await glueClient.getAllCrawlers();

    const resourceType = AWS_GLUE_CRAWLER;

    return crawlers.map(crawler => {
        const resourceId = crawler.Name;
        return createConfigObject(
            {
                arn: createArnWithResourceType({
                    resourceType, accountId, awsRegion: region, resourceId
                }),
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType,
                resourceId,
                resourceName: crawler.Name,
            },
            crawler
        );
    });
}

async function createGlueConnections(
    awsClient,
    credentials,
    accountId,
    region
) {
    const glueClient = awsClient.createGlueClient(
        credentials,
        region
    );

    const connections = await glueClient.getAllConnections();

    const resourceType = AWS_GLUE_CONNECTION;

    return connections.map(connection => {
        const resourceId = connection.Name;
        return createConfigObject(
            {
                arn: createArnWithResourceType({
                    resourceType, accountId, awsRegion: region, resourceId
                }),
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType,
                resourceId,
                resourceName: connection.Name,
            },
            connection
        );
    });
}

async function createGlueDatabases(
    awsClient,
    credentials,
    accountId,
    region
) {
    const glueClient = awsClient.createGlueClient(
        credentials,
        region
    );

    const databases = await glueClient.getAllDatabases();

    const resourceType = AWS_GLUE_DATABASE;

    return databases.map(database => {
        const resourceId = database.Name;
        return createConfigObject(
            {
                arn: createArnWithResourceType({
                    resourceType, accountId, awsRegion: region, resourceId
                }),
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType,
                resourceId,
                resourceName: database.Name,
            },
            database
        );
    });
}

async function createMediaConnectFlows(
    awsClient,
    credentials,
    accountId,
    region
) {
    const mediaConnectClient = awsClient.createMediaConnectClient(
        credentials,
        region
    );

    const flows = await mediaConnectClient.getAllFlows();

    return flows.map(flow => {
        return createConfigObject(
            {
                arn: flow.FlowArn,
                accountId: accountId,
                awsRegion: region,
                availabilityZone: flow.AvailabilityZone,
                resourceType: AWS_MEDIA_CONNECT_FLOW,
                resourceId: flow.FlowArn,
                resourceName: flow.Name,
            },
            flow
        );
    });
}

async function createAttachedAwsManagedPolices(
    awsClient,
    credentials,
    accountId,
    region
) {
    const iamClient = awsClient.createIamClient(credentials, region);

    const managedPolices = await iamClient.getAllAttachedAwsManagedPolices();

    return managedPolices.map(policy => {
        return createConfigObject(
            {
                arn: policy.Arn,
                accountId: AWS,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_IAM_AWS_MANAGED_POLICY,
                resourceId: policy.Arn,
                resourceName: policy.PolicyName,
            },
            policy
        );
    });
}

async function createTargetGroups(awsClient, credentials, accountId, region) {
    const elbV2Client = awsClient.createElbV2Client(credentials, region);

    const targetGroups = await elbV2Client.getAllTargetGroups();

    return targetGroups.map(targetGroup => {
        return createConfigObject(
            {
                arn: targetGroup.TargetGroupArn,
                accountId,
                awsRegion: region,
                availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
                resourceId: targetGroup.TargetGroupArn,
                resourceName: targetGroup.TargetGroupArn,
            },
            targetGroup
        );
    });
}

async function createSpotResources(awsClient, credentials, accountId, region) {
    const ec2Client = awsClient.createEc2Client(credentials, region);

    const spotInstanceRequests = await ec2Client.getAllSpotInstanceRequests();

    const groupedReqs = R.groupBy(x => {
        const sfReqId = x.Tags.find(x => x.Key === SPOT_FLEET_REQUEST_ID_TAG);
        return sfReqId == null ? 'spotInstanceRequests' : sfReqId.Value;
    }, spotInstanceRequests);

    const spotFleetRequests = (await ec2Client.getAllSpotFleetRequests()).map(
        request => {
            const arn = createArn({
                service: EC2,
                region,
                accountId,
                resource: `${SPOT_FLEET_REQUEST}/${request.SpotFleetRequestId}`,
            });
            return createConfigObject(
                {
                    arn,
                    accountId,
                    awsRegion: region,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    resourceType: AWS_EC2_SPOT_FLEET,
                    resourceId: arn,
                    resourceName: arn,
                    relationships: groupedReqs[request.SpotFleetRequestId].map(
                        ({InstanceId}) => {
                            return createAssociatedRelationship(
                                AWS_EC2_INSTANCE,
                                {resourceId: InstanceId}
                            );
                        }
                    ),
                },
                request
            );
        }
    );

    const spotInstanceRequestObjs = (
        groupedReqs.spotInstanceRequests ?? []
    ).map(spiReq => {
        const arn = createArn({
            service: EC2,
            region,
            accountId,
            resource: `${SPOT_INSTANCE_REQUEST}/${spiReq.SpotInstanceRequestId}`,
        });
        return createConfigObject(
            {
                arn,
                accountId,
                awsRegion: region,
                availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                resourceType: AWS_EC2_SPOT,
                resourceId: arn,
                resourceName: arn,
                relationships: [
                    createAssociatedRelationship(AWS_EC2_INSTANCE, {
                        resourceId: spiReq.InstanceId,
                    }),
                ],
            },
            spiReq
        );
    });

    return [...spotFleetRequests, ...spotInstanceRequestObjs];
}

async function createOpenSearchDomains(
    awsClient,
    credentials,
    accountId,
    region
) {
    const openSearchClient = awsClient.createOpenSearchClient(
        credentials,
        region
    );

    const domains = await openSearchClient.getAllOpenSearchDomains();

    return domains.map(domain => {
        return createConfigObject(
            {
                arn: domain.ARN,
                accountId,
                awsRegion: region,
                availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                resourceType: AWS_OPENSEARCH_DOMAIN,
                resourceId: domain.DomainName,
                resourceName: domain.DomainName,
            },
            domain
        );
    });
}

async function createOpenSearchServerlessCollections(
    awsClient,
    credentials,
    accountId,
    region
) {
    const openSearchServerlessClient = awsClient.createOpenSearchServerlessClient(
        credentials,
        region
    );

    const collections = await openSearchServerlessClient.getAllCollections();

    return collections.map(collection => {
        return createConfigObject(
            {
                arn: collection.arn,
                accountId,
                awsRegion: region,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_OPENSEARCH_SERVERLESS_COLLECTION,
                resourceId: collection.id,
                resourceName: collection.name,
            },
            collection
        );
    });
}

const handleError = R.curry((handlerName, accountId, region, error) => {
    return {
        item: {handlerName, accountId, region},
        raw: error,
        message: error.message,
    };
});

async function createAllBatchResources(credentialsTuples, awsClient) {
    const handlers = [
        [GLOBAL, createAttachedAwsManagedPolices],
        [REGIONAL, createApplications],
        [REGIONAL, createBedrockAgents],
        [REGIONAL, createCustomModels],
        // TODO: only call this function once per region across all imported accounts
        [REGIONAL, createFoundationModels],
        [REGIONAL, createImportedModels],
        [REGIONAL, createInferenceProfiles],
        [REGIONAL, createGlueConnections],
        [REGIONAL, createGlueCrawlers],
        [REGIONAL, createGlueDatabases],
        [REGIONAL, createMediaConnectFlows],
        [REGIONAL, createTargetGroups],
        [REGIONAL, createOpenSearchDomains],
        [REGIONAL, createOpenSearchServerlessCollections],
        [REGIONAL, createSpotResources],
    ];

    const {results, errors} = await Promise.all(
        handlers.flatMap(([serviceRegion, handler]) => {
            return credentialsTuples.flatMap(
                ([accountId, {regions, credentials}]) => {
                    const errorHandler = handleError(handler.name, accountId);
                    return serviceRegion === GLOBAL
                        ? handler(
                              awsClient,
                              credentials,
                              accountId,
                              GLOBAL
                          ).catch(errorHandler(GLOBAL))
                        : regions.map(region =>
                              handler(
                                  awsClient,
                                  credentials,
                                  accountId,
                                  region
                              ).catch(errorHandler(region))
                          );
                }
            );
        })
    ).then(
        R.reduce(
            (acc, item) => {
                if (item.raw != null) {
                    acc.errors.push(item);
                } else {
                    acc.results.push(...item);
                }
                return acc;
            },
            {results: [], errors: []}
        )
    );

    logger.error(
        `There were ${errors.length} errors when adding batch SDK resources.`
    );
    logger.debug('Errors: ', {errors: errors});

    return results;
}

export default createAllBatchResources;
