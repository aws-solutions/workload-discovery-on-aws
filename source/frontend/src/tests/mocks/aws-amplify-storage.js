// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const objectStore = new Map();

function resolvePath(path) {
    if (typeof path === 'function') {
        return path({identityId: 'testIdentityId'});
    }
    return path;
}

export function uploadData({path, data}) {
    const resolvedPath = resolvePath(path);
    const result = (async () => {
        const blobString = await data.text();
        objectStore.set(resolvedPath, JSON.parse(blobString));
        return {path: resolvedPath};
    })();
    return {result};
}

export async function getUrl({path}) {
    const resolvedPath = resolvePath(path);
    return {
        url: new URL(`https://www.mock-s3.com/${resolvedPath}`),
        expiresAt: new Date(Date.now() + 900000),
    };
}

export async function list({path}) {
    const resolvedPath = resolvePath(path);
    const items = Array.from(objectStore.entries())
        .filter(([k]) => k.startsWith(resolvedPath))
        .map(([key]) => ({
            path: key,
            eTag: '"2836448242231487dc857a2d5334327e"',
            lastModified: new Date(),
            size: 404764,
        }));
    return {items};
}

export async function remove({path}) {
    const resolvedPath = resolvePath(path);
    objectStore.delete(resolvedPath);
}

export async function _getObject(key) {
    return objectStore.get(key);
}
