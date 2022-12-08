// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useQueryErrorHandler from "./useQueryErrorHandler";
import {useQuery} from "react-query";
import {handleResponse} from "../../API/Handlers/ResourceGraphQLHandler";
import * as R from "ramda";
import {getCostForResource, getResourcesByCostByDay, wrapCostAPIRequest} from "../../API/Handlers/CostsGraphQLHandler";
import {getStatus} from "../../Utils/StatusUtils";

export const useResourceCosts = (resources= [], dateInterval={}, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    ["resourceCosts", resources, dateInterval],
    () =>  wrapCostAPIRequest(getCostForResource, {
      costForResourceQuery: {
        pagination: { start: 0, end: resources.length },
        resourceIds: R.filter(
          (y) => !R.isNil(y),
          R.chain((e) => e.data.resourceId, resources)
        ),
        period: {
          from: dateInterval.startDate,
          to: dateInterval.endDate,
        },
      },
    })
      .then(handleResponse)
      .then(R.pathOr([], ['body', 'data', 'getCostForResource', 'costItems']))
      .then(
        R.map((e) => {
          return { id: e.line_item_resource_id, cost: e.cost, service: e.product_servicename };
        })
      ),
    {
      enabled: resources.length > 0 && "startDate" in dateInterval && "endDate" in dateInterval,
      onError: handleError,
      refetchInterval: false,
      ...config,
    }
  )

  return {
    data,
    isLoading,
    isError,
    refetch,
    status: getStatus(isFetching, isError)
  }
}
export const useDailyResourceCosts = (resources= [], dateInterval={}, pageSize=50, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    ["resourceCosts", resources, dateInterval],
    () => wrapCostAPIRequest(getResourcesByCostByDay, {
      costForResourceQueryByDay: {
        pagination: { start: 0, end: pageSize },
        resourceIds: R.chain((e) => {
          return e.resourceId
        }, resources),
        period: { from: dateInterval.startDate, to: dateInterval.endDate },
      },
    })
      .then(handleResponse)
      .then(R.pathOr(
          [],
          ['body', 'data', 'getResourcesByCostByDay', 'costItems'],
        )
      )
      .then(res => res.filter(i => resources
        .find(j => j.resourceId.includes(i.line_item_resource_id) && j.service === i.product_servicename))
      ),
    {
      enabled: resources.length > 0 && "startDate" in dateInterval && "endDate" in dateInterval,
      onError: handleError,
      refetchInterval: false,
      ...config,
    }
  )

  return {
    data,
    isLoading,
    isError,
    refetch,
    status: getStatus(isFetching, isError)
  }
}

export default useResourceCosts
