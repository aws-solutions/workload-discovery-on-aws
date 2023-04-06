// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {
    APIGATEWAY,
    RESTAPIS,
    RESOURCES,
    AWS_API_GATEWAY_RESOURCE,
    POST,
    GET,
    PUT,
    DELETE,
    NOT_FOUND_EXCEPTION,
    METHODS,
    AWS_API_GATEWAY_METHOD
} = require("../constants");
const {createArn, createConfigObject, createContainedInRelationship} = require("../utils");
const logger = require("../logger");

module.exports = {
    createSecondOrderHandlers(accountsMap, awsClient) {
        return {
            [AWS_API_GATEWAY_RESOURCE]: async ({resourceId, accountId, availabilityZone, awsRegion, arn: apiResourceArn, configuration}) => {
                // don't confuse ResourceId which is the id that API Gateway assigns to this resource with
                // the camel case version, which is the id AWS Config would assign it. We create this in
                // ths first order handlers to have a uniform shape to all the data.
                const {RestApiId, id: ResourceId} = configuration;

                const {credentials} = accountsMap.get(accountId);

                const apiGatewayClient = awsClient.createApiGatewayClient(credentials, awsRegion);

                const results = await Promise.allSettled([
                    apiGatewayClient.getMethod(POST, ResourceId, RestApiId),
                    apiGatewayClient.getMethod(GET, ResourceId, RestApiId),
                    apiGatewayClient.getMethod(PUT, ResourceId, RestApiId),
                    apiGatewayClient.getMethod(DELETE, ResourceId, RestApiId),
                ]);

                results.forEach(({status, reason}) => {
                    if(status === 'rejected' && reason.name !== NOT_FOUND_EXCEPTION) {
                        logger.error(`Error discovering API Gateway integration for resource: ${apiResourceArn}`, {error: reason});
                    }
                });

                return results.filter(x => x.status === 'fulfilled').map(({value: item}) => {
                    const arn = createArn({
                        service: APIGATEWAY, region: awsRegion, resource: `/${RESTAPIS}/${RestApiId}/${RESOURCES}/${ResourceId}/${METHODS}/${item.httpMethod}`
                    });
                    return createConfigObject({
                        arn,
                        accountId,
                        awsRegion,
                        availabilityZone,
                        resourceType: AWS_API_GATEWAY_METHOD,
                        resourceId: arn,
                        resourceName: arn,
                        relationships: [
                            createContainedInRelationship(AWS_API_GATEWAY_RESOURCE, {resourceId}),
                        ]
                    }, {RestApiId, ResourceId, ...item});
                });
            }
        };
    }
}