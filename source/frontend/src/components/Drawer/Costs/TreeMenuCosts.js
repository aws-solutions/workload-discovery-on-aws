import React from 'react';
import { useGraphState } from '../../Contexts/GraphContext';
import TreeMenuCostsMenu from './TreeMenuCostsMenu';
import { ExpandableSection } from '@awsui/components-react';

export default ({ compound }) => {
  const [expanded, setExpanded] = React.useState([]);
  const [{ cy }, dispatch] = useGraphState();

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  return (
    <>
      <ExpandableSection
        className='first-level'
        variant='navigation'
        header='Costs & Usage'>
        <TreeMenuCostsMenu />
      </ExpandableSection>
    </>
  );
};
