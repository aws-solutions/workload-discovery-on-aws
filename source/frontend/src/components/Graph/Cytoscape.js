import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Cytoscape from 'cytoscape';
import gridGuide from 'cytoscape-grid-guide';
import popper from 'cytoscape-popper';
import { useGraphState } from '../Contexts/GraphContext';
import { getHierachicalLinkedNodes } from '../Actions/GraphActions';
import DetailsDialog from './DetailsDialog/DetailsDialog';
import { graphStyle } from './Styling/GraphStyling';
import cola from 'cytoscape-cola';
import { aggregateCostData } from '../../Utils/Resources/CostCalculator';
import HoverDetails from './HoverDetails/HoverDetails';
import CustomSnackbar from '../../Utils/SnackBar/CustomSnackbar';
import ExportTable from './ExportTable/ExportTable';
import $ from 'jquery';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import { makeStyles } from '@material-ui/core/styles';
import { sendDrawioPostRequest } from '../../API/APIHandler';
import CytoscapeComponent, { diff } from 'react-cytoscapejs';

const useStyles = makeStyles((theme) => ({
  graph: { width: '100%', height: `100%` },
}));

var expandCollapse = require('cytoscape-expand-collapse');

Cytoscape.use(cola);
Cytoscape.use(contextMenus, $);
Cytoscape.use(popper);

gridGuide(Cytoscape);
expandCollapse(Cytoscape);

