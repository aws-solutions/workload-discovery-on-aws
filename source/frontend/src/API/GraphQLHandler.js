import { retryAttempts } from '../config/api-retry';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from './GraphQL/queries';
import * as mutations from './GraphQL/mutations';
var forOwn = require('lodash.forown');
var isObject = require('lodash.isobject');

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

const delay = (retryCount) =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.max((retryCount *= 2), 1) * 1000)
  );

const lookForError = (search, obj) => {
  let found;
  forOwn(obj, function(value, key) {
    found =
      isObject(value)
        ? lookForError(search, value)
        : key === search;
  });
  return found;
};

const processError = (retryCount, retryAttempts, response) => {
  return response.error || lookForError('unprocessedAccounts',response) && retryCount < retryAttempts
}

export const wrapRequest = (request, data, retryCount = 0) =>
  request(data)
    .then((response) =>
    processError(retryCount, retryAttempts, response)
        ? delay(retryCount).then(wrapRequest(request, data, retryCount + 1))
        : wrapResponse(response, response.error)
    )
    .catch((err) =>
      retryCount < retryAttempts
        ? delay(retryCount).then(() =>
            wrapRequest(request, data, retryCount + 1)
          )
        : wrapResponse(err, true)
    );

const wrapResponse = (data, error) => {
  return {
    error: error,
    body: data
  };
};

export function handleResponse(response) {
  if (response.error)
    throw new Error('We could not complete that action. Please try again');
  else return response;
}
