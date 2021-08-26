import Amplify, { Storage, Auth } from 'aws-amplify';
const R = require('ramda');

Amplify.configure(window.amplify);

export const uploadObject = async (key, content, level, type) => {
  return Storage.put(key, content, {
    level: level,
    contentType: type,
    metadata: {
      username: `${await Auth.currentAuthenticatedUser().then(
        (response) => response.username
      )}`,
    },
  }).catch((err) => {
    throw new Error('We could not complete that action. Please try again');
  });
};

export const uploadTemplate = async (key, content, type) => {
  return Storage.put(key, content, {
    acl: 'public-read',
    contentType: type,
    metadata: {
      username: `${await Auth.currentAuthenticatedUser().then(
        (response) => response.username
      )}`,
    },
  }).catch((err) => {
    throw new Error('We could not complete that action. Please try again');
  });
};

export const listObjects = (key, level) => {
  return Storage.list(key, { level: level }).catch((err) => {
    throw new Error('We could not complete that action. Please try again');
  });
};

export const removeObject = (key, level) => {
  return Storage.remove(key, { level: level }).catch((err) => {
    throw new Error('We could not complete that action. Please try again');
  });
};

export const removeObjects = async (keys, level) =>
  Promise.all(
    keys
      .map(async (key) => await Storage.remove(key, { level: level }))
      .catch((err) => {
        throw new Error('We could not complete that action. Please try again');
      })
  );

export const getObject = async (key, level) => {
  return await Storage.get(key, { level: level })
    .then((result) =>
      fetch(result)
        .then((res) => {
          if (R.equals(res.status, 404))
            throw {
              name: 'ObjectNotFound',
              message: res.statusText,
              status: res.status,
            };
          else return res;
        })
        .then((response) => response.json())
        .catch((err) => {
          throw err;
        })
    )
    .catch((err) => {
      throw err;
    });
};

export const generatePreSignedURL = (key, expires) => {
  return Storage.get(key, { expires: expires });
};
