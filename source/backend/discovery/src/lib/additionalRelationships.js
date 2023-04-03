// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require("ramda");
const {PromisePool} = require("@supercharge/promise-pool");
const {parse: parseArn} = require('@aws-sdk/util-arn-parser');

const logger = require("./logger");
const {
    AWS_AUTOSCALING_AUTOSCALING_GROUP,
    AWS_API_GATEWAY_METHOD,
    AWS_CODEBUILD_PROJECT,
    AWS_CONFIG_RESOURCE_COMPLIANCE,
    AWS_DYNAMODB_STREAM,
    AWS_DYNAMODB_TABLE,
    AWS_EC2_INSTANCE,
    AWS_EC2_INTERNET_GATEWAY,
    AWS_EC2_NAT_GATEWAY,
    AWS_EC2_NETWORK_INTERFACE,
    AWS_EC2_SECURITY_GROUP,
    AWS_EC2_SUBNET,
    AWS_EC2_TRANSIT_GATEWAY,
    AWS_EC2_TRANSIT_GATEWAY_ROUTE_TABLE,
    AWS_EC2_VOLUME,
    AWS_EC2_VPC,
    AWS_EC2_VPC_ENDPOINT,
    AWS_ECS_CLUSTER,
    AWS_ECS_SERVICE,
    AWS_ECS_TASK,
    AWS_ECS_TASK_DEFINITION,
    AWS_ELASTICSEARCH_DOMAIN,
    AWS_OPENSEARCH_DOMAIN,
    AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER,
    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_LAMBDA_FUNCTION,
    AWS_IAM_AWS_MANAGED_POLICY,
    AWS_IAM_ROLE,
    AWS_IAM_INLINE_POLICY,
    AWS_IAM_USER,
    AWS_KMS_KEY,
    AWS_RDS_DB_CLUSTER,
    AWS_RDS_DB_INSTANCE,
    AWS_S3_ACCOUNT_PUBLIC_ACCESS_BLOCK,
    NETWORK_INTERFACE_ID,
    SUBNET_ID,
    AWS_EC2_ROUTE_TABLE,
    AWS_REDSHIFT_CLUSTER,
    AWS,
    AWS_EFS_ACCESS_POINT,
    AWS_EFS_FILE_SYSTEM,
    AWS_CLOUDFRONT_DISTRIBUTION,
    AWS_CLOUDFRONT_STREAMING_DISTRIBUTION,
    AWS_EKS_CLUSTER,
    AWS_EKS_NODE_GROUP,
    AWS_TAGS_TAG,
    EC2,
    ENI_NAT_GATEWAY_INTERFACE_TYPE,
    ENI_SEARCH_DESCRIPTION_PREFIX,
    ENI_SEARCH_REQUESTER_ID,
    ENI_VPC_ENDPOINT_INTERFACE_TYPE,
    ENI_ALB_DESCRIPTION_PREFIX,
    ENI_ELB_DESCRIPTION_PREFIX,
    ELASTIC_LOAD_BALANCING,
    LOAD_BALANCER,
    CONTAINS,
    LAMBDA,
    SUBNET,
    AWS_S3_BUCKET,
    AWS_EC2_SPOT_FLEET,
    AWS_COGNITO_USER_POOL,
    AWS_EC2_LAUNCH_TEMPLATE,
    AWS_MSK_CLUSTER,
    TRANSIT_GATEWAY_ATTACHMENT,
    UNKNOWN,
    VPC
} = require('./constants');

const {
    createArn,
    createContainedInRelationship,
    createAssociatedSecurityGroupRelationship,
    createContainedInSubnetRelationship,
    createContainedInVpcRelationship,
    createContainsRelationship,
    createAssociatedRelationship,
    createAttachedRelationship,
    safeForEach
} = require('./utils');

function createResourceNameKey({resourceName, resourceType, accountId, awsRegion}) {
    const first = resourceType == null ? '' : `${resourceType}_`;
    return `${first}${resourceName}_${accountId}_${awsRegion}`;
}

function createResourceIdKey({resourceId, resourceType, accountId, awsRegion}) {
    const first = resourceType == null ? '' : `${resourceType}_`;
    return `${first}${resourceId}_${accountId}_${awsRegion}`;
}

