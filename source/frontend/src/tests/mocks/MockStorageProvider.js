// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const objectStore = new Map();

class MockStorageProvider {
    configure(config) {}

    // get object/pre-signed url from storage
    async get(key, {level}) {
        return `https://www.mock-s3.com/${level}/${key}`
    }

    async _getObject(key) {
        return objectStore.get(key);
    }

    async put(key, object, {metadata, level, completeCallback, errorCallback}) {
        try {
            const blobString = await object.text();
            objectStore.set(`${level}/${key}`, JSON.parse(blobString));
            completeCallback({result: 'Completed!'})
        } catch(err) {
            errorCallback(new Error('Error!'));
        }
    }

    async remove(key, {level}) {
        objectStore.delete(`${level}/${key}`);
    }

    async list(path, options) {
        return Array.from(objectStore.entries())
            .map(([key, v]) => {
                return {
                    key,
                    eTag: "\"2836448242231487dc857a2d5334327e\"",
                    lastModified: new Date().toDateString(),
                    size: 404764
                }
            });
    }

    getCategory() {
        return 'Storage';
    }
    // return the name of you provider
    getProviderName() {
        return 'MockStorage';
    }
}

const mockStorageProvider = new MockStorageProvider();

export default mockStorageProvider;