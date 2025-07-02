// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import {mockClient} from 'aws-sdk-client-mock';
import {
    BedrockClient,
    ListInferenceProfilesCommand,
    ListFoundationModelsCommand,
    ListCustomModelsCommand,
    GetCustomModelCommand,
    ListImportedModelsCommand,
    GetImportedModelCommand,
} from '@aws-sdk/client-bedrock';
import {createBedrockClient} from '../../src/lib/awsClient/bedrock.mjs';

describe('Bedrock Client', () => {

    const mockCredentials = {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        sessionToken: 'optionalSessionToken',
    };

    const {
        getAllCustomModels,
        getAllFoundationModels,
        getAllImportedModels,
        listAllInferenceProfiles,
    } = createBedrockClient(mockCredentials, 'us-east-1');

    describe('listAllInferenceProfiles', () => {

        it('should get all inference profiles', async () => {
            const mockBedrockClient = mockClient(BedrockClient);

            const inferenceProfilesPages = {
                page1: {
                    inferenceProfileSummaries: [
                        {
                            inferenceProfileId: 'profile1',
                            name: 'Profile 1',
                            modelId: 'model1',
                        },
                        {
                            inferenceProfileId: 'profile2',
                            name: 'Profile 2',
                            modelId: 'model2',
                        },
                    ],
                    nextToken: 'token1',
                },
                token1: {
                    inferenceProfileSummaries: [
                        {
                            inferenceProfileId: 'profile3',
                            name: 'Profile 3',
                            modelId: 'model3',
                        },
                        {
                            inferenceProfileId: 'profile4',
                            name: 'Profile 4',
                            modelId: 'model4',
                        },
                    ],
                },
            };

            mockBedrockClient.on(ListInferenceProfilesCommand)
                .callsFake(input => {
                    const {nextToken} = input;
                    if (nextToken) {
                        return inferenceProfilesPages[nextToken];
                    }
                    return inferenceProfilesPages['page1'];
                });

            const profiles = await listAllInferenceProfiles();

            assert.deepEqual(profiles, [
                {
                    inferenceProfileId: 'profile1',
                    name: 'Profile 1',
                    modelId: 'model1',
                },
                {
                    inferenceProfileId: 'profile2',
                    name: 'Profile 2',
                    modelId: 'model2',
                },
                {
                    inferenceProfileId: 'profile3',
                    name: 'Profile 3',
                    modelId: 'model3',
                },
                {
                    inferenceProfileId: 'profile4',
                    name: 'Profile 4',
                    modelId: 'model4',
                },
            ]);
        });
    });

    describe('getAllFoundationModels', () => {
        it('should get all foundation models', async () => {
            const mockBedrockService = mockClient(BedrockClient);

            const modelSummaries = [
                {
                    modelId: 'model1',
                    modelName: 'Model 1',
                    providerName: 'Provider A',
                },
                {
                    modelId: 'model2',
                    modelName: 'Model 2',
                    providerName: 'Provider B',
                },
                {
                    modelId: 'model3',
                    modelName: 'Model 3',
                    providerName: 'Provider A',
                },
                {
                    modelId: 'model4',
                    modelName: 'Model 4',
                    providerName: 'Provider C',
                },
            ];

            mockBedrockService.on(ListFoundationModelsCommand)
                .resolves({
                    modelSummaries: modelSummaries,
                });

            const models = await getAllFoundationModels();

            assert.deepEqual(models, modelSummaries);
        });

    });

    describe('getAllCustomModels', () => {
        it('should get all custom models with details', async () => {
            const mockBedrockClient = mockClient(BedrockClient);

            const customModelsPages = {
                'page1': {
                    modelSummaries: [
                        {
                            modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model1',
                            modelName: 'Custom Model 1',
                        },
                        {
                            modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model2',
                            modelName: 'Custom Model 2',
                        },
                    ],
                    nextToken: 'token1',
                },
                'token1': {
                    modelSummaries: [
                        {
                            modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model3',
                            modelName: 'Custom Model 3',
                        },
                    ],
                },
            };

            mockBedrockClient.on(ListCustomModelsCommand)
                .callsFake(input => {
                    const {nextToken} = input;
                    if (nextToken) {
                        return customModelsPages[nextToken];
                    }
                    return customModelsPages['page1'];
                });

            const customModelDetails = {
                'arn:aws:bedrock:us-east-1:123456789012:custom-model/model1': {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model1',
                    modelName: 'Custom Model 1',
                },
                'arn:aws:bedrock:us-east-1:123456789012:custom-model/model2': {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model2',
                    modelName: 'Custom Model 2',
                },
                'arn:aws:bedrock:us-east-1:123456789012:custom-model/model3': {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model3',
                    modelName: 'Custom Model 3',
                },
            };

            mockBedrockClient.on(GetCustomModelCommand)
                .callsFake(({modelIdentifier}) => {
                    return customModelDetails[modelIdentifier];
                });

            const models = await getAllCustomModels();

            assert.deepEqual(models, [
                {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model1',
                    modelName: 'Custom Model 1',
                },
                {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model2',
                    modelName: 'Custom Model 2',
                },
                {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:custom-model/model3',
                    modelName: 'Custom Model 3',
                },
            ]);
        });

    });

    describe('getAllImportedModels', () => {
        const mockCredentials = {
            accessKeyId: 'accessKeyId',
            secretAccessKey: 'secretAccessKey',
            sessionToken: 'optionalSessionToken',
        };

        it('should get all imported models with details', async () => {
            const mockBedrockClient = mockClient(BedrockClient);

            const importedModelsPages = {
                'page1': {
                    modelSummaries: [
                        {
                            modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model1',
                            modelName: 'Imported Model 1',
                        },
                        {
                            modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model2',
                            modelName: 'Imported Model 2',
                        },
                    ],
                    nextToken: 'token1',
                },
                'token1': {
                    modelSummaries: [
                        {
                            modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model3',
                            modelName: 'Imported Model 3',
                        },
                    ]
                },
            };

            mockBedrockClient.on(ListImportedModelsCommand)
                .callsFake(input => {
                    const {nextToken} = input;
                    if (nextToken) {
                        return importedModelsPages[nextToken];
                    }
                    return importedModelsPages['page1'];
                });

            const importedModelDetails = {
                'arn:aws:bedrock:us-east-1:123456789012:imported-model/model1': {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model1',
                    modelName: 'Imported Model 1',
                },
                'arn:aws:bedrock:us-east-1:123456789012:imported-model/model2': {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model2',
                    modelName: 'Imported Model 2',
                },
                'arn:aws:bedrock:us-east-1:123456789012:imported-model/model3': {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model3',
                    modelName: 'Imported Model 3',
                },
            };

            mockBedrockClient.on(GetImportedModelCommand)
                .callsFake(({modelIdentifier}) => {
                    return importedModelDetails[modelIdentifier];
                });

            const models = await getAllImportedModels();

            assert.deepEqual(models, [
                {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model1',
                    modelName: 'Imported Model 1',
                },
                {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model2',
                    modelName: 'Imported Model 2',
                },
                {
                    modelArn: 'arn:aws:bedrock:us-east-1:123456789012:imported-model/model3',
                    modelName: 'Imported Model 3',
                },
            ]);
        });

    });
});