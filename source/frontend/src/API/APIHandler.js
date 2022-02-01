import { retryAttempts } from '../config/api-retry';
import { API, Auth } from 'aws-amplify';
const R = require('ramda');
export const sendGetRequest = async (query, processor) => {
  let apiName = 'PerspectiveWebRestAPI';
  let path = `/resources${query.command}`;
  await Auth.currentSession().catch((err) => {
    if (R.equals(err, 'No current user')) Auth.signOut();
  });

  let myInit = {
    headers: {
      Authorization: `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`,
    },
  };

  return API.get(apiName, path, myInit)
    .then(async (response) => {
      return wrapResponse(
        await processor(response, query.params, query.preferences),
        false
      );
    })
    .catch((error) => {
      return wrapResponse(error, true);
    });
};

export const sendPostRequest = async (query, processor) => {
  let apiName = 'PerspectiveWebRestAPI';
  let path = `/resources`;
  await Auth.currentSession().catch((err) => {
    if (R.equals(err, 'No current user')) Auth.signOut();
  });
  let myInit = {
    body: query.body,
    headers: {
      Authorization: `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`,
    },
  };
  return API.post(apiName, path, myInit)
    .then(async (response) => {
      return wrapResponse(
        await processor(response, query.params, query.preferences),
        false
      );
    })
    .catch((error) => {
      return wrapResponse(error, true);
    });
};

export const sendDrawioPostRequest = async (query, processor) => {
  let apiName = 'PerspectiveDrawioWebRestAPI';
  let path = `/resources`;

  await Auth.currentSession().catch((err) => {
    if (R.equals(err, 'No current user')) Auth.signOut();
  });

  let myInit = {
    body: query.body,
    headers: {
      Authorization: `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`,
    },
  };
  return API.post(apiName, path, myInit)
    .then(async (response) => {
      return wrapResponse(await processor(response, query.params), false);
    })
    .catch((error) => {
      return wrapResponse(error, true);
    });
};

export const requestWrapper = async (request, data, attempts = 0) => {
  let response = await request(data, data.processor, data.preferences);
  if (response.error && attempts < retryAttempts) {
    attempts++;
    setTimeout(
      async () => await requestWrapper(request, data, attempts),
      getExponentialBackoff(attempts)
    );
  }
  return response;
};
function getExponentialBackoff(attempts) {
  return Math.max((attempts *= 2), 1) * 1000;
}

const wrapResponse = (data, error) => {
  return {
    error: error,
    body: data,
  };
};
