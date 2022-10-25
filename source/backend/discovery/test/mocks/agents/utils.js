const {MockAgent} = require("undici");

module.exports = {
    createSuccessThenError: (successResult, errorMsg) => {
        const agent = new MockAgent();
        agent.disableNetConnect();

        const client = agent.get('https://www.workload-discovery');

        client.intercept({
            path: '/graphql',
            method: 'POST'
        })
            .reply(200, successResult);

        client.intercept({
            path: '/graphql',
            method: 'POST'
        })
            .reply(200, {
                errors: [
                    {message: errorMsg}
                ]
            });

        return agent;
    }
};