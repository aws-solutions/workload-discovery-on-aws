// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import {
    AWS_API_GATEWAY_METHOD,
    AWS_DYNAMODB_TABLE,
    AWS_EC2_NETWORK_INTERFACE,
    AWS_EC2_VPC,
    AWS_ECS_CLUSTER,
    AWS_ECS_SERVICE,
    AWS_ECS_TASK,
    AWS_ECS_TASK_DEFINITION,
    AWS_ELASTICSEARCH_DOMAIN,
    AWS_LAMBDA_FUNCTION,
    AWS_IAM_ROLE,
    AWS_IAM_USER,
    IS_ASSOCIATED_WITH,
    IS_ATTACHED_TO,
    IS_CONTAINED_IN,
    AWS_CODEBUILD_PROJECT,
    AWS_EC2_LAUNCH_TEMPLATE,
    AWS_EC2_NAT_GATEWAY,
    AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER,
    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_EC2_ROUTE_TABLE,
    AWS_EC2_SUBNET,
    AWS_EC2_SECURITY_GROUP,
    AWS_EC2_TRANSIT_GATEWAY,
    AWS_EC2_TRANSIT_GATEWAY_ATTACHMENT,
    AWS_EC2_TRANSIT_GATEWAY_ROUTE_TABLE,
    CONTAINS,
    AWS_EC2_INTERNET_GATEWAY,
    AWS_EC2_VPC_ENDPOINT,
    AWS_RDS_DB_INSTANCE,
    AWS_EFS_ACCESS_POINT,
    AWS_KINESIS_STREAM,
    AWS_EC2_INSTANCE,
    AWS_CLOUDFRONT_DISTRIBUTION,
    AWS_CLOUDFRONT_STREAMING_DISTRIBUTION,
    AWS_EKS_CLUSTER,
    AWS_EKS_NODE_GROUP,
    AWS_AUTOSCALING_AUTOSCALING_GROUP,
    AWS_AUTOSCALING_WARM_POOL,
    AWS_EFS_FILE_SYSTEM,
    AWS_IAM_AWS_MANAGED_POLICY,
    AWS_S3_BUCKET,
    AWS_OPENSEARCH_DOMAIN,
    AWS_RDS_DB_CLUSTER,
    AWS_REDSHIFT_CLUSTER,
    SUBNET,
    VPC,
    AWS_EC2_SPOT_FLEET,
    AWS_COGNITO_USER_POOL,
    AWS_MSK_CLUSTER,
    AWS_SNS_TOPIC,
    AWS_SQS_QUEUE,
    SECURITY_GROUP,
    AWS_IAM_INLINE_POLICY,
    MULTIPLE_AVAILABILITY_ZONES,
    AWS_EVENT_EVENT_BUS,
    AWS_EVENT_RULE,
    AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION,
    AWS_IAM_INSTANCE_PROFILE,
    AWS_APPSYNC_DATASOURCE,
    AWS_MEDIA_CONNECT_FLOW_ENTITLEMENT,
    AWS_MEDIA_CONNECT_FLOW_SOURCE,
    AWS_MEDIA_CONNECT_FLOW_VPC_INTERFACE,
    AWS_MEDIA_PACKAGE_PACKAGING_CONFIGURATION,
    AWS_MEDIA_PACKAGE_PACKAGING_GROUP,
    NETWORK_INTERFACE,
} from '../src/lib/constants.mjs';
import {generate} from './generator.mjs';
import * as additionalRelationships from '../src/lib/additionalRelationships/index.mjs';

const ROLE = 'Role';
const INSTANCE = 'Instance';

