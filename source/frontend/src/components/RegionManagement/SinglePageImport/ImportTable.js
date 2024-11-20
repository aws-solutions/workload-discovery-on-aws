// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    Box,
    TextFilter,
    Header,
    Pagination,
    Button,
    SpaceBetween,
    Table,
} from '@cloudscape-design/components';

import {useCollection} from '@cloudscape-design/collection-hooks';
import {isEmpty} from 'ramda';

import PropTypes from 'prop-types';
import {regionMap} from '../../../Utils/Dictionaries/RegionMap';
import {useAccounts} from '../../Hooks/useAccounts';
import * as R from 'ramda';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function createData(id, region, accountId, accountName) {
    return {
        id,
        regionName: R.head(
            regionMap.filter(e => e.id === region).map(e => e.name)
        ),
        region,
        accountId,
        accountName,
    };
}

const ImportTable = ({regions, setRegions}) => {
    const [selectedRegions, setSelectedRegions] = React.useState([]);
    const {data: accounts = [], isLoading} = useAccounts();
    const discoverableRegions = R.reduce(
        (acc, e) =>
            R.concat(
                acc,
                R.chain(region => {
                    return {
                        accountId: e.accountId,
                        accountName: e.name,
                        region: region.name,
                    };
                }, e.regions)
            ),
        [],
        accounts
    );

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
            cell: e => e.accountName,
            sortingField: 'accountName',
            width: 300,
            minWidth: 300,
        },
        {
            id: 'region',
            header: 'Region',
            cell: e => e.region,
            width: 200,
            minWidth: 200,
        },
        {
            id: 'regionName',
            header: 'Region name',
            cell: e => e.regionName,
            width: 200,
            minWidth: 200,
        },
    ];

    const onRemove = () => {
        setRegions(
            R.without(
                R.map(
                    e => R.pick(['accountId', 'accountName', 'region'], e),
                    selectedRegions
                ),
                regions
            )
        );
        setSelectedRegions([]);
    };

    const getData = () =>
        R.map(
            e =>
                createData(
                    `${e.accountId}` + `${e.accountName}` + `${e.region}`,
                    e.region,
                    e.accountId,
                    e.accountName
                ),
            R.filter(e => !R.includes(e, discoverableRegions), regions)
        );

    const {items, filterProps, collectionProps, paginationProps} =
        useCollection(getData(), {
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
            },
            pagination: {pageSize: 10},
            sorting: {sortingColumn: 'accountId'},
        });

    return (
        <Table
            {...collectionProps}
            header={
                <Header
                    variant="h2"
                    actions={
                        <SpaceBetween direction="horizontal" size="l">
                            <Button
                                loadingText="Removing"
                                variant="primary"
                                disabled={isEmpty(selectedRegions)}
                                onClick={() => onRemove()}
                            >
                                Remove
                            </Button>
                        </SpaceBetween>
                    }
                >
                    Regions
                </Header>
            }
            visibleColumns={['account', 'accountName', 'regionName', 'deploy']}
            trackBy={'id'}
            loading={isLoading}
            resizableColumns
            columnDefinitions={columns}
            items={items}
            selectedItems={selectedRegions}
            selectionType="multi"
            onSelectionChange={evt =>
                setSelectedRegions(evt.detail.selectedItems)
            }
            loadingText="Loading Regions"
            filter={
                <TextFilter
                    {...filterProps}
                    filteringPlaceholder="Explore Regions"
                />
            }
            pagination={<Pagination {...paginationProps} />}
        />
    );
};

ImportTable.propTypes = {
    regions: PropTypes.array.isRequired,
    setRegions: PropTypes.func.isRequired,
};
export default ImportTable;
