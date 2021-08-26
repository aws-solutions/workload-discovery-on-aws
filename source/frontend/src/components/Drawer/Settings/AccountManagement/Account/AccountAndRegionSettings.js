import React, { useState } from 'react';

import { SpaceBetween, Box } from '@awsui/components-react/';

import { regionMap } from '../../../../../Utils/Dictionaries/RegionMap';
import {
  handleResponse,
  wrapRequest,
  getAccounts,
  deleteRegions,
  deleteAccounts,
} from '../../../../../API/Handlers/SettingsGraphQLHandler';
import AccountTable from './AccountTable';
import AccountImportForm from './AccountImportForm';
import RegionImportForm from './RegionImportForm';
import Flashbar from '../../../../../Utils/Flashbar/Flashbar';
var findIndex = require('lodash.findindex');

const R = require('ramda');

var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
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
    id: 'region',
    header: 'Region',
    cell: (e) => e.region,
    width: 200,
    minWidth: 200,
  },

  {
    id: 'lastScanned',
    header: 'Last Scanned',
    cell: (e) =>
      R.isNil(e.lastCrawled) ? 'N/A' : dayjs(e.lastCrawled).fromNow(),
    width: 300,
    minWidth: 300,
  },
];

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box margin={{ bottom: 'xxxs' }} color='text-label'>
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

function createData(id, region, accountId, accountName, lastCrawled) {
  return {
    id,
    region: regionMap.filter((e) => e.id === region).map((e) => e.name),
    regionId: region,
    accountId,
    accountName,
    lastCrawled,
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default () => {
  const pageSize = 10;
  const [selected, setSelected] = React.useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState();
  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const waitAndReload = async () =>
    Promise.resolve(await sleep(2000))
      .then(clearTimeout(sleep))
      .then(() => fetchAccounts())
      .then(() => setLoading(false));

  const deleteSelectedRegions = async (items) => {
    await Promise.resolve(
      R.groupWith((a, b) => a.accountId === b.accountId, items)
    ).then(
      R.forEach((e) => {
        R.map(
          (account) =>
            wrapRequest(deleteRegions, {
              accountId: account.accountId,
              regions: [{ name: account.regionId }],
            })
              .then(handleResponse)
              .then(setLoading(true))
              .then(waitAndReload)
              .then(setSelected([]))
              .catch((err) => {
                setLoading(false);
                setError(err);
              }),
          e
        );
      })
    );
    const accountsToDelete = [];
    await Promise.resolve(
      R.groupWith((a, b) => a.accountId === b.accountId, items)
    ).then(
      R.forEach((group) =>
        accounts.forEach(
          (account) =>
            account.accountId === R.head(group).accountId &&
            R.length(account.regions) === R.length(group) &&
            accountsToDelete.push(account.accountId)
        )
      )
    );
    deleteEmptyAccounts(accountsToDelete);
  };

  const deleteEmptyAccounts = (accountsToDelete) => {
    wrapRequest(deleteAccounts, {
      accountIds: accountsToDelete,
    })
      .then(handleResponse)
      .then(setLoading(true))
      .then(waitAndReload)
      .catch((err) => setError(err));
  };

  React.useEffect(() => {
    fetchAccounts();
  }, [render]);

  const fetchAccounts = async () => {
    await wrapRequest(getAccounts)
      .then(handleResponse)
      .then(R.pathOr([], ['body', 'data', 'getAccounts']))
      .then(
        R.reduce((acc, e) => {
          acc.push({
            accountId: e.accountId,
            accountName: e.name,
            regions: e.regions,
            lastCrawled: e.lastCrawled,
          });
          return acc;
        }, [])
      )
      .then(R.flatten)
      .then(setAccounts)
      .catch((err) => setError(err));
  };

  const getRows = () =>
    R.flatten(
      accounts.map((account) =>
        account.regions.map((region) =>
          createData(
            `${account.accountId + region.name}`,
            region.name,
            account.accountId,
            account.accountName,
            region.lastCrawled
          )
        )
      )
    );
  return (
    <div>
      {error && (
        <Flashbar
          type='error'
          message='We could not process that request. It could be a temporary issue. Please try again.'
        />
      )}
      <SpaceBetween direction='vertical' size='l'>
        <AccountTable
          trackBy='id'
          reload={fetchAccounts}
          rows={getRows()}
          columns={columns}
          onRemove={deleteSelectedRegions}
          sortColumn={'region'}
          pageSize={pageSize}
          selectionType='multi'
          selectedItems={selected}
          onSelectionChange={(item) => setSelected(item)}
          loading={loading}
        />
        <AccountImportForm onChange={() => setRender(!render)} />
        <RegionImportForm
          accounts={accounts}
          onChange={() => setRender(!render)}
        />
      </SpaceBetween>
    </div>
  );
};
