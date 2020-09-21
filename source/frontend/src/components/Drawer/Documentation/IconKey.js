import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BorderOuter from '@material-ui/icons/BorderOuter';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import ListAlt from '@material-ui/icons/ListAlt';
import { fetchImage } from '../../../Utils/ImageSelector';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  build: {
    color: '#000',
    margin: 'auto 1vw auto 1vw',
    width: '20px',
  },
  heading: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: '75%',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  description: {
    fontSize: '0.75rem',
    padding: '2vh',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fafafa',
  },
  details: {
    padding: 0,
  },
  expansionPanel: {
    boxShadow: 'none',
  },
  titleDivider: {
    margin: '5% 0 5% 0',
  },
  summaryRoot: {
    padding: '0 5% 0 0',
    boxShadow: 'none',
    width: '100%',
    background: '#fff',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
}));

export default ({ expanded, handleChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div style={{ display: 'grid', width: '100%' }}>
        <div style={{ display: 'grid' }}>
          <div
            style={{
              margin: '0 0 0 5%',
              display: 'inline-flex',
              width: '100%',
            }}>
            <img
              src={fetchImage('status-negative')}
              style={{ width: 16, margin: 'auto 0 auto 5%' }}
            />
            <span
              style={{
                color: '#535B63',
                fontSize: '0.75rem',
                lineHeight: '2rem',
                margin: 'auto 0 auto 5%',
              }}>
              At Risk
            </span>
          </div>
          {/* <Divider className={classes.titleDivider} /> */}

          <div
            style={{
              margin: '0 0 0 5%',
              display: 'inline-flex',
              width: '100%',
            }}>
            <img
              src={fetchImage('status-warning')}
              style={{ width: 16, margin: 'auto 0 auto 5%' }}
            />
            <span
              style={{
                color: '#535B63',
                fontSize: '0.75rem',
                lineHeight: '2rem',
                margin: 'auto 0 auto 5%',
              }}>
              Needs Attention
            </span>
          </div>
          {/* <Divider className={classes.titleDivider} /> */}

          <div
            style={{
              margin: '0 0 0 5%',
              display: 'inline-flex',
              width: '100%',
            }}>
            <img
              src={fetchImage('status-available')}
              style={{ width: 16, margin: 'auto 0 auto 5%' }}
            />
            <span
              style={{
                color: '#535B63',
                fontSize: '0.75rem',
                lineHeight: '2rem',
                margin: 'auto 0 auto 5%',
              }}>
              OK
            </span>
          </div>
        </div>
        {/* <Divider className={classes.titleDivider} /> */}
        <div
          style={{
            margin: '0 0 0 5%',
            display: 'inline-flex',
            width: '100%',
          }}>
          {/* <img
                  src={fetchImage('status-available')}
                  style={{ width: 16, margin: 'auto 0 auto 5%' }}
                /> */}
          <BorderOuter
            style={{
              width: 20,
              margin: 'auto 0 auto 5%',
              color: '#232f3e',
            }}
          />
          <span
            style={{
              color: '#535B63',
              fontSize: '0.75rem',
              lineHeight: '2rem',
              margin: 'auto 0 auto 5%',
            }}>
            Last Selected Resource
          </span>
        </div>
        {/* <Divider className={classes.titleDivider} /> */}
        <div
          style={{
            margin: '0 0 0 5%',
            display: 'inline-flex',
            width: '100%',
          }}>
          {/* <img
                  src={fetchImage('status-available')}
                  style={{ width: 16, margin: 'auto 0 auto 5%' }}
                /> */}
          <MoreHoriz
            style={{
              width: 20,
              margin: 'auto 0 auto 5%',
              color: '#ec7211',
            }}
          />
          <span
            style={{
              color: '#535B63',
              fontSize: '0.75rem',
              lineHeight: '2rem',
              margin: 'auto 0 auto 5%',
            }}>
            Multiple Edges Collapsed
          </span>
        </div>
        {/* <Divider className={classes.titleDivider} /> */}
      </div>
    </div>
  );
};
