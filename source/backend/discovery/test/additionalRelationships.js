const {assert} = require('chai');
const {
    AWS_API_GATEWAY_METHOD,
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
    AWS_EFS_FILE_SYSTEM,
    AWS_KMS_KEY,
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
    SECURITY_GROUP, AWS_IAM_INLINE_POLICY
} = require('../src/lib/constants');

const {generate} = require('./generator');
const additionalRelationships = require('../src/lib/additionalRelationships');
const schema = require("./fixtures/relationships/iam/inlinePolicy/multipleStatement.json");

const ROLE = 'Role';
const INSTANCE = 'Instance';

describe('additionalRelationships', () => {

    const credentials = {accessKeyId: 'accessKeyId', secretAccessKey: 'secretAccessKey', sessionToken: 'sessionToken'};

    const defaultMockAwsClient = {
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

    describe('createAdditionalRelationships', () => {
        const createAdditionalRelationships = additionalRelationships.createAdditionalRelationships(new Map(
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
                const schema = require('./fixtures/relationships/apigateway/method/noLambda.json');
                const {method} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [method]);
                const {relationships} = rels.find(r => r.resourceId === method.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add relationships for lambdas', async () => {
                const schema = require('./fixtures/relationships/apigateway/method/lambda.json');
                const {lambda, method} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [lambda, method]);
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
                const schema = require('./fixtures/relationships/asg/launchTemplate.json');
                const {asg, subnet, launchTemplate} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [subnet, asg]);

                const {relationships} = rels.find(r => r.resourceId === asg.resourceId);
                const actualLaunchTemplateRel = relationships.find(x => x.resourceId === launchTemplate.resourceId);

                assert.deepEqual(actualLaunchTemplateRel, {
                    resourceId: launchTemplate.resourceId,
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceType: AWS_EC2_LAUNCH_TEMPLATE
                });
            });

            it('should add networking relationship', async () => {
                const schema = require('./fixtures/relationships/asg/networking.json');
                const {vpc, asg, subnet1, subnet2} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [subnet1, subnet2, asg]);

                const actualAsg = rels.find(r => r.resourceId === asg.resourceId);
                const actualVpcRel = actualAsg.relationships.find(x => x.resourceId === vpc.resourceId);

                assert.strictEqual(actualAsg.vpcId, vpc.resourceId);

                assert.deepEqual(actualVpcRel, {
                    resourceId: vpc.resourceId,
                    relationshipName: IS_CONTAINED_IN + VPC,
                    resourceType: AWS_EC2_VPC
                });
            });

        });

        describe(AWS_CLOUDFRONT_DISTRIBUTION, () => {

            it('should add regiun for s3 buckets', async () => {
                const schema = require('./fixtures/relationships/cloudfront/distribution/s3.json');
                const {cfDistro, s3} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [cfDistro, s3]);
                const {relationships} = rels.find(r => r.resourceId === cfDistro.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        resourceId: s3.resourceId,
                        resourceType: AWS_S3_BUCKET,
                        awsRegion: s3.awsRegion
                    }
                ]);
            });

            it('should add relationships to ELBs', async () => {
                const schema = require('./fixtures/relationships/cloudfront/distribution/elb.json');
                const {cfDistro, elb} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [cfDistro, elb]);
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
                const schema = require('./fixtures/relationships/cloudfront/distribution/alb.json');
                const {cfDistro, alb} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [cfDistro, alb]);
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

            it('should add regiun for s3 buckets', async () => {
                const schema = require('./fixtures/relationships/cloudfrontStreamingDistribution/s3.json');
                const {cfStreamingDistro, s3} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [cfStreamingDistro, s3]);
                const {relationships} = rels.find(r => r.resourceId === cfStreamingDistro.resourceId);

                assert.deepEqual(relationships, [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        resourceId: s3.resourceId,
                        resourceType: AWS_S3_BUCKET,
                        awsRegion: s3.awsRegion
                    }
                ]);
            });

        });

        describe(AWS_EC2_NETWORK_INTERFACE, () => {

            it('should add vpc information', async () => {
                const schema = require('./fixtures/relationships/eni/vpcInfo.json');
                const {vpc, subnet, eni} = generate(schema);


                const rels = await createAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels.find(r => r.resourceType === AWS_EC2_NETWORK_INTERFACE);

                assert.strictEqual(actual.vpcId, vpc.resourceId);
                assert.strictEqual(actual.subnetId, subnet.resourceId);
            });

            it('should add eni relationships for Opensearch clusters', async () => {
                const schema = require('./fixtures/relationships/eni/opensearch.json');
                const {eni} = generate(schema);

                const expectedOsDomainResourceId = 'xxxxxxxxxxxx/test-elasticsearch-cluster';

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels[0];
                const actualOpensearchRel = actual.relationships.find(r => r.resourceId === expectedOsDomainResourceId);

                assert.deepEqual(actualOpensearchRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: expectedOsDomainResourceId,
                    resourceType: AWS_ELASTICSEARCH_DOMAIN
                })
            });

            it('should add eni relationships for nat gateways', async () => {
                const schema = require('./fixtures/relationships/eni/natGateway.json');
                const {eni} = generate(schema);

                const expectedNatGatewayResourceId = 'nat-01234567890abcdef';

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels[0];
                const actualNatGatewayRel = actual.relationships.find(r => r.resourceId === expectedNatGatewayResourceId);

                assert.deepEqual(actualNatGatewayRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: expectedNatGatewayResourceId,
                    resourceType: AWS_EC2_NAT_GATEWAY
                })
            });


            it('should add eni relationships for vpc endpoints', async () => {
                const schema = require('./fixtures/relationships/eni/vpcEndpoint.json');
                const {eni, vpcEndpoint} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels.find(x => x.resourceId === eni.resourceId);
                const actualNatGatewayRel = actual.relationships.find(r => r.resourceId === vpcEndpoint.resourceId);

                assert.deepEqual(actualNatGatewayRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: vpcEndpoint.resourceId,
                    resourceType: AWS_EC2_VPC_ENDPOINT
                })
            });

            it('should add eni relationships for ALBs', async () => {
                const schema = require('./fixtures/relationships/eni/alb.json');
                const {eni} = generate(schema);

                const rexpectedAlbResourceId = 'arn:aws:elasticloadbalancing:eu-west-1:xxxxxxxxxxxx:loadbalancer/app/my-alb/1feef78b6a10bcd5';

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [eni]);
                const actual = rels[0];
                const actualAlbRel = actual.relationships.find(r => r.resourceId === rexpectedAlbResourceId);

                assert.deepEqual(actualAlbRel, {
                    relationshipName: IS_ATTACHED_TO,
                    resourceId: rexpectedAlbResourceId,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER
                })
            });

            it('should add eni relationships for lambda functions', async () => {
                const schema = require('./fixtures/relationships/eni/lambda.json');
                const {eni} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [eni]);
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
                const schema = require('./fixtures/relationships/routeTable/allRelationships.json');
                const {routeTable} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [routeTable]);

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
                const schema = require('./fixtures/relationships/securityGroup/ingress.json');
                const {inSecurityGroup1, inSecurityGroup2, securityGroup} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [securityGroup]);
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
                const schema = require('./fixtures/relationships/securityGroup/egress.json');
                const {outSecurityGroup1, outSecurityGroup2, securityGroup} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [securityGroup]);
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
                const schema = require('./fixtures/relationships/subnet/vpcInfo.json');
                const {subnet, vpc, routeTable} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [subnet, routeTable]);
                const actualSubnet = rels.find(x => x.resourceId === subnet.resourceId);

                assert.strictEqual(actualSubnet.vpcId, vpc.resourceId);
                assert.strictEqual(actualSubnet.subnetId, subnet.resourceId);
            });

            it('should identify public subnets', async () => {
                const schema = require('./fixtures/relationships/subnet/public.json');
                const {subnet, routeTable} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [subnet, routeTable]);
                const actualSubnet = rels.find(x => x.resourceId === subnet.resourceId);

                assert.strictEqual(actualSubnet.private, false);
            });

            it('should identify private subnets', async () => {
                const schema = require('./fixtures/relationships/subnet/private.json');
                const {subnet, routeTable} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [subnet, routeTable]);
                const actualSubnet = rels.find(x => x.resourceId === subnet.resourceId);

                assert.strictEqual(actualSubnet.private, true);
            });

        });

        describe(AWS_EC2_TRANSIT_GATEWAY, () => {

            it('should add relationships to routetables', async () => {
                const schema = require('./fixtures/relationships/transitgateway/routetables.json');
                const {tgw, tgwRouteTable1, tgwRouteTable2} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [tgw]);

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

            const createAdditionalRelationships = additionalRelationships.createAdditionalRelationships(new Map(
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
                const schema = require('./fixtures/relationships/transitgateway/attachments/vpc.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [tgwAttachment]);

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
                    relationshipName: IS_ASSOCIATED_WITH + ` ${VPC}`,
                    resourceId: vpc.resourceId,
                    resourceType: AWS_EC2_VPC,
                    awsRegion: euWest2,
                    accountId: accountIdZ
                });

                assert.deepEqual(actualSubnet1Rel, {
                    relationshipName: IS_ASSOCIATED_WITH + ' Subnet',
                    resourceId: subnet1.resourceId,
                    resourceType: AWS_EC2_SUBNET,
                    awsRegion: euWest2,
                    accountId: accountIdZ
                });

                assert.deepEqual(actualSubnet2Rel, {
                    relationshipName: IS_ASSOCIATED_WITH + ' Subnet',
                    resourceId: subnet2.resourceId,
                    resourceType: AWS_EC2_SUBNET,
                    awsRegion: euWest2,
                    accountId: accountIdZ
                });

                assert.deepEqual(actualSubnet3Rel, {
                    relationshipName: IS_ASSOCIATED_WITH + ' Subnet',
                    resourceId: subnet3.resourceId,
                    resourceType: AWS_EC2_SUBNET,
                    awsRegion: euWest2,
                    accountId: accountIdZ
                });

            });

        });

        describe(AWS_LAMBDA_FUNCTION, () => {

            it('should not add additional relationships for Lambda functions with no vpc', async () => {
                const schema = require('./fixtures/relationships/lambda/noVpc.json');
                const {lambda} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [lambda]);

                const actual = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);

                assert.deepEqual(actual.relationships, []);
            });

            it('should add VPC relationships for Lambda functions', async () => {
                const schema = require('./fixtures/relationships/lambda/vpc.json');
                const {vpc, subnet1, subnet2, lambda} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [subnet1, subnet2, lambda]);

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

            it('should add VPC relationships for Lambda functions with efs', async () => {
                const schema = require('./fixtures/relationships/lambda/efs.json');
                const {subnet1, subnet2, lambda, efs} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [subnet1, subnet2, lambda, efs]);

                const actual = rels.find(r => r.resourceId === lambda.resourceId);
                const actualEfsRel = actual.relationships.find(r => r.arn === efs.arn);

                assert.deepEqual(actualEfsRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: efs.arn,
                    resourceType: AWS_EFS_ACCESS_POINT
                });
            });

            it('should return additional relationships for Lambda functions with event mappings', async () => {
                const schema = require('./fixtures/relationships/lambda/eventMappings.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [lambda, kinesis]);

                const actual = rels.find(r => r.resourceType === AWS_LAMBDA_FUNCTION);

                assert.deepEqual(actual.relationships, [{
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: kinesis.arn,
                    resourceType: AWS_KINESIS_STREAM
                }]);
            });

            it('should return additional non-db relationships for Lambda functions with environment variables', async () => {
                const schema = require('./fixtures/relationships/lambda/envVar.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [resourceIdResource, resourceNameResource, arnResource, lambda]);

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
                const schema = require('./fixtures/relationships/lambda/dbEnvVar.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [
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
                const schema = require('./fixtures/relationships/ecs/cluster/noInstances.json');
                const {ecsCluster} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [ecsCluster]);
                const {relationships} = rels.find(r => r.resourceId === ecsCluster.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add relationships between cluster and ec2 instances if present', async () => {
                const schema = require('./fixtures/relationships/ecs/cluster/instances.json');
                const {ec2Instance1, ec2Instance2, ecsCluster} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createEcsClient() {
                        return {
                            getAllClusterInstances: async arn => [ec2Instance1.resourceId, ec2Instance2.resourceId]
                        }
                    }
                };

                const rels = await createAdditionalRelationships(mockAwsClient, [ecsCluster]);
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
                const schema = require('./fixtures/relationships/ecs/service/noVpc.json');
                const {ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition]);

                const {relationships} = rels.find(r => r.resourceType === AWS_ECS_SERVICE);

                const actualClusterRel = relationships.find(r => r.resourceType === AWS_ECS_CLUSTER);
                const actualIamRoleRel = relationships.find(r => r.resourceType === AWS_IAM_ROLE);
                const actualTaskRel = relationships.find(r => r.resourceType === AWS_ECS_TASK_DEFINITION);

                assert.deepEqual(actualClusterRel, {
                    relationshipName: IS_CONTAINED_IN,
                    arn: ecsCluster.arn,
                    resourceType: AWS_ECS_CLUSTER
                });
                assert.deepEqual(actualIamRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: ecsServiceRole.arn,
                    resourceType: AWS_IAM_ROLE
                });
                assert.deepEqual(actualTaskRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: ecsTaskDefinition.arn,
                    resourceType: AWS_ECS_TASK_DEFINITION
                });
            });

            it('should add alb target groups relationships ECS service', async () => {
                const schema = require('./fixtures/relationships/ecs/service/alb.json');
                const {ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition]);

                const {relationships} = rels.find(r => r.resourceId === ecsService.resourceId);

                const actualAlbTgRel = relationships.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP);

                assert.deepEqual(actualAlbTgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: ecsService.configuration.LoadBalancers[0].TargetGroupArn,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP
                });
            });

            it('should add networking relationships for ECS service in vpc', async () => {
                const schema = require('./fixtures/relationships/ecs/service/vpc.json');
                const {vpc, subnet1, subnet2, securityGroup, ecsServiceRole, ecsCluster, ecsService, ecsTaskDefinition} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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

        });

        describe(AWS_ECS_TASK, () => {

            it('should not get networking relationships for tasks not using awsvpc mode', async () => {
                const schema = require('./fixtures/relationships/ecs/task/cluster.json');
                const {ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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

            it('should add IAM role relationship for ECS tasks if present', async () => {
                const schema = require('./fixtures/relationships/ecs/task/roles.json');
                const {
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition, ecsTask
                } = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/ecs/task/roleOverrides.json');
                const {
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition, ecsTask
                } = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/ecs/task/noVpc.json');
                const {ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition
                ]);

                const {relationships} = rels.find(r => r.resourceId === ecsTask.resourceId);

                assert.deepEqual(relationships.filter(x => ![AWS_IAM_ROLE, AWS_ECS_CLUSTER].includes(x.resourceType)), []);
            });

            it('should get networking relationships for tasks using awsvpc mode', async () => {
                const schema = require('./fixtures/relationships/ecs/task/vpc.json');
                const {
                    vpc, ecsCluster, ecsTaskRole, ecsTaskExecutionRole, subnet, eni, ecsTask, ecsTaskDefinition
                } = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/ecs/task/envVars.json');
                const {
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition,
                    resourceIdResource, resourceNameResource, arnResource
                } = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/ecs/task/envVarOverrides.json');
                const {
                    ecsCluster, ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition,
                    resourceIdResource, overridenResource
                } = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/ecs/task/dbEnvVars.json');
                const {
                    ecsCluster, elasticsearch, opensearch, rdsCluster, rdsInstance, redshiftCluster,
                    ecsTaskRole, ecsTaskExecutionRole, ecsTask, ecsTaskDefinition
                } = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/ecs/taskDefinitions/noRoles.json');
                const {ecsTaskDefinition} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [ecsTaskDefinition]);
                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add efs file system relationships', async () => {
                const schema = require('./fixtures/relationships/ecs/taskDefinitions/efsFs.json');
                const {ecsTaskDefinition, efsFs} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [ecsTaskDefinition]);
                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);
                const actualEfsFsRel = relationships.find(r => r.resourceId === efsFs.resourceId);

                assert.deepEqual(actualEfsFsRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceType: AWS_EFS_FILE_SYSTEM,
                    resourceId: efsFs.resourceId
                });
            });

            it('should add efs access point relationships', async () => {
                const schema = require('./fixtures/relationships/ecs/taskDefinitions/efsAp.json');
                const {ecsTaskDefinition, efsAp} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [ecsTaskDefinition]);
                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);
                const actualEfsApRel = relationships.find(r => r.resourceId === efsAp.resourceId);

                assert.deepEqual(actualEfsApRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceType: AWS_EFS_ACCESS_POINT,
                    resourceId: efsAp.resourceId
                });
            });

            it('should ignore relationships for ECS task definitions and non-existent IAM roles', async () => {
                const schema = require('./fixtures/relationships/ecs/taskDefinitions/nonexistentRoles.json');
                const {ecsTaskDefinition} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [ecsTaskDefinition]);
                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add IAM role relationship for ECS tasks definitions if present', async () => {
                const schema = require('./fixtures/relationships/ecs/taskDefinitions/roles.json');
                const {ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [ecsTaskRole, ecsTaskExecutionRole, ecsTaskDefinition]);
                const {relationships} = rels.find(r => r.resourceId === ecsTaskDefinition.resourceId);

                const actualTaskRoleRel = relationships.find(r => r.resourceName === ecsTaskRole.resourceName);
                const actualTaskExecutionRoleRel = relationships.find(r => r.resourceName === ecsTaskExecutionRole.resourceName);

                assert.deepEqual(actualTaskRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    resourceName: ecsTaskRole.resourceName,
                    resourceType: AWS_IAM_ROLE
                });
                assert.deepEqual(actualTaskExecutionRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    resourceName: ecsTaskExecutionRole.resourceName,
                    resourceType: AWS_IAM_ROLE
                });
            });

            it('should get non-db relationships for tasks with environment variables', async () => {
                const schema = require('./fixtures/relationships/ecs/taskDefinitions/envVars.json');
                const {
                    ecsTaskDefinition, resourceIdResource, resourceNameResource, arnResource
                } = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/ecs/taskDefinitions/dbEnvVars.json');
                const {
                    elasticsearch, opensearch, rdsCluster, rdsInstance, redshiftCluster, ecsTaskDefinition
                } = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/efs/kms.json');
                const {efs, kms} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [kms, efs]);

                const {relationships} = rels.find(r => r.resourceId === efs.resourceId);
                const actualKmsRel = relationships.find(r => r.arn === kms.arn);

                assert.deepEqual(actualKmsRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    arn: kms.arn,
                    resourceType: AWS_KMS_KEY
                });
            });

        });

        describe(AWS_EFS_ACCESS_POINT, () => {

            it('should add VPC relationships for KMS key', async () => {
                const schema = require('./fixtures/relationships/efs/accessPoint/efs.json');
                const {efs, accessPoint} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [accessPoint]);

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
                const schema = require('./fixtures/relationships/eks/cluster/networking.json');
                const {vpc, subnet1, subnet2, cluster, clusterRole} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
                    subnet1, subnet2, cluster, clusterRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === cluster.resourceId);

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

            it('should add relationships for security groups', async () => {
                const schema = require('./fixtures/relationships/eks/cluster/securityGroup.json');
                const {securityGroup, cluster, clusterRole} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
                    securityGroup, cluster, clusterRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === cluster.resourceId);

                const actualSgRel = relationships.find(r => r.resourceId === securityGroup.resourceId);

                assert.deepEqual(actualSgRel, {
                    relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
            });

            it('should add relationships for IAM roles', async () => {
                const schema = require('./fixtures/relationships/eks/cluster/role.json');
                const {cluster, clusterRole} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
                    cluster, clusterRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === cluster.resourceId);

                const actualClusterRoleRel = relationships.find(r => r.arn === clusterRole.arn);

                assert.deepEqual(actualClusterRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: clusterRole.arn,
                    resourceType: AWS_IAM_ROLE
                });
            });

        });

        describe(AWS_EKS_NODE_GROUP, () => {

            it('should add relationships for networking', async () => {
                const schema = require('./fixtures/relationships/eks/nodeGroup/networking.json');
                const {vpc, subnet1, subnet2, nodeRole, nodeGroup} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
                    subnet1, subnet2, nodeRole, nodeGroup
                ]);

                const {relationships} = rels.find(r => r.resourceId === nodeGroup.resourceId);

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

            it('should add relationships for security groups with launch template', async () => {
                const schema = require('./fixtures/relationships/eks/nodeGroup/securityGroupLT.json');
                const {securityGroup, launchTemplate, nodeRole, nodeGroup} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/eks/nodeGroup/securityGroup.json');
                const {securityGroup, nodeRole, nodeGroup} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/eks/nodeGroup/asg.json');
                const {asg, nodeRole, nodeGroup} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/eks/nodeGroup/role.json');
                const {nodeRole, nodeGroup} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
                    nodeGroup, nodeRole
                ]);

                const {relationships} = rels.find(r => r.resourceId === nodeGroup.resourceId);

                const actualNodeRole = relationships.find(r => r.arn === nodeRole.arn);

                assert.deepEqual(actualNodeRole, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: nodeRole.arn,
                    resourceType: AWS_IAM_ROLE
                });
            });

        });

        describe(AWS_MSK_CLUSTER, () => {

            it('should add relationships for networking', async () => {
                const schema = require('./fixtures/relationships/msk/serverful.json');
                const {vpc, subnet1, subnet2, securityGroup, cluster} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
                    subnet1, subnet2, cluster
                ]);

                const {relationships} = rels.find(r => r.resourceId === cluster.resourceId);

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
        });

        describe(AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER, () => {

            it('should not add relationships between elb and ec2 instances if not present', async () => {
                const schema = require('./fixtures/relationships/loadBalancer/elb/instances.json');
                const {elb} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [elb]);
                const {relationships} = rels.find(r => r.resourceId === elb.resourceId);

                assert.deepEqual(relationships, []);
            });

            it('should add relationships between elb and ec2 instances if present', async () => {
                const schema = require('./fixtures/relationships/loadBalancer/elb/instances.json');
                const {ec2Instance1, ec2Instance2, elb} = generate(schema);

                const mockAwsClient = {
                    ...defaultMockAwsClient,
                    createElbClient() {
                        return {
                            getLoadBalancerInstances: async arn => [ec2Instance1.resourceId, ec2Instance2.resourceId]
                        }
                    }
                };

                const rels = await createAdditionalRelationships(mockAwsClient, [elb]);
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
                const schema = require('./fixtures/relationships/loadBalancer/alb/targetGroup/asg.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [
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
                const schema = require('./fixtures/relationships/loadBalancer/alb/targetGroup/asgAndInstances.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [
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
                const schema = require('./fixtures/relationships/loadBalancer/alb/targetGroup/lambda.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [
                    targetGroup, lambda
                ]);

                const {relationships} = rels.find(r => r.resourceId === targetGroup.resourceId);

                const actualLambdaRel = relationships.find(r => r.resourceId === lambda.resourceId);

                assert.deepEqual(actualLambdaRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: lambda.resourceId,
                    resourceType: AWS_LAMBDA_FUNCTION
                });
            });

            it('should add relationship with VPC', async () => {
                const schema = require('./fixtures/relationships/loadBalancer/alb/targetGroup/vpc.json');
                const {vpc, targetGroup} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [
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
                const schema = require('./fixtures/relationships/loadBalancer/alb/listeners/singleTargetGroup.json');
                const {alb, targetGroup, listener} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [listener]);

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
                const schema = require('./fixtures/relationships/loadBalancer/alb/listeners/multipleTargetGroups.json');
                const {targetGroup1, targetGroup2, listener} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [listener]);

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
                const schema = require('./fixtures/relationships/loadBalancer/alb/listeners/cognito.json');
                const {userPool, listener} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [listener]);

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
                const schema = require('./fixtures/relationships/iam/role/managedPolices.json');
                const {role, managedRole} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [role, managedRole]);

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
                const schema = require('./fixtures/relationships/iam/inlinePolicy/multipleStatement.json');
                const {policy, s3Bucket1, s3Bucket2} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [policy, s3Bucket1, s3Bucket2]);
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

        describe(AWS_IAM_USER, () => {

            it('should add relationships for managed policies', async () => {
                const schema = require('./fixtures/relationships/iam/user/managedPolicy.json');
                const {user, managedRole} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [user, managedRole]);

                const {relationships} = rels.find(r => r.resourceId === user.resourceId);
                const actualManagedRoleRel = relationships.find(r => r.arn === managedRole.arn);

                assert.deepEqual(actualManagedRoleRel, {
                    relationshipName: IS_ATTACHED_TO,
                    arn: managedRole.arn,
                    resourceType: AWS_IAM_AWS_MANAGED_POLICY
                });
            });

        });

        describe(AWS_RDS_DB_INSTANCE, () => {

            it('should add VPC relationships for RDS DB instances', async () => {
                const schema = require('./fixtures/relationships/rds/instance/vpc.json');
                const {dbInstance, $constants} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [dbInstance]);

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

        describe(AWS_EC2_SPOT_FLEET, () => {

            it('should not add relationships when no load balancers config present', async () => {
                const schema = require('./fixtures/relationships/ec2/spotfleet/noLb.json');
                const {spotFleet} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [spotFleet]);

                const {relationships} = rels.find(r => r.resourceType === AWS_EC2_SPOT_FLEET);

                assert.deepEqual(relationships, []);
            });

            it('should add relationship between ELBs and spot fleets', async () => {
                const schema = require('./fixtures/relationships/ec2/spotfleet/elb.json');
                const {elb, spotFleet} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [spotFleet]);

                const {relationships} = rels.find(r => r.resourceType === AWS_EC2_SPOT_FLEET);

                const actualTgRel = relationships.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER);

                assert.deepEqual(actualTgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: elb.resourceId,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER,
                    awsRegion: elb.awsRegion
                });
            });

            it('should add relationship between ALBs and spot fleets', async () => {
                const schema = require('./fixtures/relationships/ec2/spotfleet/alb.json');
                const {targetGroup, spotFleet} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [targetGroup, spotFleet]);

                const {relationships} = rels.find(r => r.resourceType === AWS_EC2_SPOT_FLEET);

                const actualTgRel = relationships.find(r => r.resourceType === AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP);

                assert.deepEqual(actualTgRel, {
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: targetGroup.resourceId,
                    resourceType: AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP
                });
            });

        });

        describe(AWS_SNS_TOPIC, () => {

            it('should ignore relationships to undiscovered resources', async () => {
                const schema = require('./fixtures/relationships/sns/lambda/undiscovered.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [snsTopic]);

                const {relationships} = rels.find(r => r.resourceType === AWS_SNS_TOPIC);

                assert.deepEqual(relationships, []);
            });

            it('should add additional relationships to Lambda functions', async () => {
                const schema = require('./fixtures/relationships/sns/lambda/sameRegion.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [snsTopic, lambda]);

                const {relationships} = rels.find(r => r.resourceType === AWS_SNS_TOPIC);
                const actualLambdaRel = relationships.find(r => r.arn === lambda.arn);

                assert.deepEqual(actualLambdaRel, {
                    arn: lambda.arn,
                    resourceType: AWS_LAMBDA_FUNCTION,
                    relationshipName: IS_ASSOCIATED_WITH
                });
            });

            it('should add additional relationships to SQS queues', async () => {
                const schema = require('./fixtures/relationships/sns/sqs/differentRegion.json');
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

                const rels = await createAdditionalRelationships(mockAwsClient, [snsTopic, sqs]);

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
                const schema = require('./fixtures/relationships/codebuild/project/role.json');
                const {serviceRole, project} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [serviceRole, project]);

                const {relationships} = rels.find(r => r.resourceId === project.resourceId);
                const actualRoleRel = relationships.find(r => r.arn === serviceRole.arn);

                assert.deepEqual(actualRoleRel, {
                    relationshipName: IS_ASSOCIATED_WITH + ROLE,
                    arn: serviceRole.arn,
                    resourceType: AWS_IAM_ROLE
                })
            });

            it('should add VPC relationships for CodeBuild projects', async () => {
                const schema = require('./fixtures/relationships/codebuild/project/vpc.json');
                const {vpc, subnet1, subnet2, securityGroup, project} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [subnet1, subnet2, project]);

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
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                })
            });

        });

        describe(AWS_OPENSEARCH_DOMAIN, () => {

            it('should add VPC relationships for OpenSearch domains', async () => {
                const schema = require('./fixtures/relationships/opensearch/domain/vpc.json');
                const {vpc, subnet1, subnet2, securityGroup, domain} = generate(schema);

                const rels = await createAdditionalRelationships(defaultMockAwsClient, [domain]);

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
                    relationshipName: IS_ASSOCIATED_WITH,
                    resourceId: securityGroup.resourceId,
                    resourceType: AWS_EC2_SECURITY_GROUP
                });
            });

        });

    });

});