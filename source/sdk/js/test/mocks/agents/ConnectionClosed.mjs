// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {MockAgent} from 'undici';
import {
    CONNECTION_CLOSED_PREMATURELY
} from '../../../src/constants.mjs'

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://workload-discovery.appsync-api.eu-west-1.amazonaws.com');

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
            getResources: []
        }
    });

export default agent;
