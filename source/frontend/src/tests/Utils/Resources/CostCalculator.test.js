// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { aggregateCostData, getCostData } from '../../../Utils/Resources/CostCalculator'
import dbClusterData from './data/db-cluster-costing-test.json';
import {nodeWithCost, nodeWithoutCost, nodeWithCostButIgnoreFlagTrue } from './data/db-instance-node';

test('calculate aggregated cost of nodes' , () => {
    const nodes = dbClusterData.filter(resource => !resource.edge);
    nodes.forEach(node => {
        if(node.data.id === 'ebc5cd4c047867d5ab6154d07ff468f9') expect(node.data.cost).toEqual(62.98)
        if(node.data.type === 'region') expect(node.data.cost).toEqual(0)
        if(node.data.type === 'account') expect(node.data.cost).toEqual(0)
    })    
    aggregateCostData(nodes)
    nodes.forEach(node => {
        if(node.data.id === 'ebc5cd4c047867d5ab6154d07ff468f9') expect(node.data.cost).toEqual(62.98)
        if(node.data.type === 'region') expect(node.data.cost).toEqual("62.98")
        if(node.data.type === 'account') expect(node.data.cost).toEqual("62.98")
    })
})

test('get cost from api node response that has a cost' , () => {
    const cost = getCostData(nodeWithCost);
    expect(cost).toEqual(62.97600000000005)    
})

test('get cost from api node response that has no cost' , () => {
    const cost = getCostData(nodeWithoutCost);
    expect(cost).toEqual(0)    
})

test('get cost from api node response that has cost but ignore flag is true' , () => {
    const cost = getCostData(nodeWithCostButIgnoreFlagTrue);
    expect(cost).toEqual(0)    
})