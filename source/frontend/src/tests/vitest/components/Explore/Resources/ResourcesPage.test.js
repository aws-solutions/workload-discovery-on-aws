// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {describe, expect, it} from 'vitest';
import {
    findByText,
    getByText,
    render,
    screen,
    within,
} from '@testing-library/react';
import {TableWrapper} from '@cloudscape-design/components/test-utils/dom';

import ResourcesPage from '../../../../../components/Explore/Resources/ResourcesPage';
import {diagramSettingsReducer} from '../../../../../components/Contexts/Reducers/DiagramSettingsReducer';
import {ResourceProvider} from '../../../../../components/Contexts/ResourceContext';
import {resourceReducer} from '../../../../../components/Contexts/Reducers/ResourceReducer';
import {DiagramSettingsProvider} from '../../../../../components/Contexts/DiagramSettingsContext';
import userEvent from '@testing-library/user-event';
import {server} from '../../../../mocks/server';
import {graphql, HttpResponse} from 'msw';
import {
    createOrganizationsPerspectiveMetadata,
    createSelfManagedPerspectiveMetadata,
} from '../../../testUtils';

function renderResourcesPage() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchInterval: 60000,
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    });

    const initialResourceState = {
        graphResources: [],
        resources: [],
    };

    const initialDiagramSettingsState = {
        canvas: null,
        selectedResources: null,
        resources: [],
    };

    return render(
        <QueryClientProvider client={queryClient}>
            <DiagramSettingsProvider
                initialState={initialDiagramSettingsState}
                reducer={diagramSettingsReducer}
            >
                <ResourceProvider
                    initialState={initialResourceState}
                    reducer={resourceReducer}
                >
                    <ResourcesPage />
                </ResourceProvider>
            </DiagramSettingsProvider>
        </QueryClientProvider>
    );
}

function getCellText(table, row, column) {
    return table.findBodyCell(row, column).getElement()?.innerHTML;
}

