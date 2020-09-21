import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ArrowDropDown';
import ChevronRightIcon from '@material-ui/icons/ArrowRight';

import TreeItem from '@material-ui/lab/TreeItem';
import { useGraphState } from '../../Contexts/GraphContext';
import RootRef from '@material-ui/core/RootRef';
import TreeMenuAccountManagementMenu from './AccountManagement/TreeMenuAccountManagementMenu';

const useStyles = makeStyles({
  root: {
    // flexGrow: 1,
    maxWidth: 400,
    height: 'fit-content',
    // maxHeight: '30px',
    background: ['#fff'].join(','),
    '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
      background: '#fff',
      color: '#545b64',
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
    padding: '2%',
    color: '#545b64',
    fontWeight: 600,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '0.85rem',
    width: '100%'
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
    margin: '0',
    borderBottom: '1px solid #687078',
    borderTop: ['1px solid #687078'].join(','),
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
  menuButton: {
    // height: '18px',
    padding: 'unset',
    margin: ['0 0 0 2%'].join(','),
    '&:hover': {
      outline: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  drawio: {
    display: 'inline-flex',
    width: '100%',
    height: 'fit-content',
  },
  drawioLabel: {
    fontSize: '0.75rem',
    margin: 'auto 0',
  },
  externalIcon: {
    width: '18px',
  },
});

export default ({ compound }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(['0']);
  const [{ cy }, dispatch] = useGraphState();


  const treeViewRef = useRef();

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  return (
    <>
      <RootRef rootRef={treeViewRef}>
        <TreeView
          classes={{ root: classes.root }}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          // selected={selected}
          onNodeToggle={handleToggle}
          >
          <TreeItem
            key='0'
            nodeId='0'
            label={`Configuration`}
            classes={{
              root: classes.selection,
              label: classes.label,
              // selected: classes.selected,
              content: classes.content,
              iconContainer: classes.iconContainer,
              group: classes.group,
            }}>
              <TreeMenuAccountManagementMenu />
          </TreeItem>
        </TreeView>
      </RootRef>
    </>
  );
};
