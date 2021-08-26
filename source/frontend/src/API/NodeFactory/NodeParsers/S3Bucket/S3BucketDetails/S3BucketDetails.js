import React from 'react';
import Divider from '@material-ui/core/Divider';
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
  title: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1.7rem',
    lineHeight: '2rem',
    marginLeft: '.5rem'
  },
  item: {
    adding: '1vh',
    wordWrap: 'break-word',
    fontSize: '1.2rem'
  },
  image: { width: 16, marginLeft: '1vw' }
}));

export default ({ title, actions }) => {
  const classes = useStyles();
  const warningActions =
    actions.filter(action => action.includes('*')).length > 0;
  const badActions = actions.filter(action => action === '*').length > 0;

  function generate() {
    return (
      <React.Fragment>
        {actions.map((item, index) => {
          return (
              <div key={index}>
                <span className='resourceState'>
                  <img
                    src={fetchImage(getStatus())}
                    className={classes.image}
                  />
                  <span className={classes.item}>{item}</span>
                </span>
                <Divider key={index} className={classes.divider} />
              </div>
          );
        })}
      </React.Fragment>
    );
  }

  const getColor = () => {
    if (badActions) return '#D13212';
    else if (warningActions) return '#FF9900';
    else return '#1D8102';
  };

  const getStatus = () => {
    if (badActions) return 'status-negative';
    else if (warningActions) return 'status-warning';
    else return 'status-available';
  };

  const getTitle = () => {
    if (badActions)
      return 'This is not secure. You should lockdown your actions by providing them in your policy';
    else if (warningActions)
      return `You could further lockdown your actions by adding the action name and removing any *'s`;
    else return 'The actions covered by this statement';
  };

  return (
    <div className={classes.root}>
      <span className={classes.title}>{title}</span>
      <div className={classes.list}>{generate()}</div>
    </div>
  );
};
