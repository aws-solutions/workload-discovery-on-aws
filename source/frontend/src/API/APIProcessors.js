import { buildNode } from './NodeFactory/NodeFactory';
import { processEdges } from './Processors/EdgeProcessors';
import { fetchCosts, processChildNodes } from './Processors/NodeProcessors';
const R = require('ramda');
export const processImportConfiguration = (data) => {
  return (
    data && {
      importConfigured: data.importConfigured,
      importData: data.results,
    }
  );
};

export const processTemplate = (data) => {
  return data ? data.template : {};
};

export const processMetadata = (data) => {
  if (data && data.importRun) {
    const metadata = new Map();
    data.results &&
      data.results.accountData.map((account) =>
        metadata.set(account.accountId, account.regions)
      );
    // metadata.set('global', [{ region: 'global', count: 0 }]);
    return { importRun: true, metadata: metadata };
  } else {
    return { importRun: false, metadata: {} };
  }
};

export const processFilterResults = (data) => {
  const nodes = data && data.results.map(async (node) => buildNode(node));
  return nodes;
};



export const processDeletedNodes = (data) => {
  let nodes = [];
  data.map(
    (node) =>
      (nodes = processChildNodes(node, [], 0, node.id).filter(
        (item) => item.data.type === 'resource'
      ))
  );
  return nodes;
};

const processNode = (node, selectedNodeId) =>
  Promise.resolve(processChildNodes(node, [], 0, node.id, selectedNodeId));

export const processHierarchicalNodeData = async (
  nodes,
  selectedNodeId,
  costPreferences
) => {
  let processedNodes = [];
  let processedEdges = [];

  try {
    if (Array.isArray(nodes)) {
       await R.forEach(
        (node) =>
          processNode(node, selectedNodeId).then((e) => {
            processedNodes = R.concat(e, processedNodes);
            processedEdges = selectedNodeId
              ? R.concat(
                  processedEdges,
                  processEdges(processedNodes, selectedNodeId)
                )
              : [];
          }),
        nodes
      );
    } else {
      processedNodes = await processNode(nodes, selectedNodeId);
      processedEdges = selectedNodeId
        ? processEdges(processedNodes, selectedNodeId)
        : [];
    }
    return costPreferences.processCosts
      ? await fetchCosts(processedNodes.concat(processedEdges), costPreferences)
      : processedNodes.concat(processedEdges);
  } catch (err) {
    throw new Error('Could not parse linkedHierachy');
  }
};
