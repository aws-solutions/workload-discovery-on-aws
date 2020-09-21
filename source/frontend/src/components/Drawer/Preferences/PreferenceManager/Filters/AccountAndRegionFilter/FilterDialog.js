import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {DialogTitle} from '../../../../../../Utils/Dialog/DialogTitle';
import { useGraphState } from '../../../../../Contexts/GraphContext';
import FilterTabController from '../FilterTabController';
import { listObjects, getObject } from '../../../../../../API/Storage/S3Store';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  actions: {
    borderTop: '1px solid #eaeded',
    padding: '0 1%'
  },
  chip: {
    background: '#0073bb',
    color: '#fff',
    margin: theme.spacing(0.5)
  },
  header: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fafafa'
  },
  panel: {
    width: '100%',
    height: '95%'
  },
  paragraph: {
    fontSize: '0.75rem',
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif'
  },
  import: {
    marginTop: '1%',
    marginRight: '1%',
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  button: {
    // width: '15%',
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
      borderColor: '#dd6b10'
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  clearButton: {
    // width: '15%',
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
      backgroundColor: '#fafafa'
      // borderColor: '#000'
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#fafafa'
      // borderColor: '#000'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  detail: {
    marginLeft: '1%',
    color: '#687078'
  },
  image: {
    width: 20
  },
  dialog: {
    height: '980px'
  },
  tableIcon: { fontSize: '0.75rem', width: '5%' },
  columnHeader: { fontSize: '0.75rem', width: '5%' },
  margin: { margin: '1% 0 1% 0' },
  div: { display: 'inline-flex', padding: '1vh', width: '100%' },
  content: { padding: 0}
}));

export default ({ toggleDialog }) => {
  
  const classes = useStyles();

  return (
    <Dialog
      open={true}
      onClose={toggleDialog}
      maxWidth={'lg'}
      fullWidth={true}
      scroll={'paper'}
      classes={{ paper: classes.dialog  }}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      aria-labelledby='form-dialog-title'>
      <DialogTitle onClose={() => toggleDialog()}>Filters</DialogTitle>
      <DialogContent classes={{root: classes.content}}>
        <FilterTabController />     
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          size='small'
          className={classes.clearButton}
          onClick={toggleDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
