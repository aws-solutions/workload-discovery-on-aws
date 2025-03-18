// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {generateAwsApiEndpoints} from '../generator.mjs';
import {http, HttpResponse} from 'msw';

const awsApoEndpoints = generateAwsApiEndpoints('eu-west-1');

const handlers = awsApoEndpoints.map(endpoint =>
    http.get(endpoint.url + '*', () => {
        return HttpResponse.json({}, { status: 200 });
    })
);

export default handlers;
