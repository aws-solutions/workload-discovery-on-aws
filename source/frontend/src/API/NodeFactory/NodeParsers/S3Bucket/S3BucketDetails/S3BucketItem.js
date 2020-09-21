import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ResourceItem from '../../../../../components/Graph/DetailsDialog/ResourceItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'grid',
    width: '100%',
  },
  resources: {
    // flexGrow: 1,
    display: 'inline-flex',
    marginLeft: '1vw',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    fontSize: '0.5rem',
  },
  divider: {
    marginTop: '2vh',
    marginBottom: '2vh',
  },
  gridParent: {
    paddingLeft: '1vw',
    paddingRight: '1vw',
  },
  title: {
    color: '#535B63',
    fontSize: '1.25rem',
    lineHeight: '2rem',
    marginBottom: '.5rem',
  },
  resourceItemTitleStyle: {
    color: '#535B63',
    fontSize: '1rem',
    lineHeight: '2rem',
    marginBottom: '.5rem',
  },
  resourceItemValueStyle: { fontSize: '0.75rem', marginLeft: '.5vw' },
}));

export default ({ title, connectedCount }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span className={classes.title}>{title}</span>
      <Divider className={classes.divider} />

      <div className={classes.root}>
        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Related Resources'
              resource={connectedCount}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
        </Grid>

        <Divider className={classes.divider} />
      </div>
    </div>
  );
};
