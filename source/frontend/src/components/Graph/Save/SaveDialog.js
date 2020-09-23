import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormField from '../../../Utils/Forms/FormField';
import FormGroup from '@material-ui/core/FormGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogTitle } from '../../../Utils/Dialog/DialogTitle';
import { saveAs } from 'file-saver';
import { filenameValidator } from '../../../Utils/Validators/FilenameValidator';

const styles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: '250px',
    width: '450px',
  },
  actions: {
    borderTop: '1px solid #eaeded',
    padding: '0 1%',
  },
  header: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fafafa',
  },
  root: {
    marginTop: '2vh',
    marginBottom: '2vh',
  },
  singleButton: {
    width: '15%',
    marginTop: '1vh',
    marginBottom: '1vh',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    float: 'right',
    // position: 'absolute',
    // right: '0',
    // top: '0',
    cursor: 'pointer',
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  button: {
    // width: '15%',
    margin: '1%',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  clearButton: {
    // width: '15%',
    margin: '1%',
    backgroundColor: '#fff',
    // borderColor: '#000',
    color: '#000',
    // borderRadius: '2px',
    // border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#fafafa',
      // borderColor: '#000'
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#fafafa',
      // borderColor: '#000'
    },
    '&:focus': {
      outline: 'none',
    },
  },
  div: { display: 'grid' },
}));

export default ({ title, blob, toggleDialog }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(true);
  const [filename, setFilename] = useState(undefined);
  const [filenameError, setFilenameError] = useState(false);
  const [filenameHelperText, setFilenameHelperText] = useState(undefined);

  const classes = styles();

  const exportView = () => {
    saveAs(blob, filename);
    toggleDialog();
  };

  const handleFilename = (input) => {
    const validation = filenameValidator(input.target.value);
    setFilenameError(!validation.valid);
    setFilenameHelperText(validation.reason);
    setFilename(validation.valid ? validation.input : undefined);
  };

  return (
    <Dialog
      open={showSaveDialog}
      onClose={() => toggleDialog}
      maxWidth={'md'}
      scroll={'paper'}
      classes={{ paper: classes.dialogPaper }}
      aria-labelledby='form-dialog-title'>
      <DialogTitle onClose={() => toggleDialog()}>{title}</DialogTitle>
      <DialogContent>
        <div className={classes.div}>
          <FormGroup>
            <FormField
              autoFocus
              onInput={(input) => handleFilename(input)}
              label='File name'
              description='Give your architecture diagram a name...'
              width='100%'
              error={filenameError}
              helper={filenameHelperText}
            />
          </FormGroup>
        </div>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button className={classes.clearButton} onClick={() => toggleDialog()}>
          Close
        </Button>
        <Button
          disabled={!filename}
          className={classes.button}
          onClick={exportView}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};
