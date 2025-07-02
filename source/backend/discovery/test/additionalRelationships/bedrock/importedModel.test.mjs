import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_BEDROCK_IMPORTED_MODEL,
    IS_ASSOCIATED_WITH,
    S3,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateBedrockImportedModel(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};

    const modelId = `random-bedrock-model-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:bedrock:${region}:${accountId}:imported-model/${modelId}`,
        resourceType: 'AWS::Bedrock::ImportedModel',
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

describe(`addAdditionalRelationships - ${AWS_BEDROCK_IMPORTED_MODEL}`, () => {

    it('should add relationship for modelKmsKeyArn', async () => {
        const modelKmsKeyArn = `arn:aws:kms:us-east-1:${ACCOUNT_X}:key/1234abcd-12ab-34cd-56ef-1234567890ab`;
        const mockModel = generateBedrockImportedModel({
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
            arn: modelKmsKeyArn
        });
    });

    it('should add relationship for model data source S3 bucket', async () => {
        const bucketName = 'model-bucket';
        const bucketArn = `arn:aws:s3:::${bucketName}`;
        const mockModel = generateBedrockImportedModel({
            configuration: {
                modelDataSource: {
                    s3DataSource: {
                        s3Uri: `s3://${bucketName}/models/mymodel.tar.gz`,
                    }
                }
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
            arn: bucketArn
        });
    });

    it('should handle missing s3DataSource in modelDataSource', async () => {
        const mockModel = generateBedrockImportedModel({
            configuration: {
                modelDataSource: {
                }
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

    it('should handle invalid s3Uri format', async () => {
        const mockModel = generateBedrockImportedModel({
            configuration: {
                modelDataSource: {
                    s3DataSource: {
                        s3Uri: `invalid-uri-format`
                    }
                }
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
