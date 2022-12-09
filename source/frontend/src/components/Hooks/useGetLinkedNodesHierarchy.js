// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react"
import {useQuery} from 'react-query'
import useQueryErrorHandler from "./useQueryErrorHandler"
import {
  wrapResourceRequest,
  handleResponse,
  batchGetLinkedNodesHierarchy,
} from '../../API/Handlers/ResourceGraphQLHandler';
import * as R from "ramda";
import {processHierarchicalNodeData} from "../../API/APIProcessors";
import {handleSelectedResource} from "../../API/Processors/NodeProcessors";
import {useNotificationDispatch} from "../Contexts/NotificationContext";
import {getStatus} from "../../Utils/StatusUtils";

export const queryKey = "getLinkedNodesHierarchy"
export const useBatchGetLinkedNodesHierarchy = (ids, graphResources=[], errorOnFail=false, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const { addNotification } = useNotificationDispatch()
  const runQuery = (ids) => wrapResourceRequest(
    batchGetLinkedNodesHierarchy,
    {
      ids,
    },
  )
    .then(handleResponse)
    .then(R.pathOr([], ['body', 'data', 'batchGetLinkedNodesHierarchy']))
  ;

  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    [queryKey, ids, graphResources, errorOnFail],
    () => runQuery(ids)
      .then(async resp => {
        const {unprocessedResources=[], hierarchies=[], notFound=[]} = resp;
        if (unprocessedResources.length > 0) {
          const retried = await runQuery(unprocessedResources);
          return {
            hierarchies: [...hierarchies, ...retried.hierarchies],
            unprocessedResources: retried.unprocessedResources ?? [],
            notFound: R.uniq([...notFound, ...retried.notFound ?? []])
          }
        }
        return resp
      })
      .then(resp => {
        const {notFound=[], unprocessedResources=[]} = resp;
        if (!errorOnFail) {
          const warningTemplate = (resources, msg) => ({
            header: `Unable to retrieve ${resources.length} resource${resources.length > 0 ? "s" : ""}`,
            content: <>
              {msg}
              <ul>
                {resources.slice(0,5).map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
              {resources.length > 5 && <>and {resources.length - 5} other resource{resources.length - 5 > 1 ? "s" : ""}</>}
            </>,
            type: "warning"
          })
          if (notFound.length > 0) addNotification(warningTemplate(notFound, "The following resources were not found:"))
          if (unprocessedResources.length > 0) addNotification(warningTemplate(unprocessedResources, "Unable to load node data for following resources:"))
        } else {
          if (notFound.concat(unprocessedResources).length > 0) throw new Error("Unable to some of the requested resources");
        }
        return resp;
      })
      .then(R.pathOr([], ['hierarchies']))
      .then(R.map(({parentId, hierarchy}) => handleSelectedResource(
          processHierarchicalNodeData(
            hierarchy,
            parentId,
          ),
        parentId,
        graphResources,
        false
        )
      ))
      .then((e) => Promise.all(e))
      .then(R.flatten)
    ,
    {
      onError: handleError,
      refetchInterval: false,
      enabled: false,
      cacheTime: 0,
      ...config,
    }
  )

  return {
    data,
    unprocessed:
    isLoading,
    isError,
    isFetching,
    refetch,
    status: getStatus(isFetching, isError)
  }
}

export default {
  useBatchGetLinkedNodesHierarchy,
}
