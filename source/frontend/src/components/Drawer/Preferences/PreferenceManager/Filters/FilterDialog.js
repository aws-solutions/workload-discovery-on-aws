import React from 'react';

import FilterTabController from './FilterTabController';
import { Button, Modal, Box, SpaceBetween, Header } from '@awsui/components-react';
import PropTypes from 'prop-types';

const FilterDialog = ({ toggleDialog }) => {

  return (
    <Modal
      onDismiss={toggleDialog}
      visible={true}
      closeAriaLabel='Close modal'
      size='max'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={toggleDialog} variant='link'>
              Close
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={<Header
      description="Focus on important resources by applying type and Region filters."
        variant='h2'>
        Filters
      </Header>}>
      <FilterTabController />
    </Modal>
  );
};

FilterDialog.propTypes = {
  toggleDialog: PropTypes.func.isRequired,
};

export default FilterDialog;
