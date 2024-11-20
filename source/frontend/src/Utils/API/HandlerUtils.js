// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {retryAttempts} from '../../config/api-retry';
import {delay} from '../../Utils/AsyncUtils';
import {Auth} from 'aws-amplify';
import * as R from 'ramda';

const noRetryErrors = new Set([
    'Unable to delete region(s), an account must have at least one region.',
]);

const isDuplicateApplicationError = R.test(
    /An application with the name [-.\w]+ already exists./
);

function isRetryable({errors = []}) {
    return errors.some(
        err =>
            !noRetryErrors.has(err.message) &&
            !isDuplicateApplicationError(err.message)
    );
}

export const wrapRequest = (processError, request, data, retryCount = 0) => {
    return Auth.currentSession()
        .catch(() => Auth.signOut())
        .then(e => {
            if (!R.equals(e, 'No current user')) {
                return request(data)
                    .then(response =>
                        processError(retryCount, retryAttempts, response)
                            ? delay(retryCount).then(
                                  wrapRequest(
                                      processError,
                                      request,
                                      data,
                                      retryCount + 1
                                  )
                              )
                            : wrapResponse(response, response.error)
                    )
                    .catch(err =>
                        isRetryable(err) && retryCount < retryAttempts
                            ? delay(retryCount).then(() =>
                                  wrapRequest(
                                      processError,
                                      request,
                                      data,
                                      retryCount + 1
                                  )
                              )
                            : wrapResponse(err, true)
                    );
            } else {
                Auth.signOut();
            }
        });
};

const wrapResponse = (data, error) => {
    return {
        error: error,
        body: data,
    };
};
