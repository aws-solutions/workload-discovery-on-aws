// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Amplify} from 'aws-amplify';
import {vi} from 'vitest';
import {
    uploadData as mockUploadData,
    getUrl as mockGetUrl,
    list as mockList,
    remove as mockRemove,
} from '../../mocks/aws-amplify-storage';

vi.mock('@aws-amplify/ui-react', () => {
    const mockSignOut = vi.fn();
    const stableAuthState = {
        user: {username: 'testUser'},
        signOut: mockSignOut,
    };
    return {
        Authenticator: ({children}) => children,
        ThemeProvider: ({children}) => children,
        useAuthenticator: () => stableAuthState,
    };
});

vi.mock('aws-amplify/auth', () => ({
    fetchAuthSession: vi.fn().mockResolvedValue({
        tokens: {
            idToken: {toString: () => 'idJwtToken'},
            accessToken: {toString: () => 'accessJwtToken'},
        },
    }),
    getCurrentUser: vi.fn().mockResolvedValue({
        username: 'testUser',
        userId: 'testUserId',
    }),
    signOut: vi.fn().mockResolvedValue(undefined),
    signInWithRedirect: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('aws-amplify/storage', () => ({
    uploadData: vi.fn().mockImplementation(mockUploadData),
    getUrl: vi.fn().mockImplementation(mockGetUrl),
    list: vi.fn().mockImplementation(mockList),
    remove: vi.fn().mockImplementation(mockRemove),
}));

const GRAPHQL_ENDPOINT = 'https://testgql.appsync-api.amazonaws.com/graphql';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolClientId: 'testClientId',
            userPoolId: 'eu-central-1_test',
            identityPoolId: 'eu-central-1:test',
        }
    },
    API: {
        GraphQL: {
            endpoint: GRAPHQL_ENDPOINT,
            defaultAuthMode: 'apiKey',
            apiKey: 'da2-xxxxxxxxxxxxxxxxxxxxxxxxxx',
        }
    },
    Storage: {
        S3: {
            bucket: 'workload-discovery-on-aws-s3-amplifystoragebucket-qclmeyrz1x9k',
            region: 'eu-central-1',
        }
    }
});