export default ({ toggleShowHistoryDialog }) => {
  const [{ graphResources, graphFilters }, dispatch] = useGraphState();

  const compound = useRef();
  const [showError, setShowError] = useState(false);
  const exportableNodes = useRef([]);
  const api = useRef();
  const selectedNodes = [];
  const [exportingCSV, setExportingCSV] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: 'updateCompound',
      cy: compound.current,
    });
  }, [compound]);

  const removeNodes = (id) => {
    const nodeToDelete = compound.current.filter(function (element, i) {
      return element.isNode() && element.data('id') === id;
    });

    const neighborhood = nodeToDelete.neighborhood();
    compound.current.remove(nodeToDelete);
    neighborhood.forEach((node) => {
      if (node.neighborhood().size() === 0) {
        compound.current.remove(node);
      }
    });
    const elements = compound.current.json().elements;
    if (elements) cleanUpGraph();
    compound.current.remove(nodeToDelete);
    return elements.nodes
      .concat(elements.edges)
      .filter((item) => item !== undefined);
  };

  const cleanUpGraph = () => {
    var nodes = compound.current
      .nodes()
      .sort((a, b) => b.data('level') - a.data('level'));
    nodes.forEach((node) => {
      if (
        !api.current.isExpandable(node) &&
        node.isChildless() &&
        node.data('type') !== 'resource'
      ) {
        compound.current.remove(node);
      } else {
        node.lock();
      }
    });
  };

  const expandNode = async (node) => {
    api.current && api.current.expandAll();

    compound.current.nodes().map(function (ele) {
      ele.removeClass('clicked');
    });

    const params = {
      focusing: true,
      nodeId: node.data('clickedId'),
      deleteDate: node.data('queryDate')
        ? `${node.data('queryDate')}`
        : undefined,
    };
    const response = await getHierachicalLinkedNodes(params);
    if (response.error) {
      setShowError(response.error);
    } else {

      compound.current.nodes().lock();

      compound.current.nodes('.selectable').removeListener('click');
      compound.current.nodes('.hoverover').removeListener('mouseover');
      compound.current.nodes().removeClass('selected');

      let newNodes = compound.current.json().elements.nodes
        ? compound.current.json().elements.nodes
        : [];

      let newEdges = compound.current.json().elements.edges
        ? compound.current.json().elements.edges
        : [];

      response.body.forEach((item) =>
        item.edge || item.group === 'edges'
          ? newEdges.push(item)
          : addNode(newNodes, item)
      );

      newEdges = filterEdges(newEdges);
      newNodes = filterNodes(newNodes);

      return newNodes
        .concat(newEdges)
        .filter((item) =>
          item.data.target === node.data('clickedId') ? false : true
        );
    }
  };

  // const addEdge = (edges, edge) => {

  //   const exists = edges.filter((item) => {
  //     return (
  //       item.data.source === edge.data.target &&
  //       item.data.target === edge.data.source
  //     );
  //   });

  //   if (exists.length === 0) edges.push(edge);
  // };

  const addNode = (nodes, node) => {
    const parentExists = nodes.filter((item) => {
      return item.data.id.includes(`-${node.data.id}`);
    });
    if (parentExists.length === 0) {
      nodes.push(node);
    }
    nodes.forEach((item) => {
      if (item.data.id === node.data.id) {
        if (!item.data.children && node.data.children) {
          const index = nodes.findIndex((e) => e.data.id === item.data.id);
          nodes.splice(index, 1, node);
        }
      }
    });
  };

  const filterNodes = (nodes) => {
    return nodes.filter(
      (node, index, self) =>
        index === self.findIndex((t) => t.data.id === node.data.id)
    );
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
    return edges;
  };

  const findEdge = (edges, source, target) => {
    return edges.findIndex(
      (e) => e.data.source === source && e.data.target === target
    );
  };

  const processChildNodes = (node, nodes) => {
    let recursiveNodes = nodes;
    if (node.children() && node.children().length > 0) {
      node.children().forEach((child) => {
        recursiveNodes.concat(processChildNodes(child, recursiveNodes));
      });
    } else {
      if (api.current.isExpandable(node)) {
        api.current
          .getCollapsedChildrenRecursively(node)
          .forEach((childNode) => {
            recursiveNodes.concat(processChildNodes(childNode, recursiveNodes));
          });
      } else {
        recursiveNodes.push({ data: node.data() });
      }
    }
    return recursiveNodes;
  };

  const getCollapseNodes = (ele) => {
    const nodes = api.current
      .getCollapsedChildrenRecursively(ele)
      .map((node) => {
        return { data: node.data() };
      });
    return nodes;
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
          tooltipText:
            'Remove everything and bring in just this nodes connections',
          selector: '.selectable',
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            if (target.data('clickedId')) {
              const params = {
                focusing: true,
                nodeId: target.data('clickedId'),
              };
              getHierachicalLinkedNodes(params).then((response) => {
                if (response.error) {
                  setShowError(response.error);
                } else {
                  dispatch({
                    type: 'updateGraphResources',
                    graphResources: response.body,
                  });
                }
              });
            }
          },
          hasTrailingDivider: false,
        },
        {
          id: 'expand',
          content: 'Expand',
          tooltipText: 'View Connections to this Node',
          selector: '.selectable',
          onClickFunction: function (event) {
            compound.current.nodes().lock();
            var target = event.target || event.cyTarget;
            if (target.data('clickedId')) {
              expandNode(target).then((response) => {
                dispatch({
                  type: 'updateGraphResources',
                  graphResources: response,
                });
              });
            }
          },
          hasTrailingDivider: false,
        },
        // {
        //   id: 'expandSelected',
        //   content: 'Expand Selected',
        //   tooltipText: 'View Connections to these Node',
        //   selector: '.selectable',
        //   onClickFunction: (event) => {
        //     let expanded = [];
        //     let requests = [];
        //     selectedNodes.forEach(async (node) => {
        //       requests.push(expandNode(node).then((response) => response));
        //     });
        //     Promise.all(requests).then((values) => {
        //       values.forEach((value) => {
        //         expanded = expanded.concat(value);
        //       });

        //       dispatch({
        //         type: 'updateGraphResources',
        //         graphResources: expanded,
        //       });
        //     });
        //   },
        //   hasTrailingDivider: false,
        // },
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

        // {
        //   id: 'history',
        //   content: 'Query Historical Data',
        //   tooltipText:
        //     'Query the historical data of this node to see how it has changed',
        //   selector: '.selectable',
        //   onClickFunction: function (event) {
        //     var target = event.target || event.cyTarget;
        //     if (target.data('clickedId')) {
        //       const removeElements = (elms) =>
        //         elms.forEach((el) => el.remove());
        //       removeElements(document.querySelectorAll('.hoverOver'));
        //       toggleShowHistoryDialog(target);
        //     }
        //   },
        //   hasTrailingDivider: false,
        // },
        {
          id: 'View',
          content: 'Show Details',
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

        // {
        //   id: 'Export',
        //   content: 'Export as CSV',
        //   tooltipText: 'Export everything in the bounding box as a CSV',
        //   selector: '.removeAll',
        //   onClickFunction: function (event) {
        //     var target = event.target || event.cyTarget;
        //     if (target) {
        //       exportableNodes.current = {
        //         title: target.data('title'),
        //         nodes: api.current.isExpandable(target)
        //           ? getCollapseNodes(target)
        //           : processChildNodes(target, []),
        //       };
        //       setExportingCSV(!exportingCSV);
        //     }
        //   },
        //   hasTrailingDivider: false,
        // },
        {
          id: 'clear',
          content: 'Clear Diagram',
          selector: '.removeAll',
          coreAsWell: true,
          onClickFunction: function (event) {
            dispatch({
              type: 'clearGraph',
            });
          },
          hasTrailingDivider: false,
        },
        {
          id: 'fit',
          content: 'Fit to View',
          coreAsWell: true,
          onClickFunction: function (event) {
            compound.current.fit(50);
            compound.current.center();
          },
          hasTrailingDivider: true,
        },
      ],
      menuItemClasses: ['custom-menu-item'],
      contextMenuClasses: ['custom-context-menu'],
    };
  };

  const setCompoundState = (cy) => {
    cy.minZoom(0.5);
    cy.maxZoom(2.5);
    cy.gridGuide({
      drawGrid: true,
      snapToAlignmentLocationOnRelease: true,
      parentSpacing: -1,
      geometricGuideline: false,
      parentPadding: true,
      gridStackOrder: -1,
      guidelinesStackOrder: -1,
      resize: true,
      snapToGridDuringDrag: false,
      distributionGuidelines: true,
      lineWidth: 2.0,
    });

    cy.removeListener('cxttapstart');
    cy.contextMenus(getContextMenu());
    // cy.cxtmenu(getNodeContextMenuOptions());
    // cy.cxtmenu(getBoundingBoxContextMenuOptions());
    // cy.cxtmenu(getCoreContextMenu());

    cy.nodes('.hoverover').removeListener('mouseover');
    cy.nodes('.hoverover').on('mouseover', function (event) {
      let node = event.target;
      let popper = node.popper({
        content: () => {
          const removeElements = (elms) => elms.forEach((el) => el.remove());
          removeElements(document.querySelectorAll('.hoverOver'));
          const div = document.createElement('div');
          ReactDOM.render(<HoverDetails node={node} />, div);
          div.className = 'hoverOver';
          document.body.appendChild(div);
          return div;
        },
        renderedPosition: (event) => {
          return {
            x:
              event.position('x') < window.innerWidth / 2
                ? document.getElementById('sidepanel-true')
                  ? window.innerWidth - 280
                  : window.innerWidth
                : document.getElementById('sidepanel-true')
                ? 150
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

    // cy.on('click', 'node', function (event) {
    //   if (selectedNodes.indexOf(event.target) === -1) {
    //     selectedNodes.push(event.target);
    //     event.target.addClass('selected');
    //   } else {
    //     selectedNodes.splice(selectedNodes.indexOf(event.target), 1);
    //     event.target.removeClass('selected');
    //   }
    // });
    //

    compound.current = cy;
  };

  const layout = {
    name: 'cola',
    padding: 100,
    maxSimulationTime: 3000,
    randomize: true,
    animate: true,
    handleDisconnected: true,
    nodeSpacing: function (node) {
      return 10;
    },
    // flow: { axis: 'y', minSeparation: 15 },
    fit: true,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true,
    ungrabifyWhileSimulating: true,

    /* layout event callbacks */
    ready: () => {
      // compound.current &&
      //   compound.current.nodes().map(function (ele) {
      //     if (ele.data('node') && ele.data('node').highlight) {
      //       ele.addClass('highlight');
      //     }
      //   });
      if (!compound.current.expandCollapse('get')) {
        api.current = compound.current.expandCollapse({
          layoutBy: {
            name: 'cola',
            padding: 15,
            maxSimulationTime: 3000,
            randomize: true,
            animate: true,
            handleDisconnected: true,
            animate: true,
            fit: true,
            avoidOverlap: true,
            nodeDimensionsIncludeLabels: true,
            ungrabifyWhileSimulating: true,
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
      // compound.current && compound.current.center();
      // compound.current && compound.current.boxSelectionEnabled(true);
    }, // on layoutready
    stop: () => {
      // compound.current.autolock(true);

      graphResources.map((resource) => {
        if (
          !resource.edge &&
          resource.data.properties &&
          graphFilters.typeFilters.indexOf(
            resource.data.properties.resourceType
          ) >= 0
        ) {
          removeNodes(resource.data.id);
        }
      });

      compound.current && compound.current.center();
      // compound.current && compound.current.boxSelectionEnabled(true);
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
    return aggregateCostData(resources.filter((resource) => !resource.edge));
  };

  calculateCost(graphResources);

  //lock the nodes to stop them repositioning on sidebar expand
  compound.current && compound.current.nodes().lock();
  return (
    <div style={{ height: 'calc(100% - 64px)', width: '100%' }}>
      <CytoscapeComponent
        elements={graphResources}
        layout={layout}
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
