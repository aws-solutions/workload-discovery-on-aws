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
                [AWS_API_GATEWAY_METHOD, 'e875a3a684a049abf3933492efad0b38'],
                [AWS_API_GATEWAY_RESOURCE, '41fd3cb04197699da0af314a76bfe7ac'],
                [AWS_ECS_TASK, '133e71d53825a340bd8923129015fc9e'],
                [AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER, '52409591c2d0415d8bf189f1b44990aa'],
                [AWS_EKS_NODE_GROUP, '5dfb4b4d38e82c5788ffc0a0aaceee94'],
                [AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP, 'a7c7eff80cac0518ade7e1c971bae94a'],
                [AWS_IAM_AWS_MANAGED_POLICY, '1ba3c55d4831be2edb0c6f46d2562a19'],
                [AWS_EC2_SPOT, 'd0d240a45a91f54a877c91e060b3ca0e'],
                [AWS_EC2_SPOT_FLEET, '5c7ca1f2c95d981004d9635047b52d0f'],
                [AWS_IAM_INLINE_POLICY, '45027638e2785cc2ee35617d20b7ca76'],
                [AWS_OPENSEARCH_DOMAIN, 'a584d1faee706c0d0c5c20b9a97c93ac']
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