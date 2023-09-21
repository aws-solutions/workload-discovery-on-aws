// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Box
} from '@cloudscape-design/components';
import PropTypes from 'prop-types';

const ValueWithLabel = ({ label, children }) => (
    <div>
      <Box margin={{ bottom: 'xxxs' }} color='text-label'>
        {label}
      </Box>
      <div>{children}</div>
    </div>
  );
  
  ValueWithLabel.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.object
  }

  export default ValueWithLabel;