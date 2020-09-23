export const aggregateCostData = nodes => {
  nodes.forEach(node => {
    if (node.data.children) node.data.cost = 0;
  });
  nodes.sort((a, b) => b.data.level - a.data.level);
  nodes.forEach(node => {
    if (node.data.parent) {
      const parentIndex = nodes.findIndex(e => e.data.id === node.data.parent);
      const parent = nodes[parentIndex];
      nodes[parentIndex].data.cost = Number(
        (parent.data.cost += node.data.cost)
      );
    }
  });
  nodes.forEach(node => {
    if (node.data.children) {
      if (node.data.type === 'type') {
        const count = nodes.filter(subResource => {
          return subResource.data.parent === node.data.id;
        }).length;
        node.data.label = `${count}x ${
          node.data.title
        } - $${node.data.cost.toFixed(2)}`;
      } else {
        node.data.label = `${node.data.title} - $${node.data.cost.toFixed(2)}`;
      }
    }
  });
  return nodes;
};

export const getCostData = node => {
  if (node.costData && node.costData.totalCost) {
    return node.costData.ignore ? 0 : Number(node.costData.totalCost);
  } else return 0;
};
