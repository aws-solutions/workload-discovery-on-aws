import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  item: {
    fontSize: '1.2rem',
    color: '#535B63',
    lineHeight: '2rem'
  },
  div: {
    display: 'grid'
  },
  title: {
    color: '#535B63',
    fontSize: '1.7rem',
    lineHeight: '2rem'
  }
}));

export default ({ name }) => {

  const classes = useStyles();
  return (
    <div className={classes.div}>
      <span className={classes.title}>Endpoint Name</span>
      <span className={classes.item}>{name}</span>
    </div>
  );
};
