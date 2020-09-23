const AWS = require('aws-sdk');
const R = require('ramda');
const logger = require('./logger');
const zoomUtils = require('./zoomUtils');

const ecs = new AWS.ECS();

const bootStrap = (getAccounts, configuration) => async () => {
  logger.info('Bootstrapping');
  const accounts = await getAccounts();
  const config = {...R.omit(['creds'], configuration), accounts};

  logger.info('Starting import using the following configuration:');
  logger.info(config);

  return config;
};

/**
 * In order to prevent two tasks running
 * @param {*} accountInfo 
 */
const canImportRun =  (ecs, cluster) => async () => {
  try {
    const tasks = await ecs.listTasks({cluster}).promise();
    logger.info('Running tasks');
    logger.info(tasks);

    return tasks.taskArns.length <= 1;
  }
  catch (Error){
    logger.error("CanImportRun Error:");
    zoomUtils.dumpError(Error);
    // Fail safe
    return true;
  }
};


module.exports = function(settingsApi, config) {
  const {getAccounts} = settingsApi;
  return {
    bootStrap: bootStrap(getAccounts, config),
    canImportRun: canImportRun(ecs, config.cluster)
  };
};

