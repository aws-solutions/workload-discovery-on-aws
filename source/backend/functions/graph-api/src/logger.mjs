// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import pino from 'pino';
import {pinoLambdaDestination} from 'pino-lambda';

const level = ('info' ?? process.env.LOG_LEVEL).toLowerCase();

const destination = pinoLambdaDestination();
export const logger = pino({level}, destination);
