import React, { useState, useEffect } from 'react';
import Table from '@awsui/components-react/table';
import Box from '@awsui/components-react/box';
import TextFilter from '@awsui/components-react/text-filter';
import Header from '@awsui/components-react/header';
import Pagination from '@awsui/components-react/pagination';
import Button from '@awsui/components-react/button';
import SpaceBetween from '@awsui/components-react/space-between';
import { useCollection } from '@awsui/collection-hooks';
import { isEmpty } from 'ramda';

import {
  deleteAccounts,
  deleteRegions,
  getAccounts,
  handleResponse,
  wrapRequest,
} from '../../../../../API/Handlers/SettingsGraphQLHandler';
import { regionMap } from '../../../../../Utils/Dictionaries/RegionMap';
import PropTypes from 'prop-types';
import { filterOnAccountAndRegion } from '../../../../Actions/ResourceActions';
import { uploadObject } from '../../../../../API/Storage/S3Store';
import { useResourceState } from '../../../../Contexts/ResourceContext';
import { useGraphState } from '../../../../Contexts/GraphContext';

const R = require('ramda');

var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

const DiscoverableAccountsAndRegionsTable = ({ refresh }) => {
  const [{ filters }, dispatch] = useResourceState();
  const [{ graphFilters }, dispatchGraphFilters] = useGraphState();
  const [deleting, setDeleting] = React.useState(false);
  const [selectedRegions, setSelectedRegions] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    waitAndReload();
  }, [refresh]);

  const fetchAccounts = async () => {
    await wrapRequest(getAccounts)
      .then(handleResponse)
      .then(R.pathOr([], ['body', 'data', 'getAccounts']))
      .then(
        R.reduce(
          (acc, e) =>
            R.concat(
              acc,
              R.map((region) => {
                return {
                  accountId: e.accountId,
                  accountName: e.name,
                  name: region.name,
                  lastCrawled: region.lastCrawled,
                };
              }, e.regions)
            ),
          []
        )
      )
      .then(R.flatten)
      .then(setRegions)
      .catch((err) => setError(err));
  };

  const getRows = () =>
    R.flatten(
      regions.map((region) =>
        createData(
          `${region.accountId + region.name}`,
          region.name,
          region.accountId,
          region.accountName,
          region.lastCrawled
        )
      )
    );

  const { items, filterProps, collectionProps, paginationProps } =
    useCollection(getRows(), {
      filtering: {
        empty: (
          <Box textAlign='center' color='inherit'>
            <b>No Regions</b>
            <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
              No Regions to display.
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
      pagination: { pageSize: 10 },
      sorting: { sortingColumn: 'accountId' },
    });

  const waitAndReload = async () =>
    Promise.resolve(await sleep(2000))
      .then(clearTimeout(sleep))
      .then(fetchAccounts())
      .then(setLoading(false));

  const updateRegionalFilters = (regionsToRemove) =>
    R.map(
      (e) =>
        R.find(
          R.whereEq({ accountId: e.accountId, region: e.regionId }),
          filters
        ),
      regionsToRemove
    );

  const updateAccountFilters = (account) =>
    R.without(
      R.concat(
        [
          R.find(
            R.whereEq({ accountId: account.accountId, region: 'global' }),
            filters
          ),
        ],
        updateRegionalFilters(selectedRegions)
      ),

      filters
    );

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

  const applyFilters = (filtersToApply) => {
    Promise.resolve(filterOnAccountAndRegion(filtersToApply))
      .then(handleResponse)
      .then((e) => removeFilteredNodes(e))
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
          .then(setError())
          .catch((err) => setError(err))
      )
      .then(setError())
      .catch((err) => setError(err));
  };

  const deleteAccount = (region) => {
    if (
      R.lte(
        R.length(R.filter(R.propEq('accountId', region.accountId), regions)),
        1
      )
    ) {
      wrapRequest(deleteAccounts, {
        accountIds: [region.accountId],
      })
        .then(handleResponse)
        .then(setLoading(true))
        .then(waitAndReload)
        .then(() => applyFilters(updateAccountFilters(region)))
        .then(setSelectedRegions([]))
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    } else {
      applyFilters(R.without(updateRegionalFilters(selectedRegions), filters));
    }
  };

  const onRemove = async () =>
    await Promise.resolve(
      R.groupWith((a, b) => a.accountId === b.accountId, selectedRegions)
    ).then(
      R.forEach((e) => {
        R.forEach(
          (region) =>
            wrapRequest(deleteRegions, {
              accountId: region.accountId,
              regions: [{ name: region.regionId }],
            })
              .then(handleResponse)
              .then(setLoading(true))
              .then(waitAndReload)
              .then(deleteAccount(region))
              .catch((err) => {
                setLoading(false);
                setError(err);
              }),
          e
        );
      })
    );

  return (
    <Table
      {...collectionProps}
      header={
        <Header
          variant='h2'
          description='The AWS Regions that are discoverable to AWS Perspective.'
          actions={
            <SpaceBetween direction='horizontal' size='l'>
              {deleting && (
                <SpaceBetween direction='horizontal' size='l'>
                  <Button
                    disabled={isEmpty(selectedRegions)}
                    onClick={() => {
                      onRemove();
                      setDeleting(false);
                    }}>
                    Confirm
                  </Button>
                  <Button
                    variant='primary'
                    disabled={isEmpty(selectedRegions)}
                    onClick={() => setDeleting(false)}>
                    Close
                  </Button>
                </SpaceBetween>
              )}
              {!deleting && (
                <Button
                  loading={loading}
                  loadingText='Removing'
                  variant='primary'
                  disabled={isEmpty(selectedRegions)}
                  onClick={() => setDeleting(true)}>
                  Remove
                </Button>
              )}
              <Button iconName='refresh' onClick={() => fetchAccounts()} />
            </SpaceBetween>
          }>
          Regions
        </Header>
      }
      trackBy={'id'}
      resizableColumns
      columnDefinitions={columns}
      items={items}
      selectedItems={selectedRegions}
      selectionType='multi'
      onSelectionChange={(evt) => setSelectedRegions(evt.detail.selectedItems)}
      loadingText='Loading Regions'
      loading={loading}
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder='Explore Regions'
        />
      }
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No Regions</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Regions to display.
          </Box>
        </Box>
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
};

DiscoverableAccountsAndRegionsTable.propTypes = {
  refresh: PropTypes.bool.isRequired,
};
export default DiscoverableAccountsAndRegionsTable;
