// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R  from 'ramda';

const removeCollapsedNodes = (parents, nodes) =>
  R.filter((e) => !R.includes(e.data.parent, parents), nodes);

export const diagramToDrawioData = async (elements) => {
  const parentCollapsed = R.map(
    (x) => x.data.id,
    R.filter((e) => !R.isNil(e.data.collapsedChildren), elements.nodes)
  );
  const rawNodes = removeCollapsedNodes(parentCollapsed, elements.nodes);
  const nodes = R.map((e) => {
    if (e.data.collapsedChildren) {
      e.data.collapsedChildren = [];
      e.data.children = undefined;
      e.data.type = 'resource';

      e.data.hasChildren = false;
    }
    return R.pick(
      [
        'id',
        'parent',
        'title',
        'label',
        'level',
        'type',
        'image',
        'hasChildren',
        'position'
      ],
      {...e.data, position: e.position}
    );
  }, rawNodes);

  let edges = []
  if (elements.edges) {
    edges = R.map((e) => {
      if (!R.isNil(e.data.originalEnds)) {
        e.data.originalEnds = undefined;
      }
      return R.pick(['id', 'source', 'target'], e.data);
    }, elements.edges);
  }

  return {
    nodes,
    edges
  }
};
