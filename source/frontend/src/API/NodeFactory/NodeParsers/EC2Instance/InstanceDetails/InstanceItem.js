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
              title='Architecture'
              resource={parsedConfig.architecture}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='AMI'
              resource={parsedConfig.imageId}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Instance Type'
              resource={parsedConfig.instanceType}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Private DNS'
              resource={parsedConfig.privateDnsName}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>

          <Grid item xs>
            <ResourceItem
              title='Private IP'
              resource={parsedConfig.privateIpAddress}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>

          <Grid item xs>
            <ResourceItem
              title='Public DNS'
              resource={parsedConfig.publicDnsName}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
        </Grid>
        <Divider className={classes.divider} />

        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Public IP'
              resource={parsedConfig.publicIpAddress}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Monitoring'
              resource={parsedConfig.monitoring.state}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Platform'
              resource={parsedConfig.platform}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
        </Grid>
        <Divider className={classes.divider} />

        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='CPU Cores'
              resource={parsedConfig.cpuOptions.coreCount}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='CPU Threads Per Core'
              resource={parsedConfig.cpuOptions.threadsPerCore}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Launched'
              resource={parsedConfig.launchTime}
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
