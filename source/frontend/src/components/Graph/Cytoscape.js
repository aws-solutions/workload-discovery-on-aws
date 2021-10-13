import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import Cytoscape from 'cytoscape';
import gridGuide from 'cytoscape-grid-guide';
import popper from 'cytoscape-popper';
import { useGraphState } from '../Contexts/GraphContext';
import DetailsDialog from './DetailsDialog/DetailsDialog';
import { graphStyle } from './Styling/GraphStyling';
import { aggregateCostData } from '../../Utils/Resources/CostCalculator';
import HoverDetails from './HoverDetails/HoverDetails';
import $ from 'jquery';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import CytoscapeComponent from 'react-cytoscapejs';
import CostOverview from '../Drawer/Costs/Report/CostOverview';
import { CostsProvider, useCostsState } from '../Contexts/CostsContext';
import fcose from 'cytoscape-fcose';
import {
  getLinkedNodesHierarchy,
  sendGetRequests,
  wrapGetLinkedNodesHierachyRequest,
} from '../../API/Handlers/ResourceGraphQLHandler';
import { handleSelectedResource } from '../../API/Processors/NodeProcessors';
import { processHierarchicalNodeData } from '../../API/APIProcessors';
import { costsReducer } from '../Contexts/Reducers/CostsReducer';
import { useResourceState } from '../Contexts/ResourceContext';

const R = require('ramda');
let expandCollapse = require('cytoscape-expand-collapse');

Cytoscape.use(contextMenus, $);
Cytoscape.use(popper);
Cytoscape.use(fcose);

gridGuide(Cytoscape);
expandCollapse(Cytoscape);

