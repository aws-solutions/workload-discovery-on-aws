// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useState} from 'react';
import {
    Box,
    Button,
    TextFilter,
    Header,
    Pagination,
    Table,
    SpaceBetween,
    Modal,
    StatusIndicator,
    Alert,
    Select,
    Grid,
} from '@cloudscape-design/components';
import PropTypes from 'prop-types';
import {IMPORT} from '../../../routes';
import {useCollection} from '@cloudscape-design/collection-hooks';
import {useHistory} from 'react-router-dom';
import {useAccounts, useRemoveAccount} from '../../Hooks/useAccounts';
import {GLOBAL_TEMPLATE, useTemplate} from '../../Hooks/useTemplate';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as R from 'ramda';
import {useDeepCompareEffect} from 'react-use';
import {isUsingOrganizations} from '../../../Utils/AccountUtils';
import fileDownload from 'js-file-download';
import {GLOBAL_RESOURCES_TEMPLATE_FILENAME} from '../../../config/constants';
import {createTableAriaLabels} from '../../../Utils/AccessibilityUtils';
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const columns = [
    {
        id: 'account',
        header: 'Account Id',
        cell: e => e.accountId,
        sortingField: 'accountId',
        width: 200,
        minWidth: 200,
    },
    {
        id: 'accountName',
        header: 'Account name',
        cell: e => e.name,
        sortingField: 'accountName',
        width: 300,
        minWidth: 300,
    },
    {
        id: 'regions',
        header: 'Regions',
        cell: e => e.regionCount,
        width: 125,
        minWidth: 125,
    },
    {
        id: 'iamRoleStatus',
        header: 'Role Status',
        cell: e => {
            if (e.isIamRoleDeployed == null)
                return (
                    <StatusIndicator
                        type="info"
                        iconAriaLabel={`Role deployment status info`}
                    >
                        Unknown
                    </StatusIndicator>
                );
            return e.isIamRoleDeployed === false ? (
                <StatusIndicator
                    type="error"
                    iconAriaLabel={`Role deployment status error`}
                >
                    Not Deployed
                </StatusIndicator>
            ) : (
                <StatusIndicator
                    type="success"
                    iconAriaLabel={`Role deployment status success`}
                >
                    Deployed
                </StatusIndicator>
            );
        },
        width: 200,
        minWidth: 200,
    },
    {
        id: 'lastDiscovered',
        header: 'Last Discovered',
        cell: e => {
            if (e.isIamRoleDeployed === false && e.lastCrawled == null) {
                return (
                    <StatusIndicator type="error">
                        Not Discoverable
                    </StatusIndicator>
                );
            } else if (e.isIamRoleDeployed == null) {
                return (
                    <StatusIndicator type="info">
                        Awaiting Discovery
                    </StatusIndicator>
                );
            } else {
                return dayjs().to(dayjs(e.lastCrawled));
            }
        },
        width: 200,
        minWidth: 200,
    },
];

const defaultRoleStatus = {value: '0', label: 'Any Role Status'};

const selectRoleStatusOptions = [
    defaultRoleStatus,
    {value: '1', label: 'Unknown'},
    {value: '2', label: 'Deployed'},
    {value: '3', label: 'Not Deployed'},
];

function matchesRoleStatus(item, selectedRoleStatus) {
    switch (selectedRoleStatus.label) {
        case 'Unknown':
            return item.isIamRoleDeployed == null;
        case 'Deployed':
            return item.isIamRoleDeployed === true;
        case 'Not Deployed':
            return item.isIamRoleDeployed === false;
        default:
            return true;
    }
}

function DownloadButton({globalTemplate}) {
    return (
        <Button
            iconName="download"
            onClick={async () =>
                fileDownload(globalTemplate, GLOBAL_RESOURCES_TEMPLATE_FILENAME)
            }
        >
            Download global resources template
        </Button>
    );
}

