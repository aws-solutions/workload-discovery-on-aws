import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ArrowDropDown';
import ChevronRightIcon from '@material-ui/icons/ArrowRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { useResourceState } from '../../Contexts/ResourceContext';
import { useGraphState } from '../../Contexts/GraphContext';
import { buildResourceTypes } from './MenuBuilder';
import { fetchImage } from '../../../Utils/ImageSelector';
import RootRef from '@material-ui/core/RootRef';
import { filterResources } from '../../Actions/GraphActions';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    background: ['#fff'].join(','),
    '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
      background: '#fff',
      color: '#dd6b10',
      width: 'fit-content',
    },
    '& .MuiTreeItem-root:focus > .MuiTreeItem-content .MuiTreeItem-label': {
      backgroundColor: '#fff'
    },
    '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover': {
      background: '#fff',
    },
    '& .MuiTreeItem-label:hover': {
      color: '#dd6b10',
      background: '#fff',
    },
    '& .MuiTreeItem-root.Mui-selected': {
      // background: 'red'
    },
  },
  nodeRoot: {
    width: '100%',
    maxWidth: 400,
    background: ['#fff'].join(','),
    '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
      background: '#fff',
      color: '#dd6b10',
      width: 'fit-content',
    },
    '& .MuiTreeItem-root:focus > .MuiTreeItem-content .MuiTreeItem-label': {
      backgroundColor: '#fff'
    },
    '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover': {
      background: '#fff',
    },
    '& .MuiTreeItem-label:hover': {
      color: '#dd6b10',
      background: '#fff',
    },
    '& .MuiTreeItem-root.Mui-selected': {
      // background: 'red'
    },
  },
  group: {
    marginLeft: '3%',
  },
  content: {
    background: '#fff',
  },
  selected: {
    background: '#fff',
  },
  label: {
    fontSize: '0.75rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fff',
    width: '100%',
    color: '#545b64',
    fontWeight: 400,
  },
  subLabel: {
    fontSize: '0.75rem',
    fontWeight: 400,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fff',
    color: '#545b64',
    width: '100%',
  },
  iconContainer: {
    color: '#879596',
  },
  selection: {
    paddingTop: '2%',
    paddingBottom: '2%',
    width: '100%',
  },
  selectedNode: {
    paddingTop: '2%',
    paddingBottom: '2%',
    width: '100%',
  },
  popper: {
    display: 'inline-flex',
    maxWidth: '100vw',
    width: '100%',
  },
  type: {
    margin: 'auto 0 auto 0',
    fontSize: '.75rem',
  },
  textfield: {
    width: '100%',
    margin: ['0'].join(','),
    '& .MuiInput-underline:hover:before': {
      border: 0,
    },
    '& .MuiInput-underline:before': {
      border: 0,
    },
    '& .MuiInput-underline:after': {
      border: 0,
    },
    '& .MuiInput-root': {
      border: '1px solid #fafafa',
      padding: '0 0 0 2%',
      fontSize: '.75rem',
    },
    '& .MuiInputBase-input': {
      fontSize: '0.75rem',
      color: '#000',
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    },
  },
});

export default ({}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [{ resources, filters }, resourceDispatch] = useResourceState();
  const [{ graphResources }, dispatch] = useGraphState();

  const treeViewRef = useRef();

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const ResourceIcon = ({ type }) => (
    <img
      alt={`${type} icon`}
      src={fetchImage(type)}
      style={{
        background: 'white',
        width: '35px',
        height: '35px',
        marginRight: '5%',
      }}
    />
  );

  const handleTypeSelect = (event, nodeId) => {
    filterResources({ resourceType: nodeId }, filters).then((response) => {
      dispatch({
        type: 'updateGraphResources',
        graphResources: response.body,
      });
    });
  };

  return (
    <RootRef rootRef={treeViewRef}>
      <TreeView
        classes={{ root: classes.root }}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}>
          <Tooltip
            placement='right-end'
            title='Create architecture diagrams from resource types'>
        <TreeItem
          key='0'
          nodeId='0'
          label={`Types`}
          classes={{
            root: classes.selection,
            label: classes.label,
            // selected: classes.selected,
            content: classes.content,
            iconContainer: classes.iconContainer,
            group: classes.group,
          }}>
          {buildResourceTypes(resources).map((resource, index) => {
            return (
              <TreeItem
                classes={{
                  root: classes.selection,
                  label: classes.label,
                  // selected: classes.selected,
                  content: classes.content,
                  iconContainer: classes.iconContainer,
                  group: classes.group,
                }}
                key={`${index}-${resource.key}`}
                nodeId={`${index}-${resource.key}`}
                label={resource.label}>
                <TreeView
                  classes={{ root: classes.root }}
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  expanded={expanded}
                  selected={selected}
                  onNodeToggle={handleToggle}
                  onNodeSelect={handleTypeSelect}>
                  {resource.nodes.map((subResource, subIndex) => {
                    return (
                      <div key={subIndex} style={{ display: 'flex' }}>
                        <Tooltip
                          key={`${index}-${subResource.label}-tooltip-${subIndex}`}
                          placement='right'
                          classes={{ tooltip: classes.popper }}
                          title={
                            <React.Fragment>
                              <div className={classes.popper}>
                                <ResourceIcon
                                  type={subResource.filter.resourceType}
                                />
                                <Typography
                                  classes={{ root: classes.type }}
                                  color='inherit'>
                                  {subResource.filter.resourceType}
                                </Typography>
                              </div>
                            </React.Fragment>
                          }>
                          <TreeItem
                            classes={{
                              root: classes.selectedNode,
                              label: classes.subLabel,
                              // selected: classes.selected,
                              content: classes.content,
                              iconContainer: classes.iconContainer,
                              group: classes.group,
                            }}
                            key={`${index}-${subIndex}-${subResource.filter.resourceType}`}
                            nodeId={`${subResource.filter.resourceType}`}
                            label={subResource.label}></TreeItem>
                        </Tooltip>
                      </div>
                    );
                  })}
                </TreeView>
              </TreeItem>
            );
          })}
        </TreeItem>
        </Tooltip>
      </TreeView>
    </RootRef>
  );
};
