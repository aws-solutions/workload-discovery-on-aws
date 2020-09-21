import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import FilterTable from './AccountAndRegionFilter/FilterTable';
import { useResourceState } from '../../../../Contexts/ResourceContext';
import { Typography } from '@material-ui/core';
import ResourceTypeFilter from './ResourceType/ResourceTypeFilter';
import { useGraphState } from '../../../../Contexts/GraphContext';
import { uploadObject } from '../../../../../API/Storage/S3Store';

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
    // borderTop: '1px solid #fafafa',
    width: '100%',
    height: '600px',
  },
  appBar: {
    boxShadow: 'none',
  },
  tab: {
    padding: 'unset',
    color: '#545b64',
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
    height: '100%',
  },
  tabWrapper: {
    borderRight: '1px solid #aab7b8',
    // margin: 'auto 0 auto 0',
  },
  tabContainer: {
    backgroundColor: '#fafafa',
    boxShadow: 'none',
    height: '100%',
  },
  // divider: {
  //   backgroundColor: '#aab7b8',
  //   height: '35px',
  //   width: '1px',
  //   marginTop: 'auto',
  //   marginBottom: 'auto',
  // },
  tabpanel: {
    height: '95%',
  },

  button: {
    // width: '15%',
    margin: 'auto 1rem',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:focus': {
      outline: 'none',
    },
  },
}));

export default () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [{ filters }, dispatch] = useResourceState();
  const [{ graphFilters }, updateFilters] = useGraphState();

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        className={classes.tabpanel}
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}>
        {value === index && (
          <Box p={3} style={{ height: '100%' }}>
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          value={value}
          onChange={handleChange}
          aria-label='simple tabs example'>
          <Tab
            disableRipple
            classes={{ root: classes.tab, wrapper: classes.tabWrapper }}
            label={
              graphFilters.typeFilters.length > 0
                ? `Resource Types (${graphFilters.typeFilters.length})`
                : 'Resource Types'
            }
            {...a11yProps(0)}
          />
          <Tab
            disableRipple
            classes={{ root: classes.tab, wrapper: classes.tabWrapper }}
            label={
              filters.length > 0
                ? `Accounts & Regions (${filters.length})`
                : 'Accounts & Regions'
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ResourceTypeFilter />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <FilterTable />
      </TabPanel>
    </div>
  );
};
