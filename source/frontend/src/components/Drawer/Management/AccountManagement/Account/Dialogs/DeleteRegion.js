import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {DialogTitle} from '../../../../../../Utils/Dialog/DialogTitle';
import {useImportConfigState } from '../../../../../Contexts/ImportDataContext';
import { deleteRegionOrAccount } from '../../../../../Actions/ImportActions';

const useStyles = makeStyles(theme => ({
  root: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  button: {
    margin: theme.spacing(1),
    width: '15%',
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
      borderColor: '#dd6b10'
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10'
    }
  },
  clearButton: {
    width: '15%',
    margin: '1vh 0',
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
      outline: 'none'
    }
  },
  title: {
    backgroundColor: '#fafafa',
    fontSize: '1rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif'
  },
  content: {
    backgroundColor: '#fff',
    fontSize: '1rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif'
  }
}));

export default ({ itemToDelete, closeDialog }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    closeDialog();
  };

  const removeDeletedRegion = importedConfiguration => {
    return importedConfiguration.map(account => {
      if (account.accountId === itemToDelete.accountId) {
        account.regions = account.regions.filter(
          region => region !== itemToDelete.region
        );
      }
      return account;
    });
  };

  const deleteRegion = () => {
    importConfig.importConfiguration.importAccounts = removeDeletedRegion(
      importConfig.importConfiguration.importAccounts
    );

    deleteRegionOrAccount({
      currentConfiguration: importConfig.importConfiguration
    });
    handleClose();
  };

  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'>
        <DialogTitle onClose={() => handleClose()}>
          Remove Region
        </DialogTitle>
        <DialogContent>
          <DialogContentText classes={{ root: classes.content }}>
            {`Stop Perspective importing data from ${itemToDelete.region} in ${itemToDelete.accountId}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose(false)}
            className={classes.clearButton}>
            No
          </Button>
          <Button onClick={() => deleteRegion()} className={classes.button}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
