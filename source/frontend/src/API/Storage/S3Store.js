import { Storage, Auth } from 'aws-amplify';

Storage.configure(window.amplify.Storage);

export const uploadObject = async (key, content, level, type) => {
  return Storage.put(key, content, {
    level: level,
    contentType: type,
    metadata: {
      username: `${await Auth.currentAuthenticatedUser().then(
        (response) => response.username
      )}`,
    },
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
  });
};

export const listObjects = (key, level) => {
  return Storage.list(key, { level: level });
};

export const removeObject = (key, level) => {
  return Storage.remove(key, { level: level });
};

export const removeObjects = async (keys, level) =>
  Promise.all(
    keys.map(async (key) => await Storage.remove(key, { level: level }))
  );

export const getObject = async (key, level) => {
  return await Storage.get(key, { level: level })
    .then((result) => {
      return fetch(result)
        .then((response) => response.json())
        .catch((err) => err);
    })
    .catch((err) => err);
};

export const generatePreSignedURL = (key, expires) => {
  return Storage.get(key, { expires: expires });
};
