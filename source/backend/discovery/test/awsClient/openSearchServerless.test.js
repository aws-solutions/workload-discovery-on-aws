// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import {mockClient} from 'aws-sdk-client-mock';
import {
    OpenSearchServerlessClient,
    ListCollectionsCommand,
    BatchGetCollectionCommand,
} from '@aws-sdk/client-opensearchserverless';
import {createOpenSearchServerlessClient} from '../../src/lib/awsClient/opensearchServerless.mjs';

describe('OpenSearch Serverless Client', () => {

    const mockCredentials = {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        sessionToken: 'optionalSessionToken',
    };

    const {
        getAllCollections,
    } = createOpenSearchServerlessClient(mockCredentials, 'eu-west-1');

    describe('getAllCollections', () => {

        it('should get all collections', async () => {
            const mockOpenSearchServerlessClient = mockClient(OpenSearchServerlessClient);

            const collectionPages = {
                'page1': {
                    collectionSummaries: [
                        {id: 'collection1', name: 'Collection One'},
                        {id: 'collection2', name: 'Collection Two'},
                    ],
                    nextToken: 'token1',
                },
                'token1': {
                    collectionSummaries: [
                        {id: 'collection3', name: 'Collection Three'},
                        {id: 'collection4', name: 'Collection Four'},
                    ],
                    nextToken: 'token2',
                },
                'token2': {
                    collectionSummaries: [
                        {id: 'collection5', name: 'Collection Five'},
                    ],
                },
            };

            mockOpenSearchServerlessClient.on(ListCollectionsCommand)
                .callsFake(input => {
                    const {nextToken} = input;
                    if (nextToken) {
                        return collectionPages[nextToken];
                    }
                    return collectionPages['page1'];
                });

            const collectionsData = {
                'collection1': {id: 'collection1', name: 'Collection One', status: 'ACTIVE'},
                'collection2': {id: 'collection2', name: 'Collection Two', status: 'ACTIVE'},
                'collection3': {id: 'collection3', name: 'Collection Three', status: 'ACTIVE'},
                'collection4': {id: 'collection4', name: 'Collection Four', status: 'ACTIVE'},
                'collection5': {id: 'collection5', name: 'Collection Five', status: 'ACTIVE'},
            };

            mockOpenSearchServerlessClient.on(BatchGetCollectionCommand)
                .callsFake(({ids}) => {
                    return {
                        collectionDetails: ids.map(id => collectionsData[id]),
                    };
                });

            const collections = await getAllCollections();

            assert.deepEqual(collections, [
                {
                    id: 'collection1',
                    name: 'Collection One',
                    status: 'ACTIVE',
                },
                {
                    id: 'collection2',
                    name: 'Collection Two',
                    status: 'ACTIVE',
                },
                {
                    id: 'collection3',
                    name: 'Collection Three',
                    status: 'ACTIVE',
                },
                {
                    id: 'collection4',
                    name: 'Collection Four',
                    status: 'ACTIVE',
                },
                {
                    id: 'collection5',
                    name: 'Collection Five',
                    status: 'ACTIVE',
                },
            ]);
        });
    });
});
