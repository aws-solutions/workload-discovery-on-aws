import React from 'react';
import {
  SpaceBetween,
  Header,
  Container,
  HelpPanel,
  Box,
  StatusIndicator,
  ExpandableSection,
  TextContent,
} from '@awsui/components-react';
import { regionMap } from '../../../../../../Utils/Dictionaries/RegionMap';
import AccountImportTable from './AccountImportTable';
import PropTypes from 'prop-types';
import Flashbar from '../../../../../../Utils/Flashbar/Flashbar';

const R = require('ramda');

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
];

function createData(id, region, accountId, accountName) {
  return {
    id,
    region,
    accountId,
    accountName,
  };
}

const AccountImportReview = ({ error, regions }) => {
  const pageSize = 10;

  const getRows = () =>
    R.chain(
      (region) =>
        createData(
          `${region.accountId}-${region.name}`,
          R.find(R.propEq('id', region.name), regionMap).name,
          region.accountId,
          region.accountName
        ),
      regions
    );

  return (
    <SpaceBetween direction='vertical' size='l'>
      {error && (
        <Flashbar
          type='error'
          message={`Perspective could not complete the import process ${error.message}`}
        />
      )}

      <ExpandableSection header='FAQs'>
        <HelpPanel>
          <dl>
            <dt>How long will it take for my resources appear?</dt>
            <dd>
              AWS Perspective triggers a discovery process at 15 minutes past
              the hour e.g. 15:00, 15:15, 15:30, 15:45. You should see your
              resources appearing in the user interface a few minutes after the
              discovery process has executed.
            </dd>
            <br />
            <dt>Where can I see my resources?</dt>
            <dd>
              AWS Perspective user interface provides search functionality (top
              of the page) and a side menu with your resources broken down by
              type.
            </dd>
          </dl>
        </HelpPanel>
      </ExpandableSection>

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

AccountImportReview.propTypes = {
  regions: PropTypes.array.isRequired,
  error: PropTypes.object,
};

export default AccountImportReview;
