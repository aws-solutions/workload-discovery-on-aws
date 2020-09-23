import React from 'react';
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
  div: {
    display: 'grid'
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

export default ({ title, resource }) => {
  const classes = useStyles();

  // const getColor = () => {
  //   return resource === 'Allow' ? '#1D8102' : '#D13212';
  // };

  const getStatus = () => {
    if (resource === 'Allow') return 'status-available';    
    else return 'status-negative';
  };

  return (
    <div className={classes.div}>
        <span className={classes.title}>
        {title}
      </span>
        <span className='resourceState'>
          <img
            src={fetchImage(getStatus())}
            className={classes.image}
          />
          <span className={classes.span}>
            {resource}
          </span>
        </span>
    </div>
  );
};
