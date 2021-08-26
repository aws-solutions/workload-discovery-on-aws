import React from 'react';
import { Box, SpaceBetween, StatusIndicator } from '@awsui/components-react';
import PropTypes from 'prop-types';

const R = require('ramda')
const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box margin={{ bottom: 'xxxs' }} color="text-label">
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

const QueryDetails = ({queryDetails}) => (
    <SpaceBetween size="l">
      <ValueWithLabel label="Athena cost">{R.isEmpty(queryDetails) ? `$0` : `$${queryDetails.cost}`}</ValueWithLabel>
      <ValueWithLabel label="Data scanned (Mb)">
        {R.isEmpty(queryDetails) ? '0' : queryDetails.dataScannedInMB}
      </ValueWithLabel>
    </SpaceBetween>
    
);

QueryDetails.propTypes = {
    queryDetails: PropTypes.object.isRequired
  };
  
  export default QueryDetails;