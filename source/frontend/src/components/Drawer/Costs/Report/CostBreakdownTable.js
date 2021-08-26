import React from 'react';
import {
  Table,
  Box,
  TextFilter,
  Pagination,
  Container,
  Header,
  ButtonDropdown,
} from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import PropTypes from 'prop-types';
import { CsvBuilder } from 'filefy';

const R = require('ramda');

const CostBreakdownTable = ({
  trackBy,
  columns,
  rows,
  pageSize,
  selectedItems,
  onSelectionChange,
  getDailyCostBreakdown,
}) => {
  const { items, filterProps, collectionProps, paginationProps } =
    useCollection(rows, {
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
      sorting: {},
    });

  const defaultExportCsv = () =>
    new CsvBuilder(`cost-report.csv`)
      .setDelimeter(',')
      .setColumns(R.map((e) => e.header, R.tail(columns)))
      .addRows(
        R.map((e) => R.without([undefined], R.tail(Object.values(e))), items)
      )
      .exportFile();

  return (
    <Container
      disableContentPaddings
      header={
        <Header
          actions={
            <ButtonDropdown
              variant='primary'
              onItemClick={({ detail }) =>
                R.equals(detail.id, 'update')
                  ? getDailyCostBreakdown()
                  : defaultExportCsv()
              }
              items={[
                {
                  text: 'Update graph',
                  id: 'update',
                  disabled: R.isEmpty(selectedItems),
                },
                {
                  text: 'Export CSV',
                  id: 'export',
                  disabled: R.isEmpty(items),
                },
              ]}>
              Actions
            </ButtonDropdown>
          }
          description='The resources that incurred a cost within this workload.'
          variant='h2'>
          Resources
        </Header>
      }>
      <Table
        {...collectionProps}
        trackBy={trackBy}
        resizableColumns
        stickyHeader
        columnDefinitions={columns}
        items={items}
        loadingText='Loading resources'
        selectedItems={selectedItems}
        selectionType='multi'
        onSelectionChange={(evt) => onSelectionChange(evt.detail.selectedItems)}
        filter={
          <TextFilter {...filterProps} filteringPlaceholder='Find resources' />
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
    </Container>
  );
};

CostBreakdownTable.propTypes = {
  trackBy: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  pageSize: PropTypes.number.isRequired,
  selectedItems: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  getDailyCostBreakdown: PropTypes.func.isRequired,
};

export default CostBreakdownTable;
