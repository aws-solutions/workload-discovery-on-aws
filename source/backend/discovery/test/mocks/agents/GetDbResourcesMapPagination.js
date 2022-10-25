const {MockAgent} = require('undici');
const {
    CONNECTION_CLOSED_PREMATURELY, AWS_LAMBDA_FUNCTION
} = require("../../../src/lib/constants");
const {generateBaseResource} = require("../../generator");

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://www.workload-discovery');

const properties = generateBaseResource(AWS_LAMBDA_FUNCTION, 1);

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {data: {
            getResources: [
                {id: properties.arn, label: 'label', md5Hash: '', properties}
            ]
        }});

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {data: {
            getResources: []
        }});

module.exports = agent;