// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import * as R  from 'ramda';
import dayjs  from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Table,
  Box,
  TextFilter,
  Header,
  Pagination,
  Button,
  SpaceBetween,
  StatusIndicator, Modal,
} from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import { isEmpty } from 'ramda';
import PropTypes from 'prop-types';
import {useAccounts, useRemoveAccountRegion} from "../../Hooks/useAccounts";
import {useResourcesRegionMetadata} from "../../Hooks/useResourcesMetadata";
import {isUsingOrganizations} from "../../../Utils/AccountUtils";

dayjs.extend(relativeTime);

const columns = [
  {
    id: 'id',
    cell: (e) => `${e.accountId}-${e.name}`,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.name,
    width: 200,
    minWidth: 200,
  },
  {
    id: 'account',
    header: 'Account Id',
    cell: (e) => e.accountId,
    width: 200,
    minWidth: 200,
  },
  {
    id: 'count',
    header: 'Resources',
    cell: (e) =>
      e.count ? (
        e.count
      ) : (
        <StatusIndicator type='warning'>Not discovered</StatusIndicator>
      ),
    width: 150,
    minWidth: 150,
  },
];

const DiscoverableRegionsTable = ({ selectedAccounts }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const {data: accounts=[], isLoading: loadingAccounts} = useAccounts();
  const [selectedRegions, setSelectedRegions] = React.useState([]);
  const {removeAsync} = useRemoveAccountRegion();
  const {data=[], isLoading: loadingRegions} = useResourcesRegionMetadata(R.chain((e) => {
    return {
      accountId: e.accountId,
      regions: R.map((r) => {
        return { name: r.name };
      }, e.regions),
    };
  }, selectedAccounts))

  const addCount = (region, response) => {
    const x = R.find(R.propEq('id', region.id))(response);
    return x ? R.assoc('count', x.count, region) : region;
  };

  const accountsToRegions = R.compose(
    R.map((e) => R.assoc('id', `${e.accountId}-${e.name}`, e)),
    R.chain((e) => R.map(R.assoc('accountId', e.accountId), e.regions)),
  )

  const regions = R.compose(
    R.uniqBy((e) => e.id),
    R.map((e) => addCount(e, accountsToRegions(data))),
    R.reduce(
      (acc, e) =>
        R.concat(
          acc,
          R.chain((region) => {
            return {
              accountId: e.accountId,
              accountName: e.name,
              name: region.name,
              id: `${e.accountId}-${region.name}`,
            };
          }, e.regions)
        ),
      []
    ),
    R.filter((x) =>!R.isNil(R.find(R.propEq('accountId', x.accountId))(selectedAccounts)))
  )(accounts)

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
            No Region matched filter
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No Region</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Region matched filter
          </Box>
        </Box>
      ),
    },
    pagination: { pageSize: 10 },
    sorting: {},
  });

  const handleDelete = () => {
    removeAsync({
      accountId: R.head(selectedAccounts).accountId,
      regions: R.map((e) => {
        return { name: e.name };
      }, selectedRegions),
    })
      .then(() => setShowDeleteConfirm(false))
      .then(() => setSelectedRegions([]))
  };

  return (
    <>
      <Modal
        onDismiss={() => setShowDeleteConfirm(false)}
        visible={showDeleteConfirm}
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="link">Cancel</Button>
              <Button onClick={handleDelete} variant="primary">Delete</Button>
            </SpaceBetween>
          </Box>
        }
        header="Remove Region"
      >
        <Box>Remove the following regions for <strong>{selectedAccounts.map(i => i.accountId).join(", ")}</strong>?</Box>
        <ul>
          {selectedRegions.map((i, idx) => <li key={idx}><strong>{i.name}</strong></li>)}
        </ul>
      </Modal>
      <Table
        {...collectionProps}
        header={
          <Header
            variant='h2'
            description='AWS Regions that have been imported into Workload Discovery on AWS.'
            actions={
                isUsingOrganizations()
                    ? void 0
                    : <SpaceBetween direction='horizontal' size='l'>
                        <Button
                            loadingText='Removing'
                            variant='primary'
                            disabled={isEmpty(selectedRegions)}
                            onClick={() => setShowDeleteConfirm(true)}>
                            Remove
                        </Button>
                    </SpaceBetween>
            }>
            Regions
          </Header>
        }
        trackBy={'id'}
        loading={loadingAccounts || loadingRegions}
        resizableColumns
        columnDefinitions={columns}
        visibleColumns={['region', 'name', 'account', 'count', 'types']}
        items={items}
        selectedItems={selectedRegions}
        selectionType='multi'
        onSelectionChange={(evt) => setSelectedRegions(evt.detail.selectedItems)}
        isItemDisabled={isUsingOrganizations}
        loadingText='Loading Regions'
        filter={
          <TextFilter {...filterProps} filteringPlaceholder='Find a Region...' />
        }
        pagination={<Pagination {...paginationProps} />}
      />
    </>
  );
};

DiscoverableRegionsTable.propTypes = {
  selectedAccounts: PropTypes.array.isRequired,
};
export default DiscoverableRegionsTable;
