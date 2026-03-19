// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import useQueryErrorHandler from './useQueryErrorHandler';
import {handleResponse} from '../../API/Handlers/ResourceGraphQLHandler';
import * as R from 'ramda';
import {
    addAccounts,
    deleteAccounts,
    deleteRegions,
    getAccounts,
} from '../../API/Handlers/SettingsGraphQLHandler';
import {wrapRequest} from '../../Utils/API/HandlerUtils';
import {processAccountsError} from '../../Utils/ErrorHandlingUtils';
import {accountQueryKey, regionQueryKey} from './useResourcesMetadata';
import {useNotificationDispatch} from '../Contexts/NotificationContext';
import {getStatus} from '../../Utils/StatusUtils';

export const queryKey = 'accounts';
export const useAccounts = (config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const {isLoading, isError, error, data, refetch, isFetching} = useQuery({
        queryKey: [queryKey],
        queryFn: () =>
            wrapRequest(processAccountsError, getAccounts)
                .then(handleResponse)
                .then(R.pathOr([], ['body', 'data', 'getAccounts'])),
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
export const useAddAccounts = (config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const {addNotification} = useNotificationDispatch();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: accounts =>
            wrapRequest(processAccountsError, addAccounts, {
                accounts,
            }).then(handleResponse),
        onSuccess: async () => {
            await invalidateQueries(queryClient);
            addNotification({
                header: 'Accounts Imported',
                content:
                    'The specified accounts and regions have been successfully imported',
                type: 'success',
            });
            window.scrollTo(0, 0);
        },
        onError: handleError,
        ...config,
    });
    return {
        add: mutation.mutate,
        addAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
};

export const useRemoveAccount = (config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const queryClient = useQueryClient();
    const {addNotification} = useNotificationDispatch();
    const mutation = useMutation({
        mutationFn: accountIds =>
            wrapRequest(processAccountsError, deleteAccounts, {
                accountIds,
            }).then(handleResponse),
        onSuccess: async () => {
            await invalidateQueries(queryClient);
            addNotification({
                header: 'Accounts Removed',
                content:
                    'The specified accounts have been successfully removed',
                type: 'success',
            });
            window.scrollTo(0, 0);
        },
        onError: handleError,
        ...config,
    });
    return {
        remove: mutation.mutate,
        removeAsync: mutation.mutateAsync,
    };
};

export const useRemoveAccountRegion = (config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const {addNotification} = useNotificationDispatch();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({accountId, regions}) =>
            wrapRequest(processAccountsError, deleteRegions, {
                accountId,
                regions,
            }).then(handleResponse),
        onSuccess: async () => {
            await invalidateQueries(queryClient);
            addNotification({
                header: 'Account Regions Removed',
                content:
                    'The specified account regions have been successfully removed',
                type: 'success',
            });
            window.scrollTo(0, 0);
        },
        onError: handleError,
        ...config,
    });
    return {
        remove: mutation.mutate,
        removeAsync: mutation.mutateAsync,
    };
};

const invalidateQueries = queryClient =>
    Promise.all([
        queryClient.invalidateQueries({queryKey: [queryKey]}),
        queryClient.invalidateQueries({queryKey: [accountQueryKey]}),
        queryClient.invalidateQueries({queryKey: [regionQueryKey]}),
    ]);

export default {
    useAccounts,
    useAddAccounts,
    useRemoveAccount,
    useRemoveAccountRegion,
};