function createLookUpMaps(resources) {
    const targetGroupToAsgMap = new Map();
    const resourceIdentifierToIdMap = new Map();
    // we can't reuse resourceIdentifierToIdMap because we don't know the resource type for env vars
    const envVarResourceIdentifierToIdMap = new Map();
    const dbUrlToIdMap = new Map();
    const elbDnsToResourceIdMap = new Map();
    const asgResourceNameToResourceIdMap = new Map();
    const s3ResourceIdToRegionMap = new Map();

    for(let resource of resources) {
        const {id, resourceType, resourceId, resourceName, accountId, awsRegion, arn, configuration} = resource;

        if(resourceName != null) {
            envVarResourceIdentifierToIdMap.set(createResourceNameKey({resourceName, accountId, awsRegion}), id);
            resourceIdentifierToIdMap.set(
                createResourceNameKey({resourceName, resourceType, accountId, awsRegion}),
                id);
        }

        resourceIdentifierToIdMap.set(
            createResourceIdKey({resourceId, resourceType, accountId, awsRegion}),
            id);
        envVarResourceIdentifierToIdMap.set(createResourceIdKey({resourceId, accountId, awsRegion}), id);

        switch (resourceType) {
            case AWS_AUTOSCALING_AUTOSCALING_GROUP:
                configuration.targetGroupARNs.forEach(tg =>
                    targetGroupToAsgMap.set(tg, {
                        arn,
                        instances: new Set(configuration.instances.map(R.prop('instanceId')))
                    }));
                asgResourceNameToResourceIdMap.set(
                    createResourceNameKey(
                        {resourceName, accountId, awsRegion}),
                    resourceId);
                break;
            case AWS_ELASTICSEARCH_DOMAIN:
                if(configuration.endpoint != null) dbUrlToIdMap.set(configuration.endpoint, id)
                Object.values(configuration.endpoints ?? []).forEach(endpoint => dbUrlToIdMap.set(endpoint, id));
                break;
            case AWS_OPENSEARCH_DOMAIN:
                if(configuration.Endpoint != null) dbUrlToIdMap.set(configuration.Endpoint, id)
                Object.values(configuration.Endpoints ?? []).forEach(endpoint => dbUrlToIdMap.set(endpoint, id));
                break;
            case AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER:
                elbDnsToResourceIdMap.set(configuration.dnsname, {resourceId, resourceType, awsRegion});
                break;
            case AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER:
                elbDnsToResourceIdMap.set(configuration.dNSName, {resourceId, resourceType, awsRegion});
                break;
            // databases in the 'creating' phase don't have an endpoint field
            case AWS_RDS_DB_CLUSTER:
                if(configuration.endpoint != null) dbUrlToIdMap.set(configuration.endpoint.value, id);
                if(configuration.readerEndpoint != null) dbUrlToIdMap.set(configuration.readerEndpoint, id);
                break;
            case AWS_RDS_DB_INSTANCE:
                if(configuration.endpoint != null) dbUrlToIdMap.set(configuration.endpoint.address, id);
                break;
            case AWS_REDSHIFT_CLUSTER:
                if(configuration.endpoint != null) dbUrlToIdMap.set(configuration.endpoint.address, id);
                break;
            case AWS_S3_BUCKET:
                s3ResourceIdToRegionMap.set(resourceId, awsRegion);
                break
            default:
                break;
        }
    }

    return {
        dbUrlToIdMap,
        resourceIdentifierToIdMap,
        targetGroupToAsgMap,
        elbDnsToResourceIdMap,
        asgResourceNameToResourceIdMap,
        s3ResourceIdToRegionMap,
        envVarResourceIdentifierToIdMap
    }
}

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

function createEcsEfsRelationships(volumes) {
    return volumes.reduce((acc, {EfsVolumeConfiguration}) => {
        if(EfsVolumeConfiguration != null) {
            if(EfsVolumeConfiguration.AuthorizationConfig?.AccessPointId != null) {
                acc.push(createAssociatedRelationship(AWS_EFS_ACCESS_POINT, {resourceId: EfsVolumeConfiguration.AuthorizationConfig.AccessPointId}));
            } else {
                acc.push(createAssociatedRelationship(AWS_EFS_FILE_SYSTEM, {resourceId: EfsVolumeConfiguration.FileSystemId}));
            }
        }
        return acc;
    }, []);
}

