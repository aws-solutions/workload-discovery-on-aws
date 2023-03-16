// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {transports, createLogger, format} from 'winston';

const level = (process.env.LOG_LEVEL ?? 'info').toLowerCase();

const logger  = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({level})
    ]
});

export default logger;
