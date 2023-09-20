// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  handleResponse,
  readResultsFromS3
} from '../../../../API/Handlers/CostsGraphQLHandler';
import { wrapRequest } from '../../../../Utils/API/HandlerUtils';
import { processAccountsError } from '../../../../Utils/ErrorHandlingUtils';

export const sendCostQuery = (queryToExecute) =>
  wrapRequest(processAccountsError, queryToExecute.queryFunction, queryToExecute.queryOptions)
    .then(handleResponse);
export const fetchNextPage = (pagination, queryDetails) =>
  wrapRequest(processAccountsError, readResultsFromS3, {
    s3Query: {
      bucket: queryDetails.s3Bucket,
      key: queryDetails.s3Key,
      pagination: pagination,
    },
  })
    .then(handleResponse);
