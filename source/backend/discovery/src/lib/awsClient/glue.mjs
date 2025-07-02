import {
    Glue,
    GlueClient,
    paginateGetConnections,
    paginateGetDatabases,
    paginateGetTables,
    paginateListCrawlers,
} from '@aws-sdk/client-glue';
import {createThrottler, throttledPaginator} from '../awsClient.mjs';
import {customUserAgent} from '../config.mjs';
import * as R from 'ramda';

export function createGlueClient(credentials, region) {
    const glueClient = new Glue({customUserAgent, region, credentials});

    const gluePaginatorConfig = {
        client: new GlueClient({customUserAgent, region, credentials}),
        pageSize: 100,
    };

    const glueListCrawlersThrottler = createThrottler(
        'glueListCrawlersThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const glueGetDatabasesThrottler = createThrottler(
        'glueGetDatabasesThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const glueGetConnectionsThrottler = createThrottler(
        'glueGetConnectionsThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const glueGetTablesThrottler = createThrottler(
        'glueGetTablesThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );


    return {
        async getAllCrawlers() {
            const listCrawlersPaginator = paginateListCrawlers(gluePaginatorConfig, {
                MaxResults: 100,
            });

            const crawlers = [];

            for await (const {CrawlerNames} of throttledPaginator(
                glueListCrawlersThrottler,
                listCrawlersPaginator,
            )) {
                if (!R.isEmpty(CrawlerNames)) {
                    const {Crawlers} = await glueClient.batchGetCrawlers({CrawlerNames});
                    crawlers.push(...Crawlers);
                }
            }

            return crawlers;
        },
        async getAllDatabases() {
            const getDatabasesPaginator = paginateGetDatabases(gluePaginatorConfig, {
                MaxResults: 100,
            });

            const databases = [];

            for await (const {DatabaseList} of throttledPaginator(
                glueGetDatabasesThrottler,
                getDatabasesPaginator,
            )) {
                if (!R.isEmpty(DatabaseList)) {
                    databases.push(...DatabaseList);
                }
            }

            return databases;
        },

        async getAllConnections() {
            const getConnectionsPaginator = paginateGetConnections(gluePaginatorConfig, {
                MaxResults: 100,
            });

            const connections = [];

            for await (const {ConnectionList} of throttledPaginator(
                glueGetConnectionsThrottler,
                getConnectionsPaginator,
            )) {
                if (!R.isEmpty(ConnectionList)) {
                    connections.push(...ConnectionList);
                }
            }

            return connections;
        },
        getAllTables: glueGetTablesThrottler(async DatabaseName => {
            const getTablesPaginator = paginateGetTables(gluePaginatorConfig, {
                MaxResults: 100,
                DatabaseName
            });

            const tables = [];

            for await (const {TableList} of throttledPaginator(
                glueGetTablesThrottler,
                getTablesPaginator,
            )) {
                tables.push(...TableList);
            }

            return tables;
        }),
    };
}