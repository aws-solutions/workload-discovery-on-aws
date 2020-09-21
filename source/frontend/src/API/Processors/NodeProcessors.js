import { buildNode, buildBoundingBox } from '../NodeFactory/NodeFactory';

export const processChildNodes = (
  node,
  nodes,
  level,
  parent,
  clickedNodeId
) => {
  try {
    let recursiveNodes = nodes;
    if (node.children && node.children.length > 0) {      
      const boundingBox = buildBoundingBox(node, parent, level);      
      recursiveNodes.push(boundingBox);
      ++level;
      node.children.forEach(child => {
        recursiveNodes.concat(
          processChildNodes(
            child,
            recursiveNodes,
            level,
            boundingBox.data.id,
            clickedNodeId
          )
        );
      });
    } else {
      recursiveNodes.push(
        buildNode(node, parent, level, node.id === clickedNodeId)
      );
    }
    return recursiveNodes;
  } catch (e) {
    return [];
  }
};

export const handleSelectedResource = (
  response,
  params,
  currentGraphResources
) => {
  try {
    response.body = response.body.filter(node =>
      currentGraphResources.filter(element => element.data.id === node.data.id)
    );
    const newNodes = currentGraphResources
      ? currentGraphResources.filter(item => !item.edge)
      : [];
    const newEdges = currentGraphResources
      ? currentGraphResources.filter(item => item.edge)
      : [];
    response.body.forEach(item =>
      item.edge ? newEdges.push(item) : newNodes.push(item)
    );
    return newNodes
      .concat(newEdges)
      .filter(item => (item.data.target === params.nodeId ? false : true));
  } catch (e) {
    return [];
  }
};
