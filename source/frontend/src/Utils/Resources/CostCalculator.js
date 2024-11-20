// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';

function getAggregateCosts(nodes) {
    const nodesMap = new Map(
        nodes.map(({data: {id, cost, parent}}) => [id, {id, cost, parent}])
    );
    const leafNodes = nodes.filter(x => x.data.type === 'resource');

    for (const node of leafNodes) {
        let parent = nodesMap.get(node.data.parent);
        while (parent != null) {
            const currentParentCostVal = nodesMap.get(parent.id).cost;
            nodesMap.get(parent.id).cost = R.add(
                currentParentCostVal,
                node.data.cost
            ).toFixed(2);
            parent = nodesMap.get(parent.parent);
        }
    }

    return nodesMap;
}

export const aggregateCostData = (nodes, showCount = false) => {
    const costsMap = getAggregateCosts(nodes);

    nodes.forEach(node => {
        node.data.cost = costsMap.get(node.data.id).cost;
        if (node.data.type === 'type' && showCount) {
            const count = nodes.filter(subResource => {
                return subResource.data.parent === node.data.id;
            }).length;
            node.data.label = `${count}x ${node.data.title} - $${node.data.cost}`;
        } else {
            node.data.label = `${node.data.title} - $${node.data.cost}`;
        }
    });
    return nodes;
};

export const getCostData = node => {
    if (node.costData && node.costData.totalCost) {
        return node.costData.ignore ? 0 : Number(node.costData.totalCost);
    } else return 0;
};
