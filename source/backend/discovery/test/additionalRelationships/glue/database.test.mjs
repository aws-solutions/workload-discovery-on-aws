import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    ACCOUNT_Y,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_GLUE_DATABASE,
    AWS_S3_BUCKET,
    IS_ASSOCIATED_WITH,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateGlueDatabase(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};

    const databaseName = `random-glue-database-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:glue:${region}:${accountId}:database/${databaseName}`,
        resourceType: 'AWS::Glue::Database',
        resourceId: databaseName,
        resourceName: databaseName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_GLUE_DATABASE}`, () => {

    it('should add S3 bucket relationship when LocationUri is present', async () => {
        const bucket = 'test-data-bucket';
        const bucketArn = `arn:aws:s3:::${bucket}`;

        const mockDatabase = generateGlueDatabase({
            configuration: {
                LocationUri: `s3://${bucket}/databases/marketing/`,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDatabase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDatabase.arn,
        );

        const bucketRelationship = relationships.find(
            r => r.arn === bucketArn,
        );

        assert.deepEqual(bucketRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucketArn
        });
    });

    it('should add target database relationship in same account', async () => {
        const targetDbName = 'target-database';
        const targetDbArn = `arn:aws:glue:us-east-1:${ACCOUNT_X}:database/${targetDbName}`;

        const mockDatabase = generateGlueDatabase({
            configuration: {
                TargetDatabase: {
                    DatabaseName: targetDbName,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDatabase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDatabase.arn,
        );

        const targetDbRelationship = relationships.find(
            r => r.arn === targetDbArn,
        );

        assert.deepEqual(targetDbRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: targetDbArn
        });
    });

    it('should add target database relationship in different account and same region', async () => {
        const region = 'eu-west-1'
        const targetDbName = 'target-database';
        const targetAccountId = ACCOUNT_Y;
        const targetDbArn = `arn:aws:glue:${region}:${targetAccountId}:database/${targetDbName}`;

        const mockDatabase = generateGlueDatabase({
            region,
            configuration: {
                TargetDatabase: {
                    CatalogId: targetAccountId,
                    DatabaseName: targetDbName,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDatabase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDatabase.arn,
        );

        const targetDbRelationship = relationships.find(
            r => r.arn === targetDbArn,
        );

        assert.deepEqual(targetDbRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: targetDbArn,
        });
    });

    it('should add target database relationship in different region but same account', async () => {
        const targetDbName = 'target-database';
        const targetRegion = 'us-west-2';
        const targetDbArn = `arn:aws:glue:${targetRegion}:${ACCOUNT_X}:database/${targetDbName}`;

        const mockDatabase = generateGlueDatabase({
            configuration: {
                TargetDatabase: {
                    Region: targetRegion,
                    DatabaseName: targetDbName,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDatabase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDatabase.arn,
        );

        const targetDbRelationship = relationships.find(
            r => r.arn === targetDbArn,
        );

        assert.deepEqual(targetDbRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: targetDbArn,
        });
    });

    it('should add target database relationship in different account and region', async () => {
        const targetDbName = 'target-database';
        const targetAccountId = ACCOUNT_Y;
        const targetRegion = 'eu-west-1';
        const targetDbArn = `arn:aws:glue:${targetRegion}:${targetAccountId}:database/${targetDbName}`;

        const mockDatabase = generateGlueDatabase({
            configuration: {
                TargetDatabase: {
                    CatalogId: targetAccountId,
                    Region: targetRegion,
                    DatabaseName: targetDbName,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDatabase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDatabase.arn,
        );

        const targetDbRelationship = relationships.find(
            r => r.arn === targetDbArn,
        );

        assert.deepEqual(targetDbRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: targetDbArn,
        });
    });

    it('should handle non-S3 LocationUri', async () => {
        const mockDatabase = generateGlueDatabase({
            configuration: {
                LocationUri: 'hdfs://hadoop-cluster/path/to/data',
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockDatabase],
        );

        const {relationships} = resources.find(
            r => r.arn === mockDatabase.arn,
        );

        const bucketRelationships = relationships.filter(
            r => r.resourceType === AWS_S3_BUCKET,
        );

        assert.equal(bucketRelationships.length, 0);
    });

});