function createEniRelatedResource({description, interfaceType, requesterId, awsRegion, accountId}) {
    if(interfaceType === ENI_NAT_GATEWAY_INTERFACE_TYPE) {
        //Every nat-gateway ENI has a `description` field like this: Interface for NAT Gateway <natgateway-resource-id>
        const {groups: {resourceId}} = R.match(/(?<resourceId>nat-[0-9a-fA-F]+)/, description)
        return {
            resourceId,
            resourceType: AWS_EC2_NAT_GATEWAY
        }
    } else if(description.startsWith(ENI_ALB_DESCRIPTION_PREFIX)) {
        const [app, albGroup, linkedAlb] = description.replace(ENI_ELB_DESCRIPTION_PREFIX, '').split('/');
        const albArn = createArn({service: ELASTIC_LOAD_BALANCING, accountId, region: awsRegion, resource: `${LOAD_BALANCER}/${app}/${albGroup}/${linkedAlb}`});

        return {
            resourceId: albArn,
            resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER
        }
    } else if(interfaceType === ENI_VPC_ENDPOINT_INTERFACE_TYPE) {
        //Every VPC Endpoint ENI has a `description` field like this: VPC Endpoint Interface <vpc-endpoint-resource-id>
        const {groups: {resourceId}} = R.match(/(?<resourceId>vpce-[0-9a-fA-F]+)/, description)

        return {
            resourceId,
            resourceType: AWS_EC2_VPC_ENDPOINT
        }
    } else if(requesterId === ENI_SEARCH_REQUESTER_ID) {
        return {
            resourceId: `${accountId}/${description.replace(ENI_SEARCH_DESCRIPTION_PREFIX, '')}`,
            resourceType: AWS_ELASTICSEARCH_DOMAIN
        }
    } else if(interfaceType === LAMBDA) {
        // Every lambda ENI has a `description` field like this: AWS Lambda VPC ENI-<lambda-resource-id>>-<uuid4>"
        const resourceId = description
            .replace('AWS Lambda VPC ENI-', '')
            .replace(/-[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i, '');

        return {
            resourceId,
            resourceType: AWS_LAMBDA_FUNCTION
        }
    } else {
        return {resourceId: UNKNOWN}
    }
}

function getSubnetInfo(resourceMap, resourceIdentifierToIdMap, accountId, awsRegion, subnetIds) {
    const {availabilityZones, vpcId} = subnetIds.reduce((acc, subnetId) => {
        const id = resourceIdentifierToIdMap.get(createResourceIdKey({resourceId: subnetId, resourceType: AWS_EC2_SUBNET, accountId, awsRegion}));

        // we may not have ingested the subnets
        if(resourceMap.has(id)) {
            const {configuration: {vpcId}, availabilityZone} = resourceMap.get(id);
            if(acc.vpcId == null) acc.vpcId = vpcId;
            acc.availabilityZones.add(availabilityZone);
        }

        return acc;
    }, {availabilityZones: new Set()});

    return {vpcId, availabilityZones: Array.from(availabilityZones).sort()}
}

function createManagedPolicyRelationships(resourceMap, policies) {
    return policies.reduce((acc, {policyArn}) => {
        const {accountId} = parseArn(policyArn);
        if(accountId === AWS) {
            acc.push(createAttachedRelationship(AWS_IAM_AWS_MANAGED_POLICY, {arn: policyArn}));
        }
        return acc;
    }, []);
}

function createIndividualHandlers(lookUpMaps, awsClient, resources, resourceMap) {

    const {
        accountsMap,
        dbUrlToIdMap,
        resourceIdentifierToIdMap,
        targetGroupToAsgMap,
        elbDnsToResourceIdMap,
        asgResourceNameToResourceIdMap,
        s3ResourceIdToRegionMap,
        envVarResourceIdentifierToIdMap
    } = lookUpMaps;

    return {
        [AWS_API_GATEWAY_METHOD]: async ({relationships, configuration: {methodIntegration}}) => {
            const lambdaArn = R.match(/arn.*\/functions\/(?<lambdaArn>.*)\/invocations/, methodIntegration.uri).groups?.lambdaArn;
            if(lambdaArn != null) { // not all API gateways use lambda
                relationships.push(createAssociatedRelationship(AWS_LAMBDA_FUNCTION, {arn: lambdaArn}));
            }
        },
        [AWS_AUTOSCALING_AUTOSCALING_GROUP]: async asg => {
            const {relationships, accountId, awsRegion, configuration: {launchTemplate, vpczoneIdentifier}} = asg;

            if(!R.isEmpty(vpczoneIdentifier)) {
                const {vpcId, availabilityZones} = getSubnetInfo(resourceMap, resourceIdentifierToIdMap, accountId, awsRegion, vpczoneIdentifier.split(','));

                if(vpcId != null) {
                    asg.availabilityZone = R.sort((a, b) => a - b, availabilityZones).join(',');

                    relationships.push(createContainedInVpcRelationship(vpcId));
                }
            }

            if(launchTemplate != null) {
                relationships.push(createAssociatedRelationship(AWS_EC2_LAUNCH_TEMPLATE, {resourceId: launchTemplate.launchTemplateId}))
            }
        },
        [AWS_CLOUDFRONT_DISTRIBUTION]: async ({configuration: {distributionConfig}, relationships}) => {
            relationships.forEach(relationship => {
                const {resourceId, resourceType} = relationship;
                if(resourceType === AWS_S3_BUCKET && s3ResourceIdToRegionMap.has(resourceId)) {
                    relationship.awsRegion = s3ResourceIdToRegionMap.get(resourceId);
                }
            });

            const items = distributionConfig.origins?.items ?? [];

            relationships.push(...items.reduce((acc, {domainName}) => {
                if(elbDnsToResourceIdMap.has(domainName)) {
                    const {resourceType, resourceId, awsRegion} = elbDnsToResourceIdMap.get(domainName)
                    acc.push(createAssociatedRelationship(resourceType, {resourceId, awsRegion}));
                }
                return acc;
            }, []));
        },
        [AWS_CLOUDFRONT_STREAMING_DISTRIBUTION]: async ({relationships}) => {
            relationships.forEach(relationship => {
                const {resourceId, resourceType} = relationship;
                if(resourceType === AWS_S3_BUCKET && s3ResourceIdToRegionMap.has(resourceId)) {
                    relationship.awsRegion = s3ResourceIdToRegionMap.get(resourceId);
                }
            });
        },
        [AWS_CODEBUILD_PROJECT]: async project => {
            const {accountId, awsRegion, configuration, relationships} = project;
            const {vpcConfig, serviceRole} = configuration;

            relationships.push(createAssociatedRelationship(AWS_IAM_ROLE, {arn: serviceRole}))

            if(vpcConfig != null) {
                const {vpcId, subnets, securityGroupIds} = vpcConfig;

                const {availabilityZones} = getSubnetInfo(resourceMap, resourceIdentifierToIdMap, accountId, awsRegion, subnets);
                if(!R.isEmpty(availabilityZones)) project.availabilityZone = R.sort((a, b) => a - b, availabilityZones).join(',');

                relationships.push(
                    createContainedInVpcRelationship(vpcId),
                    ...subnets.map(createContainedInSubnetRelationship),
                    ...securityGroupIds.map(resourceId => createAssociatedRelationship(AWS_EC2_SECURITY_GROUP, {resourceId}))
                )
            }
        },
        [AWS_DYNAMODB_TABLE]: async dbTable => {
            //if streamArn exists create create relationship. Do I have access to the whole object?
            const {arn, accountId, awsRegion, relationships} = dbTable;

            const {credentials} = accountsMap.get(accountId);

            const dynamoDBClient = awsClient.createDynamoDBClient(credentials, awsRegion);

            const dbTableInfo = await dynamoDBClient.getTableInfo(dbTable);
            
            if (dbTableInfo.LatestStreamArn) {
                relationships.push(createAssociatedRelationship(AWS_DYNAMODB_STREAM, {resourceId: dbTableInfo.LatestStreamArn}));
            }
        },
        [AWS_EC2_SECURITY_GROUP]: async ({configuration, relationships}) => {
            const {ipPermissions, ipPermissionsEgress} = configuration;
            const securityGroups = [...ipPermissions, ...ipPermissionsEgress].reduce((acc, {userIdGroupPairs = []}) => {
                userIdGroupPairs.forEach(({groupId}) => {
                    if(groupId != null) acc.add(groupId);
                });
                return acc;
            }, new Set());

            relationships.push(...Array.from(securityGroups).map(createAssociatedSecurityGroupRelationship));
        },
        [AWS_EC2_SUBNET]: async subnet => {
            const {relationships, awsRegion, accountId, configuration: {subnetId}} = subnet;

            subnet.subnetId = subnetId;

            const routeTableRel = relationships.find(x => x.resourceType === AWS_EC2_ROUTE_TABLE);
            if(routeTableRel != null) {
                const {resourceId, resourceType} = routeTableRel;
                const routeTableId = resourceIdentifierToIdMap.get(createResourceIdKey({resourceId, resourceType, accountId, awsRegion}));
                const routes = resourceMap.get(routeTableId)?.configuration?.routes ?? [];
                const natGateways = routes.filter(x => x.natGatewayId != null);
                subnet.private = natGateways.length === 0;
            }
        },
        [AWS_EC2_TRANSIT_GATEWAY]: async ({relationships, configuration}) => {
            const {AssociationDefaultRouteTableId, PropagationDefaultRouteTableId} = configuration;
            relationships.push(...[
                createContainedInRelationship(AWS_EC2_TRANSIT_GATEWAY_ROUTE_TABLE, {resourceId: AssociationDefaultRouteTableId}),
                createContainedInRelationship(AWS_EC2_TRANSIT_GATEWAY_ROUTE_TABLE, {resourceId: PropagationDefaultRouteTableId})
            ]);
        },
        [AWS_ECS_CLUSTER]: async cluster => {
            const {arn, accountId, awsRegion, relationships} = cluster;

            const {credentials} = accountsMap.get(accountId);

            const ecsClient = awsClient.createEcsClient(credentials, awsRegion);

            const clusterInstances = await ecsClient.getAllClusterInstances(arn);

            relationships.push(...clusterInstances.map(resourceId => createContainsRelationship(AWS_EC2_INSTANCE, {resourceId})));
        },
        [AWS_ECS_SERVICE]: async service => {
            const {configuration, awsRegion, relationships, accountId} = service;
            const {Cluster, Role, TaskDefinition, LoadBalancers = [], NetworkConfiguration} = configuration;
            relationships.push(createContainedInRelationship(AWS_ECS_CLUSTER, {arn: Cluster}),
                createAssociatedRelationship(AWS_IAM_ROLE, {arn: Role}),
                createAssociatedRelationship(AWS_ECS_TASK_DEFINITION, {arn: TaskDefinition}),
                ...LoadBalancers.map(({TargetGroupArn}) => {
                    return createAssociatedRelationship(AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP, {resourceId: TargetGroupArn});
                }));

            const subnetIds = NetworkConfiguration?.AwsvpcConfiguration?.Subnets ?? [];
            const securityGroups = NetworkConfiguration?.AwsvpcConfiguration?.SecurityGroups ?? [];

            relationships.push(
                ...securityGroups.map(createAssociatedSecurityGroupRelationship)
            );

            if(!R.isEmpty(subnetIds)) {
                const {vpcId, availabilityZones} = getSubnetInfo(resourceMap, resourceIdentifierToIdMap, accountId, awsRegion, subnetIds);

                if(vpcId != null) {
                    service.availabilityZone = availabilityZones.join(',');
                    relationships.push(
                        ...subnetIds.map(createContainedInSubnetRelationship),
                        createContainedInVpcRelationship(vpcId)
                    );
                }
            }
        },
        [AWS_ECS_TASK]: async task => {
            const {accountId, awsRegion, configuration} = task;
            const {clusterArn, overrides, attachments = [], taskDefinitionArn} = configuration;
            const taskDefinition = resourceMap.get(taskDefinitionArn);

            task.relationships.push(createContainedInRelationship(AWS_ECS_CLUSTER, {arn: clusterArn}));

            const {taskRoleArn, executionRoleArn, containerOverrides = []} = overrides;
            const roleRels = R.reject(R.isNil, [taskRoleArn, executionRoleArn])
                .map(arn => createAssociatedRelationship(AWS_IAM_ROLE, {arn}));

            if (R.isEmpty(roleRels)) {
                const {configuration: {TaskRoleArn, ExecutionRoleArn}} = taskDefinition;
                R.reject(R.isNil, [TaskRoleArn, ExecutionRoleArn])
                    .forEach(arn => {
                        task.relationships.push(createAssociatedRelationship(AWS_IAM_ROLE, {arn}));
                    });
            } else {
                task.relationships.push(...roleRels);
            }

            const groupedDefinitions = R.groupBy(x => x.Name, taskDefinition.configuration.ContainerDefinitions);
            const groupedOverrides = R.groupBy(x => x.name, containerOverrides);

            const environmentVariables = Object.entries(groupedDefinitions).map(([key, val]) => {
                const Environment = R.head(val)?.Environment ?? [];
                const environment = R.head(groupedOverrides[key] ?? [])?.environment ?? [];

                const envVarObj = Environment.reduce((acc, {Name, Value}) => {
                    acc[Name] = Value;
                    return acc
                }, {});

                const overridesObj = environment.reduce((acc, {name, value}) => {
                    acc[name] = value;
                    return acc
                }, {});

                return {...envVarObj, ...overridesObj};
            }, {});

            environmentVariables.forEach( variables => {
                task.relationships.push(...createEnvironmentVariableRelationships(
                    {resourceMap, envVarResourceIdentifierToIdMap, dbUrlToIdMap},
                    {accountId, awsRegion},
                    variables));
            });

            task.relationships.push(...createEcsEfsRelationships(taskDefinition.configuration.Volumes));

            attachments.forEach(({details}) => {
                return details.forEach(({name, value}) => {
                    if(name === SUBNET_ID) {
                        const subnetArn = resourceIdentifierToIdMap.get(createResourceIdKey({resourceId: value, resourceType: AWS_EC2_SUBNET, accountId, awsRegion}));
                        const vpcId = resourceMap.get(subnetArn)?.configuration?.vpcId; // we may not have discovered the subnet

                        if(vpcId != null) task.relationships.push(createContainedInVpcRelationship(vpcId));

                        task.relationships.push(createContainedInSubnetRelationship(value));
                    } else if (name === NETWORK_INTERFACE_ID) {
                        const networkInterfaceId = resourceIdentifierToIdMap.get(createResourceIdKey({resourceId: value, resourceType: AWS_EC2_NETWORK_INTERFACE, accountId, awsRegion}));
                        // occasionally network interface information is stale so we need to do null checks here
                        resourceMap.get(networkInterfaceId)?.relationships?.push(createAttachedRelationship(AWS_ECS_TASK, {resourceId: task.resourceId}));
                    }
                });
            });
        },
        [AWS_ECS_TASK_DEFINITION]: async taskDefinition => {
            const {relationships, accountId, awsRegion, configuration} = taskDefinition;
            const {TaskRoleArn, ExecutionRoleArn, ContainerDefinitions, Volumes} = configuration;

            R.reject(R.isNil, [TaskRoleArn, ExecutionRoleArn])
                .forEach(arn => {
                    // task definitons do not get deleted so can refer to IAM roles that no longer
                    // exist (https://github.com/aws/containers-roadmap/issues/685)
                    const resourceName = resourceMap.get(arn)?.resourceName;
                    if(resourceName != null) {
                        relationships.push(createAssociatedRelationship(AWS_IAM_ROLE, {resourceName}));
                    }
                });

            ContainerDefinitions.forEach(({Environment = []}) => {
                const variables = Environment.reduce((acc, {Name, Value}) => {
                    acc[Name] = Value;
                    return acc
                }, {});
                relationships.push(...createEnvironmentVariableRelationships(
                    {resourceMap, envVarResourceIdentifierToIdMap, dbUrlToIdMap},
                    {accountId, awsRegion},
                    variables));
            });

            relationships.push(...createEcsEfsRelationships(Volumes));
        },
        [AWS_EFS_ACCESS_POINT]: async ({configuration: {FileSystemId}, relationships}) => {
            relationships.push(createAttachedRelationship(AWS_EFS_FILE_SYSTEM, {resourceId: FileSystemId}));
        },
        [AWS_EFS_FILE_SYSTEM]: async ({configuration: {KmsKeyId}, relationships}) => {
            relationships.push(createAssociatedRelationship(AWS_KMS_KEY, {arn: KmsKeyId}));
        },
        [AWS_EKS_CLUSTER]: async cluster => {
            const {configuration, accountId, relationships, awsRegion} = cluster;
            const {ResourcesVpcConfig: {SubnetIds, SecurityGroupIds}, RoleArn} = configuration;
            const {vpcId, availabilityZones} = getSubnetInfo(resourceMap, resourceIdentifierToIdMap, accountId, awsRegion, SubnetIds);

            if(vpcId != null) {
                cluster.availabilityZone = availabilityZones.join(',');
                relationships.push(createContainedInVpcRelationship(vpcId));
            }

            relationships.push(
                ...SubnetIds.map(createContainedInSubnetRelationship),
                ...SecurityGroupIds.map(createAssociatedSecurityGroupRelationship),
                createAssociatedRelationship(AWS_IAM_ROLE, {arn: RoleArn})
            );
        },
        [AWS_EKS_NODE_GROUP]: async nodeGroup => {
            const {accountId, awsRegion, relationships, configuration} = nodeGroup;
            const {subnets, remoteAccess = {}, resources, nodeRole, launchTemplate = {}} = configuration;
            const {vpcId, availabilityZones} = getSubnetInfo(resourceMap, resourceIdentifierToIdMap, accountId, awsRegion, subnets);

            if(vpcId != null) {
                nodeGroup.availabilityZone = availabilityZones.join(',');
                relationships.push(createContainedInVpcRelationship(vpcId))
            }

            const {autoScalingGroups = [], remoteAccessSecurityGroup = []} = resources;
            const sourceSecurityGroups = remoteAccess.sourceSecurityGroups ?? [];

            relationships.push(
                ...subnets.map(createContainedInSubnetRelationship),
                ...remoteAccessSecurityGroup.map(createAssociatedSecurityGroupRelationship),
                ...sourceSecurityGroups.map(createAssociatedSecurityGroupRelationship),
                ...autoScalingGroups.map(({name}) => {
                    const rId = asgResourceNameToResourceIdMap.get(createResourceNameKey({
                        resourceName: name,
                        accountId,
                        awsRegion
                    }));
                    return createAssociatedRelationship(AWS_AUTOSCALING_AUTOSCALING_GROUP, {resourceId: rId});
                }),
                createAssociatedRelationship(AWS_IAM_ROLE, {arn: nodeRole}),
            );

            if(launchTemplate.id != null) {
                relationships.push(createAssociatedRelationship(AWS_EC2_LAUNCH_TEMPLATE, {resourceId: launchTemplate.id}) );
            }
        },
        [AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER]: async ({resourceId, accountId, awsRegion, relationships}) => {
            const {credentials} = accountsMap.get(accountId);
            const elbClient = awsClient.createElbClient(accountId, credentials, awsRegion);

            const instanceIds = await elbClient.getLoadBalancerInstances(resourceId);

            relationships.push(...instanceIds.map(resourceId => createAssociatedRelationship(AWS_EC2_INSTANCE, {resourceId})));
        },
        [AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER]: async ({relationships, configuration: {LoadBalancerArn, DefaultActions}}) => {
            const {targetGroups, cognitoUserPools} = DefaultActions.reduce((acc, {AuthenticateCognitoConfig, TargetGroupArn, ForwardConfig}) => {
                if(AuthenticateCognitoConfig != null) acc.cognitoUserPools.add(AuthenticateCognitoConfig.UserPoolArn);
                if(TargetGroupArn != null) acc.targetGroups.add(TargetGroupArn);
                if(ForwardConfig != null) {
                    const {TargetGroups = []} = ForwardConfig;
                    TargetGroups.forEach(x => acc.targetGroups.add(x.TargetGroupArn))
                }
                return acc;
            }, {cognitoUserPools: new Set(), targetGroups: new Set});

            relationships.push(
                createAssociatedRelationship(AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER, {resourceId: LoadBalancerArn}),
                ...Array.from(targetGroups.values()).map(resourceId => createAssociatedRelationship(AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP, {resourceId})),
                ...Array.from(cognitoUserPools.values()).map(resourceId => createAssociatedRelationship(AWS_COGNITO_USER_POOL, {resourceId}))
            );
        },
        [AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP]: async ({accountId, awsRegion, arn, configuration: {VpcId}, relationships}) => {
            const {credentials} = accountsMap.get(accountId);
            const elbClientV2 = awsClient.createElbV2Client(accountId, credentials, awsRegion);

            const {instances: asgInstances, arn: asgArn} = targetGroupToAsgMap.get(arn) ?? {instances: new Set()};

            const targetHealthDescriptions = await elbClientV2.describeTargetHealth(arn);

            //TODO: use TargetHealth to label the link as to whether it's healthy or not
            relationships.push(createContainedInVpcRelationship(VpcId),
                ...targetHealthDescriptions.reduce((acc, {Target: {Id}, TargetHealth}) => {
                // We don't want to include instances from ASGs as the direct link should be to the
                // ASG not the instances therein
                if(Id.startsWith('i-') && !asgInstances.has(Id)) {
                    acc.push(createAssociatedRelationship(AWS_EC2_INSTANCE, {resourceId:Id}));
                } else if(Id.startsWith('arn:')) {
                    const {resourceId, resourceType} = resourceMap.get(Id);
                    acc.push(createAssociatedRelationship(resourceType, {resourceId}));
                }
                return acc;
            }, []));

            if(asgArn != null) {
                relationships.push(createAssociatedRelationship(AWS_AUTOSCALING_AUTOSCALING_GROUP, {resourceId: asgArn}));
            }
        },
        [AWS_IAM_ROLE]: async ({configuration: {attachedManagedPolicies}, relationships}) => {
            relationships.push(...createManagedPolicyRelationships(resourceMap, attachedManagedPolicies));
        },
        // [AWS_IAM_INLINE_POLICY]: ({configuration: {policyDocument}, relationships}) => {
        [AWS_IAM_INLINE_POLICY]: (policy) => {
            const {configuration: {policyDocument}, relationships} = policy;
            const statement = Array.isArray(policyDocument.Statement) ?
                policyDocument.Statement : [policyDocument.Statement];

            relationships.push(...statement.flatMap(({Resource = []}) => {
                // the Resource field, if it exists, can be an array or string
                const resources = Array.isArray(Resource) ? Resource : [Resource];
                return resources.reduce((acc, resourceArn) => {
                    // Remove the trailing /* from ARNs to increase chance of finding
                    // a relationship, especially for S3 buckets. This will lead to
                    // duplicates but they get deduped later on in the discovery
                    // process
                    const resource = resourceMap.get(resourceArn.replace(/\/?\*$/, ''));
                    if(resource != null) {
                        acc.push(createAttachedRelationship(resource.resourceType, {
                            arn: resource.arn
                        }));
                    }
                    return acc;
                }, []);
            }));
        },
        [AWS_IAM_USER]: ({configuration: {attachedManagedPolicies}, relationships}) => {
            relationships.push(...createManagedPolicyRelationships(resourceMap, attachedManagedPolicies));
        },
        [AWS_LAMBDA_FUNCTION]: async lambda => {
            const {accountId, awsRegion, configuration} = lambda
            const {vpcConfig, fileSystemConfigs = []} = configuration;

            const subnetIds = vpcConfig?.subnetIds ?? [];

            if(!R.isEmpty(subnetIds)) {
                const {vpcId, availabilityZones} = getSubnetInfo(resourceMap, resourceIdentifierToIdMap, accountId, awsRegion, subnetIds);

                if(vpcId != null) {
                    lambda.availabilityZone = availabilityZones.join(',');
                    lambda.relationships.push(createContainedInVpcRelationship(vpcId));
                }
            }

            lambda.relationships.push(...fileSystemConfigs.map(({arn: accessPointArn}) => {
                return createAssociatedRelationship(AWS_EFS_ACCESS_POINT, {arn: accessPointArn});
            }));
        },
        [AWS_MSK_CLUSTER]: async cluster => {
            const {accountId, awsRegion, configuration: {BrokerNodeGroupInfo: {ClientSubnets, SecurityGroups}}} = cluster;
            const {vpcId, availabilityZones} = getSubnetInfo(resourceMap, resourceIdentifierToIdMap, accountId, awsRegion, ClientSubnets);

            if(vpcId != null) {
                cluster.availabilityZone = availabilityZones.join(',');
                cluster.relationships.push(createContainedInVpcRelationship(vpcId));
            }

            cluster.relationships.push(
                ...ClientSubnets.map(createContainedInSubnetRelationship),
                ...SecurityGroups.map(createAssociatedSecurityGroupRelationship)
            );
        },
        [AWS_EC2_NETWORK_INTERFACE]: async eni => {
            const {accountId, awsRegion, relationships, configuration} = eni;
            const {interfaceType, description, requesterId} = configuration;

            const {resourceId, resourceType} = createEniRelatedResource({awsRegion, accountId, interfaceType, description, requesterId});
            if(resourceId !== UNKNOWN) {
                relationships.push(createAttachedRelationship(resourceType, {resourceId}));
            }
        },
        [AWS_OPENSEARCH_DOMAIN]: async domain => {
            const {relationships, configuration: {VPCOptions}} = domain;
            const {AvailabilityZones, SecurityGroupIds, SubnetIds, VPCId} = VPCOptions;

            domain.availabilityZone = R.sort((a, b) => a - b, AvailabilityZones).join(',');

            relationships.push(
                createContainedInVpcRelationship(VPCId),
                ...SubnetIds.map(createContainedInSubnetRelationship),
                ...SecurityGroupIds.map(resourceId => createAssociatedRelationship(AWS_EC2_SECURITY_GROUP, {resourceId}))
            );
        },
        [AWS_RDS_DB_INSTANCE]: async db => {
            const {dBSubnetGroup, availabilityZone} = db.configuration;

            if(dBSubnetGroup != null) {
                const {subnetIdentifier} = R.find(({subnetAvailabilityZone}) => subnetAvailabilityZone.name === availabilityZone,
                    dBSubnetGroup.subnets);

                db.relationships.push(...[
                    createContainedInVpcRelationship(dBSubnetGroup.vpcId),
                    createContainedInSubnetRelationship(subnetIdentifier)
                ]);
            }
        },
        [AWS_EC2_ROUTE_TABLE]: async ({configuration: {routes}, relationships}) => {
            relationships.push(...routes.reduce((acc, {natGatewayId, gatewayId}) => {
                if(natGatewayId != null) {
                    acc.push(createContainsRelationship(AWS_EC2_NAT_GATEWAY, {resourceId: natGatewayId}));
                } else if(R.test(/vpce-[0-9a-fA-F]+/, gatewayId)) {
                    acc.push(createContainsRelationship(AWS_EC2_VPC_ENDPOINT, {resourceId: gatewayId}));
                } else if(R.test(/igw-[0-9a-fA-F]+/, gatewayId)) {
                    acc.push(createContainsRelationship(AWS_EC2_INTERNET_GATEWAY, {resourceId: gatewayId}));
                }
                return acc;
            }, []));
        },
        [AWS_EC2_SPOT_FLEET]: async ({relationships, awsRegion, configuration: {SpotFleetRequestConfig}}) => {
            const targetGroups = SpotFleetRequestConfig.LoadBalancersConfig?.TargetGroupsConfig?.TargetGroups ?? [];
            const classicLoadBalancers = SpotFleetRequestConfig.LoadBalancersConfig?.ClassicLoadBalancersConfig?.ClassicLoadBalancers ?? [];
            relationships.push(
                ...targetGroups.map(({Arn}) => createAssociatedRelationship(AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP, {resourceId: Arn})),
                ...classicLoadBalancers.map(({Name}) => {
                    return createAssociatedRelationship(AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER, {awsRegion, resourceId: Name});
                })
            )
        }
    }
}

function createBatchedHandlers(lookUpMaps, awsClient, resourceMap) {
    const {
        envVarResourceIdentifierToIdMap,
        dbUrlToIdMap
    } = lookUpMaps;

    return {
        eventSources: async (credentials, accountId, region) => {
            const lambdaClient = awsClient.createLambdaClient(credentials, region);
            const eventSourceMappings = await lambdaClient.listEventSourceMappings();

            const {errors} = safeForEach(({EventSourceArn, FunctionArn}) => {
                if(resourceMap.has(EventSourceArn) && resourceMap.has(FunctionArn)) {
                    const {resourceType} = resourceMap.get(EventSourceArn);
                    const lambda = resourceMap.get(FunctionArn);

                    lambda.relationships.push(createAssociatedRelationship(resourceType, {
                        arn: EventSourceArn
                    }));
                }
            }, eventSourceMappings);

            logger.error(`There were ${errors.length} errors when adding lambda event source relationships.`);
            logger.debug('Errors: ', {errors});
        },
        functions: async (credentials, accountId, region) => {
            const lambdaClient = awsClient.createLambdaClient(credentials, region);

            const lambdas = await lambdaClient.getAllFunctions();

            const {errors} = safeForEach(({FunctionArn, Environment = {}}) => {
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

            logger.error(`There were ${errors.length} errors when adding lambda environment variable relationships.`);
            logger.debug('Errors: ', {errors});
        },
        snsSubscriptions: async (credentials, accountId, region) => {
            const snsClient = awsClient.createSnsClient(credentials, region);

            const subscriptions = await snsClient.getAllSubscriptions();

            const {errors} = safeForEach(({Endpoint, TopicArn}) => {
                // an SNS topic may have been created between the time we got the data from config
                // and made our api request or the endpoint may have been created in a region that
                // has not been imported
                if(resourceMap.has(TopicArn) && resourceMap.has(Endpoint)) {
                    const snsTopic = resourceMap.get(TopicArn);
                    const {resourceType} = resourceMap.get(Endpoint);
                    snsTopic.relationships.push(createAssociatedRelationship(resourceType, {arn: Endpoint}));
                }
            }, subscriptions);

            logger.error(`There were ${errors.length} errors when adding SNS subscriber relationships.`);
            logger.debug('Errors: ', {errors});
        },
        transitGatewayVpcAttachments: async (credentials, accountId, region) => {
            // Whilst AWS Config supports the AWS::EC2::TransitGatewayAttachment resource type,
            // it is missing information on the account that VPCs referred to by the attachment
            // are deployed in. Therefore we need to supplement this with info from the EC2 API.
            const ec2Client = awsClient.createEc2Client(credentials, region);

            const tgwAttachments = await ec2Client.getAllTransitGatewayAttachments([
                {Name: 'resource-type', Values: [VPC.toLowerCase()]}
            ]);

            const {errors} = safeForEach(tgwAttachment => {
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

            logger.error(`There were ${errors.length} errors when adding transit gateway relationships.`);
            logger.debug('Errors: ', {errors});
        }
    }
}

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