import { useQuery } from 'react-query'
import useQueryErrorHandler from "./useQueryErrorHandler"
import {
  getResourcesAccountMetadata,
  getResourcesRegionMetadata,
  getResourcesMetadata,
  wrapResourceRequest,
  handleResponse,
} from '../../API/Handlers/ResourceGraphQLHandler';
import * as R from "ramda";
import {getStatus} from "../../Utils/StatusUtils";

export const accountQueryKey = "resourcesAccountMetadata"
export const regionQueryKey = "resourcesRegionMetadata"
export const resourcesKey = "resourcesMetadata"
export const useResourcesAccountMetadata = (accounts=null, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    [accountQueryKey, accounts],
    () => wrapResourceRequest(getResourcesAccountMetadata, { accounts })
        .then(handleResponse)
        .then(R.pathOr([], ['body', 'data', 'getResourcesAccountMetadata'])),
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
export const useResourcesRegionMetadata = (accounts=null, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isFetching, isError, data, refetch } = useQuery(
    [regionQueryKey, accounts],
    () => wrapResourceRequest(getResourcesRegionMetadata, { accounts })
        .then(handleResponse)
        .then(R.pathOr([], ['body', 'data', 'getResourcesRegionMetadata'])),
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
    () => wrapResourceRequest(getResourcesMetadata, { accounts })
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