function SelfManagedAccountsAlert({globalTemplate}) {
    return (
        <Alert
            type="warning"
            statusIconAriaLabel="Warning"
            action={DownloadButton({globalTemplate})}
            header="Undiscovered Accounts"
        >
            The global resources CloudFormation templates have not been deployed
            to one or more accounts. You must provision this template in these
            accounts to make them discoverable by Workload Discovery. You can
            filter the account list by selecting <b>Not Deployed</b> from the
            Role Status dropdown menu to determine which accounts must be
            updated. Choose <b>Download global resources template</b> and deploy
            the template in each of the affected accounts.
        </Alert>
    );
}

function OrganizationsManagedAccounts({globalTemplate, accounts}) {
    const managementAccount = accounts.find(
        x => x.isManagementAccount === true
    );
    const noIamDeployedAccounts = accounts.filter(
        x => x.isIamRoleDeployed === false && !x.isManagementAccount
    );

    return (
        <SpaceBetween size="xxs">
            {R.isEmpty(noIamDeployedAccounts) ? (
                void 0
            ) : (
                <Alert
                    type="warning"
                    statusIconAriaLabel="Warning"
                    header="Undiscovered Accounts"
                >
                    The global resources CloudFormation templates have not been
                    deployed to one or more accounts. These are provisioned by
                    the <b>WdGlobalResources</b> StackSet in the account and
                    region that Workload Discovery has been deployed to. Verify
                    that all the stack instances in the <b>WdGlobalResources</b>{' '}
                    StackSet have deployed successfully.
                </Alert>
            )}
            {managementAccount == null ||
            managementAccount.isIamRoleDeployed === true ? (
                void 0
            ) : (
                <Alert
                    type="warning"
                    statusIconAriaLabel="Warning"
                    action={DownloadButton({globalTemplate})}
                    header="Management Account Undiscovered"
                >
                    The global resources CloudFormation template has not been
                    deployed to the AWS Organizations management account. You
                    must provision this template to make this account
                    discoverable by Workload Discovery. Choose{' '}
                    <b>Download global resources template</b> and deploy the
                    template to the management account.
                </Alert>
            )}
        </SpaceBetween>
    );
}

function AccountAlert({globalTemplate, accounts}) {
    return isUsingOrganizations() ? (
        <OrganizationsManagedAccounts
            globalTemplate={globalTemplate}
            accounts={accounts}
        />
    ) : (
        <SelfManagedAccountsAlert globalTemplate={globalTemplate} />
    );
}

