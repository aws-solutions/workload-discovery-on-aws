// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react';
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
    Select,
    Grid,
    Popover,
} from '@cloudscape-design/components';
import PropTypes from 'prop-types';
import {IMPORT} from '../../../routes';
import {useCollection} from '@cloudscape-design/collection-hooks';
import {useHistory} from 'react-router-dom';
import {useRemoveAccount} from '../../Hooks/useAccounts';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as R from 'ramda';
import {useDeepCompareEffect} from 'react-use';
import {isUsingOrganizations} from '../../../Utils/AccountUtils';
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
                    <Popover
                        dismissButton={false}
                        size="small"
                        content={
                            'The deployment status of the role will be updated on the next successful run of the discovery process.'
                        }
                    >
                        <StatusIndicator
                            type="info"
                            iconAriaLabel={`Role deployment status info`}
                        >
                            Unknown
                        </StatusIndicator>
                    </Popover>
                );
            return e.isIamRoleDeployed === false ? (
                <Popover
                    dismissButton={false}
                    size="small"
                    content={
                        'The Workload Discovery IAM role has not been deployed to this account.'
                    }
                >
                    <StatusIndicator
                        type="error"
                        iconAriaLabel={`Role deployment status error`}
                    >
                        Not Deployed
                    </StatusIndicator>
                </Popover>
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
        id: 'configStatus',
        header: 'AWS Config Status',
        cell: e => {
            const numDisabledRegions =
                e.regions.length -
                e.regions.filter(r => r.isConfigEnabled).length;
            if (numDisabledRegions === 0) {
                return (
                    <StatusIndicator
                        type="success"
                        iconAriaLabel={`Config enabled status success`}
                    >
                        All regions enabled
                    </StatusIndicator>
                );
            } else {
                // This is always an error when in self-managed mode as it means user has not
                // deployed the regional-resources template. In AWS Organisation mode, not every
                // region in all accounts in the organisation will necessarily have Config enabled
                const type = isUsingOrganizations() ? 'info' : 'error';

                return (
                    <Popover
                        dismissButton={false}
                        size="small"
                        content={
                            'Select the checkbox for this account to see which regions do not have AWS Config enabled'
                        }
                    >
                        <StatusIndicator
                            type={type}
                            iconAriaLabel={`Config enabled status ${type}`}
                        >
                            {`${numDisabledRegions} region${numDisabledRegions === 1 ? '' : 's'} not enabled`}
                        </StatusIndicator>
                    </Popover>
                );
            }
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

const DiscoverableAccountsTable = ({
    accounts,
    isLoadingAccounts,
    selectedAccounts,
    onSelect,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roleStatus, setRoleStatus] = useState(defaultRoleStatus);
    const {removeAsync} = useRemoveAccount();
    const history = useHistory();

    useDeepCompareEffect(() => {
        onSelect(
            selectedAccounts.filter(i =>
                accounts.find(j => i.accountId === j.accountId)
            )
        );
    }, [accounts, onSelect, selectedAccounts]);

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
                    loading={isLoadingAccounts}
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
