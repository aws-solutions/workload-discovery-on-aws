import React from 'react';
import { Modal, Box, Button, SpaceBetween } from '@awsui/components-react';
import CostSettings from './CostSettings';

export default ({ toggleImportModal }) => {
  return (
    <Modal
      onDismiss={toggleImportModal}
      visible={true}
      closeAriaLabel='Close modal'
      size='large'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={toggleImportModal} variant='link'>
              Close
            </Button>
          </SpaceBetween>
        </Box>
      }
      header='Costs'>
      <CostSettings />
    </Modal>
  );
};
