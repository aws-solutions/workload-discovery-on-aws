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

import PropTypes from 'prop-types';

const pageSize = 10;
const AccountImportStackSetsTable = ({
  trackBy,
  rows,
  columns,
  sortColumn,
  onRemove,
  selectedItems,
  onSelectionChange,
  selectionType,
  loading,
  actions,
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
            actions ? (
              <SpaceBetween direction='horizontal' size='l'>
                <Button
                  disabled={isEmpty(selectedItems)}
                  loading={loading}
                  onClick={() => onRemove(selectedItems)}>
                  Remove
                </Button>                
              </SpaceBetween>
            ) : undefined
          }>
          Regions
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
      loadingText='Loading...'
      filter={
        <TextFilter {...filterProps} filteringPlaceholder='Find accounts' />
      }
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No Regions</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Regions to display.
          </Box>
        </Box>
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
};

AccountImportStackSetsTable.propTypes = {
  trackBy: PropTypes.string,
  rows: PropTypes.array,
  columns: PropTypes.array,
  sortColumn: PropTypes.string,
  onRemove: PropTypes.func,
  selectedItems: PropTypes.array,
  onSelectionChange: PropTypes.func,
  selectionType: PropTypes.string,
  loading: PropTypes.bool,
  actions: PropTypes.bool
};

export default AccountImportStackSetsTable;