export default () => {
  const [{ graphResources, graphFilters }, dispatch] = useGraphState();
  const [{ costPreferences }, costDispatch] = useCostsState();
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const compound = useRef();
  const [error, setError] = useState(false);
  const api = useRef();

  const removeNodes = (id) => {
    const nodeToDelete = compound.current.filter(function (element, i) {
      return element.isNode() && element.data('id') === id;
    });

    const neighborhood = nodeToDelete.neighborhood();
    compound.current.remove(nodeToDelete);
    neighborhood.forEach((node) => {
      if (node.neighborhood().size() === 0 && !node.data('selected')) {
        compound.current.remove(node);
      }
    });
    const elements = compound.current.json().elements;
    if (elements) cleanUpGraph();
    compound.current.remove(nodeToDelete);
    return (
      elements &&
      elements.nodes &&
      elements.nodes.concat(elements.edges).filter((item) => item !== undefined)
    );
  };

  const isResource = R.equals('resource');
  const isVPC = R.equals('vpc');
  const isSubnet = R.equals('subnet');
  const isAvailabiltyZone = R.equals('availabiltyZone');
  const isSpecialType = R.anyPass([
    isResource,
    isVPC,
    isSubnet,
    isAvailabiltyZone,
  ]);

  React.useEffect(() => {
    dispatch({
      type: 'updateCompound',
      cy: compound.current,
    });
  }, [compound.current]);

  const cleanUpGraph = () => {
    var nodes = compound.current
      .nodes()
      .sort((a, b) => b.data('level') - a.data('level'));
    nodes.forEach((node) => {
      if (
        !api.current.isExpandable(node) &&
        node.isChildless() &&
        !isSpecialType(node.data('type'))
      ) {
        compound.current.remove(node);
      } else {
        node.lock();
      }
    });
  };

  const expandNode = async (nodes) => {
    api.current && api.current.expandAll();

    compound.current.nodes().map(function (ele) {
      ele.removeClass('clicked');
    });
    compound.current.nodes().lock();

    // compound.current.nodes('.selectable').removeListener('click');
    compound.current.nodes('.hoverover').removeListener('mouseover');
    compound.current.nodes().removeClass('selected');
    sendGetRequests(
      R.map(
        (e) =>
          wrapGetLinkedNodesHierachyRequest(
            getLinkedNodesHierarchy,
            {
              id: e,
            },
            e,
            costPreferences,
            graphResources
          )
            .then((node) =>
              handleSelectedResource(
                processHierarchicalNodeData(
                  R.pathOr(
                    [],
                    ['body', 'data', 'getLinkedNodesHierarchy'],
                    node
                  ),
                  e,
                  costPreferences
                ),
                e,
                graphResources
              )
            )
            .catch((err) => {
              setError(err);
            }),
        R.is(Array, nodes)
          ? R.map((e) => e.data('id'), nodes)
          : [nodes.data('clickedId')]
      )
    )
      .then((e) => Promise.all(e))
      .then(R.flatten)
      .then((items) =>
        R.concat(
          filterEdges(R.filter((e) => e.edge, items)),
          filterNodes(R.filter((e) => !e.edge, items))
        )
      )
      .then((nodes) => {
        dispatch({
          type: 'updateGraphResources',
          graphResources: nodes,
        });
      });
  };

  const uniqId = (a, b) => R.equals(a.data.id, b.data.id);

  const filterNodes = (nodes) => {
    return R.uniqWith(uniqId, nodes);
  };

  const filterEdges = (edges) => {
    edges.forEach((edge, index) => {
      if (edge.data.isSourceParent) {
        edge.data.sourceMetadata.childIds.forEach((childId) => {
          const edgeExists = findEdge(edges, childId, edge.data.target);
          if (edgeExists >= 0) {
            edges.splice(index, 1);
          }
        });
      }
    });
    edges.forEach((edge, index) => {
      const swappedEdge = findEdge(edges, edge.data.target, edge.data.source);
      if (swappedEdge >= 0) {
        edges.splice(index, 1);
      }
    });

    return R.filter(
      (e) =>
        !R.or(
          R.includes(e.data.sourceMetadata.type, graphFilters.typeFilters),
          R.includes(e.data.targetMetadata.type, graphFilters.typeFilters)
        ),
      edges
    );
  };

  const findEdge = (edges, source, target) => {
    return edges.findIndex(
      (e) => e.data.source === source && e.data.target === target
    );
  };

  const getContextMenu = () => {
    return {
      menuItems: [
        {
          id: 'showAll',
          content: 'Show All',
          tooltipText: 'Expands this box to show all the nodes within it',
          selector: 'node.cy-expand-collapse-collapsed-node',
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            if (target) {
              compound.current.nodes().map(function (ele) {
                ele.lock();
                ele.removeClass('clicked');
                ele.removeClass('highlight');
              });
              api.current.expandRecursively(target);
              compound.current.nodes().map(function (ele) {
                ele.unlock();
              });
            }
          },
          hasTrailingDivider: false,
        },
        {
          id: 'focus',
          content: 'Focus',
          tooltipText: `Remove everything and bring in just this resource's relationships`,
          selector: '.selectable',
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            if (target.data('clickedId')) {
              dispatch({
                type: 'clearGraph',
              });
              sendGetRequests(
                R.map(
                  (e) =>
                    wrapGetLinkedNodesHierachyRequest(
                      getLinkedNodesHierarchy,
                      {
                        id: e,
                      },
                      e,
                      costPreferences,
                      []
                    )
                      .then((node) =>
                        handleSelectedResource(
                          processHierarchicalNodeData(
                            R.pathOr(
                              [],
                              ['body', 'data', 'getLinkedNodesHierarchy'],
                              node
                            ),
                            e,
                            costPreferences
                          ),
                          e,
                          []
                        )
                      )
                      .catch((err) => {
                        console.error(err);
                        setError(err);
                      }),
                  [target.data('clickedId')]
                )
              )
                .then((e) => Promise.all(e))
                .then(R.flatten)
                .then((nodes) => {
                  dispatch({
                    type: 'updateGraphResources',
                    graphResources: nodes,
                  });
                });
            }
          },
          hasTrailingDivider: false,
        },
        {
          id: 'currentNode',
          content: 'Expand',
          tooltipText: 'View relationships to this resources',
          selector: '.selectable',
          onClickFunction: function (event) {
            compound.current.nodes().lock();
            var target = event.target || event.cyTarget;
            if (target.data('clickedId')) {
              expandNode(target);
            }
          },
          hasTrailingDivider: false,
          show:
            compound.current &&
            compound.current.$(':selected').filter(function (element) {
              return (
                element.isNode() && R.equals(element.data('type'), 'resource')
              );
            }).length === 0,
        },
        {
          id: 'expand',
          content: 'Expand',
          tooltipText: 'Fetch related resources',
          selector: '.selectable',
          hasTrailingDivider: true,
          show:
            compound.current &&
            compound.current.$(':selected').filter(function (element) {
              return (
                element.isNode() && R.equals(element.data('type'), 'resource')
              );
            }).length > 0,
          submenu: [
            {
              id: 'expandSelected',
              content: 'Selected resources',
              tooltipText: 'View relationships to the selected resources',
              selector: '.selectable',
              onClickFunction: () => {
                expandNode(
                  compound.current.$(':selected').filter(function (element) {
                    return (
                      element.isNode() &&
                      R.equals(element.data('type'), 'resource')
                    );
                  })
                );
              },
              hasTrailingDivider: true,
            },
            {
              id: 'currentNode',
              content: 'This resource',
              tooltipText: 'View relationships to this resource',
              selector: '.selectable',
              onClickFunction: function (event) {
                compound.current.nodes().lock();
                var target = event.target || event.cyTarget;
                if (target.data('clickedId')) {
                  expandNode(target);
                }
              },
              hasTrailingDivider: false,
            },
          ],
        },
        {
          id: 'remove',
          content: selectedNodes.length > 0 ? 'Remove Selected' : 'Remove',
          tooltipText: selectedNodes.length > 0 ? 'Remove Selected' : 'Remove',
          selector: '.selectable',
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            if (target.data('clickedId')) {
              dispatch({
                type: 'updateGraphResources',
                graphResources: removeNodes(target.data('clickedId')),
              });
            }
          },
          hasTrailingDivider: false,
        },
        {
          id: 'collapse',
          content: 'Collapse All',
          tooltipText:
            'Collapses everything in this box to hide all the nodes within it',
          selector: 'node[type != "resource"] node:parent',
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            if (target) {
              compound.current.nodes().map(function (ele) {
                ele.lock();
                ele.removeClass('clicked');
                ele.removeClass('highlight');
              });
              api.current.collapseRecursively(target);
              compound.current.nodes().map(function (ele) {
                ele.unlock();
              });
            }
          },
          hasTrailingDivider: false,
        },
        {
          id: 'removeAll',
          content: 'Remove All',
          selector: '.removeAll',
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            if (target) {
              compound.current.remove(target.children());
              cleanUpGraph();
              compound.current.remove(target);
              let resources = [];
              const elements = compound.current.json().elements;
              if (Object.keys(elements).length > 0) {
                resources = elements.edges
                  ? elements.nodes.concat(elements.edges)
                  : elements.nodes;
              }
              dispatch({
                type: 'updateGraphResources',
                graphResources: resources,
              });
            }
          },
          hasTrailingDivider: false,
        },
        {
          id: 'details',
          content: 'Show resource details',
          tooltipText: 'View more details on this resource',
          selector: '.selectable',
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            if (target.data('clickedId')) {
              const div = document.createElement('div');
              ReactDOM.render(
                <DetailsDialog selectedNode={event.target} />,
                div
              );
              div.className = 'clickedNode';
              document.body.appendChild(div);
            }
          },
          hasTrailingDivider: false,
        },
        {
          id: 'view',
          content: 'Diagram',
          coreAsWell: true,
          onClickFunction: function (event) {
            compound.current.edges().addClass('hidden');
          },
          hasTrailingDivider: true,
          show: !R.isEmpty(graphResources),
          selector: '.removeAll',

          submenu: [
            {
              id: 'redraw',
              content: 'Group resources',
              coreAsWell: true,
              onClickFunction: function () {
                compound.current.nodes().layout(layout).run();
                compound.current.edges().addClass('hidden');
              },
              hasTrailingDivider: true,
            },
            {
              id: 'edges',
              content: 'Edges',
              coreAsWell: true,
              onClickFunction: function (event) {
                compound.current.edges().addClass('hidden');
              },
              show:
                !R.isEmpty(graphResources) &&
                !R.isEmpty(R.filter((e) => e.edge, graphResources)),
              hasTrailingDivider: true,
              submenu: [
                {
                  id: 'showEdges',
                  content: 'Show',
                  coreAsWell: true,
                  onClickFunction: function (event) {
                    compound.current.edges().removeClass('hidden');
                  },
                  hasTrailingDivider: true,
                },
                {
                  id: 'hideEdges',
                  content: 'Hide',
                  coreAsWell: true,
                  onClickFunction: function (event) {
                    compound.current.edges().addClass('hidden');
                  },
                  hasTrailingDivider: true,
                },
              ],
            },
            {
              id: 'fit',
              content: 'Fit',
              coreAsWell: true,
              onClickFunction: function () {
                compound.current.fit(50);
                compound.current.center();
              },
              hasTrailingDivider: true,
            },
            {
              id: 'clear',
              content: 'Clear',
              selector: '.removeAll',
              coreAsWell: true,
              onClickFunction: function () {
                dispatch({
                  type: 'clearGraph',
                });
              },
              hasTrailingDivider: true,
            },
          ],
        },

        {
          id: 'costs',
          content: 'Costs & usage',
          coreAsWell: true,
          hasTrailingDivider: true,
          show: !R.isEmpty(graphResources) && costPreferences.processCosts,
          submenu: [
            {
              id: 'costs',
              content: 'Cost report',
              selector: '.removeAll',
              coreAsWell: true,
              onClickFunction: function (event) {
                const div = document.createElement('div');
                ReactDOM.render(
                  <CostOverview
                    resources={graphResources}
                    costDispatch={costDispatch}
                    costPreferences={costPreferences}
                  />,
                  div
                );
                div.className = 'clickedNode';
                document.body.appendChild(div);
              },
              hasTrailingDivider: true,

              show: !R.isEmpty(graphResources) && costPreferences.processCosts,
            },
          ],
        },
      ],
    };
  };

  const setCompoundState = (cy) => {
    cy.minZoom(0.25);
    cy.maxZoom(2.5);
    cy.gridGuide({
      drawGrid: true,
      snapToAlignmentLocationOnRelease: false,
      parentSpacing: -1,
      geometricGuideline: false,
      parentPadding: true,
      gridStackOrder: -1,
      guidelinesStackOrder: -1,
      resize: true,
      snapToGridDuringDrag: false,
      distributionGuidelines: false,
      snapToGridCenter: false,
      initPosAlignment: true,
      lineWidth: 2.0,
    });

    cy.removeListener('cxttapstart');
    cy.contextMenus(getContextMenu());
    cy.removeListener('tap');
    cy.selectionType('additive');
    cy.filter(function (element) {
      return element.isNode() && R.equals(element.data('type'), 'resource');
    }).on('select', (event) => {
      event.target.addClass('selected');
      cy.contextMenus(getContextMenu());
      compound.current = cy;
    });
    cy.filter(function (element) {
      return element.isNode() && R.equals(element.data('type'), 'resource');
    }).on('unselect', (event) => {
      event.target.removeClass('selected');
      cy.contextMenus(getContextMenu());
      compound.current = cy;
    });

    cy.nodes('.hoverover').removeListener('mouseover');
    cy.nodes('.hoverover').on('mouseover', function (event) {
      let node = event.target;
      let popper = node.popper({
        content: () => {
          const removeElements = (elms) => elms.forEach((el) => el.remove());
          removeElements(document.querySelectorAll('.hoverOver'));
          const div = document.createElement('div');
          ReactDOM.render(<HoverDetails selectedNode={node} />, div);
          div.className = 'hoverOver';
          document.body.appendChild(div);
          return div;
        },
        renderedPosition: (event) => {
          return {
            x:
              event.renderedPosition('x') < window.innerWidth / 2
                ? document.getElementById('sidepanel-true')
                  ? window.innerWidth - 280
                  : window.innerWidth
                : document.getElementById('sidepanel-true')
                ? 180
                : 0,
            y: -5,
          };
        },
      });

      let destroy = () => {
        const removeElements = (elms) => elms.forEach((el) => el.remove());
        removeElements(document.querySelectorAll('.hoverOver'));
        popper.destroy();
      };
      node.on('mouseout', destroy);
    });

    compound.current = cy;
  };

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
    animationDuration: 500,
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
    ready: () => {
      if (compound.current && !compound.current.expandCollapse('get')) {
        api.current = compound.current.expandCollapse({
          layoutBy: {
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
          },
          cueEnabled: false,
          fisheye: false,
          animate: true,
          undoable: false,
          expandCollapseCuePosition: 'top-left', // default cue position is top left you can specify a function per node too
          expandCollapseCueSize: 12, // size of expand-collapse cue
          expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
        });
      }
    }, // on layoutready
    stop: () => {
      graphResources.map((resource) => {
        if (
          !resource.edge &&
          !resource.data.selected &&
          resource.data.properties &&
          graphFilters.typeFilters.indexOf(
            resource.data.properties.resourceType
          ) >= 0
        ) {
          removeNodes(resource.data.id);
        }

        const nodePosition = compound.current.filter(function (element, i) {
          return element.isNode() && element.data('id') === resource.data.id;
        });
        resource.position = nodePosition.position();
      });

      compound.current && compound.current.center();
      compound.current && compound.current.nodes().unlock();
      const removeHighlight = setTimeout(() => {
        compound.current &&
          compound.current.nodes().map(function (ele) {
            ele.removeClass('highlight');
          });
        compound.current &&
          compound.current.edges().map(function (ele) {
            ele.removeClass('highlight');
          });
      }, 5000);
      return () => clearTimeout(removeHighlight);
    }, // on layoutstop
  };

  const calculateCost = (resources) => {
    return aggregateCostData(R.filter((resource) => !resource.edge, resources));
  };

  costPreferences.processCosts && calculateCost(graphResources);

  compound.current && compound.current.nodes().lock();

  return (
    <div style={{ height: 'calc(100% - 64px)', width: '100%' }}>
      <CytoscapeComponent
        elements={graphResources}
        layout={layout}
        boxSelectionEnabled
        stylesheet={graphStyle}
        style={{
          maxWidth: '100vw',
          maxHeight: '100%',
          width: '100vw',
          height: '100%',
        }}
        cy={(cy) => {
          setCompoundState(cy);
        }}
      />
    </div>
  );
};
