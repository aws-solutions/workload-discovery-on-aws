// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import {
    AWS_API_GATEWAY_REST_API,
    APIGATEWAY,
    RESTAPIS,
    RESOURCES,
    AWS_API_GATEWAY_RESOURCE,
    AUTHORIZERS,
    AWS_API_GATEWAY_AUTHORIZER,
    AWS_DYNAMODB_STREAM,
    AWS_DYNAMODB_TABLE,
    AWS_ECS_SERVICE,
    AWS_ECS_TASK,
    AWS_EKS_CLUSTER,
    MULTIPLE_AVAILABILITY_ZONES,
    AWS_EKS_NODE_GROUP,
    AWS_IAM_ROLE,
    AWS_IAM_USER,
    INLINE_POLICY,
    IS_ASSOCIATED_WITH,
    GLOBAL,
    NOT_APPLICABLE,
    AWS_IAM_INLINE_POLICY,
    AWS_APPSYNC_DATASOURCE,
    AWS_APPSYNC_GRAPHQLAPI,
    AWS_APPSYNC_RESOLVER
} from '../constants.mjs';
import {
    createArn, createConfigObject, createContainedInRelationship, createAssociatedRelationship, createArnRelationship
} from '../utils.mjs';

const createInlinePolicy = R.curry(({arn, resourceName, accountId, resourceType}, policy) => {
    const policyArn = `${arn}/${INLINE_POLICY}/${policy.policyName}`;
    const inlinePolicy = {
        policyName: policy.policyName,
        policyDocument: JSON.parse(decodeURIComponent(policy.policyDocument))
    };

    return createConfigObject({
        arn: policyArn,
        accountId: accountId,
        awsRegion: GLOBAL,
        availabilityZone: NOT_APPLICABLE,
        resourceType: AWS_IAM_INLINE_POLICY,
        resourceId: policyArn,
        resourceName: policyArn,
        relationships: [
            createAssociatedRelationship(resourceType, {resourceName})
        ]
    }, inlinePolicy);
});

