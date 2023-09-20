// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import { useCollection } from '@cloudscape-design/collection-hooks';

export const ResourceDetailsTagTable = ({
  trackBy,
  rows,
  columns,
  sortColumn,
  pageSize,
  visibleColumns,
}) => {
  const {
    items,
    filterProps,
    collectionProps,
    paginationProps,
  } = useCollection(rows, {
    filtering: {
      empty: (
        <Box textAlign='center' color='inherit'>
          <b>No tags</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No tags to display.
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No match</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No tags matched.
          </Box>
        </Box>
      ),
    },
    pagination: { pageSize: pageSize },
    sorting: { sortingColumn: sortColumn },
  });

  return (
    <Table
      {...collectionProps}
      trackBy={trackBy}
      resizableColumns
      stickyHeader
      columnDefinitions={columns}
      items={items}
      loadingText='Loading...'
      visibleColumns={visibleColumns}
      filter={
        <TextFilter {...filterProps} filteringPlaceholder='Find tags' />
      }
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No tags</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No tags to display.
          </Box>
        </Box>
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
};

export default ResourceDetailsTagTable;
