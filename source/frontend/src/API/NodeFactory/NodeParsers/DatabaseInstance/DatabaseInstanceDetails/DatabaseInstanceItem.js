import React from 'react';
import {
  Box,
  Container,
  ColumnLayout,
  SpaceBetween,
  Header
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
    <Container header={<Header variant='h2'>DB Instance</Header>}>
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
    </Container>
  );
};
