// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {expect} from 'vitest';
import {commands} from '@vitest/browser/context';

expect.extend({
    async toMatchImageSnapshot(received, options = {}) {
        // Get the current test name from Vitest's context
        const testPath = this.testPath.split('/');
        const testName = testPath.at(-1);

        // Handle different types of received values
        let screenshotPath;
        if (typeof received === 'string') {
            screenshotPath = received;
        } else if (received && typeof received === 'object' && received.path) {
            // Handle screenshot result object
            screenshotPath = received.path;
        } else {
            throw new Error(
                'Expected a screenshot path string or screenshot result object'
            );
        }

        const result = await commands.compareScreenshot(screenshotPath, {
            testName,
            ...options,
        });

        return {
            pass: result.matches,
            message: () => result.message,
        };
    },
});
