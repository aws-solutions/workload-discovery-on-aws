const pino = require('pino');
const {pinoLambdaDestination} = require('pino-lambda');

const level = ('info' ?? process.env.LOG_LEVEL).toLowerCase();

const destination = pinoLambdaDestination();
const logger = pino({level}, destination);

module.exports = logger;