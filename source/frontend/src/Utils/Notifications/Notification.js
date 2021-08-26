import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@awsui/components-react/badge';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    justifyContent: 'center',
    // flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  label: {
    color: '#545b64',
    margin: 'auto',
    fontSize: '1.2rem',
    background: '#fff',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontWeight: 400,
  },
}));

export default ({ label, count }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography classes={{ root: classes.label }}>{label}</Typography>
      <Badge color='blue'>{count}</Badge>
    </div>
  );
};
