const {assert} = require('chai');
const sinon = require('sinon');
const {
    AWS_OPENSEARCH_DOMAIN,
    AWS_EC2_INSTANCE,
    AWS_LAMBDA_FUNCTION,
    AWS_IAM_ROLE,
    GLOBAL,
    AWS_ECS_SERVICE, AWS_KINESIS_STREAM, AWS_ECS_CLUSTER, AWS_ECS_TASK_DEFINITION, AWS_EKS_CLUSTER
} = require('../src/lib/constants');
const getAllConfigResources = require('../src/lib/aggregator/getAllConfigResources');

describe('getAllConfigResources', () => {

    const ACCOUNT_IDX = 'xxxxxxxxxxxx';
    const ACCOUNT_IDZ = 'zzzzzzzzzzzz';
    const EU_WEST_1 = 'eu-west-1';
    const EU_WEST_2 = 'eu-west-2';
    const US_EAST_1 = 'us-east-1';

    const DATE1 = '2014-04-09T01:05:00.000Z';
    const DATE2 = '2011-06-21T18:40:00.000Z';

    const accountMap = new Map(
        [[
            'xxxxxxxxxxxx',
            {
                credentials: {
                    accessKeyId: 'accessKeyId',
                    secretAccessKey: 'secretAccessKey',
                    sessionToken: 'sessionToken'
                },
                regions: [
                    EU_WEST_1,
                    EU_WEST_2
                ]
            }
        ]]
    );

    const aggregatorName = 'configAggregator';

    it('should exclude exclude OpenSearch resource types', async () => {
        const mockConfigClient = {
            async getAllAggregatorResources() {
                return [
                    {
                        accountId: ACCOUNT_IDX, awsRegion: EU_WEST_1, resourceType: AWS_OPENSEARCH_DOMAIN,
                        arn: 'openSearchArn', resourceId: 'openSearchResourceId', configuration: {},
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

        const actual = await getAllConfigResources(mockConfigClient, accountMap, aggregatorName);
        assert.lengthOf(actual, 1);
        assert.lengthOf(actual.filter(x => x.resourceType === AWS_OPENSEARCH_DOMAIN), 0);
    });

    it('should remove resources from undiscovered regions', async () => {
        const mockConfigClient = {
            async getAllAggregatorResources() {
                return [
                    {
                        accountId: ACCOUNT_IDX, awsRegion: EU_WEST_1, resourceType: AWS_LAMBDA_FUNCTION,
                        arn: 'lambdaArn', resourceId: 'lambdaResourceId', configuration: {},
                        configurationItemCaptureTime: DATE1
                    },
                    {
                        accountId: ACCOUNT_IDX, awsRegion: US_EAST_1, resourceType: AWS_EC2_INSTANCE,
                        arn: 'ec2InstanceArn', resourceId: 'ec2InstanceResourceId', configuration: {},
                        configurationItemCaptureTime: DATE2
                    }
                ]
            },
            getAggregatorResources: () => []
        }

        const actual = await getAllConfigResources(mockConfigClient, accountMap, aggregatorName);
        assert.lengthOf(actual, 1);
        assert.lengthOf(actual.filter(x => x.awsRegion === US_EAST_1), 0);
    });

    it('should remove resources from undiscovered accounts', async () => {
        const mockConfigClient = {
            async getAllAggregatorResources() {
                return [
                    {
                        accountId: ACCOUNT_IDZ, awsRegion: EU_WEST_1, resourceType: AWS_LAMBDA_FUNCTION,
                        arn: 'lambdaArn', resourceId: 'lambdaResourceId', configuration: {},
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

        const actual = await getAllConfigResources(mockConfigClient, accountMap, aggregatorName);
        assert.lengthOf(actual, 1);
        assert.lengthOf(actual.filter(x => x.accountId === ACCOUNT_IDZ), 0);
    });

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

        const actual = await getAllConfigResources(mockConfigClient, accountMap, aggregatorName);
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

        const actual = await getAllConfigResources(mockConfigClient, accountMap, aggregatorName);
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

        const actual = await getAllConfigResources(mockConfigClient, accountMap, aggregatorName);

        const actualKinesis = actual.find(x => x.resourceType === AWS_KINESIS_STREAM);
        const actualEcsCluster = actual.find(x => x.resourceType === AWS_EKS_CLUSTER);
        const actualEcsTaskDef = actual.find(x => x.resourceType === AWS_ECS_TASK_DEFINITION);

        assert.strictEqual(actualKinesis.resourceId, 'kinesisArn');
        assert.strictEqual(actualEcsCluster.resourceId, 'eksClusterArn');
        assert.strictEqual(actualEcsTaskDef.resourceId, 'ecsTaskDefArn');
    });

});
