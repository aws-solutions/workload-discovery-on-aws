// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react';
import {
    getResourceGraphPaginated,
    handleResponse,
} from '../../API/Handlers/ResourceGraphQLHandler';
import useQueryErrorHandler from './useQueryErrorHandler';
import {wrapRequest} from '../../Utils/API/HandlerUtils';
import {processResourcesError} from '../../Utils/ErrorHandlingUtils';
import {getStatus} from '../../Utils/StatusUtils';
import {useQuery} from '@tanstack/react-query';
import {processElements} from '../../API/APIProcessors';

const queryKey = 'getResourceGraph';

export function useGetResourceGraph(ids, config = {}) {
    const {handleError} = useQueryErrorHandler();

    const {isLoading, isError, error, data, refetch, isFetching} = useQuery({
        queryKey: [queryKey, ids],
        queryFn: () =>
            wrapRequest(processResourcesError, getResourceGraphPaginated, {ids})
                .then(handleResponse)
                .then(x => x.body)
                .then(processElements),
        refetchInterval: false,
        enabled: false,
        gcTime: 0,
        ...config,
    });

    useEffect(() => {
        if (error) handleError(error);
    }, [error, handleError]);

    return {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
        status: getStatus(isFetching, isError),
    };
}
