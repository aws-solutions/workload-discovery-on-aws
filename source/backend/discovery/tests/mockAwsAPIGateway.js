/**
 * A module to mock out the methods that are called from discovery on the API gateway 
 */


 const zoomTestUtils = require('./zoomTestUtils');


/**
 * Mock getIntegrations API call
 * 
 * var params = {
               httpMethod: httpMethod, 
               resourceId: resourceId, 
               restApiId: restApiId 
           };
 * 
 * @param {*} parameter 
 */

const getIntegration = (parameter) => {
    // This integration does not exist
    if (parameter.httpMethod === "GET" && parameter.restApiId === "57qj6lrxxa" && parameter.resourceId === "0wp5kb") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "57qj6lrxxa" && parameter.resourceId === "0wp5kb") {
        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:elastic/invocations',
            requestParameters: {},
            requestTemplates: {},
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: '0wp5kb',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "57qj6lrxxa" && parameter.resourceId === "cfh8yurk85") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "57qj6lrxxa" && parameter.resourceId === "cfh8yurk85") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "57qj6lrxxa" && parameter.resourceId === "hcqvzk") {
        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin/invocations',
            requestParameters: {},
            requestTemplates:
            {
                'application/json':
                    '{\n   "command" : "$input.params(\'command\')",\n   "data":{\n        "id": "$input.params(\'id\')",\n        "resourceType": "$input.params(\'resourceType\')"\n     }\n}'
            },
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'hcqvzk',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);

    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "57qj6lrxxa" && parameter.resourceId === "hcqvzk") {

        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin/invocations',
            requestParameters: {},
            requestTemplates: {},
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'hcqvzk',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "2tpmiq") {

        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:twobytwo-lambda-ClearDown-WLZQGTYEYM11/invocations',
            requestParameters: {},
            requestTemplates: {},
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: '2tpmiq',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters: {},
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "2tpmiq") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "3mycjy") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "3mycjy") {

        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:twobytwo-es-ElasticSearchHandler-1HPUX0A79OYL1/invocations',
            requestParameters: {},
            requestTemplates: {},
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: '3mycjy',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "ef8ktt") {
        throwNotFoundException();;
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "ef8ktt") {

        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:twobytwo-lambda-UserManagement-1NB0K2YVZ8D4R/invocations',
            requestParameters: {},
            requestTemplates:
            {
                'application/json':
                    '{\n   "command" : "$input.params(\'command\')",\n   "data":{\n        "alias": "$input.params(\'alias\')"\n     }\n}'
            },
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'ef8ktt',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "miu4mh1v7h") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "miu4mh1v7h") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "q0i5o9") {
        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:twobytwo-lambda-SentimentAnalysis-1M1MZWLJAZVYB/invocations',
            requestParameters: {},
            requestTemplates: {},
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'q0i5o9',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        };

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "q0i5o9") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "si8sip") {

        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:twobytwo-lambda-InsightManagement-1D4KQVNV83YV2/invocations',
            requestParameters: {},
            requestTemplates: {},
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'si8sip',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "si8sip") {
        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:twobytwo-lambda-InsightManagement-1D4KQVNV83YV2/invocations',
            requestParameters: {},
            requestTemplates:
            {
                'application/json':
                    '{\n   "command" : "$input.params(\'command\')",\n   "data":{\n        "createdDate": "$input.params(\'createdDate\')",\n        "category": "$input.params(\'category\')",\n        "alias": "$input.params(\'alias\')",\n        "id": "$input.params(\'id\')",\n        "insightId": "$input.params(\'insightId\')"\n     }\n}'
            },
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'si8sip',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }
        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "ta7x01") {
        throwNotFoundException();
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "an79vvn7bi" && parameter.resourceId === "ta7x01") {
        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:twobytwo-lambda-InsightManagement-1D4KQVNV83YV2/invocations',
            requestParameters: {},
            requestTemplates:
            {
                'application/json':
                    '{\n   "command" : "$input.params(\'command\')",\n   "data":{\n        "alias": "$input.params(\'alias\')"\n     }\n}'
            },
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'ta7x01',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "oz1pcwzut3" && parameter.resourceId === "8fqn1o") {

        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:elastic/invocations',
            requestParameters: {},
            requestTemplates: {},
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: '8fqn1o',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "oz1pcwzut3" && parameter.resourceId === "8fqn1o") {
        zoomTestUtils.createResponse(undefined, throwNotFoundException);
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "oz1pcwzut3" && parameter.resourceId === "flhykr") {
        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin/invocations',
            requestParameters: {},
            requestTemplates: {},
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'flhykr',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }
        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "oz1pcwzut3" && parameter.resourceId === "flhykr") {
        const response = {
            type: 'AWS',
            httpMethod: 'POST',
            uri:
                'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin/invocations',
            requestParameters: {},
            requestTemplates:
            {
                'application/json':
                    '{\n   "command" : "$input.params(\'command\')",\n   "data":{\n        "id": "$input.params(\'id\')",\n        "resourceType": "$input.params(\'resourceType\')"\n     }\n}'
            },
            passthroughBehavior: 'WHEN_NO_MATCH',
            timeoutInMillis: 29000,
            cacheNamespace: 'flhykr',
            cacheKeyParameters: [],
            integrationResponses:
            {
                '200':
                {
                    statusCode: '200',
                    responseParameters:
                    {
                        'method.response.header.Access-Control-Allow-Headers':
                            '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'',
                        'method.response.header.Access-Control-Allow-Methods': '\'GET,POST,PUT,DELETE,OPTIONS\'',
                        'method.response.header.Access-Control-Allow-Origin': '\'*\''
                    },
                    responseTemplates: {}
                }
            }
        }

        return zoomTestUtils.createResponse(response);
    }
    else if (parameter.httpMethod === "POST" && parameter.restApiId === "oz1pcwzut3" && parameter.resourceId === "jgmvfhm10a") {
        zoomTestUtils.createResponse(undefined, throwNotFoundException);
    }
    else if (parameter.httpMethod === "GET" && parameter.restApiId === "oz1pcwzut3" && parameter.resourceId === "jgmvfhm10a") {
        throwNotFoundException();
    }
}

