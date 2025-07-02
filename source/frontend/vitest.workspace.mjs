// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {defineWorkspace} from 'vitest/config';
import {compareScreenshot} from './src/tests/vitest/commands/screenshot.js';

export default defineWorkspace([
    {
        extends: './vite.config.mjs',
        test: {
            include: ['src/tests/vitest/**/*.{test,spec}.js'],
            environment: 'jsdom',
            setupFiles: [
                './src/tests/vitest/setupFiles/amplify.js',
                './src/tests/vitest/setupFiles/cleanup.js',
                './src/tests/vitest/setupFiles/globals.js',
                './src/tests/vitest/setupFiles/server.js',
                './src/tests/vitest/setupFiles/jest-dom.js',
            ],
        },
    },
    {
        extends: './vite.config.mjs',
        test: {
            include: ['src/tests/browser/**/*.{test,spec}.js'],
            setupFiles: [
                './src/tests/vitest/setupFiles/amplify.js',
                './src/tests/vitest/setupFiles/matchers.js',
            ],
            name: 'browser',
            browser: {
                viewport: {
                    height: 1500,
                    width: 3000,
                },
                commands: {
                    compareScreenshot,
                },
                provider: 'playwright',
                enabled: true,
                headless: true,
                instances: [{browser: 'chromium'}],
            },
        },
    },
]);
