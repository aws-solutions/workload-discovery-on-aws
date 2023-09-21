// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {setupWorker, graphql} from 'msw';
import handlers from "./handlers";

export const worker = setupWorker(...handlers);

window.msw = { worker, graphql };