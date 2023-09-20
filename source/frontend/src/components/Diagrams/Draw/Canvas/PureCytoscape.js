// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useEffect, useState} from 'react';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import cola from 'cytoscape-cola';
import gridGuide from 'cytoscape-grid-guide';
import { graphStyle } from './Styling/GraphStyling';
import { useDiagramSettingsState } from '../../../Contexts/DiagramSettingsContext';
import CytoscapeComponent from 'react-cytoscapejs';
import { fetchResources } from './Commands/CanvasCommands';
import { getExpandCollapseGraphLayout } from './Layout/ExpandCollapseLayout';
import { getGridLayout } from './Layout/GridGraphLayout';
import { useResourceState } from '../../../Contexts/ResourceContext';
import expandCollapse from 'cytoscape-expand-collapse'
import * as R  from 'ramda';
import {useWindowSize} from "react-use";

cytoscape.use(fcose);
cytoscape.use(cola);
gridGuide(cytoscape);
expandCollapse(cytoscape);

const PureCytoscape = ({ name, visibility, setRendered }) => {
  const [{selectedResources}, dispatchCanvas] = useDiagramSettingsState();
  const [{graphResources}] = useResourceState();
  const {height} = useWindowSize();
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 400);
  const expandAPI = React.useRef();
  const cyRef = React.useRef();

  useEffect(() => {
    setCanvasHeight(height - 400);
  }, [height, setCanvasHeight]);

  // cleanup cytoscape listeners on unmount
  useEffect(() => {
    return () => {
      if (cyRef.current) {
        cyRef.current.removeAllListeners();
        cyRef.current = null;
      }
    };
  }, []);

  const updateCanvas = useCallback((newCanvas) => {
    dispatchCanvas({
      type: 'setCanvas',
      canvas: newCanvas,
    });
  }, [dispatchCanvas]);

  const updateSelectedResources = useCallback((updated) => {
    dispatchCanvas({
      type: 'setSelectedResources',
      selectedResources: updated,
    });
  }, [dispatchCanvas]);

  const updateResources = useCallback(() => {
    dispatchCanvas({
      type: 'setResources',
      resources: cyRef.current.nodes(),
    });
  }, [dispatchCanvas]);

  const handleTap = useCallback(evt => {
    const node = evt.target;
    node.addClass('selected');
    updateSelectedResources(selectedResources.union(node));
  }, [selectedResources, updateSelectedResources]);

  const handleDoubleTap = useCallback(evt => {
    const node = evt.target;
    cyRef.current.nodes().lock();
    if (R.equals(node.data('type'), 'resource')) {
      fetchResources(
        cyRef.current,
        updateCanvas,
        updateResources,
        R.map(
          (e) => e.data('id'),
          R.chain(
            (r) => (r.isParent() ? r.descendants() : r),
            [node]
          )
        ),
        graphResources,
        {}
      );
    }

    // TODO: https://github.com/iVis-at-Bilkent/cytoscape.js-expand-collapse/issues/140
    // if (expandAPI.current.isCollapsible(node))
    //   expandAPI.current.collapseRecursively(node);
    // else if (expandAPI.current.isExpandable(node))
    //   expandAPI.current.expandRecursively(node);
  }, [graphResources, updateCanvas, updateResources])

  const handleUnselect = useCallback(evt => {
    const node = evt.target;
    node.lock();
    node.removeClass('selected');
    updateSelectedResources(selectedResources.difference(node));
  }, [selectedResources, updateSelectedResources])

  const cyCallback = useCallback((cy) => {
    // These listeners need to be reapplied as they depend on state/context
    cy.removeListener('select', 'node');
    cy.removeListener('dbltap', 'node');
    cy.removeListener('unselect', 'node, node.cy-expand-collapse-collapsed-node');
    cy.on('dbltap', 'node', handleDoubleTap);
    cy.on('select', 'node', handleTap);
    cy.on('unselect', 'node, node.cy-expand-collapse-collapsed-node', handleUnselect);

    // Skip configuring listeners which don't rely on state/context
    if (cyRef.current) return;

    // Initial render setup
    cyRef.current = cy;
    cy.data({ name: name, visibility: visibility });
    cy.minZoom(0.25);
    cy.maxZoom(2.0);
    cy.gridGuide({
      drawGrid: true,
      gridColor: '#dedede',
      snapToAlignmentLocationOnRelease: false,
      parentSpacing: -1,
      geometricGuideline: false,
      parentPadding: true,
      gridStackOrder: -1,
      guidelinesStackOrder: 4,
      resize: true,
      snapToGridDuringDrag: false,
      distributionGuidelines: false,
      snapToGridCenter: false,
      initPosAlignment: true,
      lineWidth: 2.0,
      guidelinesStyle: {
        // Set ctx properties of line. Properties are here:
        strokeStyle: '#8b7d6b', // color of geometric guidelines
        geometricGuidelineRange: 400, // range of geometric guidelines
        range: 100, // max range of distribution guidelines
        minDistRange: 10, // min range for distribution guidelines
        distGuidelineOffset: 10, // shift amount of distribution guidelines
        horizontalDistColor: '#ff0000', // color of horizontal distribution alignment
        verticalDistColor: '#00ff00', // color of vertical distribution alignment
        initPosAlignmentColor: '#0000ff', // color of alignment to initial mouse location
        lineDash: [0, 0], // line style of geometric guidelines
        horizontalDistLine: [0, 0], // line style of horizontal distribution guidelines
        verticalDistLine: [0, 0], // line style of vertical distribution guidelines
        initPosAlignmentLine: [0, 0], // line style of alignment to initial mouse position
      },
    });

    expandAPI.current = cy.expandCollapse(getExpandCollapseGraphLayout());

    cy.selectionType('additive');
    cy.on('resize', () => cy.fit(null, 20));
    cy.on('taphold', '[type = "type"]', function(evt) {
      const node = evt.target;
      node
        .descendants()
        .layout(getGridLayout(node.boundingBox()))
        .run();
    });
    cy.on('tapdragover', 'node', function(evt) {
      const node = evt.target;
      node.unlock();
      node.grabify();
      node.descendants().unlock();
      node.descendants().grabify();
    });
    cy.on('tapdragout', 'node', function(evt) {
      const node = evt.target;
      node.lock();
      node.ungrabify();
      node.descendants().lock();
      node.descendants().ungrabify();
    });
    cy.ready(() => {
      updateSelectedResources(cy.collection());
      cy.nodes().lock();
      updateCanvas(cyRef.current);
      setRendered && setRendered(true);
      const removeHighlight = setTimeout(
        () => cy.elements().removeClass('highlight'),
        2000
      );
      return () => clearTimeout(removeHighlight);
    });
  }, [handleDoubleTap, handleTap, name, visibility, handleUnselect, updateSelectedResources, updateCanvas, setRendered]);

  return (
    <CytoscapeComponent
      cy={cyCallback}
      elements={CytoscapeComponent.normalizeElements([])}
      boxSelectionEnabled
      stylesheet={graphStyle}
      style={{
        maxWidth: '100%',
        maxHeight: `${canvasHeight}px`,
        width: '100%',
        height: `${canvasHeight}px`,
        boxSizing: 'border-box',
        zIndex: 0,
        border: '1px solid #dedede',
      }}
    />
  );
};

export default PureCytoscape;
