// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {assert} = require('chai');
const sinon = require('sinon');
const {
    persistResourcesAndRelationships
} = require('../../src/lib/persistence');

describe('index.js', () => {

    describe('batching', () => {
        const mockApiClient = {
            deleteResources: sinon.stub(),
            updateResources: sinon.stub(),
            storeResources: sinon.stub(),
            deleteRelationships: sinon.stub(),
            storeRelationships: sinon.stub()
        };

        it('should batch requests to the backend', async () => {
            await persistResourcesAndRelationships(mockApiClient, {
                resourceIdsToDelete: [], resourcesToStore: [], resourcesToUpdate: [],
                linksToAdd: [], linksToDelete: []
            });

            sinon.assert.calledWith(mockApiClient.deleteResources, {concurrency: 5, batchSize: 50});
            sinon.assert.calledWith(mockApiClient.updateResources, {concurrency: 10, batchSize: 10});
            sinon.assert.calledWith(mockApiClient.storeResources, {concurrency: 10, batchSize: 10});
            sinon.assert.calledWith(mockApiClient.deleteRelationships, {concurrency: 5, batchSize: 50});
            sinon.assert.calledWith(mockApiClient.storeRelationships, {concurrency: 10, batchSize: 20});
        });
    });

});
