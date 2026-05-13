// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react';
import {useInfiniteQuery, useQuery, keepPreviousData} from '@tanstack/react-query';
import useQueryErrorHandler from './useQueryErrorHandler';
import {
    handleResponse,
    searchResources,
} from '../../API/Handlers/ResourceGraphQLHandler';
import {wrapRequest} from '../../Utils/API/HandlerUtils';
import {fetchWithAdaptivePageSize} from '../../Utils/API/AdaptivePagination';
import {getStatus} from '../../Utils/StatusUtils';
import {processResourcesError} from '../../Utils/ErrorHandlingUtils';
import * as R from 'ramda';

export const searchQueryKey = 'resourcesSearch';
export const useResourcesSearch = (
    text = '',
    pageSize = 25,
    accounts = [],
    resourceTypes = [],
    config = {}
) => {
    const {handleError} = useQueryErrorHandler();

    const userFilters = {
        text,
    };

    if (accounts?.length > 0) userFilters.accounts = accounts;
    if (resourceTypes?.length > 0) userFilters.resourceTypes = resourceTypes;

    const fetchResults = ({pageParam}) =>
        fetchWithAdaptivePageSize(
            pagination =>
                wrapRequest(processResourcesError, searchResources, {
                    ...userFilters,
                    pagination,
                })
                    .then(handleResponse)
                    .then(
                        R.pathOr([], ['body', 'data', 'searchResources', 'resources'])
                    ),
            {
                start: pageSize * pageParam,
                end: pageSize * pageParam + pageSize,
            },
            1,
            (a, b) => [...a, ...b]
        );

    const {
        isLoading,
        isError,
        error,
        data,
        refetch,
        isFetched,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: [searchQueryKey, text, accounts, resourceTypes, pageSize],
        queryFn: fetchResults,
        initialPageParam: 0,
        placeholderData: keepPreviousData,
        refetchInterval: false,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length > 0 ? allPages.length : undefined,
        ...config,
    });

    useEffect(() => {
        if (error) handleError(error);
    }, [error, handleError]);

    const flattened = R.flatten(data?.pages ?? []);

    return {
        data: flattened,
        isLoading,
        isFetching: isFetching || isFetchingNextPage,
        isFetched,
        isError,
        refetch,
        hasNextPage,
        fetchNextPage,
        status: getStatus(isFetching, isError),
    };
};
export const searchPaginatedQueryKey = 'searchPaginatedQueryKey';
export const useResourcesSearchPaginated = (
    text = '',
    pageRange = {start: 0, end: 10},
    accounts = [],
    resourceTypes = [],
    config = {}
) => {
    const {handleError} = useQueryErrorHandler();

    const userFilters = {
        text,
    };

    if (accounts?.length > 0) userFilters.accounts = accounts;
    if (resourceTypes?.length > 0) userFilters.resourceTypes = resourceTypes;

    const {isLoading, isError, error, data, refetch, isFetching} = useQuery({
        queryKey: [searchPaginatedQueryKey, text, accounts, resourceTypes, pageRange],
        queryFn: () =>
            fetchWithAdaptivePageSize(
                pagination =>
                    wrapRequest(processResourcesError, searchResources, {
                        ...userFilters,
                        pagination,
                    })
                        .then(handleResponse)
                        .then(R.pathOr([], ['body', 'data', 'searchResources'])),
                pageRange,
                1,
                (a, b) => ({
                    resources: [...(a.resources ?? []), ...(b.resources ?? [])],
                    count: a.count ?? b.count,
                })
            ),
        placeholderData: keepPreviousData,
        refetchInterval: false,
        ...config,
    });

    useEffect(() => {
        if (error) handleError(error);
    }, [error, handleError]);

    return {
        data: data?.resources,
        count: data?.count,
        isLoading,
        isFetching,
        isError,
        refetch,
        status: getStatus(isFetching, isError),
    };
};
