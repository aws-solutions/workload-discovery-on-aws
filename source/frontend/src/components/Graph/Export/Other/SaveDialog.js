import React from 'react';
import { saveAs } from 'file-saver';
import {
  Modal,
  Box,
  Button,
  SpaceBetween,
  Input,
  FormField,
  Form,
} from '@awsui/components-react';
import PropTypes from 'prop-types';

const validFilename = require('valid-filename');

const SaveDialog = ({ title, blob, toggleDialog }) => {
  const [filename, setFilename] = React.useState('');
  const [error, setError] = React.useState(false)

  const exportView = () => {
    if(validFilename(filename)) {
      setError(false)
      saveAs(blob, filename);
      toggleDialog();
    } else {
      setError(true)
    }
  };

  return (
    <Modal
      onDismiss={toggleDialog}
      visible={true}
      closeAriaLabel='Close modal'
      size='medium'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={toggleDialog} variant='link'>
              Close
            </Button>
            <Button
              variant='primary'
              iconName='download'
              onClick={exportView}>
              Download
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={title}>
      <SpaceBetween direction='vertical' size='l'>
        <Form>
          <FormField label='File name' errorText={error ? "Please enter a valid file name" : null} description='Provide a name for the export'>
            <Input
              value={filename}
              invalid={error} 
              onChange={({ detail }) => setFilename(detail.value)}              
            />
          </FormField>
        </Form>
      </SpaceBetween>
    </Modal>
  );
};

SaveDialog.propTypes = {
  title: PropTypes.string.isRequired,
  blob: PropTypes.object.isRequired,
  toggleDialog: PropTypes.bool.isRequired,
};

export default SaveDialog;