const DiscoverableAccountsTable = ({selectedAccounts, onSelect}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roleStatus, setRoleStatus] = useState(defaultRoleStatus);
    const {data = [], isLoading} = useAccounts();
    const {data: globalTemplate} = useTemplate(GLOBAL_TEMPLATE);
    const {removeAsync} = useRemoveAccount();
    const history = useHistory();

    useDeepCompareEffect(() => {
        onSelect(
            selectedAccounts.filter(i =>
                data.find(j => i.accountId === j.accountId)
            )
        );
    }, [data, onSelect, selectedAccounts]);

    const accounts = R.map(
        ({accountId, name, regions, ...props}) => ({
            id: accountId + name,
            accountId,
            name,
            regionCount: R.length(regions),
            regions,
            ...props,
        }),
        data
    );

    const noIamDeployedAccounts = accounts.filter(
        x => x.isIamRoleDeployed === false
    );

    const onSelectionChange = items => {
        onSelect(items);
    };

    const {items, filterProps, collectionProps, paginationProps} =
        useCollection(accounts, {
            filtering: {
                empty: (
                    <Box textAlign="center" color="inherit">
                        <b>No Accounts</b>
                        <Box
                            padding={{bottom: 's'}}
                            variant="p"
                            color="inherit"
                        >
                            No Account matched filter
                        </Box>
                    </Box>
                ),
                noMatch: (
                    <Box textAlign="center" color="inherit">
                        <b>No Account</b>
                        <Box
                            padding={{bottom: 's'}}
                            variant="p"
                            color="inherit"
                        >
                            No Account matched filter
                        </Box>
                    </Box>
                ),
                filteringFunction: (item, filteringText) => {
                    return (
                        (item.accountId.includes(filteringText) ||
                            item.name.includes(filteringText)) &&
                        matchesRoleStatus(item, roleStatus)
                    );
                },
            },
            pagination: {pageSize: 10},
            sorting: {sortingColumn: 'accountId'},
        });

    const handleDelete = () => {
        return removeAsync(selectedAccounts.map(i => i.accountId)).then(() =>
            setShowDeleteConfirm(false)
        );
    };

    return (
        <>
            <Modal
                onDismiss={() => setShowDeleteConfirm(false)}
                visible={showDeleteConfirm}
                closeAriaLabel="Close modal"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button
                                onClick={() => setShowDeleteConfirm(false)}
                                variant="link"
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} variant="primary">
                                Delete
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
                header="Remove Account"
            >
                Remove the AWS account{' '}
                <strong>
                    {selectedAccounts
                        .map(i => R.defaultTo(i.accountId, i.accountName))
                        .join(', ')}
                </strong>
                ?
            </Modal>
            <SpaceBetween size="s">
                {R.isEmpty(noIamDeployedAccounts) ? (
                    void 0
                ) : (
                    <AccountAlert
                        globalTemplate={globalTemplate}
                        accounts={accounts}
                    />
                )}
                <Table
                    ariaLabels={createTableAriaLabels(
                        'account',
                        'accounts',
                        {
                            keys: ['accountId'],
                            fallback: 'Unknown account',
                        },
                        'Accounts'
                    )}
                    {...collectionProps}
                    header={
                        <Header
                            actions={
                                isUsingOrganizations() ? (
                                    void 0
                                ) : (
                                    <SpaceBetween
                                        direction="horizontal"
                                        size="xs"
                                    >
                                        <Button
                                            disabled={R.isEmpty(
                                                selectedAccounts
                                            )}
                                            onClick={() =>
                                                setShowDeleteConfirm(true)
                                            }
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            loadingText="Removing"
                                            variant="primary"
                                            onClick={e => {
                                                e.preventDefault();
                                                history.push(IMPORT);
                                            }}
                                        >
                                            Import
                                        </Button>
                                    </SpaceBetween>
                                )
                            }
                            variant="h2"
                            description="AWS accounts that contain Regions imported into Workload Discovery on AWS"
                        >
                            Accounts
                        </Header>
                    }
                    loading={isLoading}
                    trackBy={'id'}
                    resizableColumns
                    columnDefinitions={columns}
                    items={items}
                    selectedItems={selectedAccounts}
                    selectionType="multi"
                    onSelectionChange={evt =>
                        onSelectionChange(evt.detail.selectedItems)
                    }
                    loadingText="Loading accounts"
                    filter={
                        <Grid
                            gridDefinition={[
                                {colspan: {default: 3, xxs: 9}},
                                {colspan: {default: 9, xxs: 3}},
                            ]}
                        >
                            <TextFilter
                                {...filterProps}
                                filteringPlaceholder="Find an Account..."
                            />
                            <Select
                                options={selectRoleStatusOptions}
                                selectedAriaLabel="Selected"
                                selectedOption={roleStatus}
                                onChange={event =>
                                    setRoleStatus(event.detail.selectedOption)
                                }
                                ariaDescribedby={null}
                                expandToViewport={true}
                            />
                        </Grid>
                    }
                    pagination={<Pagination {...paginationProps} />}
                />
            </SpaceBetween>
        </>
    );
};

DiscoverableAccountsTable.propTypes = {
    onSelect: PropTypes.func.isRequired,
};

export default DiscoverableAccountsTable;
