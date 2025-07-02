import Ajv from 'ajv';
import fs from 'node:fs/promises';
import {PromisePool} from '@supercharge/promise-pool';
import * as R from 'ramda';
import jmesPath from 'jmespath';
import {parse as parseArn} from '@aws-sdk/util-arn-parser';
import createEnvironmentVariableRelationships from './createEnvironmentVariableRelationships.mjs';
import {
    AWS_API_GATEWAY_METHOD,
    AWS_LAMBDA_FUNCTION,
    AWS_AUTOSCALING_AUTOSCALING_GROUP,
    AWS_BEDROCK_CUSTOM_MODEL,
    AWS_BEDROCK_IMPORTED_MODEL,
    AWS_BEDROCK_KNOWLEDGE_BASE,
    AWS_CLOUDFRONT_DISTRIBUTION,
    AWS_S3_BUCKET,
    AWS_CLOUDFRONT_STREAMING_DISTRIBUTION,
    AWS_IAM_ROLE,
    AWS_EC2_SECURITY_GROUP,
    AWS_EC2_SUBNET,
    AWS_EC2_ROUTE_TABLE,
    AWS_ECS_CLUSTER,
    AWS_EC2_INSTANCE,
    AWS_ECS_TASK_DEFINITION,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_ECS_TASK,
    SUBNET_ID,
    NETWORK_INTERFACE_ID,
    AWS_EC2_NETWORK_INTERFACE,
    AWS_EFS_ACCESS_POINT,
    AWS_EFS_FILE_SYSTEM,
    AWS_EKS_NODE_GROUP,
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
    AWS_COGNITO_USER_POOL,
    AWS_GLUE_CONNECTION,
    AWS_GLUE_CRAWLER,
    AWS_GLUE_DATABASE,
    AWS_GLUE_JOB,
    AWS_GLUE_TABLE,
    AWS_IAM_INLINE_POLICY,
    AWS_IAM_USER,
    UNKNOWN,
    AWS_RDS_DB_INSTANCE,
    AWS_EC2_NAT_GATEWAY,
    AWS_EC2_VPC_ENDPOINT,
    AWS_EC2_INTERNET_GATEWAY,
    AWS_EVENT_EVENT_BUS,
    AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION,
    ENI_NAT_GATEWAY_INTERFACE_TYPE,
    ENI_ALB_DESCRIPTION_PREFIX,
    ENI_ELB_DESCRIPTION_PREFIX,
    ELASTIC_LOAD_BALANCING,
    LOAD_BALANCER,
    ENI_VPC_ENDPOINT_INTERFACE_TYPE,
    ENI_SEARCH_REQUESTER_ID,
    ENI_SEARCH_DESCRIPTION_PREFIX,
    IS_ATTACHED_TO,
    LAMBDA,
    S3,
    AWS,
    AWS_IAM_AWS_MANAGED_POLICY,
    IS_ASSOCIATED_WITH,
    CONTAINS,
    TAGS,
    TAG,
    APPLICATION_TAG_NAME,
} from '../constants.mjs';
import {
    createAssociatedRelationship,
    createContainedInVpcRelationship,
    createContainedInSubnetRelationship,
    createAssociatedSecurityGroupRelationship,
    createContainedInRelationship,
    createContainsRelationship,
    createAttachedRelationship,
    createArnRelationship,
    createArn,
    createResourceNameKey,
    createResourceIdKey,
    isQualifiedRelationshipName,
    extractBucketName,
    createArnWithResourceType,
} from '../utils.mjs';
import logger from '../logger.mjs';
import schema from '../../schemas/schema.json' with {type: 'json'};

import {iterate} from 'iterare';
const ajv = new Ajv();
const validate = ajv.compile(schema);

function createRelationship(endpointToIdMap, descriptor, id) {
    const {resourceType} = descriptor;
    // to match Config, we need precisely one space at the end relationship names that have not been appended
    // with resource types such as `Is contained in (Vpc|Subnet|Role|Etc)``
    const relationshipName = isQualifiedRelationshipName(
        descriptor.relationshipName
    )
        ? descriptor.relationshipName
        : descriptor.relationshipName.trim() + ' ';

    if (descriptor.identifierType === 'endpoint') {
        return {
            arn: endpointToIdMap.get(id),
            relationshipName,
        };
    } else if (descriptor.identifierType === 's3Uri') {
        const bucket = extractBucketName(id);
        return {
            arn: createArn({service: S3, resource: bucket}),
            relationshipName,
        };
    } else if (descriptor.identifierType === 'arn') {
        return {
            arn: id,
            relationshipName,
        };
    } else {
        return {
            [descriptor.identifierType]: id,
            relationshipName,
            resourceType,
        };
    }
}

