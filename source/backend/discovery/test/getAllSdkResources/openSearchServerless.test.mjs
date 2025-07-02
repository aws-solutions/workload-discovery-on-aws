import {assert, describe, it} from 'vitest';
import * as R from 'ramda';
import {ACCOUNT_X, ACCOUNT_Z, mockAwsClient} from '../getAllSdkResources.test.mjs';
import {credentialsX, credentialsZ} from '../getAllSdkResources.test.mjs';
import * as sdkResources from '../../src/lib/sdkResources/index.mjs';
import {
    AWS_OPENSEARCH_SERVERLESS_COLLECTION,
    NOT_APPLICABLE,
    RESOURCE_DISCOVERED,
} from '../../src/lib/constants.mjs';
import {generateRandomInt} from '../generator.mjs';

function generateCollection(region, accountId) {
    const id = `collection-${generateRandomInt(0, 10000)}`;
    const name = `Collection-${generateRandomInt(0, 10000)}`;
    return {
        id,
        name,
        arn: `arn:aws:aoss:${region}:${accountId}:collection/${id}`,
        status: 'ACTIVE',
    };
}

describe('getAllSdkResources - OpenSearch Serverless', () => {

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

    describe(AWS_OPENSEARCH_SERVERLESS_COLLECTION, () => {

        it('should discover OpenSearch Serverless collections', async () => {
            const collectionEuWest2 = generateCollection('eu-west-2', ACCOUNT_X);
            const collectionUsWest2 = generateCollection('us-west-2', ACCOUNT_Z);

            const mockOpenSearchServerlessClient = {
                createOpenSearchServerlessClient(credentials, region) {
                    return {
                        getAllCollections() {
                            if (R.equals(credentials, credentialsX) && region === 'eu-west-2') {
                                return [collectionEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2') {
                                return [collectionUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockOpenSearchServerlessClient},
                [],
            );

            const actualCollectionEuWest2 = actual.find(x => x.arn === collectionEuWest2.arn);
            const actualCollectionUsWest2 = actual.find(x => x.arn === collectionUsWest2.arn);

            assert.deepEqual(actualCollectionEuWest2, {
                id: collectionEuWest2.arn,
                accountId: ACCOUNT_X,
                arn: collectionEuWest2.arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'eu-west-2',
                configuration: {
                    ...collectionEuWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: collectionEuWest2.id,
                resourceName: collectionEuWest2.name,
                resourceType: AWS_OPENSEARCH_SERVERLESS_COLLECTION,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualCollectionUsWest2, {
                id: collectionUsWest2.arn,
                accountId: ACCOUNT_Z,
                arn: collectionUsWest2.arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'us-west-2',
                configuration: {
                    ...collectionUsWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: collectionUsWest2.id,
                resourceName: collectionUsWest2.name,
                resourceType: AWS_OPENSEARCH_SERVERLESS_COLLECTION,
                tags: [],
                relationships: [],
            });
        });
    });
});
