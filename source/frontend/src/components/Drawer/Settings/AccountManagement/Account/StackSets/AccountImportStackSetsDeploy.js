import React from 'react';
import {
  Alert,
  Button,
  SpaceBetween,
  StatusIndicator,
} from '@awsui/components-react';
import { regionMap } from '../../../../../../Utils/Dictionaries/RegionMap';
import AccountImportTable from './AccountImportStackSetsTable';
import {
  generateCloudFormationLink,
  generateCloudFormationStackSetLink,
} from '../../../../../../Utils/CloudFormation/CloudFormationURLGenerator';
import PropTypes from 'prop-types';
import { createGenerateClassName } from '@material-ui/styles';

const R = require('ramda');

function createData(id, region, regionId, accountId, accountName, visited) {
  return {
    id,
    region,
    regionId,
    accountId,
    accountName,
    visited,
  };
}

const AccountImportDeploy = ({ regions }) => {
  const pageSize = 10;
  const [visited, setVisited] = React.useState([]);

  const logVisit = (e) => {
    setVisited([...visited, e.id]);
    return window.open(
      generateCloudFormationStackSetLink(e.accountId, e.regionId), 'blank', 'rel=noreferrer'
    );
  };

  const columns = [
    {
      id: 'deploy',
      cell: (e) => (
        <Button
          iconName={
            R.includes(e.id, visited) ? 'status-positive' : 'status-in-progress'
          }
          onClick={() => logVisit(e)}
          iconAlign='right'>
          Deploy
        </Button>
      ),
      width: 200,
      minWidth: 200,
    },
    {
      id: 'account',
      header: 'Account Id',
      cell: (e) => e.accountId,
      sortingField: 'accountId',
      width: 150,
      minWidth: 150,
    },
    {
      id: 'accountName',
      header: 'Account name',
      cell: (e) => e.accountName,
      sortingField: 'accountName',
      width: 200,
      minWidth: 200,
    },
    {
      id: 'region',
      header: 'Region',
      cell: (e) => e.region,
      width: 150,
      minWidth: 150,
    },
  ];

  const getRows = () =>
    R.flatten(
      R.map(
        (region) =>
          createData(
            `${region.accountId}-${region.name}`,
            R.find(R.propEq('id', region.name), regionMap).name,
            R.find(R.propEq('id', region.name), regionMap).id,
            region.accountId,
            region.accountName,
            R.includes(`${region.accountId}-${region.name}`, visited)
          ),
        regions
      )
    );

  return (
    <SpaceBetween direction='vertical' size='l'>
      <Alert
        visible={true}
        dismissAriaLabel='Close alert'
        header='Regions missing?'>
        We removed the Regions that are already discoverable to
        Perspective.
      </Alert>
      <AccountImportTable
        trackBy='id'
        rows={getRows()}
        columns={columns}
        sortColumn={'region'}
        pageSize={pageSize}
      />
    </SpaceBetween>
  );
};
AccountImportDeploy.propTypes = {
  regions: PropTypes.array.isRequired,
};

export default AccountImportDeploy;
