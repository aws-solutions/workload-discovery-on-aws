const DataClient = require('./dataClient');
const discoveryConfig = require('./discoveryConfig');
const logger = require('./logger')

const keepAlive = async() => {
    logger.info("==KeepAlive Start==");
    
    var today  = new Date();
    logger.info(today.toLocaleString("en-UK"));

    const local = process.argv[2];
    logger.info("local = ", local);

    let zoomAccount = await discoveryConfig.bootStrap(local);

    const dataClient = new DataClient(zoomAccount);
    
    let command = {
        "command": "filterNodes",
        "data": {
            "resourceType": "AWS::ElasticLoadBalancingV2::LoadBalancer"
        }
    };
    
    let result = await dataClient.queryGremlin(command);
    logger.info(result);

    let searchResult = await dataClient.search("test");
    logger.info(searchResult);
};

keepAlive();