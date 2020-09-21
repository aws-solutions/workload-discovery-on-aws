import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useImportConfigState } from '../../../../Contexts/ImportDataContext';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogTitle } from '../../../../../Utils/Dialog/DialogTitle';
import { fetchImportConfiguration } from '../../../../Actions/ImportActions';
import CustomSnackbar from '../../../../../Utils/SnackBar/CustomSnackbar';
import AccountTabController from './AccountTabController';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#fff',
    height: '980px',
    padding: 0
  },
  actions: {
    borderTop: '1px solid #eaeded',
    padding: 0,
  },
  chip: {
    background: '#0073bb',
    color: '#fff',
    margin: theme.spacing(0.5),
  },
  header: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fafafa',
  },
  panel: {
    width: '100%',
    backgroundColor: '#fff',
  },
  paragraph: {
    fontSize: '0.75rem',
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  import: {
    marginTop: '1%',
    marginRight: '1%',
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  button: {
    margin: theme.spacing(1),
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
  },
  removebutton: {
    margin: theme.spacing(1),
    backgroundColor: '#fff',
    // borderColor: '#000',
    color: '#000',
    // borderRadius: '2px',
    // border: '1px solid',
    fontWeight: 700,
    display: 'table',
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
  titleDivider: {
    margin: '2% 0 0 0',
  },
  importConfig: {
    maxHeight: '80%',
    overflowY: 'scroll',
    padding: '1% !important',
  },
  divInline: { margin: '1%', display: 'inline-flex' },
  margin: { margin: '1%' },
  marginTop: { marginTop: '1%' },
  content: {
    padding: 0
  }
}));

export default ({ toggleImportModal }) => {
  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={true}
        onClose={toggleImportModal}
        maxWidth={'md'}
        fullWidth={true}
        scroll={'paper'}
        classes={{ paper: classes.root }}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        aria-labelledby='form-dialog-title'>
        <DialogTitle onClose={() => toggleImportModal()}>
          Account & Region Manager
        </DialogTitle>
        <DialogContent classes={{root: classes.content}}>
          <AccountTabController />
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            size='small'
            className={classes.removebutton}
            onClick={toggleImportModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {showError && (
        <CustomSnackbar
          vertical='bottom'
          horizontal='center'
          type='error'
          message='We could not load the account configuration. Refresh page to try again'
        />
      )}
    </div>
  );
};
