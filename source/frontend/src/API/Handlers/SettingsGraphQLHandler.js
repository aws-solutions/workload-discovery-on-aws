// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { retryAttempts } from '../../config/api-retry';
import {delay} from "../../Utils/AsyncUtils";
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../GraphQL/queries';
import * as mutations from '../GraphQL/mutations';
import forOwn from 'lodash.forown';
import isObject from 'lodash.isobject';

import * as R  from 'ramda';

// Query using a parameter
export const getAccounts = () => {
  return API.graphql(graphqlOperation(queries.getAccounts, {}));
};

export const getAccount = (account) => {
  return API.graphql(graphqlOperation(queries.getAccount, account));
};

export const addAccounts = (params) => {
  return API.graphql(graphqlOperation(mutations.addAccounts, params));
};

export const addRegions = (params) => {
  return API.graphql(graphqlOperation(mutations.addRegions, params));
};

export const deleteRegions = (params) => {
  return API.graphql(graphqlOperation(mutations.deleteRegions, params));
};

export const deleteAccounts = (accountIds) => {
  return API.graphql(graphqlOperation(mutations.deleteAccounts, accountIds));
};

export const getGlobalTemplate = () => {
  return API.graphql(graphqlOperation(queries.getGlobalTemplate, {}));
};

export const getRegionalTemplate = () => {
  return API.graphql(graphqlOperation(queries.getRegionalTemplate, {}));
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

export const wrapRequest = (request, data, retryCount = 0) => {
  return Auth.currentSession()
    .then((e) => {
      if (!R.equals(e, 'No current user')) {
        return request(data)
          .then((response) =>
            processError(retryCount, retryAttempts, response)
              ? delay(retryCount).then(
                  wrapRequest(request, data, retryCount + 1)
                )
              : wrapResponse(response, response.error)
          )
          .catch((err) =>
            retryCount < retryAttempts
              ? delay(retryCount).then(() =>
                  wrapRequest(request, data, retryCount + 1)
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
  if (!response || response.error) {
    throw new Error('We could not complete that action. Please try again');
  } else return response;
}
