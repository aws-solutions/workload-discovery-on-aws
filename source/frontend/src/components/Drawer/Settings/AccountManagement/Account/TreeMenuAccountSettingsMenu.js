import React, { useState } from 'react';

import AccountImportDialog from './AccountImportDialog';
import { Button } from '@awsui/components-react';

export default () => {
  const [accountDialog, setAccountDialog] = useState(false);

  const handleSelect = () => {
    setAccountDialog(!accountDialog);
  };

  return (
    <>
      <Button
        variant='link'
        onClick={handleSelect}
        className='sidepanel-button'>
        Imported Regions
      </Button>
      {accountDialog && (
        <AccountImportDialog
          startWithImportTab={false}
          toggleImportModal={handleSelect}
        />
      )}
    </>
  );
};
