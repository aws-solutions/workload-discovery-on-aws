// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, vi, beforeEach, afterEach} from 'vitest';
import {it} from '../../../../vitest/setupFiles/testContext';
import {HttpResponse, graphql} from 'msw';
import * as R from 'ramda';
import {TableWrapper} from '@cloudscape-design/components/test-utils/dom';
import {
    createOrganizationsPerspectiveMetadata,
    createSelfManagedPerspectiveMetadata,
} from '../../../../vitest/testUtils';
import {render} from 'vitest-browser-react';
import {page, userEvent} from '@vitest/browser/context';
import React from 'react';
import App from '../../../../../App';
import {queryClient} from '../../../../../Main';

async function verifyBodyCell(expectedAccount, row) {
    const rowElement = row.getElement();

    // Row indexes starts at 1.
    const accountIdElement = page
        .elementLocator(rowElement.cells[1])
        .getByText(expectedAccount.accountId);

    expect(accountIdElement).toBeInTheDocument();

    const accountNameElement = page
        .elementLocator(rowElement.cells[2])
        .getByText(expectedAccount.name);

    expect(accountNameElement).toBeInTheDocument();

    const regionCountElement = page
        .elementLocator(rowElement.cells[3])
        .getByText(expectedAccount.regions.length.toString());

    expect(regionCountElement).toBeInTheDocument();

    const iamRoleStatusCellElement = rowElement.cells[4];
    expect(iamRoleStatusCellElement.textContent).toContain(
        expectedAccount.iamRoleStatus.text
    );

    const iamRoleStatus = page
        .elementLocator(iamRoleStatusCellElement)
        .getByLabelText(expectedAccount.iamRoleStatus.iconAriaLabel);

    expect(iamRoleStatus).toBeInTheDocument();

    if (expectedAccount.iamRoleStatus.popover != null) {
        await iamRoleStatus.click();
        await expect
            .element(
                page
                    .elementLocator(iamRoleStatusCellElement)
                    .getByText(expectedAccount.iamRoleStatus.popover)
            )
            .toBeInTheDocument();
        // click on a different cell to dismiss popover
        await accountIdElement.click();
    }

    const configStatusCellElement = rowElement.cells[5];
    expect(configStatusCellElement?.textContent).toContain(
        expectedAccount.configStatus.text
    );

    const configStatus = page
        .elementLocator(configStatusCellElement)
        .getByLabelText(expectedAccount.configStatus.iconAriaLabel);

    expect(configStatus).toBeInTheDocument();

    if (expectedAccount.configStatus.popover != null) {
        await configStatus.click({force: true});
        await expect
            .element(
                page
                    .elementLocator(configStatusCellElement)
                    .getByText(expectedAccount.configStatus.popover)
            )
            .toBeInTheDocument();
        // click on a different cell to dismiss popover
        await accountIdElement.click();
    }
}

async function verifyRegionBodyCell(expectedRegion, row) {
    const rowElement = row.getElement();

    // Row indexes starts at 1.
    const regionNameElement = page
        .elementLocator(rowElement.cells[1])
        .getByText(expectedRegion.name);

    expect(regionNameElement).toBeInTheDocument();

    const accountIdElement = page
        .elementLocator(rowElement.cells[2])
        .getByText(expectedRegion.accountId);

    expect(accountIdElement).toBeInTheDocument();

    const countCellElement = rowElement.cells[3];
    if (expectedRegion.count) {
        expect(countCellElement?.textContent).toBe(
            expectedRegion.count.toString()
        );
    } else {
        expect(countCellElement?.textContent).toContain('Not discovered');
        page.elementLocator(countCellElement).getByLabelText(
            'Resource count warning'
        );
    }

    const configStatusCellElement = rowElement.cells[4];
    expect(configStatusCellElement?.textContent).toContain(
        expectedRegion.configStatus.text
    );

    const configStatus = page
        .elementLocator(configStatusCellElement)
        .getByLabelText(expectedRegion.configStatus.iconAriaLabel);

    expect(configStatus).toBeInTheDocument();
    if (expectedRegion.configStatus.popover != null) {
        await configStatus.click();
        await expect
            .element(
                page
                    .elementLocator(configStatusCellElement)
                    .getByText(expectedRegion.configStatus.popover)
            )
            .toBeInTheDocument();
        // click on a different cell to dismiss popover
        await regionNameElement.click();
    }
}

async function getRegionsTable(screen) {
    const regionsTable = screen.getByRole('table', {name: /regions$/i});

    await expect.element(regionsTable).toBeInTheDocument();

    return new TableWrapper(regionsTable.element().parentElement);
}

