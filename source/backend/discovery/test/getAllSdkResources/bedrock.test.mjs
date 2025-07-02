import {assert, describe, it} from 'vitest';
import * as R from 'ramda';
import {ACCOUNT_X, ACCOUNT_Z, mockAwsClient} from '../getAllSdkResources.test.mjs';
import {credentialsX, credentialsZ} from '../getAllSdkResources.test.mjs';
import * as sdkResources from '../../src/lib/sdkResources/index.mjs';
import {
    AWS,
    AWS_BEDROCK_CUSTOM_MODEL,
    AWS_BEDROCK_FOUNDATION_MODEL,
    AWS_BEDROCK_IMPORTED_MODEL,
    AWS_BEDROCK_INFERENCE_PROFILE,
    NOT_APPLICABLE,
    RESOURCE_DISCOVERED,
} from '../../src/lib/constants.mjs';
import {generateRandomInt} from '../generator.mjs';

function generateInferenceProfile(region, accountId) {
    const id = `profile-${generateRandomInt(0, 10000)}`;
    return {
        inferenceProfileId: id,
        name: `Profile-${id}`,
        inferenceProfileArn: `arn:aws:bedrock:${region}:${accountId}:inference-profile/${id}`,
        modelId: `model-${generateRandomInt(0, 10000)}`,
    };
}

function generateCustomModel(region, accountId) {
    const modelName = `model-${generateRandomInt(0, 10000)}`;
    return {
        modelArn: `arn:aws:bedrock:${region}:${accountId}:custom-model/${modelName}`,
        modelName: modelName,
        status: 'ACTIVE',
        customizationType: 'FINE_TUNING',
    };
}

function generateFoundationModel(region) {
    const id = `foundation-${generateRandomInt(0, 10000)}`;
    return {
        modelId: id,
        modelName: `Amazon ${id}`,
        modelArn: `arn:aws:bedrock:${region}::foundation-model/${id}`,
    };
}

function generateImportedModel(region, accountId) {
    const modelName = `imported-${generateRandomInt(0, 10000)}`;
    return {
        modelArn: `arn:aws:bedrock:${region}:${accountId}:imported-model/${modelName}`,
        modelName: modelName,
        status: 'ACTIVE',
    };
}

