// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react';
import * as R from 'ramda';
import dayjs from 'dayjs';
import {hashProperty} from '../../../Utils/ObjectUtils';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    Table,
    Box,
    TextFilter,
    Header,
    Pagination,
    Button,
    SpaceBetween,
    StatusIndicator,
    Modal,
    Popover,
    Grid,
    Select,
} from '@cloudscape-design/components';
import {useCollection} from '@cloudscape-design/collection-hooks';
import {isEmpty} from 'ramda';
import PropTypes from 'prop-types';
import {useRemoveAccountRegion} from '../../Hooks/useAccounts';
import {useResourcesRegionMetadata} from '../../Hooks/useResourcesMetadata';
import {isUsingOrganizations} from '../../../Utils/AccountUtils';
import {createTableAriaLabels} from '../../../Utils/AccessibilityUtils';
import useQueryErrorHandler from '../../Hooks/useQueryErrorHandler';

dayjs.extend(relativeTime);

const columns = [
    {
        id: 'id',
        cell: e => `${e.accountId}-${e.name}`,
    },
    {
        id: 'region',
        header: 'Region',
        cell: e => e.name,
        width: 200,
        minWidth: 200,
    },
    {
        id: 'account',
        header: 'Account Id',
        cell: e => e.accountId,
        width: 200,
        minWidth: 200,
    },
    {
        id: 'count',
        header: 'Resources',
        cell: e =>
            e.count ? (
                e.count
            ) : (
                <StatusIndicator
                    type="warning"
                    iconAriaLabel={`Resource count warning`}
                >
                    Not discovered
                </StatusIndicator>
            ),
        width: 150,
        minWidth: 150,
    },
    {
        id: 'configStatus',
        header: 'AWS Config Status',
        cell: e => {
            if (e.isConfigEnabled == null) {
                return (
                    <Popover
                        dismissButton={false}
                        size="small"
                        content={
                            'The enablement status of AWS Config will be updated on the next successful run of the discovery process.'
                        }
                    >
                        <StatusIndicator
                            type="info"
                            iconAriaLabel={`Config enablement status info`}
                        >
                            Unknown
                        </StatusIndicator>
                    </Popover>
                );
            } else if (e.isConfigEnabled === true) {
                return (
                    <StatusIndicator
                        type="success"
                        iconAriaLabel={`Config enablement status success`}
                    >
                        Enabled
                    </StatusIndicator>
                );
            } else {
                // This is always an error when in self managed mode as it means user has not
                // deployed the regional-resources template. In AWS Organisation mode, not every
                // region in all accounts in the organisation will necessarily have Config enabled
                const type = isUsingOrganizations() ? 'info' : 'error';
                return (
                    <StatusIndicator
                        type={type}
                        iconAriaLabel={`Config enablement status ${type}`}
                    >
                        Not Enabled
                    </StatusIndicator>
                );
            }
        },
        width: 200,
        minWidth: 200,
    },
];

const defaultConfigStatus = {value: '0', label: 'Any Role Status'};

const selectConfigStatusOptions = [
    defaultConfigStatus,
    {value: '1', label: 'Unknown'},
    {value: '2', label: 'Enabled'},
    {value: '3', label: 'Not Enabled'},
];

function matchesConfigStatus(item, selectedRoleStatus) {
    switch (selectedRoleStatus.label) {
        case 'Unknown':
            return item.isConfigEnabled == null;
        case 'Enabled':
            return item.isConfigEnabled === true;
        case 'Not Enabled':
            return item.isConfigEnabled === false;
        default:
            return true;
    }
}

