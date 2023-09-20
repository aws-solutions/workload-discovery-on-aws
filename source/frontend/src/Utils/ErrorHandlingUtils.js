// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import forOwn from 'lodash.forown';
import isObject from 'lodash.isobject';

const lookForError = (search, obj) => {
    let found;
    forOwn(obj, function(value, key) {
      found = isObject(value) ? lookForError(search, value) : key === search;
    });
    return found;
  };
  
export const processAccountsError = (retryCount, retryAttempts, response) => {
  return (
    response.error ||
    (lookForError('unprocessedAccounts', response) &&
      retryCount < retryAttempts)
  );
};

export const processResourcesError = (retryCount, retryAttempts, response) =>
response.error && retryCount < retryAttempts;