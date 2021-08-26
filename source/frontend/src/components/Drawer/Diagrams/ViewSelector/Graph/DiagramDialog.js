import React, { useState, useRef, useEffect } from 'react';

import {Modal, Box, SpaceBetween, Button } from '@awsui/components-react';
import DiagramTabController from './DiagramTabController';
import { removeObject } from '../../../../../API/Storage/S3Store';

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
      header='Save & load architecture diagrams'>
      <DiagramTabController toggleDialog={() => toggleImportModal()} />
    </Modal>
  );
};
