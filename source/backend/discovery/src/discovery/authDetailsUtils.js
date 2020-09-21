const ArnParser = require('./arnParser');
const logger = require('./logger');

const hash = data => {
    const crypto = require('crypto');
    const algo = 'md5';
    let shasum = crypto.createHash(algo).update(JSON.stringify(data));
    return "" + shasum.digest('hex');
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

            if (results.hits.total > 0) {
                // Only take the first result
                let result = results.hits.hits[0]._source;
                let resultHash = hash(result);

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
        let query = {
            "from" : 0, "size" : 10000,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "properties.resourceType.keyword": "AWS::S3::Bucket"
                            }
                        },
                        {
                            "term": {
                                "properties.accountId.keyword": accountId
                            }
                        }
                    ]
                }
            }
        };

        let results = await dataClient.advancedSearch(query);
    
        if (results.hits.total > 0) {
            results.hits.hits.forEach(hit => {
                let result = hit._source;
                let resultHash = hash(result);

                if (!linkedResources.get(resultHash)) {
                    linkedResources.set(resultHash, result);
                }
            });
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
    hash: hash
}