const getResources = (parameter) => {

    const option1 = JSON.parse(`{
                                    "items": [
                                        {
                                            "id": "0wp5kb",
                                            "parentId": "cfh8yurk85",
                                            "pathPart": "search",
                                            "path": "/search",
                                            "resourceMethods": {
                                                "OPTIONS": {},
                                                "POST": {}
                                            }
                                        },
                                        {
                                            "id": "cfh8yurk85",
                                            "path": "/"
                                        },
                                        {
                                            "id": "hcqvzk",
                                            "parentId": "cfh8yurk85",
                                            "pathPart": "resources",
                                            "path": "/resources",
                                            "resourceMethods": {
                                                "GET": {},
                                                "OPTIONS": {},
                                                "POST": {}
                                            }
                                        }
                                    ]
                                }`);

    const option2 = JSON.parse(`{
                                    "items": [
                                        {
                                            "id": "2tpmiq",
                                            "parentId": "miu4mh1v7h",
                                            "pathPart": "clear",
                                            "path": "/clear",
                                            "resourceMethods": {
                                                "GET": {}
                                            }
                                        },
                                        {
                                            "id": "3mycjy",
                                            "parentId": "miu4mh1v7h",
                                            "pathPart": "search",
                                            "path": "/search",
                                            "resourceMethods": {
                                                "OPTIONS": {},
                                                "POST": {}
                                            }
                                        },
                                        {
                                            "id": "ef8ktt",
                                            "parentId": "miu4mh1v7h",
                                            "pathPart": "user",
                                            "path": "/user",
                                            "resourceMethods": {
                                                "GET": {},
                                                "OPTIONS": {}
                                            }
                                        },
                                        {
                                            "id": "miu4mh1v7h",
                                            "path": "/"
                                        },
                                        {
                                            "id": "q0i5o9",
                                            "parentId": "miu4mh1v7h",
                                            "pathPart": "sentiment",
                                            "path": "/sentiment",
                                            "resourceMethods": {
                                                "OPTIONS": {},
                                                "POST": {}
                                            }
                                        },
                                        {
                                            "id": "si8sip",
                                            "parentId": "miu4mh1v7h",
                                            "pathPart": "insights",
                                            "path": "/insights",
                                            "resourceMethods": {
                                                "DELETE": {},
                                                "GET": {},
                                                "OPTIONS": {},
                                                "POST": {}
                                            }
                                        },
                                        {
                                            "id": "ta7x01",
                                            "parentId": "miu4mh1v7h",
                                            "pathPart": "getteam",
                                            "path": "/getteam",
                                            "resourceMethods": {
                                                "GET": {},
                                                "OPTIONS": {}
                                            }
                                        }
                                    ]
                                }`);

    const option3 = JSON.parse(`{
                                    "items": [
                                        {
                                            "id": "8fqn1o",
                                            "parentId": "jgmvfhm10a",
                                            "pathPart": "search",
                                            "path": "/search",
                                            "resourceMethods": {
                                                "OPTIONS": {},
                                                "POST": {}
                                            }
                                        },
                                        {
                                            "id": "flhykr",
                                            "parentId": "jgmvfhm10a",
                                            "pathPart": "resources",
                                            "path": "/resources",
                                            "resourceMethods": {
                                                "GET": {},
                                                "OPTIONS": {},
                                                "POST": {}
                                            }
                                        },
                                        {
                                            "id": "jgmvfhm10a",
                                            "path": "/"
                                        }
                                    ]
                                }`);

    let response;

    switch (parameter.restApiId) {
        case "an79vvn7bi":
            response = option1;
            break;
        case "oz1pcwzut3":
            response = option2;
            break;
        case "57qj6lrxxa":
            response = option3;
        default:
            console.log("Unknown parameter ", parameter.restApiId);
    }

    return zoomTestUtils.createResponse(response);
}

const getRestApis = (parameters) => {
    const response = {
        items:
            [{
                id: '57qj6lrxxa',
                name: 'serverZoomAPI',
                description: 'The server zoomAPI',
                createdDate: "2019-07-25T12:22:27.000Z",
                apiKeySource: 'HEADER',
                endpointConfiguration: {
                    types: [
                        "EDGE"
                    ]
                }
            },
            {
                id: 'an79vvn7bi',
                name: 'App API',
                description: 'The api to support the lambdas.',
                createdDate: "2019-05-10T13:14:47.000Z",
                apiKeySource: 'HEADER',
                endpointConfiguration: {
                    types: [
                        "EDGE"
                    ]
                }
            },
            {
                id: 'oz1pcwzut3',
                name: 'clientZoomAPI',
                description: 'The client zoomAPI',
                createdDate: "2019-07-25T12:22:27.000Z",
                apiKeySource: 'HEADER',
                endpointConfiguration: {
                    types: [
                        "EDGE"
                    ]
                }
            }]
    }

    return zoomTestUtils.createResponse(response);
}

const throwNotFoundException = () => {
    throw {
        name: "NotFoundException",
        message: 'Invalid Method identifier specified',
        code: 'NotFoundException',
        requestId: '9707f2b7-ab61-457b-95a3-6fb6b0ef2339',
        statusCode: 404,
        retryable: false,
        retryDelay: 52.2531279921818
    };
}

module.exports = {
    getRestApis: getRestApis,
    getResources: getResources,
    getIntegration: getIntegration
}
