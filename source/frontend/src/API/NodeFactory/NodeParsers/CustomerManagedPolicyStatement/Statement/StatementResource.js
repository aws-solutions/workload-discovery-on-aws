import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { fetchImage } from '../../../../../Utils/ImageSelector';

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
    display: 'grid',
    width: '100%',
    height: '100%',
    marginTop: '1vh'
  },
  list: {
    // flexGrow: 1,
    display: 'grid',
    width: '100%',
    height: '100%'
    // marginTop: '1vh',
  },
  image: { width: 16, marginLeft: '1vw' },
  item: {
    padding: '1vh',
    wordWrap: 'break-word',
    fontSize: '0.75rem'
  },
  title: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    lineHeight: '2rem',
    marginLeft: '.5rem'
  }
}));

export default ({ title, resources }) => {
  const classes = useStyles();
  const warningResources = resource => resource.includes('*');
  const badResources = resource => resource === '*';

  const getColor = resource => {
    if (badResources(resource)) return '#D13212';
    else if (warningResources(resource)) return '#FF9900';
    else return '#1D8102';
  };

  const getStatus = resource => {
    if (badResources(resource)) return 'status-negative';
    else if (warningResources(resource)) return 'status-warning';
    else return 'status-available';
  };

  const getTitle = resource => {
    if (badResources(resource))
      return 'This is not secure. You should lockdown your resources by providing them in your policy';
    else if (warningResources(resource))
      return `You could further lockdown your resources by adding the resource ARN and removing any *'s`;
    else return 'The actions covered by this statement';
  };

  function generate() {
    return (
      <React.Fragment>
        {resources.map((item, index) => {
          return (
            <Tooltip key={index} placement='top-start' title={getTitle(item)}>
              <div key={index}>
                <span className='resourceState'>
                  <img
                    src={fetchImage(getStatus(item))}
                    className={classes.image}
                  />
                  <span className={classes.item}>{item}</span>
                </span>
                {/* <Divider key={index} className={classes.divider} /> */}
              </div>
            </Tooltip>
          );
        })}
      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <span className={classes.title}>{title}</span>
      <div className={classes.list}>{generate()}</div>
    </div>
  );
};
