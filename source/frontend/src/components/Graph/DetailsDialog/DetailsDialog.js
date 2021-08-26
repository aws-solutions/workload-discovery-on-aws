import React, { useState } from 'react';
import {
  Modal,
  Box,
  SpaceBetween,
  Button,
  Grid,
} from '@awsui/components-react';
import ResourceDetailsPanel from './ResourceDetailsPanel';

export default ({ selectedNode }) => {
  const [showMoreDetailsModal, setShowMoreDetailsModal] = useState(true);

  return (
    <Modal
      onDismiss={() => setShowMoreDetailsModal(false)}
      visible={showMoreDetailsModal}
      closeAriaLabel='Close modal'
      size='large'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button
              onClick={() => setShowMoreDetailsModal(false)}
              variant='link'>
              Close
            </Button>
            {selectedNode.data('properties').loginURL && (
              <Button
                iconAlign='right'
                iconName='external'
                target='_blank'
                href={selectedNode.data('properties').loginURL}>
                View in Console
              </Button>
            )}
          </SpaceBetween>
        </Box>
      }
      header={
        selectedNode.data('title').length > 64
          ? `${selectedNode.data('title').substring(0, 64)}...`
          : selectedNode.data('title')
      }>
      <ResourceDetailsPanel selectedNode={selectedNode} />
    </Modal>
  );
};
