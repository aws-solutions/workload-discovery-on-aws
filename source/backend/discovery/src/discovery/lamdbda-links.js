/**
 * Imports data about lambda functions and their environment variables.
 */

const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const logger = require('./logger');
const parser = require('./lambdaParser');

class LambdaLinks {
    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        let bind = this;

        let dataToUpload = await zoomUtils.expand(bind,
            await this.processLambdaFunctions(accountId, awsRegion),
            this.processEnvironmentVariables,
            this.processEnvironmentLinks);

        await this.dataClient.storeData("AWS::Lambda::Function", dataToUpload, 0)
    }

    async processEnvironmentLinks(accountId, awsRegion, value) {
        let filteredValue = this.removeURLStrings(value);
        let search = await this.performSearch(filteredValue);
        return await this.packageEnvironmentLinks(accountId, awsRegion, search, filteredValue);
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

    async packageEnvironmentLinks(accountId, awsRegion, search, searchValue) {
        let exactMatchSearch = zoomUtils.exactMatch(search, searchValue);

        // do not link environment variables to tags.
        return this.dataClient.processSearchResults(exactMatchSearch, accountId).filter(element => {
            return element.resourceType !== "AWS::TAGS::TAG"
                && element.resourceType !== "AWS::CloudFormation::Stack"
                && element.resourceType !== "AWS::Lambda::EnvironmentVariable"
        });
    }

    async processEnvironmentVariables(accountId, awsRegion, resourceId) {
        let lambdaConfig = await this.getLambdaConfig(resourceId, accountId, awsRegion);
        if (lambdaConfig){
            return await this.packageEnvironmentVariables(accountId, awsRegion, resourceId, lambdaConfig);
        }
        return [];
    }

    async packageEnvironmentVariables(accountId, awsRegion, resourceId, config) {
        let children = [];

        logger.info("Running linking for module: " + config.Configuration.FunctionName);

        if (config.Configuration.Environment) {
            let environmentVariables = config.Configuration.Environment.Variables;

            for (let key of Object.keys(environmentVariables)) {
                if (!this.isExcluded(key, ["PASSWORD", "PASS", "LOG", "USER", "USERNAME"]) 
                    && !this.isExcluded(environmentVariables[key], ["TRUE", "FALSE"])) {
                    children.push(this.formatEnvironmentVariable(key, environmentVariables[key], accountId, awsRegion, resourceId));
                }
            }
        }

        // Process the code that is linked to the lambda function.
        if (config.Code) {
            let codeLinks = await this.handleCode(config, accountId, awsRegion);
            children = children.concat(codeLinks);
        }

        return children;
    }

    // Download the lambda code,  parse it,  pull out features that we can link to and link.
    async handleCode(config, accountId, awsRegion) {
        if (parser.isSupported(config.Configuration.Runtime)) {
            logger.info("Parsing code for runtime: " + config.Configuration.Runtime);
            let codeArray = await parser.downloadCode(config.Code.Location);

            // for each file in the lambda function pull out the bits that we can link
            // i.e. s3 buckets, dynamodb tables,  rds connections etc.
            let codeLinks = codeArray.map(code => {
                return parser.parse(config.Configuration.Runtime, code);
            });

            // convert these potential links into neptune links
            let results = await this.createLinks(codeLinks, accountId, awsRegion);

            return results;
        }

        return [];
    }

    // Run a search against elastic,  make sure that one of the attributes of the
    // returned search is an exact match of the search term.  Finally create the neptune
    // link object.
    async createLinks(codeLinks, accountId, awsRegion) {
        let links = [];

        for (let code of codeLinks) {

            //Convert our list of buckets and tables into a list of links (if they are valid)
            code.validBuckets = await this.filterLookUp(code.validBuckets, "AWS::S3::Bucket", accountId, awsRegion);
            code.dynamoTables = await this.filterLookUp(code.dynamoTables, "AWS::DynamoDB::Table", accountId, awsRegion);

            // Add the buckets and dynamo back to the connections strings.
            links = links.concat(code.validBuckets);
            links = links.concat(code.dynamoTables);

            let toSearch = code.connectionStrings;
            logger.info("toSearch = " + toSearch);

            // Search for the connection strings
            for (let searchTerm of toSearch) {
                let searchResult = await this.performSearch(searchTerm);
                let exactMatchSearch = zoomUtils.exactMatch(searchResult, searchTerm);

                let results = this.dataClient.processSearchResults(exactMatchSearch, accountId).filter(element => {
                    return element.resourceType !== "AWS::TAGS::TAG"
                        && element.resourceType !== "AWS::CloudFormation::Stack"
                        && element.resourceType !== "AWS::Lambda::EnvironmentVariable"
                });

                if (results.length > 0) {
                    links.push(results);
                }
            }
        }

        return links;
    }

    // For s3 buckets and dynamodb tables we should be able to see if they exist.
    async filterLookUp(things, type, accountId, region) {
        let results = [];

        for (let thing of things) {
            let lookUp = await this.getThing(accountId, region, type, thing);

            if (lookUp.results.length > 0 && lookUp.results[0].properties.resourceName === thing) {

                let link = {
                    link: lookUp.results[0].id,
                    resourceType: lookUp.results[0].properties.resourceType
                };

                results.push(link);
            }
        }

        return results;
    }

    formatEnvironmentVariable(key, value, accountId, awsRegion, lambdaResourceId) {
        let data = {
            resourceId: key + "_" + value + "_" + accountId + "_" + awsRegion,
            resourceType: "AWS::Lambda::EnvironmentVariable",
            accountId: accountId,
        }

        let properties = {
            resourceId: key + "_" + value + "_" + accountId + "_" + awsRegion,
            resourceType: "AWS::Lambda::EnvironmentVariable",
            accountId: accountId,
            linkedLambda: lambdaResourceId,
            value: value,
            awsRegion: awsRegion,
            title: key + ":" + value
        }

        data.properties = properties;

        return data;
    }

    isExcluded(parameter, excluded) {
        let ans = excluded.includes(parameter.toUpperCase());

        // Test for accountIds
        if (!ans){
            const accountRegex = RegExp(/^\d{12}/);
            return accountRegex.test(parameter);
        }
    }

    async performSearch(term) {
        try {
            return await this.dataClient.search(term);
        }
        catch (err) {
            logger.error("performSearch error: " + err);
        }
    }

    async getLambdaConfig(resourceId, accountId, awsRegion) {
        try {
            var params = {
                FunctionName: resourceId,
            };

            return await this.API.getFunction(params).promise();
        }
        catch (err) {
            logger.error("getLambdaConfig error: " + err);
            return false;
        }
    }

    async getLambdaFunctions(accountId, region) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::Lambda::Function",
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

    async getThing(accountId, region, type, name) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": type,
                    "awsRegion": region,
                    "accountId": "" + accountId,
                    "resourceName": name
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

    async packageLambdaFunctions(lambdaFunctions, accountId, awsRegion) {
        return lambdaFunctions.results.map(lambdaFunction => {
            return this.formatLambdaFunction(lambdaFunction);
        });
    }

    async processLambdaFunctions(accountId, awsRegion) {
        let lambda = await this.getLambdaFunctions(accountId, awsRegion);
        return await this.packageLambdaFunctions(lambda);
    }

    formatLambdaFunction(dataIn) {
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

module.exports = LambdaLinks;