function createRelationshipHandler(
    clientFactories,
    {accountsMap, endpointToIdMap},
    schema
) {
    return async function (resource) {
        const {descriptors, rootPath = '@.configuration'} =
            schema.relationships;

        const [sdkDescriptors, standardDescriptors] = R.partition(
            descriptor => descriptor.sdkClient != null,
            descriptors
        );

        const sdkRels = await Promise.all(
            sdkDescriptors.map(async descriptor => {
                const {sdkClient} = descriptor;
                const {credentials} = accountsMap.get(resource.accountId);

                const client = clientFactories[sdkClient.type](
                    credentials,
                    resource.awsRegion
                );
                const sdkResult = await client[sdkClient.method](
                    ...sdkClient.argumentPaths.map(path => {
                        return jmesPath.search(resource, path);
                    })
                );

                return {
                    result: jmesPath.search(sdkResult, descriptor.path),
                    descriptor,
                };
            })
        );

        const root = jmesPath.search(resource, rootPath);
        const standardRels = standardDescriptors.map(descriptor => {
            return {
                result: jmesPath.search(root, descriptor.path),
                descriptor,
            };
        });

        const allRels = iterate([...sdkRels, ...standardRels])
            .map(({result, descriptor}) => {
                if (result == null) return [];

                if (Array.isArray(result)) {
                    // flattening the JMESPath query result allows us to handle results of arbitrarily nested depths
                    return R.flatten(result)
                        .filter(x => x != null)
                        .map(id => createRelationship(endpointToIdMap, descriptor, id));
                } else {
                    return [createRelationship(endpointToIdMap, descriptor, result)];
                }
            })
            .flatten()
            .toArray();

        resource.relationships.push(...allRels);
    };
}

const schemaFiles = await fs
    .readdir('./src/schemas/resourceTypes')
    .then(
        R.map(
            fileName =>
                import(`../../schemas/resourceTypes/${fileName}`, {
                    with: {type: 'json'},
                })
        )
    )
    .then(ps => Promise.all(ps))
    .then(R.map(({default: schema}) => schema))
    .then(
        R.filter(schema => {
            if (validate(schema)) {
                return true;
            } else {
                logger.error(
                    `There was an error validating the ${schema.type} schema.`,
                    {
                        errors: validate.errors,
                    }
                );
                return false;
            }
        })
    );

function createSchemaHandlers(awsClient, lookupMaps) {
    const clientFactories = {
        ecs: awsClient.createEcsClient,
        elbV1: awsClient.createElbClient,
        elbV2: awsClient.createElbV2Client,
        bedrockAgent: awsClient.createBedrockAgentClient,
    };

    return schemaFiles.reduce((acc, schema) => {
        acc[schema.type] = createRelationshipHandler(
            clientFactories,
            lookupMaps,
            schema
        );
        return acc;
    }, {});
}

function createEcsEfsRelationships(volumes) {
    return volumes.reduce((acc, {EfsVolumeConfiguration}) => {
        if (EfsVolumeConfiguration != null) {
            if (
                EfsVolumeConfiguration.AuthorizationConfig?.AccessPointId !=
                null
            ) {
                acc.push(
                    createAssociatedRelationship(AWS_EFS_ACCESS_POINT, {
                        resourceId:
                            EfsVolumeConfiguration.AuthorizationConfig
                                .AccessPointId,
                    })
                );
            } else {
                acc.push(
                    createAssociatedRelationship(AWS_EFS_FILE_SYSTEM, {
                        resourceId: EfsVolumeConfiguration.FileSystemId,
                    })
                );
            }
        }
        return acc;
    }, []);
}

