import React from 'react';
import { fetchImage } from '../../../Utils/ImageSelector';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  item: {
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    marginLeft: '0.5vw'
  },
  div: {
    display: 'grid'
  },
  title: {
    color: '#535B63',
    fontSize: '1rem',
    lineHeight: '2rem',
    marginBottom: '.5rem'
  },
  image: { width: 16 },
  notState: {
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    marginLeft: '0.5vw'
  }
}));

export default ({ title, state }) => {
  const classes = useStyles();

  return (
    <div className={classes.div}>
      <span className={classes.title}>{title}</span>
      {state && (
        <span className='resourceState'>
          <img
            alt={'Resource State'}
            src={fetchImage(undefined, state)}
            className={classes.image}
          />
          <span className={classes.item}>{state.text}</span>
        </span>
      )}
      {!state && (
        <span className={classes.notState}>
          ...
        </span>
      )}
    </div>
  );
};
