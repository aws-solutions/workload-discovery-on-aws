// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {uploadData, getUrl, list, remove} from 'aws-amplify/storage';
import {getCurrentUser} from 'aws-amplify/auth';
import * as R from 'ramda';
import {ObjectNotFoundError} from '../../errors/ObjectNotFoundError';

function buildPath(key, level) {
    if (level === 'private') return ({identityId}) => `private/${identityId}/${key}`;
    if (level === 'protected') return ({identityId}) => `protected/${identityId}/${key}`;
    return () => `public/${key}`;
}

function stripLevelPrefix(path) {
    if (path.startsWith('public/')) return path.slice('public/'.length);
    const match = path.match(/^(?:private|protected)\/[^/]+\/(.*)/);
    return match ? match[1] : path;
}

export const uploadObject = async (key, content, level, type) => {
    const blob = new Blob([content]);
    const {username} = await getCurrentUser();
    return uploadData({
        path: buildPath(key, level),
        data: blob,
        options: {metadata: {username}},
    }).result;
};

export const listObjects = (key, level) => {
    return list({path: buildPath(key, level)})
        .then(res => res.items.map(item => ({
            ...item,
            key: stripLevelPrefix(item.path),
        })))
        .catch(err => {
            console.error(err);
            throw new Error(
                'We could not complete that action. Please try again'
            );
        });
};

export const removeObject = (key, level) =>
    remove({path: buildPath(key, level)}).catch(err => {
        console.error(err);
        throw new Error('We could not complete that action. Please try again');
    });

export const getObject = async (key, level) => {
    const {url} = await getUrl({path: buildPath(key, level)});
    return fetch(url)
        .then(res => {
            if (R.equals(res.status, 404)) {
                throw new ObjectNotFoundError(res.statusText);
            } else {
                return res;
            }
        })
        .then(response => response.json());
};
