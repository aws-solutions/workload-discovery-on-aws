// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Storage, Auth } from 'aws-amplify';
import * as R  from 'ramda';
import {ObjectNotFoundError} from "../../errors/ObjectNotFoundError";

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
    console.error(err);
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
    console.error(err);
    throw new Error('We could not complete that action. Please try again');
  });
};

export const listObjects = (key, level) => {
  return Storage.list(key, { level: level }).catch((err) => {
    console.error(err);
    throw new Error('We could not complete that action. Please try again');
  });
};

export const removeObject = (key, level) =>
  Storage.remove(key, { level: level }).catch((err) => {
    console.error(err);
    throw new Error('We could not complete that action. Please try again');
  });

export const getObject = async (key, level) => {
  return Storage.get(key, { level: level })
    .then((result) =>
      fetch(result)
        .then((res) => {
          if (R.equals(res.status, 404)) {
              throw new ObjectNotFoundError(res.statusText);
          } else {
              return res;
          }
        })
        .then((response) => response.json())
    );
};

export const generatePreSignedURL = (key, expires) => {
  return Storage.get(key, { expires: expires });
};
