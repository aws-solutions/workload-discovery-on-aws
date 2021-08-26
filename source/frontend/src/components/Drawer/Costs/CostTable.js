import React, { useState, useEffect } from 'react';
import Table from '@awsui/components-react/table';
import Box from '@awsui/components-react/box';
import TextFilter from '@awsui/components-react/text-filter';
import Header from '@awsui/components-react/header';
import Pagination from '@awsui/components-react/pagination';
import Container from '@awsui/components-react/container';
import { useCollection } from '@awsui/collection-hooks';

// 

export default ({
  trackBy,
  header,
  rows,
  columns,
  sortColumn,
  resultCount,
  pageSize,
  pageChanged,
  textFilter,
  selectedItems,
  onSelectionChange,
  selectionType
}) => {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);  
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

  const handlePageChange = (detail) => {
    let page = detail.currentPageIndex;
    page--;
    pageChanged({
      start: pageSize * page,
      end: pageSize * page + pageSize,
    });
    setCurrentPageIndex(detail.currentPageIndex);
  };

  return (
    <Table
      {...collectionProps}
      // header={<Header variant='h2'>{header}</Header>}
      trackBy={trackBy}
      resizableColumns
      stickyHeader
      // sortingColumn={sortColumn}
      columnDefinitions={columns}
      items={items}
      selectedItems={selectedItems}
      selectionType={selectionType}
      onSelectionChange={evt => onSelectionChange(evt.detail.selectedItems)}
      loadingText='Loading resources'
      filter={
        textFilter ? <TextFilter {...filterProps} filteringPlaceholder="Find resources" /> : undefined
      }
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No resources</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No resources to display.
          </Box>
        </Box>
      }
      pagination={
        <Pagination
          {...paginationProps}
          ariaLabels={{
            nextPageLabel: 'Next page',
            previousPageLabel: 'Previous page',
            pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
          }}
          currentPageIndex={pageChanged ? currentPageIndex : undefined}
          onChange={pageChanged ? ({ detail }) => handlePageChange(detail) : undefined}
          pagesCount={Math.floor(resultCount / pageSize)}
        />
      }
    />
  );
};
