// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {http, HttpResponse} from 'msw';
import {METRICS_URL} from '../contants.mjs';

export const handlers = [
    http.post(METRICS_URL, async ({request}) => {
        const json = await request.clone().json();

        if (json.event_name === 'ApplicationCreatedFailure') {
            return HttpResponse.json(json, {status: 400});
        }

        return HttpResponse.json(json, {status: 200});
    }),
];
