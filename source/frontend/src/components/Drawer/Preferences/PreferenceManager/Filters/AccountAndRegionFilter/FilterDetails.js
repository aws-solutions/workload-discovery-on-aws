import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ResourceItem from '../../../../../../components/Graph/DetailsDialog/ResourceItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { getResourceCount, getResourceTypeCount } from '../../../../ResourceSelector/MenuBuilder';
import { useResourceState } from '../../../../../Contexts/ResourceContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'grid',
    width: '50%',
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

export default ({ }) => {
  const classes = useStyles();
  const [{resources}, dispatch] = useResourceState();
  return (
    <div className={classes.root}>
      <Grid container className={classes.gridParent}>
        <Grid item xs>
          <ResourceItem
            title='Resources'
            resource={`${getResourceCount(resources)}`}
            titleStyle={classes.resourceItemTitleStyle}
            valueStyle={classes.resourceItemValueStyle}
          />
        </Grid>
        <Grid item xs>
          <ResourceItem
            title='Resource Types'
            resource={`${getResourceTypeCount(resources)}`}
            titleStyle={classes.resourceItemTitleStyle}
            valueStyle={classes.resourceItemValueStyle}
          />
        </Grid>
      </Grid>
    </div>
  );
};
