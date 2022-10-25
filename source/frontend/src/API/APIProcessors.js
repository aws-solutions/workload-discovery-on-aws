import { processEdges } from './Processors/EdgeProcessors';
import { processChildNodes } from './Processors/NodeProcessors';
import * as R  from 'ramda';

const processNode = (node, selectedNodeId) =>
  Promise.resolve(processChildNodes(node, [], 0, node.id, selectedNodeId));

export const processHierarchicalNodeData = async (
  nodes,
  selectedNodeId,
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
    return processedNodes.concat(processedEdges);
  } catch (err) {
    throw new Error(`Could not parse node data for ${selectedNodeId}`);
  }
};