describe('getAllSdkResources - Bedrock', () => {

    const getAllSdkResources = sdkResources.getAllSdkResources(
        new Map([
            [
                ACCOUNT_X,
                {
                    credentials: credentialsX,
                    regions: ['eu-west-2'],
                },
            ],
            [
                ACCOUNT_Z,
                {
                    credentials: credentialsZ,
                    regions: ['us-west-2'],
                },
            ],
        ]),
    );

    describe(AWS_BEDROCK_INFERENCE_PROFILE, () => {

        it('should discover Bedrock inference profiles', async () => {
            const profileEuWest2 = generateInferenceProfile('eu-west-2', ACCOUNT_X);
            const profileUsWest2 = generateInferenceProfile('us-west-2', ACCOUNT_Z);

            const mockBedrockClient = {
                createBedrockClient(credentials, region) {
                    return {
                        listAllInferenceProfiles() {
                            if (R.equals(credentials, credentialsX) && region === 'eu-west-2') {
                                return [profileEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2') {
                                return [profileUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockBedrockClient},
                [],
            );

            const profileEuWest2Arn = profileEuWest2.inferenceProfileArn;
            const profileUsWest2Arn = profileUsWest2.inferenceProfileArn;

            const actualProfileEuWest2 = actual.find(x => x.arn === profileEuWest2Arn);
            const actualProfileUsWest2 = actual.find(x => x.arn === profileUsWest2Arn);

            assert.deepEqual(actualProfileEuWest2, {
                id: profileEuWest2Arn,
                accountId: ACCOUNT_X,
                arn: profileEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'eu-west-2',
                configuration: {
                    ...profileEuWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: profileEuWest2.inferenceProfileId,
                resourceName: profileEuWest2.name,
                resourceType: AWS_BEDROCK_INFERENCE_PROFILE,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualProfileUsWest2, {
                id: profileUsWest2Arn,
                accountId: ACCOUNT_Z,
                arn: profileUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'us-west-2',
                configuration: {
                    ...profileUsWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: profileUsWest2.inferenceProfileId,
                resourceName: profileUsWest2.name,
                resourceType: AWS_BEDROCK_INFERENCE_PROFILE,
                tags: [],
                relationships: [],
            });
        });

    });

    describe(AWS_BEDROCK_CUSTOM_MODEL, () => {

        it('should discover Bedrock custom models', async () => {
            const customModelEuWest2 = generateCustomModel('eu-west-2', ACCOUNT_X);
            const customModelUsWest2 = generateCustomModel('us-west-2', ACCOUNT_Z);

            const mockBedrockClient = {
                createBedrockClient(credentials, region) {
                    return {
                        getAllCustomModels() {
                            if (R.equals(credentials, credentialsX) && region === 'eu-west-2') {
                                return [customModelEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2') {
                                return [customModelUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockBedrockClient},
                [],
            );

            const customModelEuWest2Arn = customModelEuWest2.modelArn;
            const customModelUsWest2Arn = customModelUsWest2.modelArn;

            const actualCustomModelEuWest2 = actual.find(x => x.arn === customModelEuWest2Arn);
            const actualCustomModelUsWest2 = actual.find(x => x.arn === customModelUsWest2Arn);

            assert.deepEqual(actualCustomModelEuWest2, {
                id: customModelEuWest2Arn,
                accountId: ACCOUNT_X,
                arn: customModelEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'eu-west-2',
                configuration: {
                    ...customModelEuWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: customModelEuWest2.modelName,
                resourceName: customModelEuWest2.modelName,
                resourceType: AWS_BEDROCK_CUSTOM_MODEL,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualCustomModelUsWest2, {
                id: customModelUsWest2Arn,
                accountId: ACCOUNT_Z,
                arn: customModelUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'us-west-2',
                configuration: {
                    ...customModelUsWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: customModelUsWest2.modelName,
                resourceName: customModelUsWest2.modelName,
                resourceType: AWS_BEDROCK_CUSTOM_MODEL,
                tags: [],
                relationships: [],
            });
        });

    });

    describe(AWS_BEDROCK_FOUNDATION_MODEL, () => {

        it('should discover Bedrock foundation models', async () => {
            const foundationModelEuWest2 = generateFoundationModel('eu-west-2');
            const foundationModelUsWest2 = generateFoundationModel('us-west-2');

            const mockBedrockClient = {
                createBedrockClient(credentials, region) {
                    return {
                        getAllFoundationModels() {
                            if (R.equals(credentials, credentialsX) && region === 'eu-west-2') {
                                return [foundationModelEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2') {
                                return [foundationModelUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockBedrockClient},
                [],
            );

            const foundationModelEuWest2Arn = foundationModelEuWest2.modelArn;
            const foundationModelUsWest2Arn = foundationModelUsWest2.modelArn;

            const actualFoundationModelEuWest2 = actual.find(x => x.arn === foundationModelEuWest2Arn);
            const actualFoundationModelUsWest2 = actual.find(x => x.arn === foundationModelUsWest2Arn);

            assert.deepEqual(actualFoundationModelEuWest2, {
                id: foundationModelEuWest2Arn,
                accountId: AWS, // Foundation models are owned by AWS, not by the customer account
                arn: foundationModelEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'eu-west-2',
                configuration: {
                    ...foundationModelEuWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: foundationModelEuWest2.modelId,
                resourceName: foundationModelEuWest2.modelName,
                resourceType: AWS_BEDROCK_FOUNDATION_MODEL,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualFoundationModelUsWest2, {
                id: foundationModelUsWest2Arn,
                accountId: AWS, // Foundation models are owned by AWS, not by the customer account
                arn: foundationModelUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'us-west-2',
                configuration: {
                    ...foundationModelUsWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: foundationModelUsWest2.modelId,
                resourceName: foundationModelUsWest2.modelName,
                resourceType: AWS_BEDROCK_FOUNDATION_MODEL,
                tags: [],
                relationships: [],
            });
        });

        describe(AWS_BEDROCK_IMPORTED_MODEL, () => {

            it('should discover Bedrock imported models', async () => {
                const importedModelEuWest2 = generateImportedModel('eu-west-2', ACCOUNT_X);
                const importedModelUsWest2 = generateImportedModel('us-west-2', ACCOUNT_Z);

                const mockBedrockClient = {
                    createBedrockClient(credentials, region) {
                        return {
                            getAllImportedModels() {
                                if (R.equals(credentials, credentialsX) && region === 'eu-west-2') {
                                    return [importedModelEuWest2];
                                } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2') {
                                    return [importedModelUsWest2];
                                } else {
                                    return [];
                                }
                            },
                        };
                    },
                };

                const actual = await getAllSdkResources(
                    {...mockAwsClient, ...mockBedrockClient},
                    [],
                );

                const importedModelEuWest2Arn = importedModelEuWest2.modelArn;
                const importedModelUsWest2Arn = importedModelUsWest2.modelArn;

                const actualImportedModelEuWest2 = actual.find(x => x.arn === importedModelEuWest2Arn);
                const actualImportedModelUsWest2 = actual.find(x => x.arn === importedModelUsWest2Arn);

                assert.deepEqual(actualImportedModelEuWest2, {
                    id: importedModelEuWest2Arn,
                    accountId: ACCOUNT_X,
                    arn: importedModelEuWest2Arn,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: 'eu-west-2',
                    configuration: {
                        ...importedModelEuWest2,
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: importedModelEuWest2.modelName,
                    resourceName: importedModelEuWest2.modelName,
                    resourceType: AWS_BEDROCK_IMPORTED_MODEL,
                    tags: [],
                    relationships: [],
                });

                assert.deepEqual(actualImportedModelUsWest2, {
                    id: importedModelUsWest2Arn,
                    accountId: ACCOUNT_Z,
                    arn: importedModelUsWest2Arn,
                    availabilityZone: NOT_APPLICABLE,
                    awsRegion: 'us-west-2',
                    configuration: {
                        ...importedModelUsWest2,
                    },
                    configurationItemStatus: RESOURCE_DISCOVERED,
                    resourceId: importedModelUsWest2.modelName,
                    resourceName: importedModelUsWest2.modelName,
                    resourceType: AWS_BEDROCK_IMPORTED_MODEL,
                    tags: [],
                    relationships: [],
                });
            });

        });

    });

});