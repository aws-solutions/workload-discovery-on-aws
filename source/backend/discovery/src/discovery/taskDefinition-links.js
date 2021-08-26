/**
 * Imports data about container definitions and their environment variables.
 * 
 * TODO:  This is very similar to lambda-links.  See if they can be refactored
 *        into a more generic solution
 */

const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const logger = require('./logger');
const zoomUtils = require('./zoomUtils');

class TaskDefinitionLinks {
    constructor(dataClient) {
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        logger.info('Beginning discovery of task definition links.');
        let bind = this;

        let dataToUpload = await zoomUtils.expand(bind,
            await this.processTaskDefinitions(accountId, awsRegion),
            this.processTaskEnvironmentVariables,
            this.processEnvironmentLinks);

        for (let upload of dataToUpload) {
            await this.dataClient.storeData("AWS::ECS::EnvironmentVariable", upload.children, 0, upload.id);
        }
        logger.info('Discovery of task definition links complete.');
    }

    async processEnvironmentLinks(accountId, awsRegion, value) {
        let search = await this.performSearch(this.removeURLStrings(value));
        return await this.packageEnvironmentLinks(accountId, awsRegion, search, value);
    }

    removeURLStrings(value) {
        let start = value.indexOf("://");

        if (start > 0) {
            return this.removePorts(value.substring(start + 3));
        }

        return value;
    }

    removePorts(value) {
        let start = value.indexOf(":");

        if (start > 0) {
            return value.substring(0, start);
        }

        return value;
    }

    async packageEnvironmentLinks(accountId, awsRegion, search) {
        // do not link environment variables to tags.
        return this.dataClient.processSearchResults(search, accountId).filter(element => {
            return element.resourceType !== "AWS::TAGS::TAG"
        });
    }

    async processTaskEnvironmentVariables(accountId, awsRegion, resourceId, containerDefinitions) {
        let containerDefinitionsObject = JSON.parse(containerDefinitions);

        if (containerDefinitionsObject === null){
            logger.error("Task definition parse error:");
            logger.error(containerDefinitions);
            return [];
        }

        let children = containerDefinitionsObject.map(container => {
            return this.packageTaskEnvironmentVariables(accountId, awsRegion, resourceId, container);
        });

        return children;
    }

    packageTaskEnvironmentVariables(accountId, awsRegion, resourceId, container) {
        let children = [];

        if (container.environment) {
            let environmentVariables = container.environment;

            for (let environmentVariable of environmentVariables) {

                let name = environmentVariable.name;
                let value = environmentVariable.value;

                if (!this.isExcluded(name)) {
                    children.push(this.formatEnvironmentVariable(name, value, accountId, awsRegion, resourceId));
                }
            }
        }

        return children;
    }

    formatEnvironmentVariable(key, value, accountId, awsRegion, resourceId) {
        let data = {
            resourceId: key + "_" + value + "_" + accountId + "_" + awsRegion,
            resourceType: "AWS::ECS::EnvironmentVariable",
            accountId: accountId,
        }

        let properties = {
            resourceId: key + "_" + value + "_" + accountId + "_" + awsRegion,
            resourceType: "AWS::ECS::EnvironmentVariable",
            accountId: accountId,
            linkedDefinition: resourceId,
            value: value,
            awsRegion: awsRegion,
            title: key + ":" + value
        }

        data.properties = properties;

        return data;
    }

    isExcluded(parameter) {
        const excluded = ["PASSWORD", "PASS", "LOG", "USER", "USERNAME"];
        return excluded.includes(parameter.toUpperCase());
    }

    async performSearch(term) {
        try {
            return await this.dataClient.search(term);
        }
        catch (err) {
            logger.error("performSearch error: " + err);
        }
    }

    async getTaskDefinitions(accountId, region) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::ECS::TaskDefinition",
                    "awsRegion": region,
                    "accountId": "" + accountId,
                }
            };

            return await this.dataClient.queryGremlin(query)
        }
        catch (err) {
            logger.error(err);
            return {
                success: false
            }
        }
    }

    async packageTaskDefinitions(taskDefinitions) {
        return taskDefinitions.results.map(taskDefinition => {
            return this.formatTaskDefinition(taskDefinition);
        });
    }

    async processTaskDefinitions(accountId, awsRegion) {
        logger.info(`processTaskDefinitions: accountId: ${accountId} awsRegion: ${awsRegion}`);
        let definition = await this.getTaskDefinitions(accountId, awsRegion);
        return await this.packageTaskDefinitions(definition);
    }

    formatTaskDefinition(dataIn) {
        let data = {
            id: dataIn.id,
            resourceId: dataIn.properties.resourceId,
            resourceType: dataIn.properties.resourceType,
            accountId: dataIn.properties.accountId,
        }

        data.properties = dataIn.properties;
        return data;
    }
}

module.exports = TaskDefinitionLinks;