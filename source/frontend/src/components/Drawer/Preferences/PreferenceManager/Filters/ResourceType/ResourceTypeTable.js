import React, { useState, useEffect } from 'react';
import Table from '@awsui/components-react/table';
import Box from '@awsui/components-react/box';
import TextFilter from '@awsui/components-react/text-filter';
import Header from '@awsui/components-react/header';
import Pagination from '@awsui/components-react/pagination';
import {SpaceBetween, Button} from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';

const R = require('ramda')

export default ({
  trackBy,
  header,
  rows,
  columns,
  sortColumn,
  pageSize,
  selectedItems,
  onSelectionChange,
  selectionType,
  setExcluded,
  setTypes,
  submitFilters,
  types
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
          <b>No resources</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No resources to display.
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No match</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No resources matched.
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
          variant='h2'
          actions={
            <SpaceBetween direction='horizontal' size='l'>
              <Button
                variant='normal'
                onClick={() => setTypes(R.map(setExcluded(false), types))}>
                Include all
              </Button>
              <Button
                variant='normal'
                onClick={() => setTypes(R.map(setExcluded(true), types))}>
                Exclude all
              </Button>
              <Button variant='primary' onClick={submitFilters}>
                Update
              </Button>
            </SpaceBetween>
          }>
          Resource Types
        </Header>
      }
      trackBy={trackBy}
      resizableColumns
      stickyHeader
      columnDefinitions={columns}
      items={items}
      selectedItems={selectedItems}
      selectionType={selectionType}
      onSelectionChange={(evt) => onSelectionChange(evt.detail.selectedItems)}
      loadingText='Loading resource types'
      loading={R.isEmpty(items)}
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder='Find resource type'
        />
      }
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No resources</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No resources to display.
          </Box>
        </Box>
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
};
