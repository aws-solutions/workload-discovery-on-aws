import {assert, describe, it} from 'vitest';
import * as R from 'ramda';
import {ACCOUNT_X, ACCOUNT_Z, mockAwsClient} from '../getAllSdkResources.test.mjs';
import {credentialsX, credentialsZ} from '../getAllSdkResources.test.mjs';
import * as sdkResources from '../../src/lib/sdkResources/index.mjs';
import {
    AWS_GLUE_CONNECTION,
    AWS_GLUE_CRAWLER,
    AWS_GLUE_DATABASE,
    AWS_GLUE_TABLE,
    NOT_APPLICABLE,
    RESOURCE_DISCOVERED,
} from '../../src/lib/constants.mjs';
import {generateRandomInt} from '../generator.mjs';

const defaultMockGlueClient = {
    getAllCrawlers: () => [],
    getAllConnections: () => [],
    getAllDatabases: () => [],
    getAllTables: () => [],
};

function generateCrawler() {
    return {
        Name: `crawler-${generateRandomInt(0, 10000)}`,
        DatabaseName: `crawler-${generateRandomInt(0, 10000)}`,
        State: 'READY',
    };
}

function generateConnection() {
    return {
        Name: `connection-${generateRandomInt(0, 10000)}`,
        ConnectionType: 'JDBC',
    };
}

function generateDatabase() {
    return {
        Name: `database-${generateRandomInt(0, 10000)}`,
        Description: `Description for database-${generateRandomInt(0, 10000)}`,
    };
}

