import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchBar from '../../Header/Search/SearchBar';
import { useResourceState } from '../../Contexts/ResourceContext';
import Graph from '../../../components/Graph/Graph';
import NavBarButtons from '../../Header/NavBarButtons';
import TreeMenuActionMenu from '../Actions/TreeMenuActionMenu';
import TreeMenuResources from '../ResourceSelector/TreeMenuResources';
import TreeMenuSettingsMenu from '../Settings/TreeMenuSettingsMenu';
import TreeMenuMaps from '../Diagrams/TreeMenuDiagrams';
import TreeMenuPreferences from '../Preferences/TreeMenuPreferences';
import TreeMenuFeedbackLinksMenu from '../Feedback/TreeMenuFeedbackLinksMenu';
import ApplicationAndVersion from './ApplicationAndVersion';
import CostContainer from './Costs/CostContainer';
import TreeMenuCosts from '../Costs/TreeMenuCosts';
import {
  Box,
  Button,
  ColumnLayout,
  Container,
  Grid,
  Spinner,
} from '@awsui/components-react';
import { useCostsState } from '../../Contexts/CostsContext';

const R = require('ramda');
var dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    borderRight: '1px solid #ddd',
    boxShadow: 'none'
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
    fontSize: '1.4rem',
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
    fontSize: '1.8rem',
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
  const [open, setOpen] = React.useState(true);
  const [{ resources }, resourceDispatch] = useResourceState();
  const [{ costPreferences }, costDispatch] = useCostsState();
  const [loading, setLoading] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
          <Box padding="xl">
            <Grid
              disableGutters
              gridDefinition={[
                { colspan: { default: 9, xxs: 3 } },
                { colspan: { default: 3, xxs: 9 } },
              ]}>
              <ApplicationAndVersion />
              <Box float='right'>
                {loading ? (
                  <Spinner size='normal' />
                ) : (
                  <Button
                    iconName='close'
                    variant='icon'
                    onClick={handleDrawerClose}></Button>
                )}
              </Box>
            </Grid>
          </Box>
          <div
            style={{
              height: '100%',
              overflow: 'scroll',
            }}>
            <ColumnLayout columns={1}>
              <TreeMenuResources resources={resources} />
              <TreeMenuCosts />
              <TreeMenuMaps />
              <TreeMenuActionMenu />
              <TreeMenuPreferences />
              <TreeMenuSettingsMenu />
              <TreeMenuFeedbackLinksMenu />
            </ColumnLayout>
          </div>
          {costPreferences.processCosts && <CostContainer />}
        </Drawer>
      </div>

      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}>
        <div className={classes.main} />
        <SearchBar setLoading={setLoading} />

        <Graph />
      </div>
    </div>
  );
}
