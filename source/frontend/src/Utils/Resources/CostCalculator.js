import * as R from "ramda";

export const aggregateCostData = (nodes, showCount=false) => {
  nodes.forEach((node) => {
    if (node.data.children) node.data.cost = 0;
  });
  nodes.sort((a, b) => b.data.level - a.data.level);
  nodes.forEach((node) => {
    if (node.data.parent) {
      const parentIndex = nodes.findIndex(
        (e) => e.data.id === node.data.parent
      );
      const parent = nodes[parentIndex];
      parent.data.cost = R.add(parent.data.cost, node.data.cost).toFixed(2);
    }
  });
  nodes.forEach((node) => {
    if (node.data.children) {
      if (node.data.type === 'type' && showCount) {
        const count = nodes.filter((subResource) => {
          return subResource.data.parent === node.data.id;
        }).length;
        node.data.label = `${count}x ${node.data.title} - $${node.data.cost}`;
      } else {
        node.data.label = `${node.data.title} - $${node.data.cost}`;
      }
    }
  });
  return nodes;
};

export const getCostData = (node) => {
  if (node.costData && node.costData.totalCost) {
    return node.costData.ignore ? 0 : Number(node.costData.totalCost);
  } else return 0;
};
