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
        const RoleArn = `arn:aws:iam::${ACCOUNT_X}:role/service-role/AmazonBedrockExecutionRoleForKnowledgeBase`;
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                RoleArn,
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
            r => r.arn === RoleArn,
        );

        assert.deepEqual(roleRelationship, {
            relationshipName: IS_ASSOCIATED_WITH + 'Role',
            arn: RoleArn
        });
    });

    it('should add relationship for Kendra index', async () => {
        const KendraIndexArn = `arn:aws:kendra:us-east-1:${ACCOUNT_X}:index/idx-12345abcdef`;
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                KnowledgeBaseConfiguration: {
                    KendraIndexArn,
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
            r => r.arn === KendraIndexArn,
        );

        assert.deepEqual(kendraIndexRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: KendraIndexArn
        });
    });

    it('should add relationship for RDS clusters', async () => {
        const ResourceArn = `arn:aws:rds:us-east-1:${ACCOUNT_X}:cluster:aurora-cluster-1`;
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                StorageConfiguration: {
                    RdsConfiguration: {
                        ResourceArn,
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
            r => r.arn === ResourceArn,
        );

        assert.deepEqual(rdsClusterRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: ResourceArn
        });
    });

    it('should add relationship for OpenSearch Serverless collections', async () => {
        const CollectionArn = `arn:aws:aoss:us-east-1:${ACCOUNT_X}:collection/my-collection`;
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                StorageConfiguration: {
                    OpensearchServerlessConfiguration: {
                        CollectionArn,
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
            r => r.arn === CollectionArn,
        );

        assert.deepEqual(collectionRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: CollectionArn
        });
    });

    it('should add relationships for Redshift clusters', async () => {
        const ClusterIdentifier = 'redshift-cluster-1';
        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                SqlKnowledgeBaseConfiguration: {
                    RedshiftConfiguration: {
                        QueryEngineConfiguration: {
                            ClusterIdentifier,
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
            r => r.resourceId === ClusterIdentifier,
        );

        assert.deepEqual(redshiftRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_REDSHIFT_CLUSTER,
            resourceId: ClusterIdentifier
        });
    });

    it('should add relationship for data storage S3 buckets', async () => {
        const bucketName1 = 'vector-kb-bucket-1';
        const bucketName2 = 'vector-kb-bucket-2';
        const bucketArn1 = `arn:aws:s3:::${bucketName1}`;
        const bucketArn2 = `arn:aws:s3:::${bucketName2}`;

        const mockKnowledgeBase = generateBedrockKnowledgeBase({
            configuration: {
                VectorKnowledgeBaseConfiguration: {
                    SupplementalDataStorageConfiguration: {
                        StorageLocations: [
                            {
                                S3Location: `s3://${bucketName1}/path/to/data`
                            },
                            {
                                S3Location: `s3://${bucketName2}/other/path`
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