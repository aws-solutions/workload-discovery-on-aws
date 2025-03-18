import {MockAgent} from 'undici';
import {AWS_LAMBDA_FUNCTION} from '../../../src/lib/constants.mjs';
import {generateBaseResource} from '../../generator.mjs';

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://www.workload-discovery');

// Generate resources for two different accounts
const propertiesAccount1 = generateBaseResource(
    'xxxxxxxxxxxx',
    'eu-west-1',
    AWS_LAMBDA_FUNCTION,
    1
);

const propertiesAccount2 = generateBaseResource(
    'yyyyyyyyyyyy',
    'us-west-1',
    AWS_LAMBDA_FUNCTION,
    2
);

// Intercept for GraphQL requests and respond conditionally based on accountId
client
    .intercept({
        path: '/graphql',
        method: 'POST',
    })
    .reply(200, (opts) => {
        const body = JSON.parse(opts.body);
        const accounts = body.variables?.accounts || [];

        if (accounts.length > 0) {
            const accountId = accounts[0]?.accountId;

            if (accountId === 'xxxxxxxxxxxx') {
                return {
                    data: {
                        getResources: [
                            {id: propertiesAccount1.arn, label: 'label', md5Hash: '', properties: propertiesAccount1},
                        ],
                    },
                };
            } else if (accountId === 'yyyyyyyyyyyy') {
                return {
                    data: {
                        getResources: [
                            {id: propertiesAccount2.arn, label: 'label', md5Hash: '', properties: propertiesAccount2},
                        ],
                    },
                };
            }
        }

        return {
            data: {
                getResources: [],
            },
        };
    })
    .times(2);

client
    .intercept({
        path: '/graphql',
        method: 'POST',
    })
    .reply(200, {
        data: {
            getResources: [],
        },
    })
    .times(2);

export default agent;
