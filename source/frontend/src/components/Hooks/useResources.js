// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useInfiniteQuery, useQuery} from 'react-query'
import useQueryErrorHandler from "./useQueryErrorHandler"
import {
  wrapResourceRequest,
  handleResponse,
  getResources, searchResources,
} from '../../API/Handlers/ResourceGraphQLHandler';
import {getStatus} from "../../Utils/StatusUtils";
import * as R from "ramda";

export const queryKey = "resources"
export const useResources = (accounts=null, resourceTypes=null, paginationToken=null, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    [queryKey, accounts, resourceTypes, paginationToken.start, paginationToken.end],
    () => wrapResourceRequest(getResources, {
      accounts,
      resourceTypes,
      pagination: paginationToken,
    })
        .then(handleResponse)
        .then(R.pathOr([], ['body', 'data', 'getResources'])),
    {
      onError: handleError,
      keepPreviousData: true,
      refetchInterval: false,
      ...config,
    }
  )

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    status: getStatus(isFetching, isError)
  }
}

export const searchQueryKey = "resourcesSearch";
export const useResourcesSearch = (text='', pageSize=25, accounts=[], resourceTypes=[], config={}) => {
  const { handleError } = useQueryErrorHandler()

  const userFilters = {
    text,
  }

  if (accounts?.length > 0) userFilters.accounts = accounts;
  if (resourceTypes?.length > 0) userFilters.resourceTypes = resourceTypes;

  const fetchResults = ({ pageParam = 0 }) => wrapResourceRequest(searchResources, { ...userFilters, pagination: {
      start: pageSize * pageParam, end: (pageSize * pageParam) + pageSize
    } })
    .then(handleResponse)
    .then(R.pathOr([], ['body', 'data', 'searchResources', 'resources']))

  const { isLoading, isError, data, refetch, isFetched, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    [searchQueryKey, text, accounts, resourceTypes,  pageSize],
    fetchResults,
    {
      onError: handleError,
      keepPreviousData: true,
      refetchInterval: false,
      getNextPageParam: (lastPage, allPages) => lastPage.length > 0 ? allPages.length : undefined,
      ...config,
    }
  )

  const flattened = R.flatten(data?.pages ?? [])

  return {
    data: flattened,
    isLoading,
    isFetching: isFetching || isFetchingNextPage,
    isFetched,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    status: getStatus(isFetching, isError)
  }
}
export const searchPaginatedQueryKey = "searchPaginatedQueryKey";
export const useResourcesSearchPaginated = (text='', pagination={start:0, end: 10}, accounts=[], resourceTypes=[], config={}) => {
  const { handleError } = useQueryErrorHandler()

  const userFilters = {
    text,
    pagination,
  }

  if (accounts?.length > 0) userFilters.accounts = accounts;
  if (resourceTypes?.length > 0) userFilters.resourceTypes = resourceTypes;

  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    [searchPaginatedQueryKey, text, accounts, resourceTypes, pagination],
    () => wrapResourceRequest(searchResources, userFilters)
      .then(handleResponse)
      .then(R.pathOr([], ['body', 'data', 'searchResources'])),
    {
      onError: handleError,
      keepPreviousData: true,
      refetchInterval: false,
      ...config,
    }
  )

  return {
    data: data?.resources,
    count: data?.count,
    isLoading,
    isFetching,
    isError,
    refetch,
    status: getStatus(isFetching, isError)
  }
}

export default {
  useResources,
  useResourcesSearch,
  useResourcesSearchPaginated,
}