describe('Resource Page', () => {
    it('should display account and resource metadata and resources', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        renderResourcesPage();

        const Overview = await screen.findByTestId(
            'resources-metadata-overview'
        );

        const resourcesDiscoveredParent = await findByText(
            Overview,
            /Resources discovered/
        );
        const resourcesDiscovered = getByText(
            resourcesDiscoveredParent.parentElement,
            /\d+/
        );

        // this value is the sum of the number of resources returned by the mocked
        // `GetResourcesMetadata GQL query
        expect(resourcesDiscovered).toHaveTextContent(29);

        const resourcesTypesParent = await findByText(
            Overview,
            /Resources types/
        );
        const resourcesTypes = getByText(
            resourcesTypesParent.parentElement,
            /\d+/
        );

        // this value is the number of different resource types returned by the mocked
        // `GetResourcesMetadata GQL query
        expect(resourcesTypes).toHaveTextContent(12);

        const accountsParent = await findByText(Overview, /Accounts$/);
        const accounts = getByText(accountsParent.parentElement, /\d+/);

        // this value is the number of accounts returned by the mocked
        // `getResourcesAccountMetadataResponse` GQL query
        expect(accounts).toHaveTextContent(2);

        const regionsParent = await findByText(Overview, /Regions/);
        const regions = getByText(regionsParent.parentElement, /\d+/);

        // this value is the number of regions returned by the mocked
        // `GetResourcesRegionMetadata` GQL query
        expect(regions).toHaveTextContent(3);

        // this value is the number of resource types returned by the mocked
        // `getResourcesAccountMetadataResponse` GQL query
        await screen.findByRole('heading', {
            level: 2,
            name: /Resources types \(12\)/,
        });

        const pageSizeSelector = await screen.findByRole('button', {
            name: /search results page size/i,
        });

        await userEvent.click(pageSizeSelector);

        const paginationOption250 = await screen.findByRole('option', {
            name: /250/i,
        });

        await userEvent.click(paginationOption250);

        // this value is the number of resources returned by the mocked
        // `SearchResources` GQL query
        await screen.findByRole('heading', {
            level: 2,
            name: /Resources \(29\)/,
        });
    });

    it('should show warning when selecting more than 150 resources', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        server.use(
            graphql.query('SearchResources', () => {
                const resources = [];

                // Generate 200 mock resources using forEach
                Array.from({length: 151}).forEach((_, i) => {
                    resources.push({
                        id: `arn:aws:kms:eu-west-1:123456789012:key/mock-key-${i}`,
                        label: 'AWS_KMS_Key',
                        md5Hash: null,
                        properties: {
                            arn: `arn:aws:kms:eu-west-1:123456789012:key/mock-key-${i}`,
                            accountId: '123456789012',
                            availabilityZone: 'Regional',
                            awsRegion: 'eu-west-1',
                            resourceId: `mock-key-${i}`,
                            resourceName: `mock-key-${i}`,
                            resourceType: 'AWS::KMS::Key',
                            title: `Mock KMS Key ${i}`,
                            state: 'Enabled',
                            tags: '[]',
                            configuration: `{"KeyId":"mock-key-${i}"}`,
                        },
                    });
                });

                return HttpResponse.json({
                    data: {
                        searchResources: {
                            count: resources.length,
                            resources: resources,
                        },
                    },
                });
            })
        );

        const user = userEvent.setup();
        renderResourcesPage();

        // Wait for resources to load
        await screen.findByRole('heading', {
            level: 2,
            name: /Resources \(151\)/,
        });

        const pageSizeSelector = await screen.findByRole('button', {
            name: /search results page size/i,
        });

        await user.click(pageSizeSelector);

        const paginationOption = await screen.findByRole('option', {
            name: /250/i,
        });
        await user.click(paginationOption);

        const resourcesTable = await screen.findByRole('table', {
            name: /resources$/i,
        });

        const resourcesTableWrapper = new TableWrapper(
            resourcesTable.parentElement
        );

        // performance of getByRole degrades significantly when there are 150 checkboxes
        // so we need to fall back to Cloudscape testing utilities that are more performant
        // for this use case
        const selectAll = resourcesTableWrapper
            .findSelectAllTrigger()
            .getElement();

        await user.click(selectAll);

        await screen.findByText(
            /selecting this many resources will add hundreds, or potentially thousands, of resources to the diagram once the selected resources' relationships have been traversed\. this may impact performance\./i
        );
    });

    it('should retrieve account metadata in batches of 50', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        server.use(
            graphql.query('GetResourcesMetadata', async () => {
                const accounts = [];

                for (let i = 0; i < 100; i++) {
                    const paddedNum = i.toString().padStart(2, 'O');
                    accounts.push({
                        accountId: `xxxxxxxxxx${paddedNum}`,
                        regions: [{name: 'eu-west-1'}],
                    });
                }

                return HttpResponse.json({
                    data: {
                        getResourcesMetadata: {
                            count: 100,
                            accounts,
                            resourceTypes: [
                                {
                                    count: 100,
                                    type: 'AWS::IAM::Role',
                                },
                            ],
                        },
                    },
                });
            }),
            graphql.query('GetResourcesAccountMetadata', ({variables}) => {
                const reqAccounts = variables.accounts;
                const accounts = reqAccounts.map(({accountId}) => {
                    return {
                        accountId,
                        count: 1,
                        resourceTypes: [
                            {
                                count: 1,
                                type: 'AWS::IAM::Role',
                            },
                        ],
                    };
                });
                return HttpResponse.json({
                    data: {getResourcesAccountMetadata: accounts},
                });
            }),
            graphql.query('GetResourcesRegionMetadata', ({variables}) => {
                const reqAccounts = variables.accounts;
                const accounts = reqAccounts.map(({accountId}) => {
                    return {
                        accountId,
                        count: 1,
                        regions: [
                            {
                                count: 1,
                                name: 'eu-west-1',
                                resourceTypes: [
                                    {
                                        count: 1,
                                        type: 'AWS::IAM::Role',
                                    },
                                ],
                            },
                        ],
                    };
                });
                return HttpResponse.json({
                    data: {getResourcesRegionMetadata: accounts},
                });
            })
        );

        renderResourcesPage();

        const Overview = await screen.findByTestId(
            'resources-metadata-overview'
        );

        const resourcesDiscoveredParent = await findByText(
            Overview,
            /Resources discovered/
        );

        const resourcesDiscovered = getByText(
            resourcesDiscoveredParent.parentElement,
            /\d+/
        );

        expect(resourcesDiscovered).toHaveTextContent(100);

        const resourcesTypesParent = await findByText(
            Overview,
            /Resources types/
        );

        const resourcesTypes = getByText(
            resourcesTypesParent.parentElement,
            /\d+/
        );

        expect(resourcesTypes).toHaveTextContent(1);

        const accountsParent = await findByText(Overview, /Accounts$/);
        const accounts = getByText(accountsParent.parentElement, /\d+/);

        expect(accounts).toHaveTextContent(100);

        const regionsParent = await findByText(Overview, /Regions/);
        const regions = getByText(regionsParent.parentElement, /\d+/);

        expect(regions).toHaveTextContent(100);

        await screen.findByRole('heading', {
            level: 2,
            name: /Resources types \(1\)/,
        });
    });

    it('should filter resources by account id and resource type', async () => {
        window.perspectiveMetadata = createOrganizationsPerspectiveMetadata();

        const user = userEvent.setup();

        renderResourcesPage();

        // filter by account id
        const accountFilterButton = await screen.findByRole('button', {
            name: /accounts choose accounts to filter by/i,
        });
        await user.click(accountFilterButton);

        const filterOption = await screen.findByRole('option', {
            name: /xxxxxxxxxxxx/i,
        });
        await user.click(filterOption);

        await screen.findByRole('heading', {
            level: 2,
            name: /Resources \(13\)/,
        });

        // filter further by resource type
        const ecsClusterCheckbox = await screen.findByRole('checkbox', {
            name: /aws::ecs::cluster is not selected/i,
        });

        await user.click(ecsClusterCheckbox);

        await screen.findByRole('heading', {level: 2, name: /Resources \(1\)/});

        const resourcesTable = await screen.findByRole('table', {
            name: /resources$/i,
        });

        const resourcesTableWrapper = new TableWrapper(
            resourcesTable.parentElement
        );
        const resourcesTableRows = resourcesTableWrapper.findRows();

        // verify that only a single ECS CLuster is rendered
        expect(resourcesTableRows).toHaveLength(1);

        expect(getCellText(resourcesTableWrapper, 1, 2)).toMatch(
            /\/icons\/Amazon-Elastic-Container-Service-menu.svg/
        );
        expect(getCellText(resourcesTableWrapper, 1, 3)).toBe(
            'arn:aws:xxxxxxxxxxxx:eu-west-2:AWS::ECS::Cluster:0Title'
        );
        expect(getCellText(resourcesTableWrapper, 1, 4)).toBe(
            'AWS::ECS::Cluster'
        );
        expect(getCellText(resourcesTableWrapper, 1, 5)).toBe('xxxxxxxxxxxx');
        expect(getCellText(resourcesTableWrapper, 1, 6)).toBe('eu-west-2');
    });
});
