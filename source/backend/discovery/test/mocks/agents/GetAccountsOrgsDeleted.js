const {MockAgent} = require('undici');
const {
    CONNECTION_CLOSED_PREMATURELY, AWS_LAMBDA_FUNCTION, CONTAINS, AWS_EC2_VPC, AWS_EC2_SUBNET
} = require("../../../src/lib/constants");
const {generateBaseResource} = require("../../generator");

const agent = new MockAgent();
agent.disableNetConnect();

const ACCOUNT_X = 'xxxxxxxxxxxx';
const ACCOUNT_Y = 'yyyyyyyyyyyy';
const ACCOUNT_Z = 'zzzzzzzzzzzz';
const EU_WEST_1= 'eu-west-1';
const US_EAST_1= 'us-east-1';

const client = agent.get('https://www.workload-discovery');

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {data: {
            getAccounts: [
                {accountId: ACCOUNT_X, name: 'Account X', organizationId: "o-exampleorgid", regions: [{name: EU_WEST_1}, {name: US_EAST_1}]},
                {accountId: ACCOUNT_Y, name: 'Account Y', organizationId: "o-exampleorgid", regions: [{name: EU_WEST_1}]},
                {accountId: ACCOUNT_Z, name: 'Account Z', organizationId: "o-exampleorgid", regions: [{name: EU_WEST_1}, {name: US_EAST_1}]}
            ]
        }});

module.exports = agent;
