import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_GLUE_CONNECTION,
    AWS_GLUE_JOB,
    IS_ASSOCIATED_WITH, ROLE,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateGlueJob(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};

    const jobName = `random-glue-job-${generateRandomInt(0, 10000)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:glue:${region}:${accountId}:job/${jobName}`,
        resourceType: 'AWS::Glue::Job',
        resourceId: jobName,
        resourceName: jobName,
        awsRegion: region,
        availabilityZone: 'Regional',
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_GLUE_JOB}`, () => {

    it('should add IAM role relationship', async () => {
        const Role = `testRole`;
        const mockJob = generateGlueJob({
            configuration: {
                Role,
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockJob],
        );

        const {relationships} = resources.find(
            r => r.arn === mockJob.arn,
        );

        const roleRelationship = relationships.find(
            r => r.arn === Role,
        );

        assert.deepEqual(roleRelationship, {
            relationshipName: IS_ASSOCIATED_WITH + 'Role',
            arn: Role,
        });

    });

    it('should add relationship for S3 bucket containing Glue script', async () => {
        const bucket = `testBucket`;
        const bucketArn = `arn:aws:s3:::${bucket}`;
        const mockJob = generateGlueJob({
            configuration: {
                Command: {
                    ScriptLocation: `s3://${bucket}/scripts/simple-job.py`,
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockJob],
        );

        const {relationships} = resources.find(
            r => r.arn === mockJob.arn,
        );

        const bucketRelationship = relationships.find(
            r => r.arn === bucketArn,
        );

        assert.deepEqual(bucketRelationship, {
            relationshipName: IS_ASSOCIATED_WITH,
            arn: bucketArn,
        });

    });

    it('should add relationships for Glue connections', async () => {
        const connection1 = 'connection1';
        const connection2 = 'connection2';

        const mockJob = generateGlueJob({
            configuration: {
                Connections: {
                    Connections: [
                        connection1,
                        connection2,
                    ],
                },
            },
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockJob],
        );

        const {relationships} = resources.find(
            r => r.arn === mockJob.arn,
        );

        const connectionRelationship1 = relationships.find(
            r => r.resourceId === connection1,
        );
        const connectionRelationship2 = relationships.find(
            r => r.resourceId === connection2,
        );

        assert.deepEqual(connectionRelationship1, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_CONNECTION,
            resourceId: connection1
        });

        assert.deepEqual(connectionRelationship2, {
            relationshipName: IS_ASSOCIATED_WITH,
            resourceType: AWS_GLUE_CONNECTION,
            resourceId: connection2
        });

    });

});
