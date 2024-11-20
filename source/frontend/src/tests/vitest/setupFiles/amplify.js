// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Amplify, Auth, Storage} from 'aws-amplify';
import mockStorageProvider from '../../mocks/MockStorageProvider';

Storage.addPluggable(mockStorageProvider);

Amplify.configure({
    API: {
        aws_appsync_graphqlEndpoint:
            'https://testgql.appsync-api.amazonaws.com/graphql',
        aws_appsync_authenticationType: 'API_KEY',
        aws_appsync_apiKey: 'da2-xxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    Storage: {
        [mockStorageProvider.getProviderName()]: {
            bucket: 'workload-discovery-on-aws-s3-amplifystoragebucket-qclmeyrz1x9k',
            region: 'eu-central-1',
        },
    },
});

Storage.configure({
    [mockStorageProvider.getProviderName()]: {},
});

Auth.currentSession = async () => {
    return {
        idToken: {
            jwtToken: 'idJwtToken',
            payload: {},
        },
        refreshToken: {
            token: 'refreshJwtToken',
        },
        accessToken: {
            jwtToken: 'accessJwtToken',
            payload: {},
        },
        clockDrift: 0,
    };
};

Auth.currentAuthenticatedUser = async () => {
    return {
        username: 'testUser',
    };
};
