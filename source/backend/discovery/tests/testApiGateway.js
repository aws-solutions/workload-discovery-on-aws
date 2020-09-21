const chai = require('chai');
const APIGatewayMock = require('./mockAwsAPIGateway');
const APIGateway = require("../src/discovery/api-gateway");
const DataClientMock = require('./mockDataClient');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should successfully call processRestApis and process the restAPIs by calling out the the AWS API and package the results in the right format', async () => {

    const apiGateway = new APIGateway(() => { return APIGatewayMock }, undefined);
    const processedAPIs = await apiGateway.processRestApis("XXXXXXXXXXXX", "eu-west-1");

    const expectedResult = [{
        resourceId: '57qj6lrxxa',
        resourceType: 'AWS::ApiGateway::RestApi',
        accountId: 'XXXXXXXXXXXX',
        properties:
        {
            resourceId: '57qj6lrxxa',
            resourceType: 'AWS::ApiGateway::RestApi',
            accountId: 'XXXXXXXXXXXX',
            name: 'serverZoomAPI',
            createdDate: '2019-07-25T12:22:27.000Z',
            apiKeySource: 'HEADER',
            policy: undefined,
            endpointConfiguration: { types: ['EDGE'] },
            arn: undefined,
            restApiId: '57qj6lrxxa',
            awsRegion: 'eu-west-1',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/57qj6lrxxa/resources',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/57qj6lrxxa/resources',
            title: '57qj6lrxxa'
        }
    },
    {
        resourceId: 'an79vvn7bi',
        resourceType: 'AWS::ApiGateway::RestApi',
        accountId: 'XXXXXXXXXXXX',
        properties:
        {
            resourceId: 'an79vvn7bi',
            resourceType: 'AWS::ApiGateway::RestApi',
            accountId: 'XXXXXXXXXXXX',
            name: 'App API',
            createdDate: '2019-05-10T13:14:47.000Z',
            apiKeySource: 'HEADER',
            policy: undefined,
            endpointConfiguration: { types: ['EDGE'] },
            arn: undefined,
            restApiId: 'an79vvn7bi',
            awsRegion: 'eu-west-1',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/an79vvn7bi/resources',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/an79vvn7bi/resources',
            title: 'an79vvn7bi'
        }
    },
    {
        resourceId: 'oz1pcwzut3',
        resourceType: 'AWS::ApiGateway::RestApi',
        accountId: 'XXXXXXXXXXXX',
        properties:
        {
            resourceId: 'oz1pcwzut3',
            resourceType: 'AWS::ApiGateway::RestApi',
            accountId: 'XXXXXXXXXXXX',
            name: 'clientZoomAPI',
            createdDate: '2019-07-25T12:22:27.000Z',
            apiKeySource: 'HEADER',
            policy: undefined,
            endpointConfiguration: { types: ['EDGE'] },
            arn: undefined,
            restApiId: 'oz1pcwzut3',
            awsRegion: 'eu-west-1',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources',
            title: 'oz1pcwzut3'
        }
    }];

    expect(processedAPIs).to.deep.equal(expectedResult);
});

it('Should successfully call processResources passing in the restAPIid and package the results in the right format', async () => {

    const apiGateway = new APIGateway(() => { return APIGatewayMock }, undefined);
    const processedAPIs = await apiGateway.processResources("XXXXXXXXXXXX", "eu-west-1", "oz1pcwzut3");

    let expectedResult = [{
        resourceId: '2tpmiq',
        resourceType: 'AWS::ApiGateway::Resource',
        accountId: 'XXXXXXXXXXXX',
        children: [],
        properties:
        {
            resourceId: '2tpmiq',
            resourceType: 'AWS::ApiGateway::Resource',
            accountId: 'XXXXXXXXXXXX',
            parentId: 'miu4mh1v7h',
            pathPart: 'clear',
            path: '/clear',
            resourceMethods: { GET: {} },
            awsRegion: 'eu-west-1',
            restApiId: 'oz1pcwzut3',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/2tpmiq',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/2tpmiq',
            title: '2tpmiq'
        }
    },
    {
        resourceId: '3mycjy',
        resourceType: 'AWS::ApiGateway::Resource',
        accountId: 'XXXXXXXXXXXX',
        children: [],
        properties:
        {
            resourceId: '3mycjy',
            resourceType: 'AWS::ApiGateway::Resource',
            accountId: 'XXXXXXXXXXXX',
            parentId: 'miu4mh1v7h',
            pathPart: 'search',
            path: '/search',
            resourceMethods: { OPTIONS: {}, POST: {} },
            awsRegion: 'eu-west-1',
            restApiId: 'oz1pcwzut3',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/3mycjy',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/3mycjy',
            title: '3mycjy'
        }
    },
    {
        resourceId: 'ef8ktt',
        resourceType: 'AWS::ApiGateway::Resource',
        accountId: 'XXXXXXXXXXXX',
        children: [],
        properties:
        {
            resourceId: 'ef8ktt',
            resourceType: 'AWS::ApiGateway::Resource',
            accountId: 'XXXXXXXXXXXX',
            parentId: 'miu4mh1v7h',
            pathPart: 'user',
            path: '/user',
            resourceMethods: { GET: {}, OPTIONS: {} },
            awsRegion: 'eu-west-1',
            restApiId: 'oz1pcwzut3',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/ef8ktt',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/ef8ktt',
            title: 'ef8ktt'
        }
    },
    {
        resourceId: 'miu4mh1v7h',
        resourceType: 'AWS::ApiGateway::Resource',
        accountId: 'XXXXXXXXXXXX',
        children: [],
        properties:
        {
            resourceId: 'miu4mh1v7h',
            resourceType: 'AWS::ApiGateway::Resource',
            accountId: 'XXXXXXXXXXXX',
            parentId: undefined,
            pathPart: undefined,
            path: '/',
            resourceMethods: undefined,
            awsRegion: 'eu-west-1',
            restApiId: 'oz1pcwzut3',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/miu4mh1v7h',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/miu4mh1v7h',
            title: 'miu4mh1v7h'
        }
    },
    {
        resourceId: 'q0i5o9',
        resourceType: 'AWS::ApiGateway::Resource',
        accountId: 'XXXXXXXXXXXX',
        children: [],
        properties:
        {
            resourceId: 'q0i5o9',
            resourceType: 'AWS::ApiGateway::Resource',
            accountId: 'XXXXXXXXXXXX',
            parentId: 'miu4mh1v7h',
            pathPart: 'sentiment',
            path: '/sentiment',
            resourceMethods: { OPTIONS: {}, POST: {} },
            awsRegion: 'eu-west-1',
            restApiId: 'oz1pcwzut3',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/q0i5o9',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/q0i5o9',
            title: 'q0i5o9'
        }
    },
    {
        resourceId: 'si8sip',
        resourceType: 'AWS::ApiGateway::Resource',
        accountId: 'XXXXXXXXXXXX',
        children: [],
        properties:
        {
            resourceId: 'si8sip',
            resourceType: 'AWS::ApiGateway::Resource',
            accountId: 'XXXXXXXXXXXX',
            parentId: 'miu4mh1v7h',
            pathPart: 'insights',
            path: '/insights',
            resourceMethods: { DELETE: {}, GET: {}, OPTIONS: {}, POST: {} },
            awsRegion: 'eu-west-1',
            restApiId: 'oz1pcwzut3',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/si8sip',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/si8sip',
            title: 'si8sip'
        }
    },
    {
        resourceId: 'ta7x01',
        resourceType: 'AWS::ApiGateway::Resource',
        accountId: 'XXXXXXXXXXXX',
        children: [],
        properties:
        {
            resourceId: 'ta7x01',
            resourceType: 'AWS::ApiGateway::Resource',
            accountId: 'XXXXXXXXXXXX',
            parentId: 'miu4mh1v7h',
            pathPart: 'getteam',
            path: '/getteam',
            resourceMethods: { GET: {}, OPTIONS: {} },
            awsRegion: 'eu-west-1',
            restApiId: 'oz1pcwzut3',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/ta7x01',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/ta7x01',
            title: 'ta7x01'
        }
    }];

    expect(processedAPIs).to.deep.equal(expectedResult);
});

