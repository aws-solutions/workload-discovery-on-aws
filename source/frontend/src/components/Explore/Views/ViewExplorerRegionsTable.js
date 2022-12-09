// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Box,
  TextFilter,
  Header,
  SpaceBetween,
  Table,
  Pagination,
} from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import { regionMap } from '../../../Utils/Dictionaries/RegionMap';

import * as R  from 'ramda';

const ViewExplorerRegionsTable = ({ selectedView }) => {
  const regions = selectedView.accounts?.reduce((acc, next) => R.uniq(acc.concat(next.regions ?? [])), []) ?? []

  const {
    items,
    filterProps,
    collectionProps,
    paginationProps,
  } = useCollection(regions, {
    filtering: {
      empty: (
        <Box textAlign='center' color='inherit'>
          <b>No Regions</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Regions to display
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
    pagination: { pageSize: 5 },
    sorting: {},
  });

  return (
    <SpaceBetween size='l' direction='vertical'>
      <Table
        {...collectionProps}
        trackBy='id'
        ariaLabels={{
          itemSelectionLabel: (e, t) => `select ${t.accountId}`,
          selectionGroupLabel: 'Item selection',
        }}
        columnDefinitions={[
          {
            id: 'awsId',
            header: 'Id',
            cell: (e) => e.name,
          },
          {
            id: 'name',
            header: 'Name',
            cell: (e) => R.find(R.propEq('id', e.name), regionMap).name,
          },
        ]}
        items={items}
        loadingText='Loading Regions'
        visibleColumns={['awsId', 'name']}
        filter={
          <TextFilter {...filterProps} filteringPlaceholder='Find a Region' />
        }
        pagination={<Pagination {...paginationProps} />}
        header={<Header>Regions</Header>}
      />
    </SpaceBetween>
  );
};

export default ViewExplorerRegionsTable;
