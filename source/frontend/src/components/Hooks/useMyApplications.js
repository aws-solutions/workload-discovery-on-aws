// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useMutation} from 'react-query';
import useQueryErrorHandler from './useQueryErrorHandler';
import {
    createApplication,
    handleResponse,
} from '../../API/Handlers/ResourceGraphQLHandler';
import {wrapRequest} from '../../Utils/API/HandlerUtils';
import {processResourcesError} from '../../Utils/ErrorHandlingUtils';
import * as R from 'ramda';
import {useNotificationDispatch} from '../Contexts/NotificationContext';

export const useCreateApplication = (config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const {addNotification} = useNotificationDispatch();

    const mutation = useMutation(
        ({name, accountId, region, resources}) => {
            return wrapRequest(processResourcesError, createApplication, {
                name,
                accountId,
                region,
                resources,
            })
                .then(handleResponse)
                .then(R.pathOr([], ['body', 'data', 'createApplication']));
        },
        {
            onSuccess: async data => {
                const hasUnprocessedResources = !R.isEmpty(
                    data.unprocessedResources
                );
                const unprocessedResourcesMsg = hasUnprocessedResources
                    ? `However, the following resources were not added: ${data.unprocessedResources.join(', ')}`
                    : '';

                addNotification({
                    header: 'Application created',
                    content: `The application named ${data.name} has been created. ${unprocessedResourcesMsg}`,
                    type: hasUnprocessedResources ? 'warning' : 'success',
                });
            },
            onError: handleError,
            ...config,
        }
    );

    return {
        createApplication: mutation.mutate,
        createApplicationAsync: mutation.mutateAsync,
        isLoading: mutation.isLoading,
    };
};
