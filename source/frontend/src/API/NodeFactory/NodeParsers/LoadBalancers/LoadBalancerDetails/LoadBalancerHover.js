import React from 'react';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  divider: {
    marginTop: '2vh',
    marginBottom: '2vh'
  },
  title: {
    color: '#535B63',
    fontSize: '1.7rem',
    lineHeight: '2rem'
  },
  item: {
    fontSize: '1.2rem',
    color: '#535B63',
    lineHeight: '2rem'
  },
  div:{
    display: 'grid'
  }
}));

export default ({ configuration }) => {
  const parsedConfig = JSON.parse(JSON.parse(configuration));
  const classes = useStyles();

  return (
    <div className={classes.div}>
      <span className={classes.title}>Type</span>
      <span className={classes.item}>
        {parsedConfig.type}
      </span>
      <Divider className={classes.divider} />

      <span className={classes.title}>
        Scheme
      </span>
      <span className={classes.item}>
        {parsedConfig.scheme}
      </span>
    </div>
  );
};
