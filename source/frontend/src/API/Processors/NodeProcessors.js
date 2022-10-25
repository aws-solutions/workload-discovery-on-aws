import {
  getCostForResource,
  wrapCostAPIRequest,
} from '../Handlers/CostsGraphQLHandler';
import { buildNode, buildBoundingBox } from '../NodeFactory/NodeFactory';
import * as R from "ramda";

const getARN = (node) =>
  node.properties ? node.properties.arn : node.data.properties.arn;

export const processChildNodes = (
  node,
  nodes,
  level,
  parent,
  selectedNodeId
) => {
  try {
    let recursiveNodes = nodes;
    if (node.children && node.children.length > 0) {
      const boundingBox = buildBoundingBox(node, parent, level);
      recursiveNodes.push(boundingBox);
      ++level;
      node.children.forEach((child) => {
        recursiveNodes.concat(
          processChildNodes(
            child,
            recursiveNodes,
            level,
            boundingBox.data.id,
            selectedNodeId
          )
        );
      });
    } else {
      recursiveNodes.push(
        buildNode(
          node,
          parent,
          level,
          R.or(
            R.equals(getARN(node), selectedNodeId),
            R.equals(node.id, selectedNodeId)
          )
        )
      );
    }
    return recursiveNodes;
  } catch (e) {
    return [];
  }
};

const getCostsForARNs = (resourceIds, preferences) => {
  return wrapCostAPIRequest(getCostForResource, {
    costForResourceQuery: {
      pagination: { start: 0, end: resourceIds.length },
      resourceIds: resourceIds,
      period: {
        from: preferences.period.startDate,
        to: preferences.period.endDate,
      },
    },
  });
};

const updateNodesWithCost = (costs, nodes) => {
  R.forEach((e) => {
    R.forEach((n) => {
      if (R.hasPath(['data', 'resourceId'], n)) {
        if (R.includes(e.line_item_resource_id, n.data.resourceId)) {
          n.data.cost = parseFloat(e.cost).toFixed(2);
        }
      }
    }, nodes);
  }, R.pathOr([], ['body', 'data', 'getCostForResource', 'costItems'], costs));
  return nodes;
};

export const fetchCosts = (nodes, preferences) =>
  Promise.resolve(
    R.filter((e) => {
      return (
        R.hasPath(['data', 'type'], e) &&
        R.equals(e.data.type, 'resource') &&
        R.hasPath(['data', 'resource', 'arn'], e) &&
        !R.isEmpty(e.data.resourceId)
      );
    }, nodes)
  )
    .then((x) =>
      R.filter(
        (y) => !R.isNil(y),
        R.flatten(R.map((e) => e.data.resourceId, x))
      )
    )
    .then((e) => getCostsForARNs(e, preferences))
    .then((e) => updateNodesWithCost(e, nodes));

const getDuplicateNodes = (currentResources, newResources) => {
  const nodesToDelete = [];
  R.forEach((e) => {
    R.forEach((n) => {
      if (R.equals(n.data.id, e.data.id)) {
        nodesToDelete.push(n.data.id);
      }
    }, currentResources);
  }, newResources);
  return nodesToDelete;
};
export const handleSelectedResource = (
  response,
  nodeId,
  currentGraphResources,
  allowUnparsed = true,
) => {
  return response
    .then(
      R.filter(
        (e) =>
          !R.includes(
            e.data.id,
            getDuplicateNodes(currentGraphResources, response)
          ),
        response
      )
    )
    .then((e) => {
      const newNodes = currentGraphResources
        ? currentGraphResources.filter((item) => !item.edge)
        : [];
      const newEdges = currentGraphResources
        ? currentGraphResources.filter((item) => item.edge)
        : [];
      e.forEach((item) =>
        item.edge ? newEdges.push(item) : newNodes.push(item)
      );
      R.forEach((e) => {
        if (e.data.clickedId === nodeId) {
          e.data.selected = true;
        }
      }, newNodes);
      return newNodes
        .concat(newEdges)
        .filter((item) => item.data.target !== nodeId);
    })
    .catch((err) => {
      console.error(err);
      if (!allowUnparsed) throw err;
      return [];
    });
};