describe('getAllSdkResources - Glue', () => {

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

    describe(AWS_GLUE_CRAWLER, () => {

        it('should discover Glue crawlers', async () => {
            const crawlerEuWest2 = generateCrawler();
            const crawlerUsWest2 = generateCrawler();

            const mockGlueClient = {
                createGlueClient(credentials, region) {
                    return {
                        ...defaultMockGlueClient,
                        getAllCrawlers() {
                            if (R.equals(credentials, credentialsX) && region === 'eu-west-2') {
                                return [crawlerEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2') {
                                return [crawlerUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockGlueClient},
                [],
            );

            const crawlerEuWest2Arn = `arn:aws:glue:eu-west-2:${ACCOUNT_X}:crawler/${crawlerEuWest2.Name}`;
            const crawlerUsWest2Arn = `arn:aws:glue:us-west-2:${ACCOUNT_Z}:crawler/${crawlerUsWest2.Name}`;

            const actualCrawlerEuWest2 = actual.find(x => x.arn === crawlerEuWest2Arn);
            const actualCrawlerUsWest2 = actual.find(x => x.arn === crawlerUsWest2Arn);

            assert.deepEqual(actualCrawlerEuWest2, {
                id: crawlerEuWest2Arn,
                accountId: ACCOUNT_X,
                arn: crawlerEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'eu-west-2',
                configuration: {
                    ...crawlerEuWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: crawlerEuWest2.Name,
                resourceName: crawlerEuWest2.Name,
                resourceType: AWS_GLUE_CRAWLER,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualCrawlerUsWest2, {
                id: crawlerUsWest2Arn,
                accountId: ACCOUNT_Z,
                arn: crawlerUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'us-west-2',
                configuration: {
                    ...crawlerUsWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: crawlerUsWest2.Name,
                resourceName: crawlerUsWest2.Name,
                resourceType: AWS_GLUE_CRAWLER,
                tags: [],
                relationships: [],
            });
        });

    });

    describe(AWS_GLUE_CONNECTION, () => {
        it('should discover Glue connections', async () => {
            const connectionEuWest2 = generateConnection();
            const connectionUsWest2 = generateConnection();

            const mockGlueClient = {
                createGlueClient(credentials, region) {
                    return {
                        ...defaultMockGlueClient,
                        getAllConnections() {
                            if (R.equals(credentials, credentialsX) && region === 'eu-west-2') {
                                return [connectionEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2') {
                                return [connectionUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockGlueClient},
                [],
            );

            const connectionEuWest2Arn = `arn:aws:glue:eu-west-2:${ACCOUNT_X}:connection/${connectionEuWest2.Name}`;
            const connectionUsWest2Arn = `arn:aws:glue:us-west-2:${ACCOUNT_Z}:connection/${connectionUsWest2.Name}`;

            const actualConnectionEuWest2 = actual.find(x => x.arn === connectionEuWest2Arn);
            const actualConnectionUsWest2 = actual.find(x => x.arn === connectionUsWest2Arn);

            assert.deepEqual(actualConnectionEuWest2, {
                id: connectionEuWest2Arn,
                accountId: ACCOUNT_X,
                arn: connectionEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'eu-west-2',
                configuration: {
                    ...connectionEuWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: connectionEuWest2.Name,
                resourceName: connectionEuWest2.Name,
                resourceType: AWS_GLUE_CONNECTION,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualConnectionUsWest2, {
                id: connectionUsWest2Arn,
                accountId: ACCOUNT_Z,
                arn: connectionUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'us-west-2',
                configuration: {
                    ...connectionUsWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: connectionUsWest2.Name,
                resourceName: connectionUsWest2.Name,
                resourceType: AWS_GLUE_CONNECTION,
                tags: [],
                relationships: [],
            });
        });
    });

    describe(AWS_GLUE_DATABASE, () => {

        it('should discover Glue databases', async () => {
            const databaseEuWest2 = generateDatabase();
            const databaseUsWest2 = generateDatabase();

            const mockGlueClient = {
                createGlueClient(credentials, region) {
                    return {
                        ...defaultMockGlueClient,
                        getAllDatabases() {
                            if (R.equals(credentials, credentialsX) && region === 'eu-west-2') {
                                return [databaseEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2') {
                                return [databaseUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockGlueClient},
                [],
            );

            const databaseEuWest2Arn = `arn:aws:glue:eu-west-2:${ACCOUNT_X}:database/${databaseEuWest2.Name}`;
            const databaseUsWest2Arn = `arn:aws:glue:us-west-2:${ACCOUNT_Z}:database/${databaseUsWest2.Name}`;

            const actualDatabaseEuWest2 = actual.find(x => x.arn === databaseEuWest2Arn);
            const actualDatabaseUsWest2 = actual.find(x => x.arn === databaseUsWest2Arn);

            assert.deepEqual(actualDatabaseEuWest2, {
                id: databaseEuWest2Arn,
                accountId: ACCOUNT_X,
                arn: databaseEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'eu-west-2',
                configuration: {
                    ...databaseEuWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: databaseEuWest2.Name,
                resourceName: databaseEuWest2.Name,
                resourceType: AWS_GLUE_DATABASE,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualDatabaseUsWest2, {
                id: databaseUsWest2Arn,
                accountId: ACCOUNT_Z,
                arn: databaseUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'us-west-2',
                configuration: {
                    ...databaseUsWest2,
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: databaseUsWest2.Name,
                resourceName: databaseUsWest2.Name,
                resourceType: AWS_GLUE_DATABASE,
                tags: [],
                relationships: [],
            });
        });
    });

    describe(AWS_GLUE_TABLE, () => {

        it('should retrieve tables for a specified database across multiple regions', async () => {
            const databaseNameEuWest2 = `database-eu-west-${generateRandomInt(0, 10000)}`;
            const databaseNameUsWest2 = `database-us-west-${generateRandomInt(0, 10000)}`;

            const tableEuWest2 = {
                Name: `table-eu-${generateRandomInt(0, 10000)}`,
                DatabaseName: databaseNameEuWest2,
            };

            const tableUsWest2 = {
                Name: `table-us-${generateRandomInt(0, 10000)}`,
                DatabaseName: databaseNameUsWest2,
            };

            const mockGlueClient = {
                createGlueClient(credentials, region) {
                    return {
                        ...defaultMockGlueClient,
                        getAllTables(dbName) {
                            if (R.equals(credentials, credentialsX) && region === 'eu-west-2' && dbName === databaseNameEuWest2) {
                                return [tableEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === 'us-west-2' && dbName === databaseNameUsWest2) {
                                return [tableUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const databaseResourceEuWest2 = {
                arn: `arn:aws:glue:eu-west-2:${ACCOUNT_X}:table/${tableEuWest2.Name}`,
                accountId: ACCOUNT_X,
                awsRegion: 'eu-west-2',
                resourceId: databaseNameEuWest2,
                resourceName: databaseNameEuWest2,
                resourceType: AWS_GLUE_DATABASE,
                configuration: {
                    Name: databaseNameEuWest2,
                },
            };

            const databaseResourceUsWest2 = {
                arn: `arn:aws:glue:us-west-2:${ACCOUNT_Z}:table/${tableUsWest2.Name}`,
                accountId: ACCOUNT_Z,
                awsRegion: 'us-west-2',
                resourceId: databaseNameUsWest2,
                resourceName: databaseNameUsWest2,
                resourceType: AWS_GLUE_DATABASE,
                configuration: {
                    Name: databaseNameUsWest2,
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockGlueClient},
                [databaseResourceEuWest2, databaseResourceUsWest2],
            );

            const euTableId = `${tableEuWest2.DatabaseName}/${tableEuWest2.Name}`;
            const euTableArn = `arn:aws:glue:eu-west-2:${ACCOUNT_X}:table/${euTableId}`;
            const actualEuTable = actual.find(x => x.arn === euTableArn);

            const usTableId = `${tableUsWest2.DatabaseName}/${tableUsWest2.Name}`;
            const usTableArn = `arn:aws:glue:us-west-2:${ACCOUNT_Z}:table/${usTableId}`;
            const actualUsTable = actual.find(x => x.arn === usTableArn);

            assert.deepEqual(actualEuTable, {
                id: euTableArn,
                accountId: ACCOUNT_X,
                arn: euTableArn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'eu-west-2',
                configuration: tableEuWest2,
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: euTableId,
                resourceName: tableEuWest2.Name,
                resourceType: AWS_GLUE_TABLE,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualUsTable, {
                id: usTableArn,
                accountId: ACCOUNT_Z,
                arn: usTableArn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: 'us-west-2',
                configuration: tableUsWest2,
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: usTableId,
                resourceName: tableUsWest2.Name,
                resourceType: AWS_GLUE_TABLE,
                tags: [],
                relationships: [],
            });
        });
    });

});