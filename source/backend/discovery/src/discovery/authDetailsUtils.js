const ArnParser = require('./arnParser');
const logger = require('./logger');
const crypto = require('crypto');
const {promisify} = require('util');
const cryptoAsync = require('@ronomon/crypto-async');
const hashAsync = promisify(cryptoAsync.hash);

const hash = data => {
    const algo = 'md5';
    let shasum = crypto.createHash(algo).update(JSON.stringify(data));
    return "" + shasum.digest('hex');
}

async function md5Async(data) {
    const buffer = Buffer.from(JSON.stringify(data), 'utf8');
    const hash = await hashAsync('md5', buffer);
    return hash.toString('hex');
}

/**
     * Get the linked resources for this policy statment, filtering any duplicated
     * @param {*} accountId 
     * @param {*} awsRegion 
     * @param {*} resources 
     */
const getResources = async (accountId, awsRegion, resources, actions, dataClient) => {
    if (!Array.isArray(resources)) {
        resources = [resources];
    }

    let linkedResources = new Map();
    for (let resource of resources) {
        if (resource === "*") {
            let links = await processS3Actions(actions, accountId, dataClient);
            linkedResources = new Map([...linkedResources, ...links]);
        }
        else {
            let results = await queryResources(resource, accountId, dataClient);

            if (results.hits.total.value > 0) {
                // Only take the first result
                let result = results.hits.hits[0]._source;

                let resultHash = await md5Async(result);

                if (!linkedResources.get(resultHash)) {
                    linkedResources.set(resultHash, result);
                }
            }
        }
    }

    return [...linkedResources.values()];
}

const processS3Actions = async (actions, accountId, dataClient) => {
    let linkedResources = new Map();
    // We can link s3* actions to all buckets in an account.

    if (!Array.isArray(actions)) {
        actions = [actions];
    }

    let s3Actions = actions.filter(action => {
        if (action){
            return action.startsWith("s3:");
        }
    });

    if (s3Actions.length > 0) {
        const {results, success} = await dataClient.queryGremlin({
            "command": "filterNodes",
            "data": {
                "resourceType": "AWS::S3::Bucket",
                "accountId": "" + accountId,
            }
        });

        if(success) {
            await Promise.allSettled(results.map(async result => {
                // hashing allows us to skip duplicates
                let resultHash = await md5Async(result);

                if (!linkedResources.get(resultHash)) {
                    linkedResources.set(resultHash, result);
                }
            }));
        } else {
            logger.info('Failed to get S3 buckets to link with CustomerManagedPolicyStatements');
        }

    }

    return linkedResources;
}

const queryResources = async (arn, accountId, dataClient) => {
    try {
        let query = ArnParser.createQuery(arn, accountId);
        return await dataClient.advancedSearch(query);
    }
    catch (err) {
        logger.error(err);
        return {
            success: false
        }
    }
}

const formatLinkedResource = (resource) => {
    let data = {
        link: resource.id,
        resourceType: resource.properties.resourceType
    };

    return data;
}

module.exports = {
    getResources: getResources,
    formatLinkedResource: formatLinkedResource,
    hash: hash,
    md5Async
}