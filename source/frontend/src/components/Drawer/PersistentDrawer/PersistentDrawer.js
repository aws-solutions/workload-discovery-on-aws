import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchBar from '../../Header/Search/SearchBar';
import { useResourceState } from '../../Contexts/ResourceContext';
import { useGraphState } from '../../Contexts/GraphContext';
import Graph from '../../../components/Graph/Graph';
import NavBarButtons from '../../Header/NavBarButtons';
import TreeMenuActionMenu from '../Actions/TreeMenuActionMenu';
import TreeMenuResources from '../ResourceSelector/TreeMenuResources';
import TreeMenuManagementMenu from '../Management/TreeMenuManagementMenu';
import TreeMenuIconMenu from '../Documentation/TreeMenuIconMenu';
import TreeMenuMaps from '../Maps/TreeMenuMaps';
import TreeMenuPreferences from '../Preferences/TreeMenuPreferences';
import TreeMenuFeedbackLinksMenu from '../Feedback/TreeMenuFeedbackLinksMenu';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    borderRight: '1px solid #ddd',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: '#232f3e',
    boxShadow: 'none',
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  heading: {
    padding: '5%',
    color: '#545b64',
    fontWeight: 600,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '0.85rem',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowY: 'unset',
  },
  name: {
    position: 'absolute',
    left: 0,
    marginLeft: '5%',
    fontSize: '1.1rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontWeight: 600,
  },
  drawerHeader: {
    borderRight: '1px solid #ddd',
    height: '114px',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    position: 'sticky',
    top: 0,
    zIndex: 99,
    background: '#fff',
    borderBottom: '1px solid #aab7b8',
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    position: 'sticky',
    top: 0,
    zIndex: 99,
    background: '#fff',
    borderBottom: '1px solid #aab7b8',
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    height: '100vh',
    overflow: 'hidden',
    // width:'100%',
    // height: `calc(100vh - ${headerHeight}px)`
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  // const [expanded, setExpanded] = useState(false);
  const [{ resources }, resourceDispatch] = useResourceState();
  const [{ cy }, dispatch] = useGraphState();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const handleChange = (panel) => (event, isExpanded) => {
  //   setExpanded(isExpanded ? panel : false);
  // };

  return (
    <div id={`sidepanel-${open}`} className={classes.root}>
      <div>
        <CssBaseline />
        <AppBar
          position='fixed'
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              className={clsx(classes.menuButton, open && classes.hide)}>
              <MenuIcon />
            </IconButton>
            <NavBarButtons />
          </Toolbar>
        </AppBar>
        <Drawer
          variant='persistent'
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor='left'
          open={open}>
          {/* <div tabIndex={0} role='button' className='sideDrawer'> */}
          <div className={classes.drawerHeader}>
            <Typography className={classes.name}>AWS Perspective</Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <Close /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <div
            style={{
              height: '100%',
              overflow: 'scroll',
              borderBottom: '1px solid #aab7b8',
            }}>
            <TreeMenuResources resources={resources} />
            <TreeMenuMaps />
            <TreeMenuActionMenu />
            <TreeMenuPreferences />
            <TreeMenuManagementMenu />
            <TreeMenuFeedbackLinksMenu />
            <TreeMenuIconMenu />
            
          </div>
        </Drawer>
      </div>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}>
        <div className={classes.main} />
        <SearchBar />

        <Graph />
      </div>
    </div>
  );
}
