import React, { useState } from 'react';

import { ExpandableSection, ColumnLayout } from '@awsui/components-react';
import TreeMenuAccountSettingsMenu from './AccountManagement/Account/TreeMenuAccountSettingsMenu';
import TreeMenuCostSettingsMenu from './Costs/TreeMenuCostSettingsMenu';

export default () => {
  return (
    <>
      <ExpandableSection
        className='first-level'
        variant='navigation'
        header='Settings'>
        <ColumnLayout columns={1} disableGutters>
          <TreeMenuAccountSettingsMenu />
          <TreeMenuCostSettingsMenu />
        </ColumnLayout>
      </ExpandableSection>
    </>
  );
};
