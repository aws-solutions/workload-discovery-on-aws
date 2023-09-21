// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const logger = require('./lib/logger');
const config = require('./lib/config');
const {DISCOVERY_PROCESS_RUNNING} = require('./lib/constants')
const awsClient = require('./lib/awsClient');
const appSync = require('./lib/apiClient/appSync');
const {discoverResources} = require('./lib');

const discover = async () => {
  logger.profile('Discovery of resources complete.');

  await discoverResources(appSync, awsClient, config)
      .catch(err => {
          if([DISCOVERY_PROCESS_RUNNING].includes(err.message)) {
              logger.info(err.message);
          } else {
              throw err;
          }
      });

  logger.profile('Discovery of resources complete.');
};

discover().catch(err => {
  logger.error('Error in Discovery process.');
  logger.error(err.message);
  logger.debug(err);
  process.exit(1);
});
