import { OpenSearchServerless, OpenSearchServerlessClient, paginateListCollections } from '@aws-sdk/client-opensearchserverless';
import { createThrottler, throttledPaginator } from '../awsClient.mjs';
import { customUserAgent } from '../config.mjs';
import * as R from 'ramda';

export function createOpenSearchServerlessClient(credentials, region) {
    const openSearchServerlessClient = new OpenSearchServerless({
        customUserAgent,
        region,
        credentials
    });

    const openSearchServerlessPaginatorConfig = {
        client: new OpenSearchServerlessClient({
            customUserAgent,
            region,
            credentials
        }),
        pageSize: 100,
    };

    const openSearchListCollectionsThrottler = createThrottler(
        'openSearchListCollectionsThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    return {
        async getAllCollections() {
            const listCollectionsPaginator = paginateListCollections(
                openSearchServerlessPaginatorConfig,
                {
                    maxResults: 100
                }
            );

            const collections = [];

            for await (const {collectionSummaries} of throttledPaginator(
                openSearchListCollectionsThrottler,
                listCollectionsPaginator,
            )) {
                if (!R.isEmpty(collectionSummaries)) {
                    const ids = collectionSummaries.map(x =>x.id)
                    const {collectionDetails} = await openSearchServerlessClient.batchGetCollection({ids})
                    collections.push(...collectionDetails);
                }
            }

            return collections;
        },
    };
}