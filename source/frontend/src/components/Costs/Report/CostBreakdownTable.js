// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useState} from 'react';
import {
  Table,
  Box,
  TextFilter,
  Pagination,
  Header,
  SpaceBetween,
  Button,
} from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import PropTypes from 'prop-types';
import { CsvBuilder } from 'filefy';
import { fetchImage } from '../../../Utils/ImageSelector';
import * as R from 'ramda';

const mapIndexed = R.addIndex(R.map);
const getResourceIcon = (type) => {
  return (
    <img
      alt={`${type} icon`}
      src={fetchImage(type)}
      style={{
        background: 'white',
        width: '30px',
        height: '30px',
      }}
    />
  );
};

const columns = [
  {
    id: 'icon',
    header: 'Icon',
    cell: (e) => getResourceIcon(e.type),
    width: 90,
    minWidth: 90,
  },
  {
    id: 'resource',
    header: 'Name',
    cell: (e) => e.resource,
    width: 320,
    minWidth: 320,
    sortingField: 'resource',
  },
  {
    id: 'service',
    header: 'Billing Service',
    cell: (e) => e.service,
    width: 320,
    minWidth: 320,
    sortingField: 'service',
  },
  {
    id: 'type',
    header: 'Type',
    cell: (e) => e.type,
    width: 200,
    minWidth: 200,
    sortingField: 'type',
  },
  {
    id: 'cost',
    header: 'Estimated Cost ($)',
    cell: (e) => `${e.cost}`,
    sortingField: 'cost',
    width: 200,
    minWidth: 200,
  },
  {
    id: 'accountId',
    header: 'Account Id',
    cell: (e) => e.accountId,
    width: 150,
    minWidth: 150,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.region,
    width: 150,
    minWidth: 150,
    sortingField: 'region',
  },
  {
    id: 'resourceArn',
    header: 'ARN',
    cell: (e) => e.resourceArn,
    width: 150,
    minWidth: 150,
  },
];

const exportColumns = columns.filter(i => i.header !== "Icon").map(i => ({
  header: i.header,
  prop: i.id
}));

const CostBreakdownTable = ({
  resources,
  onSelectionChange,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const onUpdateGraph = () => {
    onSelectionChange(selectedItems)
  }

  const getRows = () =>
    mapIndexed((e, index) => {
      return {
        id: index,
        resource: e.data.title,
        type: e.data.properties.resourceType,
        icon: e.image,
        cost: e.data.cost,
        accountId: e.data.resource.accountId,
        region: e.data.resource.region,
        resourceId: e.data.resourceId,
        resourceArn: e.data.resource.arn,
        service: e.data.service,
      };
    }, resources);

  const {
    items,
    filterProps,
    collectionProps,
    paginationProps,
  } = useCollection(getRows(), {
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
    sorting: {},
  });

  const defaultExportCsv = () =>
    new CsvBuilder(`cost-report.csv`)
      .setDelimeter(',')
      .setColumns(exportColumns.map(i => i.header))
      .addRows(items.map(i => exportColumns.map(j => i[j.prop])))
      .exportFile();

  return (
    <Table
      {...collectionProps}
      trackBy={'id'}
      header={
        <Header
          actions={
            <SpaceBetween size={"s"} direction={"horizontal"}>
              <Button onClick={onUpdateGraph} disabled={R.isEmpty(selectedItems)}>
                Update Graph
              </Button>
              <Button onClick={() => defaultExportCsv()} variant={"primary"} disabled={R.isEmpty(items)}>
                Export CSV
              </Button>
            </SpaceBetween>
          }
          description='The resources that incurred a cost within this workload.'
          variant='h2'>
          Resources
        </Header>
      }
      resizableColumns
      stickyHeader
      columnDefinitions={columns}
      items={items}
      loadingText='Loading resources'
      selectedItems={selectedItems}
      selectionType='multi'
      onSelectionChange={({detail}) => setSelectedItems(detail.selectedItems)}
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
  );
};

CostBreakdownTable.propTypes = {
  resources: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default CostBreakdownTable;
