import React from 'react';
import { Link, SpaceBetween } from '@awsui/components-react';
import { regionMap } from '../../Utils/Dictionaries/RegionMap';
import GettingStartedAccountTable from './GettingStartedAccountTable';
import { generateCloudFormationLink } from '../../Utils/CloudFormation/CloudFormationURLGenerator';

const R = require('ramda');

const columns = [
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
    width: 300,
    minWidth: 300,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.region,
    width: 150,
    minWidth: 150,
  },
  {
    id: 'deploy',
    // header: 'Deploy',
    cell: (e) => (
      <Link
        external
        externalIconAriaLabel="Opens AWS Sign-in page in a new tab"
        href={generateCloudFormationLink(e.accountId, e.regionId)}
        >
        Open AWS CloudFormation Console
      </Link>
    ),
    width: 150,
    minWidth: 150,
  },
];

function createData(id, region, accountId, accountName) {
  return {
    id,
    region,
    accountId,
    accountName
  };
}

const mapIndexed = R.addIndex(R.map)


export default ({ accounts }) => {
  const pageSize = 10;
  const [selected, setSelected] = React.useState([]);

  const getRows = () =>
      R.chain(
        (account) =>
          account.regions
            ? mapIndexed(
                (e, index) =>
                  createData(
                    `${account.accountId}-${e.region}-${index}`,
                    R.find(R.propEq('id', e.region), regionMap).name,
                    account.accountId,
                    account.accountName
                  ),
                account.regions
              )
            : [],
        accounts
      )
    ;

  return (
    <SpaceBetween direction='vertical' size='l'>
      <GettingStartedAccountTable
        trackBy='id'
        rows={getRows()}
        columns={columns}
        sortColumn={'region'}
        pageSize={pageSize}
        selectionType='multi'
        selectedItems={selected}
        onSelectionChange={(item) => setSelected(item)}
      />
    </SpaceBetween>
  );
};
