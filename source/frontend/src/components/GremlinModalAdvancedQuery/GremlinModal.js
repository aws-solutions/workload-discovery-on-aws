import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import { fetchRequest } from './VelocityParser';
import { requestWrapper, sendPostRequest } from '../../API/APIHandler'
import { processFilterResults } from '../../API/APIProcessors'
import { URLs } from '../../auth-config';
import { useGraphState } from '../Contexts/GraphContext';
import { useResourceState } from '../Contexts/ResourceContext';
import ResourceTypeSelector from './ResourceTypeSelector';
import ResultTable from './ResultTable';
import DatePicker from '../../Utils/Pickers/DatePicker';
import TextField from './TextField';
import NumberField from './NumberField';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';

export default ({ toggleModal }) => {
    const [{}, dispatch] = useGraphState();
    const [{resources}, resourceDispatch] = useResourceState();
    const [selectedTypeProps, setSelectedTypeProps] = useState([
        {name: 'Account Id', value: 'accountId', input: <NumberField label="Account ID" handleChange={() => console.log("account id changed")}/>}, 
        {name: 'Code Size (MB)', value:'configuration.codeSize', input: <NumberField label="Code Size (MB)" handleChange={() => console.log("code size changed")}/>},
        {name: 'Last Modified', value:'configuration.lastModified', input: <DatePicker label="Last Modified" handleChange={() => console.log("last modified changed")}/>},
        {name: 'Resource Name', value:'configuration.resourceName', input: <TextField label="Resource Name" handleChange={() => console.log("resource name changed")}/>}]);
    const [nodeData, setNodeData] = useState(undefined);
    const [selectedNodes, setSelectedNodes] = useState(undefined);
    const [resourceType, setResourceType] = useState(undefined);
    const [resourceCount, setResourceCount] = useState(undefined);


    const executeQuery = async () => {
        const query = {
            method: 'POST',
            body: {
                "command": "runGremlin",
                "data": fetchRequest(resourceType, resourceCount)
            },
            processor: processFilterResults
        }

        setNodeData(await requestWrapper(sendPostRequest, query));
    }

    const useStyles = makeStyles(theme => ({
        root: {
            width: '100%',
        },
        paper: {
            overflowY: 'none'
        }
    }));

    const classes = useStyles();


    const buttonClasses = makeStyles(theme => ({
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
    }))

    const textfieldClasses = makeStyles(theme => ({
        textField: {
            marginTop: '0',
            marginBottom: '1vh',
            marginRight: theme.spacing(1),
            width: '100%',
        }
    }));

    const labelClasses = makeStyles(theme => ({
        root: {
            marginTop: '2vh',
            marginBottom: '2vh'
        }
    }));


    const body2Classes = makeStyles(theme => ({
        body2: {
            fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
            fontSize: '0.75rem'
        }
    }));

    const getResourceTypes = (resources) => {
        const items = [];
        resources.map(filter => {
            filter.metaData.resourceTypes.map(type => items.push(Object.keys(type)))
        })
        return items;
    }

    const button = buttonClasses();
    const textField = textfieldClasses();
    const label = labelClasses()
    const body2 = body2Classes();

    return (

        <Drawer anchor="top" open={true} onClose={toggleModal} classes={{
            root: classes.root, // class name, e.g. `root-x`
            paper: classes.paper, // class name, e.g. `disabled-x`
        }}>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Build a Query</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <FormGroup>
                    <Typography className={body2.body2} variant="body2" gutterBottom>
                        You can select a resource type and optionally specify the number of connections you want it to have. So, if you want to find any orphan EBS Volumes you can select AWS::EC2::Volume and 0 Connections.
                    </Typography>
                    <FormLabel className={label.root} component="legend">Select Resource Type</FormLabel>
                    <ResourceTypeSelector items={getResourceTypes(resources)} onSelection={(selection) => setResourceType(selection[0])} />
                    {selectedTypeProps.map(prop => (
                         prop.input
                    ))}


                </FormGroup>
                {nodeData && nodeData.nodes.size > 0 &&
                    <div className="resultTable">
                        <ResultTable results={nodeData.nodes} selectedNodes={(nodes) => setSelectedNodes(nodes)} />
                    </div>
                }
                {nodeData && nodeData.nodes &&
                    <Typography className={body2.body2} variant="body2" gutterBottom>
                        {`Found ${nodeData.nodes.size} ${resourceType} resources`}
                    </Typography>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={resourceType === undefined} className={button.button} onClick={executeQuery}>Run</Button>
                {nodeData && nodeData.nodes.size > 0 &&
                    <Button disabled={selectedNodes === undefined} className={button.button} onClick={() => {
                        toggleModal()
                        dispatch({
                            type: 'updateGraphResources',
                            graphResources: { nodes: selectedNodes, edges: new Map() }
                        })
                    }}>Visualize</Button>
                }
            </Modal.Footer>
        </Drawer>
    )
}