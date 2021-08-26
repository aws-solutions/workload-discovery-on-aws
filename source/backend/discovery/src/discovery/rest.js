/**
 * Functions to interact with the Server Side API's using IAM authentication
 */

const axios = require('axios');
const AWS4 = require('aws4');
const logger = require('./logger');

const retry = require('async-retry');
const RETRIES = 5;
const MIN_TIMEOUT = 500;

const postGremlin = async (body, importConfig, accessKeys) => {
    return await post(body, importConfig.dataPath, importConfig, accessKeys);
}

const postElastic = async (body, importConfig, accessKeys) => {
    return await post(body, importConfig.searchPath, importConfig, accessKeys)
}

const extractPath = (url) => {
    let holder = url.split("/");
    return "/" + holder[3] + "/";
}

const extractHost = (url) => {
    let hostStart = url.split("//")[1];
    return hostStart.substring(0, hostStart.indexOf('/'));
}

const post = async (body, path, importConfig, accessKeys) => {
    let request = {
        host: extractHost(importConfig.apiURL),
        method: 'POST',
        url: importConfig.apiURL + path,
        data: body, // object describing the foo
        body: JSON.stringify(body), // aws4 looks for body; axios for data
        path: extractPath(importConfig.apiURL) + path,
        headers: {
            'content-type': 'application/json'
        }
    }

    const signedRequest = AWS4.sign(request,
        {
            // assumes user has authenticated and we have called
            // AWS.config.credentials.get to retrieve keys and
            // session tokens
            secretAccessKey: accessKeys.secretAccessKey,
            accessKeyId: accessKeys.accessKeyId,
            sessionToken: accessKeys.sessionToken

        });

    delete signedRequest.headers['Host'];
    delete signedRequest.headers['Content-Length'];

    const {data} = await retry(async (bail, count) => {
        return axios(signedRequest).catch(err => {
            if(count > 1) {
                logger.debug(`Retry no ${count} because: ${body.command} with id ${body.data.id || body.data.source}`);
                logger.debug(err);
            }
            if(err.response.status === 400 || err.response.status === 500 ) return bail(err);
            if(count === RETRIES) logger.debug(`Retry limit for ${body.command} exceeded.`);
            else throw err;
        });
    }, {retries: RETRIES, minTimeout: MIN_TIMEOUT})

    return data;
}

const get = async (command, importConfig, accessKeys) => {
    let request = {
        host: extractHost(importConfig.apiURL),
        method: 'GET',
        url: importConfig.apiURL + importConfig.dataPath + "?" + command,
        path: extractPath(importConfig.apiURL) + importConfig.dataPath + "?" + command,
    };

    const signedRequest = AWS4.sign(request,
        {
            // assumes user has authenticated and we have called
            // AWS.config.credentials.get to retrieve keys and
            // session tokens
            secretAccessKey: accessKeys.secretAccessKey,
            accessKeyId: accessKeys.accessKeyId,
            sessionToken: accessKeys.sessionToken

        });

    delete signedRequest.headers['Host'];
    delete signedRequest.headers['Content-Length'];

    const {data} = await retry(async (bail, count) => {
        return axios(signedRequest).catch(err => {
            if(count > 1) logger.debug(`Retry no ${count} for ${request.url}`);
            if(err.response.status === 500) return bail(err);
            if(count === RETRIES) logger.debug(`Retry limit for ${request.url} exceeded.`);
            else throw err;
        });
    }, {retries: RETRIES, minTimeout: MIN_TIMEOUT});

    return data;
}

const arrayGet = async (url) => {
    return axios({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer',
        timeout: 4000
    });
}

module.exports = {
    postGremlin,
    postElastic,
    get,
    arrayGet
};
