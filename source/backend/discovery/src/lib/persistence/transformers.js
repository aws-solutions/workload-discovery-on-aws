// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require("ramda");
const {
    NAME,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
    AWS_AUTOSCALING_AUTOSCALING_GROUP,
    AWS_API_GATEWAY_METHOD,
    AWS_API_GATEWAY_RESOURCE,
    AWS_ECS_TASK,
    AWS_EKS_NODE_GROUP,
    AWS_IAM_AWS_MANAGED_POLICY,
    AWS_EC2_SPOT,
    AWS_EC2_SPOT_FLEET,
    AWS_IAM_INLINE_POLICY,
    AWS_OPENSEARCH_DOMAIN,
    AWS_EC2_VPC,
    AWS_EC2_NETWORK_INTERFACE,
    AWS_EC2_INSTANCE,
    AWS_EC2_VOLUME,
    AWS_EC2_SUBNET,
    AWS_EC2_SECURITY_GROUP,
    AWS_EC2_ROUTE_TABLE,
    AWS_EC2_INTERNET_GATEWAY,
    AWS_EC2_NETWORK_ACL,
    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
    AWS_EC2_EIP,
    AWS_API_GATEWAY_REST_API,
    AWS_LAMBDA_FUNCTION,
    AWS_IAM_ROLE,
    AWS_IAM_GROUP,
    AWS_IAM_USER,
    AWS_IAM_POLICY,
    AWS_S3_BUCKET,
    APIGATEWAY,
    EC2,
    IAM,
    VPC,
    SIGN_IN,
    CONSOLE,
    AWS_AMAZON_COM,
    S3,
    LAMBDA,
    HOME,
    REGION
} = require("../constants");
const {hash} = require("../utils");

const defaultUrlMappings = {
    [AWS_EC2_VPC]: { url: 'vpcs:sort=VpcId', type: VPC.toLowerCase()},
    [AWS_EC2_NETWORK_INTERFACE]: { url: 'NIC:sort=description', type: EC2},
    [AWS_EC2_INSTANCE]: { url: 'Instances:sort=instanceId', type: EC2},
    [AWS_EC2_VOLUME]: { url: 'Volumes:sort=desc:name', type: EC2},
    [AWS_EC2_SUBNET]: { url: 'subnets:sort=SubnetId', type: VPC.toLowerCase()},
    [AWS_EC2_SECURITY_GROUP]: { url: 'SecurityGroups:sort=groupId', type: EC2},
    [AWS_EC2_ROUTE_TABLE]: { url: 'RouteTables:sort=routeTableId', type: VPC.toLowerCase()},
    [AWS_EC2_INTERNET_GATEWAY]: { url: 'igws:sort=internetGatewayId', type: VPC.toLowerCase()},
    [AWS_EC2_NETWORK_ACL]: { url: 'acls:sort=networkAclId', type: VPC.toLowerCase()},
    [AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER]: { url: 'LoadBalancers:', type: EC2},
    [AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP]: { url: 'TargetGroups:', type: EC2},
    [AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER]: { url: 'LoadBalancers:', type: EC2},
    [AWS_EC2_EIP]: { url: 'Addresses:sort=PublicIp', type: EC2},
};

const iamUrlMappings = {
    [AWS_IAM_USER]: { url: "/users", type: IAM},
    [AWS_IAM_ROLE]: { url: "/roles", type: IAM},
    [AWS_IAM_POLICY]: { url: "/policies", type: IAM},
    [AWS_IAM_GROUP]: { url: "/groups", type: IAM},
};

function createSignInHostname(accountId, service) {
    return `https://${accountId}.${SIGN_IN}.${AWS_AMAZON_COM}/${CONSOLE}/${service}`
}
function createLoggedInHostname(awsRegion, service) {
    return `https://${awsRegion}.${CONSOLE}.${AWS_AMAZON_COM}/${service}/${HOME}`;
}

