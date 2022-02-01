import React, { useState } from 'react';

import SaveDialog from '../../Graph/Export/Other/SaveDialog';
import ExportTable from '../../Graph/Export/CSV/ExportDialog';
import { sendDrawioPostRequest } from '../../../API/APIHandler';
import { handleResponse } from '../../../API/Handlers/SettingsGraphQLHandler';
import {
  ExpandableSection,
  Button,
  ColumnLayout,
} from '@awsui/components-react';
import PropTypes from 'prop-types';

const R = require('ramda');

const TreeMenuExportMenu = ({ compound }) => {
  const [expanded, setExpanded] = React.useState([]);
  const [saveJson, setSaveJson] = useState(false);
  const [saveCSV, setSaveCSV] = useState(false);
  const [savePNG, setSavePNG] = useState(false);
  const [error, setError] = useState();

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
    const json = compound.json();
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

  const removeCollapsedNodes = (parents, nodes) =>
    R.filter((e) => !R.includes(e.data.parent, parents), nodes);

  const generateDrawio = async () => {
    const elements = compound.json().elements;
    const parentCollapsed = R.map(
      (x) => x.data.id,
      R.filter((e) => !R.isNil(e.data.collapsedChildren), elements.nodes)
    );
    const nodes = removeCollapsedNodes(parentCollapsed, elements.nodes);
    elements.nodes = R.map((e) => {
      if (e.data.collapsedChildren) {
        e.data.collapsedChildren = [];
        e.data.children = undefined;
        e.data.type = 'resource';

        e.data.hasChildren = false;
      }
      return e;
    }, nodes);

    if (elements.edges) {
      elements.edges = R.map((e) => {
        if (!R.isNil(e.data.originalEnds)) {
          e.data.originalEnds = undefined;
        }
        return e;
      }, elements.edges);
    }
    const query = {
      body: { data: elements },
      processor: (data) => data,
    };
    await sendDrawioPostRequest(query, query.processor)
      .then(handleResponse)
      .then((response) =>
        window.open(response.body, '_blank', 'rel=noreferrer')
      )
      .catch((err) => setError(err));
  };

  return (
    <>
      <ExpandableSection
        className='second-level'
        variant='navigation'
        header='Export'>
        <ColumnLayout columns={1} disableGutters>
          <Button
            variant='link'
            onClick={() => setSavePNG(!savePNG)}
            className='sidepanel-button'>
            PNG
          </Button>
          <Button
            variant='link'
            onClick={() => setSaveCSV(!saveCSV)}
            className='sidepanel-button'>
            CSV
          </Button>
          <Button
            variant='link'
            onClick={() => setSaveJson(!saveJson)}
            className='sidepanel-button'>
            JSON
          </Button>
          <Button
            iconName='external'
            variant='link'
            onClick={generateDrawio}
            className='sidepanel-button'>
            Drawio
          </Button>
        </ColumnLayout>
      </ExpandableSection>
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

TreeMenuExportMenu.propTypes = {
  compound: PropTypes.object.isRequired,
};

export default TreeMenuExportMenu;
