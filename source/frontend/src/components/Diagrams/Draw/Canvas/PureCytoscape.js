// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import fcose from 'cytoscape-fcose';
import cola from 'cytoscape-cola';
import cytoscape from 'cytoscape';
import svg from '../../../../cytoscape/plugins/svg';
import {graphStyle} from './Styling/GraphStyling';
import {useDiagramSettingsState} from '../../../Contexts/DiagramSettingsContext';
import {fetchResources} from './Commands/CanvasCommands';
import {getGridLayout} from './Layout/GridGraphLayout';
import {useResourceState} from '../../../Contexts/ResourceContext';
import * as R from 'ramda';
import {useWindowSize} from 'react-use';

import {getExpandCollapseGraphLayout} from './Layout/ExpandCollapseLayout';
import expandCollapse from 'cytoscape-expand-collapse';
import gridGuide from 'cytoscape-grid-guide';
import {useWebGLState} from '../../../Contexts/WebGLContext';

gridGuide(cytoscape);
expandCollapse(cytoscape);

// Register extensions
cytoscape.use(fcose);
cytoscape.use(cola);
cytoscape.use(svg);

export function handleTapHold(evt) {
    const node = evt.target;
    node.descendants().layout(getGridLayout(node.boundingBox())).run();
}

export function handleTapDragOver(evt) {
    const node = evt.target;
    node.unlock();
    node.grabify();
    node.descendants().unlock();
    node.descendants().grabify();
}

export function handleTapDragOut(evt) {
    const node = evt.target;
    node.lock();
    node.ungrabify();
    node.descendants().lock();
    node.descendants().ungrabify();
}

export const handleDoubleTap = R.curry(
    (
        {cy, updateCanvas, updateResources, fetchResources, graphResources},
        evt
    ) => {
        const node = evt.target;
        if (cy) {
            cy.nodes().lock();
            if (R.equals(node.data('type'), 'resource')) {
                const nodes = node.isParent() ? node.descendants() : [node];

                fetchResources(
                    cy,
                    updateCanvas,
                    updateResources,
                    nodes.map(e => e.data('id')),
                    graphResources,
                    {}
                );
            }
        }
    }
);

const PureCytoscape = ({name, visibility, setRendered}) => {
    const [, dispatchCanvas] = useDiagramSettingsState();
    const [{graphResources}] = useResourceState();
    const {webGLEnabled} = useWebGLState();
    const {height} = useWindowSize();
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 325);
    const expandAPI = useRef();
    const cyRef = useRef();
    const previousWebGLEnabled = useRef(webGLEnabled);

    // Create a ref to hold the container element
    const containerRef = useRef(null);

    // Function to check if WebGL is available
    const isWebGLAvailable = useMemo(() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(
                window.WebGLRenderingContext &&
                (canvas.getContext('webgl') ||
                    canvas.getContext('experimental-webgl'))
            );
        } catch (e) {
            console.warn('WebGL not available, using fallback renderer');
            return false;
        }
    }, []);

    useEffect(() => {
        setCanvasHeight(height - 325);
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

    const updateCanvas = useCallback(
        newCanvas => {
            dispatchCanvas({
                type: 'setCanvas',
                canvas: newCanvas,
            });
        },
        [dispatchCanvas]
    );

    const updateSelectedResources = useCallback(
        updated => {
            dispatchCanvas({
                type: 'setSelectedResources',
                selectedResources: updated,
            });
        },
        [dispatchCanvas]
    );

    const updateResources = useCallback(() => {
        dispatchCanvas({
            type: 'setResources',
            resources: cyRef.current.nodes(),
        });
    }, [dispatchCanvas]);

    // Use useEffect to initialize cytoscape directly with WebGL options
    useEffect(() => {
        if (!containerRef.current) return;

        // If cytoscape already exists and webGLEnabled actually changed, destroy and recreate
        if (cyRef.current && previousWebGLEnabled.current !== webGLEnabled) {
            const currentElements = cyRef.current.json().elements;
            // Save viewport state
            const zoom = cyRef.current.zoom();
            const pan = cyRef.current.pan();

            cyRef.current.destroy();
            cyRef.current = null;

            // Update the previous value
            previousWebGLEnabled.current = webGLEnabled;

            // Small delay to ensure proper cleanup
            setTimeout(() => {
                initializeCytoscape(currentElements, {zoom, pan});
            }, 100);
            return;
        }

        // First initialization
        if (!cyRef.current) {
            previousWebGLEnabled.current = webGLEnabled;
            initializeCytoscape();
        }

        function initializeCytoscape(
            existingElements = {nodes: [], edges: []},
            viewport = null
        ) {
            // Create a new Cytoscape instance with conditional WebGL rendering options
            const cy = cytoscape({
                container: containerRef.current,
                elements: existingElements, // Use existing elements if provided
                style: graphStyle,
                renderer: {
                    name: 'canvas',
                    webgl: isWebGLAvailable && webGLEnabled, // Only enable WebGL if browser supports it AND user enabled it
                },
            });

            // Set up all event handlers
            cy.on(
                'dbltap',
                'node',
                handleDoubleTap({
                    cy,
                    fetchResources,
                    updateCanvas,
                    updateResources,
                    graphResources,
                })
            );

            // Handle selection changes - update context whenever selection changes
            cy.on('select', 'node', function (evt) {
                const node = evt.target;
                // Unlock the node when selected so it can be manipulated
                node.unlock();

                // Get all currently selected nodes and update context
                const allSelected = cy.$('node:selected');
                updateSelectedResources(allSelected);
            });

            cy.on(
                'unselect',
                'node, node.cy-expand-collapse-collapsed-node',
                function (evt) {
                    const node = evt.target;
                    // Lock the node when unselected
                    node.lock();

                    // Get all currently selected nodes and update context
                    const allSelected = cy.$('node:selected');
                    updateSelectedResources(allSelected);
                }
            );

            // Store cy instance in ref
            cyRef.current = cy;

            // Initial render setup
            cy.data({name: name, visibility: visibility});
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

            expandAPI.current = cy.expandCollapse(
                getExpandCollapseGraphLayout()
            );

            cy.selectionType('additive');
            cy.on('resize', () => cy.fit(null, 20));
            cy.on('taphold', '[type = "type"]', handleTapHold);
            cy.on('tapdragover', 'node', handleTapDragOver);
            cy.on('tapdragout', 'node', handleTapDragOut);
            cy.ready(() => {
                // Restore viewport if provided
                if (viewport) {
                    cy.viewport({
                        zoom: viewport.zoom,
                        pan: viewport.pan,
                    });
                }

                updateSelectedResources(cy.collection());
                cy.nodes().lock();
                updateCanvas(cyRef.current);
                setRendered?.(true);
                const removeHighlight = setTimeout(
                    () => cy.elements().removeClass('highlight'),
                    2000
                );
                return () => clearTimeout(removeHighlight);
            });
        }
    }, [
        graphResources,
        name,
        visibility,
        updateSelectedResources,
        updateCanvas,
        updateResources,
        setRendered,
        isWebGLAvailable,
        webGLEnabled,
    ]);

    // Return a div with the containerRef instead of CytoscapeComponent
    return (
        <div
            data-testid="wd-cytoscape-canvas"
            ref={containerRef}
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
