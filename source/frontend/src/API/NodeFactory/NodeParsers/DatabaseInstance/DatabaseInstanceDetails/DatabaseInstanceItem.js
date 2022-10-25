import React from 'react';
import {
  Box,
  ColumnLayout,
  SpaceBetween,
} from '@awsui/components-react';

const parseConfiguration = (configuration) => {
  try {
    return JSON.parse(JSON.parse(configuration));
  } catch (Error) {
    return JSON.parse(configuration);
  }
};

export const DatabaseInstanceItem = ({ configuration }) => {
  const parsedConfig = parseConfiguration(configuration);

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
        <ValueWithLabel label='Engine'>
          {`${parsedConfig.engine} - ${parsedConfig.engineVersion}`}
        </ValueWithLabel>
        <ValueWithLabel label='Instance class'>
          {parsedConfig.dBInstanceClass}
        </ValueWithLabel>
        <ValueWithLabel label='Database name'>
          {parsedConfig.dBName}
        </ValueWithLabel>
        <ValueWithLabel label='Backup window'>
          {parsedConfig.preferredBackupWindow}
        </ValueWithLabel>
        <ValueWithLabel label='Maintainance window'>
          {`${parsedConfig.preferredMaintenanceWindow}`}
        </ValueWithLabel>
      </SpaceBetween>
      <SpaceBetween size='l'>
        <ValueWithLabel label='Certificate'>
          {parsedConfig.cACertificateIdentifier}
        </ValueWithLabel>
        <ValueWithLabel label='Storage encrypted'>
          {`${parsedConfig.storageEncrypted}`}
        </ValueWithLabel>
        <ValueWithLabel label='Endpoint'>
          {parsedConfig.endpoint
            ? `${parsedConfig.endpoint.address}:${parsedConfig.endpoint.port}`
            : ''}
        </ValueWithLabel>
        <ValueWithLabel label='Latest restorable time'>
          {parsedConfig.latestRestorableTime}
        </ValueWithLabel>
      </SpaceBetween>
    </ColumnLayout>
  );
};

export default DatabaseInstanceItem;
