const R = require("ramda");
const {PromisePool} = require("@supercharge/promise-pool");
const logger = require("../logger");

function getDbResourcesMap(appSync) {
    const pageSize = 500;
    function getDbResources(pagination, resourcesMap = new Map()) {
        return appSync.getResources({pagination})
            .then(resources => {
                if(R.isEmpty(resources)) return resourcesMap;
                resources.forEach(r => resourcesMap.set(r.id, {
                    id: r.id,
                    label: r.label,
                    md5Hash: r.md5Hash,
                    // gql will return `null` for missing properties which will break the hashing
                    // comparison for sdk discovered resources
                    properties: R.reject(R.isNil, r.properties)
                }));
                const {start, end} = pagination;
                return getDbResources({start: start + pageSize, end: end + pageSize}, resourcesMap);
            })
    }

    return async () => getDbResources({start: 0, end: pageSize});
}

function getDbRelationshipsMap(appSync) {
    const pageSize = 2000;

    function getDbRelationships(pagination, relationshipsMap= new Map()) {
        return appSync.getRelationships({pagination})
            .then(relationships => {
                if(R.isEmpty(relationships)) return relationshipsMap;
                relationships.forEach(rel => {
                    const {id: source} = rel.source;
                    const {id: target} = rel.target;
                    const {label, id} = rel;
                    relationshipsMap.set(`${source}_${label}_${target}`, {
                        source, target, id, label
                    })
                });
                const {start, end} = pagination;
                return getDbRelationships({start: start + pageSize, end: end + pageSize}, relationshipsMap);
            })
    }

    return async () => getDbRelationships({start: 0, end: pageSize});
}

function process(processor) {
    return ({concurrency, batchSize}, resources) => PromisePool
        .withConcurrency(concurrency)
        .for(R.splitEvery(batchSize, resources))
        .process(processor);
}
function updateAccountsCrawledTime(appSync) {
    return async accountIds => {
        const {errors, results} = await PromisePool
            .withConcurrency(25)
            .for(accountIds)
            .process(async accountId => {
                const res = await appSync.updateAccount(accountId, new Date().toISOString());
                return res;
            });

        logger.error(`There were ${errors.length} errors when updating last crawled time for accounts.`);
        logger.debug('Errors: ', {errors});

        return {errors, results};
    }
}

module.exports = {
    createApiClient(appSync) {
        return {
            getDbResourcesMap: getDbResourcesMap(appSync),
            getDbRelationshipsMap: getDbRelationshipsMap(appSync),
            storeResources: process(async resources => {
                await appSync.indexResources(resources);
                await appSync.addResources(resources);
            }),
            deleteResources: process(async ids => {
                await appSync.deleteIndexedResources(ids);
                await appSync.deleteResources(ids);
            }),
            updateResources: process(async resources => {
                await appSync.updateIndexedResources(resources);
                await appSync.updateResources(resources);
            }),
            deleteRelationships: process(async ids => {
                return appSync.deleteRelationships(ids);
            }),
            storeRelationships: process(async relationships => {
                return appSync.addRelationships(relationships);
            }),
            updateAccountsCrawledTime: updateAccountsCrawledTime(appSync)
        };
    }
}