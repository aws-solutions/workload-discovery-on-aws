import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StatementResource from './StatementResource';
import StatementActions from './StatementActions';
import StatementEffect from './StatementEffect';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'grid',
    width: '100%',
  },
  resources: {
    // flexGrow: 1,
    display: 'inline-flex'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    fontSize: '0.5rem'
  },
  divider: {
    marginTop: '1vh',
    marginBottom: '1vh'
  },
  titleDivider: {
    marginTop: '2vh',
    marginBottom: '2vh'
  },
  title:{
    color: '#535B63',
          fontSize: '1.25rem',
          lineHeight: '2rem'
  }
}));

export default ({ title, statement }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span className={classes.title}>
        {title}
      </span>
      <Divider className={classes.titleDivider} />

      <div className={classes.root}>
        <StatementEffect title='Effect' resource={statement.Effect} />
        <Divider className={classes.divider} />
        <div className={classes.resources}>
          <StatementActions title='Actions' actions={statement.Action instanceof Array ? statement.Action : [statement.Action]} />
          <StatementResource title='Resources' resources={statement.Resource instanceof Array ? statement.Resource : [statement.Resource]} />
        </div>
        <Divider className={classes.divider} />
      </div>
    </div>
  );
};
