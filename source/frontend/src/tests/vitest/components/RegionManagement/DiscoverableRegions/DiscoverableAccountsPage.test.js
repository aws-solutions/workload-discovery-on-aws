// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {screen, waitFor, within} from '@testing-library/react';
import {server} from '../../../../mocks/server';
import {HttpResponse, graphql} from 'msw';
import * as R from 'ramda';
import {TableWrapper} from '@cloudscape-design/components/test-utils/dom';
import {getAccounts} from '../../../../mocks/fixtures/getAccounts/default.json';
import userEvent from '@testing-library/user-event';
import {
    createOrganizationsPerspectiveMetadata,
    createSelfManagedPerspectiveMetadata,
    renderPolarisLayout,
} from '../../../testUtils';

function verifyBodyCell(expectedAccount, row) {
    const rowElement = row.getElement();

    // Row indexes starts at 1.
    expect(rowElement.cells[1].innerHTML).toBe(expectedAccount.accountId);
    expect(rowElement.cells[2].innerHTML).toBe(expectedAccount.name);
    expect(rowElement.cells[3].innerHTML).toBe(
        expectedAccount.regions.length.toString()
    );

    const iamRoleStatusColumnElement = rowElement.cells[4];
    expect(iamRoleStatusColumnElement.innerHTML).toContain(
        expectedAccount.iamRoleStatus.text
    );
    within(iamRoleStatusColumnElement).getByLabelText(
        expectedAccount.iamRoleStatus.iconAriaLabel
    );
}

function verifyRegionBodyCell(expectedRegion, row) {
    const rowElement = row.getElement();

    // Row indexes starts at 1.
    expect(rowElement.cells[1].innerHTML).toBe(expectedRegion.name);
    expect(rowElement.cells[2].innerHTML).toBe(expectedRegion.accountId);

    const countCellElement = rowElement.cells[3];
    if (expectedRegion.count) {
        expect(countCellElement?.innerHTML).toBe(
            expectedRegion.count.toString()
        );
    } else {
        expect(countCellElement?.innerHTML).toContain('Not discovered');
        within(countCellElement).getByLabelText('Resource count warning');
    }
}

