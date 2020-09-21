import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchMetadata } from '../Actions/ImportActions';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  colorPrimary: {
    color: '#fff'
  },
  paragraph: {
    // marginRight: '20px',
    fontSize: '0.75rem',
    // fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    margin: 'auto 0'
  }
}));

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <CircularProgress
          classes={{ colorPrimary: classes.colorPrimary }}
          size={20}
        />
    </div>
  );
}
