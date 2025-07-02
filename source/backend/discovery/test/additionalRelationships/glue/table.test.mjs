import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    ACCOUNT_Y,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_GLUE_CONNECTION,
    AWS_GLUE_DATABASE,
    AWS_GLUE_TABLE,
    AWS_KINESIS_STREAM,
    IS_ASSOCIATED_WITH,
    IS_CONTAINED_IN,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateGlueTable(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};
    const databaseName = `glue-database-${generateRandomInt(0, 10000)}`;
    const tableName = `glue-table-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:glue:${region}:${accountId}:table/${databaseName}/${tableName}`,
        resourceType: AWS_GLUE_TABLE,
        resourceId: `${databaseName}/${tableName}`,
        resourceName: tableName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_GLUE_TABLE}`, () => {

    it('should add relationship for Kinesis stream in same account', async () => {
        const streamName = 'test-stream';
        const mockTable = generateGlueTable({
            configuration: {
                StorageDescriptor: {
                    Parameters: {
                        streamName,
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const streamRelationship = relationships.find(
            r => r.resourceId === streamName,
        );

        assert.deepEqual(streamRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_KINESIS_STREAM,
            resourceId: streamName
        });
    });

    it('should add relationship for Kinesis stream in different account', async () => {
        const streamArn = `arn:aws:kinesis:us-east-1:${ACCOUNT_Y}:stream/test-stream`;
        const mockTable = generateGlueTable({
            configuration: {
                StorageDescriptor: {
                    Parameters: {
                        streamARN: streamArn,
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const streamRelationship = relationships.find(
            r => r.arn === streamArn,
        );

        assert.deepEqual(streamRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: streamArn
        });
    });

    it('should add relationship for Glue connection', async () => {
        const connectionName = 'test-connection';
        const mockTable = generateGlueTable({
            configuration: {
                StorageDescriptor: {
                    Parameters: {
                        Connection: connectionName,
                    }
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const connectionRelationship = relationships.find(
            r => r.resourceId === connectionName,
        );

        assert.deepEqual(connectionRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_CONNECTION,
            resourceId: connectionName
        });
    });

    it('should add relationship for Glue database', async () => {
        const databaseName = 'test-database';
        const mockTable = generateGlueTable({
            databaseName,
            configuration: {
                DatabaseName: databaseName
            }
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const databaseRelationship = relationships.find(
            r => r.resourceId === databaseName,
        );

        assert.deepEqual(databaseRelationship, {
            relationshipName: IS_CONTAINED_IN,
            resourceType: AWS_GLUE_DATABASE,
            resourceId: databaseName
        });
    });

    it('should add relationship for federated table Glue connection', async () => {
        const connectionName = 'federated-connection';
        const mockTable = generateGlueTable({
            configuration: {
                FederatedTable: {
                    ConnectionName: connectionName
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const connectionRelationship = relationships.find(
            r => r.resourceId === connectionName,
        );

        assert.deepEqual(connectionRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_CONNECTION,
            resourceId: connectionName
        });
    });

    it('should add relationship for S3 bucket from StorageDescriptor Location', async () => {
        const bucketName = 'test-bucket';
        const bucketArn = `arn:aws:s3:::${bucketName}`;
        const mockTable = generateGlueTable({
            configuration: {
                StorageDescriptor: {
                    Location: `s3://${bucketName}/path/to/data`,
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const bucketRelationship = relationships.find(
            r => r.arn === bucketArn,
        );

        assert.deepEqual(bucketRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucketArn
        });
    });

    it('should add relationship for target table in same account and region', async () => {
        const targetDatabaseName = 'target-database';
        const targetTable = 'same-account-region-table';

        const mockTable = generateGlueTable({
            configuration: {
                TargetTable: {
                    DatabaseName: targetDatabaseName,
                    Name: targetTable
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const targetTableArn = `arn:aws:glue:${mockTable.awsRegion}:${mockTable.accountId}:table/${targetDatabaseName}/${targetTable}`;

        const targetTableRelationship = relationships.find(
            r => r.arn === targetTableArn,
        );

        assert.deepEqual(targetTableRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: targetTableArn
        });
    });

    it('should add relationship for target table in different account, same region', async () => {
        const targetDatabaseName = 'target-database';
        const targetTable = 'diff-account-same-region-table';

        const mockTable = generateGlueTable({
            configuration: {
                TargetTable: {
                    CatalogId: ACCOUNT_Y,  // Different account
                    DatabaseName: targetDatabaseName,
                    Name: targetTable
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const targetTableArn = `arn:aws:glue:${mockTable.awsRegion}:${ACCOUNT_Y}:table/${targetDatabaseName}/${targetTable}`;

        const targetTableRelationship = relationships.find(
            r => r.arn === targetTableArn,
        );

        assert.deepEqual(targetTableRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: targetTableArn
        });
    });

    it('should add relationship for target table in same account, different region', async () => {
        const targetDatabaseName = 'target-database';
        const targetTable = 'same-account-diff-region-table';
        const targetRegion = 'us-west-2';

        const mockTable = generateGlueTable({
            configuration: {
                TargetTable: {
                    DatabaseName: targetDatabaseName,
                    Name: targetTable,
                    Region: targetRegion
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const targetTableArn = `arn:aws:glue:${targetRegion}:${mockTable.accountId}:table/${targetDatabaseName}/${targetTable}`;

        const targetTableRelationship = relationships.find(
            r => r.arn === targetTableArn,
        );

        assert.deepEqual(targetTableRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: targetTableArn
        });
    });

    it('should add relationship for target table in different account and region', async () => {
        const targetDatabaseName = 'target-database';
        const targetTable = 'diff-account-diff-region-table';
        const targetRegion = 'eu-west-1';

        const mockTable = generateGlueTable({
            configuration: {
                TargetTable: {
                    CatalogId: ACCOUNT_Y,
                    DatabaseName: targetDatabaseName,
                    Name: targetTable,
                    Region: targetRegion
                }
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockTable],
        );

        const {relationships} = resources.find(
            r => r.arn === mockTable.arn,
        );

        const targetTableArn = `arn:aws:glue:${targetRegion}:${ACCOUNT_Y}:table/${targetDatabaseName}/${targetTable}`;

        const targetTableRelationship = relationships.find(
            r => r.arn === targetTableArn,
        );

        assert.deepEqual(targetTableRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: targetTableArn
        });
    });

});
