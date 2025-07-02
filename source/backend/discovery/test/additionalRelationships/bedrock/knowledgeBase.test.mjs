import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_BEDROCK_KNOWLEDGE_BASE,
    AWS_REDSHIFT_CLUSTER,
    IS_ASSOCIATED_WITH,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateBedrockKnowledgeBase(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};
    const knowledgeBaseId = `kb-${generateRandomInt(0, 10000)}`;
    const knowledgeBaseName = `knowledge-base-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:bedrock:${region}:${accountId}:knowledge-base/${knowledgeBaseId}`,
        resourceType: AWS_BEDROCK_KNOWLEDGE_BASE,
        resourceId: knowledgeBaseId,
        resourceName: knowledgeBaseName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_BEDROCK_KNOWLEDGE_BASE}`, () => {

    it('should add relationship for IAM role', async () => {
        const roleArn = `arn:aws:iam::${ACCOUNT_X}:role/service-role/AmazonBedrockExecutionRoleForKnowledgeBase`;
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                roleArn,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockKnowledgeBase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockKnowledgeBase.arn,
        );

        const roleRelationship = relationships.find(
            r => r.arn === roleArn,
        );

        assert.deepEqual(roleRelationship, {
            relationshipName: IS_ASSOCIATED_WITH + 'Role',
            arn: roleArn
        });
    });

    it('should add relationship for Kendra index', async () => {
        const kendraIndexArn = `arn:aws:kendra:us-east-1:${ACCOUNT_X}:index/idx-12345abcdef`;
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                knowledgeBaseConfiguration: {
                    kendraIndexArn,
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockKnowledgeBase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockKnowledgeBase.arn,
        );

        const kendraIndexRelationship = relationships.find(
            r => r.arn === kendraIndexArn,
        );

        assert.deepEqual(kendraIndexRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: kendraIndexArn
        });
    });

    it('should add relationship for RDS clusters', async () => {
        const rdsClusterArn = `arn:aws:rds:us-east-1:${ACCOUNT_X}:cluster:aurora-cluster-1`;
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                storageConfiguration: {
                    rdsConfiguration: {
                        resourceArn: rdsClusterArn,
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockKnowledgeBase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockKnowledgeBase.arn,
        );

        const rdsClusterRelationship = relationships.find(
            r => r.arn === rdsClusterArn,
        );

        assert.deepEqual(rdsClusterRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: rdsClusterArn
        });
    });

    it('should add relationship for OpenSearch Serverless collections', async () => {
        const collectionArn = `arn:aws:aoss:us-east-1:${ACCOUNT_X}:collection/my-collection`;
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                storageConfiguration: {
                    opensearchServerlessConfiguration: {
                        collectionArn,
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockKnowledgeBase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockKnowledgeBase.arn,
        );

        const collectionRelationship = relationships.find(
            r => r.arn === collectionArn,
        );

        assert.deepEqual(collectionRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: collectionArn
        });
    });

    it('should add relationships for Redshift clusters', async () => {
        const clusterIdentifier = 'redshift-cluster-1';
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                sqlKnowledgeBaseConfiguration: {
                    redshiftConfiguration: {
                        queryEngineConfiguration: {
                            clusterIdentifier,
                        }
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockKnowledgeBase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockKnowledgeBase.arn,
        );

        const redshiftRelationship = relationships.find(
            r => r.resourceId === clusterIdentifier,
        );

        assert.deepEqual(redshiftRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_REDSHIFT_CLUSTER,
            resourceId: clusterIdentifier
        });
    });

    it('should add relationship for data storage S3 buckets', async () => {
        const bucketName1 = 'vector-kb-bucket-1';
        const bucketName2 = 'vector-kb-bucket-2';
        const bucketArn1 = `arn:aws:s3:::${bucketName1}`;
        const bucketArn2 = `arn:aws:s3:::${bucketName2}`;

        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                vectorKnowledgeBaseConfiguration: {
                    supplementalDataStorageConfiguration: {
                        storageLocations: [
                            {
                                s3Location: `s3://${bucketName1}/path/to/data`
                            },
                            {
                                s3Location: `s3://${bucketName2}/other/path`
                            }
                        ]
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockKnowledgeBase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockKnowledgeBase.arn,
        );

        const bucketRelationship1 = relationships.find(r => r.arn === bucketArn1);
        const bucketRelationship2 = relationships.find(r => r.arn === bucketArn2);

        assert.deepEqual(bucketRelationship1, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucketArn1
        });

        assert.deepEqual(bucketRelationship2, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucketArn2
        });
    });

});