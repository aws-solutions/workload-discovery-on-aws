// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from 'react-query';
import pLimit from 'p-limit';
import useQueryErrorHandler from "./useQueryErrorHandler";
import {
  getResourcesAccountMetadata,
  getResourcesRegionMetadata,
  getResourcesMetadata,
  handleResponse,
} from '../../API/Handlers/ResourceGraphQLHandler';
import { wrapRequest } from '../../Utils/API/HandlerUtils';
import { processResourcesError } from '../../Utils/ErrorHandlingUtils';
import * as R from "ramda";
import {getStatus} from "../../Utils/StatusUtils";

const limit = pLimit(10);

export const accountQueryKey = "resourcesAccountMetadata"
export const regionQueryKey = "resourcesRegionMetadata"
export const resourcesKey = "resourcesMetadata"

function batchRequests(query, {accounts}, {batchSize}) {
    return Promise.resolve(R.splitEvery(batchSize, accounts ?? []))
        .then(R.map(accounts => {
            // we do not want to use unconstrained concurrency so limit the number of in flight
            // requests to 10 at a time
            return limit( () => wrapRequest(processResourcesError, query, { accounts })
                .then(handleResponse));
        }))
        .then(ps => Promise.all(ps))
}

export const useResourcesAccountMetadata = (accounts=null, config = {}) => {
  const { handleError } = useQueryErrorHandler();
  const {batchSize} = config;
  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    [accountQueryKey, batchSize, accounts],
    () => {
        if(batchSize == null) {
            return wrapRequest(processResourcesError, getResourcesAccountMetadata, { accounts })
                .then(handleResponse)
                .then(R.pathOr([], ['body', 'data', 'getResourcesAccountMetadata']));
        }
        return batchRequests(getResourcesAccountMetadata, { accounts }, {batchSize})
            .then(R.chain(R.pathOr([], ['body', 'data', 'getResourcesAccountMetadata'])))
    },
    {
      onError: handleError,
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

export const useResourcesRegionMetadata = (accounts=null, config= {}) => {
  const { handleError } = useQueryErrorHandler()
  const {batchSize} = config;
  const { isLoading, isFetching, isError, data, refetch } = useQuery(
    [regionQueryKey, batchSize, accounts],
    () => {
        if(batchSize == null) {
            return wrapRequest(processResourcesError, getResourcesRegionMetadata, { accounts })
                .then(handleResponse)
                .then(R.pathOr([], ['body', 'data', 'getResourcesRegionMetadata']));
        }
        return batchRequests(getResourcesRegionMetadata, { accounts }, {batchSize})
            .then(R.chain(R.pathOr([], ['body', 'data', 'getResourcesRegionMetadata'])))
    },
    {
      onError: handleError,
      ...config,
    }
  )

  return {
    data,
    isLoading,
    isError,
    refetch,
    status: getStatus(isFetching, isError),
  }
}
export const useResourcesMetadata = (accounts=null, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isFetching, isError, data, refetch } = useQuery(
    [resourcesKey, accounts],
    () => wrapRequest(processResourcesError, getResourcesMetadata, { accounts })
        .then(handleResponse)
        .then(R.pathOr([], ['body', 'data', 'getResourcesMetadata'])),
    {
      onError: handleError,
      ...config,
    }
  )

  return {
    data,
    isLoading,
    isError,
    refetch,
    status: getStatus(isFetching, isError),
  }
}

export default {
  useResourcesAccountMetadata,
  useResourcesRegionMetadata
}