async function getRegionsTable() {
    const regionsTable = await screen.findByRole('table', {name: /regions$/i});
    return new TableWrapper(regionsTable.parentElement);
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

            const checkbox = within(checkboxCell).getByRole('checkbox');

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
        vi.mock('@aws-amplify/ui-react', async () => {
            const mod = await vi.importActual('@aws-amplify/ui-react');
            return {
                ...mod,
                useAuthenticator: () => ({
                    user: {
                        username: 'testUser',
                    },
                    signOut: vi.fn(),
                }),
            };
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Discoverable Accounts Table', () => {
        it('should display account data', async () => {
            window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

            const user = userEvent.setup();

            renderPolarisLayout();

            const group = screen.getByRole('group', {
                name: /configure/i,
                hidden: true,
            });

            const accountsLink = within(group).getByRole('link', {
                name: /accounts/i,
                hidden: true,
            });

            await user.click(accountsLink);

            await screen.findByText('xxxxxxxxxxxx');

            expect(screen.getByRole('button', {name: /Import/})).toBeVisible();

            const accountsTable = await screen.findByRole('table', {
                name: /accounts$/i,
            });

            const table = new TableWrapper(accountsTable.parentElement);

            const tableRows = table.findRows();

            expect(tableRows).toHaveLength(2);

            // We pass index + 1 as the rowNumber because findBodyCell starts at index 1.
            tableRows.forEach(function (row, index) {
                verifyBodyCell(
                    getAccounts.map(account => {
                        return {
                            ...account,
                            iamRoleStatus: {
                                text: 'Deployed',
                                iconAriaLabel: 'Role deployment status success',
                            },
                        };
                    })[index],
                    row
                );
            });
        });

        it('should display status indicators for iam role deployment and config enablement', async () => {
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
                                iconAriaLabel:
                                    'Config enablement status success',
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
                            },
                        },
                    ],
                    iamRoleStatus: {
                        text: 'Not Deployed',
                        iconAriaLabel: 'Role deployment status error',
                    },
                    configStatus: {
                        text: '1 region not enabled',
                        iconAriaLabel: 'Config enabled status error',
                    },
                },
            };
            server.use(
                graphql.query('GetAccounts', () => {
                    return HttpResponse.json({
                        data: {
                            getAccounts: Object.values(accountsDb).map(
                                account => {
                                    return {
                                        ...account,
                                        regions: account.regions.map(
                                            R.omit(['configStatus'])
                                        ),
                                    };
                                }
                            ),
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

            const user = userEvent.setup();

            renderPolarisLayout();

            const group = screen.getByRole('group', {
                name: /configure/i,
                hidden: true,
            });

            const accountsLink = within(group).getByRole('link', {
                name: /accounts/i,
                hidden: true,
            });

            await user.click(accountsLink);

            await screen.findByText('xxxxxxxxxxxx');

            expect(screen.getByRole('button', {name: /Import/})).toBeVisible();

            const accountsTable = await screen.findByRole('table', {
                name: /accounts$/i,
            });

            const accountsTableWrapper = new TableWrapper(
                accountsTable.parentElement
            );

            const tableRows = accountsTableWrapper.findRows();

            expect(tableRows).toHaveLength(3);

            tableRows.forEach(function (row, index) {
                verifyBodyCell(Object.values(accountsDb)[index], row);
            });

            const {checkbox: accountXCheckmark} = findRowByColumnValue(
                'Account Id',
                'xxxxxxxxxxxx',
                accountsTableWrapper
            );

            await user.click(accountXCheckmark);

            const {checkbox: accountYCheckmark} = findRowByColumnValue(
                'Account Id',
                'yyyyyyyyyyyy',
                accountsTableWrapper
            );

            await user.click(accountYCheckmark);

            const {checkbox: accountZCheckmark} = findRowByColumnValue(
                'Account Id',
                'zzzzzzzzzzzz',
                accountsTableWrapper
            );

            await user.click(accountZCheckmark);

            await screen.findByText(
                /AWS Regions that have been imported into Workload Discovery on AWS/i
            );

            const regionsTableWrapper = await getRegionsTable();

            await waitFor(() => {
                expect(regionsTableWrapper.findRows()).toHaveLength(5);
            });

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

            await waitFor(() => {
                regionsTableWrapper.findRows().forEach(function (row, index) {
                    verifyRegionBodyCell(regions[index], row);
                });
            });
        }, 10000);

        it('should display info status indicator when regions are missing config in AWS Organizations mode', async () => {
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
                                iconAriaLabel:
                                    'Config enablement status success',
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
            server.use(
                graphql.query('GetAccounts', () => {
                    return HttpResponse.json({
                        data: {
                            getAccounts: Object.values(accountsDb).map(
                                account => {
                                    return {
                                        ...account,
                                        regions: account.regions.map(
                                            R.omit(['configStatus'])
                                        ),
                                    };
                                }
                            ),
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

            window.perspectiveMetadata =
                createOrganizationsPerspectiveMetadata();

            const user = userEvent.setup();

            renderPolarisLayout();

            const group = screen.getByRole('group', {
                name: /configure/i,
                hidden: true,
            });

            const accountsLink = within(group).getByRole('link', {
                name: /accounts/i,
                hidden: true,
            });

            await user.click(accountsLink);

            await screen.findByText('yyyyyyyyyyyy');

            const accountsTable = await screen.findByRole('table', {
                name: /accounts$/i,
            });

            const accountsTableWrapper = new TableWrapper(
                accountsTable.parentElement
            );

            const tableRows = accountsTableWrapper.findRows();

            expect(tableRows).toHaveLength(1);

            // We pass index + 1 as the rowNumber because findBodyCell starts at index 1.
            tableRows.forEach(function (row, index) {
                verifyBodyCell(Object.values(accountsDb)[index], row);
            });

            const {checkbox: accountYCheckmark} = findRowByColumnValue(
                'Account Id',
                'yyyyyyyyyyyy',
                accountsTableWrapper
            );

            await user.click(accountYCheckmark);

            await screen.findByText(
                /AWS Regions that have been imported into Workload Discovery on AWS/i
            );

            const regionsTableWrapper = await getRegionsTable();

            const regionTableRows = regionsTableWrapper.findRows();

            expect(regionTableRows).toHaveLength(2);

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

            regionTableRows.forEach(function (row, index) {
                verifyRegionBodyCell(regions[index], row);
            });
        }, 10000);

        it('should not have import button in Organizations mode', async () => {
            window.perspectiveMetadata =
                createOrganizationsPerspectiveMetadata();

            const user = userEvent.setup();

            renderPolarisLayout();

            const group = screen.getByRole('group', {
                name: /configure/i,
                hidden: true,
            });

            const accountsLink = within(group).getByRole('link', {
                name: /accounts/i,
                hidden: true,
            });

            await user.click(accountsLink);

            const importButton = screen.queryByRole('button', {name: /Import/});
            expect(importButton).toBeNull();
        });

        it('should import an account with one region', async () => {
            const accounts = [];

            server.use(
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

            const user = userEvent.setup();

            window.scrollTo = vi.fn();

            renderPolarisLayout();

            const group = screen.getByRole('group', {
                name: /configure/i,
                hidden: true,
            });

            const accountsLink = within(group).getByRole('link', {
                name: /accounts/i,
                hidden: true,
            });

            await user.click(accountsLink);

            await user.click(screen.getByRole('button', {name: /Import/}));

            screen.getByRole('heading', {level: 2, name: /Import Method/});

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
            await user.click(regionButton);

            const euWest1Option = screen.getByRole('option', {
                name: /europe \(ireland\)/i,
            });
            await user.click(euWest1Option);

            await user.click(screen.getByRole('button', {name: /add/i}));

            const importButton = within(screen.getByRole('main')).getByRole(
                'button',
                {
                    name: /import/i,
                }
            );

            await user.click(importButton);

            const dialog = screen.getByRole('dialog', {
                name: /import accounts and regions/i,
            });

            const globalCheckBox = screen.getByRole('checkbox', {
                name: /the global resources template is deployed in each of the accounts being imported/i,
            });

            await user.click(globalCheckBox);

            const regionalCheckBox = screen.getByRole('checkbox', {
                name: /the regional resources template is deployed in every region being imported for each of the listed accounts/i,
            });

            await user.click(regionalCheckBox);

            await user.click(
                within(dialog).getByRole('button', {name: /import/i})
            );

            await screen.findByRole('heading', {
                level: 2,
                name: /Accounts$/,
            });

            const accountsTable = await screen.findByRole('table', {
                name: /accounts$/i,
            });

            const table = new TableWrapper(accountsTable.parentElement);

            const tableRows = table.findRows();

            expect(tableRows).toHaveLength(1);

            await waitFor(() =>
                verifyBodyCell(
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
                )
            );
        }, 10000);

        it('should import an account with multiple regions', async () => {
            const accounts = [];

            server.use(
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

            const user = userEvent.setup();

            renderPolarisLayout();

            const group = screen.getByRole('group', {
                name: /configure/i,
                hidden: true,
            });

            const accountsLink = within(group).getByRole('link', {
                name: /accounts/i,
                hidden: true,
            });

            await user.click(accountsLink);

            await user.click(screen.getByRole('button', {name: /Import/}));

            screen.getByRole('heading', {level: 2, name: /Import Method/});

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
            await user.click(regionButton);

            const usEast1Option = screen.getByRole('option', {
                name: /us east \(n\. virginia\)/i,
            });
            await user.click(usEast1Option);

            const euWest1Option = screen.getByRole('option', {
                name: /europe \(ireland\)/i,
            });
            await user.click(euWest1Option);

            await user.click(screen.getByRole('button', {name: /add/i}));

            const importButton = within(screen.getByRole('main')).getByRole(
                'button',
                {
                    name: /import/i,
                }
            );

            await user.click(importButton);

            const dialog = screen.getByRole('dialog', {
                name: /import accounts and regions/i,
            });

            const globalCheckBox = screen.getByRole('checkbox', {
                name: /the global resources template is deployed in each of the accounts being imported/i,
            });

            await user.click(globalCheckBox);

            const regionalCheckBox = screen.getByRole('checkbox', {
                name: /the regional resources template is deployed in every region being imported for each of the listed accounts/i,
            });
            await user.click(regionalCheckBox);

            await user.click(
                within(dialog).getByRole('button', {name: /import/i})
            );

            await screen.findByRole('heading', {level: 2, name: /Accounts$/});

            const accountsTable = await screen.findByRole('table', {
                name: /accounts$/i,
            });

            const table = new TableWrapper(accountsTable.parentElement);

            const tableRows = table.findRows();

            expect(tableRows).toHaveLength(1);

            await waitFor(() =>
                verifyBodyCell(
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
                )
            );
        }, 10000);

        it('should not allow account with no regions to be created', async () => {
            server.use(
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

            const user = userEvent.setup();

            renderPolarisLayout();

            const group = screen.getByRole('group', {
                name: /configure/i,
                hidden: true,
            });

            const accountsLink = within(group).getByRole('link', {
                name: /accounts/i,
                hidden: true,
            });

            await user.click(accountsLink);

            await screen.findByText('xxxxxxxxxxxx');

            const accountsTable = await screen.findByRole('table', {
                name: /accounts$/i,
            });

            const accountsTableWrapper = new TableWrapper(
                accountsTable.parentElement
            );

            const accountCheckmarkCell = accountsTableWrapper
                .findBodyCell(1, 1)
                .getElement();

            const accountCheckmark =
                within(accountCheckmarkCell).getByRole('checkbox');

            await user.click(accountCheckmark);

            await screen.findByText('us-east-1');

            const regionsTableWrapper = await getRegionsTable();

            const regionsCheckmarkCell = regionsTableWrapper
                .findBodyCell(1, 1)
                .getElement();

            const regionsCheckmark =
                within(regionsCheckmarkCell).getByRole('checkbox');

            await user.click(regionsCheckmark);

            const removeButton = await screen.getAllByRole('button', {
                name: /remove/i,
            })[1];

            await user.click(removeButton);

            const deleteButton = await screen.getAllByRole('button', {
                name: /delete/i,
            })[1];

            await user.click(deleteButton);

            const errorNotification = await screen.findByText(
                /the following errors occurred:/i
            );

            await within(errorNotification).getByText(
                /Unable to delete region\(s\), an account must have at least one region./i
            );
        });

        it('should be able to delete a region', async () => {
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
                                iconAriaLabel:
                                    'Config enablement status success',
                            },
                        },
                        {
                            name: 'us-east-1',
                            isConfigEnabled: true,
                            configStatus: {
                                text: 'Enabled',
                                iconAriaLabel:
                                    'Config enablement status success',
                            },
                        },
                    ],
                    count: 100,
                },
            };

            server.use(
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

            renderPolarisLayout();

            const user = userEvent.setup();

            const group = screen.getByRole('group', {
                name: /configure/i,
                hidden: true,
            });

            const accountsLink = within(group).getByRole('link', {
                name: /accounts/i,
                hidden: true,
            });

            await user.click(accountsLink);

            await screen.findByText('xxxxxxxxxxxx');

            const accountsTable = await screen.findByRole('table', {
                name: /accounts$/i,
            });

            const accountsTableWrapper = new TableWrapper(
                accountsTable.parentElement
            );

            const tableRows = accountsTableWrapper.findRows();

            expect(tableRows).toHaveLength(1);

            const {checkbox: accountXCheckmark} = findRowByColumnValue(
                'Account Id',
                'xxxxxxxxxxxx',
                accountsTableWrapper
            );

            await user.click(accountXCheckmark);

            await screen.findByText(regionToRemove);

            const regionsTableWrapper = await getRegionsTable();

            expect(regionsTableWrapper.findRows()).toHaveLength(2);

            const {checkbox: usWest2Checkmark} = findRowByColumnValue(
                'Region',
                regionToRemove,
                regionsTableWrapper
            );

            await user.click(usWest2Checkmark);

            const removeButton = await screen.getAllByRole('button', {
                name: /remove/i,
            })[1];

            await user.click(removeButton);

            const deleteButton = await screen.getAllByRole('button', {
                name: /delete/i,
            })[1];

            await user.click(deleteButton);

            // Forcing another GetResourcesRegionMetadata call to update data
            await user.click(accountXCheckmark);

            await user.click(accountXCheckmark);

            await screen.findByText('us-east-1');

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

            regionsTableWrapper.findRows().forEach(function (row, index) {
                verifyRegionBodyCell(regions[index], row);
            });
        }, 10000);
    });
});
