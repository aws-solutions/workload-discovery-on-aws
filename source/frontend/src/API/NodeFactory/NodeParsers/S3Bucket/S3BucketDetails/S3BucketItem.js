import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Container,
  ColumnLayout,
  SpaceBetween,
  ExpandableSection,
} from '@awsui/components-react';

export default ({ connectedCount }) => {
  const ValueWithLabel = ({ label, children }) => (
    <div>
      <Box margin={{ bottom: 'xxxs' }} color='text-label'>
        {label}
      </Box>
      <div>{children}</div>
    </div>
  );

  return (
    <ColumnLayout columns={1} variant='text-grid'>
      <SpaceBetween size='l'>
        <ValueWithLabel label='Related resources'>
          {connectedCount}
        </ValueWithLabel>
      </SpaceBetween>
    </ColumnLayout>
  );
};
