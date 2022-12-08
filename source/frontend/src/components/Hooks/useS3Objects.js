// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQuery, useQueryClient} from 'react-query';
import useQueryErrorHandler from "./useQueryErrorHandler";
import {getObject, listObjects, removeObject, uploadObject} from "../../API/Storage/S3Store";
import {useNotificationDispatch} from "../Contexts/NotificationContext";
import {getStatus} from "../../Utils/StatusUtils";
import * as R from "ramda";

export const privateLevel = 'private';
export const publicLevel = 'public';
export const viewsPrefix = 'views/';
export const diagramsPrefix = 'diagrams/';

const capitalize = R.replace(/^./, R.toUpper);

const prefixToName = (prefix) => {
  switch (prefix) {
    case viewsPrefix:
      return "view"
    case diagramsPrefix:
      return "diagram"
    default:
      return "object"
  }
}

export const useListObjects = (prefix, level, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    [prefix, level],
    () => listObjects(prefix, level),
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
    refetch,
    status: getStatus(isFetching, isError)
  }
}
export const useObject = (key, prefix, level, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    [prefix, level, key],
    () => getObject(`${prefix}${key}`, level),
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
    refetch,
    status: getStatus(isFetching, isError)
  }
}
export const useRemoveObject = (prefix, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationDispatch();
  const mutation = useMutation(({key, level}) => removeObject(`${prefix}${key}`, level), {
    onSuccess: (_, data) => {
      const name = prefixToName(prefix)
      addNotification({
        header: `${capitalize(name)} Removed`,
        content: `The ${data.level} ${name} ${data.key} was removed successfully`,
        type: "success"
      })
      window.scrollTo(0, 0)
      return queryClient.invalidateQueries([prefix])
    },
    onError: handleError,
    ...config,
  })
  return {
    remove: mutation.mutate,
    removeAsync: mutation.mutateAsync
  }
}
export const usePutObject = (prefix, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationDispatch();
  const mutation = useMutation(({key, content, level, type}) => uploadObject(`${prefix}${key}`, content, level, type), {
    onSuccess: (_, data) => {
      const name = prefixToName(prefix)
      addNotification({
        header: `${capitalize(name)} saved`,
        content: `The ${data.level} ${name} ${data.key} was saved successfully`,
        type: "success"
      })
      window.scrollTo(0, 0)
      return queryClient.invalidateQueries([prefix])
    },
    onError: handleError,
    ...config,
  })
  return {
    put: mutation.mutate,
    putAsync: mutation.mutateAsync
  }
}

export default {
  useListObjects,
  useObject,
  usePutObject,
  useRemoveObject,
}
