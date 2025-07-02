import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_EC2_SECURITY_GROUP,
    AWS_EC2_SUBNET,
    AWS_EC2_INSTANCE,
    AWS_GLUE_CONNECTION,
    AWS_SECRETS_MANAGER_SECRET,
    IS_ASSOCIATED_WITH,
    IS_CONTAINED_IN,
    SUBNET,
    SECURITY_GROUP, AWS_RDS_DB_CLUSTER,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateGlueConnection(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};

    const connectionName = `glue-connection-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:glue:${region}:${accountId}:connection/${connectionName}`,
        resourceType: 'AWS::Glue::Connection',
        resourceId: connectionName,
        resourceName: connectionName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

function generateRdsCluster(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};

    const clusterName = `rds-cluster-${generateRandomInt(0, 10000)}`;
    const clusterId = `arn:aws:rds:${region}:${accountId}:cluster:${clusterName}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: clusterId,
        id: clusterId,
        resourceType: AWS_RDS_DB_CLUSTER,
        resourceId: clusterName,
        resourceName: clusterName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_GLUE_CONNECTION}`, () => {

    it('should add vpc relationship when present', async () => {
        const subnetId = 'subnet-12345678';

        const securityGroup1 = 'sg-12345678';
        const securityGroup2 = 'sg-87654321';

        const mockConnection = generateGlueConnection({
            configuration: {
                PhysicalConnectionRequirements: {
                    SubnetId: subnetId,
                    SecurityGroups: [securityGroup1, securityGroup2],
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockConnection],
        );

        const {relationships} = resources.find(
            r => r.arn === mockConnection.arn,
        );

        const subnetRelationship = relationships.find(
            r => r.resourceId === subnetId,
        );

        const sg1Relationship = relationships.find(
            r => r.resourceId === securityGroup1,
        );

        const sg2Relationship = relationships.find(
            r => r.resourceId === securityGroup2,
        );

        assert.deepEqual(subnetRelationship, {
            relationshipName: IS_CONTAINED_IN + SUBNET,
            resourceType: AWS_EC2_SUBNET,
            resourceId: subnetId,
        });

        assert.deepEqual(sg1Relationship, {
            relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
            resourceType: AWS_EC2_SECURITY_GROUP,
            resourceId: securityGroup1,
        });

        assert.deepEqual(sg2Relationship, {
            relationshipName: IS_ASSOCIATED_WITH + SECURITY_GROUP,
            resourceType: AWS_EC2_SECURITY_GROUP,
            resourceId: securityGroup2,
        });
    });

    it('should add EC2 instance relationship', async () => {
        const instanceId = 'i-12345678abcdef0';

        const mockConnection = generateGlueConnection({
            configuration: {
                ConnectionProperties: {
                    INSTANCE_ID: instanceId,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockConnection],
        );

        const {relationships} = resources.find(
            r => r.arn === mockConnection.arn,
        );

        const instanceRelationship = relationships.find(
            r => r.resourceId === instanceId,
        );

        assert.deepEqual(instanceRelationship, {
            relationshipName: IS_ASSOCIATED_WITH + 'Instance',
            resourceType: AWS_EC2_INSTANCE,
            resourceId: instanceId,
        });
    });

    it('should add Secrets Manager secret relationship', async () => {
        const secretId = 'db-credentials';
        const secretArn = `arn:aws:secretsmanager:us-east-1:${ACCOUNT_X}:secret:auth-creds`;

        const mockConnection = generateGlueConnection({
            configuration: {
                AuthenticationConfiguration: {
                    SecretArn: secretArn,
                },
                ConnectionProperties: {
                    SECRET_ID: secretId,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockConnection],
        );

        const {relationships} = resources.find(
            r => r.arn === mockConnection.arn,
        );

        const connSecretRelationship = relationships.find(
            r => r.resourceId === secretId,
        );

        const authSecretRelationship = relationships.find(
            r => r.arn === secretArn,
        );

        assert.deepEqual(connSecretRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_SECRETS_MANAGER_SECRET,
            resourceId: secretId,
        });

        assert.deepEqual(authSecretRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: secretArn,
        });
    });

    it('should add host endpoint relationship from ConnectionProperties', async () => {
        const host = 'database.example.com';

        const mockCluster = generateRdsCluster({
            configuration: {
                readerEndpoint: host,
            },
        });

        const mockConnection = generateGlueConnection({
            configuration: {
                ConnectionProperties: {
                    HOST: host,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockConnection, mockCluster],
        );

        const {relationships} = resources.find(
            r => r.arn === mockConnection.arn,
        );

        const endpointRelationship = relationships.find(
            r => r.arn === mockCluster.id,
        );

        assert.deepEqual(endpointRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: mockCluster.id,
        });
    });

    it.each([
        {
            jdbcUrl: 'jdbc:mysql://mysql.rds.amazonaws.com:3306/mydb',
            host: 'mysql.rds.amazonaws.com',
        },
        {
            jdbcUrl: 'jdbc:postgresql://postgres.rds.amazonaws.com/database?user=myuser',
            host: 'postgres.rds.amazonaws.com',
        },
        {
            jdbcUrl: 'jdbc:oracle://oracle.rds.amazonaws.com:1521/service',
            host: 'oracle.rds.amazonaws.com',
        },
        {
            jdbcUrl: 'jdbc:mysql://other.mysql.rds.amazonaws.com/mydb',
            host: 'other.mysql.rds.amazonaws.com',
        },
    ])('should extract host from jdbc connection string and add relationship',
        async ({jdbcUrl, host}) => {
            const mockCluster = generateRdsCluster({
                configuration: {
                    readerEndpoint: host,
                },
            });

            const mockConnection = generateGlueConnection({
                configuration: {
                    ConnectionProperties: {
                        JDBC_CONNECTION_URL: jdbcUrl,
                    },
                },
            });

            const resources = await addAdditionalRelationships(
                defaultMockAwsClient,
                [mockConnection, mockCluster],
            );

            const {relationships} = resources.find(
                r => r.arn === mockConnection.arn,
            );

            const endpointRelationship = relationships.find(
                r => r.arn === mockCluster.id,
            );

            assert.deepEqual(endpointRelationship, {
                relationshipName: IS_ASSOCIATED_WITH,
                arn: mockCluster.id,
            });
        });

    it('should add IAM role relationship', async () => {
        const roleArn = `arn:aws:iam::${ACCOUNT_X}:role/glue-service-role`;

        const mockConnection = generateGlueConnection({
            configuration: {
                ConnectionProperties: {
                    ROLE_ARN: roleArn,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockConnection],
        );

        const {relationships} = resources.find(
            r => r.arn === mockConnection.arn,
        );

        const roleRelationship = relationships.find(
            r => r.arn === roleArn,
        );

        assert.deepEqual(roleRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: roleArn,
        });
    });

});