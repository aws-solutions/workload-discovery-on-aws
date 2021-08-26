import React, { useState, useEffect } from 'react';
import DiagramTable from './DiagramTable';
import { previewStyle } from '../../../../Graph/Styling/GraphStyling';
import Cytoscape from 'cytoscape';
import { useGraphState } from '../../../../Contexts/GraphContext';
import {
  listObjects,
  uploadObject,
  getObject,
  removeObject,
} from '../../../../../API/Storage/S3Store';

import {
  ColumnLayout,
  Grid,
  Container,
  Input,
  FormField,
  SpaceBetween,
  Header,
  Form,
  Button,
} from '@awsui/components-react';
import Flashbar from '../../../../../Utils/Flashbar/Flashbar';

const validFilename = require('valid-filename');
const R = require('ramda');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const columns = [
  {
    id: 'name',
    header: 'Name',
    cell: (e) => e.name,
    width: 150,
    minWidth: 150,
  },
  {
    id: 'modified',
    header: 'Last modified',
    cell: (e) =>
      R.isNil(e.modified) ? 'No data' : dayjs(e.modified).fromNow(),
    width: 150,
    minWidth: 150,
  },
];

function createData(id, name, modified) {
  return {
    id,
    name,
    modified,
  };
}

export default ({ toggleDialog, level }) => {
  const compound = React.useRef();
  const [{ graphResources }, dispatch] = useGraphState();
  const [maps, setMaps] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [selectedDiagrams, setSelectedDiagrams] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState();

  useEffect(() => {
    Promise.resolve(listObjects('maps/', level))
      .then(processMaps)
      .catch((err) => setError(err));
  }, []);

  function processMaps(result) {
    setMaps(
      result
        .filter((map) => {
          return map.key.split('/')[map.key.split('/').length - 1] !== '';
        })
        .map((key, index) => {
          return {
            id: index,
            name: key.key.split('/')[key.key.split('/').length - 1],
            modified: key.lastModified,
          };
        })
    );
  }

  const layout = {
    name: 'fcose',
    // 'draft', 'default' or 'proof'
    // - "draft" only applies spectral layout
    // - "default" improves the quality with incremental layout (fast cooling rate)
    // - "proof" improves the quality with incremental layout (slow cooling rate)
    quality: 'proof',
    // Use random node positions at beginning of layout
    // if this is set to false, then quality option must be "proof"
    randomize: false,
    // Whether or not to animate the layout
    animate: true,
    // Duration of animation in ms, if enabled
    animationDuration: 1500,
    // Easing of animation, if enabled
    animationEasing: undefined,
    // Fit the viewport to the repositioned nodes
    fit: true,
    // Padding around layout
    padding: 30,
    // Whether to include labels in node dimensions. Valid in "proof" quality
    nodeDimensionsIncludeLabels: true,
    // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
    uniformNodeDimensions: true,
    // Whether to pack disconnected components - valid only if randomize: true
    packComponents: true,
    // Layout step - all, transformed, enforced, cose - for debug purpose only
    step: 'all',

    /* spectral layout options */

    // False for random, true for greedy sampling
    samplingType: true,
    // Sample size to construct distance matrix
    sampleSize: 25,
    // Separation amount between nodes
    nodeSeparation: 200,
    // Power iteration tolerance
    piTol: 0.0000001,

    /* incremental layout options */

    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: (node) => 4500,
    // Ideal edge (non nested) length
    idealEdgeLength: (edge) => 50,
    // Divisor to compute edge forces
    edgeElasticity: (edge) => 0.45,
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 0.1,
    // Maximum number of iterations to perform
    numIter: 2500,
    // For enabling tiling
    tile: true,
    // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingVertical: 10,
    // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingHorizontal: 10,
    // Gravity force (constant)
    gravity: 0.25,
    // Gravity range (constant) for compounds
    gravityRangeCompound: 1.5,
    // Gravity force (constant) for compounds
    gravityCompound: 1.0,
    // Gravity range (constant)
    gravityRange: 3.8,
    // Initial cooling factor for incremental layout
    initialEnergyOnIncremental: 0.3,

    /* constraint options */

    // Fix desired nodes to predefined positions
    // [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
    fixedNodeConstraint: undefined,
    // Align desired nodes in vertical/horizontal direction
    // {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
    alignmentConstraint: undefined,
    // Place two nodes relatively in vertical/horizontal direction
    // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
    relativePlacementConstraint: undefined,

    /* layout event callbacks */
    stop: () => {
      compound.current.fit();
      compound.current.minZoom(0.3);
      compound.current.maxZoom(2.0);
    }, // on layoutstop
  };

  const getRows = () => {
    return maps.map((map) => createData(map.id, map.name, map.modified));
  };

  const createCytoscape = (key) => {
    getObject(`maps/${key}`, level)
      .then((resources) => {
        compound.current = Cytoscape({
          elements: resources,
          style: previewStyle,
          layout: layout,
          container: document.getElementById('preview'),
        });
      })
      .catch((err) => setError(err));
  };

  const openMap = () => {
    getObject(`maps/${R.head(selectedDiagrams).name}`, level)
      .then((resources) => {
        dispatch({
          type: 'updateGraphResources',
          graphResources: R.clone(resources),
        });
        toggleDialog();
      })
      .catch((err) => setError(err));
  };

  const handleDelete = async () =>
    removeObject(`maps/${R.head(selectedDiagrams).name}`, level)
      .then(() => {
        listObjects('maps/', level)
          .then((result) => {
            processMaps(result);
            setDeleting(false);
            setSelectedDiagrams([]);
          })
          .catch((err) => setError(err));
      })
      .catch((error) => console.error(error));

  const handleSave = async () => {
    await uploadObject(
      `maps/${value}`,
      JSON.stringify(
        R.map((e) => {
          e.locked = true;
          return e;
        }, graphResources)
      ),
      level,
      'application/json'
    ).catch((err) => setError(err));

    listObjects('maps/', level)
      .then(processMaps)
      .then(setValue(''))
      .catch((err) => setError(err));
  };

  const handleInput = (input) => {
    const map = R.find(R.propEq('name', input), maps);
    setSelectedDiagrams(map ? [map] : []);
    setValue(input);
  };

  const diagramExists = () =>
    R.filter((e) => R.equals(e.name, value), maps).length > 0;

  const isValidFilename = () => validFilename(value);

  const handleSelection = (e) => {
    setSelectedDiagrams(e);
    createCytoscape(R.head(e).name);
  };

  return (
    <>
      {error && (
        <Flashbar
          type='error'
          message='We could not process that request. It could be a temporary issue. Please try again.'
        />
      )}
      <SpaceBetween direction='vertical' size='l'>
        <Container
          header={
            <Header
              variant='h2'
              actions={
                <Button
                  onClick={handleSave}
                  disabled={!diagramExists() && !isValidFilename()}
                  variant='primary'>
                  {!diagramExists() ? 'Save' : 'Overwrite'}
                </Button>
              }>
              Save diagram
            </Header>
          }>
          <FormField label='Name'>
            <Input
              type='text'
              onChange={({ detail }) => handleInput(detail.value)}
              value={value}
              placeholder='Give your architecture diagram a name...'
            />
          </FormField>
        </Container>

        <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <DiagramTable
            header='Architecture diagrams'
            trackBy='id'
            rows={getRows()}
            columns={columns}
            pageSize={10}
            textFilter={true}
            selectedItems={selectedDiagrams}
            onSelectionChange={handleSelection}
            handleDelete={handleDelete}
            handleOpen={openMap}
          />
          <div
            id='preview'
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              border: '1px solid rgba(224, 224, 224, 1)',
            }}></div>
        </Grid>
      </SpaceBetween>
    </>
  );
};
