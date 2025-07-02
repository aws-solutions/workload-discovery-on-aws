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
    .reply(200, {
        data: {
            getAccounts: [
                {
                    accountId: ACCOUNT_X,
                    name: 'Account X',
                    regions: [{name: EU_WEST_1}, {name: US_EAST_1}],
                },
                {
                    accountId: ACCOUNT_Y,
                    name: 'Account Y',
                    regions: [{name: EU_WEST_1}],
                },
            ],
        },
    })
    .persist();

export default agent;
