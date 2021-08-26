const R = require('ramda');
export const processEdges = (nodes, selectedNodeId) => {
  const edges = [];
  const expandedNode = R.find(
    (x) =>
      R.or(
        R.equals(x.data.arn, selectedNodeId),
        R.equals(x.data.id, selectedNodeId)
      ),
    nodes
  );
  if (expandedNode) {
    nodes.forEach((node) => {
      const drawEdge =
        !R.or(
          R.equals(node.data.arn, selectedNodeId),
          R.equals(node.data.id, selectedNodeId)
        ) &&
        !node.data.children &&
        nodeIsNotChild(nodes, node, selectedNodeId);
      if (drawEdge) {
        edges.push({
          edge: true,
          data: {            
            id: `${expandedNode.data.id}-${node.data.id}`,
            label: `${expandedNode.data.title}-${node.data.title}`,
            isSourceParent: expandedNode.data.children,
            source: expandedNode.data.id,
            sourceMetadata: {
              childIds: expandedNode.data.children
                ? getChildren(nodes, expandedNode, [])
                : [],
            },
            isTargetParent: node.data.children,
            target: node.data.id,
            targetMetadata: {
              childIds: node.data.children ? getChildren(nodes, node, []) : [],
            },
          },
          classes: ['highlight'],
        });
      }
    });
  }
  return edges;
};

const getChildren = (nodes, node, currentChildren) => {
  let childNodes = nodes.filter((item) => item.data.parent === node.data.id);
  let children = currentChildren;
  if (childNodes.length > 0) {
    childNodes.forEach((item) => {
      getChildren(nodes, item, children);
    });
  } else {
    if (!children.includes(node.data.id)) children.push(node.data.id);
  }
  return children;
};

const nodeIsNotChild = (nodes, node, id) => {
  let parent = node.data.parent;
  while (parent) {
    if (parent === id) return false;
    else
      return nodeIsNotChild(
        nodes,
        nodes.filter((item) => item.data.id === parent)[0],
        id
      );
  }
  return true;
};