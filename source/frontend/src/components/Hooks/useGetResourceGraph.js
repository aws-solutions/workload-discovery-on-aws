// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {getResourceGraphPaginated, handleResponse} from '../../API/Handlers/ResourceGraphQLHandler';
import useQueryErrorHandler from './useQueryErrorHandler';
import {wrapRequest} from '../../Utils/API/HandlerUtils';
import { processResourcesError } from '../../Utils/ErrorHandlingUtils';
import {getStatus} from "../../Utils/StatusUtils";
import {useQuery} from "react-query";
import {processElements} from "../../API/APIProcessors";

const queryKey = 'getResourceGraph';

export function useGetResourceGraph(ids, config = {}) {
    const { handleError } = useQueryErrorHandler();

    const { isLoading, isError, data, refetch, isFetching } = useQuery(
        [queryKey, ids],
        () => wrapRequest(processResourcesError, getResourceGraphPaginated, {ids})
            .then(handleResponse)
            .then(x => x.body)
            .then(processElements),
        {
            onError: handleError,
            refetchInterval: false,
            enabled: false,
            cacheTime: 0,
            ...config,
        }
    );

    return {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
        status: getStatus(isFetching, isError)
    }
}
