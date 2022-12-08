// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const exportJSON = (canvas) => {
  const nodes = canvas.nodes().jsons();
  const edges =  canvas.elements().filter(function(element){
    return element.isEdge()
  });
  return new Blob([JSON.stringify({ nodes: nodes, edges: edges.jsons()})], {
    type: 'application/json;charset=utf-8',
  });
};
