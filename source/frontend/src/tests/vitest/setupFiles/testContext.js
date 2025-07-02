// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {it as itBase} from '@vitest/runner';
import {worker} from '../../mocks/browser';

export const it = itBase.extend({
    worker: [
        async ({}, use) => {
            worker.resetHandlers();
            // Start the worker before the test.
            await worker.start();

            // Expose the worker object on the test's context.
            await use(worker);

            // Stop the worker after the test is done.
            worker.stop();
        },
        {
            auto: true,
        },
    ],
});
