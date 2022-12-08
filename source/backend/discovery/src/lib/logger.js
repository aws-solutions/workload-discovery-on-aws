// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require('ramda');
const {transports, createLogger, format} = require('winston');

const level = R.defaultTo('info', process.env.LOG_LEVEL).toLowerCase();

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({level})
    ]
});

module.exports = logger;