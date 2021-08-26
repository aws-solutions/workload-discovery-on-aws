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

export default ({ compound }) => {
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
      body: {data: compound.json().elements},
      processor: (data) => data,
    };
    await sendDrawioPostRequest(query, query.processor)
      .then(handleResponse)
      .then((response) => window.open(response.body, '_blank', 'rel=noreferrer'))
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
