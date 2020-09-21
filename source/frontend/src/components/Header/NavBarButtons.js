import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginLeft: '5px',
    marginRight: ['15px'].join(','),
    '&:hover': {
      outline: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  logout: {
    display: 'inline-flex',
    margin: 'auto'
  },
  welcome: {
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '0.75rem',
    margin: 'auto'
  },
  username: {
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '0.75rem',
    margin: 'auto 5px',
    fontWeight: 700,
    fontStyle: 'italic',

  }
}));

export default () => {
  const [username, setUsername] = useState();
  const classes = useStyles();

  const reload = () => window.location.reload();

  const signOut = () => {
    Auth.signOut().then(reload).catch(reload);
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((response) =>
      setUsername(response.username)
    );
  }, []);

  return (
    <div className='search-grp'>
      <div className={classes.logout}>
        <Typography classes={{root: classes.welcome}}>Welcome, </Typography><Typography classes={{root: classes.username}}>{username}</Typography>
        <Tooltip title='Log out'>
          <IconButton
            edge='start'
            className={classes.menuButton}
            onClick={signOut}
            color='inherit'
            aria-label='menu'>
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};
