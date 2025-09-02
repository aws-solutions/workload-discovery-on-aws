import {assert, describe, it} from 'vitest';
import {
    ACCOUNT_X,
    addAdditionalRelationships,
    defaultMockAwsClient,
} from '../../additionalRelationships.test.mjs';
import {
    AWS_EC2_VOLUME,
    AWS_EC2_INSTANCE,
    AWS_EC2_SUBNET,
    AWS_EC2_VPC,
    IS_CONTAINED_IN,
    SUBNET,
    VPC, IS_ATTACHED_TO,
} from '../../../src/lib/constants.mjs';
import {generateRandomInt} from '../../generator.mjs';

function generateEc2Volume(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};
    const relationships = options.relationships ?? [];

    const volumeId = `vol-${generateRandomInt(100000000, 999999999).toString(16)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:ec2:${region}:${accountId}:volume/${volumeId}`,
        resourceType: AWS_EC2_VOLUME,
        resourceId: volumeId,
        resourceName: volumeId,
        awsRegion: region,
        availabilityZone: `${region}a`,
        tags: {},
        relatedEvents: [],
        relationships,
        configuration,
        supplementaryConfiguration: {},
    };
}

function generateEc2Instance(options = {}) {
    const accountId = options.accountId ?? ACCOUNT_X;
    const region = options.region ?? 'us-east-1';
    const configuration = options.configuration ?? {};

    const instanceId = `i-${generateRandomInt(100000000, 999999999).toString(16)}`;

    return {
        version: '1.3',
        accountId: accountId,
        configurationItemCaptureTime: new Date().toISOString(),
        configurationItemStatus: 'ResourceDiscovered',
        configurationItemMD5Hash: '',
        arn: `arn:aws:ec2:${region}:${accountId}:instance/${instanceId}`,
        id: `arn:aws:ec2:${region}:${accountId}:instance/${instanceId}`,
        resourceType: AWS_EC2_INSTANCE,
        resourceId: instanceId,
        resourceName: instanceId,
        awsRegion: region,
        availabilityZone: `${region}a`,
        tags: {},
        relatedEvents: [],
        relationships: [],
        configuration,
        supplementaryConfiguration: {},
    };
}

describe(`addAdditionalRelationships - ${AWS_EC2_VOLUME}`, () => {

    it('should add vpc and subnet relationships when volume is attached to instance', async () => {
        const vpcId = 'vpc-12345678';
        const subnetId = 'subnet-12345678';

        const mockInstance = generateEc2Instance({
            configuration: {
                vpcId,
                subnetId,
            },
        });

        const mockVolume = generateEc2Volume({
            relationships: [
                {
                    resourceType: AWS_EC2_INSTANCE,
                    resourceId: mockInstance.resourceId,
                    relationshipName: IS_ATTACHED_TO + 'Instance'
                },
            ],
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockVolume, mockInstance],
        );

        const {relationships} = resources.find(
            r => r.arn === mockVolume.arn,
        );

        const subnetRelationship = relationships.find(
            r => r.resourceId === subnetId,
        );

        const vpcRelationship = relationships.find(
            r => r.resourceId === vpcId,
        );

        assert.deepEqual(subnetRelationship, {
            relationshipName: IS_CONTAINED_IN + SUBNET,
            resourceType: AWS_EC2_SUBNET,
            resourceId: subnetId,
        });

        assert.deepEqual(vpcRelationship, {
            relationshipName: IS_CONTAINED_IN + VPC,
            resourceType: AWS_EC2_VPC,
            resourceId: vpcId,
        });
    });

    it('should not add vpc relationships when volume has no instance relationship', async () => {
        const mockVolume = generateEc2Volume({
            relationships: [],
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockVolume],
        );

        const {relationships} = resources.find(
            r => r.arn === mockVolume.arn,
        );

        assert.equal(relationships.length, 0);
    });

    it('should not add vpc relationships when instance is not found', async () => {
        const instanceId = 'i-nonexistent';

        const mockVolume = generateEc2Volume({
            relationships: [
                {
                    resourceType: AWS_EC2_INSTANCE,
                    resourceId: instanceId,
                    relationshipName: IS_ATTACHED_TO + 'Instance'
                },
            ],
        });

        const resources = await addAdditionalRelationships(
            defaultMockAwsClient,
            [mockVolume],
        );

        const {relationships} = resources.find(
            r => r.arn === mockVolume.arn,
        );

        assert.deepEqual(relationships, [{
            resourceType: AWS_EC2_INSTANCE,
            resourceId: instanceId,
            relationshipName: IS_ATTACHED_TO + 'Instance'
        }]);
    });

});