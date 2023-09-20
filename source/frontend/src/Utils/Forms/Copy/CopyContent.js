// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Popover, StatusIndicator, Button } from '@cloudscape-design/components';
import PropTypes from 'prop-types';

const CopyContent = ({ componentId }) => {
  return (
    <Popover
      size='small'
      position='top'
      triggerType='custom'
      dismissButton={false}
      content={
        <StatusIndicator type='success'>
          Copied successfully
        </StatusIndicator>
      }>
      <Button
        iconName='copy'
        onClick={() => {
          const text = document.getElementById(componentId);
          navigator.clipboard.writeText(text.innerText);
        }}>    
        Copy    
      </Button>
    </Popover>
  );
};

CopyContent.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default CopyContent;
