const {MockAgent} = require('undici');
const {
    CONNECTION_CLOSED_PREMATURELY, AWS_LAMBDA_FUNCTION, CONTAINS, AWS_EC2_VPC, AWS_EC2_SUBNET
} = require("../../../src/lib/constants");
const {generateBaseResource} = require("../../generator");

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://www.workload-discovery');

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {data: {
            getRelationships: [
                {
                    id: 'testId',
                    label: CONTAINS,
                    source: {
                        id: 'sourceArn',
                        label: AWS_EC2_VPC
                    },
                    target: {
                        id: 'targetArn',
                        label: AWS_EC2_SUBNET
                    },
                }
            ]
        }});

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {data: {
            getRelationships: []
        }});

module.exports = agent;