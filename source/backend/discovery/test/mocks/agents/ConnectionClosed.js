const {MockAgent} = require('undici');
const {
    CONNECTION_CLOSED_PREMATURELY
} = require("../../../src/lib/constants");

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://www.workload-discovery');

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {
        errors: [
            {message: CONNECTION_CLOSED_PREMATURELY}
        ]
    });

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {
        data: {
            addRelationships: []
        }
    });

module.exports = agent;