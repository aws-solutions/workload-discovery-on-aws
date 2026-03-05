// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {afterAll, afterEach, beforeAll} from 'vitest';
import {server} from '../../mocks/server';

let originalFetch;

beforeAll(() => {
    server.listen();

    // Wrap fetch to strip the AbortSignal from requests. Amplify v6 passes
    // an AbortSignal created by Node's AbortController, but jsdom's fetch
    // rejects it because the cross-realm instanceof check fails.
    originalFetch = globalThis.fetch;
    globalThis.fetch = (input, init) => {
        if (init?.signal) {
            const {signal, ...rest} = init;
            return originalFetch(input, rest);
        }
        return originalFetch(input, init);
    };
});

afterEach(() => server.resetHandlers());

afterAll(() => {
    server.close();
    globalThis.fetch = originalFetch;
});
