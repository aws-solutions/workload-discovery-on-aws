import React, { useState, useEffect } from 'react';

import Form from '@awsui/components-react/form';
import SpaceBetween from '@awsui/components-react/space-between';
import Button from '@awsui/components-react/button';
import Header from '@awsui/components-react/header';
import Container from '@awsui/components-react/container';
import Box from '@awsui/components-react/box';
import Toggle from '@awsui/components-react/toggle';
import { useResourceState } from '../../../../../Contexts/ResourceContext';
import AccountFilterTable from './AccountFilterTable';
import { uploadObject } from '../../../../../../API/Storage/S3Store';
import {
  getAccounts,
  handleResponse,
  wrapRequest,
} from '../../../../../../API/Handlers/SettingsGraphQLHandler';
import RegionFilterTable from './RegionFilterTable';
import { filterOnAccountAndRegion } from '../../../../../Actions/ResourceActions';
import { useGraphState } from '../../../../../Contexts/GraphContext';
import Flashbar from '../../../../../../Utils/Flashbar/Flashbar';
import {
  ColumnLayout,
  Grid,
  HelpPanel,
  TextContent,
} from '@awsui/components-react';
const R = require('ramda');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const accountColumns = [
  {
    id: 'accountId',
    header: 'Account Id',
    cell: (e) => e.accountId,
    width: 150,
    minWidth: 150,
  },
  {
    id: 'accountName',
    header: 'Name',
    cell: (e) => e.accountName,
    width: 300,
    minWidth: 300,
  },
  {
    id: 'included',
    header: 'Show',
    cell: (e) => e.status,
    width: 250,
    minWidth: 250,
  },
  {
    id: 'showGlobal',
    header: 'Show global resources',
    cell: (e) => e.showGlobal,
    width: 250,
    minWidth: 250,
  },
  {
    id: 'regions',
    header: 'Regions',
    cell: (e) => e.regionCount,
    width: 150,
    minWidth: 150,
  },
];

const regionColumns = [
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
    width: 300,
    minWidth: 300,
    sortingField: 'region',
  },
  {
    id: 'included',
    header: 'Show',
    cell: (e) => e.status,
    width: 150,
    minWidth: 150,
  },
];