function createConsoleUrls(resource) {
    const {resourceType, resourceName, accountId, awsRegion, configuration} = resource;

    switch(resourceType) {
        case AWS_API_GATEWAY_REST_API:
            return {
                loginURL: `${createSignInHostname(accountId, APIGATEWAY)}?${REGION}=${awsRegion}#/apis/${configuration.id}/resources`,
                loggedInURL: `${createLoggedInHostname(awsRegion,  APIGATEWAY)}?${REGION}=${awsRegion}#/apis/${configuration.id}/resources`
            }
        case AWS_API_GATEWAY_RESOURCE:
            return {
                loginURL: `${createSignInHostname(accountId, APIGATEWAY)}?${REGION}=${awsRegion}#/apis/${configuration.RestApiId}/resources/${configuration.id}`,
                loggedInURL: `${createLoggedInHostname(awsRegion,  APIGATEWAY)}?${REGION}=${awsRegion}#/apis/${configuration.RestApiId}/resources/${configuration.id}`
            }
        case AWS_API_GATEWAY_METHOD:
            const {httpMethod} = configuration;
            return {
                loginURL: `${createSignInHostname(accountId, APIGATEWAY)}?${REGION}=${awsRegion}#/apis/${configuration.RestApiId}/resources/${configuration.ResourceId}/${httpMethod}`,
                loggedInURL: `${createLoggedInHostname(awsRegion,  APIGATEWAY)}?${REGION}=${awsRegion}#/apis/${configuration.RestApiId}/resources/${configuration.ResourceId}/${httpMethod}`
            }
        case AWS_AUTOSCALING_AUTOSCALING_GROUP:
            return {
                loginURL: `${createSignInHostname(accountId, EC2)}/autoscaling/home?${REGION}=${awsRegion}#AutoScalingGroups:id=${resourceName};view=details`,
                loggedInURL: `${createLoggedInHostname(awsRegion,  EC2)}/autoscaling/home?${REGION}=${awsRegion}#AutoScalingGroups:id=${resourceName};view=details`
            }
        case AWS_LAMBDA_FUNCTION:
            return {
                loginURL: `${createSignInHostname(accountId,  LAMBDA)}?${REGION}=${awsRegion}#/functions/${resourceName}?tab=graph`,
                loggedInURL: `${createLoggedInHostname(awsRegion,  LAMBDA)}?${REGION}=${awsRegion}#/functions/${resourceName}?tab=graph`
            }
        case AWS_IAM_ROLE:
        case AWS_IAM_GROUP:
        case AWS_IAM_USER:
        case AWS_IAM_POLICY:
            const {url, type} = iamUrlMappings[resourceType];
            return {
                loginURL: `${createSignInHostname(accountId,  type)}?${HOME}?#${url}`,
                loggedInURL: `https://${CONSOLE}.${AWS_AMAZON_COM}/${type}/${HOME}?#${url}`,
            }
        case AWS_S3_BUCKET:
            return {
                loginURL: `${createSignInHostname(accountId,  S3)}?bucket=${resourceName}`,
                loggedInURL: `https://${S3}.${CONSOLE}.${AWS_AMAZON_COM}/${S3}/buckets/${resourceName}/?${REGION}=${awsRegion}`
            }
        default:
            if(defaultUrlMappings[resourceType] != null) {
                const {url, type} = defaultUrlMappings[resourceType];
                const v2Type = `${type}/v2`
                return {
                    loginURL: `${createSignInHostname(accountId, type)}?${REGION}=${awsRegion}#${url}`,
                    loggedInURL: `${createLoggedInHostname(awsRegion, v2Type)}?${REGION}=${awsRegion}#${url}`
                }
            }
            return {};
    }
}

function createTitle({resourceId, resourceName, arn, resourceType, tags}) {
    const name = tags.find(tag => tag.key === NAME);
    if(name != null) return name.value;

    switch (resourceType) {
        case AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP:
        case AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER:
            return R.last(arn.split(":"));
        case AWS_AUTOSCALING_AUTOSCALING_GROUP:
            const parsedAsg = R.last(arn.split(":"));
            return R.last(parsedAsg.split("/"));
        default:
            return resourceName == null ? resourceId : resourceName;
    }
}

const propertiesToKeep = new Set([
    'accountId', 'arn', 'availabilityZone', 'awsRegion', 'configuration', 'configurationItemCaptureTime',
    'configurationItemStatus', 'configurationStateId', 'relationships', 'resourceCreationTime', 'resourceId',
    'resourceName', 'resourceType', 'supplementaryConfiguration', 'tags', 'version', 'vpcId', 'subnetId', 'subnetIds',
    'resourceValue', 'state', 'private', 'dBInstanceStatus', 'statement', 'instanceType']);

const propertiesToJsonStringify = new Set(['configuration', 'supplementaryConfiguration', 'tags', 'relationships', 'state'])

/**
 * Neptune cannot store nested properties. Therefore this function extracts the
 * specified and adds them to the main object. It also converts nested fields
 * into JSON.
 * @param {*} node
 */
function createProperties(resource) {
    const properties = Object.entries(resource).reduce((acc, [key, value]) => {
        if (propertiesToKeep.has(key)) {
            if(propertiesToJsonStringify.has(key)) {
                acc[key] = JSON.stringify(value);
            } else {
                acc[key] = value;
            }
        }
        return acc;
    }, {});

    const logins = createConsoleUrls(resource)

    if(!R.isEmpty(logins)) {
        properties.loginURL = logins.loginURL;
        properties.loggedInURL = logins.loggedInURL;
    }

    properties.title = createTitle(resource);

    return properties;
}

const resourceTypesToHash = new Set([
        AWS_API_GATEWAY_METHOD,
        AWS_API_GATEWAY_RESOURCE,
        AWS_ECS_TASK,
        AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
        AWS_EKS_NODE_GROUP,
        AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
        AWS_IAM_AWS_MANAGED_POLICY,
        AWS_EC2_SPOT,
        AWS_EC2_SPOT_FLEET,
        AWS_IAM_INLINE_POLICY,
        AWS_OPENSEARCH_DOMAIN
    ]
);

function createSaveObject(resource) {
    const {id, resourceId, resourceName, resourceType, accountId, arn, awsRegion, relationships = [], tags = []} = resource;

    const properties = createProperties(resource);

    return {
        id,
        md5Hash: resourceTypesToHash.has(resourceType) ? hash(properties) : '',
        resourceId,
        resourceName,
        resourceType,
        accountId,
        arn,
        awsRegion,
        relationships,
        properties,
        tags
    };
}

module.exports = {createSaveObject};