// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  getCostForResource
} from '../Handlers/CostsGraphQLHandler';
import { wrapRequest } from '../../Utils/API/HandlerUtils';
import { processAccountsError } from '../../Utils/ErrorHandlingUtils';
import * as R from "ramda";

const getCostsForARNs = (resourceIds, preferences) => {
  return wrapRequest(processAccountsError, getCostForResource, {
    costForResourceQuery: {
      pagination: { start: 0, end: resourceIds.length },
      resourceIds: resourceIds,
      period: {
        from: preferences.period.startDate,
        to: preferences.period.endDate,
      },
    },
  });
};

const updateNodesWithCost = (costs, nodes) => {
    nodes.forEach(n => n.data.cost = 0)
  R.forEach((e) => {
    R.forEach((n) => {
      if (R.hasPath(['data', 'resourceId'], n)) {
        if (R.includes(e.line_item_resource_id, n.data.resourceId)) {
          // items with the same resource id can appear, e.g., EC2 instance costs
          // and EC2 data transfer costs for that instance will use the instance id
          n.data.cost = (parseFloat(n.data.cost) + parseFloat(e.cost)).toFixed(2);
        }
      }
    }, nodes);
  }, R.pathOr([], ['body', 'data', 'getCostForResource', 'costItems'], costs));
  return nodes;
};

export const fetchCosts = (nodes, preferences) =>
  Promise.resolve(
    R.filter((e) => {
      return (
        R.hasPath(['data', 'type'], e) &&
        R.equals(e.data.type, 'resource') &&
        R.hasPath(['data', 'resource', 'arn'], e) &&
        !R.isEmpty(e.data.resourceId)
      );
    }, nodes)
  )
    .then((x) =>
      R.filter(
        (y) => !R.isNil(y),
        R.flatten(R.map((e) => e.data.resourceId, x))
      )
    )
    .then((e) => getCostsForARNs(e, preferences))
    .then((e) => updateNodesWithCost(e, nodes));

export const handleSelectedResources = R.curry((
    selectedIds,
    currentGraphResources,
    elements
) => {
    return R.uniqBy(x => x.data.id, [...elements, ...currentGraphResources])
        .map(ele => {
            if (selectedIds.includes(ele.data.clickedId)) {
                ele.data.selected = true;
            }
            return ele;
        });
});
