import React, { useState, useContext } from 'react';
import NavBarButtons from './NavBarButtons';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SideDrawer from '../Drawer/SideDrawer';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  colorPrimary: {
    backgroundColor: '#232f3e',
    boxShadow: 'none'
  },
  menuButton: {
    marginRight: ['1vw'].join(','),
    '&:hover': {
      outline: '1px solid #f3f3f3'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  title: {
    flexGrow: 1,
    margin: 'auto'
  }
}));

export default () => {

    const [showSidebarDrawer, setShowSidebarDrawer] = useState(false);
    const metadataProps = useContext(MetadataContext);

    const classes = useStyles();

    const enableSideBar = metadataProps.metadata instanceof Map;

    return (
        <div className={classes.root}>
            <AppBar className={classes.colorPrimary} position="static">
                <Toolbar>
                  <NavBarButtons />
                    <IconButton disabled={!enableSideBar} edge="start"
                        className={classes.menuButton}
                        onClick={() => setShowSidebarDrawer(!showSidebarDrawer)}
                        color="inherit"
                        aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    
                </Toolbar>
            </AppBar>
            {/* {showSidebarDrawer && <SideDrawer toggleSideDrawer={() => setShowSidebarDrawer(!showSidebarDrawer)} />} */}
        </div>

    );
}

