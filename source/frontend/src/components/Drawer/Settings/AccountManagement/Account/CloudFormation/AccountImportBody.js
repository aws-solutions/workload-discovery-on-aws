import React from 'react';
import {
  SpaceBetween,
  ColumnLayout,
  Box,
  StatusIndicator,
} from '@awsui/components-react';
import { regionMap } from '../../../../../../Utils/Dictionaries/RegionMap';
import AccountImportTable from './AccountImportTable';
import Flashbar from '../../../../../../Utils/Flashbar/Flashbar';
import PropTypes from 'prop-types';
import AccountImportForm from './AccountImportForm';

const R = require('ramda');

const columns = [
  {
    id: 'status',
    header: null,
    cell: (e) => (
      <StatusIndicator type={e.statusType}>{e.statusMessage}</StatusIndicator>
    ),
    width: 75,
    minWidth: 75,
  },
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
    header: 'Account Name',
    cell: (e) => e.accountName,
    sortingField: 'accountName',
    width: 300,
    minWidth: 300,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.label,
    width: 200,
    minWidth: 200,
  },
];

function createData(
  id,
  label,
  region,
  accountId,
  accountName,
  statusType,
  statusMessage
) {
  return {
    id,
    label,
    region,
    accountId,
    accountName,
    statusType,
    statusMessage,
  };
}
const pageSize = 10;

const AccountImportBody = ({ regions, setRegions, importedRegions }) => {
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState();

  const regionExists = (region) =>
    R.gte(
      R.findIndex(
        R.both(
          R.propEq('name', region.name),
          R.propEq('accountId', region.accountId)
        )
      )(importedRegions),
      0
    );

  const getRows = () =>
    R.flatten(
      R.map(
        (region) =>
          createData(
            `${region.accountId}-${region.name}`,
            R.find(R.propEq('id', region.name), regionMap).name,
            region.name,
            region.accountId,
            region.accountName,
            regionExists(region) ? 'error' : 'success',
          ),
        regions
      )
    );

  const removeAllAccounts = () => {
    setRegions([]);
    setSelected([]);
  };

  const removeSelectedRegions = () => {
    let removedRegions = regions;
    R.forEach(
      (selectedRegion) =>
        (removedRegions = R.remove(
          R.findIndex(
            R.both(
              R.propEq('name', selectedRegion.region),
              R.propEq('accountId', selectedRegion.accountId)
            )
          )(removedRegions),
          1,
          removedRegions
        )),
      selected
    );
    setSelected([]);
    setRegions(removedRegions);
  };

  const addRegions = (newRegions) =>
    setRegions(
      R.uniqWith(
        (a, b) =>
          R.and(R.equals(a.accountId, b.accountId), R.equals(a.name, b.name)),
        R.flatten([...regions, newRegions])
      )
    );

  return (
    <>
      {error && (
        <Flashbar
          type='error'
          message='We could not process that request. It could be a temporary issue. Please try again.'
        />
      )}
      <SpaceBetween direction='vertical' size='l'>
          <SpaceBetween direction='vertical' size='l'>
            <AccountImportForm addRegions={addRegions} importedRegions={importedRegions}/>
          </SpaceBetween>
          <Box margin={{ bottom: 'xxxs' }} color='text-label'>
            <AccountImportTable
              trackBy='id'
              rows={getRows()}
              columns={columns}
              onRemove={removeSelectedRegions}
              onRemoveAll={removeAllAccounts}
              sortColumn={'region'}
              pageSize={pageSize}
              selectionType='multi'
              selectedItems={selected}
              onSelectionChange={(item) => setSelected(item)}
              loading={loading}
              actions={true}
            />
          </Box>
      </SpaceBetween>
    </>
  );
};

AccountImportBody.propTypes = {
  regions: PropTypes.array.isRequired,
  setRegions: PropTypes.func.isRequired,
  importedRegions: PropTypes.array.isRequired
};

export default AccountImportBody;
