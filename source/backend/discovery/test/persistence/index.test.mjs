// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import sinon from 'sinon';
import {
    persistResourcesAndRelationships,
    processPersistenceFailures,
} from '../../src/lib/persistence/index.mjs';
import {generateBaseResource} from '../generator.mjs';
import {
    AWS_LAMBDA_FUNCTION,
    AWS_EC2_VPC,
    AWS_EC2_INSTANCE,
    AWS_IAM_ROLE,
    AWS_RDS_DB_CLUSTER,
} from '../../src/lib/constants.mjs';

describe('index.mjs', () => {
    const mockNoErrors = {errors: []};

    describe('batching', () => {
        const mockApiClient = {
            deleteResources: sinon.stub().resolves(mockNoErrors),
            updateResources: sinon.stub().resolves(mockNoErrors),
            storeResources: sinon.stub().resolves(mockNoErrors),
            deleteRelationships: sinon.stub().resolves(mockNoErrors),
            storeRelationships: sinon.stub().resolves(mockNoErrors),
        };

        it('should batch requests to the backend', async () => {
            await persistResourcesAndRelationships(mockApiClient, {
                resourceIdsToDelete: [],
                resourcesToStore: [],
                resourcesToUpdate: [],
                linksToAdd: [],
                linksToDelete: [],
            });

            sinon.assert.calledWith(mockApiClient.deleteResources, {
                concurrency: 5,
                batchSize: 50,
            });
            sinon.assert.calledWith(mockApiClient.updateResources, {
                concurrency: 10,
                batchSize: 10,
            });
            sinon.assert.calledWith(mockApiClient.storeResources, {
                concurrency: 10,
                batchSize: 10,
            });
            sinon.assert.calledWith(mockApiClient.deleteRelationships, {
                concurrency: 5,
                batchSize: 50,
            });
            sinon.assert.calledWith(mockApiClient.storeRelationships, {
                concurrency: 10,
                batchSize: 20,
            });
        });
    });

    describe('write errors', () => {
        it('returns delete failures', async () => {
            const mockApiClient = {
                deleteResources: sinon
                    .stub()
                    .resolves({
                        errors: [
                            {item: ['arn1', 'arn2']},
                            {item: ['arn3']},
                            {item: ['arn4']},
                        ],
                    }),
                updateResources: sinon.stub().resolves(mockNoErrors),
                storeResources: sinon.stub().resolves(mockNoErrors),
                deleteRelationships: sinon.stub().resolves(mockNoErrors),
                storeRelationships: sinon.stub().resolves(mockNoErrors),
            };

            const {failedDeletes} = await persistResourcesAndRelationships(
                mockApiClient,
                {
                    resourceIdsToDelete: [],
                    resourcesToStore: [],
                    resourcesToUpdate: [],
                    linksToAdd: [],
                    linksToDelete: [],
                }
            );

            assert.deepEqual(failedDeletes, ['arn1', 'arn2', 'arn3', 'arn4']);
        });

        it('returns store failures', async () => {
            const mockApiClient = {
                deleteResources: sinon.stub().resolves(mockNoErrors),
                updateResources: sinon.stub().resolves(mockNoErrors),
                storeResources: sinon
                    .stub()
                    .resolves({
                        errors: [
                            {item: [{id: 'arn1'}, {id: 'arn2'}]},
                            {item: [{id: 'arn3'}]},
                            {item: [{id: 'arn4'}]},
                        ],
                    }),
                deleteRelationships: sinon.stub().resolves(mockNoErrors),
                storeRelationships: sinon.stub().resolves(mockNoErrors),
            };

            const {failedStores} = await persistResourcesAndRelationships(
                mockApiClient,
                {
                    resourceIdsToDelete: [],
                    resourcesToStore: [],
                    resourcesToUpdate: [],
                    linksToAdd: [],
                    linksToDelete: [],
                }
            );

            assert.deepEqual(failedStores, ['arn1', 'arn2', 'arn3', 'arn4']);
        });
    });

    describe('processPersistenceFailures', () => {
        const ACCOUNT_IDX = 'xxxxxxxxxxxx';
        const EU_WEST_1 = 'eu-west-1';

        it('should removed failed stores', () => {
            const dbResources = [
                generateBaseResource(
                    ACCOUNT_IDX,
                    EU_WEST_1,
                    AWS_LAMBDA_FUNCTION,
                    1
                ),
                generateBaseResource(ACCOUNT_IDX, EU_WEST_1, AWS_EC2_VPC, 2),
                generateBaseResource(
                    ACCOUNT_IDX,
                    EU_WEST_1,
                    AWS_EC2_INSTANCE,
                    3
                ),
            ];

            const dbResourcesMap = new Map(dbResources.map(x => [x.id, x]));
            const resourceToStore = generateBaseResource(
                ACCOUNT_IDX,
                EU_WEST_1,
                AWS_IAM_ROLE,
                4
            );
            const resourceToStoreFail = generateBaseResource(
                ACCOUNT_IDX,
                EU_WEST_1,
                AWS_RDS_DB_CLUSTER,
                5
            );

            const resources = [
                ...dbResources,
                resourceToStoreFail,
                resourceToStore,
            ];

            const actual = processPersistenceFailures(
                dbResourcesMap,
                resources,
                {
                    failedDeletes: [],
                    failedStores: [resourceToStoreFail.id],
                }
            );

            assert.deepEqual([...dbResources, resourceToStore], actual);
        });

        it('should keep failed deletes', () => {
            const resources = [
                generateBaseResource(
                    ACCOUNT_IDX,
                    EU_WEST_1,
                    AWS_LAMBDA_FUNCTION,
                    1
                ),
                generateBaseResource(ACCOUNT_IDX, EU_WEST_1, AWS_EC2_VPC, 2),
                generateBaseResource(
                    ACCOUNT_IDX,
                    EU_WEST_1,
                    AWS_EC2_INSTANCE,
                    3
                ),
            ];

            const resourceToDelete = generateBaseResource(
                ACCOUNT_IDX,
                EU_WEST_1,
                AWS_IAM_ROLE,
                4
            );
            const resourceToDeleteFail = generateBaseResource(
                ACCOUNT_IDX,
                EU_WEST_1,
                AWS_RDS_DB_CLUSTER,
                5
            );

            const dbResources = [
                ...resources,
                resourceToDelete,
                resourceToDeleteFail,
            ];

            const dbResourcesMap = new Map(dbResources.map(x => [x.id, x]));

            const actual = processPersistenceFailures(
                dbResourcesMap,
                resources,
                {
                    failedDeletes: [resourceToDeleteFail.id],
                    failedStores: [],
                }
            );

            assert.deepEqual([...resources, resourceToDeleteFail], actual);
        });
    });
});
