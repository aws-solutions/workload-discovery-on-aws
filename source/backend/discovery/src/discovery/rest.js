/**
 * Functions to interact with the Server Side API's using IAM authentication
 */

const axios = require('axios');
const AWS4 = require('aws4');
const zoomUtils = require('./zoomUtils');

const instance = axios.create();
instance.defaults.timeout = 10000;

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

    let res = await zoomUtils.retry(this, instance, [signedRequest], 3, 1000, "rest.post");
    let response = await res.data;

    return response;
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

    let res = await zoomUtils.retry(this, instance, [signedRequest], 3, 1000, "rest.get");
    let response = await res.data;
    return response;
}

const simpleGet = async (url) => {
    return await instance.get(url);
}

const arrayGet = async (url) => {
    return await instance ({
        url: url,
        method: 'GET',
        responseType: 'arraybuffer',
        timeout: 4000
    });
}

exports.postGremlin = postGremlin;
exports.postElastic = postElastic;
exports.get = get;
exports.simpleGet = simpleGet;
exports.arrayGet = arrayGet;
