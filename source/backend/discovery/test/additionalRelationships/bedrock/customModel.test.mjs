import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_BEDROCK_CUSTOM_MODEL,
    IS_ASSOCIATED_WITH,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateBedrockCustomModel(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};

    const modelId = `bedrock-model-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:bedrock:${region}:${accountId}:custom-model/${modelId}`,
        resourceType: AWS_BEDROCK_CUSTOM_MODEL,
        resourceId: modelId,
        resourceName: modelId,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_BEDROCK_CUSTOM_MODEL}`, () => {

    it('should add relationship for baseModelArn', async () => {
        const baseModelArn = `arn:aws:bedrock:us-east-1:${ACCOUNT_X}:foundation-model/amazon.titan-text-express-v1`;
        const mockModel = generateBedrockCustomModel({
            configuration: {
                baseModelArn,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockModel],
        );

        const {relationships} = resources.find(
            r => r.arn === mockModel.arn,
        );

        const baseModelRelationship = relationships.find(
            r => r.arn === baseModelArn,
        );

        assert.deepEqual(baseModelRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: baseModelArn,
        });
    });

    it('should add relationship for KMS key', async () => {
        const modelKmsKeyArn = `arn:aws:kms:us-east-1:${ACCOUNT_X}:key/1234abcd-12ab-34cd-56ef-1234567890ab`;
        const mockModel = generateBedrockCustomModel({
            configuration: {
                modelKmsKeyArn,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockModel],
        );

        const {relationships} = resources.find(
            r => r.arn === mockModel.arn,
        );

        const kmsKeyRelationship = relationships.find(
            r => r.arn === modelKmsKeyArn,
        );

        assert.deepEqual(kmsKeyRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: modelKmsKeyArn,
        });
    });

    it('should add relationship for training config S3 bucket', async () => {
        const bucketName = 'training-bucket';
        const bucketArn = `arn:aws:s3:::${bucketName}`;
        const mockModel = generateBedrockCustomModel({
            configuration: {
                trainingDataConfig: {
                    s3Uri: `s3://${bucketName}/training/data.jsonl`,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockModel],
        );

        const {relationships} = resources.find(
            r => r.arn === mockModel.arn,
        );

        const bucketRelationship = relationships.find(
            r => r.arn === bucketArn,
        );

        assert.deepEqual(bucketRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucketArn,
        });
    });

    it('should add relationships for validator S3 buckets', async () => {
        const bucket1Name = 'validation-bucket-1';
        const bucket1Arn = `arn:aws:s3:::${bucket1Name}`;
        const bucket2Name = 'validation-bucket-2';
        const bucket2Arn = `arn:aws:s3:::${bucket2Name}`;

        const mockModel = generateBedrockCustomModel({
            configuration: {
                validationDataConfig: {
                    validators: [
                        {
                            s3Uri: `s3://${bucket1Name}/validation/data1.jsonl`,
                            name: 'validator1',
                        },
                        {
                            s3Uri: `s3://${bucket2Name}/validation/data2.jsonl`,
                            name: 'validator2',
                        },
                    ],
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockModel],
        );

        const {relationships} = resources.find(
            r => r.arn === mockModel.arn,
        );

        const bucket1Relationship = relationships.find(
            r => r.arn === bucket1Arn,
        );
        const bucket2Relationship = relationships.find(
            r => r.arn === bucket2Arn,
        );

        assert.deepEqual(bucket1Relationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucket1Arn,
        });

        assert.deepEqual(bucket2Relationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucket2Arn,
        });
    });

    it('should handle invalid S3 URIs', async () => {
        const mockModel = generateBedrockCustomModel({
            configuration: {
                trainingDataConfig: {
                    s3Uri: `invalid`,
                },
                validationDataConfig: {
                    validators: [
                        {
                            s3Uri: `wrong`,
                            name: 'validator1',
                        },
                        {
                            s3Uri: `also wrong`,
                            name: 'validator2',
                        },
                    ],
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockModel],
        );

        const {relationships} = resources.find(
            r => r.arn === mockModel.arn,
        );

        assert.lengthOf(relationships, 0);
    });

});