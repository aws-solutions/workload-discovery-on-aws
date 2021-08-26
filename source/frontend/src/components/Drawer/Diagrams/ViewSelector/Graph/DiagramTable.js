import React, { useState, useEffect } from 'react';
import Table from '@awsui/components-react/table';
import Box from '@awsui/components-react/box';
import TextFilter from '@awsui/components-react/text-filter';
import Header from '@awsui/components-react/header';
import Pagination from '@awsui/components-react/pagination';
import SpaceBetween from '@awsui/components-react/space-between';
import Button from '@awsui/components-react/button';
import { useCollection } from '@awsui/collection-hooks';

const R = require('ramda');

export default ({
  trackBy,
  header,
  rows,
  columns,
  sortColumn,
  pageSize,
  selectedItems,
  onSelectionChange,
  handleDelete,
  handleOpen,
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
          <b>No Architecture diagrams</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Architecture diagrams to display.
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No match</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Architecture diagrams matched.
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
      header={
        <Header
          actions={
            <SpaceBetween direction='horizontal' size='xs'>
              <Button
                disabled={selectedItems.length === 0}
                onClick={handleDelete}
                variant='link'>
                Delete
              </Button>
              <Button
                onClick={handleOpen}
                disabled={R.isEmpty(selectedItems)}
                variant='primary'>
                Open
              </Button>
            </SpaceBetween>
          }
          variant='h2'>
          {header}
        </Header>
      }
      trackBy={trackBy}
      resizableColumns
      stickyHeader
      columnDefinitions={columns}
      items={items}
      selectedItems={selectedItems}
      selectionType='single'
      onSelectionChange={(evt) => onSelectionChange(evt.detail.selectedItems)}
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder='Find an architecture diagram'
        />
      }
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No Architecture diagrams</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Architecture diagrams to display.
          </Box>
        </Box>
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
};
