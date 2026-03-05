// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Amplify} from 'aws-amplify';
import {beforeEach} from 'vitest';

const GRAPHQL_ENDPOINT = 'https://testgql.appsync-api.amazonaws.com/graphql';

// Reset browser URL to root between tests so BrowserRouter starts clean.
// Auth tokens in localStorage are intentionally preserved so that the real
// Authenticator sign-in flow (via MSW Cognito handlers) only runs once.
beforeEach(() => {
    if (typeof window !== 'undefined' && window.history) {
        window.history.replaceState(null, '', '/');
    }
});

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
