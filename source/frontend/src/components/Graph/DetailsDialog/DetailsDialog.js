import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ReactJson from 'react-json-view';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import ResourceState from './ResourceState';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ResourceItem from './ResourceItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Tags from '../../../Utils/Tags/TagBuilder';

const useStyles = makeStyles((theme) => ({
  expansionRoot: {
    width: '100%',
    marginTop: '1vh',
  },
  root: {
    flexGrow: 1,
  },
  divider: {
    marginTop: '2vh',
    marginBottom: '2vh',
  },
  verticalDivider: {
    margin: '0 3% 0 0',
  },
  accountId: (props) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderColor: props.data('accountColour'),
    border: '1px dashed',
  }),
  region: (props) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderColor: props.data('regionColour'),
    border: '1px dashed',
  }),
  availabilityZone: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderColor: '#f7991f',
    border: '1px dashed',
  },
  state: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    textTransform: 'capitalize',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  expanded: {
    overflow: 'scroll',
  },
  heading: {
    color: '#535B63',
    fontSize: '1rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    lineHeight: '2rem',
    marginBottom: '.5rem',
  },
  gridHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    width: '100%',
    marginLeft: '1vw',
    marginRight: '1vw',
    marginTop: '1vh',
    marginBottom: '1vh',
    color: '#545b6',
  },
  expandIcon: {
    width: '5%',
  },
  panel: {
    // width: '100%'
  },
  resourceDetail: {
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightRegular,
    margin: '.5vw',
    display: 'inline-flex',
    width: '100%',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  resourceDetailName: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    margin: '.5vw',
    display: 'inline-flex',
    width: '50%',
  },
  resourceDetailNameSingle: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    margin: '.5vw',
    display: 'inline-flex',
    width: '19%',
  },
  tags: {
    // display: 'inline-flex',
    width: '100%',
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    wordWrap: 'break-word',
  },
  header: {
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #eaeded',
  },
  gridParent: {
    paddingLeft: '1vw',
    paddingRight: '1vw',
  },
  childGrid: {
    margin: '2% 0 2% 0',
  },
  footer: {
    borderTop: '1px solid #eaeded',
  },
  button: {
    margin: theme.spacing(1),
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
  },
  clearButton: {
    // width: '15%',
    margin: theme.spacing(1),
    backgroundColor: '#fff',
    // borderColor: '#000',
    color: '#000',
    // borderRadius: '2px',
    // border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#fafafa',
      // borderColor: '#000'
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#fafafa',
      // borderColor: '#000'
    },
  },
  icon: {
    width: '30px',
    position: 'absolute',
    right: '0',
    marginRight: '1vw',
  },
  title: {
    color: '#535B63',
    fontSize: '1.25rem',
    lineHeight: '2rem',
    marginBottom: '.5rem',
  },
  resourceItemTitleStyle: {
    color: '#535B63',
    fontSize: '1rem',
    lineHeight: '2rem',
    marginBottom: '.5rem',
  },
  resourceItemValueStyle: { fontSize: '0.75rem', marginLeft: '.5vw' },
  divInlineFlex: { display: 'inline-flex', marginRight: '1vw' },
  divBreakAll: { wordBreak: 'break-all', marginRight: '1vw' },
}));

