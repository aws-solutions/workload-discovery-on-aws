import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ImportAccount from '../Drawer/Management/AccountManagement/Account/ImportAccount';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogTitle } from '../../Utils/Dialog/DialogTitle';
import Button from '@material-ui/core/Button';
import CustomSnackbar from '../../Utils/SnackBar/CustomSnackbar';

import { useAccountsState } from '../Contexts/AccountsContext';
import {
  getAccounts,
  addAccount,
  addAccounts,
  wrapRequest,
} from '../../API/GraphQLHandler';

const styles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: '60vh',
    maxHeight: '90vh',
  },
  root: {
    marginTop: '2vh',
    marginBottom: '2vh',
  },
  actions: {
    borderTop: '1px solid #eaeded',
    padding: '0 1%',
    height: '25px',
  },
  header: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fafafa',
  },
  importGuide: {
    borderRadius: '2px',
    border: '1px solid #0073BC',
    background: '#F1FAF9',
    padding: '2%',
  },
  importConfig: {
    maxHeight: '80%',
    overflowY: 'scroll',
  },
  paragraph: {
    fontSize: '0.75rem',
    // fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    margin: 'auto 0',
  },
  import: {
    marginTop: '1vh',
    marginRight: '1vw',
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  or: {
    textAlign: 'center',
    verticalAlign: 'middle',
    display: 'table-cell',
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
  },
  button: {
    // width: '15%',
    marginLeft: '1%',
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
  divInline: { margin: '1%', display: 'inline-flex', width: '100%' },
  divTable: { height: '50px', width: '100%', display: 'table' },
  margin: { margin: '1%' },
  newAccountParagraph: {
    fontWeight: 'bold',
    marginBottom: '1%',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
}));

export default ({ toggleImportModal }) => {
  const [showError, setShowError] = useState(false);

  const classes = styles();

  const importCurrentPerspectiveAccount = () => {
    wrapRequest(addAccounts, {
      accounts: [
        {
          accountId: window.perspectiveMetadata.rootAccount,
          regions: [{ name: window.perspectiveMetadata.rootRegion }],
        },
      ],
    })
      .then(() => window.location.reload())
      .catch((err) => console.error('something went wrong'));
  };

  return (
    <div>
      <Dialog
        open={true}
        onClose={toggleImportModal}
        maxWidth={'md'}
        fullWidth={true}
        scroll={'paper'}
        classes={{ paper: classes.dialogPaper }}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        aria-labelledby='form-dialog-title'>
        <DialogTitle onClose={() => toggleImportModal()}>
          Getting Started
        </DialogTitle>
        <DialogContent>
          <div className={classes.divInline}>
            <Typography className={classes.paragraph}>
              You can import the resources that make up AWS Perspective running
              in Account:{' '}
              <strong>{window.perspectiveMetadata.rootAccount}</strong> and
              Region: <strong>{window.perspectiveMetadata.rootRegion}</strong>.
            </Typography>
            <Button
              size='small'
              className={classes.button}
              onClick={importCurrentPerspectiveAccount}>
              Import
            </Button>
          </div>
          <Divider />
          <div className={classes.divTable}>
            <p className={classes.or}>Or</p>
          </div>
          <Divider />
          <div className={classes.importConfig}>
            <ImportAccount />
          </div>
        </DialogContent>
        <DialogActions className={classes.actions}></DialogActions>
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
