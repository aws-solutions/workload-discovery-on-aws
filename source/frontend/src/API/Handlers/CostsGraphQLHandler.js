// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { retryAttempts } from '../../config/api-retry';
import {delay} from "../../Utils/AsyncUtils";
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../GraphQL/queries';
import forOwn from 'lodash.forown';
import isObject from 'lodash.isobject';
import * as R  from 'ramda';

export const readResultsFromS3 = (params) => {
  return API.graphql(graphqlOperation(queries.readResultsFromS3, params));
};

export const getCostForResource = (params) => {
  return API.graphql(graphqlOperation(queries.getCostForResource, params));
};

export const getCostForService = (params) => {
  return API.graphql(graphqlOperation(queries.getCostForService, params));
};

export const getResourcesByCost = (params) => {
  return API.graphql(graphqlOperation(queries.getResourcesByCost, params));
};

export const getResourcesByCostByDay = (params) => {
  return API.graphql(graphqlOperation(queries.getResourcesByCostByDay, params));
};

const lookForError = (search, obj) => {
  let found;
  forOwn(obj, function(value, key) {
    found = isObject(value) ? lookForError(search, value) : key === search;
  });
  return found;
};

const processError = (retryCount, retryAttempts, response) => {
  return (
    response.error ||
    (lookForError('unprocessedAccounts', response) &&
      retryCount < retryAttempts)
  );
};

export const wrapCostAPIRequest = (request, data, retryCount = 0) =>
{
  return Auth.currentSession()
    .then((e) => {
      if (!R.equals(e, 'No current user')) {
        return request(data)
          .then((response) =>
            processError(retryCount, retryAttempts, response)
              ? delay(retryCount).then(
                wrapCostAPIRequest(request, data, retryCount + 1)
                )
              : wrapResponse(response, response.error)
          )
          .catch((err) =>
            retryCount < retryAttempts
              ? delay(retryCount).then(() =>
              wrapCostAPIRequest(request, data, retryCount + 1)
                )
              : wrapResponse(err, true)
          );
      } else {
        Auth.signOut();
      }
    })
    .catch(() => Auth.signOut());
};



const wrapResponse = (data, error) => {
  return {
    error: error,
    body: data,
  };
};

export function handleResponse(response) {
  if (!response || response.error)
    throw new Error('We could not complete that action. Please try again');
  else return response;
}
