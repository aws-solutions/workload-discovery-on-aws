// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {assert} = require('chai');
const R = require('ramda');
const {generateBaseResource} = require('../generator');
const {createSaveObject} = require('../../src/lib/persistence/transformers');
const {
    AWS_API_GATEWAY_METHOD,
    AWS_API_GATEWAY_RESOURCE,
    AWS_ECS_TASK,
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER,
    AWS_EKS_NODE_GROUP,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_IAM_AWS_MANAGED_POLICY,
    AWS_LAMBDA_FUNCTION,
    AWS_EC2_SPOT,
    AWS_EC2_SPOT_FLEET,
    AWS_IAM_INLINE_POLICY,
    AWS_OPENSEARCH_DOMAIN,
    AWS_AUTOSCALING_AUTOSCALING_GROUP,
    AWS_API_GATEWAY_REST_API,
    AWS_IAM_ROLE,
    AWS_IAM_GROUP,
    AWS_IAM_USER,
    AWS_IAM_POLICY,
    AWS_S3_BUCKET
} = require("../../src/lib/constants");

describe('persistence/transformers', () => {

    describe('createSaveObject', () => {

        describe('hashing', () => {

            [
                [AWS_API_GATEWAY_METHOD, 'e77a45b311fc1a9fa083d959fef13cf1'],
                [AWS_API_GATEWAY_RESOURCE, '49e48e16ca5f6dc8205d6b4e5a28760d'],
                [AWS_ECS_TASK, '24b51c39cf2f472cdb96bcd5bc4bb87a'],
                [AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER, '0a6a70f85bdac8608bb4b3e0f917ce64'],
                [AWS_EKS_NODE_GROUP, '288a15ee94f1278f5f50783b4521e810'],
                [AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP, 'aeed86caaad0d80172a51d94c5547fe2'],
                [AWS_IAM_AWS_MANAGED_POLICY, '1a18a8a6f9f4863fd603c4ce93491a37'],
                [AWS_EC2_SPOT, 'ad454ecd37a904ba2b33ff07aac54106'],
                [AWS_EC2_SPOT_FLEET, 'e5c1ab47ac15a1e6c39480bb2265a221'],
                [AWS_IAM_INLINE_POLICY, '9be3badedb6f62a7a6e48f19dc1702c8'],
                [AWS_OPENSEARCH_DOMAIN, '183f22ba18a821428718cd8c1db3d467']
            ].forEach(([resourceType, hash], i) => {
                it(`should hash ${resourceType} resources`, () => {
                    const resource = generateBaseResource(resourceType, i);

                    const actual = createSaveObject(resource);
                    assert.strictEqual(actual.md5Hash, hash);
                });
            });

        });

        describe('title', () => {

            it('should use name tag for title if present', () => {
                const resource = generateBaseResource(AWS_LAMBDA_FUNCTION, 1);

                const actual = createSaveObject({...resource, tags: [{key: 'Name', value: 'testName'}]});
                assert.strictEqual(actual.properties.title, 'testName');
            });

            it('should fall back to resource name if name tag not present', () => {
                const resource = generateBaseResource(AWS_LAMBDA_FUNCTION, 1);

                const actual = createSaveObject({...resource, resourceName: 'resourceName'});
                assert.strictEqual(actual.properties.title, 'resourceName');
            });

            it('should fall back to resource id if resource name or name tag not present', () => {
                const resource = generateBaseResource(AWS_LAMBDA_FUNCTION, 1);

                const actual = createSaveObject(R.omit(['resourceName'], resource));
                assert.strictEqual(actual.properties.title, 'resourceId1');
            });

            it('should use the target group id for an ALB title', () => {
                const resource = generateBaseResource(AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP, 1);

                const actual = createSaveObject({...resource, arn: 'arn:aws:elasticloadbalancing:us-west-2:xxxxxxxxxxxx:targetgroup/my-targets/73e2d6bc24d8a067'});
                assert.strictEqual(actual.properties.title, 'targetgroup/my-targets/73e2d6bc24d8a067');
            });

            it('should use the listener id for an ALB title', () => {
                const resource = generateBaseResource(AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER, 1);

                const actual = createSaveObject({...resource, arn: 'arn:aws:elasticloadbalancing:us-west-2:xxxxxxxxxxxx:listener/app/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2'});
                assert.strictEqual(actual.properties.title, 'listener/app/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2');
            });

            it('should use the listener id for an ASG title', () => {
                const resource = generateBaseResource(AWS_AUTOSCALING_AUTOSCALING_GROUP, 1);

                const actual = createSaveObject({...resource, arn: 'arn:aws:autoscaling:eu-west-1:xxxxxxxxxxxx:autoScalingGroup:123e4567-e89b-12d3-a456-426614174000:autoScalingGroupName/asg-name'});
                assert.strictEqual(actual.properties.title, 'asg-name');
            });

        });

        describe('logins', () => {

            [
                [AWS_API_GATEWAY_REST_API, {id: 'restId'}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/restId/resources',
                    expectedLoggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/restId/resources'
                }],
                [AWS_API_GATEWAY_RESOURCE, {id: 'apiGwResourceId', RestApiId: 'restId'}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/restId/resources/apiGwResourceId',
                    expectedLoggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/restId/resources/apiGwResourceId'
                }],
                [AWS_API_GATEWAY_METHOD, {httpMethod: 'GET', ResourceId: 'apiGwResourceId', RestApiId: 'restId'}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/restId/resources/apiGwResourceId/GET',
                    expectedLoggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/restId/resources/apiGwResourceId/GET'
                }],
                [AWS_AUTOSCALING_AUTOSCALING_GROUP, {}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/ec2/autoscaling/home?region=eu-west-1#AutoScalingGroups:id=resourceName3;view=details',
                    expectedLoggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/home/autoscaling/home?region=eu-west-1#AutoScalingGroups:id=resourceName3;view=details'
                }],
                [AWS_LAMBDA_FUNCTION, {}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/resourceName4?tab=graph',
                    expectedLoggedInURL: 'https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/resourceName4?tab=graph'
                }],
                [AWS_IAM_ROLE, {}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/iam?home?#/roles',
                    expectedLoggedInURL: 'https://console.aws.amazon.com/iam/home?#/roles'
                }],
                [AWS_IAM_GROUP, {}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/iam?home?#/groups',
                    expectedLoggedInURL: 'https://console.aws.amazon.com/iam/home?#/groups'
                }],
                [AWS_IAM_USER, {}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/iam?home?#/users',
                    expectedLoggedInURL: 'https://console.aws.amazon.com/iam/home?#/users'
                }],
                [AWS_IAM_POLICY, {}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/iam?home?#/policies',
                    expectedLoggedInURL: 'https://console.aws.amazon.com/iam/home?#/policies'
                }],
                [AWS_S3_BUCKET, {}, {
                    expectedLoginUrl: 'https://xxxxxxxxxxxx.signin.aws.amazon.com/console/s3?bucket=resourceName9',
                    expectedLoggedInURL: 'https://s3.console.aws.amazon.com/s3/buckets/resourceName9/?region=eu-west-1'
                }]
            ].forEach(([resourceType, configuration, {expectedLoginUrl, expectedLoggedInURL}], i) => {
                it(`should create logins for ${resourceType}`, () => {
                    const resource = generateBaseResource(resourceType, i);

                    const actual = createSaveObject({...resource, configuration});
                    assert.strictEqual(actual.properties.loginURL, expectedLoginUrl);
                    assert.strictEqual(actual.properties.loggedInURL, expectedLoggedInURL);
                });
            });


        });

    });
});