function findRowByColumnValue(columnHeader, value, tableWrapper) {
    const headers = tableWrapper.findColumnHeaders();
    const columnIndex = headers.findIndex(
        header => header.getElement().textContent === columnHeader
    );

    if (columnIndex === -1) {
        throw new Error(`Could not find "${columnHeader}" column`);
    }

    const rows = tableWrapper.findRows();

    const matchingRows = rows
        .filter((row, index) => {
            const accountIdCell = tableWrapper.findBodyCell(
                // Add 1 because indices in findBodyCell are 1-based
                index + 1,
                columnIndex + 1
            );
            return accountIdCell.getElement()?.textContent === value;
        })
        .map(row => {
            // Get the original row index (adding 1 because findBodyCell is 1-based)
            const rowIndex = rows.indexOf(row) + 1;

            // Get the checkbox cell (always column 1 in Cloudscape tables with selection)
            const checkboxCell = tableWrapper
                .findBodyCell(rowIndex, 1)
                .getElement();

            const checkbox = page
                .elementLocator(checkboxCell)
                .getByRole('checkbox');

            return {
                rowIndex,
                row,
                checkboxCell,
                checkbox,
            };
        });

    if (matchingRows.length === 0) {
        throw new Error(`Row with value ${value} not found`);
    }

    return matchingRows[0];
}

