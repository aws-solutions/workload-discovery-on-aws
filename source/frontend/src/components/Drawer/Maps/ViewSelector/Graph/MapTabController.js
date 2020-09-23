import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import EnhancedMapTable from './EnhancedMapTable';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'absolute',
    backgroundColor: 'theme.palette.background.paper',
    width: '100%',
    height: '600px',
  },
  appBar: {
    boxShadow: 'none',
  },
  tab: {
    color: '#545b64',
    padding: 0,
    textTransform: 'none',
    fontSize: '0.75rem',
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    backgroundColor: ['#fafafa'].join(','),
    '&:hover': {
      color: '#ec7211',
      opacity: 1,
      backgroundColor: '#fafafa',
    },
    '&:focus': {
      color: '#ec7211',
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: '#fafafa',
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    },
    '&:selected': {
      color: '#ec7211',
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: '#fafafa',
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    },
  },
  tabWrapper: {
    borderRight: '1px solid #aab7b8',
    margin: 'auto 0 auto 0',
  },
  tabContainer: {
    backgroundColor: '#fafafa',
    boxShadow: 'none',
  },
  divider: {
    backgroundColor: '#aab7b8',
    height: '35px',
    width: '1px',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  tabpanel: {
    height: '550px',
    padding: '1%',
  },
}));

export default ({ toggleDialog }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role='tabpanel'
        className={classes.tabpanel}
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}>
        {value === index && (
          <Box classes={{ root: classes.tabpanel }} p={3}>
            {/* <Typography>{children}</Typography> */}
            {children}
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  const handleChange = (event, tabValue) => {
    setTabValue(tabValue);
  };

  return (
    <div className={classes.root}>
      <AppBar classes={{ root: classes.appBar }} position='static'>
        <Tabs
          classes={{ flexContainer: classes.tabContainer }}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#000',
            },
          }}
          value={tabValue}
          onChange={handleChange}
          aria-label='simple tabs example'>
          <Tab
            classes={{ root: classes.tab, wrapper: classes.tabWrapper }}
            label='Private'
            {...a11yProps(0)}
          />
          <Tab
            classes={{ root: classes.tab, wrapper: classes.tabWrapper }}
            label='Public'
            {...a11yProps(0)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <EnhancedMapTable toggleDialog={toggleDialog} level={'private'} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EnhancedMapTable toggleDialog={toggleDialog} level={'public'} />
      </TabPanel>
    </div>
  );
};
