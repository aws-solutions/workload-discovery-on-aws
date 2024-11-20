// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Storage, Auth} from 'aws-amplify';
import * as R from 'ramda';
import {ObjectNotFoundError} from '../../errors/ObjectNotFoundError';

const [provider] = Object.keys(Storage._config);

export const uploadObject = async (key, content, level, type) => {
    const blob = new Blob([content]);
    const {username} = await Auth.currentAuthenticatedUser();

    return new Promise((res, rej) => {
        Storage.put(key, blob, {
            level,
            resumable: true,
            metadata: {
                username,
            },
            provider,
            completeCallback: event => {
                res(event);
            },
            errorCallback: err => {
                console.error(err);
                rej(
                    new Error(
                        'We could not complete that action. Please try again'
                    )
                );
            },
        });
    });
};

export const listObjects = (key, level) => {
    return Storage.list(key, {level, provider})
        .then(res => res.results)
        .catch(err => {
            console.error(err);
            throw new Error(
                'We could not complete that action. Please try again'
            );
        });
};

export const removeObject = (key, level) =>
    Storage.remove(key, {level, provider}).catch(err => {
        console.error(err);
        throw new Error('We could not complete that action. Please try again');
    });

export const getObject = async (key, level) => {
    return Storage.get(key, {level, provider}).then(result =>
        fetch(result)
            .then(res => {
                if (R.equals(res.status, 404)) {
                    throw new ObjectNotFoundError(res.statusText);
                } else {
                    return res;
                }
            })
            .then(response => response.json())
    );
};
