import {MockAgent} from 'undici';
import {
    CONTAINS,
    AWS_EC2_VPC,
    AWS_EC2_SUBNET,
} from '../../../src/lib/constants.mjs';

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://www.workload-discovery');

client
    .intercept({
        path: '/graphql',
        method: 'POST',
    })
    .reply(200, {
        data: {
            getRelationships: [
                {
                    id: 'testId',
                    label: CONTAINS,
                    source: {
                        id: 'sourceArn',
                        label: AWS_EC2_VPC,
                    },
                    target: {
                        id: 'targetArn',
                        label: AWS_EC2_SUBNET,
                    },
                },
            ],
        },
    });

client
    .intercept({
        path: '/graphql',
        method: 'POST',
    })
    .reply(200, {
        data: {
            getRelationships: [],
        },
    });

export default agent;
