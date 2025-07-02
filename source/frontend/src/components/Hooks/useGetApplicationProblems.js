// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useQuery} from 'react-query';
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
    const {isLoading, isError, data, refetch, isFetching} = useQuery(
        [queryKey, JSON.stringify(params)],
        () =>
            wrapRequest(processResourcesError, getApplicationProblems, params)
                .then(handleResponse)
                .then(R.pathOr([], ['body', 'data', 'getApplicationProblems'])),
        {
            onError: handleError,
            refetchInterval: false,
            staleTime: 10 * 1000,
            ...config,
        }
    );

    return {
        data,
        isLoading,
        isError,
        refetch,
        status: getStatus(isFetching, isError),
    };
};
