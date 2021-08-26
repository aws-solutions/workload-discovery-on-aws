import React, { useState, useEffect } from 'react';
import Table from '@awsui/components-react/table';
import Box from '@awsui/components-react/box';
import TextFilter from '@awsui/components-react/text-filter';
import Header from '@awsui/components-react/header';
import Pagination from '@awsui/components-react/pagination';
import Container from '@awsui/components-react/container';
import { useCollection } from '@awsui/collection-hooks';



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
          <b>No Regions</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Regions to display. Select an AWS Account from the table above.
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No match</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Regions matched.
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
      header={<Header variant='h2'>{header}</Header>}
      trackBy={trackBy}      
      resizableColumns
      stickyHeader
      columnDefinitions={columns}
      items={items}
      selectedItems={selectedItems}
      selectionType={selectionType}
      onSelectionChange={(evt) => onSelectionChange(evt.detail.selectedItems)}
      loadingText='Loading resources'
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder='Find a Region'
        />
      }
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No Regions</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Regions to display. Select an AWS Account from the table above.
          </Box>
        </Box>
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
};
