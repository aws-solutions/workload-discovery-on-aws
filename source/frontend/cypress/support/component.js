// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { mount } from 'cypress/react'
import {Amplify, Auth, Storage} from "aws-amplify";
import '@testing-library/cypress/add-commands';
import '@cypress/code-coverage/support';
import {worker} from '../../src/tests/mocks/browser';
import "@frsource/cypress-plugin-visual-regression-diff";

import mockStorageProvider from "../../src/tests/mocks/MockStorageProvider";

Storage.addPluggable(mockStorageProvider);

Amplify.configure({
    API: {
        aws_appsync_graphqlEndpoint: 'https://testgql.appsync-api.amazonaws.com/graphql',
        aws_appsync_authenticationType: 'API_KEY',
        aws_appsync_apiKey: 'da2-xxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    Storage: {
        [mockStorageProvider.getProviderName()]: {
            bucket: 'workload-discovery-on-aws-s3-amplifystoragebucket-qclmeyrz1x9k',
            region: 'eu-central-1'
        }
    }
});

Storage.configure({
    [mockStorageProvider.getProviderName()]: {}
});

Cypress.on('test:before:run:async', async () => {
    await worker.start();
});

Cypress.on('uncaught:exception', err => !err.message.includes('ResizeObserver loop completed with undelivered notifications'));

Cypress.Commands.add('mount', (component, options) => {
    // Wrap any parent components needed
    // ie: return mount(<MyProvider>{component}</MyProvider>, options)
    return mount(component, options)
})

Auth.currentSession = async () => {
    return {
        idToken: {
            jwtToken: 'idJwtToken',
            payload: {}
        },
        refreshToken: {
            token: 'refreshJwtToken'
        },
        accessToken: {
            jwtToken: 'accessJwtToken',
            payload: {}
        },
        clockDrift: 0
    }
};

Auth.currentAuthenticatedUser = async () => {
    return {
        username: 'testUser'
    }
}
