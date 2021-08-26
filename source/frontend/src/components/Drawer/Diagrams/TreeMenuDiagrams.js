import React from 'react';
import TreeMenuImportViewMenu from './ViewSelector/Graph/TreeMenuImportViewMenu';
import { ExpandableSection } from '@awsui/components-react';

export default () => {
  return (
    <>
      <ExpandableSection
        className='first-level'
        variant='navigation'
        header='Architecture diagrams'>
        <TreeMenuImportViewMenu />
      </ExpandableSection>
    </>
  );
};