const AccountFilter = () => {
  const [{ filters }, dispatch] = useResourceState();
  const [{ graphFilters }, updateFilters] = useGraphState();
  const [error, setError] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState([]);

  const buildFilters = (newFilters) => {
    let filterList = [];

    newFilters.accounts.map((account) => {
      if (!account.excluded) {
        if (account.showGlobal) {
          filterList.push({
            accountId: account.accountId,
            id: `${account.accountId} :: global`,
            region: 'global',
          });
        }        
      }
    });

    filterList = R.concat(
      filterList,
      R.flatten(
        newFilters.regions
          .filter((region) => !region.excluded)
          .map((region) => {
            return {
              accountId: region.accountId,
              id: `${region.accountId} :: ${region.region}`,
              region: region.region,
            };
          })
      )
    );
    return filterList;
  };

  const isMatch = (node) =>
    !R.includes(node.resourceType, graphFilters.typeFilters);

  const removeFilteredNodes = (resources) =>
    Promise.resolve(R.pathOr([], ['body'], resources)).then((e) => {
      dispatch({
        type: 'updateResources',
        resources: {
          nodes: R.filter((e) => isMatch(e), e.nodes),
          metaData: e.metaData,
        },
      });
    });

  const applyFilters = (newFilters) => {
    const filtersToApply = buildFilters(newFilters);

    Promise.resolve(filterOnAccountAndRegion(filtersToApply))
      .then(handleResponse)
      .then(removeFilteredNodes)
      .then(
        uploadObject(
          'filters/accounts/filters',
          JSON.stringify(filtersToApply),
          'private',
          'application/json'
        )
          .then(
            dispatch({
              type: 'updateAccountOrRegionFilters',
              filters: filtersToApply,
            })
          )
          .then(() => setError(false))
          .catch((err) => setError(true))
      )
      .then(() => setError(false))
      .catch((err) => setError(true));
  };

  React.useEffect(() => {
    wrapRequest(getAccounts)
      .then(handleResponse)
      .then(R.pathOr([], ['body', 'data', 'getAccounts']))
      .then(
        R.reduce((acc, e) => {
          acc.push({
            accountId: e.accountId,
            accountName: e.name,
            showGlobal: !R.isNil(
              R.find(
                R.whereEq({ accountId: e.accountId, region: 'global' }),
                filters
              )
            ),
            regions: e.regions,
            lastCrawled: e.lastCrawled,
            excluded: R.isNil(
              R.find(R.propEq('accountId', e.accountId), filters)
            ),
          });
          return acc;
        }, [])
      )
      .then(R.flatten)
      .then((e) => {
        setAccounts(e);
        setRegions(
          R.chain(
            (account) =>
              account.regions.map((region) => {
                return {
                  accountId: account.accountId,
                  region: region.name,
                  excluded: R.isNil(
                    R.find(R.propEq('region', region.name), filters)
                  ),
                };
              }),
            e
          )
        );
      })
      .then(() => setError(false))
      .catch((err) => setError(true));
  }, []);

  const getShowAccountToggle = (account) => {
    return (
      <Toggle
        onChange={({ detail }) => {
          const updateAccount = R.find(
            R.propEq('accountId', account.accountId),
            accounts
          );
          updateAccount.excluded = !detail.checked;
          updateAccount.showGlobal = detail.checked;

          let switchedRegions = regions;
          R.forEach((e) => {
            if (e.accountId === account.accountId) e.excluded = !detail.checked;
          }, switchedRegions);

          applyFilters({
            accounts: R.uniq([...accounts, updateAccount]),
            regions: switchedRegions,
          });

          setAccounts(R.uniq([...accounts, updateAccount]));
          setRegions(switchedRegions);
        }}
        checked={!account.excluded}></Toggle>
    );
  };

  const getShowGlobalToggle = (account) => {
    return (
      <Toggle
        onChange={({ detail }) => {
          const updateAccount = R.find(
            R.propEq('accountId', account.accountId),
            accounts
          );
          updateAccount.showGlobal = detail.checked;
          applyFilters({
            accounts: R.uniq([...accounts, updateAccount]),
            regions: regions,
          });
          setAccounts(R.uniq([...accounts, updateAccount]));
        }}
        disabled={account.excluded}
        checked={account.showGlobal}></Toggle>
    );
  };

  const getShowRegionToggle = (region) => (
    <Toggle
      onChange={({ detail }) => {
        region.excluded = !detail.checked;
        applyFilters({
          accounts: accounts,
          regions: R.uniq([...regions, region]),
        });
        setRegions(R.uniq([...regions, region]));
      }}
      disabled={R.isNil(
        R.find(
          R.whereEq({ accountId: region.accountId}),
          filters
        )
      )}
      checked={!region.excluded}></Toggle>
  );

  const getRegionRows = () =>
    !R.isEmpty(selectedAccount)
      ? R.map(
          getRegionRow,
          R.filter(
            (e) => R.equals(e.accountId, R.head(selectedAccount).accountId),
            regions
          )
        )
      : [];

  const getRegionRow = (region) => {
    return {
      id: `${region.accountId} :: ${region.region}`,
      accountId: region.accountId,
      region: region.region,
      status: getShowRegionToggle(region),
      statusSort: region.excluded ? '0' : '1',
    };
  };

  const getAccountRows = () =>
    R.map((e) => {
      return {
        id: e.accountId,
        accountId: e.accountId,
        accountName: e.accountName,
        status: getShowAccountToggle(e),
        showGlobal: getShowGlobalToggle(e),
        statusSort: e.excluded ? '0' : '1',
        regions: e.regions,
        regionCount: R.length(e.regions),
      };
    }, accounts);

  return (
    <div>
      {error && (
        <Flashbar
          type='error'
          message='We could not update your filters. It could be a temporary issue. Please try again.'
        />
      )}
      <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
        <HelpPanel>
          <h5>Account and Region Filters</h5>
          <p>
            Filter the resources Perspective will display by toggling the
            visibility of discoverable Regions
          </p>
          <dl>
            <dt>Make resources visible within a particular Region</dt>
            <dd>
              <ol>
                <li>
                  Select the account that contains the Region to make visible
                  from the <strong>Accounts</strong> table.
                </li>
                <li>
                  Locate the Region in the <strong>Regions</strong> table.
                </li>
                <li>
                  Toggle <strong>Show</strong> and it will appear in the{' '}
                  <strong>Resources</strong> menu in the side panel
                </li>
              </ol>
            </dd>
            <dt>What does Show global resources do?</dt>
            <dd>
              Enable this configuration to show <strong>Global</strong>{' '}
              resources within the corresponding account. These include IAM &
              Tags
            </dd>
          </dl>
        </HelpPanel>
        <SpaceBetween direction='vertical' size='l'>
          <AccountFilterTable
            header='Accounts'
            trackBy='id'
            rows={getAccountRows()}
            columns={accountColumns}
            sortColumn={'statusSort'}
            pageSize={10}
            textFilter={true}
            selectedItems={selectedAccount}
            onSelectionChange={setSelectedAccount}
          />
          <RegionFilterTable
            header='Regions'
            trackBy='id'
            rows={getRegionRows()}
            columns={regionColumns}
            sortColumn={'statusSort'}
            pageSize={10}
            textFilter={true}
          />
        </SpaceBetween>
      </Grid>
    </div>
  );
};
export default AccountFilter;