function createEniRelationship({
    description,
    interfaceType,
    requesterId,
    awsRegion,
    accountId,
}) {
    if (interfaceType === ENI_NAT_GATEWAY_INTERFACE_TYPE) {
        //Every nat-gateway ENI has a `description` field like this: Interface for NAT Gateway <natgateway-resource-id>
        const {
            groups: {resourceId},
        } = R.match(/(?<resourceId>nat-[0-9a-fA-F]+)/, description);
        return createAttachedRelationship(AWS_EC2_NAT_GATEWAY, {resourceId});
    } else if (description.startsWith(ENI_ALB_DESCRIPTION_PREFIX)) {
        const [app, albGroup, linkedAlb] = description
            .replace(ENI_ELB_DESCRIPTION_PREFIX, '')
            .split('/');
        const albArn = createArn({
            service: ELASTIC_LOAD_BALANCING,
            accountId,
            region: awsRegion,
            resource: `${LOAD_BALANCER}/${app}/${albGroup}/${linkedAlb}`,
        });

        return createArnRelationship(IS_ATTACHED_TO, albArn);
    } else if (interfaceType === ENI_VPC_ENDPOINT_INTERFACE_TYPE) {
        //Every VPC Endpoint ENI has a `description` field like this: VPC Endpoint Interface <vpc-endpoint-resource-id>
        const {
            groups: {resourceId},
        } = R.match(/(?<resourceId>vpce-[0-9a-fA-F]+)/, description);
        return createAttachedRelationship(AWS_EC2_VPC_ENDPOINT, {resourceId});
    } else if (requesterId === ENI_SEARCH_REQUESTER_ID) {
        // it's not possible to tell whether we have an OpenSearch or Elasticsearch cluster from the ENI
        // so we must use an ARN instead as these both use the same format
        const domainName = description.replace(
            ENI_SEARCH_DESCRIPTION_PREFIX,
            ''
        );
        const arn = createArn({
            service: 'es',
            accountId,
            region: awsRegion,
            resource: `domain/${domainName}`,
        });

        return createArnRelationship(IS_ATTACHED_TO, arn);
    } else if (interfaceType === LAMBDA) {
        // Every lambda ENI has a `description` field like this: AWS Lambda VPC ENI-<lambda-resource-id>>-<uuid4>"
        const resourceId = description
            .replace('AWS Lambda VPC ENI-', '')
            .replace(
                /-[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i,
                ''
            );

        return createAttachedRelationship(AWS_LAMBDA_FUNCTION, {resourceId});
    } else {
        return {resourceId: UNKNOWN};
    }
}

function createManagedPolicyRelationships(resourceMap, policies) {
    return policies.reduce((acc, {policyArn}) => {
        const {accountId} = parseArn(policyArn);
        if (accountId === AWS) {
            acc.push(
                createAttachedRelationship(AWS_IAM_AWS_MANAGED_POLICY, {
                    arn: policyArn,
                })
            );
        }
        return acc;
    }, []);
}

function createIndividualHandlers(lookUpMaps, awsClient) {
    const {
        accountsMap,
        endpointToIdMap,
        resourceIdentifierToIdMap,
        targetGroupToAsgMap,
        elbDnsToResourceIdMap,
        asgResourceNameToResourceIdMap,
        envVarResourceIdentifierToIdMap,
        eventBusRuleMap,
        resourceMap,
    } = lookUpMaps;

    return {
        [AWS_API_GATEWAY_METHOD]: async ({
            relationships,
            configuration: {methodIntegration},
        }) => {
            const methodUri = methodIntegration?.uri ?? '';
            const lambdaArn = R.match(
                /arn.*\/functions\/(?<lambdaArn>.*)\/invocations/,
                methodUri
            ).groups?.lambdaArn;
            if (lambdaArn != null) {
                // not all API gateways use lambda
                relationships.push(
                    createAssociatedRelationship(AWS_LAMBDA_FUNCTION, {
                        arn: lambdaArn,
                    })
                );
            }
        },
        [AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION]: async ({
            accountId,
            configuration: {applicationTag},
            relationships,
        }) => {
            if (applicationTag == null) return;

            const tagResourceName = `${APPLICATION_TAG_NAME}=${applicationTag.awsApplication}`;
            const applicationTagArn = createArn({
                service: TAGS,
                accountId,
                resource: `${TAG}/${tagResourceName}`,
            });

            const tag = resourceMap.get(applicationTagArn);

            if (tag != null) {
                relationships.push(
                    ...tag.relationships.map(rel => {
                        return {
                            ...rel,
                            relationshipName: CONTAINS,
                        };
                    })
                );
            }
        },
        [AWS_CLOUDFRONT_DISTRIBUTION]: async ({
            configuration: {distributionConfig},
            relationships,
        }) => {
            relationships.forEach(relationship => {
                const {resourceId, resourceType} = relationship;
                if (resourceType === AWS_S3_BUCKET) {
                    relationship.arn = createArn({
                        service: S3,
                        resource: resourceId,
                    });
                }
            });

            const items = distributionConfig.origins?.items ?? [];

            relationships.push(
                ...items.reduce((acc, {domainName}) => {
                    if (elbDnsToResourceIdMap.has(domainName)) {
                        const {resourceType, resourceId, awsRegion} =
                            elbDnsToResourceIdMap.get(domainName);
                        acc.push(
                            createAssociatedRelationship(resourceType, {
                                resourceId,
                                awsRegion,
                            })
                        );
                    }
                    return acc;
                }, [])
            );
        },
        [AWS_CLOUDFRONT_STREAMING_DISTRIBUTION]: async ({relationships}) => {
            relationships.forEach(relationship => {
                const {resourceId, resourceType} = relationship;
                if (resourceType === AWS_S3_BUCKET) {
                    relationship.arn = createArn({
                        service: S3,
                        resource: resourceId,
                    });
                }
            });
        },
        [AWS_EC2_SECURITY_GROUP]: async ({configuration, relationships}) => {
            const {ipPermissions, ipPermissionsEgress} = configuration;
            const securityGroups = [
                ...ipPermissions,
                ...ipPermissionsEgress,
            ].reduce((acc, {userIdGroupPairs = []}) => {
                userIdGroupPairs.forEach(({groupId}) => {
                    if (groupId != null) acc.add(groupId);
                });
                return acc;
            }, new Set());

            relationships.push(
                ...Array.from(securityGroups).map(
                    createAssociatedSecurityGroupRelationship
                )
            );
        },
        [AWS_EC2_SUBNET]: async subnet => {
            const {
                relationships,
                awsRegion,
                accountId,
                configuration: {subnetId},
            } = subnet;

            subnet.subnetId = subnetId;

            const routeTableRel = relationships.find(
                x => x.resourceType === AWS_EC2_ROUTE_TABLE
            );
            if (routeTableRel != null) {
                const {resourceId, resourceType} = routeTableRel;
                const routeTableId = resourceIdentifierToIdMap.get(
                    createResourceIdKey({
                        resourceId,
                        resourceType,
                        accountId,
                        awsRegion,
                    })
                );
                const routes =
                    resourceMap.get(routeTableId)?.configuration?.routes ?? [];
                const natGateways = routes.filter(x => x.natGatewayId != null);
                subnet.private = natGateways.length === 0;
            }
        },
        [AWS_ECS_TASK]: async task => {
            const {accountId, awsRegion, configuration} = task;
            const {
                clusterArn,
                overrides,
                attachments = [],
                taskDefinitionArn,
            } = configuration;

            // running tasks can reference deregistered and/or deleted task definitions so we need to
            // provide fallback values in case the definition no longer exists
            const taskDefinition = resourceMap.get(taskDefinitionArn) ?? {
                configuration: {
                    ContainerDefinitions: [],
                    Volumes: [],
                },
            };

            task.relationships.push(
                createContainedInRelationship(AWS_ECS_CLUSTER, {
                    arn: clusterArn,
                })
            );

            const {
                taskRoleArn,
                executionRoleArn,
                containerOverrides = [],
            } = overrides;
            const roleRels = R.reject(R.isNil, [
                taskRoleArn,
                executionRoleArn,
            ]).map(arn => createAssociatedRelationship(AWS_IAM_ROLE, {arn}));

            if (R.isEmpty(roleRels)) {
                const {
                    configuration: {TaskRoleArn, ExecutionRoleArn},
                } = taskDefinition;
                R.reject(R.isNil, [TaskRoleArn, ExecutionRoleArn]).forEach(
                    arn => {
                        task.relationships.push(
                            createAssociatedRelationship(AWS_IAM_ROLE, {arn})
                        );
                    }
                );
            } else {
                task.relationships.push(...roleRels);
            }

            const groupedDefinitions = R.groupBy(
                x => x.Name,
                taskDefinition.configuration.ContainerDefinitions
            );
            const groupedOverrides = R.groupBy(x => x.name, containerOverrides);

            const environmentVariables = Object.entries(groupedDefinitions).map(
                ([key, val]) => {
                    const Environment = R.head(val)?.Environment ?? [];
                    const environment =
                        R.head(groupedOverrides[key] ?? [])?.environment ?? [];

                    const envVarObj = Environment.reduce(
                        (acc, {Name, Value}) => {
                            acc[Name] = Value;
                            return acc;
                        },
                        {}
                    );

                    const overridesObj = environment.reduce(
                        (acc, {name, value}) => {
                            acc[name] = value;
                            return acc;
                        },
                        {}
                    );

                    return {...envVarObj, ...overridesObj};
                },
                {}
            );

            environmentVariables.forEach(variables => {
                task.relationships.push(
                    ...createEnvironmentVariableRelationships(
                        {
                            resourceMap,
                            envVarResourceIdentifierToIdMap,
                            endpointToIdMap,
                        },
                        {accountId, awsRegion},
                        variables
                    )
                );
            });

            task.relationships.push(
                ...createEcsEfsRelationships(
                    taskDefinition.configuration.Volumes
                )
            );

            attachments.forEach(({details}) => {
                return details.forEach(({name, value}) => {
                    if (name === SUBNET_ID) {
                        const subnetArn = resourceIdentifierToIdMap.get(
                            createResourceIdKey({
                                resourceId: value,
                                resourceType: AWS_EC2_SUBNET,
                                accountId,
                                awsRegion,
                            })
                        );
                        const vpcId =
                            resourceMap.get(subnetArn)?.configuration?.vpcId; // we may not have discovered the subnet

                        if (vpcId != null)
                            task.relationships.push(
                                createContainedInVpcRelationship(vpcId)
                            );

                        task.relationships.push(
                            createContainedInSubnetRelationship(value)
                        );
                    } else if (name === NETWORK_INTERFACE_ID) {
                        const networkInterfaceId =
                            resourceIdentifierToIdMap.get(
                                createResourceIdKey({
                                    resourceId: value,
                                    resourceType: AWS_EC2_NETWORK_INTERFACE,
                                    accountId,
                                    awsRegion,
                                })
                            );
                        // occasionally network interface information is stale, so we need to do null checks here
                        resourceMap
                            .get(networkInterfaceId)
                            ?.relationships?.push(
                                createAttachedRelationship(AWS_ECS_TASK, {
                                    resourceId: task.resourceId,
                                })
                            );
                    }
                });
            });
        },
        [AWS_ECS_TASK_DEFINITION]: async ({
            relationships,
            accountId,
            awsRegion,
            configuration,
        }) => {
            configuration.ContainerDefinitions.forEach(({Environment = []}) => {
                const variables = Environment.reduce((acc, {Name, Value}) => {
                    acc[Name] = Value;
                    return acc;
                }, {});
                relationships.push(
                    ...createEnvironmentVariableRelationships(
                        {
                            resourceMap,
                            envVarResourceIdentifierToIdMap,
                            endpointToIdMap,
                        },
                        {accountId, awsRegion},
                        variables
                    )
                );
            });
        },
        [AWS_EKS_NODE_GROUP]: async nodeGroup => {
            const {accountId, awsRegion, relationships, configuration} =
                nodeGroup;
            const autoScalingGroups =
                configuration.resources?.autoScalingGroups ?? [];

            relationships.push(
                ...autoScalingGroups.map(({name}) => {
                    const rId = asgResourceNameToResourceIdMap.get(
                        createResourceNameKey({
                            resourceName: name,
                            accountId,
                            awsRegion,
                        })
                    );
                    return createAssociatedRelationship(
                        AWS_AUTOSCALING_AUTOSCALING_GROUP,
                        {resourceId: rId}
                    );
                })
            );
        },
        [AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER]: async ({
            relationships,
            configuration: {LoadBalancerArn, DefaultActions},
        }) => {
            const {targetGroups, cognitoUserPools} = DefaultActions.reduce(
                (
                    acc,
                    {AuthenticateCognitoConfig, TargetGroupArn, ForwardConfig}
                ) => {
                    if (AuthenticateCognitoConfig != null)
                        acc.cognitoUserPools.add(
                            AuthenticateCognitoConfig.UserPoolArn
                        );
                    if (TargetGroupArn != null)
                        acc.targetGroups.add(TargetGroupArn);
                    if (ForwardConfig != null) {
                        const {TargetGroups = []} = ForwardConfig;
                        TargetGroups.forEach(x =>
                            acc.targetGroups.add(x.TargetGroupArn)
                        );
                    }
                    return acc;
                },
                {cognitoUserPools: new Set(), targetGroups: new Set()}
            );

            relationships.push(
                createAssociatedRelationship(
                    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
                    {resourceId: LoadBalancerArn}
                ),
                ...Array.from(targetGroups.values()).map(resourceId =>
                    createAssociatedRelationship(
                        AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
                        {resourceId}
                    )
                ),
                ...Array.from(cognitoUserPools.values()).map(resourceId =>
                    createAssociatedRelationship(AWS_COGNITO_USER_POOL, {
                        resourceId,
                    })
                )
            );
        },
        [AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP]: async ({
            accountId,
            awsRegion,
            arn,
            configuration: {VpcId},
            relationships,
        }) => {
            const {credentials} = accountsMap.get(accountId);
            const elbClientV2 = awsClient.createElbV2Client(
                credentials,
                awsRegion
            );

            const {instances: asgInstances, arn: asgArn} =
                targetGroupToAsgMap.get(arn) ?? {instances: new Set()};

            const targetHealthDescriptions =
                await elbClientV2.describeTargetHealth(arn);

            //TODO: use TargetHealth to label the link as to whether it's healthy or not
            relationships.push(
                createContainedInVpcRelationship(VpcId),
                ...targetHealthDescriptions.reduce(
                    (acc, {Target: {Id}, TargetHealth}) => {
                        // We don't want to include instances from ASGs as the direct link should be to the
                        // ASG not the instances therein
                        if (Id.startsWith('i-') && !asgInstances.has(Id)) {
                            acc.push(
                                createAssociatedRelationship(AWS_EC2_INSTANCE, {
                                    resourceId: Id,
                                })
                            );
                        } else if (Id.startsWith('arn:')) {
                            acc.push(
                                createArnRelationship(IS_ASSOCIATED_WITH, Id)
                            );
                        }
                        return acc;
                    },
                    []
                )
            );

            if (asgArn != null) {
                relationships.push(
                    createAssociatedRelationship(
                        AWS_AUTOSCALING_AUTOSCALING_GROUP,
                        {resourceId: asgArn}
                    )
                );
            }
        },
        [AWS_GLUE_TABLE]: async ({accountId, awsRegion, configuration, relationships, resourceType}) => {
            if (configuration.TargetTable != null) {
                const {
                    CatalogId = accountId,
                    Region = awsRegion,
                    Name,
                    DatabaseName,
                } = configuration.TargetTable;

                const resourceId = `${DatabaseName}/${Name}`

                relationships.push(createArnRelationship(
                    IS_ASSOCIATED_WITH,
                    createArnWithResourceType({
                        resourceType, accountId: CatalogId, awsRegion: Region, resourceId,
                    }),
                ));
            }
        },
        [AWS_EVENT_EVENT_BUS]: async ({arn, relationships}) => {
            relationships.push(
                ...eventBusRuleMap
                    .get(arn)
                    .map(createArnRelationship(IS_ASSOCIATED_WITH))
            );
        },
        [AWS_IAM_ROLE]: async ({
            configuration: {attachedManagedPolicies},
            relationships,
        }) => {
            relationships.push(
                ...createManagedPolicyRelationships(
                    resourceMap,
                    attachedManagedPolicies
                )
            );
        },
        [AWS_IAM_INLINE_POLICY]: ({
            configuration: {policyDocument},
            relationships,
        }) => {
            const statement = Array.isArray(policyDocument.Statement)
                ? policyDocument.Statement
                : [policyDocument.Statement];

            relationships.push(
                ...statement.flatMap(({Resource = []}) => {
                    // the Resource field, if it exists, can be an array or string
                    const resources = Array.isArray(Resource)
                        ? Resource
                        : [Resource];
                    return resources.reduce((acc, resourceArn) => {
                        // Remove the trailing /* from ARNs to increase chance of finding
                        // a relationship, especially for S3 buckets. This will lead to
                        // duplicates, but they get deduped later on in the discovery
                        // process
                        const resource = resourceMap.get(
                            resourceArn.replace(/\/?\*$/, '')
                        );
                        if (resource != null) {
                            acc.push(
                                createAttachedRelationship(
                                    resource.resourceType,
                                    {
                                        arn: resource.arn,
                                    }
                                )
                            );
                        }
                        return acc;
                    }, []);
                })
            );
        },
        [AWS_IAM_USER]: ({
            configuration: {attachedManagedPolicies},
            relationships,
        }) => {
            relationships.push(
                ...createManagedPolicyRelationships(
                    resourceMap,
                    attachedManagedPolicies
                )
            );
        },
        [AWS_EC2_NETWORK_INTERFACE]: async eni => {
            const {accountId, awsRegion, relationships, configuration} = eni;
            const {interfaceType, description, requesterId} = configuration;

            const relationship = createEniRelationship({
                awsRegion,
                accountId,
                interfaceType,
                description,
                requesterId,
            });
            if (relationship.resourceId !== UNKNOWN) {
                relationships.push(relationship);
            }
        },
        [AWS_RDS_DB_INSTANCE]: async db => {
            const {dBSubnetGroup, availabilityZone} = db.configuration;

            if (dBSubnetGroup != null) {
                const {subnetIdentifier} = R.find(
                    ({subnetAvailabilityZone}) =>
                        subnetAvailabilityZone.name === availabilityZone,
                    dBSubnetGroup.subnets
                );

                db.relationships.push(
                    ...[
                        createContainedInVpcRelationship(dBSubnetGroup.vpcId),
                        createContainedInSubnetRelationship(subnetIdentifier),
                    ]
                );
            }
        },
        [AWS_EC2_ROUTE_TABLE]: async ({
            configuration: {routes},
            relationships,
        }) => {
            relationships.push(
                ...routes.reduce((acc, {natGatewayId, gatewayId}) => {
                    if (natGatewayId != null) {
                        acc.push(
                            createContainsRelationship(AWS_EC2_NAT_GATEWAY, {
                                resourceId: natGatewayId,
                            })
                        );
                    } else if (R.test(/vpce-[0-9a-fA-F]+/, gatewayId)) {
                        acc.push(
                            createContainsRelationship(AWS_EC2_VPC_ENDPOINT, {
                                resourceId: gatewayId,
                            })
                        );
                    } else if (R.test(/igw-[0-9a-fA-F]+/, gatewayId)) {
                        acc.push(
                            createContainsRelationship(
                                AWS_EC2_INTERNET_GATEWAY,
                                {resourceId: gatewayId}
                            )
                        );
                    }
                    return acc;
                }, [])
            );
        },
        [AWS_GLUE_CONNECTION]: async connection => {
            const host = R.match(
                /jdbc:.*?:\/\/(?<host>[^:\/]+)/,
                connection.configuration.ConnectionProperties?.JDBC_CONNECTION_URL ?? '',
            ).groups?.host;

            if (host != null && endpointToIdMap.has(host)) {
                connection.relationships.push(createArnRelationship(
                    IS_ASSOCIATED_WITH,
                    endpointToIdMap.get(host),
                ));
            }
        },
        [AWS_GLUE_DATABASE]: async ({accountId, awsRegion, configuration, relationships, resourceType}) => {
            if (configuration.TargetDatabase != null) {
                const {
                    CatalogId = accountId,
                    Region = awsRegion,
                    DatabaseName,
                } = configuration.TargetDatabase;

                relationships.push(createArnRelationship(
                    IS_ASSOCIATED_WITH,
                    createArnWithResourceType({
                        resourceType, accountId: CatalogId, awsRegion: Region, resourceId: DatabaseName,
                    }),
                ));
            }
        },
    };
}

async function addIndividualRelationships(lookUpMaps, awsClient, resources) {
    const handlers = createIndividualHandlers(lookUpMaps, awsClient);
    const schemaHandlers = createSchemaHandlers(awsClient, lookUpMaps);

    const {errors} = await PromisePool.withConcurrency(30)
        .for(resources)
        .process(async resource => {
            const handler = handlers[resource.resourceType];
            const schemaHandler = schemaHandlers[resource.resourceType];

            if (schemaHandler != null) await schemaHandler(resource);
            if (handler != null) await handler(resource);
        });

    logger.error(
        `There were ${errors.length} errors when adding additional relationships.`
    );
    logger.debug('Errors: ', {errors});
}

export default addIndividualRelationships;
