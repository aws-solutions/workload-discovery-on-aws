import { retryAttempts } from '../../config/api-retry';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../GraphQL/queries';
import * as R  from 'ramda';

export const getLinkedNodesHierarchy = (params) => {
  return API.graphql(graphqlOperation(queries.getLinkedNodesHierarchy, params));
};

export const batchGetLinkedNodesHierarchy = (params) => {
  return API.graphql(graphqlOperation(queries.batchGetLinkedNodesHierarchy, params));
};

export const getResources = (params) => {
  return API.graphql(graphqlOperation(queries.getResources, params));
};
export const getResourcesMetadata = (params) => {
  return API.graphql(graphqlOperation(queries.getResourcesMetadata, params));
};

export const getResourcesAccountMetadata = (params) => {
  return API.graphql(
    graphqlOperation(queries.getResourcesAccountMetadata, params)
  );
};

export const getResourcesRegionMetadata = (params) => {
  return API.graphql(
    graphqlOperation(queries.getResourcesRegionMetadata, params)
  );
};

export const searchResources = (params) => {
  return API.graphql(graphqlOperation(queries.searchResources, params));
};

export const exportToDrawIo = (params) => {
  return API.graphql(graphqlOperation(queries.exportToDrawIo, params));
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

  return Promise.all(requests);
};

export const wrapResourceRequest = (request, data, retryCount = 0) => {
  return request(data)
    .then((response) => {
      return processError(retryCount, retryAttempts, response)
        ? delay(retryCount).then(
            wrapResourceRequest(request, data, retryCount + 1)
          )
        : wrapResponse(response, response.error);
    })
    .catch((err) => {
      return retryCount < retryAttempts
        ? delay(retryCount).then(() =>
            wrapResourceRequest(request, data, retryCount + 1)
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
  if (!response || response.error) {
    throw new InvalidRequestException(response.body.errors);
  } else return response;
}

class InvalidRequestException extends Error {
  constructor(errors = [], ...args) {
    super(errors.map(e => e.message).join(", "), ...args);
    this.errors = errors;
    this.name = this.constructor.name;
  }
}
