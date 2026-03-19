// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import useQueryErrorHandler from './useQueryErrorHandler';
import {handleResponse} from '../../API/Handlers/ResourceGraphQLHandler';
import * as R from 'ramda';
import {
    getGlobalTemplate,
    getRegionalTemplate,
} from '../../API/Handlers/SettingsGraphQLHandler';
import {getStatus} from '../../Utils/StatusUtils';
import {wrapRequest} from '../../Utils/API/HandlerUtils';
import {processAccountsError} from '../../Utils/ErrorHandlingUtils';

export const GLOBAL_TEMPLATE = 'getGlobalTemplate';
export const REGIONAL_TEMPLATE = 'getRegionalTemplate';

export const queryKey = 'template';
export const useTemplate = (templateName, config = {}) => {
    if (![GLOBAL_TEMPLATE, REGIONAL_TEMPLATE].includes(templateName))
        throw new Error(`Invalid template name '${templateName}'`);
    const {handleError} = useQueryErrorHandler();
    const {isLoading, isError, error, data, refetch, isFetching} = useQuery({
        queryKey: [queryKey, templateName],
        queryFn: () =>
            wrapRequest(
                processAccountsError,
                templateName === GLOBAL_TEMPLATE
                    ? getGlobalTemplate
                    : getRegionalTemplate
            )
                .then(handleResponse)
                .then(R.pathOr([], ['body', 'data', templateName])),
        refetchInterval: false,
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

export default {
    useTemplate,
};
