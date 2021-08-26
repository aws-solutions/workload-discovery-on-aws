import * as React from 'react';
import Tabs from '@awsui/components-react/tabs';

import AccountImportWizard from './CloudFormation/AccountImportWizard';
import AccountImportStackSetsWizard from './StackSets/AccountImportStackSetsWizard';
import PropTypes from 'prop-types';
import { SpaceBetween } from '@awsui/components-react';
import DiscoverableAccountsAndRegionsTable from './DiscoverableAccountsAndRegionsTable';
import AccountAndRegionTabs from './AccountAndRegionTabs';

const AccountTabs = ({ reloadTable }) => {
  return (
    <Tabs
      variant='default'
      tabs={[
        {
          label: 'AWS CloudFormation',
          id: '0',
          content: <AccountAndRegionTabs reloadTable={reloadTable} />,
        },
        {
          label: 'AWS CloudFormation StackSets',
          id: '1',
          content: (
            <SpaceBetween direction='vertical' size='l'>
              <DiscoverableAccountsAndRegionsTable refresh={reloadTable} />
            </SpaceBetween>
          ),
        },
      ]}
    />
  );
};

AccountTabs.propTypes = {
  reloadTable: PropTypes.func.isRequired,
};

export default AccountTabs;
