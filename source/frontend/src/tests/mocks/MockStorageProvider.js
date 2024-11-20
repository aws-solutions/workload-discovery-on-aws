// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const objectStore = new Map();

class MockStorageProvider {
    configure(config) {}

    // get object/pre-signed url from storage
    async get(key, {level}) {
        const [slug, diagramName] = key.split('/');
        return `https://www.mock-s3.com/${slug}/${level}/${diagramName}`;
    }

    async _getObject(key) {
        return objectStore.get(key);
    }

    async put(key, object, {metadata, level, completeCallback, errorCallback}) {
        try {
            const blobString = await object.text();
            const [slug, diagramName] = key.split('/');
            objectStore.set(
                `${slug}/${level}/${diagramName}`,
                JSON.parse(blobString)
            );
            completeCallback({result: 'Completed!'});
        } catch (err) {
            console.error(err);
            errorCallback(new Error('Error!'));
        }
    }

    async remove(key, {level}) {
        const [slug, diagramName] = key.split('/');
        objectStore.delete(`${slug}/${level}/${diagramName}`);
    }

    async list(path, {level}) {
        const results = Array.from(objectStore.entries())
            .filter(([k, v]) => {
                return k.includes(level);
            })
            .map(([key, v]) => {
                const [slug, , diagramName] = key.split('/');
                return {
                    key: `${slug}/${diagramName}`,
                    eTag: '"2836448242231487dc857a2d5334327e"',
                    lastModified: new Date().toDateString(),
                    size: 404764,
                };
            });

        return {results};
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