const DiscoverableRegionsTable = ({
    accounts,
    isLoadingAccounts,
    selectedAccounts,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [selectedRegions, setSelectedRegions] = React.useState([]);
    const [configStatus, setConfigStatus] = useState(defaultConfigStatus);
    const {removeAsync} = useRemoveAccountRegion();
    const {handleError} = useQueryErrorHandler();
    const {data: resourcesRegionMetadata = [], isLoading: isLoadingRegions} =
        useResourcesRegionMetadata(
            R.chain(e => {
                return {
                    accountId: e.accountId,
                    regions: R.map(r => {
                        return {name: r.name};
                    }, e.regions),
                };
            }, selectedAccounts)
        );
    const [regions, setRegions] = React.useState([]);

    useEffect(() => {
        if (accounts == null || isLoadingAccounts || isLoadingRegions) return;

        const countLookUp = resourcesRegionMetadata.reduce(
            (accum, {accountId, regions}) => {
                regions.forEach(region => {
                    accum[`${accountId}-${region.name}`] = region.count;
                });
                return accum;
            },
            {}
        );

        const regionsWithCount = accounts
            .filter(account => {
                return (
                    selectedAccounts.find(
                        x => x.accountId === account.accountId
                    ) != null
                );
            })
            .flatMap(({accountId, regions}) => {
                return regions.map(region => {
                    const id = `${accountId}-${region.name}`;

                    return {
                        ...region,
                        accountId,
                        id,
                        count: countLookUp[id],
                    };
                });
            });

        setRegions(regionsWithCount);
    }, [accounts, resourcesRegionMetadata, selectedAccounts, isLoadingRegions]);

    const {items, filterProps, collectionProps, paginationProps} =
        useCollection(regions, {
            filtering: {
                empty: (
                    <Box textAlign="center" color="inherit">
                        <b>No Regions</b>
                        <Box
                            padding={{bottom: 's'}}
                            variant="p"
                            color="inherit"
                        >
                            No Region matched filter
                        </Box>
                    </Box>
                ),
                noMatch: (
                    <Box textAlign="center" color="inherit">
                        <b>No Region</b>
                        <Box
                            padding={{bottom: 's'}}
                            variant="p"
                            color="inherit"
                        >
                            No Region matched filter
                        </Box>
                    </Box>
                ),
                filteringFunction: (item, filteringText) => {
                    return (
                        (item.accountId.includes(filteringText) ||
                            item.name.includes(filteringText)) &&
                        matchesConfigStatus(item, configStatus)
                    );
                },
            },
            pagination: {pageSize: 10},
            sorting: {},
        });

    const handleDelete = () => {
        // removeAsync automatically triggers a refetch of accounts data
        // through React Query's cache invalidation. Without this, the
        // region table will be stale and still show the deleted regions.
        removeAsync({
            accountId: R.head(selectedAccounts).accountId,
            regions: R.map(e => {
                return {name: e.name};
            }, selectedRegions),
        })
            .catch(handleError)
            .then(() => setShowDeleteConfirm(false))
            .then(() => setSelectedRegions([]));
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
                header="Remove Region"
            >
                <Box>
                    Remove the following regions for{' '}
                    <strong>
                        {selectedAccounts.map(i => i.accountId).join(', ')}
                    </strong>
                    ?
                </Box>
                <ul>
                    {selectedRegions.map(i => (
                        <li key={hashProperty(i.name)}>
                            <strong>{i.name}</strong>
                        </li>
                    ))}
                </ul>
            </Modal>
            <Table
                ariaLabels={createTableAriaLabels(
                    'region',
                    'regions',
                    {
                        keys: ['region'],
                        fallback: 'Unknown region',
                    },
                    'Regions'
                )}
                {...collectionProps}
                header={
                    <Header
                        variant="h2"
                        description="AWS Regions that have been imported into Workload Discovery on AWS."
                        actions={
                            isUsingOrganizations() ? (
                                void 0
                            ) : (
                                <SpaceBetween direction="horizontal" size="l">
                                    <Button
                                        loadingText="Removing"
                                        variant="primary"
                                        disabled={isEmpty(selectedRegions)}
                                        onClick={() =>
                                            setShowDeleteConfirm(true)
                                        }
                                    >
                                        Remove
                                    </Button>
                                </SpaceBetween>
                            )
                        }
                    >
                        Regions
                    </Header>
                }
                trackBy={'id'}
                loading={isLoadingAccounts || isLoadingRegions}
                resizableColumns
                columnDefinitions={columns}
                visibleColumns={[
                    'region',
                    'name',
                    'account',
                    'count',
                    'configStatus',
                    'types',
                ]}
                items={items}
                selectedItems={selectedRegions}
                selectionType="multi"
                onSelectionChange={evt =>
                    setSelectedRegions(evt.detail.selectedItems)
                }
                isItemDisabled={isUsingOrganizations}
                loadingText="Loading Regions"
                filter={
                    <Grid
                        gridDefinition={[
                            {colspan: {default: 3, xxs: 9}},
                            {colspan: {default: 9, xxs: 3}},
                        ]}
                    >
                        <TextFilter
                            {...filterProps}
                            filteringPlaceholder="Find a Region..."
                        />
                        <Select
                            options={selectConfigStatusOptions}
                            selectedAriaLabel="Selected"
                            selectedOption={configStatus}
                            onChange={event => {
                                setConfigStatus(event.detail.selectedOption);
                            }}
                            ariaDescribedby={null}
                            expandToViewport={true}
                        />
                    </Grid>
                }
                pagination={<Pagination {...paginationProps} />}
            />
        </>
    );
};

DiscoverableRegionsTable.propTypes = {
    selectedAccounts: PropTypes.array.isRequired,
};
export default DiscoverableRegionsTable;
