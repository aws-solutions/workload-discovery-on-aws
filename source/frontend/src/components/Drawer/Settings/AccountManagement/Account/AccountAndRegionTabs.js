import * as React from 'react';
import Tabs from '@awsui/components-react/tabs';

import AccountImportWizard from './CloudFormation/AccountImportWizard';
import AccountImportStackSetsWizard from './StackSets/AccountImportStackSetsWizard'
import PropTypes from 'prop-types';


const AccountAndRegionTabs = ({reloadTable}) => {
  return (
    <Tabs
      variant='default'
      tabs={[        
        {
          label: 'AWS CloudFormation StackSets',
          id: '0',
          content: <AccountImportStackSetsWizard reloadTable={reloadTable}/>,
        },
        {
          label: 'AWS CloudFormation',
          id: '1',
          content: <AccountImportWizard reloadTable={reloadTable}/>,
        },
      ]}
    />
  );
};

AccountAndRegionTabs.propTypes = {
  reloadTable: PropTypes.func.isRequired,
};

export default AccountAndRegionTabs;
