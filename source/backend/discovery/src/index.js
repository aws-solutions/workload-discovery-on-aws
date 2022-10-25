#!/usr/bin/env node

const logger = require('./lib/logger');
const config = require('./lib/config');
const {NO_ACCOUNTS_TO_SCAN} = require('./lib/constants')
const awsClient = require('./lib/awsClient');
const appSync = require('./lib/apiClient/appSync');
const {discoverResources} = require('./lib');

const discover = async () => {
  logger.profile('Discovery of resources complete.');

  await discoverResources(appSync, awsClient, config)
      .catch(err => {
          if(err.message === NO_ACCOUNTS_TO_SCAN) {
              logger.info('No accounts have been added to discover');
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
