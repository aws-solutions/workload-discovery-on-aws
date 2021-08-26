import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Container,
  ColumnLayout,
  SpaceBetween,
  ExpandableSection,
} from '@awsui/components-react';

export default ({ configuration }) => {
  const parsedConfig = JSON.parse(JSON.parse(configuration));

  const ValueWithLabel = ({ label, children }) => (
    <div>
      <Box margin={{ bottom: 'xxxs' }} color='text-label'>
        {label}
      </Box>
      <div>{children}</div>
    </div>
  );

  return (
    <ColumnLayout columns={2} variant='text-grid'>
      <SpaceBetween size='l'>
        <ValueWithLabel label='Scheme'>{parsedConfig.scheme}</ValueWithLabel>
      </SpaceBetween>
      <SpaceBetween size='l'>
        <ValueWithLabel label='Type'>{parsedConfig.type ? parsedConfig.type : 'Classic'}</ValueWithLabel>
      </SpaceBetween>
    </ColumnLayout>
  );
};