export function createFirstOrderHandlers(accountsMap, awsClient) {
    return {
        [AWS_API_GATEWAY_REST_API]: async ({awsRegion, accountId, availabilityZone, resourceId, configuration}) => {
            const {id: RestApiId} = configuration;
            const {credentials} = accountsMap.get(accountId);

            const apiGatewayClient = awsClient.createApiGatewayClient(credentials, awsRegion);

            const apiGatewayResources = []

            const apiResources = await apiGatewayClient.getResources(RestApiId);

            apiGatewayResources.push(...apiResources.map(item => {
                const arn = createArn({
                    service: APIGATEWAY,
                    region: awsRegion,
                    resource: `/${RESTAPIS}/${RestApiId}/${RESOURCES}/${item.id}`
                });
                return createConfigObject({
                    arn,
                    accountId,
                    awsRegion,
                    availabilityZone,
                    resourceType: AWS_API_GATEWAY_RESOURCE,
                    resourceId: arn,
                    resourceName: arn,
                    relationships: [
                        createContainedInRelationship(AWS_API_GATEWAY_REST_API, {resourceId})
                    ]
                }, {RestApiId, ...item});
            }));

            const authorizers = await apiGatewayClient.getAuthorizers(RestApiId);
            apiGatewayResources.push(...authorizers.map(authorizer => {
                const arn = createArn({
                    service: APIGATEWAY,
                    region: awsRegion,
                    resource: `/${RESTAPIS}/${RestApiId}/${AUTHORIZERS}/${authorizer.id}`
                });
                return createConfigObject({
                    arn,
                    accountId,
                    awsRegion,
                    availabilityZone,
                    resourceType: AWS_API_GATEWAY_AUTHORIZER,
                    resourceId: arn,
                    resourceName: arn,
                    relationships: [
                        createContainedInRelationship(AWS_API_GATEWAY_REST_API, {resourceId}),
                        ...(authorizer.providerARNs ?? []).map(createArnRelationship(IS_ASSOCIATED_WITH))
                    ]
                }, {RestApiId, ...authorizer});
            }));

            return apiGatewayResources;
        },

        [AWS_APPSYNC_GRAPHQLAPI]: async ({accountId, awsRegion, resourceId, resourceName}) => {
            const {credentials} = accountsMap.get(accountId);
            const appSyncClient = awsClient.createAppSyncClient(credentials, awsRegion);

            const dataSources = appSyncClient.listDataSources(resourceId).then(data => data.map(dataSource => {
                return createConfigObject({
                    arn: dataSource.dataSourceArn,
                    accountId,
                    awsRegion,
                    availabilityZone: NOT_APPLICABLE,
                    resourceType: AWS_APPSYNC_DATASOURCE,
                    resourceId: dataSource.dataSourceArn,
                    resourceName: dataSource.name,
                    relationships: []
                }, {...dataSource, apiId: resourceId});
            }))

            const queryResolvers = appSyncClient.listResolvers(resourceId, "Query").then(data => data.map(resolver => {
                return createConfigObject({
                    arn: resolver.resolverArn,
                    accountId,
                    awsRegion,
                    availabilityZone: NOT_APPLICABLE,
                    resourceType: AWS_APPSYNC_RESOLVER,
                    resourceId: resolver.resolverArn,
                    resourceName: resolver.fieldName,
                    relationships: [
                        createContainedInRelationship(AWS_APPSYNC_GRAPHQLAPI, {resourceId}),
                        createAssociatedRelationship(AWS_APPSYNC_DATASOURCE, {resourceName: resolver.dataSourceName})
                    ]
                }, {...resolver, apiId: resourceId});
            }))

            const mutationResolvers = appSyncClient.listResolvers(resourceId, "Mutation").then(data => data.map(resolver => {
                return createConfigObject({
                    arn: resolver.resolverArn,
                    accountId,
                    awsRegion,
                    availabilityZone: NOT_APPLICABLE,
                    resourceType: AWS_APPSYNC_RESOLVER,
                    resourceId: resolver.resolverArn,
                    resourceName: resolver.fieldName,
                    relationships: [
                        createContainedInRelationship(AWS_APPSYNC_GRAPHQLAPI, {resourceId}),
                        createAssociatedRelationship(AWS_APPSYNC_DATASOURCE, {resourceName: resolver.dataSourceName})
                    ]
                }, {...resolver, apiId: resourceId});
            }))
            return Promise.allSettled([dataSources, queryResolvers, mutationResolvers])
                .then(results => results
                    .flatMap(({status, value}) => status === "fulfilled" ? value : [])
                )

        },
        [AWS_DYNAMODB_TABLE]: async ({awsRegion, accountId, configuration}) => {
            if (configuration.latestStreamArn == null) {
                return []
            }

            const {credentials} = accountsMap.get(accountId);

            const dynamoDBStreamsClient = awsClient.createDynamoDBStreamsClient(credentials, awsRegion);

            const stream = await dynamoDBStreamsClient.describeStream(configuration.latestStreamArn);

            return [createConfigObject({
                arn: stream.StreamArn,
                accountId,
                awsRegion,
                availabilityZone: NOT_APPLICABLE,
                resourceType: AWS_DYNAMODB_STREAM,
                resourceId: stream.StreamArn,
                resourceName: stream.StreamArn,
                relationships: []
            }, stream)];
        },
        [AWS_ECS_SERVICE]: async ({awsRegion, resourceId, resourceName, accountId, configuration: {Cluster}}) => {
            const {credentials} = accountsMap.get(accountId);
            const ecsClient = awsClient.createEcsClient(credentials, awsRegion);

            const tasks = await ecsClient.getAllServiceTasks(Cluster, resourceName);

            return tasks.map(task => {
                return createConfigObject({
                    arn: task.taskArn,
                    accountId,
                    awsRegion,
                    availabilityZone: task.availabilityZone,
                    resourceType: AWS_ECS_TASK,
                    resourceId: task.taskArn,
                    resourceName: task.taskArn,
                    relationships: [
                        createAssociatedRelationship(AWS_ECS_SERVICE, {resourceId})
                    ]
                }, task);
            });
        },
        [AWS_EKS_CLUSTER]: async ({accountId, awsRegion, resourceId, resourceName}) => {
            const {credentials} = accountsMap.get(accountId);

            const eksClient = awsClient.createEksClient(credentials, awsRegion);

            const nodeGroups = await eksClient.listNodeGroups(resourceName);

            return nodeGroups.map(nodeGroup => {
                return createConfigObject({
                    arn: nodeGroup.nodegroupArn,
                    accountId,
                    awsRegion,
                    availabilityZone: MULTIPLE_AVAILABILITY_ZONES,
                    resourceType: AWS_EKS_NODE_GROUP,
                    resourceId: nodeGroup.nodegroupArn,
                    resourceName: nodeGroup.nodegroupName,
                    relationships: [
                        createContainedInRelationship(AWS_EKS_CLUSTER, {resourceId})
                    ]
                }, nodeGroup);
            });
        },
        [AWS_IAM_ROLE]: async ({arn, resourceName, accountId, resourceType, configuration: {rolePolicyList = []}}) => {
            return rolePolicyList.map(createInlinePolicy({arn, resourceName, resourceType, accountId}));
        },
        [AWS_IAM_USER]: ({arn, resourceName, resourceType, accountId, configuration: {userPolicyList = []}}) => {
            return userPolicyList.map(createInlinePolicy({arn, resourceName, accountId, resourceType}));
        }
    }
}
