import {MockAgent} from 'undici';

const agent = new MockAgent();
agent.disableNetConnect();

const ACCOUNT_X = 'xxxxxxxxxxxx';
const ACCOUNT_Y = 'yyyyyyyyyyyy';
const EU_WEST_1 = 'eu-west-1';
const US_EAST_1 = 'us-east-1';

const client = agent.get('https://www.workload-discovery');

client
    .intercept({
        path: '/graphql',
        method: 'POST',
    })
    .reply(200, (opts) => {
        const body = JSON.parse(opts.body);
        const operation = body.query || '';
        const variables = body.variables || {};

        // Check if this is an updateRegions operation
        if (operation.includes('updateRegions')) {
            return {
                data: {
                    updateRegions: {
                        ...variables
                    },
                },
            };
        }
        else if (operation.includes('updateAccount')){
            const accountId = variables.accountId;

            if (accountId === ACCOUNT_X || accountId === ACCOUNT_Y) {
                return {
                    data: {
                        updateAccount: {
                            ...variables
                        },
                    },
                };
            } else {
                // Default response if no conditions match
                return {
                    data: {}
                };
            }
        }
    }).persist();

export default agent;