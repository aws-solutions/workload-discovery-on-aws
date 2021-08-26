import React, { useState, useEffect } from 'react';
import Table from '@awsui/components-react/table';
import Box from '@awsui/components-react/box';
import TextFilter from '@awsui/components-react/text-filter';
import Header from '@awsui/components-react/header';
import Pagination from '@awsui/components-react/pagination';
import Button from '@awsui/components-react/button';
import SpaceBetween from '@awsui/components-react/space-between';
import { useCollection } from '@awsui/collection-hooks';
import { isEmpty } from 'ramda';


export default ({
  trackBy,
  rows,
  columns,
  sortColumn,
  pageSize
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
