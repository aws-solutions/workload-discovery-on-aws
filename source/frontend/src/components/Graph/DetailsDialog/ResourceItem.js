import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  item: {
    textTransform: 'capitalize',
    fontSize: '1.2rem',
    marginLeft: '0.5vw',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  div: {
    display: 'grid',
    width: '100%'
  },
  title: {
    color: '#535B63',
    fontSize: '1.7rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    lineHeight: '2rem',
    marginBottom: '.5rem'
  },
  image: { width: 16 },
  notState: {
    textTransform: 'capitalize',
    fontSize: '1.2rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    marginLeft: '0.5vw'
  }
}));

export default ({ title, resource, titleStyle, valueStyle }) => {
  const classes = useStyles();
  return (
    <div className={classes.div}>
      <span className={titleStyle}>{title}</span>
      <span className={valueStyle}>{resource}</span>
    </div>
  );
};
