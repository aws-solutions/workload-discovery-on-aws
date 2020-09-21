const logger = require('./logger')

const getEC2Instance = async (instanceId, dataClient) => {
    try {
        let query = {
            "command": "filterNodes",
            "data": {
                "resourceType": "AWS::EC2::Instance",
                "instanceId": instanceId
            }
        };

        return await dataClient.queryGremlin(query);
    }
    catch (err) {
        logger.error(err);
        return {
            success: false
        }
    }
}

exports.getEC2Instance = getEC2Instance;