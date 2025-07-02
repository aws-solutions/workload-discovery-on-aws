import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_BEDROCK_DATA_SOURCE,
    AWS_BEDROCK_KNOWLEDGE_BASE,
    AWS_LAMBDA_FUNCTION,
    AWS_S3_BUCKET,
    IS_ASSOCIATED_WITH,
    IS_CONTAINED_IN,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateBedrockDataSource(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};
    const dataSourceId = `ds-${generateRandomInt(0, 10000)}`;
    const knowledgeBaseId = options.knowledgeBaseId ?? `kb-${generateRandomInt(0, 10000)}`;
    const dataSourceName = `data-source-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:bedrock:${region}:${accountId}:knowledge-base/${knowledgeBaseId}/data-source/${dataSourceId}`,
        resourceType: AWS_BEDROCK_DATA_SOURCE,
        resourceId: dataSourceId,
        resourceName: dataSourceName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration: configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_BEDROCK_DATA_SOURCE}`, () => {

    it('should add relationship for KnowledgeBase', async () => {
        const knowledgeBaseId = `kb-${generateRandomInt(0, 10000)}`;
        const mockDataSource = generateBedrockDataSource({
            knowledgeBaseId,
            configuration: {
                knowledgeBaseId,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const knowledgeBaseRelationship = relationships.find(
            r => r.resourceId === knowledgeBaseId,
        );

        assert.deepEqual(knowledgeBaseRelationship, {
            relationshipName: IS_CONTAINED_IN,
            resourceType: AWS_BEDROCK_KNOWLEDGE_BASE,
            resourceId: knowledgeBaseId
        });
    });

    it('should add relationship for KMS key', async () => {
        const kmsKeyArn = `arn:aws:kms:us-east-1:${ACCOUNT_X}:key/12345678-1234-1234-1234-123456789012`;
        const mockDataSource = generateBedrockDataSource({
            configuration: {
                serverSideEncryptionConfiguration: {
                    kmsKeyArn,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const kmsKeyRelationship = relationships.find(
            r => r.arn === kmsKeyArn,
        );

        assert.deepEqual(kmsKeyRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: kmsKeyArn
        });
    });

    it('should add relationship for S3 bucket', async () => {
        const bucketArn = `arn:aws:s3:::bedrock-datasource-bucket`;
        const mockDataSource = generateBedrockDataSource({
            configuration: {
                dataSourceConfiguration: {
                    s3Configuration: {
                        bucketArn,
                    },
                    type: 's3'
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const bucketRelationship = relationships.find(
            r => r.arn === bucketArn,
        );

        assert.deepEqual(bucketRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucketArn
        });
    });

    it('should add relationship for Confluence credentials secret', async () => {
        const secretArn = `arn:aws:secretsmanager:us-east-1:${ACCOUNT_X}:secret:confluence-credentials`;
        const mockDataSource = generateBedrockDataSource({
            configuration: {
                dataSourceConfiguration: {
                    confluenceConfiguration: {
                        sourceConfiguration: {
                            credentialsSecretArn: secretArn,
                            authType: 'BASIC',
                            hostType: 'CLOUD',
                            hostUrl: 'https://example.atlassian.net'
                        }
                    },
                    type: 'CONFLUENCE'
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const secretRelationship = relationships.find(
            r => r.arn === secretArn,
        );

        assert.deepEqual(secretRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: secretArn
        });
    });

    it('should add relationship for Salesforce credentials secret', async () => {
        const secretArn = `arn:aws:secretsmanager:us-east-1:${ACCOUNT_X}:secret:salesforce-credentials`;
        const mockDataSource = generateBedrockDataSource({
            configuration: {
                dataSourceConfiguration: {
                    salesforceConfiguration: {
                        sourceConfiguration: {
                            credentialsSecretArn: secretArn,
                            authType: 'OAUTH2',
                            hostUrl: 'https://example.salesforce.com'
                        }
                    },
                    type: 'SALESFORCE'
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const secretRelationship = relationships.find(
            r => r.arn === secretArn,
        );

        assert.deepEqual(secretRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: secretArn
        });
    });

    it('should add relationship for SharePoint credentials secret', async () => {
        const secretArn = `arn:aws:secretsmanager:us-east-1:${ACCOUNT_X}:secret:sharepoint-credentials`;
        const mockDataSource = generateBedrockDataSource({
            configuration: {
                dataSourceConfiguration: {
                    sharePointConfiguration: {
                        sourceConfiguration: {
                            credentialsSecretArn: secretArn,
                            authType: 'OAUTH2',
                            hostType: 'ONLINE',
                            domain: 'example.sharepoint.com',
                            tenantId: 'tenant-id',
                            siteUrls: ['https://example.sharepoint.com/sites/site1']
                        }
                    },
                    type: 'SHAREPOINT'
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const secretRelationship = relationships.find(
            r => r.arn === secretArn,
        );

        assert.deepEqual(secretRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: secretArn
        });
    });

    it('should add relationship for Lambda transformation functions', async () => {
        const lambdaArn1 = `arn:aws:lambda:us-east-1:${ACCOUNT_X}:function:bedrock-transformation-function`;
        const lambdaArn2 = `arn:aws:lambda:us-east-1:${ACCOUNT_X}:function:bedrock-transformation-function2`;
        const mockDataSource = generateBedrockDataSource({
            configuration: {
                vectorIngestionConfiguration: {
                    customTransformationConfiguration: {
                        transformations: [
                            {
                                stepToApply: 'PRE_EXTRACTION',
                                transformationFunction: {
                                    transformationLambdaConfiguration: {
                                        lambdaArn: lambdaArn1,
                                    }
                                }
                            },
                            {
                                stepToApply: 'PRE_EXTRACTION',
                                transformationFunction: {
                                    transformationLambdaConfiguration: {
                                        lambdaArn: lambdaArn2,
                                    }
                                }
                            },
                        ]
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const lambdaRelationship1 = relationships.find(
            r => r.arn === lambdaArn1,
        );

        const lambdaRelationship2 = relationships.find(
            r => r.arn === lambdaArn2,
        );

        assert.deepEqual(lambdaRelationship1, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: lambdaArn1
        });
        assert.deepEqual(lambdaRelationship2, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: lambdaArn2
        });
    });

    it('should add relationship for Bedrock foundation models in context enrichment', async () => {
        const modelArn = `arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2`;
        const mockDataSource = generateBedrockDataSource({
            configuration: {
                vectorIngestionConfiguration: {
                    contextEnrichmentConfiguration: {
                        bedrockFoundationModelConfiguration: {
                            modelArn,
                            enrichmentStrategyConfiguration: {
                                method: 'SUMMARIZATION'
                            }
                        },
                        type: 'BEDROCK_FOUNDATION_MODEL'
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const modelRelationship = relationships.find(
            r => r.arn === modelArn,
        );

        assert.deepEqual(modelRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: modelArn
        });
    });

    it('should add relationship for Bedrock foundation models in parsing configuration', async () => {
        const modelArn = `arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2`;
        const mockDataSource = generateBedrockDataSource({
            configuration: {
                vectorIngestionConfiguration: {
                    parsingConfiguration: {
                        bedrockFoundationModelConfiguration: {
                            modelArn,
                            parsingModality: 'TEXT',
                            parsingPrompt: {
                                parsingPromptText: 'Extract the following information from the document'
                            }
                        },
                        parsingStrategy: 'BEDROCK_FOUNDATION_MODEL'
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDataSource],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDataSource.arn,
        );

        const modelRelationship = relationships.find(
            r => r.arn === modelArn,
        );

        assert.deepEqual(modelRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: modelArn
        });
    });
});
