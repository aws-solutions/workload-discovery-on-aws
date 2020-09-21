import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
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
    height: '18px'
  },
  label: {
    color: '#545b64',
    margin: 'auto',
    fontSize: '0.75rem',
    background: '#fff',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontWeight: 400,
  },
  chip: {
      fontSize: '0.6rem',
      background: '#d13212',
      color: '#fff',
      marginLeft: '1rem',
      height: '18px',
      margin: 0
  }
}));

export default ({ label, count }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography classes={{ root: classes.label }}>{label}</Typography>
      <Chip classes={{root: classes.chip}} size='small' label={count} />
    </div>
  );
};
