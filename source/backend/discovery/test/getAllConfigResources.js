// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {assert} = require('chai');
const sinon = require('sinon');
const {
    AWS_EC2_INSTANCE,
    AWS_EKS_CLUSTER,
    AWS_IAM_ROLE,
    GLOBAL,
    AWS_ECS_SERVICE,
    AWS_KINESIS_STREAM,
    AWS_ECS_TASK_DEFINITION,
} = require('../src/lib/constants');
const getAllConfigResources = require('../src/lib/aggregator/getAllConfigResources');

describe('getAllConfigResources', () => {

    const ACCOUNT_IDX = 'xxxxxxxxxxxx';
    const EU_WEST_1 = 'eu-west-1';

    const DATE1 = '2014-04-09T01:05:00.000Z';
    const DATE2 = '2011-06-21T18:40:00.000Z';

    const aggregatorName = 'configAggregator';

    it('should not remove global resources from discovered accounts', async () => {
        const mockConfigClient = {
            async getAllAggregatorResources() {
                return [
                    {
                        accountId: ACCOUNT_IDX, awsRegion: GLOBAL, resourceType: AWS_IAM_ROLE,
                        arn: 'roleArn', resourceId: 'roleResourceId', configuration: {},
                        configurationItemCaptureTime: DATE1
                    },
                    {
                        accountId: ACCOUNT_IDX, awsRegion: EU_WEST_1, resourceType: AWS_EC2_INSTANCE,
                        arn: 'ec2InstanceArn', resourceId: 'ec2InstanceResourceId', configuration: {},
                        configurationItemCaptureTime: DATE2
                    }
                ]
            },
            getAggregatorResources: () => []
        }

        const actual = await getAllConfigResources(mockConfigClient, aggregatorName);
        assert.lengthOf(actual, 2);
    });

    it('should normalise resources', async () => {
        const mockConfigClient = {
            async getAllAggregatorResources() {
                return []
            },
            getAggregatorResources: sinon.stub().onFirstCall().resolves([
                {
                    accountId: ACCOUNT_IDX, awsRegion: EU_WEST_1, resourceType: AWS_ECS_SERVICE,
                    arn: 'ecsServiceArn', resourceId: 'ecsServiceResourceId', configuration: '{"a": 1}',
                    configurationItemCaptureTime: new Date(DATE1)
                }
            ]).resolves([])
        }

        const actual = await getAllConfigResources(mockConfigClient, aggregatorName);
        const actualEcsService = actual.find(x => x.arn === 'ecsServiceArn');
        assert.deepEqual(actualEcsService, {
            id: "ecsServiceArn", accountId: ACCOUNT_IDX, awsRegion: EU_WEST_1, resourceType: AWS_ECS_SERVICE,
            arn: 'ecsServiceArn', resourceId: 'ecsServiceResourceId', configuration: {a: 1},
            configurationItemCaptureTime: DATE1, relationships: [], tags: []
        });
    });


    it('should create a unique resourceId for Kinesis streams, EKS Clusters and ECS Task definitions', async () => {
        const mockConfigClient = {
            async getAllAggregatorResources() {
                return []
            },
            getAggregatorResources: sinon.stub().onFirstCall().resolves([
                {
                    accountId: ACCOUNT_IDX, awsRegion: EU_WEST_1, resourceType: AWS_KINESIS_STREAM,
                    arn: 'kinesisArn', resourceId: 'kinesisResourceId', configuration: '{"a": 1}',
                    configurationItemCaptureTime: new Date(DATE1)
                },
                {
                    accountId: ACCOUNT_IDX, awsRegion: EU_WEST_1, resourceType: AWS_EKS_CLUSTER,
                    arn: 'eksClusterArn', resourceId: 'eksClusterResourceId', configuration: '{"b": 1}',
                    configurationItemCaptureTime: new Date(DATE2)
                },
                {
                    accountId: ACCOUNT_IDX, awsRegion: EU_WEST_1, resourceType: AWS_ECS_TASK_DEFINITION,
                    arn: 'ecsTaskDefArn', resourceId: 'ecsTaskDefResourceId', configuration: '{"c": 1}',
                    configurationItemCaptureTime: new Date(DATE2)
                }
            ]).resolves([])
        }

        const actual = await getAllConfigResources(mockConfigClient, aggregatorName);

        const actualKinesis = actual.find(x => x.resourceType === AWS_KINESIS_STREAM);
        const actualEcsCluster = actual.find(x => x.resourceType === AWS_EKS_CLUSTER);
        const actualEcsTaskDef = actual.find(x => x.resourceType === AWS_ECS_TASK_DEFINITION);

        assert.strictEqual(actualKinesis.resourceId, 'kinesisArn');
        assert.strictEqual(actualEcsCluster.resourceId, 'eksClusterArn');
        assert.strictEqual(actualEcsTaskDef.resourceId, 'ecsTaskDefArn');
    });

});
