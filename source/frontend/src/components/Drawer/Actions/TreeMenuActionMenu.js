import React from 'react';

import { useGraphState } from '../../Contexts/GraphContext';
import TreeMenuClearGraphMenu from './TreeMenuClearGraphMenu';
import TreeMenuExportMenu from './TreeMenuExportMenu';
import { ExpandableSection } from '@awsui/components-react';

export default () => {
  const [{ cy }] = useGraphState();

  return (
    <ExpandableSection
      className='first-level'
      variant='navigation'
      header='Actions'>
      <TreeMenuExportMenu compound={cy} />
      <TreeMenuClearGraphMenu />
    </ExpandableSection>
  );
};
