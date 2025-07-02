import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_DYNAMODB_TABLE,
    AWS_GLUE_CONNECTION,
    AWS_GLUE_CRAWLER,
    AWS_GLUE_DATABASE,
    IS_ASSOCIATED_WITH,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateGlueCrawler(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};

    const crawlerName = `random-glue-crawler-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:glue:${region}:${accountId}:crawler/${crawlerName}`,
        resourceType: 'AWS::Glue::Crawler',
        resourceId: crawlerName,
        resourceName: crawlerName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_GLUE_CRAWLER}`, () => {

    it('should add relationships for S3Targets', async () => {
        const eventQueueArn = `arn:aws:sqs:us-east-1:${ACCOUNT_X}:event-queue`;
        const dlqEventQueueArn = `arn:aws:sqs:us-east-1:${ACCOUNT_X}:dlq-queue`;

        const bucket1 = 'testBucket1';
        const bucket2 = 'testBucket2';

        const bucket1Arn = `arn:aws:s3:::${bucket1}`;
        const bucket2Arn = `arn:aws:s3:::${bucket2}`;

        const mockCrawler = generateGlueCrawler({
            configuration: {
                Targets: {
                    S3Targets: [
                        {
                            Path: `s3://${bucket1}/path`,
                            EventQueueArn: eventQueueArn,
                            DlqEventQueueArn: dlqEventQueueArn,
                        },
                        {
                            Path: `s3://${bucket2}/path`
                        },
                    ],
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockCrawler],
        );

        const {relationships} = resources.find(
            r => r.arn === mockCrawler.arn,
        );

        const eventQueueRelationship = relationships.find(
            r => r.arn === eventQueueArn,
        );

        const dlqEventQueueRelationship = relationships.find(
            r => r.arn === dlqEventQueueArn,
        );

        const bucket1Relationship = relationships.find(
            r => r.arn === bucket1Arn,
        );

        const bucket2Relationship = relationships.find(
            r => r.arn === bucket2Arn,
        );

        assert.deepEqual(eventQueueRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: eventQueueArn,
        });

        assert.deepEqual(dlqEventQueueRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: dlqEventQueueArn,
        });

        assert.deepEqual(bucket1Relationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucket1Arn,
        });

        assert.deepEqual(bucket2Relationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucket2Arn,
        });
    });

    it('should add relationships for Catalog targets', async () => {
        const eventQueueArn = `arn:aws:sqs:us-east-1:${ACCOUNT_X}:catalog-event-queue`;
        const dlqEventQueueArn = `arn:aws:sqs:us-east-1:${ACCOUNT_X}:catalog-dlq-queue`;

        const databaseName1 = 'test-database1';
        const databaseName2 = 'test-database2';

        const mockCrawler = generateGlueCrawler({
            configuration: {
                Targets: {
                    CatalogTargets: [
                        {
                            DatabaseName: databaseName1,
                            EventQueueArn: eventQueueArn,
                            DlqEventQueueArn: dlqEventQueueArn,
                        },
                        {
                            DatabaseName: databaseName2,
                        },
                    ],
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockCrawler],
        );

        const {relationships} = resources.find(
            r => r.arn === mockCrawler.arn,
        );

        const database1Relationship = relationships.find(
            r => r.resourceId === databaseName1
        );

        const eventQueueRelationship = relationships.find(
            r => r.arn === eventQueueArn,
        );

        const dlqEventQueueRelationship = relationships.find(
            r => r.arn === dlqEventQueueArn,
        );

        const database2Relationship = relationships.find(
            r => r.resourceId === databaseName2
        );

        assert.deepEqual(eventQueueRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: eventQueueArn,
        });

        assert.deepEqual(dlqEventQueueRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: dlqEventQueueArn,
        });

        assert.deepEqual(database1Relationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_DATABASE,
            resourceId: databaseName1,
        });

        assert.deepEqual(database2Relationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_DATABASE,
            resourceId: databaseName2,
        });
    });

    it('should add relationships for connection names from any target type', async () => {
        const jdbcConnection = 'jdbc-connection';
        const mongoConnection = 'mongo-connection';

        const mockCrawler = generateGlueCrawler({
            configuration: {
                Targets: {
                    JdbcTargets: [
                        {
                            ConnectionName: jdbcConnection,
                            Path: 'database/%',
                        },
                    ],
                    MongoDBTargets: [
                        {
                            ConnectionName: mongoConnection,
                            Path: 'collection',
                        },
                    ],
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockCrawler],
        );

        const {relationships} = resources.find(
            r => r.arn === mockCrawler.arn,
        );

        const jdbcConnectionRelationship = relationships.find(
            r => r.resourceId === jdbcConnection,
        );

        const mongoConnectionRelationship = relationships.find(
            r => r.resourceId === mongoConnection,
        );

        assert.deepEqual(jdbcConnectionRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_CONNECTION,
            resourceId: jdbcConnection,
        });

        assert.deepEqual(mongoConnectionRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_CONNECTION,
            resourceId: mongoConnection,
        });
    });

    it('should add relationships for the primary database name', async () => {
        const databaseName = 'primary-database';

        const mockCrawler = generateGlueCrawler({
            configuration: {
                DatabaseName: databaseName,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockCrawler],
        );

        const {relationships} = resources.find(
            r => r.arn === mockCrawler.arn,
        );

        const databaseRelationship = relationships.find(
            r => r.resourceId === databaseName,
        );

        assert.deepEqual(databaseRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_DATABASE,
            resourceId: databaseName,
        });
    });

    it('should add relationships for DynamoDB table paths', async () => {
        const tablePath = 'dynamodb-table';

        const mockCrawler = generateGlueCrawler({
            configuration: {
                Targets: {
                    DynamoDBTargets: [
                        {
                            Path: tablePath,
                        },
                    ],
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockCrawler],
        );

        const {relationships} = resources.find(
            r => r.arn === mockCrawler.arn,
        );

        const tableRelationship = relationships.find(
            r => r.resourceId === tablePath,
        );

        assert.deepEqual(tableRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_DYNAMODB_TABLE,
            resourceId: tablePath,
        });
    });

});
