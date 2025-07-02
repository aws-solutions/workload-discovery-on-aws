// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import {mockClient} from 'aws-sdk-client-mock';
import {
    GlueClient,
    ListCrawlersCommand,
    BatchGetCrawlersCommand,
    GetDatabasesCommand,
    GetConnectionsCommand,
    GetTablesCommand,
} from '@aws-sdk/client-glue';
import {createGlueClient} from '../../src/lib/awsClient/glue.mjs';

describe('Glue Client', () => {

    const mockCredentials = {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        sessionToken: 'optionalSessionToken',
    };

    const {
        getAllCrawlers,
        getAllDatabases,
        getAllConnections,
        getAllTables,
    } = createGlueClient(mockCredentials, 'eu-west-1');

    describe('getAllCrawlers', () => {

        it('should get all crawlers', async () => {
            const mockGlueClient = mockClient(GlueClient);

            const crawlerNames = {
                'page1': {
                    CrawlerNames: ['crawler1', 'crawler2'],
                    NextToken: 'token1',
                },
                'token1': {
                    CrawlerNames: ['crawler3', 'crawler4'],
                    NextToken: 'token2',
                },
                'token2': {
                    CrawlerNames: ['crawler5'],
                },
            };

            mockGlueClient.on(ListCrawlersCommand)
                .callsFake(input => {
                    const {NextToken} = input;
                    if (NextToken) {
                        return crawlerNames[NextToken];
                    }
                    return crawlerNames['page1'];
                });

            const crawlersData = {
                'crawler1': {Name: 'crawler1', Role: 'role1', Targets: {S3Targets: [{Path: 's3://bucket1'}]}},
                'crawler2': {Name: 'crawler2', Role: 'role2', Targets: {S3Targets: [{Path: 's3://bucket2'}]}},
                'crawler3': {Name: 'crawler3', Role: 'role3', Targets: {S3Targets: [{Path: 's3://bucket3'}]}},
                'crawler4': {Name: 'crawler4', Role: 'role4', Targets: {S3Targets: [{Path: 's3://bucket4'}]}},
                'crawler5': {Name: 'crawler5', Role: 'role5', Targets: {S3Targets: [{Path: 's3://bucket5'}]}},
            };

            mockGlueClient.on(BatchGetCrawlersCommand)
                .callsFake(({CrawlerNames}) => {
                    return {
                        Crawlers: CrawlerNames.map(name => crawlersData[name]),
                    };
                });

            const crawlers = await getAllCrawlers();

            assert.deepEqual(crawlers, [
                {Name: 'crawler1', Role: 'role1', Targets: {S3Targets: [{Path: 's3://bucket1'}]}},
                {Name: 'crawler2', Role: 'role2', Targets: {S3Targets: [{Path: 's3://bucket2'}]}},
                {Name: 'crawler3', Role: 'role3', Targets: {S3Targets: [{Path: 's3://bucket3'}]}},
                {Name: 'crawler4', Role: 'role4', Targets: {S3Targets: [{Path: 's3://bucket4'}]}},
                {Name: 'crawler5', Role: 'role5', Targets: {S3Targets: [{Path: 's3://bucket5'}]}},
            ]);
        });
    });

    describe('getAllDatabases', () => {

        it('should get all databases with pagination', async () => {
            const mockGlueClient = mockClient(GlueClient);

            const databasesPages = {
                'page1': {
                    DatabaseList: [
                        { Name: 'database1', Description: 'desc1' },
                        { Name: 'database2', Description: 'desc2' }
                    ],
                    NextToken: 'token1',
                },
                'token1': {
                    DatabaseList: [
                        { Name: 'database3', Description: 'desc3' },
                        { Name: 'database4', Description: 'desc4' }
                    ],
                    NextToken: 'token2',
                },
                'token2': {
                    DatabaseList: [
                        { Name: 'database5', Description: 'desc5' }
                    ]
                },
            };

            mockGlueClient.on(GetDatabasesCommand)
                .callsFake(input => {
                    const {NextToken} = input;
                    if (NextToken) {
                        return databasesPages[NextToken];
                    }
                    return databasesPages['page1'];
                });

            const databases = await getAllDatabases();

            assert.deepEqual(databases, [
                { Name: 'database1', Description: 'desc1' },
                { Name: 'database2', Description: 'desc2' },
                { Name: 'database3', Description: 'desc3' },
                { Name: 'database4', Description: 'desc4' },
                { Name: 'database5', Description: 'desc5' }
            ]);
        });
    });

    describe('getAllConnections', () => {
        it('should get all connections with pagination', async () => {
            const mockGlueClient = mockClient(GlueClient);

            const connectionsPages = {
                'page1': {
                    ConnectionList: [
                        { Name: 'connection1', ConnectionType: 'JDBC', ConnectionProperties: { HOST: 'host1' } },
                        { Name: 'connection2', ConnectionType: 'JDBC', ConnectionProperties: { HOST: 'host2' } }
                    ],
                    NextToken: 'token1',
                },
                'token1': {
                    ConnectionList: [
                        { Name: 'connection3', ConnectionType: 'KAFKA', ConnectionProperties: { HOST: 'host3' } },
                        { Name: 'connection4', ConnectionType: 'MONGODB', ConnectionProperties: { HOST: 'host4' } }
                    ],
                    NextToken: 'token2',
                },
                'token2': {
                    ConnectionList: [
                        { Name: 'connection5', ConnectionType: 'NETWORK', ConnectionProperties: { HOST: 'host5' } }
                    ]
                },
            };

            mockGlueClient.on(GetConnectionsCommand)
                .callsFake(input => {
                    const {NextToken} = input;
                    if (NextToken) {
                        return connectionsPages[NextToken];
                    }
                    return connectionsPages['page1'];
                });

            const connections = await getAllConnections();

            assert.deepEqual(connections, [
                { Name: 'connection1', ConnectionType: 'JDBC', ConnectionProperties: { HOST: 'host1' } },
                { Name: 'connection2', ConnectionType: 'JDBC', ConnectionProperties: { HOST: 'host2' } },
                { Name: 'connection3', ConnectionType: 'KAFKA', ConnectionProperties: { HOST: 'host3' } },
                { Name: 'connection4', ConnectionType: 'MONGODB', ConnectionProperties: { HOST: 'host4' } },
                { Name: 'connection5', ConnectionType: 'NETWORK', ConnectionProperties: { HOST: 'host5' } }
            ]);
        });
    });

    describe('getTables', () => {
        it('should get all tables for a given database with pagination', async () => {
            const mockGlueClient = mockClient(GlueClient);

            const databaseName = 'test-database';

            const tablesPages = {
                [`page1-${databaseName}`]: {
                    TableList: [
                        {Name: 'table1', DatabaseName: databaseName, StorageDescriptor: {Columns: []}},
                        {Name: 'table2', DatabaseName: databaseName, StorageDescriptor: {Columns: []}}
                    ],
                    NextToken: 'token1',
                },
                'token1': {
                    TableList: [
                        {Name: 'table3', DatabaseName: databaseName, StorageDescriptor: {Columns: []}},
                        {Name: 'table4', DatabaseName: databaseName, StorageDescriptor: {Columns: []}}
                    ],
                    NextToken: 'token2',
                },
                'token2': {
                    TableList: [
                        {Name: 'table5', DatabaseName: databaseName, StorageDescriptor: {Columns: []}}
                    ]
                },
            };

            mockGlueClient.on(GetTablesCommand)
                .callsFake(input => {
                    const {NextToken, DatabaseName} = input;
                    if (NextToken) {
                        return tablesPages[NextToken];
                    }
                    return tablesPages[`page1-${DatabaseName}`];
                });

            const tables = await getAllTables(databaseName);

            assert.deepEqual(tables, [
                {Name: 'table1', DatabaseName: databaseName, StorageDescriptor: {Columns: []}},
                {Name: 'table2', DatabaseName: databaseName, StorageDescriptor: {Columns: []}},
                {Name: 'table3', DatabaseName: databaseName, StorageDescriptor: {Columns: []}},
                {Name: 'table4', DatabaseName: databaseName, StorageDescriptor: {Columns: []}},
                {Name: 'table5', DatabaseName: databaseName, StorageDescriptor: {Columns: []}}
            ]);
        });
    });

});
