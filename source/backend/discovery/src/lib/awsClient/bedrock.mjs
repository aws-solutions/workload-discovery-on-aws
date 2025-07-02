import {
    Bedrock,
    BedrockClient,
    paginateListCustomModels,
    paginateListImportedModels,
    paginateListInferenceProfiles,
} from '@aws-sdk/client-bedrock';
import {createThrottler, throttledPaginator} from '../awsClient.mjs';
import {customUserAgent} from '../config.mjs';

export function createBedrockClient(credentials, region) {
    const bedrockClient = new Bedrock({customUserAgent, region, credentials});

    const bedrockPaginatorConfig = {
        client: new BedrockClient({customUserAgent, region, credentials}),
        pageSize: 200,
    };

    const bedrockListInferenceProfilesThrottler = createThrottler(
        'bedrockListInferenceProfilesThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const bedrockListCustomModelsThrottler = createThrottler(
        'bedrockListCustomModelsThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const bedrockListImportedModelsThrottler = createThrottler(
        'bedrockListImportedModelsThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    return {
        // TODO: rename to getAllInferenceProfiles
        async listAllInferenceProfiles() {
            const listInferenceProfilesPaginator = paginateListInferenceProfiles(bedrockPaginatorConfig, {
                maxResults: 200
            });

            const inferenceProfiles = [];

            for await (const {inferenceProfileSummaries} of throttledPaginator(
                bedrockListInferenceProfilesThrottler,
                listInferenceProfilesPaginator,
            )) {
                inferenceProfiles.push(...inferenceProfileSummaries);
            }

            return inferenceProfiles;
        },

        async getAllFoundationModels() {
            // listFoundationModels is not a paginated operation
            const {modelSummaries} = await bedrockClient.listFoundationModels({});
            return modelSummaries;
        },

        async getAllCustomModels() {
            const listCustomModelsPaginator = paginateListCustomModels(bedrockPaginatorConfig, {
                maxResults: 100,
            });

            const customModels = [];

            for await (const {modelSummaries} of throttledPaginator(
                bedrockListCustomModelsThrottler,
                listCustomModelsPaginator,
            )) {
                // Process models serially to reduce chances of rate limiting
                for (const modelSummary of modelSummaries) {
                    const customModel = await bedrockClient.getCustomModel({ modelIdentifier: modelSummary.modelArn })
                    customModels.push(customModel);
                }
            }

            return customModels;
        },

        async getAllImportedModels() {
            const listImportedModelsPaginator = paginateListImportedModels(bedrockPaginatorConfig, {
                maxResults: 100,
            });

            const importedModels = [];

            for await (const {modelSummaries} of throttledPaginator(
                bedrockListImportedModelsThrottler,
                listImportedModelsPaginator,
            )) {
                // Process models serially to reduce chances of rate limiting
                for (const modelSummary of modelSummaries) {
                    const importedModel = await bedrockClient.getImportedModel({ modelIdentifier: modelSummary.modelArn })
                    importedModels.push(importedModel);
                }
            }

            return importedModels;
        }
    };
}