export default ({ selectedNode }) => {
  const [showMoreDetailsModal, setShowMoreDetailsModal] = useState(true);
  const classes = useStyles(selectedNode);

  const getTags = () => {
    if (
      selectedNode.data('properties') &&
      selectedNode.data('properties').tags
    ) {
      return <Tags tags={JSON.parse(selectedNode.data('properties').tags)} />;
    } else {
      return '...';
    }
  };

  return (
    <Dialog
      open={showMoreDetailsModal}
      onClose={() => setShowMoreDetailsModal(false)}
      maxWidth={'lg'}
      fullWidth={true}
      scroll={'paper'}
      classes={{ paper: classes.dialogPaper }}
      // disableBackdropClick={true}
      disableEscapeKeyDown={true}
      aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title' className={classes.header}>
        <div className={classes.divInlineFlex}>
          <div className={classes.divBreakAll}>
            {selectedNode.data('title').length > 64
              ? `${selectedNode.data('title').substring(0, 64)}...`
              : selectedNode.data('title')}
          </div>
          <img
            alt={'Node Icon'}
            src={selectedNode.data('image')}
            className={classes.icon}
          />
        </div>
      </DialogTitle>
      <DialogContent className='importConfigModal'>
        <div className={classes.root}>
          <span className={classes.title}>High Level Details</span>

          <div className={classes.root}>
            <Grid container className={classes.gridParent}>
              <Grid className={classes.childGrid} item xs>
                <ResourceItem
                  title='Account ID'
                  resource={
                    selectedNode.data('resource') &&
                    selectedNode.data('resource').accountId
                      ? selectedNode.data('resource').accountId
                      : '...'
                  }
                  titleStyle={classes.resourceItemTitleStyle}
                  valueStyle={classes.resourceItemValueStyle}
                />
              </Grid>
              <Divider
                orientation='vertical'
                flexItem
                className={classes.verticalDivider}
              />
              <Grid className={classes.childGrid} item xs>
                <ResourceItem
                  title='Region'
                  resource={
                    selectedNode.data('properties') &&
                    selectedNode.data('properties').awsRegion
                      ? selectedNode.data('properties').awsRegion
                      : '...'
                  }
                  titleStyle={classes.resourceItemTitleStyle}
                  valueStyle={classes.resourceItemValueStyle}
                />
              </Grid>
              <Divider
                orientation='vertical'
                flexItem
                className={classes.verticalDivider}
              />

              <Grid className={classes.childGrid} item xs>
                <ResourceItem
                  title='Availability Zone'
                  resource={
                    selectedNode.data('properties') &&
                    selectedNode.data('properties').availabilityZone
                      ? selectedNode.data('properties').availabilityZone
                      : '...'
                  }
                  titleStyle={classes.resourceItemTitleStyle}
                  valueStyle={classes.resourceItemValueStyle}
                />
              </Grid>
            </Grid>
            <Divider
              orientation='vertical'
              flexItem
              className={classes.verticalDivider}
            />
            <Grid container className={classes.gridParent}>
              <Grid className={classes.childGrid} item xs>
                <ResourceState
                  title='Status'
                  state={selectedNode.data('state')}
                />
              </Grid>
              <Divider
                orientation='vertical'
                flexItem
                className={classes.verticalDivider}
              />

              <Grid className={classes.childGrid} item xs>
                <ResourceItem
                  title='ARN'
                  resource={
                    selectedNode.data('properties') &&
                    selectedNode.data('properties').arn
                      ? selectedNode.data('properties').arn
                      : '...'
                  }
                  titleStyle={classes.resourceItemTitleStyle}
                  valueStyle={classes.resourceItemValueStyle}
                />
              </Grid>
              <Divider
                orientation='vertical'
                flexItem
                className={classes.verticalDivider}
              />

              <Grid className={classes.childGrid} item xs>
                <ResourceItem
                  title='Cost'
                  resource={
                    selectedNode.data('cost')
                      ? `$${selectedNode.data('cost')}`
                      : '...'
                  }
                  titleStyle={classes.resourceItemTitleStyle}
                  valueStyle={classes.resourceItemValueStyle}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.gridParent}>
              <Grid className={classes.childGrid} item xs>
                <ResourceItem
                  title='Tags'
                  resource={getTags()}
                  titleStyle={classes.resourceItemTitleStyle}
                  valueStyle={classes.resourceItemValueStyle}
                />
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            {selectedNode.data('detailsComponent') &&
              selectedNode.data('detailsComponent')}
          </div>

          <div className={classes.expansionRoot}>
            <ExpansionPanel>
              <ExpansionPanelSummary
                className={classes.panel}
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'>
                <Typography className={classes.heading}>Show All</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.expanded}>
                <ReactJson
                  enableClipboard={false}
                  iconStyle='circle'
                  collapseStringsAfterLength={200}
                  displayDataTypes={false}
                  src={selectedNode.data('properties')}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
      </DialogContent>
      <DialogActions className={classes.footer}>
        <Button
          size='small'
          className={classes.clearButton}
          onClick={() => setShowMoreDetailsModal(!showMoreDetailsModal)}>
          Close
        </Button>
        {selectedNode.data('properties') &&
          selectedNode.data('properties').loginURL && (
            <a
              className={classes.url}
              href={selectedNode.data('properties').loginURL}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Open in console.'>
              <Button size='small' className={classes.button}>
                Open in Console
              </Button>
            </a>
          )}
      </DialogActions>
    </Dialog>
  );
};
