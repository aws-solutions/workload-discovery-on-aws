import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogTitle } from '../../../../Utils/Dialog/DialogTitle';
import { fetchRequest } from './Velocity/VelocityParser';
import { requestWrapper, sendPostRequest } from '../../../../API/APIHandler';
import { processFilterResults } from '../../../../API/APIProcessors';
import { useGraphState } from '../../../Contexts/GraphContext';
import { useResourceState } from '../../../Contexts/ResourceContext';
import FormAutoComplete from '../../../../Utils/Forms/FormAutoComplete';
import FormField from '../../../../Utils/Forms/FormField';
import ResourceTable from '../../../Resources/ResourceTable';
import Typography from '@material-ui/core/Typography';

const body2Classes = makeStyles((theme) => ({
  body2: {
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '1.2rem',
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    // height: 'fit-content',
  },
  content: {
    // height: '250px',
    padding: '2%',
  },
  actions: {
    borderTop: '1px solid #eaeded',
    padding: '0 1%',
  },
  header: {
    fontSize: '1.7rem',
    fontWeight: 700,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fafafa',
  },
  paper: {
    overflowY: 'none',
    height: 'fit-content',
  },
  textField: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: '1%',
    width: '45%',
    border: '1px solid #aab7b8',
    padding: '0 0 0 1%',
    fontSize: '14px',
    height: '35px',
  },
  label: {
    marginLeft: '0',
  },
  description: {
    marginLeft: '0',
    color: '#687078',
  },
  button: {
    // width: '15%',
    height: 'fit-content',
    margin: '1%',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '1.2rem',
    textTransform: 'capitalize',
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
  runbutton: {
    // width: '15%',
    // position: 'relative',
    height: 'fit-content',
    // margin: '0 0 0% 5%',
    display: 'table',
    verticalAlign: 'bottom',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    // display: 'inline-block',
    cursor: 'pointer',
    textTransform: 'capitalize',
    fontSize: '1.2rem',
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
    margin: '1%',
    backgroundColor: '#fff',
    // borderColor: '#000',
    color: '#000',
    // borderRadius: '2px',
    // border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '1.2rem',
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
  tableDiv: {
    display: 'table',
    height: '100%',
    width: '100%',
    padding: '1%',
  },
  tableCellDiv: {
    display: 'table-cell',
    margin: '1%',
    width: '45%',
    verticalAlign: 'bottom',
  },
  tableCellButton: {
    display: 'table-cell',
    margin: '1%',
    width: '10%',
    verticalAlign: 'bottom',
  },
}));

export default ({ toggleQueryBuilderModal }) => {
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ resources }, resourceDispatch] = useResourceState();
  const [nodeData, setNodeData] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState(undefined);
  const [resourceType, setResourceType] = useState(undefined);
  const [resourceCount, setResourceCount] = useState(undefined);

  const executeQuery = async () => {
    const query = {
      body: {
        command: 'runGremlin',
        data: fetchRequest(resourceType, resourceCount),
      },
      processor: processFilterResults,
    };
    const response = await requestWrapper(sendPostRequest, query);
    setNodeData(response && !response.error ? response.body : []);
  };

  const classes = useStyles();

  const getResourceTypes = (resources) => {
    const items = [];
    resources.map((filter) =>
      filter.metaData.resourceTypes.map((type) =>
        items.push({ value: Object.keys(type)[0], label: Object.keys(type)[0] })
      )
    );
    return items;
  };

  const body2 = body2Classes();

  return (
    <Dialog
      open={true}
      onClose={toggleQueryBuilderModal}
      maxWidth={'xl'}
      scroll={'paper'}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      classes={{ paper: classes.paper }}
      aria-labelledby='form-dialog-title'>
      <DialogTitle onClose={() => toggleQueryBuilderModal()}>
        Query Builder
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography className={body2.body2} variant='body2' gutterBottom>
          You can select a resource type and optionally specify the number of
          connections you want it to have. So, if you want to find any orphan
          EBS Volumes you can select AWS::EC2::Volume and 0 Connections.
        </Typography>
        <div className={classes.tableDiv}>
          <div className={classes.tableCellDiv}>
            <FormAutoComplete
              onSelected={(event, input) => setResourceType(input.value)}
              label='Select Resource Type'
              description='Choose the resource type you would like to use in your query'
              width='95%'
              margin='0 1% 0 0'
              options={getResourceTypes(resources)}
              multiSelect={false}
            />
          </div>
          <div className={classes.tableCellDiv}>
            <FormField
              onInput={(input) => setResourceCount(input.target.value)}
              label='Connections'
              description='Enter the number of connections you want the resource to have'
              width='95%'
              margin='0 1% 0 0'
              type='number'
            />
          </div>
          <div className={classes.tableCellButton}>
            <Button
              disabled={resourceType === undefined}
              className={classes.runbutton}
              onClick={executeQuery}>
              Run
            </Button>
          </div>
        </div>
        {resourceType && !nodeData && (
          <Typography className={body2.body2} variant='body2' gutterBottom>
            {`Show ${resourceType} that have ${
              resourceCount ? resourceCount : ' any number of '
            } ${resourceCount === 1 ? 'connection' : 'connections'}`}
          </Typography>
        )}
        <div className='resultTable'>
          <ResourceTable
            results={nodeData.filter(
              (item) => !item.edge && item.data.type === 'resource'
            )}
            selectedNodes={(nodes) => setSelectedNodes(nodes)}
            exportCSV={false}
          />
        </div>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          className={classes.clearButton}
          onClick={toggleQueryBuilderModal}>
          Close
        </Button>

        {nodeData && nodeData.length > 0 && (
          <Button
            disabled={selectedNodes === undefined}
            className={classes.button}
            onClick={() => {
              toggleQueryBuilderModal();
              dispatch({
                type: 'updateGraphResources',
                graphResources: { nodes: selectedNodes, edges: [] },
              });
            }}>
            Visualize
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
