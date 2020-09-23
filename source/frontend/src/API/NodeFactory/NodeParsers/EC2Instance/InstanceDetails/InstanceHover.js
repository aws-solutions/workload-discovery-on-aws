import React from 'react';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  item: {
    fontSize: '0.75rem',
    color: '#535B63',
    lineHeight: '2rem'
  },
  div: {
    display: 'grid'
  },
  divInline: {
    display: 'inline-flex'
  },
  title: {
    color: '#535B63',
    fontSize: '1rem',
    lineHeight: '2rem',
    marginBottom: '.5rem'
  },
  effectTitle: {
    color: '#535B63',
    fontSize: '0.75rem',
    lineHeight: '2rem',
    marginBottom: '.5rem',
    marginLeft: '1vw'
  },
  effectItem: {
    fontSize: '0.75rem',
    marginLeft: '1vw',
    lineHeight: '2rem',
    marginBottom: '.5rem'
  },
  image: { width: 16, marginLeft: '1vw', marginBottom: '.5rem' }
}));

export default ({ statement, resourceStatus, actionStatus }) => {
  return (
    <div className={classes.div}>
      <span className={classes.title}>Statement</span>
      <div className={classes.div}>
        <div className={classes.divInline}>
          <span className={classes.effectTitle}>Effect</span>
          <span className={classes.effectItem}>
            {statement.Effect}
          </span>
        </div>
        <div className={classes.divInline>
          <span className={classes.effectTitle}>
            Actions
          </span>
          <img
            src={fetchImage(actionStatus.status)}
            className={classes.image}
          />
        </div>
        <div className={classes.divInline}>
          <span className={classes.effectTitle}>
            Resources
          </span>
          <img
            src={fetchImage(resourceStatus.status)}
            className={classes.image}
          />
        </div>
      </div>
    </div>
  );
};
