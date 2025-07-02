import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_BEDROCK_AGENT,
    AWS_BEDROCK_FOUNDATION_MODEL,
    IS_ASSOCIATED_WITH,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateBedrockAgent(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};
    const agentId = `agent-${generateRandomInt(0, 10000)}`;
    const agentName = `agent-name-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:bedrock:${region}:${accountId}:agent/${agentId}`,
        resourceType: AWS_BEDROCK_AGENT,
        resourceId: agentId,
        resourceName: agentName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_BEDROCK_AGENT}`, () => {

    it('should add relationship for IAM role', async () => {
        const roleArn = `arn:aws:iam::${ACCOUNT_X}:role/service-role/AmazonBedrockExecutionRoleForAgent`;
        const mockAgent = generateBedrockAgent({
            configuration: {
                agentResourceRoleArn: roleArn,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockAgent],
        );

        const {relationships} = resources.find(
            r => r.arn === mockAgent.arn,
        );

        const roleRelationship = relationships.find(
            r => r.arn === roleArn,
        );

        assert.deepEqual(roleRelationship, {
            relationshipName: IS_ASSOCIATED_WITH + 'Role',
            arn: roleArn
        });
    });

    it('should add relationship for Foundation Model as resource ID)', async () => {
        const foundationModelId = 'anthropic.claude-v2';

        const mockAgent = generateBedrockAgent({
            configuration: {
                foundationModel: foundationModelId,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockAgent],
        );

        const resourceIdAgent = resources.find(
            r => r.arn === mockAgent.arn,
        );
        const resourceIdRelationship = resourceIdAgent.relationships.find(
            r => r.resourceId === foundationModelId,
        );

        assert.deepEqual(resourceIdRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_BEDROCK_FOUNDATION_MODEL,
            resourceId: foundationModelId
        });
    });

    it('should add relationship for Foundation Model as ARN', async () => {
        const foundationModelId = 'anthropic.claude-v2';
        const foundationModelArn = `arn:aws:bedrock:us-east-1::foundation-model/${foundationModelId}`;

        const mockAgent = generateBedrockAgent({
            configuration: {
                foundationModel: foundationModelArn,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockAgent],
        );

        const arnAgent = resources.find(
            r => r.arn === mockAgent.arn,
        );
        const arnRelationship = arnAgent.relationships.find(
            r => r.arn === foundationModelArn,
        );
        assert.deepEqual(arnRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: foundationModelArn
        });
    });

    it('should add relationship for prompt configuration foundation models (ARN and resource ID)', async () => {
        const foundationModelId = 'anthropic.claude-v2';
        const foundationModelArn = `arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-express-v1`;

        const mockAgent = generateBedrockAgent({
            configuration: {
                promptOverrideConfiguration: {
                    promptConfigurations: [
                        {
                            foundationModel: foundationModelId,
                            promptType: 'PRE_PROCESSING'
                        },
                        {
                            foundationModel: foundationModelArn,
                            promptType: 'POST_PROCESSING'
                        }
                    ]
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockAgent],
        );

        const {relationships} = resources.find(
            r => r.arn === mockAgent.arn,
        );

        const resourceIdRelationship = relationships.find(
            r => r.resourceId === foundationModelId,
        );

        assert.deepEqual(resourceIdRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_BEDROCK_FOUNDATION_MODEL,
            resourceId: foundationModelId
        });

        const arnRelationship = relationships.find(
            r => r.arn === foundationModelArn,
        );
        assert.deepEqual(arnRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: foundationModelArn
        });
    });

    it('should add relationship for Lambda override function', async () => {
        const lambdaArn = `arn:aws:lambda:us-east-1:${ACCOUNT_X}:function:my-override-function`;
        const mockAgent = generateBedrockAgent({
            configuration: {
                promptOverrideConfiguration: {
                    overrideLambda: lambdaArn
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockAgent],
        );

        const {relationships} = resources.find(
            r => r.arn === mockAgent.arn,
        );

        const lambdaRelationship = relationships.find(
            r => r.arn === lambdaArn,
        );

        assert.deepEqual(lambdaRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: lambdaArn
        });
    });

    it('should add relationship for KMS key', async () => {
        const kmsKeyArn = `arn:aws:kms:us-east-1:${ACCOUNT_X}:key/1234abcd-12ab-34cd-56ef-1234567890ab`;
        const mockAgent = generateBedrockAgent({
            configuration: {
                customerEncryptionKeyArn: kmsKeyArn
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockAgent],
        );

        const {relationships} = resources.find(
            r => r.arn === mockAgent.arn,
        );

        const kmsKeyRelationship = relationships.find(
            r => r.arn === kmsKeyArn,
        );

        assert.deepEqual(kmsKeyRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: kmsKeyArn
        });
    });

    it('should add relationship for Lambda function in custom orchestration', async () => {
        const lambdaArn = `arn:aws:lambda:us-east-1:${ACCOUNT_X}:function:my-orchestration-function`;
        const mockAgent = generateBedrockAgent({
            configuration: {
                customOrchestration: {
                    executor: {
                        lambda: lambdaArn
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockAgent],
        );

        const {relationships} = resources.find(
            r => r.arn === mockAgent.arn,
        );

        const lambdaRelationship = relationships.find(
            r => r.arn === lambdaArn,
        );

        assert.deepEqual(lambdaRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: lambdaArn
        });
    });

});