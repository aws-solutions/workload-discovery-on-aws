import React from 'react';
import TreeMenuResourceMenu from './TreeMenuResourceMenu';
import TreeMenuResourceTypeMenu from './TreeMenuResourceTypeMenu';
import { getResourceCount } from './MenuBuilder';
import { useResourceState } from '../../Contexts/ResourceContext';
import { ExpandableSection } from '@awsui/components-react';

const TreeMenuResources = () => {
  const [{ resources }, resourceDispatch] = useResourceState();

  return (
    <ExpandableSection
      defaultExpanded
      className='first-level'
      variant='navigation'
      header={`Resources (${getResourceCount(resources)})`}>
      <TreeMenuResourceMenu />
      <TreeMenuResourceTypeMenu />
    </ExpandableSection>
  );
};

export default TreeMenuResources
