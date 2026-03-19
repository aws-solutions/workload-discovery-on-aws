// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import useQueryErrorHandler from './useQueryErrorHandler';
import {handleResponse} from '../../API/Handlers/ResourceGraphQLHandler';
import {getApplicationProblems} from '../../API/Handlers/SettingsGraphQLHandler';
import * as R from 'ramda';
import {getStatus} from '../../Utils/StatusUtils';
import {wrapRequest} from '../../Utils/API/HandlerUtils';
import {processResourcesError} from '../../Utils/ErrorHandlingUtils';

export const queryKey = 'getApplicationProblems';

export const useGetApplicationProblems = (params = {}, config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const {isLoading, isError, error, data, refetch, isFetching} = useQuery({
        queryKey: [queryKey, JSON.stringify(params)],
        queryFn: () =>
            wrapRequest(processResourcesError, getApplicationProblems, params)
                .then(handleResponse)
                .then(R.pathOr([], ['body', 'data', 'getApplicationProblems'])),
        refetchInterval: false,
        staleTime: 10 * 1000,
        ...config,
    });

    useEffect(() => {
        if (error) handleError(error);
    }, [error, handleError]);

    return {
        data,
        isLoading,
        isError,
        refetch,
        status: getStatus(isFetching, isError),
    };
};
