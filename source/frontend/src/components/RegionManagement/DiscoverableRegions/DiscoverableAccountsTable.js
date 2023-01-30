// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useState} from 'react';
import {
  Box,
  Button,
  TextFilter,
  Header,
  Pagination,
  Table,
  SpaceBetween, Modal,
} from '@awsui/components-react';
import PropTypes from 'prop-types';
import { IMPORT } from '../../../routes';
import { useCollection } from '@awsui/collection-hooks';
import { useHistory } from 'react-router-dom';
import {useAccounts, useRemoveAccount} from "../../Hooks/useAccounts";
import dayjs  from 'dayjs';
import localizedFormat  from 'dayjs/plugin/localizedFormat';
import relativeTime  from 'dayjs/plugin/relativeTime';
import * as R  from 'ramda';
import {useDeepCompareEffect} from "react-use";
import {isUsingOrganizations} from "../../../Utils/AccountUtils";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const columns = [
  {
    id: 'account',
    header: 'Account Id',
    cell: (e) => e.accountId,
    sortingField: 'accountId',
    width: 200,
    minWidth: 200,
  },
  {
    id: 'accountName',
    header: 'Account name',
    cell: (e) => e.accountName,
    sortingField: 'accountName',
    width: 300,
    minWidth: 300,
  },
  {
    id: 'regions',
    header: 'Regions',
    cell: (e) => e.regionCount,
    width: 200,
    minWidth: 200,
  },
];

const DiscoverableAccountsTable = ({ selectedAccounts, onSelect }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {data=[], isLoading} = useAccounts();
  const {removeAsync} = useRemoveAccount();
  const history = useHistory();

  useDeepCompareEffect(() => {
    onSelect(selectedAccounts.filter(i => data.find(j => i.accountId === j.accountId)));
  }, [data, onSelect, selectedAccounts]);

  const accounts = R.map(
    (acc) => ({
        id:`${acc.accountId + acc.name}`,
        accountId: acc.accountId,
        accountName: acc.name,
        regionCount: R.length(acc.regions),
        lastCrawled: acc.lastCrawled,
        regions: acc.regions,
    }),
    data
  )

  const onSelectionChange = (items) => {
    onSelect(items);
  };

  const {
    items,
    filterProps,
    collectionProps,
    paginationProps,
  } = useCollection(accounts, {
    filtering: {
      empty: (
        <Box textAlign='center' color='inherit'>
          <b>No Accounts</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Account matched filter
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No Account</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Account matched filter
          </Box>
        </Box>
      ),
    },
    pagination: { pageSize: 10 },
    sorting: { sortingColumn: 'accountId' },
  });

  const handleDelete = () => {
    return removeAsync(selectedAccounts.map(i => i.accountId)).then(() => setShowDeleteConfirm(false));
  }

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
        header="Remove Account"
      >
        Remove the AWS account <strong>{selectedAccounts.map(i => R.defaultTo(i.accountId, i.accountName)).join(", ")}</strong>?
      </Modal>
      <Table
        {...collectionProps}
        header={
          <Header
            actions={
              isUsingOrganizations()
                  ? void 0
                  : <SpaceBetween direction='horizontal' size='xs'>
                      <Button
                          disabled={R.isEmpty(selectedAccounts)}
                          onClick={() => setShowDeleteConfirm(true)}>
                          Remove
                      </Button>
                      <Button
                          loadingText='Removing'
                          variant='primary'
                          onClick={(e) => {
                              e.preventDefault();
                              history.push(IMPORT);
                          }}>
                          Import
                      </Button>
                  </SpaceBetween>
            }
            variant='h2'
            description='AWS accounts that contain Regions imported into Workload Discovery on AWS'>
            Accounts
          </Header>
        }
        loading={isLoading}
        trackBy={'id'}
        resizableColumns
        columnDefinitions={columns}
        items={items}
        selectedItems={selectedAccounts}
        selectionType='multi'
        onSelectionChange={(evt) => onSelectionChange(evt.detail.selectedItems)}
        loadingText='Loading accounts'
        filter={
          <TextFilter {...filterProps} filteringPlaceholder='Find an Account...' />
        }
        pagination={<Pagination {...paginationProps} />}
      />
    </>
  );
};

DiscoverableAccountsTable.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default DiscoverableAccountsTable;
