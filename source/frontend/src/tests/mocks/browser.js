// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {graphql} from 'msw';
import handlers from './handlers';
import {setupWorker} from 'msw/browser';

export const worker = setupWorker(...handlers);

window.msw = {worker, graphql};
