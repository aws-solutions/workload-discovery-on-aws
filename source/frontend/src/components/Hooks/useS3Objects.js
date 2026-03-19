// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react';
import {useMutation, useQuery, useQueryClient, keepPreviousData} from '@tanstack/react-query';
import useQueryErrorHandler from './useQueryErrorHandler';
import {
    getObject,
    listObjects,
    removeObject,
    uploadObject,
} from '../../API/Storage/S3Store';
import {useNotificationDispatch} from '../Contexts/NotificationContext';
import {getStatus} from '../../Utils/StatusUtils';
import * as R from 'ramda';

export const privateLevel = 'private';
export const publicLevel = 'public';
export const viewsPrefix = 'views/';
export const diagramsPrefix = 'diagrams/';

const capitalize = R.replace(/^./, R.toUpper);

const prefixToName = prefix => {
    switch (prefix) {
        case viewsPrefix:
            return 'view';
        case diagramsPrefix:
            return 'diagram';
        default:
            return 'object';
    }
};

export const useListObjects = (prefix, level, config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const {isLoading, isError, error, data, refetch, isFetching} = useQuery({
        queryKey: [prefix, level],
        queryFn: () => listObjects(prefix, level),
        placeholderData: keepPreviousData,
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
export const useObject = (key, prefix, level, config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const {isLoading, isError, error, data, refetch, isFetching} = useQuery({
        queryKey: [prefix, level, key],
        queryFn: () => getObject(`${prefix}${key}`, level),
        placeholderData: keepPreviousData,
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
export const useRemoveObject = (prefix, config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const queryClient = useQueryClient();
    const {addNotification} = useNotificationDispatch();
    const mutation = useMutation({
        mutationFn: ({key, level}) => removeObject(`${prefix}${key}`, level),
        onSuccess: (_, data) => {
            const name = prefixToName(prefix);
            addNotification({
                header: `${capitalize(name)} Removed`,
                content: `The ${data.level} ${name} ${data.key} was removed successfully`,
                type: 'success',
            });
            window.scrollTo(0, 0);
            return queryClient.invalidateQueries({queryKey: [prefix]});
        },
        onError: handleError,
        ...config,
    });
    return {
        remove: mutation.mutate,
        removeAsync: mutation.mutateAsync,
    };
};
export const usePutObject = (prefix, config = {}) => {
    const {handleError} = useQueryErrorHandler();
    const queryClient = useQueryClient();
    const {addNotification} = useNotificationDispatch();
    const mutation = useMutation({
        mutationFn: ({key, content, level, type}) =>
            uploadObject(`${prefix}${key}`, content, level, type),
        onSuccess: (_, data) => {
            const name = prefixToName(prefix);
            addNotification({
                header: `${capitalize(name)} saved`,
                content: `The ${data.level} ${name} ${data.key} was saved successfully`,
                type: 'success',
            });
            window.scrollTo(0, 0);
            return queryClient.invalidateQueries({queryKey: [prefix]});
        },
        onError: handleError,
        ...config,
    });
    return {
        put: mutation.mutate,
        putAsync: mutation.mutateAsync,
    };
};

export default {
    useListObjects,
    useObject,
    usePutObject,
    useRemoveObject,
};
