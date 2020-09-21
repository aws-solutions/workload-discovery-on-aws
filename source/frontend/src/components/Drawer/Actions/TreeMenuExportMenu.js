import React, { useRef, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ArrowDropDown';
import ChevronRightIcon from '@material-ui/icons/ArrowRight';
import OpenInNew from '@material-ui/icons/OpenInNew';
import IconButton from '@material-ui/core/IconButton';
import TreeItem from '@material-ui/lab/TreeItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import RootRef from '@material-ui/core/RootRef';
import SaveDialog from '../../Graph/Save/SaveDialog';
import ExportTable from '../../Graph/ExportTable/ExportTable';
import { sendDrawioPostRequest } from '../../../API/APIHandler';

const useStyles = makeStyles({
  root: {
    // flexGrow: 1,
    maxWidth: 400,
    height: 'fit-content',
    // maxHeight: '30px',
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
  const [expanded, setExpanded] = React.useState([]);
  const [saveJson, setSaveJson] = useState(false);
  const [saveCSV, setSaveCSV] = useState(false);
  const [savePNG, setSavePNG] = useState(false);

  const treeViewRef = useRef();

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeId) => {
    switch (nodeId) {
      case '1':
        setSaveCSV(!saveCSV);
        return;
      case '2':
        setSaveJson(!saveJson);
        return;
      case '3':
        setSavePNG(!savePNG);
        return;
      case '4':
        generateDrawio();
        return;
      default:
    }
  };

  const options = {
    output: 'blob',
    bg: '#fff',
    full: true,
  };

  const exportView = () => {
    return new Blob([compound.png(options)], { type: 'image/png' });
  };

  const exportJSON = () => {
    // const expandableNodes = api.current.expandableNodes();
    // api.current.expandAll();
    const json = compound.json();
    // api.current.collapse(expandableNodes);
    return new Blob([JSON.stringify(json)], {
      type: 'application/json;charset=utf-8',
    });
  };

  const exportNodes = () => {
    return compound.nodes().length > 0
      ? {
          title: 'Current Graph',
          nodes: processChildNodes(compound.nodes()[0], []),
        }
      : [];
  };

  const processChildNodes = (node, nodes) => {
    let recursiveNodes = nodes;
    if (node.children() && node.children().length > 0) {
      node.children().forEach((child) => {
        recursiveNodes.concat(processChildNodes(child, recursiveNodes));
      });
    } else {
      recursiveNodes.push({ data: node.data() });
    }
    return recursiveNodes;
  };

  const generateDrawio = async () => {
    const query = {
      body: compound.json(),
      processor: (data) => data,
    };
    const drawiourl = await sendDrawioPostRequest(query, query.processor);
    window.open(drawiourl.body, '_blank');
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
          onNodeSelect={handleSelect}>
          <TreeItem
            key='0'
            nodeId='0'
            label={`Export`}
            classes={{
              root: classes.selection,
              label: classes.label,
              // selected: classes.selected,
              content: classes.content,
              iconContainer: classes.iconContainer,
              group: classes.group,
            }}>
              <Tooltip
            placement='right-end'
            title='Export this architecture diagram as CSV'>
            <TreeItem
              key='1'
              nodeId='1'
              label={`CSV`}
              classes={{
                root: classes.selection,
                label: classes.subLabel,
                // selected: classes.selected,
                content: classes.content,
                iconContainer: classes.iconContainer,
                group: classes.group,
              }}
            />
            </Tooltip>
            <Tooltip
            placement='right-end'
            title='Export this architecture diagram as JSON'>
            <TreeItem
              key='2'
              nodeId='2'
              label={`JSON`}
              classes={{
                root: classes.selection,
                label: classes.subLabel,
                // selected: classes.selected,
                content: classes.content,
                iconContainer: classes.iconContainer,
                group: classes.group,
              }}
            />
            </Tooltip>
            <Tooltip
            placement='right-end'
            title='Export this architecture diagram as a PNG'>
            <TreeItem
              key='3'
              nodeId='3'
              label={`PNG`}
              classes={{
                root: classes.selection,
                label: classes.subLabel,
                // selected: classes.selected,
                content: classes.content,
                iconContainer: classes.iconContainer,
                group: classes.group,
              }}
            />
            </Tooltip>
            <Tooltip
            placement='right-end'
            title='Open this architecture diagram in Draw.io'>
            <TreeItem
              key='4'
              nodeId='4'
              label={
                <div className={classes.drawio}>
                  <Typography className={classes.drawioLabel}>
                    Drawio
                  </Typography>
                    <IconButton
                      disableTouchRipple
                      disableFocusRipple
                      edge='start'
                      className={classes.menuButton}
                      onClick={() => generateDrawio()}
                      color='inherit'
                      aria-label='menu'>
                      <OpenInNew className={classes.externalIcon} />
                    </IconButton>
                </div>
              }
              classes={{
                root: classes.selection,
                label: classes.subLabel,
                // selected: classes.selected,
                content: classes.content,
                iconContainer: classes.iconContainer,
                group: classes.group,
              }}
            />
            </Tooltip>
          </TreeItem>
        </TreeView>
      </RootRef>
      {saveJson && (
        <SaveDialog
          title='Download as JSON'
          blob={exportJSON()}
          type='json'
          toggleDialog={() => setSaveJson(!saveJson)}
        />
      )}
      {saveCSV && (
        <ExportTable
          nodes={exportNodes()}
          toggleDialog={() => setSaveCSV(!saveCSV)}
        />
      )}
      {savePNG && (
        <SaveDialog
          title='Download as PNG'
          blob={exportView()}
          type='png'
          toggleDialog={() => setSavePNG(!savePNG)}
        />
      )}
    </>
  );
};
