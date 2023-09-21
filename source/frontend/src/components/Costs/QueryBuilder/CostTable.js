// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Table,
  Box,
  Header,
  Pagination,
  Button,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import getSymbolFromCurrency from 'currency-symbol-map';
import PropTypes from 'prop-types';

import * as R  from 'ramda';
import {createTableAriaLabels} from "../../../Utils/AccessibilityUtils";

const columns = [
  {
    id: 'resource',
    header: 'Resource',
    cell: (e) => {
        if (e.line_item_resource_id) {
            return e.line_item_resource_id
        }
        return e.product_servicename ? e.product_servicename : 'undefined'
    },
    width: 320,
    minWidth: 320,
  },
  {
    id: 'cost',
    header: 'Estimated cost',
    cell: (e) => `${getSymbolFromCurrency(e.line_item_currency_code)}${e.cost.toFixed(2)}`,
    sortingField: 'cost',
    width: 300,
    minWidth: 300,
  },
  {
    id: 'accountId',
    header: 'Account Id',
    cell: (e) => e.line_item_usage_account_id,
    width: 150,
    minWidth: 150,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.region,
    width: 150,
    minWidth: 150,
  },
];

const CostTable = ({
  addToGraph,
  results,
  pageChanged,
  selectedItems,
  onSelectionChange,
  selectionType,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const { items, collectionProps, paginationProps } =
    useCollection(results.costs, {
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
      pagination: { pageSize: 10 },
      sorting: { sortingColumn: 'cost' },
    });

  const handlePageChange = (detail) => {
    let page = detail.currentPageIndex;
    page--;
    pageChanged({
      start: 10 * page,
      end: 10 * page + 10,
    });
    setCurrentPageIndex(detail.currentPageIndex);
  };

  return (
    <Table
      ariaLabels={createTableAriaLabels('resource', 'resources', {
          keys: ['line_item_resource_id', 'product_servicename'],
          fallback: 'Unknown resource'
      }, 'Resources')}
      {...collectionProps}
      header={
        <Header
          actions={
            addToGraph &&
            <Button
              disabled={R.isEmpty(selectedItems) || !selectionType}
              onClick={addToGraph}
              variant='primary'>
              Add to diagram
            </Button>
          }
          description='The resources that incurred a cost based on the query executed'
          variant='h2'>
          Resources
        </Header>
      }
      trackBy={'id'}
      resizableColumns
      stickyHeader
      columnDefinitions={columns}
      items={items}
      selectedItems={selectedItems}
      selectionType={selectionType}
      onSelectionChange={(evt) => onSelectionChange(evt.detail.selectedItems)}
      loadingText='Loading resources'
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
          onChange={
            pageChanged ? ({ detail }) => handlePageChange(detail) : undefined
          }
          pagesCount={Math.floor(results.resultCount / 10)}
        />
      }
    />
  );
};

CostTable.propTypes = {
  addToGraph: PropTypes.func,
  results: PropTypes.object.isRequired,
  pageChanged: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  selectionType: PropTypes.string.isRequired
};

export default CostTable;
