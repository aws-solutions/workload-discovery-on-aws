import {MockAgent} from 'undici';
import {
    AWS_LAMBDA_FUNCTION
} from '../../../src/lib/constants.mjs';
import {generateBaseResource} from '../../generator.mjs';

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://www.workload-discovery');

const properties = generateBaseResource('xxxxxxxxxxxx', 'eu-west-1', AWS_LAMBDA_FUNCTION,  1);

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

export default agent;