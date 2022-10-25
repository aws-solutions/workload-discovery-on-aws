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

import * as R  from 'ramda';

const ViewExplorerAccountsTable = ({ selectedView }) => {
  const {
    items,
    filterProps,
    collectionProps,
    paginationProps,
  } = useCollection(R.pathOr([], ['accounts'], selectedView), {
    filtering: {
      empty: (
        <Box textAlign='center' color='inherit'>
          <b>No Accounts</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Accounts to display
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No match</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Accounts matched.
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
        trackBy='accountId'
        ariaLabels={{
          itemSelectionLabel: (e, t) => `select ${t.accountId}`,
          selectionGroupLabel: 'Item selection',
        }}
        columnDefinitions={[
          {
            id: 'accountId',
            header: 'Account Id',
            cell: (e) => e.accountId,
          },
        ]}
        items={items}
        loadingText='Loading accounts'
        visibleColumns={['accountId', 'regions', 'resourceCount']}
        filter={
          <TextFilter {...filterProps} filteringPlaceholder='Find an Account' />
        }
        pagination={<Pagination {...paginationProps} />}
        header={<Header>AWS Accounts</Header>}
      />
    </SpaceBetween>
  );
};

export default ViewExplorerAccountsTable;
