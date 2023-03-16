// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {MockAgent} from 'undici';

const agent = new MockAgent();
agent.disableNetConnect();

const client = agent.get('https://workload-discovery.appsync-api.eu-west-1.amazonaws.com');

client.intercept({
    path: '/graphql',
    method: 'POST'
})
    .reply(200, {
        errors: [
            {message: 'Validation error'}
        ]
    }).persist();

export default agent;
