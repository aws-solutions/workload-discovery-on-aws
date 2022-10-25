const R = require("ramda");
const {
    AWS_API_GATEWAY_REST_API,
    APIGATEWAY,
    RESTAPIS,
    RESOURCES,
    AWS_API_GATEWAY_RESOURCE,
    AUTHORIZERS,
    AWS_API_GATEWAY_AUTHORIZER,
    AWS_COGNITO_USER_POOL,
    AWS_ECS_SERVICE,
    AWS_ECS_TASK,
    AWS_EKS_CLUSTER,
    MULTIPLE_AVAILABILITY_ZONES,
    AWS_EKS_NODE_GROUP,
    AWS_IAM_ROLE,
    AWS_IAM_USER,
    INLINE_POLICY,
    GLOBAL,
    NOT_APPLICABLE,
    AWS_IAM_INLINE_POLICY
} = require("../constants");
const {
    createArn, createConfigObject, createContainedInRelationship, createAssociatedRelationship
} = require("../utils");

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

module.exports = {
    createFirstOrderHandlers(accountsMap, awsClient) {

        return {
            [AWS_API_GATEWAY_REST_API]: async ({awsRegion, accountId, availabilityZone, resourceId, configuration}) => {
                const {id: RestApiId} = configuration;
                const {credentials} = accountsMap.get(accountId);

                const apiGatewayClient = awsClient.createApiGatewayClient(accountId, credentials, awsRegion);

                const apiGatewayResources = []

                const apiResources = await apiGatewayClient.getResources(RestApiId);

                apiGatewayResources.push(...apiResources.map(item => {
                    const arn = createArn({
                        service: APIGATEWAY, region: awsRegion, resource: `/${RESTAPIS}/${RestApiId}/${RESOURCES}/${item.id}`
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
                        service: APIGATEWAY, region: awsRegion, resource: `/${RESTAPIS}/${RestApiId}/${AUTHORIZERS}/${authorizer.id}`
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
                            ...authorizer.providerARNs.map(resourceId => createAssociatedRelationship(AWS_COGNITO_USER_POOL, {resourceId}))
                        ]
                    }, {RestApiId, ...authorizer});
                }));

                return apiGatewayResources;
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
}