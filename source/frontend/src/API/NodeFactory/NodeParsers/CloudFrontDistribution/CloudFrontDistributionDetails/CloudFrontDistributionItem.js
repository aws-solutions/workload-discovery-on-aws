import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ResourceItem from '../../../../../components/Graph/DetailsDialog/ResourceItem';
import Grid from '@material-ui/core/Grid';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Link from '@material-ui/core/Link';
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
  externalIcon: {
    width: '18px',
    marginLeft: '4px',
    verticalAlign: 'bottom',
    color: '#0073bb'
  },
  link: {
    color: '#0073bb',
  },
}));

export default ({ title, configuration }) => {
  const classes = useStyles();
  const parsedConfig = JSON.parse(configuration);

  const ExternalConsoleLink = (props) => (
    <Link
      classes={{ root: classes.link }}
      href={props.url}
      // onClick={preventDefault}
      variant='body2'
      target='_blank'
      rel='noreferrer'>
      {props.text}
      <OpenInNew className={classes.externalIcon} />
    </Link>
  );

  return (
    <div className={classes.root}>
      <span className={classes.title}>{title}</span>
      <Divider className={classes.divider} />

      <div className={classes.root}>
        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Domain Name'
              resource={
                <ExternalConsoleLink
                  url={`https://${parsedConfig.domainName}`}
                  text={parsedConfig.domainName}
                />
              }
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Certificate Source'
              resource={
                parsedConfig.distributionConfig.viewerCertificate
                  .certificateSource
              }
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Default Root Object'
              resource={parsedConfig.distributionConfig.defaultRootObject}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Smooth Streaming'
              resource={`${parsedConfig.distributionConfig.defaultCacheBehavior.smoothStreaming}`}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Viewer Protocol Policy'
              resource={
                parsedConfig.distributionConfig.defaultCacheBehavior
                  .viewerProtocolPolicy
              }
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='Access Logging Enabled'
              resource={`${parsedConfig.distributionConfig.logging.enabled}`}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container className={classes.gridParent}>
          <Grid item xs>
            <ResourceItem
              title='Price Class'
              resource={parsedConfig.distributionConfig.priceClass}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='IPV6 Enabled'
              resource={`${parsedConfig.distributionConfig.isIPV6Enabled}`}
              titleStyle={classes.resourceItemTitleStyle}
              valueStyle={classes.resourceItemValueStyle}
            />
          </Grid>
          <Grid item xs>
            <ResourceItem
              title='WAF WebACL Attached'
              resource={parsedConfig.distributionConfig.webACLId ? 'true' : 'false'}
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
