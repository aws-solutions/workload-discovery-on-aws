import React from 'react';
import {
  Modal,
  Box,
  Button,
  SpaceBetween,
  Header,
  ExpandableSection,
  Grid,
  Container,
} from '@awsui/components-react';
import Welcome from './Welcome';
import PropTypes from 'prop-types';
import DiscoverableAccountsAndRegionsTable from './DiscoverableAccountsAndRegionsTable';
import AccountImportWizard from './CloudFormation/AccountImportWizard';
import ImportMessage from './ImportMessage';
import AccountAndRegionTabs from './AccountAndRegionTabs';

const AccountImportDialog = ({ startWithImportTab, toggleImportModal }) => {
  const [imported, setImported] = React.useState(false);
  return (
    <Modal
      onDismiss={toggleImportModal}
      visible={true}
      closeAriaLabel='Close modal'
      size='max'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={toggleImportModal} variant='link'>
              Close
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={
        <Header variant='h2'>
          {startWithImportTab ? 'Getting Started' : 'Regions'}
        </Header>
      }>
      <Grid gridDefinition={[{ colspan: 5 }, { colspan: 7 }]}>
        <SpaceBetween direction='vertical' size='l'>
          {startWithImportTab && <Welcome />}
          {!startWithImportTab && <ImportMessage />}
          <DiscoverableAccountsAndRegionsTable refresh={imported} />
        </SpaceBetween>
        <Container>
          <AccountAndRegionTabs reloadTable={() => setImported(!imported)} />
        </Container>
      </Grid>
    </Modal>
  );
};

AccountImportDialog.propTypes = {
  startWithImportTab: PropTypes.bool.isRequired,
  toggleImportModal: PropTypes.func.isRequired,
};

export default AccountImportDialog;
