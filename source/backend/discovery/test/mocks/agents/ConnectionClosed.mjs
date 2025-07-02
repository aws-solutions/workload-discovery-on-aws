import {MockAgent} from 'undici';
import {CONNECTION_CLOSED_PREMATURELY} from '../../../src/lib/constants.mjs';

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://www.workload-discovery');

client
    .intercept({
        path: '/graphql',
        method: 'POST',
    })
    .reply(200, {
        errors: [{message: CONNECTION_CLOSED_PREMATURELY}],
    });

client
    .intercept({
        path: '/graphql',
        method: 'POST',
    })
    .reply(200, {
        data: {
            addRelationships: [],
        },
    });

export default agent;
