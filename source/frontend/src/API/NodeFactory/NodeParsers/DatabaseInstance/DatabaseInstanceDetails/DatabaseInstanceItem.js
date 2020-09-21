import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ResourceItem from '../../../../../components/Graph/DetailsDialog/ResourceItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'grid',
    width: '100%'
  },
  resources: {
    // flexGrow: 1,
    display: 'inline-flex',
    marginLeft: '1vw'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    fontSize: '0.5rem'
  },
  divider: {
    marginTop: '2vh',
    marginBottom: '2vh'
  },
  gridParent: {
    paddingLeft: '1vw',
    paddingRight: '1vw'
  },
  title: {
    color: '#535B63',
    fontSize: '1.25rem',
    lineHeight: '2rem',
    marginBottom: '.5rem'
  },
  resourceItemTitleStyle: {
    color: '#535B63',
    fontSize: '1rem',
    lineHeight: '2rem',
    marginBottom: '.5rem'
  },
  resourceItemValueStyle: { fontSize: '0.75rem', marginLeft: '.5vw' }
}));

export default ({ title, configuration }) => {
  const classes = useStyles();
  const parsedConfig = JSON.parse(configuration);

  return (
    <div className={classes.root}>
      <span className={classes.title}>
        {title}
      </span>
      <Divider className={classes.divider} />

      <div className={classes.root}>
        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Engine'
              resource={`${parsedConfig.engine} - ${parsedConfig.engineVersion}`}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Instance Class'
              resource={parsedConfig.dBInstanceClass}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='DB Name'
              resource={parsedConfig.dBName}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Certificate'
              resource={parsedConfig.cACertificateIdentifier}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Storage Encrypted'
              resource={`${parsedConfig.storageEncrypted}`}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Endpoint'
              resource={parsedConfig.endpoint ? `${parsedConfig.endpoint.address}:${parsedConfig.endpoint.port}` : ''}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
        </Grid>
        <Divider className={classes.divider} />

        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Backup Window'
              resource={parsedConfig.preferredBackupWindow}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Maintenance Window'
              resource={parsedConfig.preferredMaintenanceWindow}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Latest Restorable Time'
              resource={parsedConfig.latestRestorableTime}
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
