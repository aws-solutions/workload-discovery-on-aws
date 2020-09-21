import { buildNode } from './NodeFactory/NodeFactory';
import { processEdges } from './Processors/EdgeProcessors';
import { processChildNodes } from './Processors/NodeProcessors';

export const processImportConfiguration = data => {
  return (
    data && {
      importConfigured: data.importConfigured,
      importData: data.results
    }
  );
};

export const processTemplate = data => {
  return data ? data.template : {};
};

export const processMetadata = data => {
  if (data && data.importRun) {
    const metadata = new Map();
    data.results &&
      data.results.accountData.map(account =>
        metadata.set(account.accountId, account.regions)
      );
    // metadata.set('global', [{ region: 'global', count: 0 }]);
    return { importRun: true, metadata: metadata };
  } else {
    return { importRun: false, metadata: {} };
  }
};

export const processFilterResults = data => {
  const nodes = data && data.results.map(async (node) => await buildNode(node));
  return nodes;
};

export const processDeletedNodes = data => {
  let nodes = [];
  data.map(
    node =>
      (nodes = processChildNodes(node, [], 0, node.id).filter(
        item => item.data.type === 'resource'
      ))
  );
  return nodes;
};

export const processHierarchicalNodeData = (data, params) => {
  let edges = [];
  let nodes = [];
  data.map(
    child => {
      return (nodes = nodes.concat(
        processChildNodes(child, [], 0, child.id, params && params.nodeId)
      ))
    }
  );
  if (params) edges = edges.concat(processEdges(nodes, params.nodeId));
  return nodes.concat(edges);
};
