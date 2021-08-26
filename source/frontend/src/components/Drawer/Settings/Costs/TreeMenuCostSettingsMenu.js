import React, { useState } from 'react';

import CostDialog from './CostDialog';
import { Button } from '@awsui/components-react';

export default () => {
  const [costDialog, setCostDialog] = useState(false);

  const handleSelect = () => {
    setCostDialog(!costDialog);
  };

  return (
    <>
      <Button
        variant='link'
        onClick={handleSelect}
        className='sidepanel-button'>
        Cost
      </Button>
      {costDialog && <CostDialog toggleImportModal={handleSelect} />}
    </>
  );
};
