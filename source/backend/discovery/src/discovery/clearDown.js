const DiscoveryService = require('./discovery-service');
const DataClient = require('./dataClient');
const discoveryConfig = require('./discoveryConfig');
const logger = require('./logger');

const run = async () => {
    const local = process.argv[2];
    logger.info("local = ", local);

    let zoomAccount = await discoveryConfig.bootStrap(local);

    const dataClient = new DataClient(zoomAccount);
    const discoveryService = new DiscoveryService(undefined, undefined, dataClient, undefined);
    discoveryService.clearDown();
}

run();

