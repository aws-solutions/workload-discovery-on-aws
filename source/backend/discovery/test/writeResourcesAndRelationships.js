const {assert} = require('chai');
const sinon = require('sinon');
const {writeResourcesAndRelationships} = require('../src/lib/persistence');

describe('persistence/index.js', () => {

    describe('batching', () => {
        const mockApiClient = {
            deleteResources: sinon.stub(),
            updateResources: sinon.stub(),
            storeResources: sinon.stub(),
            deleteRelationships: sinon.stub(),
            storeRelationships: sinon.stub()
        };

        it('should batch requests to the backend', async () => {
            await writeResourcesAndRelationships(mockApiClient, {
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