import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { getHierachicalLinkedNodes } from '../Actions/GraphActions';
import ResourceTable from './ResourceTable';
import FormGroup from '@material-ui/core/FormGroup';
import DatePicker from 'react-datepicker';
import { useGraphState } from '../Contexts/GraphContext';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { DialogTitle } from '../../Utils/Dialog/DialogTitle';
import { Typography } from '@material-ui/core';
import 'react-datepicker/dist/react-datepicker.css';
import InputBase from '@material-ui/core/InputBase';

const styles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: '30vh',
    maxHeight: '60vh',
    minWidth: '40vw',
  },
  root: {
    marginTop: '2vh',
    marginBottom: '2vh',
  },
  error: {
    left: 0,
    color: '#d13212',
  },
  textField: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: '1vw',
    width: '100%',
    border: '1px solid #aab7b8',
    padding: '0 0 0 1vw',
    fontSize: '14px',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    height: '35px',
  },
  singleButton: {
    right: 0,
    position: 'relative',
    marginLeft: '2%',
    width: '15%',
    marginTop: 'auto',
    marginBottom: 'auto',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    float: 'right',
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
  button: {
    width: '15%',
    margin: '1vh',
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
  clearButton: {
    width: '15%',
    margin: '1vh',
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
    '&:focus': {
      outline: 'none',
    },
  },
  dialogText: {
    wordBreak: 'break-word',
  },
  div: {
    display: 'inline-flex',
    marginTop: '1vh',
    marginBottom: '2vh',
  },
}));

export default ({ selectedNode, hideHistoryDialog }) => {
  const [{ graphResources }, dispatch] = useGraphState();
  const [showResourceModal, setShowResourceModal] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showError, setShowError] = useState(false);
  const [deletedResources, setDeletedResources] = useState(undefined);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const classes = styles();

  const queryForDeletedResources = () => {
    const params = {
      nodeId: selectedNode.data('id'),
      focusing: true,
      deleteDate: selectedDate.toISOString,
      deletedQuery: true,
    };
    getHierachicalLinkedNodes(params).then((response) => {
      if (response.error) {
        setShowError(response.error);
      } else {
        setDeletedResources(response.body);
      }
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const createEdge = (resource) => {
    return {
      edge: true,
      data: {
        id: `${selectedNode.data('id')}-${resource.data.id}`,
        source: selectedNode.data('id'),
        target: resource.data.id,
      },
      classes: ['highlight'],
    };
  };

  const addToGraph = () => {
    const resources = [];
    selectedNodes.forEach((resource) => {
      resource.data.queryDate = selectedDate;
      const edge = createEdge(resource);
      resources.push(edge);
      resources.push({
        edge: resource.edge,
        data: resource.data,
        classes: resource.classes,
      });
    });

    resources.forEach((item) => graphResources.push(item));

    dispatch({
      type: 'updateGraphResources',
      graphResources: graphResources,
    });
    hideHistoryDialog();
  };

  return (
    <Dialog
      open={showResourceModal}
      onClose={hideHistoryDialog}
      maxWidth={'lg'}
      scroll={'paper'}
      // disableBackdropClick={true}
      disableEscapeKeyDown={true}
      classes={{ paper: classes.dialogPaper }}
      aria-labelledby='form-dialog-title'>
      <DialogTitle onClose={() => hideHistoryDialog()}>
        Historical Resources
      </DialogTitle>
      <DialogContent>
        <DialogContentText classes={{ root: classes.dialogText }}>
          Here you can query the resources related to{' '}
          <strong>{selectedNode.data('title')}</strong> that may no longer
          exist. Simply select a date that you wish to go back to and click
          'Search'
        </DialogContentText>
        <FormGroup>
          <div className={classes.div}>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='dd-MM-yyyy HH:mm'
              withPortal
              customInput={<InputBase className={classes.textField} />}
            />
            <Button
              className={classes.singleButton}
              onClick={queryForDeletedResources}>
              Search
            </Button>
          </div>
        </FormGroup>
        <div className='resourceTable'>
          <ResourceTable
            results={
              deletedResources &&
              deletedResources.filter(
                (item) =>
                  !item.edge &&
                  item.data.type === 'resource' &&
                  item.data.softDelete
              )
            }
            groupNodes={false}
            selectedNodes={(nodes) => setSelectedNodes(nodes)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        {showError && (
          <Typography className={classes.error} variant='error'>
            We encountered an error looking for the history of that node. Please
            try again...
          </Typography>
        )}
        <Button className={classes.clearButton} onClick={hideHistoryDialog}>
          Close
        </Button>
        <Button
          className={classes.button}
          onClick={addToGraph}
          disabled={selectedNodes.length === 0}>
          Add To Graph
        </Button>
      </DialogActions>
    </Dialog>
  );
};