describe('Discoverable Accounts Page', () => {
    beforeEach(() => {
        // we don't want any ract-query caching to interfere with the independence of the tests
        queryClient.clear();
    });

    it('should validate account name', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const screen = render(<App />);

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts$/i,
                hidden: true,
            })
            .click();

        await screen.getByRole('button', {name: /Import/}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Import Method/})
            )
            .toBeInTheDocument();

        const accountCombo = screen.getByRole('combobox', {
            name: /account id/i,
        });

        await userEvent.type(accountCombo, 'yyyyyyyyyyyy');

        const accountNameText = screen.getByRole('textbox', {
            name: /account name/i,
        });

        const regionButton = screen.getByRole('button', {
            name: /regions select regions/i,
        });

        await regionButton.click();

        const euWest1Option = screen.getByRole('option', {
            name: /europe \(ireland\)/i,
        });

        await euWest1Option.click();

        await userEvent.type(accountNameText, '<test account');

        await screen.getByRole('button', {name: /add/i}).click();

        await expect
            .element(
                screen.getByText(
                    'Account name cannot contain < or > character and must be fewer than 100 characters'
                )
            )
            .toBeInTheDocument();

        await userEvent.fill(accountNameText, 'test account');

        await expect
            .element(
                screen.getByText(
                    'Account name cannot contain < or > character and must be fewer than 100 characters'
                )
            )
            .not.toBeInTheDocument();

        await userEvent.fill(accountNameText, 'test account>');

        await expect
            .element(
                screen.getByText(
                    'Account name cannot contain < or > character and must be fewer than 100 characters'
                )
            )
            .toBeInTheDocument();

        await userEvent.fill(accountNameText, 'test account');

        await expect
            .element(
                screen.getByText(
                    'Account name cannot contain < or > character and must be fewer than 100 characters'
                )
            )
            .not.toBeInTheDocument();

        await userEvent.fill(accountNameText, 'a'.repeat(150));

        await expect
            .element(
                screen.getByText(
                    'Account name cannot contain < or > character and must be fewer than 100 characters'
                )
            )
            .toBeInTheDocument();
    });

    it('should display status indicators for iam role deployment and config enablement', async ({
        worker,
    }) => {
        let accountsDb = {
            xxxxxxxxxxxx: {
                accountId: 'xxxxxxxxxxxx',
                name: 'testAccountx',
                isIamRoleDeployed: null,
                regions: [
                    {
                        name: 'us-east-2',
                        isConfigEnabled: null,
                        configStatus: {
                            text: 'Unknown',
                            iconAriaLabel: 'Config enablement status info',
                        },
                    },
                    {
                        name: 'us-east-1',
                        isConfigEnabled: null,
                        configStatus: {
                            text: 'Unknown',
                            iconAriaLabel: 'Config enablement status info',
                        },
                    },
                ],
                iamRoleStatus: {
                    text: 'Unknown',
                    iconAriaLabel: 'Role deployment status info',
                    popover:
                        'The deployment status of the role will be updated on the next successful run of the discovery process.',
                },
                configStatus: {
                    text: '2 regions not enabled',
                    iconAriaLabel: 'Config enabled status error',
                },
            },
            yyyyyyyyyyyy: {
                accountId: 'yyyyyyyyyyyy',
                name: 'testAccounty',
                isIamRoleDeployed: true,
                regions: [
                    {
                        name: 'eu-west-1',
                        isConfigEnabled: true,
                        configStatus: {
                            text: 'Enabled',
                            iconAriaLabel: 'Config enablement status success',
                        },
                    },
                    {
                        name: 'us-east-1',
                        isConfigEnabled: false,
                        configStatus: {
                            text: 'Not Enabled',
                            iconAriaLabel: 'Config enablement status error',
                        },
                    },
                ],
                count: 100,
                iamRoleStatus: {
                    text: 'Deployed',
                    iconAriaLabel: 'Role deployment status success',
                },
                configStatus: {
                    text: '1 region not enabled',
                    iconAriaLabel: 'Config enabled status error',
                },
            },
            zzzzzzzzzzzz: {
                accountId: 'zzzzzzzzzzzz',
                name: 'testAccountz',
                isIamRoleDeployed: false,
                regions: [
                    {
                        name: 'us-east-2',
                        isConfigEnabled: null,
                        configStatus: {
                            text: 'Unknown',
                            iconAriaLabel: 'Config enablement status info',
                            popover:
                                'The enablement status of AWS Config will be updated on the next successful run of the discovery process.',
                        },
                    },
                ],
                iamRoleStatus: {
                    text: 'Not Deployed',
                    iconAriaLabel: 'Role deployment status error',
                    popover:
                        'The Workload Discovery IAM role has not been deployed to this account.',
                },
                configStatus: {
                    text: '1 region not enabled',
                    iconAriaLabel: 'Config enabled status error',
                    popover:
                        'Select the checkbox for this account to see which regions do not have AWS Config enabled',
                },
            },
        };
        worker.use(
            graphql.query('GetAccounts', () => {
                return HttpResponse.json({
                    data: {
                        getAccounts: Object.values(accountsDb).map(account => {
                            return {
                                ...account,
                                regions: account.regions.map(
                                    R.omit(['configStatus'])
                                ),
                            };
                        }),
                    },
                });
            }),
            graphql.query('GetResourcesRegionMetadata', ({variables}) => {
                const {accounts} = variables;
                const resourceRegionMetadata = Object.entries(accountsDb)
                    .filter(([accountId]) =>
                        accounts.map(x => x.accountId).includes(accountId)
                    )
                    .map(([accountId, account]) => {
                        return {
                            accountId,
                            regions: account.regions.map(region => {
                                return {
                                    ...region,
                                    count: account.count,
                                };
                            }),
                        };
                    });
                return HttpResponse.json({
                    data: {
                        getResourcesRegionMetadata: resourceRegionMetadata,
                    },
                });
            })
        );

        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const screen = render(<App />);

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts/i,
                hidden: true,
            })
            .click();

        await expect
            .element(screen.getByText('xxxxxxxxxxxx'))
            .toBeInTheDocument();

        expect(screen.getByRole('button', {name: /Import/})).toBeVisible();

        const accountsTable = await screen.getByRole('table', {
            name: /accounts$/i,
        });

        const accountsTableWrapper = new TableWrapper(
            accountsTable.element().parentElement
        );

        const tableRows = accountsTableWrapper.findRows();

        expect(tableRows).toHaveLength(3);

        expect(
            screen.getByLabelText('IAM role warning alert')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Download global resources template',
            })
        ).toBeInTheDocument();

        const iamRoleAlertText = screen.getByText(
            'The global resources CloudFormation templates have not been deployed to one or more accounts. You must provision this template in these accounts to make them discoverable by Workload Discovery. You can filter the account list by selecting Not Deployed from the Role Status dropdown menu to determine which accounts must be updated. Choose Download global resources template and deploy the template in each of the affected accounts.'
        );

        expect(iamRoleAlertText).toBeInTheDocument();

        for (let i = 0; i < tableRows.length; i++) {
            await verifyBodyCell(Object.values(accountsDb)[i], tableRows[i]);
        }

        const {checkbox: accountXCheckmark} = findRowByColumnValue(
            'Account Id',
            'xxxxxxxxxxxx',
            accountsTableWrapper
        );

        await accountXCheckmark.click();

        const {checkbox: accountYCheckmark} = findRowByColumnValue(
            'Account Id',
            'yyyyyyyyyyyy',
            accountsTableWrapper
        );

        await accountYCheckmark.click();

        const {checkbox: accountZCheckmark} = findRowByColumnValue(
            'Account Id',
            'zzzzzzzzzzzz',
            accountsTableWrapper
        );

        await accountZCheckmark.click();

        await expect(
            screen.getByText(
                /AWS Regions that have been imported into Workload Discovery on AWS/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText('Config enabled error alert')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: 'Download regional resources template',
            })
        ).toBeInTheDocument();

        const regionalAlertText = screen.getByText(
            'The regional resources CloudFormation template has not been deployed to one or more regions. You must provision this template in every imported region to make them discoverable by Workload Discovery. Choose Download regional resources template and deploy the template in each of the affected regions. For more information on how to deploy the template, see the Import a Region documentation.'
        );

        expect(regionalAlertText).toBeInTheDocument();

        expect(
            regionalAlertText.getByRole('link', {name: /import a region/i})
        ).toHaveAttribute(
            'href',
            'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/import-a-region.html'
        );

        const regionsTableWrapper = await getRegionsTable(screen);

        await expect
            .poll(() => {
                return regionsTableWrapper.findRows();
            })
            .toHaveLength(5);

        const regions = Object.values(accountsDb).flatMap(
            ({accountId, count, regions}) => {
                return regions.map(region => {
                    return {
                        ...region,
                        accountId,
                        count,
                    };
                });
            }
        );

        const rows = regionsTableWrapper.findRows();
        for (let i = 0; i < rows.length; i++) {
            await verifyRegionBodyCell(regions[i], rows[i]);
        }
    });

    it('should not display config not enabled alert in AWS Organizations mode', async ({
        worker,
    }) => {
        let accountsDb = {
            xxxxxxxxxxxx: {
                accountId: 'xxxxxxxxxxxx',
                name: 'testAccountx',
                isIamRoleDeployed: null,
                regions: [
                    {
                        name: 'us-east-2',
                        isConfigEnabled: null,
                        configStatus: {
                            text: 'Unknown',
                            iconAriaLabel: 'Config enablement status info',
                        },
                    },
                    {
                        name: 'us-east-1',
                        isConfigEnabled: null,
                        configStatus: {
                            text: 'Unknown',
                            iconAriaLabel: 'Config enablement status info',
                        },
                    },
                ],
                iamRoleStatus: {
                    text: 'Unknown',
                    iconAriaLabel: 'Role deployment status info',
                    popover:
                        'The deployment status of the role will be updated on the next successful run of the discovery process.',
                },
                configStatus: {
                    text: '2 regions not enabled',
                    iconAriaLabel: 'Config enabled status error',
                },
            },
            yyyyyyyyyyyy: {
                accountId: 'yyyyyyyyyyyy',
                name: 'testAccounty',
                isIamRoleDeployed: true,
                regions: [
                    {
                        name: 'eu-west-1',
                        isConfigEnabled: true,
                        configStatus: {
                            text: 'Enabled',
                            iconAriaLabel: 'Config enablement status success',
                        },
                    },
                    {
                        name: 'us-east-1',
                        isConfigEnabled: false,
                        configStatus: {
                            text: 'Not Enabled',
                            iconAriaLabel: 'Config enablement status error',
                        },
                    },
                ],
                count: 100,
                iamRoleStatus: {
                    text: 'Deployed',
                    iconAriaLabel: 'Role deployment status success',
                },
                configStatus: {
                    text: '1 region not enabled',
                    iconAriaLabel: 'Config enabled status error',
                },
            },
            zzzzzzzzzzzz: {
                accountId: 'zzzzzzzzzzzz',
                name: 'testAccountz',
                isIamRoleDeployed: false,
                regions: [
                    {
                        name: 'us-east-2',
                        isConfigEnabled: null,
                        configStatus: {
                            text: 'Unknown',
                            iconAriaLabel: 'Config enablement status info',
                            popover:
                                'The enablement status of AWS Config will be updated on the next successful run of the discovery process.',
                        },
                    },
                ],
                iamRoleStatus: {
                    text: 'Not Deployed',
                    iconAriaLabel: 'Role deployment status error',
                    popover:
                        'The Workload Discovery IAM role has not been deployed to this account.',
                },
                configStatus: {
                    text: '1 region not enabled',
                    iconAriaLabel: 'Config enabled status error',
                    popover:
                        'Select the checkbox for this account to see which regions do not have AWS Config enabled',
                },
            },
        };
        worker.use(
            graphql.query('GetAccounts', () => {
                return HttpResponse.json({
                    data: {
                        getAccounts: Object.values(accountsDb).map(account => {
                            return {
                                ...account,
                                regions: account.regions.map(
                                    R.omit(['configStatus'])
                                ),
                            };
                        }),
                    },
                });
            }),
            graphql.query('GetResourcesRegionMetadata', ({variables}) => {
                const {accounts} = variables;
                const resourceRegionMetadata = Object.entries(accountsDb)
                    .filter(([accountId]) =>
                        accounts.map(x => x.accountId).includes(accountId)
                    )
                    .map(([accountId, account]) => {
                        return {
                            accountId,
                            regions: account.regions.map(region => {
                                return {
                                    ...region,
                                    count: account.count,
                                };
                            }),
                        };
                    });
                return HttpResponse.json({
                    data: {
                        getResourcesRegionMetadata: resourceRegionMetadata,
                    },
                });
            })
        );

        window.perspectiveMetadata = createOrganizationsPerspectiveMetadata();

        const screen = render(<App />);

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts/i,
                hidden: true,
            })
            .click();

        await expect
            .element(screen.getByText('xxxxxxxxxxxx'))
            .toBeInTheDocument();

        await expect
            .element(screen.getByLabelText('Config enabled error alert'))
            .not.toBeInTheDocument();

        await expect
            .element(
                screen.getByRole('button', {
                    name: 'Download regional resources template',
                })
            )
            .not.toBeInTheDocument();

        const regionalAlertText = screen.getByText(
            'The regional resources CloudFormation template has not been deployed to one or more regions. You must provision this template in every imported region to make them discoverable by Workload Discovery. Choose Download regional resources template and deploy the template in each of the affected regions. For more information on how to deploy the template, see the Import a Region documentation.'
        );

        await expect.element(regionalAlertText).not.toBeInTheDocument();
    });

    it('should not have import button in Organizations mode', async ({
        worker,
    }) => {
        window.perspectiveMetadata = createOrganizationsPerspectiveMetadata();

        const screen = render(<App />);

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts/i,
                hidden: true,
            })
            .click();

        await expect
            .element(screen.getByText('yyyyyyyyyyyy'))
            .toBeInTheDocument();

        const importButton = screen
            .getByRole('button', {name: /Import/})
            .query();
        expect(importButton).toBeNull();
    });

    it('should display info status indicator when regions are missing config in AWS Organizations mode', async ({
        worker,
    }) => {
        let accountsDb = {
            yyyyyyyyyyyy: {
                accountId: 'yyyyyyyyyyyy',
                name: 'testAccounty',
                isIamRoleDeployed: true,
                regions: [
                    {
                        name: 'eu-west-1',
                        isConfigEnabled: true,
                        configStatus: {
                            text: 'Enabled',
                            iconAriaLabel: 'Config enablement status success',
                        },
                    },
                    {
                        name: 'us-east-1',
                        isConfigEnabled: false,
                        configStatus: {
                            text: 'Not Enabled',
                            iconAriaLabel: 'Config enablement status info',
                        },
                    },
                ],
                count: 100,
                iamRoleStatus: {
                    text: 'Deployed',
                    iconAriaLabel: 'Role deployment status success',
                },
                configStatus: {
                    text: '1 region not enabled',
                    iconAriaLabel: 'Config enabled status info',
                },
            },
        };
        worker.use(
            graphql.query('GetAccounts', () => {
                return HttpResponse.json({
                    data: {
                        getAccounts: Object.values(accountsDb).map(account => {
                            return {
                                ...account,
                                regions: account.regions.map(
                                    R.omit(['configStatus'])
                                ),
                            };
                        }),
                    },
                });
            }),
            graphql.query('GetResourcesRegionMetadata', ({variables}) => {
                const {accounts} = variables;
                const resourceRegionMetadata = Object.entries(accountsDb)
                    .filter(([accountId]) =>
                        accounts.map(x => x.accountId).includes(accountId)
                    )
                    .map(([accountId, account]) => {
                        return {
                            accountId,
                            regions: account.regions.map(region => {
                                return {
                                    ...region,
                                    count: account.count,
                                };
                            }),
                        };
                    });
                return HttpResponse.json({
                    data: {
                        getResourcesRegionMetadata: resourceRegionMetadata,
                    },
                });
            })
        );

        window.perspectiveMetadata = createOrganizationsPerspectiveMetadata();

        const screen = render(<App />);

        // const {screen} = renderPolarisLayout();
        //
        // // navigation side panel is hidden on first load
        // await screen.getByRole('navigation').getByRole('button').click();

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts/i,
                hidden: true,
            })
            .click();

        await expect
            .element(screen.getByText('yyyyyyyyyyyy'))
            .toBeInTheDocument();

        const accountsTable = await screen.getByRole('table', {
            name: /accounts$/i,
        });

        const accountsTableWrapper = new TableWrapper(
            accountsTable.element().parentElement
        );

        const tableRows = accountsTableWrapper.findRows();

        expect(tableRows).toHaveLength(1);

        for (let i = 0; i < tableRows.length; i++) {
            await verifyBodyCell(Object.values(accountsDb)[i], tableRows[i]);
        }

        const {checkbox: accountYCheckmark} = findRowByColumnValue(
            'Account Id',
            'yyyyyyyyyyyy',
            accountsTableWrapper
        );

        await accountYCheckmark.click();

        await expect(
            screen.getByText(
                /AWS Regions that have been imported into Workload Discovery on AWS/i
            )
        ).toBeInTheDocument();

        const regionsTableWrapper = await getRegionsTable(screen);

        await expect.poll(() => regionsTableWrapper.findRows().length).toBe(2);

        const regions = Object.values(accountsDb).flatMap(
            ({accountId, count, regions}) => {
                return regions.map(region => {
                    return {
                        ...region,
                        accountId,
                        count,
                    };
                });
            }
        );

        const rows = regionsTableWrapper.findRows();
        for (let i = 0; i < rows.length; i++) {
            await verifyRegionBodyCell(regions[i], rows[i]);
        }
    });

    it('should not allow account with no regions to be created', async ({
        worker,
    }) => {
        worker.use(
            graphql.mutation('DeleteRegions', async () => {
                return HttpResponse.json({
                    errors: [
                        {
                            message:
                                'Unable to delete region(s), an account must have at least one region.',
                        },
                    ],
                });
            })
        );

        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();
        window.scrollTo = vi.fn();

        const screen = render(<App />);

        // const {screen} = renderPolarisLayout();
        //
        // await screen.getByRole('navigation').getByRole('button').click();

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts$/i,
                hidden: true,
            })
            .click();

        await expect
            .element(screen.getByText('xxxxxxxxxxxx'))
            .toBeInTheDocument();

        const accountsTable = await screen.getByRole('table', {
            name: /accounts$/i,
        });

        const accountsTableWrapper = new TableWrapper(
            accountsTable.element().parentElement
        );

        const accountCheckmarkCell = accountsTableWrapper
            .findBodyCell(1, 1)
            .getElement();

        const accountCheckmark = page
            .elementLocator(accountCheckmarkCell)
            .getByRole('checkbox');

        await accountCheckmark.click();

        await expect.element(screen.getByText('us-east-1')).toBeInTheDocument();

        const regionsTableWrapper = await getRegionsTable(screen);

        const regionsCheckmarkCell = regionsTableWrapper
            .findBodyCell(1, 1)
            .getElement();

        const regionsCheckmark = page
            .elementLocator(regionsCheckmarkCell)
            .getByRole('checkbox');

        await regionsCheckmark.click();

        const removeButtons = screen
            .getByRole('button', {name: /remove/i})
            .all();
        await removeButtons[1].click();

        await expect
            .element(
                screen.getByText(
                    'Remove the following regions for xxxxxxxxxxxx?'
                )
            )
            .toBeInTheDocument();

        const deleteButton = screen.getByRole('button', {name: /delete/i});

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(deleteButton, '[Enter]');

        const errorNotification = await screen.getByText(
            /the following errors occurred:/i
        );

        await expect
            .element(
                errorNotification.getByText(
                    /Unable to delete region\(s\), an account must have at least one region./i
                )
            )
            .toBeInTheDocument();
    });

    it('should import an account with one region', async ({worker}) => {
        const accounts = [];

        worker.use(
            graphql.mutation('AddAccounts', async ({variables}) => {
                const reqAccounts = variables.accounts;
                accounts.push(...reqAccounts);
                return HttpResponse.json({
                    data: {addAccounts: reqAccounts},
                });
            }),
            graphql.query('GetAccounts', () => {
                return HttpResponse.json({
                    data: {getAccounts: accounts},
                });
            })
        );

        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();
        window.scrollTo = vi.fn();

        const screen = render(<App />);

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts$/i,
                hidden: true,
            })
            .click();

        await screen.getByRole('button', {name: /Import/}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Import Method/})
            )
            .toBeInTheDocument();

        const formRadio = screen.getByRole('radio', {
            name: /add accounts & regions using a form\./i,
        });

        expect(formRadio).toBeChecked();

        const accountCombo = screen.getByRole('combobox', {
            name: /account id/i,
        });

        await userEvent.type(accountCombo, 'testAccounty');

        const accountNameText = screen.getByRole('textbox', {
            name: /account name/i,
        });

        await userEvent.type(accountNameText, 'test account');

        const regionButton = screen.getByRole('button', {
            name: /regions select regions/i,
        });

        await regionButton.click();

        const euWest1Option = screen.getByRole('option', {
            name: /europe \(ireland\)/i,
        });

        await euWest1Option.click();
        await screen.getByRole('button', {name: /add/i}).click();

        await screen
            .getByRole('main')
            .getByRole('button', {name: /import/i})
            .click();

        const dialog = screen.getByRole('dialog', {
            name: /import accounts and regions/i,
        });

        await expect.element(dialog).toBeInTheDocument();

        const globalCheckBox = screen.getByRole('checkbox', {
            name: /the global resources template is deployed in each of the accounts being imported/i,
        });

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(globalCheckBox, '[Space]');

        const regionalCheckBox = screen.getByRole('checkbox', {
            name: /the regional resources template is deployed in every region being imported for each of the listed accounts/i,
        });

        await userEvent.type(regionalCheckBox, '[Space]');

        const importButton = dialog.getByRole('button', {name: /import/i});
        await userEvent.type(importButton, '[Enter]');

        await expect
            .element(screen.getByRole('heading', {level: 2, name: /Accounts$/}))
            .toBeInTheDocument();

        const accountsTable = await screen.getByRole('table', {
            name: /accounts$/i,
        });

        const table = new TableWrapper(accountsTable.element().parentElement);

        await expect.poll(() => table.findRows()).toHaveLength(1);

        const tableRows = table.findRows();

        await verifyBodyCell(
            accounts.map(account => {
                return {
                    ...account,
                    iamRoleStatus: {
                        text: 'Unknown',
                        iconAriaLabel: 'Role deployment status info',
                    },
                    configStatus: {
                        text: '1 region not enabled',
                        iconAriaLabel: 'Config enabled status error',
                    },
                };
            })[0],
            tableRows[0]
        );
    });

    it('should import an account with multiple regions', async ({worker}) => {
        const accounts = [];

        worker.use(
            graphql.mutation('AddAccounts', async ({variables}) => {
                const reqAccounts = variables.accounts;
                accounts.push(...reqAccounts);
                return HttpResponse.json({
                    data: {addAccounts: reqAccounts},
                });
            }),
            graphql.query('GetAccounts', () => {
                return HttpResponse.json({data: {getAccounts: accounts}});
            })
        );

        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();
        window.scrollTo = vi.fn();

        const screen = render(<App />);

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts$/i,
                hidden: true,
            })
            .click();

        await screen.getByRole('button', {name: /Import/}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Import Method/})
            )
            .toBeInTheDocument();

        const formRadio = screen.getByRole('radio', {
            name: /add accounts & regions using a form\./i,
        });

        expect(formRadio).toBeChecked();

        const accountCombo = screen.getByRole('combobox', {
            name: /account id/i,
        });

        await userEvent.type(accountCombo, 'yyyyyyyyyyyy');

        const accountNameText = screen.getByRole('textbox', {
            name: /account name/i,
        });

        await userEvent.type(accountNameText, 'test account');

        const regionButton = screen.getByRole('button', {
            name: /regions select regions/i,
        });

        await regionButton.click();

        const usEast1Option = screen.getByRole('option', {
            name: /us east \(n\. virginia\)/i,
        });

        await usEast1Option.click();

        const euWest1Option = screen.getByRole('option', {
            name: /europe \(ireland\)/i,
        });

        await euWest1Option.click();
        await screen.getByRole('button', {name: /add/i}).click();

        await screen
            .getByRole('main')
            .getByRole('button', {name: /import/i})
            .click();

        const dialog = screen.getByRole('dialog', {
            name: /import accounts and regions/i,
        });

        await expect.element(dialog).toBeInTheDocument();

        const globalCheckBox = screen.getByRole('checkbox', {
            name: /the global resources template is deployed in each of the accounts being imported/i,
        });

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(globalCheckBox, '[Space]');

        const regionalCheckBox = screen.getByRole('checkbox', {
            name: /the regional resources template is deployed in every region being imported for each of the listed accounts/i,
        });

        await userEvent.type(regionalCheckBox, '[Space]');

        const importButton = dialog.getByRole('button', {name: /import/i});

        await userEvent.type(importButton, '[Enter]');

        await expect
            .element(screen.getByRole('heading', {level: 2, name: /Accounts$/}))
            .toBeInTheDocument();

        const accountsTable = await screen.getByRole('table', {
            name: /accounts$/i,
        });

        const table = new TableWrapper(accountsTable.element().parentElement);

        await expect.poll(() => table.findRows()).toHaveLength(1);

        const tableRows = table.findRows();

        await verifyBodyCell(
            accounts.map(account => {
                return {
                    ...account,
                    iamRoleStatus: {
                        text: 'Unknown',
                        iconAriaLabel: 'Role deployment status info',
                    },
                    configStatus: {
                        text: '2 regions not enabled',
                        iconAriaLabel: 'Config enabled status error',
                    },
                };
            })[0],
            tableRows[0]
        );
    });

    it('should update an account name', async ({worker}) => {
        const accountsDb = {};

        worker.use(
            graphql.mutation('AddAccounts', async ({variables}) => {
                const {accounts} = variables;
                accounts.forEach(account => {
                    accountsDb[account.accountId] = {
                        ...account,
                        regions: R.uniq(account.regions),
                    };
                });

                return HttpResponse.json({
                    data: {addAccounts: accounts},
                });
            }),
            graphql.query('GetAccounts', () => {
                return HttpResponse.json({
                    data: {getAccounts: Object.values(accountsDb)},
                });
            })
        );

        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();
        window.scrollTo = vi.fn();

        const screen = render(<App />);

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts$/i,
                hidden: true,
            })
            .click();

        await screen.getByRole('button', {name: /Import/}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Import Method/})
            )
            .toBeInTheDocument();

        const formRadio = screen.getByRole('radio', {
            name: /add accounts & regions using a form\./i,
        });

        expect(formRadio).toBeChecked();

        const accountCombo = screen.getByRole('combobox', {
            name: /account id/i,
        });

        await userEvent.type(accountCombo, 'yyyyyyyyyyyy');

        const accountNameText = screen.getByRole('textbox', {
            name: /account name/i,
        });

        await userEvent.type(accountNameText, 'test account');

        const regionButton = screen.getByRole('button', {
            name: /regions select regions/i,
        });

        await regionButton.click();

        const usEast1Option = screen.getByRole('option', {
            name: /us east \(n\. virginia\)/i,
        });

        await usEast1Option.click();

        const euWest1Option = screen.getByRole('option', {
            name: /europe \(ireland\)/i,
        });

        await euWest1Option.click();
        await screen.getByRole('button', {name: /add/i}).click();

        await screen
            .getByRole('main')
            .getByRole('button', {name: /import/i})
            .click();

        const dialog = screen.getByRole('dialog', {
            name: /import accounts and regions/i,
        });

        await expect.element(dialog).toBeInTheDocument();

        const globalCheckBox = screen.getByRole('checkbox', {
            name: /the global resources template is deployed in each of the accounts being imported/i,
        });

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(globalCheckBox, '[Space]');

        const regionalCheckBox = screen.getByRole('checkbox', {
            name: /the regional resources template is deployed in every region being imported for each of the listed accounts/i,
        });

        await userEvent.type(regionalCheckBox, '[Space]');

        const importButton = dialog.getByRole('button', {name: /import/i});

        await userEvent.type(importButton, '[Enter]');

        await expect
            .element(screen.getByRole('heading', {level: 2, name: /Accounts$/}))
            .toBeInTheDocument();

        const accountsTable = await screen.getByRole('table', {
            name: /accounts$/i,
        });

        const table = new TableWrapper(accountsTable.element().parentElement);

        await expect.poll(() => table.findRows()).toHaveLength(1);

        const tableRows = table.findRows();

        await verifyBodyCell(
            Object.values(accountsDb).map(account => {
                return {
                    ...account,
                    iamRoleStatus: {
                        text: 'Unknown',
                        iconAriaLabel: 'Role deployment status info',
                    },
                    configStatus: {
                        text: '2 regions not enabled',
                        iconAriaLabel: 'Config enabled status error',
                    },
                };
            })[0],
            tableRows[0]
        );

        // update account name

        await screen.getByRole('button', {name: /Import/}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Import Method/})
            )
            .toBeInTheDocument();

        await userEvent.type(accountCombo, 'yyyyyyyyyyyy');

        await userEvent.type(accountNameText, 'update');

        await regionButton.click();

        await usEast1Option.click();

        await screen.getByRole('button', {name: /add/i}).click();

        await screen
            .getByRole('main')
            .getByRole('button', {name: /import/i})
            .click();

        await expect.element(dialog).toBeInTheDocument();

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(globalCheckBox, '[Space]');

        await userEvent.type(regionalCheckBox, '[Space]');

        await userEvent.type(importButton, '[Enter]');

        await expect
            .element(screen.getByRole('heading', {level: 2, name: /Accounts$/}))
            .toBeInTheDocument();

        const updatedTtable = new TableWrapper(
            accountsTable.element().parentElement
        );

        await expect.poll(() => updatedTtable.findRows()).toHaveLength(1);

        const updatedTableRows = updatedTtable.findRows();

        await verifyBodyCell(
            Object.values(accountsDb).map(account => {
                return {
                    ...account,
                    iamRoleStatus: {
                        text: 'Unknown',
                        iconAriaLabel: 'Role deployment status info',
                    },
                    configStatus: {
                        text: '2 regions not enabled',
                        iconAriaLabel: 'Config enabled status error',
                    },
                };
            })[0],
            updatedTableRows[0]
        );
    });

    it('should be able to delete a region', async ({worker}) => {
        const regionToRemove = 'us-east-2';

        let accountsDb = {
            xxxxxxxxxxxx: {
                accountId: 'xxxxxxxxxxxx',
                name: 'testAccount1',
                isIamRoleDeployed: true,
                regions: [
                    {
                        name: 'us-east-2',
                        isConfigEnabled: true,
                        configStatus: {
                            text: 'Enabled',
                            iconAriaLabel: 'Config enablement status success',
                        },
                    },
                    {
                        name: 'us-east-1',
                        isConfigEnabled: true,
                        configStatus: {
                            text: 'Enabled',
                            iconAriaLabel: 'Config enablement status success',
                        },
                    },
                ],
                count: 100,
            },
        };

        worker.use(
            graphql.query('GetResourcesRegionMetadata', ({variables}) => {
                const {accounts} = variables;
                const resourceRegionMetadata = Object.entries(accountsDb)
                    .filter(([accountId]) =>
                        accounts.map(x => x.accountId).includes(accountId)
                    )
                    .map(([accountId, account]) => {
                        return {
                            accountId,
                            count: account.count,
                            regions: account.regions.map(region => {
                                return {
                                    ...region,
                                    count: account.count,
                                };
                            }),
                        };
                    });
                return HttpResponse.json({
                    data: {
                        getResourcesRegionMetadata: resourceRegionMetadata,
                    },
                });
            }),
            graphql.query('GetAccounts', () => {
                return HttpResponse.json({
                    data: {getAccounts: Object.values(accountsDb)},
                });
            }),
            graphql.mutation('DeleteRegions', ({variables}) => {
                const {accountId, regions} = variables;

                if (accountsDb[accountId]) {
                    const regionNamesToRemove = regions.map(r => r.name);
                    accountsDb[accountId].regions = accountsDb[
                        accountId
                    ].regions.filter(
                        region => !regionNamesToRemove.includes(region.name)
                    );
                }

                return HttpResponse.json({
                    data: {
                        deleteRegions: true,
                    },
                });
            })
        );

        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();
        window.scrollTo = vi.fn();

        const screen = render(<App />);

        const group = screen.getByRole('group', {
            name: /configure/i,
            hidden: true,
        });

        await group
            .getByRole('link', {
                name: /accounts/i,
                hidden: true,
            })
            .click();

        await expect
            .element(screen.getByText('xxxxxxxxxxxx'))
            .toBeInTheDocument();

        const accountsTable = await screen.getByRole('table', {
            name: /accounts$/i,
        });

        const accountsTableWrapper = new TableWrapper(
            accountsTable.element().parentElement
        );

        const tableRows = accountsTableWrapper.findRows();
        expect(tableRows).toHaveLength(1);

        const {checkbox: accountXCheckmark} = findRowByColumnValue(
            'Account Id',
            'xxxxxxxxxxxx',
            accountsTableWrapper
        );

        await accountXCheckmark.click();

        await expect
            .element(screen.getByText(regionToRemove))
            .toBeInTheDocument();

        const regionsTableWrapper = await getRegionsTable(screen);
        expect(regionsTableWrapper.findRows()).toHaveLength(2);

        const {checkbox: usWest2Checkmark} = findRowByColumnValue(
            'Region',
            regionToRemove,
            regionsTableWrapper
        );

        await usWest2Checkmark.click();

        const removeRegionButton = page
            .elementLocator(regionsTableWrapper.getElement())
            .getByRole('button', {name: /remove/i});

        const removeButtons = screen
            .getByRole('button', {name: /remove/i})
            .all();

        await removeButtons[1].click();

        await expect.element(
            screen.getByText('Remove the following regions for xxxxxxxxxxxx?')
        );

        const deleteButton = screen.getByRole('button', {name: /delete/i});

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(deleteButton, '[Space]');

        // ensure GetResourcesRegionMetadata call has completed and only one region is left
        await expect.poll(() => regionsTableWrapper.findRows().length).toBe(1);

        const regions = Object.values(accountsDb).flatMap(
            ({accountId, count, regions}) => {
                return regions
                    .filter(x => x.region !== regionToRemove)
                    .map(region => {
                        return {
                            ...region,
                            count,
                            accountId,
                        };
                    });
            }
        );

        const rows = regionsTableWrapper.findRows();
        for (let i = 0; i < rows.length; i++) {
            await verifyRegionBodyCell(regions[i], rows[i]);
        }
    });
});
