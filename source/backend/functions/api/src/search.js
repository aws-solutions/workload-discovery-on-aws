console.log('Loading function');

const aws = require('aws-sdk');
var es = new aws.ES();

const region = process.env.ES_REGION; // e.g. us-west-1
const domain = process.env.ES_DOMAIN; // e.g. search-domain.region.es.amazonaws.com
const docType = '_doc';
const searchType = '_search';
const updateType = '_update';
const util = require('util');

const index = "data";

const parsePostInput = (event) => {
    return JSON.parse(event.body);
};

const parseGetInput = (event) => {
    return {
        command: event.queryStringParameters.command,
        data: {
            id: event.queryStringParameters.id,
            resourceType: event.queryStringParameters.resourceType
        }
    }
};

exports.handler = async (inputEvent) => {
    const event = inputEvent.httpMethod === "GET" ? parseGetInput(inputEvent) : parsePostInput(inputEvent);
    switch (event.command) {
        case "index":
            return await queryElasticSearch(indexDocument)(event);
        case "update":
            return await queryElasticSearch(updateDocument)(event);
        case "fetch":
            return await queryElasticSearch(fetchDocument)(event);
        case "deleteDocument":
            return await queryElasticSearch(deleteDocument)(event);
        case "deleteIndex":
            return await queryElasticSearch(deleteIndex)(event);
        case "queryIndex":
            return await queryElasticSearch(queryIndex)(event);
        case "getIndex":
            return await queryElasticSearch(getIndex)(event);
        default:
            return wrapResponse(404, '{ error: "Command not found *" + event.command + "*", event: event.data }');
    }
};

const dumpError = (err) => {
    if (typeof err === 'object') {
        if (err.message) {
            console.log("===================");
            console.log('Error Message: ' + err.message)
        }
        if (err.stack) {
            console.log("====================");
            console.log('Stacktrace:')
            console.log(err.stack);
            console.log("====================");
        }
    } else {
        console.log('dumpError :: argument is not an object');
        console.log(util.inspect(err, { depth: 10 }));
    }
};

const wrapResponse = (statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
});

function queryElasticSearch(runnerFunction) {
    return async (event) => {
        try {
            
            let response = await runnerFunction(requestSender, event);

            const validCodes = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 404];

            if (!validCodes.includes(response.statusCode)){
                let errorMessage = response.statusCode + "\n" + JSON.stringify(response.body) + "\n" + JSON.stringify(event);
                let error = new Error(errorMessage);
                throw(error);
            }
            else {
                return wrapResponse(200,response.body);
            }
        }
        catch(error){
            dumpError(error);
            return wrapResponse(500, { error: error.toString() });
        }
    };
};

const deleteIndex = async (promiseSender, event) => {
    return await promiseSender(buildRequest(index, 'DELETE', undefined));
};

const deleteDocument = async (promiseSender, event) => {
    var path =  index + '/' + docType + '/' + event.data.id;
    return await promiseSender(buildRequest(path, 'DELETE', undefined));
};

const indexDocument =  async (promiseSender, event) => {
    var path = index + '/' + docType + '/' + event.data.id;
    return await promiseSender(buildRequest(path, 'PUT', event.data));
};

const updateDocument =  async (promiseSender, event) => {
    var path = index + '/' + docType + '/' + event.data.id + '/' + updateType;
    return await promiseSender(buildRequest(path, 'PUT', event.data));
};

const fetchDocument = async (promiseSender, event) => {
    var path = index + '/' + searchType + '/?q=' + encodeURI(event.data.searchTerms) + '&pretty';
    return await promiseSender(buildRequest(path, 'GET', undefined));
};

const queryIndex = async (promiseSender, event) => {
    var path = index + '/' + searchType;
    return await promiseSender(buildRequest(path, 'POST', event.data));
}

const getIndex = async (promiseSender, event) => {
    var path = index + "/_mapping";
    return await promiseSender(buildRequest(path, 'GET', undefined));
};

const buildRequest = (path, method, document) => {
    var endpoint = new aws.Endpoint(domain);
    var request = new aws.HttpRequest(endpoint, region);

    request.method = method;
    request.path += path;
    
    request.headers['host'] = domain;
    request.headers['Content-Type'] = 'application/json';
    document != undefined ? request.body = JSON.stringify(document) : '';

    var credentials = new aws.EnvironmentCredentials('AWS');
    var signer = new aws.Signers.V4(request, 'es');
    signer.addAuthorization(credentials, new Date());
    return request;
};

const requestSender = async (request) => {
    var httpClient = new aws.HttpClient();
    return new Promise((resolve, reject) => {
        httpClient.handleRequest(request, null,
            response => {
                const { statusCode, statusMessage, headers } = response;
                let body = '';
                response.on('data', chunk => {
                    body += chunk;
                });
                response.on('end', () => {
                    const data = {
                        statusCode,
                        statusMessage,
                        headers
                    };
                    if (body) {
                        data.body = JSON.parse(body);
                    }
                    resolve(data);
                });
            },
            err => {
                reject(err);
            });
    });
};
