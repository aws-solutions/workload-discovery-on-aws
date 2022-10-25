const {MockAgent} = require('undici');

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://www.workload-discovery');

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {
        errors: [
            {message: 'Validation error'}
        ]
    }).persist();

module.exports = agent;