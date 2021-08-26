import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {DialogTitle} from '../../../../../Utils/Dialog/DialogTitle';
import ResourceTable from '../ResourceGroup/ResourceTable';

export default ({ resources, toggleImportModal }) => {
  const [selectedNodes, setSelectedNodes] = useState([]);

  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%'
    },
    chip: {
      background: '#0073bb',
      color: '#fff',
      margin: theme.spacing(0.5)
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: '1vw',
      marginRight: '1vw',
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',

    },
    panel: {
      width: '100%'
    },
    paragraph: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    },
    import: {
      marginTop: '1vh',
      marginRight: '1vw',
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
      fontSize: '1.2rem',
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
    div: { display: 'inline-flex', width: '100%' }
  }));

  const classes = useStyles();

  return (
    <Dialog
      open={true}
      onClose={toggleImportModal}
      maxWidth={'lg'}
      fullWidth={true}
      scroll={'paper'}
      classes={{ paper: classes.dialogPaper }}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      aria-labelledby='form-dialog-title'>
      <DialogTitle onClose={() => toggleImportModal()}>Remove Nodes</DialogTitle>

      <DialogContent>
        <ResourceTable
          results={resources.filter(
            item => !item.edge && item.data.type === 'resource'
          )}
          groupNodes={false}
          selectedNodes={nodes => setSelectedNodes(nodes)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          size='small'
          className={classes.button}
          onClick={toggleImportModal}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
