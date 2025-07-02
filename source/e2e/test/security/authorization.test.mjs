import {describe, it, expect} from 'vitest';

const {GRAPHQL_ENDPOINT} = process.env;

async function executeGraphQL(query) {
    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
    });

    if (response.status !== 200) {
        const error = new Error(`GraphQL request failed with status ${response.status}`);
        error.status = response.status;
        throw error;
    }

    const data = await response.json();

    if (data.errors) {
        const error = new Error(data.errors[0]?.message ?? 'GraphQL operation failed with errors');
        error.graphqlErrors = data.errors;
        throw error;
    }

    return data;
}

describe('GraphQL API Authentication Tests', () => {
    describe('Mutations require authentication', () => {
        const mutations = [
            {
                name: 'addAccounts',
                query: 'mutation { addAccounts(accounts: [{ accountId: "123456789012" }]) { unprocessedAccounts } }',
            },
            {name: 'deleteRelationships', query: 'mutation { deleteRelationships(relationshipIds: ["test-id"]) }'},
            {name: 'deleteResources', query: 'mutation { deleteResources(resourceIds: ["test-id"]) }'},
            {
                name: 'updateAccount',
                query: 'mutation { updateAccount(accountId: "123456789012", name: "Test") { accountId } }',
            },
            {
                name: 'updateRegions',
                query: 'mutation { updateRegions(accountId: "123456789012", regions: [{ name: "us-east-1" }]) { accountId } }',
            },
            {
                name: 'addRegions',
                query: 'mutation { addRegions(accountId: "123456789012", regions: [{ name: "us-east-1" }]) { accountId } }',
            },
            {
                name: 'addRelationships',
                query: 'mutation { addRelationships(relationships: [{ source: "source", target: "target", label: "test" }]) { id } }',
            },
            {
                name: 'addResources',
                query: 'mutation { addResources(resources: [{ id: "test-id", label: "test" }]) { id } }',
            },
            {
                name: 'indexResources',
                query: 'mutation { indexResources(resources: [{ id: "test-id", label: "test" }]) { unprocessedResources } }',
            },
            {
                name: 'deleteIndexedResources',
                query: 'mutation { deleteIndexedResources(resourceIds: ["test-id"]) { unprocessedResources } }',
            },
            {
                name: 'updateResources',
                query: 'mutation { updateResources(resources: [{ id: "test-id", label: "test" }]) { id } }',
            },
            {
                name: 'updateIndexedResources',
                query: 'mutation { updateIndexedResources(resources: [{ id: "test-id", label: "test" }]) { unprocessedResources } }',
            },
            {
                name: 'deleteRegions',
                query: 'mutation { deleteRegions(accountId: "123456789012", regions: [{ name: "us-east-1" }]) { accountId } }',
            },
            {
                name: 'deleteAccounts',
                query: 'mutation { deleteAccounts(accountIds: ["123456789012"]) { unprocessedAccounts } }',
            },
            {
                name: 'createApplication',
                query: 'mutation { createApplication(name: "test", accountId: "123456789012", region: "us-east-1", resources: [{ id: "test-id" }]) { applicationTag } }',
            },
        ];

        it.each(mutations)('$name should return 401 Unauthorized without authentication', async ({name, query}) => {
            return executeGraphQL(query)
                .then(() => {
                    throw new Error(`${name} did not require authentication!`);
                })
                .catch(error => {
                    console.log(`${name}: ${error.status ?? 'Error'} - ${error.message}`);
                    expect(error.status).toEqual(401);
                });
        });
    });

    describe('Queries require authentication', () => {
        const queries = [
            {name: 'getResources', query: 'query { getResources(pagination: { start: 0, end: 10 }) { id } }'},
            {name: 'getRelationships', query: 'query { getRelationships(pagination: { start: 0, end: 10 }) { id } }'},
            {
                name: 'getResourceGraph',
                query: 'query { getResourceGraph(ids: ["test-id"], pagination: { start: 0, end: 10 }) { nodes { id } } }',
            },
            {name: 'getResourcesMetadata', query: 'query { getResourcesMetadata { count } }'},
            {name: 'getResourcesAccountMetadata', query: 'query { getResourcesAccountMetadata { accountId } }'},
            {name: 'getResourcesRegionMetadata', query: 'query { getResourcesRegionMetadata { accountId } }'},
            {name: 'getAccount', query: 'query { getAccount(accountId: "123456789012") { accountId } }'},
            {name: 'getAccounts', query: 'query { getAccounts { accountId } }'},
            {name: 'getCostReportProcessingStatus', query: 'query { getCostReportProcessingStatus { isEnabled } }'},
            {
                name: 'readResultsFromS3',
                query: 'query { readResultsFromS3(s3Query: { bucket: "test", key: "test", pagination: { start: 0, end: 10 } }) { totalCost } }',
            },
            {
                name: 'getCostForService',
                query: 'query { getCostForService(costForServiceQuery: { period: { from: "2023-01-01", to: "2023-01-31" }, pagination: { start: 0, end: 10 } }) { totalCost } }',
            },
            {
                name: 'getCostForResource',
                query: 'query { getCostForResource(costForResourceQuery: { resourceIds: ["test-id"], period: { from: "2023-01-01", to: "2023-01-31" }, pagination: { start: 0, end: 10 } }) { totalCost } }',
            },
            {
                name: 'getResourcesByCost',
                query: 'query { getResourcesByCost(resourcesByCostQuery: { period: { from: "2023-01-01", to: "2023-01-31" }, pagination: { start: 0, end: 10 } }) { totalCost } }',
            },
            {
                name: 'getResourcesByCostByDay',
                query: 'query { getResourcesByCostByDay(costForResourceQueryByDay: { resourceIds: ["test-id"], period: { from: "2023-01-01", to: "2023-01-31" }, pagination: { start: 0, end: 10 } }) { totalCost } }',
            },
            {name: 'getGlobalTemplate', query: 'query { getGlobalTemplate }'},
            {name: 'getRegionalTemplate', query: 'query { getRegionalTemplate }'},
            {
                name: 'searchResources',
                query: 'query { searchResources(text: "test", pagination: { start: 0, end: 10 }) { count } }',
            },
            {
                name: 'exportToDrawIo',
                query: 'query { exportToDrawIo(nodes: [{ id: "test-id", title: "test", label: "test", type: "test", position: { x: 0, y: 0 } }]) }',
            },
            {
                name: 'getApplicationProblems',
                query: 'query { getApplicationProblems { logProblems { ... on GenericLogProblem { name } } } }',
            },
        ];

        it.each(queries)('$name should return 401 Unauthorized without authentication', async ({name, query}) => {
            return executeGraphQL(query)
                .then(() => {
                    throw new Error(`${name} did not require authentication!`);
                })
                .catch(error => {
                    console.log(`${name}: ${error.status ?? 'Error'} - ${error.message}`);
                    expect(error.status).toEqual(401);
                });
        });
    });
});