describe('additionalRelationships', () => {

    const credentials = {accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};

    const defaultMockAwsClient = {
        createAppSyncClient() {
            return {
                listDataSources: async apiId => [],
            }
        },
        createLambdaClient() {
            return {
                getAllFunctions: async arn => [],
                listEventSourceMappings: async arn => []
            }
        },
        createEcsClient() {
            return {
                getAllClusterInstances: async arn => []
            }
        },
        createEksClient() {
            return {
                getAllNodeGroups: async arn => []
            }
        },
        createElbClient() {
            return {
                getLoadBalancerInstances: async resourceId => []
            }
        },
        createElbV2Client() {
            return {
                describeTargetHealth: async arn => []
            }
        },
        createSnsClient() {
            return {
                getAllSubscriptions: async () => []
            }
        },
        createEc2Client() {
            return {
                getAllTransitGatewayAttachments: async  () => []
            }
        }
    };

    describe('addAdditionalRelationships', () => {
        const addAdditionalRelationships = additionalRelationships.addAdditionalRelationships(new Map(
            [[
                'xxxxxxxxxxxx',
                {
                    credentials,
                    regions: [
                        'eu-west-2',
                        'us-east-1',
                        'us-east-2'
                    ]
                }
            ]]
        ));

        describe(AWS_API_GATEWAY_METHOD, () => {

            it('should ignore non-lambda relationships', async () => {
                const {default: schema} = await import('./fixtures/relationships/apigateway/method/noLambda.json', {with: {type: 'json' }});
                const {method} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [method]);
                const {relationships} = rels.find(r => r.resourceId === method.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should handle no method integration', async () => {
                const {default: schema} = await import('./fixtures/relationships/apigateway/method/noMethodIntegration.json', {with: {type: 'json' }});
                const {method} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [method]);
                const {relationships} = rels.find(r => r.resourceId === method.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should handle no method integration uri', async () => {
                const {default: schema} = await import('./fixtures/relationships/apigateway/method/noMethodIntegrationUri.json', {with: {type: 'json' }});
                const {method} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [method]);
                const {relationships} = rels.find(r => r.resourceId === method.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add relationships for lambdas', async () => {
                const {default: schema} = await import('./fixtures/relationships/apigateway/method/lambda.json', {with: {type: 'json' }});
                const {lambda, method} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [lambda, method]);
                const {relationships} = rels.find(r => r.resourceId === method.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        arn: lambda.arn,
                        resourceType: AWS_LAMBDA_FUNCTION
                    }
                ]);
            });

        });

        describe(AWS_AUTOSCALING_AUTOSCALING_GROUP, () => {

            it('should add launch configuration relationship', async () => {
                const {default: schema} = await import('./fixtures/relationships/asg/launchTemplate.json', {with: {type: 'json' }});
                const {asg, subnet, launchTemplate} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet, asg]);

                const {relationships} = rels.find(r => r.resourceId === asg.resourceId);
                const actualLaunchTemplateRel = relationships.find(x => x.resourceId === launchTemplate.resourceId);

                assert.deepEqual(actualLaunchTemplateRel, {
                    resourceId: launchTemplate.resourceId,
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceType: AWS_EC2_LAUNCH_TEMPLATE
                });
            });

            it('should add networking relationship', async () => {
                const {default: schema} = await import('./fixtures/relationships/asg/networking.json', {with: {type: 'json' }});
                const {vpc, asg, subnet1, subnet2} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet1, subnet2, asg]);

                const actualAsg = rels.find(r => r.resourceId === asg.resourceId);
                const actualVpcRel = actualAsg.relationships.find(x => x.resourceId === vpc.resourceId);

                assert.strictEqual(actualAsg.vpcId, vpc.resourceId);
                assert.strictEqual(actualAsg.availabilityZone, 'eu-west-2a,eu-west-2b');

                assert.deepEqual(actualVpcRel, {
                    resourceId: vpc.resourceId,
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceType: AWS_EC2_VPC
                });
            });

            it('should handle networking relationship when subnet has not been ingested', async () => {
                const {default: schema} = await import('./fixtures/relationships/asg/networking.json', {with: {type: 'json' }});
                const {vpc, asg} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [asg]);

                const actualAsg = rels.find(r => r.resourceId === asg.resourceId);
                const actualVpcRel = actualAsg.relationships.find(x => x.resourceId === vpc.resourceId);

                assert.notExists(actualAsg.vpcId);
                assert.strictEqual(actualAsg.availabilityZone, MULTIPLE_AVAILABILITY_ZONES);

                assert.deepEqual(actualVpcRel);
            });

        });

        describe(AWS_AUTOSCALING_WARM_POOL, () => {

            it('should add relationship to autoscaling group', async () => {
                const {default: schema} = await import('./fixtures/relationships/asg/warmPool/configuration.json', {with: {type: 'json' }});
                const {warmPool, asg} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [warmPool]);

                const {relationships} = rels.find(r => r.arn === warmPool.arn);
                const actualAsgRel = relationships.find(x => x.resourceName === asg.resourceName);

                assert.deepEqual(actualAsgRel, {
                    resourceName: asg.resourceName,
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceType: AWS_AUTOSCALING_AUTOSCALING_GROUP
                });
            });

        });

        describe(AWS_CLOUDFRONT_DISTRIBUTION, () => {

            it('should add regiun for s3 buckets', async () => {
                const {default: schema} = await import('./fixtures/relationships/cloudfront/distribution/s3.json', {with: {type: 'json' }});
                const {cfDistro, s3} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [cfDistro, s3]);
                const {relationships} = rels.find(r => r.resourceId === cfDistro.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        resourceId: s3.resourceId,
                        resourceType: AWS_S3_BUCKET,
                        arn: s3.arn
                    }
                ]);
            });

            it('should add relationships to ELBs', async () => {
                const {default: schema} = await import('./fixtures/relationships/cloudfront/distribution/elb.json', {with: {type: 'json' }});
                const {cfDistro, elb} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [cfDistro, elb]);
                const {relationships} = rels.find(r => r.resourceId === cfDistro.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        resourceId: elb.resourceId,
                        resourceType: AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER,
                        awsRegion: elb.awsRegion
                    }
                ]);
            });

            it('should add relationships to ALBs/NLBs', async () => {
                const {default: schema} = await import('./fixtures/relationships/cloudfront/distribution/alb.json', {with: {type: 'json' }});
                const {cfDistro, alb} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [cfDistro, alb]);
                const {relationships} = rels.find(r => r.resourceId === cfDistro.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        resourceId: alb.resourceId,
                        resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
                        awsRegion: alb.awsRegion
                    }
                ]);
            });

        });

        describe(AWS_CLOUDFRONT_STREAMING_DISTRIBUTION, () => {

            it('should add region for s3 buckets', async () => {
                const {default: schema} = await import('./fixtures/relationships/cloudfrontStreamingDistribution/s3.json', {with: {type: 'json' }});
                const {cfStreamingDistro, s3} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [cfStreamingDistro, s3]);
                const {relationships} = rels.find(r => r.resourceId === cfStreamingDistro.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        resourceId: s3.resourceId,
                        resourceType: AWS_S3_BUCKET,
                        arn: s3.arn
                    }
                ]);
            });

        });

        describe(AWS_DYNAMODB_TABLE, () => {

            it('should add relationship from table to stream', async () => {
                const {default: schema} = await import('./fixtures/relationships/dynamodb/table.json', {with: {type: 'json' }});
                const {table} = generate(schema);
                const rels = await addAdditionalRelationships(defaultMockAwsClient, [table]);
                const actual = rels.find(r => r.resourceType === AWS_DYNAMODB_TABLE);

                assert.deepEqual(actual.relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        arn: table.configuration.latestStreamArn
                    }
                ]);
            });

        });

        describe(AWS_EC2_NETWORK_INTERFACE, () => {

            it('should add vpc information', async () => {
                const {default: schema} = await import('./fixtures/relationships/eni/vpcInfo.json', {with: {type: 'json' }});
                const {vpc, subnet, eni} = generate(schema);


                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels.find(r => r.resourceType === AWS_EC2_NETWORK_INTERFACE);

                assert.strictEqual(actual.vpcId, vpc.resourceId);
                assert.strictEqual(actual.subnetId, subnet.resourceId);
            });

            it('should add eni relationships for Opensearch clusters', async () => {
                const {default: schema} = await import('./fixtures/relationships/eni/opensearch.json', {with: {type: 'json' }});
                const {eni, opensearch} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels[0];
                const actualOpensearchRel = actual.relationships.find(r => r.arn === opensearch.arn);

                assert.deepEqual(actualOpensearchRel, {
                    relationshipName: IS_ATTACHED_TO,
                    arn: opensearch.arn
                })
            });

            it('should add eni relationships for nat gateways', async () => {
                const {default: schema} = await import('./fixtures/relationships/eni/natGateway.json', {with: {type: 'json' }});
                const {eni} = generate(schema);

                const expectedNatGatewayResourceId = 'nat-01234567890abcdef';

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels[0];
                const actualNatGatewayRel = actual.relationships.find(r => r.resourceId === expectedNatGatewayResourceId);

                assert.deepEqual(actualNatGatewayRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: expectedNatGatewayResourceId,
                    resourceType: AWS_EC2_NAT_GATEWAY
                })
            });


            it('should add eni relationships for vpc endpoints', async () => {
                const {default: schema} = await import('./fixtures/relationships/eni/vpcEndpoint.json', {with: {type: 'json' }});
                const {eni, vpcEndpoint} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels.find(x => x.resourceId === eni.resourceId);
                const actualNatGatewayRel = actual.relationships.find(r => r.resourceId === vpcEndpoint.resourceId);

                assert.deepEqual(actualNatGatewayRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: vpcEndpoint.resourceId,
                    resourceType: AWS_EC2_VPC_ENDPOINT
                })
            });

            it('should add eni relationships for ALBs', async () => {
                const {default: schema} = await import('./fixtures/relationships/eni/alb.json', {with: {type: 'json' }});
                const {eni, alb} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels[0];
                const actualAlbRel = actual.relationships.find(r => r.arn === alb.arn);

                assert.deepEqual(actualAlbRel, {
                    relationshipName: IS_ATTACHED_TO,
                    arn: alb.arn
                })
            });

            it('should add eni relationships for lambda functions', async () => {
                const {default: schema} = await import('./fixtures/relationships/eni/lambda.json', {with: {type: 'json' }});
                const {eni} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels[0];

                const expectedLambdaResourceId = 'testLambda';

                const actualLambdaRel = actual.relationships.find(r => r.resourceId === expectedLambdaResourceId);

                assert.deepEqual(actualLambdaRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: expectedLambdaResourceId,
                    resourceType: AWS_LAMBDA_FUNCTION
                })
            });

        });

        describe(AWS_EC2_ROUTE_TABLE, () => {

            it('should ni relationships for vpc endpoints, nat gateways and Internet gateways', async () => {
                const {default: schema} = await import('./fixtures/relationships/routeTable/allRelationships.json', {with: {type: 'json' }});
                const {routeTable} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [routeTable]);

                const {relationships} = rels[0];

                assert.deepEqual(relationships[0], {
                    relationshipName: CONTAINS,
                    resourceId: routeTable.configuration.routes[0].gatewayId,
                    resourceType: AWS_EC2_INTERNET_GATEWAY
                });

                assert.deepEqual(relationships[1], {
                    relationshipName: CONTAINS,
                    resourceId: routeTable.configuration.routes[1].gatewayId,
                    resourceType: AWS_EC2_VPC_ENDPOINT
                });

                assert.deepEqual(relationships[2], {
                    relationshipName: CONTAINS,
                    resourceId: routeTable.configuration.routes[2].natGatewayId,
                    resourceType: AWS_EC2_NAT_GATEWAY
                });

            });

        });

        describe(AWS_EC2_SECURITY_GROUP, () => {

            it('should add relationships for security group in ingress', async () => {
                const {default: schema} = await import('./fixtures/relationships/securityGroup/ingress.json', {with: {type: 'json' }});
                const {inSecurityGroup1, inSecurityGroup2, securityGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [securityGroup]);
                const {relationships} = rels.find(r => r.resourceId === securityGroup.resourceId);

                assert.deepEqual(relationships, [
                    {
                        resourceId: inSecurityGroup1.resourceId,
                        relationshipName: IS_ASSOCIATED_WITH  + SECURITY_GROUP,
                        resourceType: AWS_EC2_SECURITY_GROUP
                    }, {
                        resourceId: inSecurityGroup2.resourceId,
                        relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                        resourceType: AWS_EC2_SECURITY_GROUP
                    }
                ]);
            });

            it('should add relationships for security group in egress', async () => {
                const {default: schema} = await import('./fixtures/relationships/securityGroup/egress.json', {with: {type: 'json' }});
                const {outSecurityGroup1, outSecurityGroup2, securityGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [securityGroup]);
                const {relationships} = rels.find(r => r.resourceId === securityGroup.resourceId);

                assert.deepEqual(relationships, [
                    {
                        resourceId: outSecurityGroup1.resourceId,
                        relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                        resourceType: AWS_EC2_SECURITY_GROUP
                    }, {
                        resourceId: outSecurityGroup2.resourceId,
                        relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                        resourceType: AWS_EC2_SECURITY_GROUP
                    }
                ]);
            });

        });

        describe(AWS_EC2_SUBNET, () => {

            it('should add vpc information', async () => {
                const {default: schema} = await import('./fixtures/relationships/subnet/vpcInfo.json', {with: {type: 'json' }});
                const {subnet, vpc, routeTable} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet, routeTable]);
                const actualSubnet = rels.find(x => x.resourceId === subnet.resourceId);

                assert.strictEqual(actualSubnet.vpcId, vpc.resourceId);
                assert.strictEqual(actualSubnet.subnetId, subnet.resourceId);
            });

            it('should identify public subnets', async () => {
                const {default: schema} = await import('./fixtures/relationships/subnet/public.json', {with: {type: 'json' }});
                const {subnet, routeTable} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet, routeTable]);
                const actualSubnet = rels.find(x => x.resourceId === subnet.resourceId);

                assert.strictEqual(actualSubnet.private, false);
            });

            it('should identify private subnets', async () => {
                const {default: schema} = await import('./fixtures/relationships/subnet/private.json', {with: {type: 'json' }});
                const {subnet, routeTable} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet, routeTable]);
                const actualSubnet = rels.find(x => x.resourceId === subnet.resourceId);

                assert.strictEqual(actualSubnet.private, true);
            });

        });

        describe(AWS_EC2_TRANSIT_GATEWAY, () => {

            it('should add relationships to routetables', async () => {
                const {default: schema} = await import('./fixtures/relationships/transitgateway/routetables.json', {with: {type: 'json' }});
                const {tgw, tgwRouteTable1, tgwRouteTable2} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [tgw]);

                const {relationships} = rels.find(x => x.resourceId === tgw.resourceId);

                const actualTgwRouteTableRel1 = relationships.find(x => x.resourceId === tgwRouteTable1.resourceId);
                const actualTgwRouteTableRel2 = relationships.find(x => x.resourceId === tgwRouteTable2.resourceId);

                assert.deepEqual(actualTgwRouteTableRel1, {
                    relationshipName: IS_CONTAINED_IN,
                    resourceId: tgwRouteTable1.resourceId,
                    resourceType: AWS_EC2_TRANSIT_GATEWAY_ROUTE_TABLE
                });

                assert.deepEqual(actualTgwRouteTableRel2, {
                    relationshipName: IS_CONTAINED_IN,
                    resourceId: tgwRouteTable2.resourceId,
                    resourceType: AWS_EC2_TRANSIT_GATEWAY_ROUTE_TABLE
                });
            });

        });

        describe(AWS_EC2_TRANSIT_GATEWAY_ATTACHMENT, () => {
            const accountIdX = 'xxxxxxxxxxxx';
            const accountIdZ = 'zzzzzzzzzzzz';
            const euWest2 = 'eu-west-2';

            const addAdditionalRelationships = additionalRelationships.addAdditionalRelationships(new Map(
                [[
                    accountIdX,
                    {
                        credentials,
                        regions: [
                            'eu-west-2'
                        ]
                    }
                ], [
                    accountIdZ,
                    {
                        credentials,
                        regions: [
                            'eu-west-2'
                        ]
                    }
                ]]
            ));

            it('should add vpc relationships to transit gateway attachments', async () => {
                const {default: schema} = await import('./fixtures/relationships/transitgateway/attachments/vpc.json', {with: {type: 'json' }});
                const {vpc, subnet1, subnet2, subnet3, tgw, tgwAttachment, tgwAttachmentApi} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createEc2Client(credentials, region) {
                        return {
                            getAllTransitGatewayAttachments: async arn => {
                                return credentials[0] = 'zzzzzzzzzzzz' && region === tgwAttachment.awsRegion ? [
                                    tgwAttachmentApi
                                ] : []
                            }
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [tgwAttachment]);

                const {relationships} = rels.find(x => x.resourceId === tgwAttachment.resourceId);

                const actualTgwRel = relationships.find(x => x.resourceId === tgw.resourceId);
                const actualVpcRel = relationships.find(x => x.resourceId === vpc.resourceId);
                const actualSubnet1Rel = relationships.find(x => x.resourceId === subnet1.resourceId);
                const actualSubnet2Rel = relationships.find(x => x.resourceId === subnet2.resourceId);
                const actualSubnet3Rel = relationships.find(x => x.resourceId === subnet3.resourceId);

                assert.deepEqual(actualTgwRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: tgw.resourceId,
                    resourceType: AWS_EC2_TRANSIT_GATEWAY,
                    awsRegion: euWest2,
                    accountId: accountIdX
                });

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_ASSOCIATED_WITH + `${VPC}`,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC,
                    awsRegion: euWest2,
                    accountId: accountIdZ
                });

                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_ASSOCIATED_WITH + 'Subnet',
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET,
                    awsRegion: euWest2,
                    accountId: accountIdZ
                });

                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_ASSOCIATED_WITH + 'Subnet',
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET,
                    awsRegion: euWest2,
                    accountId: accountIdZ
                });

                assert.deepEqual(actualSubnet3Rel, {
                    relationshipName: IS_ASSOCIATED_WITH + 'Subnet',
                    resourceId: subnet3.resourceId,
                    resourceType: AWS_EC2_SUBNET,
                    awsRegion: euWest2,
                    accountId: accountIdZ
                });

            });

        });

        describe(AWS_EVENT_EVENT_BUS, () => {

            it('should add relationships for event bus rules', async () => {
                const {default: schema} = await import('./fixtures/relationships/events/eventBus/bus.json', {with: {type: 'json' }});
                const {eventBus1, eventBus2, eventRule1, eventRule2} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eventBus1, eventBus2, eventRule1, eventRule2]);
                const {relationships: eventBus1Rel} = rels.find(r => r.arn === eventBus1.arn);
                const {relationships: eventBus2Rel} = rels.find(r => r.arn === eventBus2.arn);

                assert.deepEqual(eventBus1Rel, [
                    {
                        arn: 'eventRuleArn1',
                        relationshipName: IS_ASSOCIATED_WITH,
                    }
                ]);

                assert.deepEqual(eventBus2Rel, [
                    {
                        arn: 'eventRuleArn2',
                        relationshipName: IS_ASSOCIATED_WITH,
                    }
                ]);
            });
        });

        describe(AWS_EVENT_RULE, () => {

            it('should add relationships for event bus rules', async () => {
                const {default: schema} = await import('./fixtures/relationships/events/rule/rules.json', {with: {type: 'json' }});
                const {eventRule1, eventRule2} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eventRule1, eventRule2]);
                const {relationships: eventRule1Rel} = rels.find(r => r.arn === eventRule1.arn);
                const {relationships: eventRule2Rel} = rels.find(r => r.arn === eventRule2.arn);

                const ruleTarget1Rel = eventRule1Rel.find(r => r.arn === 'ruleTargetArn1');
                const ruleTarget1RoleRel = eventRule1Rel.find(r => r.arn === 'roleArn1');
                const ruleTarget2Rel = eventRule2Rel.find(r => r.arn === 'clusterArn');
                const ruleTaskTarget2Rel = eventRule2Rel.find(r => r.arn === 'taskDefinitionArn');
                const ruleTarget2RoleRel = eventRule2Rel.find(r => r.arn === 'roleArn2');

                assert.deepEqual(ruleTarget1Rel, {
                    arn: 'ruleTargetArn1',
                    relationshipName: IS_ASSOCIATED_WITH,
                });

                assert.deepEqual(ruleTarget1RoleRel, {
                    arn: 'roleArn1',
                    relationshipName: IS_ASSOCIATED_WITH + ROLE
                });

                assert.deepEqual(ruleTarget2Rel, {
                    arn: 'clusterArn',
                    relationshipName: IS_ASSOCIATED_WITH,
                });

                assert.deepEqual(ruleTaskTarget2Rel, {
                    arn: 'taskDefinitionArn',
                    relationshipName: IS_ASSOCIATED_WITH,
                });

                assert.deepEqual(ruleTarget2RoleRel, {
                    arn: 'roleArn2',
                    relationshipName: IS_ASSOCIATED_WITH + ROLE
                });
            });
        })

        describe(AWS_LAMBDA_FUNCTION, () => {

            it('should not add additional relationships for Lambda functions with no vpc', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/noVpc.json', {with: {type: 'json' }});
                const {lambda} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [lambda]);

                const actual = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);

                assert.deepEqual(actual.relationships, []);
            });

            it('should add all relationships contained in lambda configuration field', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/configuration.json', {with: {type: 'json' }});
                const {lambda} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [lambda]);

                const {relationships} = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);

                const actualDlq = relationships.find(r => r.arn === lambda.configuration.deadLetterConfig.targetArn);
                const actualKms = relationships.find(r => r.arn === lambda.configuration.kmsKeyArn);

                assert.deepEqual(actualDlq, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: lambda.configuration.deadLetterConfig.targetArn
                });
                assert.deepEqual(actualKms, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: lambda.configuration.kmsKeyArn
                });
            });

            it('should add VPC relationships for Lambda functions', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/vpc.json', {with: {type: 'json' }});
                const {vpc, subnet1, subnet2, lambda} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet1, subnet2, lambda]);

                const actual = rels.find(r => r.resourceId === lambda.resourceId);
                const actualVpcRel = actual.relationships.find(r => r.resourceId === vpc.resourceId);
                const actualSubnet1Rel = actual.relationships.find(r => r.resourceId === subnet1.resourceId);
                const actualSubnet2Rel = actual.relationships.find(r => r.resourceId === subnet2.resourceId);

                assert.strictEqual(actual.availabilityZone, `${subnet1.availabilityZone},${subnet2.availabilityZone}`);

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
            });

            it('should handle VPC relationships for Lambda functions when subnets have not been ingested', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/vpc.json', {with: {type: 'json' }});
                const {vpc, lambda} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [lambda]);

                const actual = rels.find(r => r.resourceId === lambda.resourceId);
                const actualVpcRel = actual.relationships.find(r => r.resourceId === vpc.resourceId);

                assert.strictEqual(actual.availabilityZone, 'Not Applicable');

                assert.notExists(actualVpcRel);
            });

            it('should add VPC relationships for Lambda functions with efs', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/efs.json', {with: {type: 'json' }});
                const {subnet1, subnet2, lambda, efs1, efs2} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet1, subnet2, lambda, efs1, efs2]);

                const actual = rels.find(r => r.resourceId === lambda.resourceId);
                const actualEfsRel1 = actual.relationships.find(r => r.arn === efs1.arn);
                const actualEfsRel2 = actual.relationships.find(r => r.arn === efs2.arn);

                assert.deepEqual(actualEfsRel1, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: efs1.arn
                });
                assert.deepEqual(actualEfsRel2, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: efs2.arn
                });
            });

            it('should return additional relationships for Lambda functions with event mappings', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/eventMappings.json', {with: {type: 'json' }});
                const {lambda, kinesis} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createLambdaClient(_, region) {
                        return {
                            getAllFunctions: async arn => [],
                            listEventSourceMappings: async arn => {
                                return region === lambda.awsRegion ? [{
                                    EventSourceArn: kinesis.arn, FunctionArn: lambda.arn
                                }] : []
                            }
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [lambda, kinesis]);

                const actual = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);

                assert.deepEqual(actual.relationships, [{
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: kinesis.arn,
                    resourceType: AWS_KINESIS_STREAM
                }]);
            });

            it('should handle errors when encrypted environment variables are present', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/encryptedEnvVar.json', {with: {type: 'json' }});
                const {lambda} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createLambdaClient(_, region) {
                        return {
                            getAllFunctions: async arn => {
                                if(region === lambda.awsRegion) {
                                    return [{
                                        FunctionArn: lambda.arn,
                                        Environment: {
                                            Error: {
                                                ErrorCode: 'AccessDeniedException',
                                                Message: 'Error'
                                            }
                                        }
                                    }]
                                }
                                return [];
                            },
                            listEventSourceMappings: async arn => []
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [lambda]);

                const {relationships} = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);

                assert.lengthOf(relationships, 0);
            });

            it('should handle when Environment field is set to null', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/envVar.json', {with: {type: 'json' }});
                const {resourceIdResource, resourceNameResource, arnResource, lambda} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createLambdaClient(_, region) {
                        return {
                            getAllFunctions: async arn => {
                                if(region === lambda.awsRegion) {
                                    return [{
                                        FunctionArn: lambda.arn,
                                        Environment: {
                                            Variables: {
                                                resourceIdVar: resourceIdResource.resourceId,
                                                resourceNameVar: resourceNameResource.resourceName,
                                                arnVar: arnResource.arn
                                            }
                                        }
                                    }, {
                                        FunctionArn: lambda.arn,
                                        Environment: null
                                    }
                                    ]
                                }
                                return [];
                            },
                            listEventSourceMappings: async arn => []
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [resourceIdResource, resourceNameResource, arnResource, lambda]);

                const {relationships} = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);
                const actualResourceIdResourceRel = relationships.find(r => r.arn === resourceIdResource.arn);
                const actualResourceNameResourceRel = relationships.find(r => r.arn === resourceNameResource.arn);
                const actualArnResourceRel = relationships.find(r => r.arn === arnResource.arn);

                assert.deepEqual(actualResourceIdResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: resourceIdResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
                assert.deepEqual(actualResourceNameResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: resourceNameResource.arn,
                    resourceType: AWS_IAM_ROLE
                });
                assert.deepEqual(actualArnResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: arnResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
            });

            it('should return additional non-db relationships for Lambda functions with environment variables', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/envVar.json', {with: {type: 'json' }});
                const {resourceIdResource, resourceNameResource, arnResource, lambda} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createLambdaClient(_, region) {
                        return {
                            getAllFunctions: async arn => {
                                if(region === lambda.awsRegion) {
                                    return [{
                                        FunctionArn: lambda.arn,
                                        Environment: {
                                            Variables: {
                                                resourceIdVar: resourceIdResource.resourceId,
                                                resourceNameVar: resourceNameResource.resourceName,
                                                arnVar: arnResource.arn
                                            }
                                        }
                                    }]
                                }
                                return [];
                            },
                            listEventSourceMappings: async arn => []
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [resourceIdResource, resourceNameResource, arnResource, lambda]);

                const {relationships} = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);
                const actualResourceIdResourceRel = relationships.find(r => r.arn === resourceIdResource.arn);
                const actualResourceNameResourceRel = relationships.find(r => r.arn === resourceNameResource.arn);
                const actualArnResourceRel = relationships.find(r => r.arn === arnResource.arn);

                assert.deepEqual(actualResourceIdResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: resourceIdResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
                assert.deepEqual(actualResourceNameResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: resourceNameResource.arn,
                    resourceType: AWS_IAM_ROLE
                });
                assert.deepEqual(actualArnResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: arnResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
            });

            it('should return additional db relationships for Lambda functions with environment variables', async () => {
                const {default: schema} = await import('./fixtures/relationships/lambda/dbEnvVar.json', {with: {type: 'json' }});
                const {elasticsearch, opensearch, rdsCluster, rdsInstance, redshiftCluster, lambda} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createLambdaClient(_, region) {
                        return {
                            getAllFunctions: async arn => {
                                if(region === lambda.awsRegion) {
                                    return [{
                                        FunctionArn: lambda.arn,
                                        Environment: {
                                            Variables: {
                                                elasticsearchVar: elasticsearch.configuration.endpoints.vpc,
                                                opensearchVar: opensearch.configuration.Endpoints.vpc,
                                                rdsClusterVar: rdsCluster.configuration.endpoint.value,
                                                rdsInstanceVar: rdsInstance.configuration.endpoint.address,
                                                redshiftClusterVar: redshiftCluster.configuration.endpoint.address
                                            }
                                        }
                                    }]
                                }
                                return [];
                            },
                            listEventSourceMappings: async arn => []
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [
                    elasticsearch, opensearch, rdsCluster, rdsInstance, redshiftCluster, lambda
                ]);

                const {relationships} = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);
                const actualElasticsearchResourceRel = relationships.find(r => r.arn === elasticsearch.arn);
                const actualOpensearchResourceRel = relationships.find(r => r.arn === opensearch.arn);
                const actualRdsClusterRel = relationships.find(r => r.arn === rdsCluster.arn);
                const actualRdsInstanceRel = relationships.find(r => r.arn === rdsInstance.arn);
                const actualRedshiftClusterRel = relationships.find(r => r.arn === redshiftCluster.arn);

                assert.deepEqual(actualElasticsearchResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: elasticsearch.arn,
                    resourceType: AWS_ELASTICSEARCH_DOMAIN
                });
                assert.deepEqual(actualOpensearchResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: opensearch.arn,
                    resourceType: AWS_OPENSEARCH_DOMAIN
                });
                assert.deepEqual(actualRdsClusterRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: rdsCluster.arn,
                    resourceType: AWS_RDS_DB_CLUSTER
                });
                assert.deepEqual(actualRdsInstanceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: rdsInstance.arn,
                    resourceType: AWS_RDS_DB_INSTANCE
                });
                assert.deepEqual(actualRedshiftClusterRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: redshiftCluster.arn,
                    resourceType: AWS_REDSHIFT_CLUSTER
                });
            });

        });

        describe(AWS_ECS_CLUSTER, () => {

            it('should not add relationships between cluster and ec2 instances when none are present', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/cluster/noInstances.json', {with: {type: 'json' }});
                const {ecsCluster} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [ecsCluster]);
                const {relationships} = rels.find(r => r.resourceId === ecsCluster.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add all relationships contained in cluster configuration field', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/cluster/configuration.json', {with: {type: 'json' }});
                const {ecsCluster} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [ecsCluster]);
                const {relationships} = rels.find(r => r.resourceId === ecsCluster.resourceId);

                const actualS3LogBucket = relationships.find(rel => rel.resourceType === AWS_S3_BUCKET);

                assert.deepEqual(actualS3LogBucket, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceType: AWS_S3_BUCKET,
                    resourceId: ecsCluster.configuration.LogConfiguration.S3BucketName
                });
            });

            it('should add relationships between cluster and ec2 instances if present', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/cluster/instances.json', {with: {type: 'json' }});
                const {ec2Instance1, ec2Instance2, ecsCluster} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createEcsClient() {
                        return {
                            getAllClusterInstances: async arn => [ec2Instance1.resourceId, ec2Instance2.resourceId]
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [ecsCluster]);
                const {relationships} = rels.find(r => r.resourceId === ecsCluster.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: CONTAINS + INSTANCE,
                        resourceId: ec2Instance1.resourceId,
                        resourceType: AWS_EC2_INSTANCE
                    }, {
                        relationshipName: CONTAINS + INSTANCE,
                        resourceId: ec2Instance2.resourceId,
                        resourceType: AWS_EC2_INSTANCE
                    }
                ]);
            });

        });

        describe(AWS_ECS_SERVICE, () => {

            it('should add cluster, role and task definition relationships ECS service', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/service/noVpc.json', {with: {type: 'json' }});
                const {ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition]);

                const {relationships} = rels.find(r => r.arn === ecsService.arn);

                const actualClusterRel = relationships.find(r => r.arn === ecsCluster.arn);
                const actualIamRoleRel = relationships.find(r => r.arn === ecsServiceRole.arn);
                const actualTaskRel = relationships.find(r => r.arn === ecsTaskDefinition.arn);

                assert.deepEqual(actualClusterRel, {
                    relationshipName: IS_CONTAINED_IN,
                    arn: ecsCluster.arn
                });
                assert.deepEqual(actualIamRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: ecsServiceRole.arn
                });
                assert.deepEqual(actualTaskRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: ecsTaskDefinition.arn
                });
            });

            it('should add alb target groups relationships ECS service', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/service/alb.json', {with: {type: 'json' }});
                const {alb, ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition]);

                const {relationships} = rels.find(r => r.resourceId === ecsService.resourceId);

                const actualAlbTgRel = relationships.find(r => r.arn === alb.arn);

                assert.deepEqual(actualAlbTgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: alb.arn
                });
            });

            it('should add networking relationships for ECS service in vpc', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/service/vpc.json', {with: {type: 'json' }});
                const {vpc, subnet1, subnet2, securityGroup, ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    subnet1, subnet2, securityGroup, ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition
                ]);

                const {relationships, ...service} = rels.find(r => r.resourceType === AWS_ECS_SERVICE);

                const actualSubnet1Rel = relationships.find(r => r.resourceId === subnet1.resourceId);
                const actualSubnet2Rel = relationships.find(r => r.resourceId === subnet2.resourceId);
                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);
                const actualSgRel = relationships.find(r => r.resourceId === securityGroup.resourceId);

                assert.strictEqual(service.vpcId, vpc.resourceId);
                assert.strictEqual(service.availabilityZone, `${subnet1.availabilityZone},${subnet2.availabilityZone}`);

                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
                assert.deepEqual(actualSgRel, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
            });

            it('should add networking relationships for ECS service when subnets have not been discovered', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/service/vpc.json', {with: {type: 'json' }});
                const {vpc, securityGroup, ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    securityGroup, ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition
                ]);

                const {relationships, ...service} = rels.find(r => r.resourceType === AWS_ECS_SERVICE);

                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);

                assert.notExists(service.vpcId);
                assert.strictEqual(service.availabilityZone, 'Regional');

                assert.notExists(actualVpcRel);
            });

        });

        describe(AWS_ECS_TASK, () => {

            it('should not get networking relationships for tasks not using awsvpc mode', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/cluster.json', {with: {type: 'json' }});
                const {ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition
                ]);

                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);
                const actualClusterRel = relationships.find(r => r.resourceType === AWS_ECS_CLUSTER);

                assert.deepEqual(actualClusterRel, {
                    relationshipName: IS_CONTAINED_IN,
                    arn: ecsCluster.arn,
                    resourceType: AWS_ECS_CLUSTER
                });
            });

            it('should handle missing task definition', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/missingTaskDefinition.json', {with: {type: 'json' }});
                const {ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask
                ]);

                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);
                const actualClusterRel = relationships.find(r => r.resourceType === AWS_ECS_CLUSTER);

                assert.deepEqual(actualClusterRel, {
                    relationshipName: IS_CONTAINED_IN,
                    arn: ecsCluster.arn,
                    resourceType: AWS_ECS_CLUSTER
                });
            });

            it('should add IAM role relationship for ECS tasks if present', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/roles.json', {with: {type: 'json' }});
                const {
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition, ecsTask
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition, ecsTask
                ]);
                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);

                const actualTaskRoleRel = relationships.find(r => r.arn === ecsTaskRole.arn);

                const actualTaskExecutionRoleRel = relationships.find(r => r.arn === ecsTaskExecutionRole.arn);

                assert.deepEqual(actualTaskRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: ecsTaskRole.arn,
                    resourceType: AWS_IAM_ROLE
                });
                assert.deepEqual(actualTaskExecutionRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: ecsTaskExecutionRole.arn,
                    resourceType: AWS_IAM_ROLE
                });
            });

            it('should add overriden task role relationships for ECS tasks', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/roleOverrides.json', {with: {type: 'json' }});
                const {
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition, ecsTask
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition, ecsTask
                ]);
                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);

                const actualTaskRoleRel = relationships.find(r => r.arn === ecsTaskRole.arn);

                const actualTaskExecutionRoleRel = relationships.find(r => r.arn === ecsTaskExecutionRole.arn);

                assert.deepEqual(actualTaskRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: ecsTaskRole.arn,
                    resourceType: AWS_IAM_ROLE
                });
                assert.deepEqual(actualTaskExecutionRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: ecsTaskExecutionRole.arn,
                    resourceType: AWS_IAM_ROLE
                });
            });

            it('should not get networking relationships for tasks not using awsvpc mode', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/noVpc.json', {with: {type: 'json' }});
                const {ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition
                ]);

                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);

                assert.deepEqual(relationships.filter(x => ![AWS_IAM_ROLE, AWS_ECS_CLUSTER].includes(x.resourceType)), []);
            });

            it('should get networking relationships for tasks using awsvpc mode', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/vpc.json', {with: {type: 'json' }});
                const {
                    vpc, ecsCluster, ecsTaskRole, ecsTaskExecutionRole, subnet, eni, ecsTask, ecsTaskDefinition
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, subnet, eni, ecsTask, ecsTaskDefinition
                ]);

                const task = rels.find(r => r.resourceId === ecsTask.resourceId);
                const eniRel = rels.find(r => r.resourceId === eni.resourceId);

                const actualTaskVpcRel = task.relationships.find(r => r.resourceId === vpc.resourceId);
                const actualTaskSubnetRel = task.relationships.find(r => r.resourceId === subnet.resourceId);
                const actualTaskEniRel = eniRel.relationships.find(r => r.resourceId === task.resourceId);

                assert.strictEqual(task.vpcId, vpc.resourceId);
                assert.strictEqual(task.subnetId, subnet.resourceId);

                assert.deepEqual(actualTaskSubnetRel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualTaskVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
                assert.deepEqual(actualTaskEniRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: task.resourceId,
                    resourceType: AWS_ECS_TASK
                });
            });

            it('should get non-db relationships for tasks with environment variables', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/envVars.json', {with: {type: 'json' }});
                const {
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition,
                    resourceIdResource, resourceNameResource, arnResource
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition, resourceIdResource,
                    resourceNameResource, arnResource
                ]);

                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);

                const actualResourceIdResourceRel = relationships.find(r => r.arn === resourceIdResource.arn);
                const actualResourceNameResourceRel = relationships.find(r => r.arn === resourceNameResource.arn);
                const actualArnResourceRel = relationships.find(r => r.arn === arnResource.arn);

                assert.deepEqual(actualResourceIdResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: resourceIdResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
                assert.deepEqual(actualResourceNameResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: resourceNameResource.arn,
                    resourceType: AWS_IAM_ROLE
                });
                assert.deepEqual(actualArnResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: arnResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
            });

            it('should handle overridden environment variables', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/envVarOverrides.json', {with: {type: 'json' }});
                const {
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition,
                    resourceIdResource, overridenResource
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition, resourceIdResource,
                    overridenResource
                ]);

                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);

                const actualOverridenResourceResourceRel = relationships.find(r => r.arn === overridenResource.arn);

                assert.deepEqual(actualOverridenResourceResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: overridenResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
            });

            it('should get db relationships for tasks with environment variables', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/task/dbEnvVars.json', {with: {type: 'json' }});
                const {
                    ecsCluster, elasticsearch, opensearch, rdsCluster, rdsInstance, redshiftCluster,
                    ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, elasticsearch, opensearch, rdsCluster, rdsInstance, redshiftCluster,
                    ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition
                ]);

                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);
                const actualElasticsearchResourceRel = relationships.find(r => r.arn === elasticsearch.arn);
                const actualOpensearchResourceRel = relationships.find(r => r.arn === opensearch.arn);
                const actualRdsClusterRel = relationships.find(r => r.arn === rdsCluster.arn);
                const actualRdsInstanceRel = relationships.find(r => r.arn === rdsInstance.arn);
                const actualRedshiftClusterRel = relationships.find(r => r.arn === redshiftCluster.arn);

                assert.deepEqual(actualElasticsearchResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: elasticsearch.arn,
                    resourceType: AWS_ELASTICSEARCH_DOMAIN
                });
                assert.deepEqual(actualOpensearchResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: opensearch.arn,
                    resourceType: AWS_OPENSEARCH_DOMAIN
                });
                assert.deepEqual(actualRdsClusterRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: rdsCluster.arn,
                    resourceType: AWS_RDS_DB_CLUSTER
                });
                assert.deepEqual(actualRdsInstanceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: rdsInstance.arn,
                    resourceType: AWS_RDS_DB_INSTANCE
                });
                assert.deepEqual(actualRedshiftClusterRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: redshiftCluster.arn,
                    resourceType: AWS_REDSHIFT_CLUSTER
                });
            });

        });

        describe(AWS_ECS_TASK_DEFINITION, () => {

            it('should not add IAM role relationship for ECS tasks definitions when absent', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/taskDefinitions/noRoles.json', {with: {type: 'json' }});
                const {ecsTaskDefinition} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [ecsTaskDefinition]);
                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add efs file system and accesspoint relationships', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/taskDefinitions/efs.json', {with: {type: 'json' }});
                const {ecsTaskDefinition, efsAp, efsFs} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [ecsTaskDefinition]);
                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);

                const actualEfsApRel = relationships.find(r => r.resourceId === efsAp.resourceId);
                const actualEfsFsRel = relationships.find(r => r.resourceId === efsFs.resourceId);

                assert.deepEqual(actualEfsApRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceType: AWS_EFS_ACCESS_POINT,
                    resourceId: efsAp.resourceId
                });

                assert.deepEqual(actualEfsFsRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceType: AWS_EFS_FILE_SYSTEM,
                    resourceId: efsFs.resourceId
                });
            });

            it('should add IAM role relationship for ECS tasks definitions if present', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/taskDefinitions/roles.json', {with: {type: 'json' }});
                const {ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition]);
                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);

                const actualTaskRoleRel = relationships.find(r => r.arn === ecsTaskRole.arn);
                const actualTaskExecutionRoleRel = relationships.find(r => r.arn === ecsTaskExecutionRole.arn);

                assert.deepEqual(actualTaskRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: ecsTaskRole.arn
                });
                assert.deepEqual(actualTaskExecutionRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: ecsTaskExecutionRole.arn
                });
            });

            it('should get non-db relationships for tasks with environment variables', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/taskDefinitions/envVars.json', {with: {type: 'json' }});
                const {
                    ecsTaskDefinition, resourceIdResource, resourceNameResource, arnResource
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    ecsTaskDefinition, resourceIdResource, resourceNameResource, arnResource
                ]);

                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);

                const actualResourceIdResourceRel = relationships.find(r => r.arn === resourceIdResource.arn);
                const actualResourceNameResourceRel = relationships.find(r => r.arn === resourceNameResource.arn);
                const actualArnResourceRel = relationships.find(r => r.arn === arnResource.arn);

                assert.deepEqual(actualResourceIdResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: resourceIdResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
                assert.deepEqual(actualResourceNameResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: resourceNameResource.arn,
                    resourceType: AWS_IAM_ROLE
                });
                assert.deepEqual(actualArnResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: arnResource.arn,
                    resourceType: AWS_S3_BUCKET
                });
            });

            it('should get db relationships for tasks with environment variables', async () => {
                const {default: schema} = await import('./fixtures/relationships/ecs/taskDefinitions/dbEnvVars.json', {with: {type: 'json' }});
                const {
                    elasticsearch, opensearch, rdsCluster, rdsInstance, redshiftCluster, ecsTaskDefinition
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    elasticsearch, opensearch, rdsCluster, rdsInstance, redshiftCluster, ecsTaskDefinition
                ]);

                const {relationships} = rels.find(r => r.arn === ecsTaskDefinition.arn);
                const actualElasticsearchResourceRel = relationships.find(r => r.arn === elasticsearch.arn);
                const actualOpensearchResourceRel = relationships.find(r => r.arn === opensearch.arn);
                const actualRdsClusterRel = relationships.find(r => r.arn === rdsCluster.arn);
                const actualRdsInstanceRel = relationships.find(r => r.arn === rdsInstance.arn);
                const actualRedshiftClusterRel = relationships.find(r => r.arn === redshiftCluster.arn);

                assert.deepEqual(actualElasticsearchResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: elasticsearch.arn,
                    resourceType: AWS_ELASTICSEARCH_DOMAIN
                });
                assert.deepEqual(actualOpensearchResourceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: opensearch.arn,
                    resourceType: AWS_OPENSEARCH_DOMAIN
                });
                assert.deepEqual(actualRdsClusterRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: rdsCluster.arn,
                    resourceType: AWS_RDS_DB_CLUSTER
                });
                assert.deepEqual(actualRdsInstanceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: rdsInstance.arn,
                    resourceType: AWS_RDS_DB_INSTANCE
                });
                assert.deepEqual(actualRedshiftClusterRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: redshiftCluster.arn,
                    resourceType: AWS_REDSHIFT_CLUSTER
                });
            });

        });

        describe(AWS_EFS_FILE_SYSTEM, () => {

            it('should add KMS key relationship for EFS', async () => {
                const {default: schema} = await import('./fixtures/relationships/efs/kms.json', {with: {type: 'json' }});
                const {efs, kms} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [kms, efs]);

                const {relationships} = rels.find(r => r.resourceId === efs.resourceId);
                const actualKmsRel = relationships.find(r => r.arn === kms.arn);

                assert.deepEqual(actualKmsRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: kms.arn
                });
            });

        });

        describe(AWS_EFS_ACCESS_POINT, () => {

            it('should add relationship to EFS file system', async () => {
                const {default: schema} = await import('./fixtures/relationships/efs/accessPoint/efs.json', {with: {type: 'json' }});
                const {efs, accessPoint} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [accessPoint]);

                const {relationships} = rels.find(r => r.resourceId === accessPoint.resourceId);
                const actualEfsRel = relationships.find(r => r.resourceId === efs.resourceId);

                assert.deepEqual(actualEfsRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: efs.resourceId,
                    resourceType: AWS_EFS_FILE_SYSTEM
                });
            });

        });

        describe(AWS_EKS_CLUSTER, () => {

            it('should add relationships for networking', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/cluster/networking.json', {with: {type: 'json' }});
                const {vpc, subnet1, subnet2, cluster, clusterRole} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    subnet1, subnet2, cluster, clusterRole
                ]);

                const {availabilityZone, relationships} = rels.find(r => r.resourceId === cluster.resourceId);

                assert.strictEqual(availabilityZone, 'eu-west-2a,eu-west-2b');

                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);
                const actualSubnet1Rel = relationships.find(r => r.resourceId === subnet1.resourceId);
                const actualSubnet2Rel = relationships.find(r => r.resourceId === subnet2.resourceId);

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
            });

            it('should add relationships for networking when subnets have not been discovered', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/cluster/networking.json', {with: {type: 'json' }});
                const {vpc, cluster, clusterRole} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    cluster, clusterRole
                ]);

                const {availabilityZone, relationships} = rels.find(r => r.resourceId === cluster.resourceId);
                assert.strictEqual(availabilityZone, 'Regional');

                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);

                assert.notExists(actualVpcRel);
            });

            it('should add relationships for security groups', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/cluster/securityGroup.json', {with: {type: 'json' }});
                const {securityGroup1, securityGroup2, cluster, clusterRole} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    securityGroup1, securityGroup2, cluster, clusterRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === cluster.resourceId);

                const actualSgRel1 = relationships.find(r => r.resourceId === securityGroup1.resourceId);
                const actualSgRel2 = relationships.find(r => r.resourceId === securityGroup2.resourceId);

                assert.deepEqual(actualSgRel1, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup1.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
                assert.deepEqual(actualSgRel2, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup2.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
            });

            it('should add relationships for IAM roles', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/cluster/role.json', {with: {type: 'json' }});
                const {cluster, clusterRole} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    cluster, clusterRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === cluster.resourceId);

                const actualClusterRoleRel = relationships.find(r => r.arn === clusterRole.arn);

                assert.deepEqual(actualClusterRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: clusterRole.arn
                });
            });

        });

        describe(AWS_EKS_NODE_GROUP, () => {

            it('should add relationships for networking', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/nodeGroup/networking.json', {with: {type: 'json' }});
                const {vpc, subnet1, subnet2, nodeRole, nodeGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    subnet1, subnet2, nodeRole, nodeGroup
                ]);

                const {availabilityZone, relationships} = rels.find(r => r.resourceId === nodeGroup.resourceId);

                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);
                const actualSubnet1Rel = relationships.find(r => r.resourceId === subnet1.resourceId);
                const actualSubnet2Rel = relationships.find(r => r.resourceId === subnet2.resourceId);

                assert.strictEqual(availabilityZone, 'eu-west-2a,eu-west-2b');

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
            });

            it('should add relationships for networking when subnets have not been discovered', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/nodeGroup/networking.json', {with: {type: 'json' }});
                const {vpc, nodeRole, nodeGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [nodeRole, nodeGroup]);

                const {availabilityZone, relationships} = rels.find(r => r.resourceId === nodeGroup.resourceId);
                assert.strictEqual(availabilityZone, 'Regional');

                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);

                assert.notExists(actualVpcRel);
            });

            it('should add relationships for security groups with launch template', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/nodeGroup/securityGroupLT.json', {with: {type: 'json' }});
                const {securityGroup, launchTemplate, nodeRole, nodeGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    nodeGroup, nodeRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === nodeGroup.resourceId);

                const actualSgRel = relationships.find(r => r.resourceId === securityGroup.resourceId);
                const actualLaunchTemplateRel = relationships.find(r => r.resourceId === launchTemplate.resourceId);

                assert.deepEqual(actualSgRel, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
                assert.deepEqual(actualLaunchTemplateRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: launchTemplate.resourceId,
                    resourceType: AWS_EC2_LAUNCH_TEMPLATE
                });
            });

            it('should add relationships for security groups without launch template', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/nodeGroup/securityGroup.json', {with: {type: 'json' }});
                const {securityGroup, nodeRole, nodeGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    nodeGroup, nodeRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === nodeGroup.resourceId);

                const actualSgRel = relationships.find(r => r.resourceId === securityGroup.resourceId);

                assert.deepEqual(actualSgRel, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
            });

            it('should add relationships with autoscaling groups', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/nodeGroup/asg.json', {with: {type: 'json' }});
                const {asg, nodeRole, nodeGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    nodeGroup, nodeRole, asg
                ]);

                const {relationships} = rels.find(r => r.resourceId === nodeGroup.resourceId);

                const actualAsgRel = relationships.find(r => r.resourceId === asg.resourceId);

                assert.deepEqual(actualAsgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: asg.resourceId,
                    resourceType: AWS_AUTOSCALING_AUTOSCALING_GROUP
                });
            });

            it('should add relationships for IAM role', async () => {
                const {default: schema} = await import('./fixtures/relationships/eks/nodeGroup/role.json', {with: {type: 'json' }});
                const {nodeRole, nodeGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    nodeGroup, nodeRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === nodeGroup.resourceId);

                const actualNodeRole = relationships.find(r => r.arn === nodeRole.arn);

                assert.deepEqual(actualNodeRole, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: nodeRole.arn
                });
            });

        });

        describe(AWS_MSK_CLUSTER, () => {

            it('should add relationships for networking', async () => {
                const {default: schema} = await import('./fixtures/relationships/msk/serverful.json', {with: {type: 'json' }});
                const {vpc, subnet1, subnet2, securityGroup, cluster} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    subnet1, subnet2, cluster
                ]);

                const {availabilityZone, relationships} = rels.find(r => r.resourceId === cluster.resourceId);

                assert.strictEqual(availabilityZone, 'eu-west-2a,eu-west-2b')

                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);
                const actualSubnet1Rel = relationships.find(r => r.resourceId === subnet1.resourceId);
                const actualSubnet2Rel = relationships.find(r => r.resourceId === subnet2.resourceId);
                const actualSecurityGroupRel = relationships.find(r => r.resourceId === securityGroup.resourceId);

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSecurityGroupRel, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
            });

            it('should handle relationships for networking when subnets have not been discovered', async () => {
                const {default: schema} = await import('./fixtures/relationships/msk/serverful.json', {with: {type: 'json' }});
                const {vpc, cluster} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [cluster]);

                const {availabilityZone, relationships} = rels.find(r => r.resourceId === cluster.resourceId);
                assert.strictEqual(availabilityZone, 'Regional')

                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);

                assert.notExists(actualVpcRel);

            });

        });

        describe(AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER, () => {

            it('should not add relationships between elb and ec2 instances if not present', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/elb/instances.json', {with: {type: 'json' }});
                const {elb} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [elb]);
                const {relationships} = rels.find(r => r.resourceId === elb.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add relationships between elb and ec2 instances if present', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/elb/instances.json', {with: {type: 'json' }});
                const {ec2Instance1, ec2Instance2, elb} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createElbClient() {
                        return {
                            getLoadBalancerInstances: async arn => [ec2Instance1.resourceId, ec2Instance2.resourceId]
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [elb]);
                const {relationships} = rels.find(r => r.resourceId === elb.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH + INSTANCE,
                        resourceId: ec2Instance1.resourceId,
                        resourceType: AWS_EC2_INSTANCE
                    }, {
                        relationshipName: IS_ASSOCIATED_WITH + INSTANCE,
                        resourceId: ec2Instance2.resourceId,
                        resourceType: AWS_EC2_INSTANCE
                    }
                ]);
            });

        });

        describe(AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP, () => {

            it('should add relationships with autoscaling groups', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/alb/targetGroup/asg.json', {with: {type: 'json' }});
                const {ec2Instance1, ec2Instance2, asg, targetGroup} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createElbV2Client() {
                        return {
                            describeTargetHealth: async arn => [
                                {Target: {Id: ec2Instance1.resourceId}},
                                {Target: {Id: ec2Instance2.resourceId}}
                            ]
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [
                    targetGroup, asg
                ]);

                const {relationships} = rels.find(r => r.resourceId === targetGroup.resourceId);

                const actualAsgRel = relationships.find(r => r.resourceId === asg.resourceId);

                assert.deepEqual(relationships.filter(x => x.resourceType === AWS_EC2_INSTANCE), []);
                assert.deepEqual(actualAsgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: asg.resourceId,
                    resourceType: AWS_AUTOSCALING_AUTOSCALING_GROUP
                });
            });

            it('should add relationships for ec2 instances not in autoscaling groups', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/alb/targetGroup/asgAndInstances.json', {with: {type: 'json' }});
                const {ec2Instance1, ec2Instance2, asg, targetGroup} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createElbV2Client() {
                        return {
                            describeTargetHealth: async arn => [
                                {Target: {Id: ec2Instance1.resourceId}},
                                {Target: {Id: ec2Instance2.resourceId}}
                            ]
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [
                    targetGroup, asg
                ]);

                const {relationships} = rels.find(r => r.resourceId === targetGroup.resourceId);

                const actualAsgRel = relationships.find(r => r.resourceId === asg.resourceId);
                const actualEc2Rel = relationships.find(r => r.resourceId === ec2Instance2.resourceId);

                assert.strictEqual(relationships.filter(x => x.resourceType === AWS_EC2_INSTANCE).length, 1);
                assert.deepEqual(actualAsgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: asg.resourceId,
                    resourceType: AWS_AUTOSCALING_AUTOSCALING_GROUP
                });
                assert.deepEqual(actualEc2Rel, {
                    relationshipName: IS_ASSOCIATED_WITH + INSTANCE,
                    resourceId: actualEc2Rel.resourceId,
                    resourceType: AWS_EC2_INSTANCE
                });
            });

            it('should add relationships with lambda functions', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/alb/targetGroup/lambda.json', {with: {type: 'json' }});
                const {lambda, targetGroup} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createElbV2Client() {
                        return {
                            describeTargetHealth: async arn => [
                                {Target: {Id: lambda.arn}}
                            ]
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [
                    targetGroup, lambda
                ]);

                const {relationships} = rels.find(r => r.resourceId === targetGroup.resourceId);

                const actualLambdaRel = relationships.find(r => r.arn === lambda.arn);

                assert.deepEqual(actualLambdaRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: lambda.arn
                });
            });

            it('should add relationship with VPC', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/alb/targetGroup/vpc.json', {with: {type: 'json' }});
                const {vpc, targetGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    targetGroup
                ]);

                const {relationships} = rels.find(r => r.resourceId === targetGroup.resourceId);

                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
            });

        });

        describe(AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER, () => {

            it('should add relationship between listeners and single target group', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/alb/listeners/singleTargetGroup.json', {with: {type: 'json' }});
                const {alb, targetGroup, listener} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [listener]);

                const {relationships} = rels.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER);

                const actualTgRel = relationships.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP);
                const actualAlbRel = relationships.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER);

                assert.deepEqual(actualTgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: targetGroup.resourceId,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP
                });
                assert.deepEqual(actualAlbRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: alb.resourceId,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER
                });
            });

            it('should add relationship between listeners and multiple target groups', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/alb/listeners/multipleTargetGroups.json', {with: {type: 'json' }});
                const {targetGroup1, targetGroup2, listener} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [listener]);

                const {relationships} = rels.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER);

                const actualTgRel1 = relationships.find(r => r.resourceId === targetGroup1.resourceId);
                const actualTgRel2 = relationships.find(r => r.resourceId === targetGroup2.resourceId);

                assert.deepEqual(actualTgRel1, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: targetGroup1.resourceId,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP
                });
                assert.deepEqual(actualTgRel2, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: targetGroup2.resourceId,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP
                });
            });

            it('should add relationship between listeners and cognito user pools', async () => {
                const {default: schema} = await import('./fixtures/relationships/loadBalancer/alb/listeners/cognito.json', {with: {type: 'json' }});
                const {userPool, listener} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [listener]);

                const {relationships} = rels.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER);

                const actualTgRel = relationships.find(r => r.resourceType === AWS_COGNITO_USER_POOL);

                assert.deepEqual(actualTgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: userPool.resourceId,
                    resourceType: AWS_COGNITO_USER_POOL
                });
            });

        });

        describe(AWS_IAM_ROLE, () => {

            it('should add relationships for managed policies', async () => {
                const {default: schema} = await import('./fixtures/relationships/iam/role/managedPolices.json', {with: {type: 'json' }});
                const {role, managedRole} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [role, managedRole]);

                const {relationships} = rels.find(r => r.resourceId === role.resourceId);
                const actualManagedRoleRel = relationships.find(r => r.arn === managedRole.arn);

                assert.deepEqual(actualManagedRoleRel, {
                    relationshipName: IS_ATTACHED_TO,
                    arn: managedRole.arn,
                    resourceType: AWS_IAM_AWS_MANAGED_POLICY
                });
            });

        });

        describe(AWS_IAM_INLINE_POLICY, () => {

            it('should parse multiple statements', async () => {
                const {default: schema} = await import('./fixtures/relationships/iam/inlinePolicy/multipleStatement.json', {with: {type: 'json' }});
                const {policy, s3Bucket1, s3Bucket2} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [policy, s3Bucket1, s3Bucket2]);
                const {relationships} = rels.find(r => r.resourceId === policy.resourceId);

                const actualBucket1 = relationships.find(r => r.arn === s3Bucket1.arn);
                const actualBucket2 = relationships.find(r => r.arn === s3Bucket2.arn);

                assert.deepEqual(actualBucket1, {
                    relationshipName: IS_ATTACHED_TO,
                    arn: s3Bucket1.arn,
                    resourceType: AWS_S3_BUCKET
                });
                assert.deepEqual(actualBucket2, {
                    relationshipName: IS_ATTACHED_TO,
                    arn: s3Bucket2.arn,
                    resourceType: AWS_S3_BUCKET
                });
            });

        });

        describe(AWS_IAM_INSTANCE_PROFILE, () => {

            it('should add relationships for associated IAM roles', async () => {
                const {default: schema} = await import('./fixtures/relationships/iam/instanceProfile/mutipleRoles.json', {with: {type: 'json' }});
                const {profile} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [profile]);

                const {relationships} = rels.find(r => r.arn === profile.arn);

                assert.deepEqual(relationships, [{
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    resourceName: 'roleName1',
                    resourceType: AWS_IAM_ROLE
                }, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    resourceName: 'roleName2',
                    resourceType: AWS_IAM_ROLE
                }]);
            });

        });

        describe(AWS_IAM_USER, () => {

            it('should add relationships for managed policies', async () => {
                const {default: schema} = await import('./fixtures/relationships/iam/user/managedPolicy.json', {with: {type: 'json' }});
                const {user, managedRole} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [user, managedRole]);

                const {relationships} = rels.find(r => r.resourceId === user.resourceId);
                const actualManagedRoleRel = relationships.find(r => r.arn === managedRole.arn);

                assert.deepEqual(actualManagedRoleRel, {
                    relationshipName: IS_ATTACHED_TO,
                    arn: managedRole.arn,
                    resourceType: AWS_IAM_AWS_MANAGED_POLICY
                });
            });

        });

        describe(AWS_MEDIA_PACKAGE_PACKAGING_CONFIGURATION, () => {

            it('should add relationship to packaging groups', async () => {
                const {default: schema} = await import('./fixtures/relationships/mediapackage/packagingConfiguration/group.json', {with: {type: 'json' }});
                const {packagingConfiguration, packagingGroup} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [packagingConfiguration]);

                const {relationships} = rels.find(r => r.arn === packagingConfiguration.arn);
                const actualPackagingGroupRel = relationships.find(r => r.resourceId === packagingGroup.resourceId);

                assert.deepEqual(actualPackagingGroupRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: packagingGroup.resourceId,
                    resourceType: AWS_MEDIA_PACKAGE_PACKAGING_GROUP
                });
            });

            it('should add encryption role relationships', async () => {
                const {default: schema} = await import('./fixtures/relationships/mediapackage/packagingConfiguration/encryption.json', {with: {type: 'json' }});
                const {
                    cmafRole, dashRole, hlsRole, mssRole, packagingConfigurationCmaf, packagingConfigurationDash, packagingConfigurationHls, packagingConfigurationMss
                } = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [
                    packagingConfigurationCmaf, packagingConfigurationDash, packagingConfigurationHls, packagingConfigurationMss
                ]);

                const {relationships: cmafRelationships} = rels.find(r => r.arn === packagingConfigurationCmaf.arn);
                const {relationships: dashRelationships} = rels.find(r => r.arn === packagingConfigurationDash.arn);
                const {relationships: hlsRelationships} = rels.find(r => r.arn === packagingConfigurationHls.arn);
                const {relationships: mssRelationships} = rels.find(r => r.arn === packagingConfigurationMss.arn);

                const actualCmafRoleRel = cmafRelationships.find(r => r.arn === cmafRole.arn);
                const actualDashRoleRel = dashRelationships.find(r => r.arn === dashRole.arn);
                const actualHlsRoleRel = hlsRelationships.find(r => r.arn === hlsRole.arn);
                const actualMssRoleRel = mssRelationships.find(r => r.arn === mssRole.arn);

                assert.deepEqual(actualCmafRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: cmafRole.arn
                });

                assert.deepEqual(actualDashRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: dashRole.arn
                });

                assert.deepEqual(actualHlsRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: hlsRole.arn
                });

                assert.deepEqual(actualMssRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: mssRole.arn
                });
            });

        });

        describe(AWS_MEDIA_PACKAGE_PACKAGING_GROUP, () => {

            it('should add authorization relationships', async () => {
                const {default: schema} = await import('./fixtures/relationships/mediapackage/packagingGroup/authorization.json', {with: {type: 'json' }});
                const {packagingGroup, role, secret} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [packagingGroup]);

                const {relationships} = rels.find(r => r.arn === packagingGroup.arn);
                const actualRoleRel = relationships.find(r => r.arn === role.arn);
                const actualSecretRel = relationships.find(r => r.arn === secret.arn);

                assert.deepEqual(actualRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: role.arn
                });

                assert.deepEqual(actualSecretRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: secret.arn
                });
            });
        });

        describe(AWS_MEDIA_CONNECT_FLOW_ENTITLEMENT, () => {

            it('should add relationship with flow', async () => {
                const {default: schema} = await import('./fixtures/relationships/mediaconnect/entitlement/flow.json', {with: {type: 'json' }});
                const {entitlement, flow} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [entitlement]);

                const {relationships} = rels.find(r => r.resourceId === entitlement.resourceId);
                const actualFlowRel = relationships.find(r => r.arn === flow.arn);

                assert.deepEqual(actualFlowRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: flow.arn
                });
            });

        });

        describe(AWS_MEDIA_CONNECT_FLOW_SOURCE, () => {

            it('should add interface and flow relationships for VPC sources', async () => {
                const {default: schema} = await import('./fixtures/relationships/mediaconnect/flowsource/vpc.json', {with: {type: 'json' }});
                const {flow, source, vpcInterface} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [source]);

                const {relationships} = rels.find(r => r.resourceId === source.resourceId);
                const actualFlowRel = relationships.find(r => r.arn === flow.arn);
                const actualVpcInterfaceRel = relationships.find(r => r.resourceName === vpcInterface.resourceName);

                assert.deepEqual(actualFlowRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: flow.arn
                });

                assert.deepEqual(actualVpcInterfaceRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceName: vpcInterface.resourceName,
                    resourceType: AWS_MEDIA_CONNECT_FLOW_VPC_INTERFACE
                });
            });

            it('should add relationship with flow entitlement', async () => {
                const {default: schema} = await import('./fixtures/relationships/mediaconnect/flowsource/entitlement.json', {with: {type: 'json' }});
                const {entitlement, source} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [source]);

                const {relationships} = rels.find(r => r.resourceId === source.resourceId);
                const actualEntitlementRel = relationships.find(r => r.arn === entitlement.arn);

                assert.deepEqual(actualEntitlementRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: entitlement.arn
                });
            });

            it('should add relationships for encrypted sources', async () => {
                const {default: schema} = await import('./fixtures/relationships/mediaconnect/flowsource/encrypted.json', {with: {type: 'json' }});
                const {role, secret, source} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [source]);

                const {relationships} = rels.find(r => r.resourceId === source.resourceId);
                const actualRoleRel = relationships.find(r => r.arn === role.arn);
                const actualSecretRel = relationships.find(r => r.arn === secret.arn);

                assert.deepEqual(actualRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: role.arn
                });

                assert.deepEqual(actualSecretRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: secret.arn
                });
            });

        });

        describe(AWS_MEDIA_CONNECT_FLOW_VPC_INTERFACE, () => {

            it('should add networking relationships', async () => {
                const {default: schema} = await import('./fixtures/relationships/mediaconnect/flowVpcInterface/networking.json', {with: {type: 'json' }});
                const {eni, securityGroup, subnet1, vpc, vpcInterface} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet1, vpcInterface]);

                const {relationships} = rels.find(r => r.resourceId === vpcInterface.resourceId);
                const actualVpcRel = relationships.find(r => r.resourceId === vpc.resourceId);
                const actualSubnetRel = relationships.find(r => r.resourceId === subnet1.resourceId);
                const actualSecurityGroupRel = relationships.find(r => r.resourceId === securityGroup.resourceId);
                const actualEniRel = relationships.find(r => r.resourceId === eni.resourceId);

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });

                assert.deepEqual(actualSubnetRel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });

                assert.deepEqual(actualSecurityGroupRel, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });

                assert.deepEqual(actualEniRel, {
                    relationshipName: IS_ATTACHED_TO + NETWORK_INTERFACE,
                    resourceId: eni.resourceId,
                    resourceType: AWS_EC2_NETWORK_INTERFACE
                });
            });

        });

        describe(AWS_RDS_DB_INSTANCE, () => {

            it('should add VPC relationships for RDS DB instances', async () => {
                const {default: schema} = await import('./fixtures/relationships/rds/instance/vpc.json', {with: {type: 'json' }});
                const {dbInstance, $constants} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [dbInstance]);

                const actual = rels[0];
                const actualSubnet1Rel = actual.relationships.find(r => r.resourceId === $constants.subnet1);
                const actualVpcRel = actual.relationships.find(r => r.resourceId === $constants.vpcId);

                assert.strictEqual(dbInstance.vpcId, $constants.vpcId);

                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: $constants.subnet1,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: $constants.vpcId,
                    resourceType: AWS_EC2_VPC
                });
            });

        });

        describe(AWS_EC2_INSTANCE, () => {

            it('should add relationship for associated instance profile', async () => {
                const {default: schema} = await import('./fixtures/relationships/ec2/instance/configuration.json', {with: {type: 'json' }});
                const {instance} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [instance]);

                const {relationships} = rels.find(r => r.arn === instance.arn);
                const actualInstanceProfileRel = relationships.find(r => r.arn === instance.configuration.iamInstanceProfile.arn);

                assert.deepEqual(actualInstanceProfileRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: instance.configuration.iamInstanceProfile.arn,
                });

            });
        });

        describe(AWS_EC2_SPOT_FLEET, () => {

            it('should not add relationships when no load balancers config present', async () => {
                const {default: schema} = await import('./fixtures/relationships/ec2/spotfleet/noLb.json', {with: {type: 'json' }});
                const {spotFleet} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [spotFleet]);

                const {relationships} = rels.find(r => r.resourceType === AWS_EC2_SPOT_FLEET);

                assert.deepEqual(relationships, []);
            });

            it('should add relationship between ELBs and spot fleets', async () => {
                const {default: schema} = await import('./fixtures/relationships/ec2/spotfleet/elb.json', {with: {type: 'json' }});
                const {elb, spotFleet} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [spotFleet]);

                const {relationships} = rels.find(r => r.resourceType === AWS_EC2_SPOT_FLEET);

                const actualTgRel = relationships.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER);

                assert.deepEqual(actualTgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: elb.resourceId,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER
                });
            });

            it('should add relationship between ALBs and spot fleets', async () => {
                const {default: schema} = await import('./fixtures/relationships/ec2/spotfleet/alb.json', {with: {type: 'json' }});
                const {targetGroup, spotFleet} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [targetGroup, spotFleet]);

                const {relationships} = rels.find(r => r.resourceType === AWS_EC2_SPOT_FLEET);

                const actualTgRel = relationships.find(r => r.arn === targetGroup.arn);

                assert.deepEqual(actualTgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: targetGroup.arn
                });
            });

        });

        describe(AWS_S3_BUCKET, () => {

            it('should get relationships in supplemtary configuration', async () => {
                const {default: schema} = await import('./fixtures/relationships/s3/bucket/supplementary.json', {with: {type: 'json' }});
                const {s3Bucket} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [s3Bucket]);

                const {relationships} = rels.find(r => r.resourceType === AWS_S3_BUCKET);

                const actualLoggingBucketRel = relationships.find(r => r.resourceId === s3Bucket.supplementaryConfiguration.BucketLoggingConfiguration.destinationBucketName)
                const actualLambdaNotificationRel = relationships.find(r => r.arn === s3Bucket.supplementaryConfiguration.BucketNotificationConfiguration.configurations.LambdaFunctionConfigurationId.functionARN)
                const actualSnsNotificationRel = relationships.find(r => r.arn === s3Bucket.supplementaryConfiguration.BucketNotificationConfiguration.configurations.SnsConfigurationId.topicARN)
                const actualLSqsNotificationRel = relationships.find(r => r.arn === s3Bucket.supplementaryConfiguration.BucketNotificationConfiguration.configurations.SqsFunctionConfigurationId.queueARN)

                assert.deepEqual(actualLoggingBucketRel, {
                    resourceId: s3Bucket.supplementaryConfiguration.BucketLoggingConfiguration.destinationBucketName,
                    resourceType: AWS_S3_BUCKET,
                    relationshipName: IS_ASSOCIATED_WITH
                });

                assert.deepEqual(actualLambdaNotificationRel, {
                    arn: s3Bucket.supplementaryConfiguration.BucketNotificationConfiguration.configurations.LambdaFunctionConfigurationId.functionARN,
                    relationshipName: IS_ASSOCIATED_WITH
                });

                assert.deepEqual(actualSnsNotificationRel, {
                    arn: s3Bucket.supplementaryConfiguration.BucketNotificationConfiguration.configurations.SnsConfigurationId.topicARN,
                    relationshipName: IS_ASSOCIATED_WITH
                });

                assert.deepEqual(actualLSqsNotificationRel, {
                    arn: s3Bucket.supplementaryConfiguration.BucketNotificationConfiguration.configurations.SqsFunctionConfigurationId.queueARN,
                    relationshipName: IS_ASSOCIATED_WITH
                });
            });

        });

        describe(AWS_SERVICE_CATALOG_APP_REGISTRY_APPLICATION, () => {

            it('should handle applications with no application tag', async () => {
                const {default: schema} = await import('./fixtures/relationships/appregistry/application/noApplicationTag.json', {with: {type: 'json' }});
                const {application} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [application]);

                const {relationships} = rels.find(r => r.arn === application.arn);

                assert.lengthOf(relationships, 0);
            });

            it('should handle when application tag is present but tag resource type is missing', async () => {
                const {default: schema} = await import('./fixtures/relationships/appregistry/application/default.json', {with: {type: 'json' }});
                const {application} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [application]);

                const {relationships} = rels.find(r => r.arn === application.arn);

                assert.lengthOf(relationships, 0);
            });

            it('should associate resources with application tag to application', async () => {
                const {default: schema} = await import('./fixtures/relationships/appregistry/application/default.json', {with: {type: 'json' }});
                const {application, tag} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [application, tag]);

                const {relationships} = rels.find(r => r.arn === application.arn);

                const actualLambdaRel = relationships.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);
                const sctualEc2Rel = relationships.find(r => r.resourceType === AWS_EC2_INSTANCE);
                const actualRoleRel = relationships.find(r => r.resourceType === AWS_IAM_ROLE);

                assert.lengthOf(relationships, 3);

                assert.deepEqual(actualLambdaRel, {
                    relationshipName: CONTAINS,
                    resourceType: AWS_LAMBDA_FUNCTION,
                    resourceId: 'lambdaResourceId'
                });

                assert.deepEqual(sctualEc2Rel, {
                    relationshipName: `${CONTAINS}Instance`,
                    resourceType: AWS_EC2_INSTANCE,
                    resourceId: 'ec2InstanceResourceId'
                });

                assert.deepEqual(actualRoleRel, {
                    relationshipName: `${CONTAINS}Role`,
                    resourceType: AWS_IAM_ROLE,
                    resourceName: 'roleName'
                });
            });

        });

        describe(AWS_SNS_TOPIC, () => {

            it('should ignore relationships to undiscovered resources', async () => {
                const {default: schema} = await import('./fixtures/relationships/sns/lambda/undiscovered.json', {with: {type: 'json' }});
                const {snsTopic} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createSnsClient(_, region) {
                        return {
                            async getAllSubscriptions() {
                                return region === snsTopic.awsRegion ? [{
                                    TopicArn: snsTopic.arn, Endpoint: 'undiscoveredArn'
                                }] : []
                            }
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [snsTopic]);

                const {relationships} = rels.find(r => r.resourceType === AWS_SNS_TOPIC);

                assert.deepEqual(relationships, []);
            });

            it('should add additional relationships to Lambda functions', async () => {
                const {default: schema} = await import('./fixtures/relationships/sns/lambda/sameRegion.json', {with: {type: 'json' }});
                const {snsTopic, lambda} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createSnsClient(_, region) {
                        return {
                            async getAllSubscriptions() {
                                return region === snsTopic.awsRegion ? [{
                                    TopicArn: snsTopic.arn, Endpoint: lambda.arn
                                }] : []
                            }
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [snsTopic, lambda]);

                const {relationships} = rels.find(r => r.resourceType === AWS_SNS_TOPIC);
                const actualLambdaRel = relationships.find(r => r.arn === lambda.arn);

                assert.deepEqual(actualLambdaRel, {
                    arn: lambda.arn,
                    resourceType: AWS_LAMBDA_FUNCTION,
                    relationshipName: IS_ASSOCIATED_WITH
                });
            });

            it('should add additional relationships to SQS queues', async () => {
                const {default: schema} = await import('./fixtures/relationships/sns/sqs/differentRegion.json', {with: {type: 'json' }});
                const {snsTopic, sqs} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createSnsClient(_, region) {
                        return {
                            async getAllSubscriptions() {
                                return region === snsTopic.awsRegion ? [{
                                    TopicArn: snsTopic.arn, Endpoint: sqs.arn
                                }] : []
                            }
                        }
                    }
                };

                const rels = await addAdditionalRelationships(mockAwsClient, [snsTopic, sqs]);

                const {relationships} = rels.find(r => r.resourceType === AWS_SNS_TOPIC);
                const actualSqsRel = relationships.find(r => r.arn === sqs.arn);

                assert.deepEqual(actualSqsRel, {
                    arn: sqs.arn,
                    resourceType: AWS_SQS_QUEUE,
                    relationshipName: IS_ASSOCIATED_WITH
                });
            });

        });

        describe(AWS_CODEBUILD_PROJECT, () => {

            it('should add relationship to service role', async () => {
                const {default: schema} = await import('./fixtures/relationships/codebuild/project/role.json', {with: {type: 'json' }});
                const {serviceRole, project} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [serviceRole, project]);

                const {relationships} = rels.find(r => r.resourceId === project.resourceId);
                const actualRoleRel = relationships.find(r => r.arn === serviceRole.arn);

                assert.deepEqual(actualRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: serviceRole.arn
                })
            });

            it('should add VPC relationships for CodeBuild projects', async () => {
                const {default: schema} = await import('./fixtures/relationships/codebuild/project/vpc.json', {with: {type: 'json' }});
                const {vpc, subnet1, subnet2, securityGroup, project} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [subnet1, subnet2, project]);

                const actual = rels.find(r => r.resourceId === project.resourceId);
                const actualVpcRel = actual.relationships.find(r => r.resourceId === vpc.resourceId);
                const actualSubnet1Rel = actual.relationships.find(r => r.resourceId === subnet1.resourceId);
                const actualSubnet2Rel = actual.relationships.find(r => r.resourceId === subnet2.resourceId);
                const actualSecurityGroupRel = actual.relationships.find(r => r.resourceId === securityGroup.resourceId);

                assert.strictEqual(actual.availabilityZone, `${subnet1.availabilityZone},${subnet2.availabilityZone}`);

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSecurityGroupRel, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                })
            });

        });

        describe(AWS_OPENSEARCH_DOMAIN, () => {

            it('should add VPC relationships for OpenSearch domains', async () => {
                const {default: schema} = await import('./fixtures/relationships/opensearch/domain/vpc.json', {with: {type: 'json' }});
                const {vpc, subnet1, subnet2, securityGroup, domain} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [domain, subnet1, subnet2]);

                const actual = rels.find(r => r.resourceId === domain.resourceId);
                const actualVpcRel = actual.relationships.find(r => r.resourceId === vpc.resourceId);
                const actualSubnet1Rel = actual.relationships.find(r => r.resourceId === subnet1.resourceId);
                const actualSubnet2Rel = actual.relationships.find(r => r.resourceId === subnet2.resourceId);
                const actualSg = actual.relationships.find(r => r.resourceId === securityGroup.resourceId);

                assert.strictEqual(actual.availabilityZone, 'eu-west-2a,eu-west-2b');

                assert.deepEqual(actualVpcRel, {
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC
                });
                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_CONTAINED_IN + SUBNET,
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET
                });
                assert.deepEqual(actualSg, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
            });

        });

        describe(AWS_APPSYNC_DATASOURCE, async ()=> {
            it('should add dynamodb relationships', async ()=> {

                const {default: schema} = await import('./fixtures/relationships/appsync/graphQlApi.json', {with: {type: 'json' }});
                const {dynamoDBTable, dynamoLinkedDataSource} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [dynamoLinkedDataSource, dynamoDBTable])
                const actual = rels.find(r => r.dataSourceArn === dynamoLinkedDataSource.dataSourceArn);
                
                const dynamoRelationship = actual.relationships.find(r => r.resourceName === dynamoDBTable.resourceName)

                assert.deepEqual(dynamoRelationship, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceName: dynamoDBTable.resourceName,
                    resourceType: AWS_DYNAMODB_TABLE
                });

            })
            it('should add lambda relationships', async ()=> { 
                const {default: schema} = await import('./fixtures/relationships/appsync/graphQlApi.json', {with: {type: 'json' }});
                const { lambdaLinkedDataSource, lambda} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [lambdaLinkedDataSource, lambda])
                const actual = rels.find(r => r.dataSourceArn === lambdaLinkedDataSource.dataSourceArn);

                const lambdaRelationship = actual.relationships.find(r => r.arn === lambda.arn)

                assert.deepEqual(lambdaRelationship, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: lambda.arn
                });
            })

            it('should add eventBridge relationships', async ()=> {
                const {default: schema} = await import('./fixtures/relationships/appsync/graphQlApi.json', {with: {type: 'json' }});
                const { eventBridgeLinkedDataSource, eventBus} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [eventBridgeLinkedDataSource, eventBus])
                const actual = rels.find(r => r.dataSourceArn === eventBridgeLinkedDataSource.dataSourceArn);

                const eventBusRelationship = actual.relationships.find(r => r.arn === eventBus.arn)

                assert.deepEqual(eventBusRelationship, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: eventBus.arn
                });
            })

            it('should add relational database relationships', async ()=> {
                const {default: schema} = await import('./fixtures/relationships/appsync/graphQlApi.json', {with: {type: 'json' }});
                const { rdsLinkedDataSource, rds} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [rdsLinkedDataSource, rds])
                const actual = rels.find(r => r.dataSourceArn === rdsLinkedDataSource.dataSourceArn);

                const rdsRelationship = actual.relationships.find(r => r.arn === rds.arn)

                assert.deepEqual(rdsRelationship, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: rds.resourceId,
                    resourceType: AWS_RDS_DB_CLUSTER
                });
            })
            it('should add Opensearch relationships', async ()=> {
                const schema = require('./fixtures/relationships/appsync/graphQlApi.json');
                const { openSearchLinkedDataSource, opensearchEndpoint} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [openSearchLinkedDataSource, opensearchEndpoint])
                const actual = rels.find(r => r.dataSourceArn === openSearchLinkedDataSource.dataSourceArn);

                const endpointRelationship = actual.relationships.find(r => r.arn === opensearchEndpoint.arn)

                assert.deepEqual(endpointRelationship, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: opensearchEndpoint.arn,
                });
            })
            it('should add elasticSearch relationships', async ()=> {
                const schema = require('./fixtures/relationships/appsync/graphQlApi.json');
                const { elasticSearchLinkedDataSource, elasticsearchEndpoint} = generate(schema);

                const rels = await addAdditionalRelationships(defaultMockAwsClient, [elasticSearchLinkedDataSource, elasticsearchEndpoint])
                const actual = rels.find(r => r.dataSourceArn === elasticSearchLinkedDataSource.dataSourceArn);

                const endpointRelationship = actual.relationships.find(r => r.arn === elasticsearchEndpoint.arn)

                assert.deepEqual(endpointRelationship, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: elasticsearchEndpoint.arn,
                });
            })
        })

    });

});