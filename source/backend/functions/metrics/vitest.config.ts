// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {defineConfig} from 'vite';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: [
                ['lcov', {projectRoot: '../../../..'}],
                ['html'],
                ['text'],
                ['json'],
            ],
        },
    },
});
