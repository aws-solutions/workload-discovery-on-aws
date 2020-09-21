import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import { makeStyles } from '@material-ui/core/styles';

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
  item: {
    padding: '1vh',
    color: theme.palette.text.secondary,
    wordWrap: 'break-word',
    fontSize: '0.75rem',
    marginLeft: '1vw'
  },
  span: {
    padding: '1vh',
    // color: getColor(item),
    wordWrap: 'break-word',
    fontSize: '0.75rem'
  },
  image: { width: 16, marginLeft: '1vw' },
  title: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    lineHeight: '2rem',
    marginLeft: '.5rem'
  }
}));

export default ({ title, actions }) => {
  const classes = useStyles();
  const warningActions = action => action.includes('*');
  const badActions = action => action === '*';

  function generate() {
    return (
      <React.Fragment>
        {actions.map((item, index) => {
          return (
            <Tooltip key={index} placement='top-start' title={getTitle(item)}>
              <div key={index}>
                <span className='resourceState'>
                  <img
                    src={fetchImage(getStatus(item))}
                    className={classes.image}
                  />
                  <span className={classes.span}>{item}</span>
                </span>
              </div>
            </Tooltip>
          );
        })}
      </React.Fragment>
    );
  }

  // const getColor = action => {
  //   if (badActions(action)) return '#D13212';
  //   else if (warningActions(action)) return '#FF9900';
  //   else return '#1D8102';
  // };

  const getStatus = action => {
    if (badActions(action)) return 'status-negative';
    else if (warningActions(action)) return 'status-warning';
    else return 'status-available';
  };

  const getTitle = action => {
    if (badActions(action))
      return 'This is not secure. You should lockdown your actions by providing them in your policy';
    else if (warningActions(action))
      return `You could further lockdown your actions by adding the action name and removing any *'s`;
    else return 'The actions covered by this statement';
  };

  return (
    <div className={classes.root}>
      <span className={classes.title}>
        {title}
      </span>

      <div className={classes.list}>{generate()}</div>
    </div>
  );
};
