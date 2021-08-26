import React, { useState } from 'react';

import GraphDialog from './DiagramDialog';
import { Button } from '@awsui/components-react';

export default () => {
  const [graphDialog, setGraphDialog] = useState(false);

  const handleSelect = () => {
    setGraphDialog(!graphDialog);
  };

  return (
    <>
      <Button
        variant='link'
        onClick={handleSelect}
        className='sidepanel-button'>
        Manage
      </Button>
      {graphDialog && <GraphDialog toggleImportModal={handleSelect} />}
    </>
  );
};
