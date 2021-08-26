import { retryAttempts } from '../../config/api-retry';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../GraphQL/queries';
import { processHierarchicalNodeData } from '../APIProcessors';
import { handleSelectedResource } from '../Processors/NodeProcessors';
var forOwn = require('lodash.forown');
var isObject = require('lodash.isobject');
const R = require('ramda');

export const getLinkedNodesHierarchy = (params) => {
  return API.graphql(graphqlOperation(queries.getLinkedNodesHierarchy, params));
};

const delay = (retryCount) =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.max((retryCount *= 2), 1) * 1000)
  );

const processError = (retryCount, retryAttempts, response) =>
  response.error && retryCount < retryAttempts;

export const sendGetRequests = async (requests) => {
  await Auth.currentSession().catch((err) => {
    if (R.equals(err, 'No current user')) Auth.signOut();
  });

  return await Promise.all(requests).catch((err) => {
    throw err;
  });
};

export const wrapGetLinkedNodesHierachyRequest = (
  request,
  data,
  retryCount = 0
) => {
  return request(data)
    .then((response) => {
      return processError(retryCount, retryAttempts, response)
        ? delay(retryCount).then(
            wrapGetLinkedNodesHierachyRequest(request, data, retryCount + 1)
          )
        : wrapResponse(response, response.error);
    })
    .catch((err) => {
      return retryCount < retryAttempts
        ? delay(retryCount).then(() =>
            wrapGetLinkedNodesHierachyRequest(request, data, retryCount + 1)
          )
        : wrapResponse(err, true);
    });
};

const wrapResponse = (data, error) => {
  return {
    error: error,
    body: data,
  };
};

export function handleResponse(response) {
  if (response.error)
    throw new Error('We could not complete that action. Please try again');
  else return response;
}
