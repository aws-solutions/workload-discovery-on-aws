import React from 'react';
import { useGraphState } from '../../Contexts/GraphContext';
import { Button } from '@awsui/components-react';

export default () => {
  const [expanded, setExpanded] = React.useState([]);
  const [{ cy }, dispatch] = useGraphState();

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeId) => {
    dispatch({
      type: 'clearGraph',
    });
  };

  return (
    <Button variant='link' onClick={handleSelect} className='sidepanel-button'>
      Clear graph
    </Button>
  );
};
