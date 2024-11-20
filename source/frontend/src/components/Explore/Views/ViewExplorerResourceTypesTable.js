// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    Box,
    TextFilter,
    Header,
    SpaceBetween,
    Table,
    Pagination,
} from '@cloudscape-design/components';
import {useCollection} from '@cloudscape-design/collection-hooks';
import {fetchImage} from '../../../Utils/ImageSelector';

import * as R from 'ramda';

function imageCell(item) {
    return <img src={fetchImage(item.type)} style={{width: '25px'}} />;
}

const ViewExplorerResourceTypesTable = ({selectedView}) => {
    const {items, filterProps, collectionProps, paginationProps} =
        useCollection(R.pathOr([], ['resourceTypes'], selectedView), {
            filtering: {
                empty: (
                    <Box textAlign="center" color="inherit">
                        <b>No resource types</b>
                        <Box
                            padding={{bottom: 's'}}
                            variant="p"
                            color="inherit"
                        >
                            No resource types to display
                        </Box>
                    </Box>
                ),
                noMatch: (
                    <Box textAlign="center" color="inherit">
                        <b>No match</b>
                        <Box
                            padding={{bottom: 's'}}
                            variant="p"
                            color="inherit"
                        >
                            No resource types matched.
                        </Box>
                    </Box>
                ),
            },
            pagination: {pageSize: 5},
            sorting: {},
            selection: {keepSelection: true, trackBy: i => i.id},
        });

    return (
        <SpaceBetween size="l" direction="vertical">
            <Table
                {...collectionProps}
                trackBy="type"
                ariaLabels={{
                    tableLabel: 'Resources types',
                }}
                columnDefinitions={[
                    {
                        id: 'icon',
                        cell: e => imageCell(e),
                    },
                    {
                        id: 'type',
                        header: 'Type',
                        cell: e => e.type,
                    },
                ]}
                items={items}
                loadingText="Loading Resource types"
                visibleColumns={['icon', 'type']}
                filter={
                    <TextFilter
                        {...filterProps}
                        filteringPlaceholder="Find a resource type"
                    />
                }
                pagination={<Pagination {...paginationProps} />}
                header={<Header>Resource types</Header>}
            />
        </SpaceBetween>
    );
};

export default ViewExplorerResourceTypesTable;