it('Should successfully call processIntegrations and package the results in the right format', async () => {

    const apiGateway = new APIGateway(() => { return APIGatewayMock }, DataClientMock);
    let integrations = await apiGateway.processIntegrations("XXXXXXXXXXXX", "eu-west-1", "oz1pcwzut3", "flhykr");

    let expectedResult = [{
        resourceId: 'oz1pcwzut3_flhykr_POST',
        resourceType: 'AWS::ApiGateway::Method',
        accountId: 'XXXXXXXXXXXX',
        properties:
        {
            resourceId: 'oz1pcwzut3_flhykr_POST',
            resourceType: 'AWS::ApiGateway::Method',
            accountId: 'XXXXXXXXXXXX',
            type: 'AWS',
            httpMethod: 'POST',
            uri: 'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin/invocations',
            passthroughBehavior: 'WHEN_NO_MATCH',
            contentHandling: undefined,
            timeoutInMillis: 29000,
            cacheNamespace: 'flhykr',
            integrationResponses: '{"200":{"statusCode":"200","responseParameters":{"method.response.header.Access-Control-Allow-Headers":"\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'","method.response.header.Access-Control-Allow-Methods":"\'GET,POST,PUT,DELETE,OPTIONS\'","method.response.header.Access-Control-Allow-Origin":"\'*\'"},"responseTemplates":{}}}',
            awsRegion: 'eu-west-1',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/flhykr/methods/POST',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/flhykr/methods/POST',
            title: 'oz1pcwzut3_flhykr_POST'
        },
        children:
            [{
                link: '7e9b39f3f61b2b71fdf8ed8adff71deb',
                resourceType: 'AWS::Lambda::Function'
            }]
    },
    {
        resourceId: 'oz1pcwzut3_flhykr_GET',
        resourceType: 'AWS::ApiGateway::Method',
        accountId: 'XXXXXXXXXXXX',
        properties:
        {
            resourceId: 'oz1pcwzut3_flhykr_GET',
            resourceType: 'AWS::ApiGateway::Method',
            accountId: 'XXXXXXXXXXXX',
            type: 'AWS',
            httpMethod: 'POST',
            uri: 'arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin/invocations',
            passthroughBehavior: 'WHEN_NO_MATCH',
            contentHandling: undefined,
            timeoutInMillis: 29000,
            cacheNamespace: 'flhykr',
            integrationResponses: '{"200":{"statusCode":"200","responseParameters":{"method.response.header.Access-Control-Allow-Headers":"\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\'","method.response.header.Access-Control-Allow-Methods":"\'GET,POST,PUT,DELETE,OPTIONS\'","method.response.header.Access-Control-Allow-Origin":"\'*\'"},"responseTemplates":{}}}',
            awsRegion: 'eu-west-1',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/oz1pcwzut3/resources/flhykr/methods/GET',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/oz1pcwzut3/resources/flhykr/methods/GET',
            title: 'oz1pcwzut3_flhykr_GET'
        },
        children:
            [{
                link: '7e9b39f3f61b2b71fdf8ed8adff71deb',
                resourceType: 'AWS::Lambda::Function'
            }]
    }];

    expect(integrations).to.deep.equal(expectedResult);

});
