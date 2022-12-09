// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {useQuery} from 'react-query'
import useQueryErrorHandler from "./useQueryErrorHandler"
import {
  exportToDrawIo,
  handleResponse,
  wrapResourceRequest,
} from '../../API/Handlers/ResourceGraphQLHandler';
import * as R from "ramda";
import {diagramsPrefix, useObject} from "./useS3Objects";
import {diagramToDrawioData} from "../Diagrams/Draw/Canvas/Export/Drawio/CreateDrawioDiagram";
import {getStatus} from "../../Utils/StatusUtils";

export const queryKey = "drawIo"
export const useDrawIoUrl = (name, visibility, config={}) => {
  const { handleError } = useQueryErrorHandler()
  const {data: diagramData, status} = useObject(name, diagramsPrefix, visibility);

  const { isLoading, isError, refetch, data, isFetching } = useQuery(
    [queryKey, name, visibility],
    () => Promise.resolve(R.pick(["nodes", "edges"], diagramData))
      .then(diagramToDrawioData)
      .then(inputData => wrapResourceRequest(exportToDrawIo, inputData))
      .then(handleResponse)
      .then(R.pathOr([], ['body', 'data', 'exportToDrawIo'])),
    {
      enabled: status === "finished" && !!diagramData,
      onError: handleError,
      retry: false,
      refetchInterval: false,
      ...config,
    }
  )

  return {
    data,
    refetch,
    isLoading,
    isError,
    status: getStatus(isFetching, isError)
  }
}

export default {
  useDrawIoUrl,
}
