const login = require('./awsLogin');
const logger = require('./logger');
const zoomUtils = require('./zoomUtils');
const AWS = require('aws-sdk');

class UpdatedResources {
 
    async buildRecentlyChanged({rootAccountId, accounts, customUserAgent, rootAccountRole}) {
        logger.info("buildRecentlyChanged");

        let changed = new Map();
        let all = new Map();

        for (let account of accounts) {
            try {
                const role = account.accountId === rootAccountId ? rootAccountRole :
                    `arn:aws:iam::${account.accountId}:role/ZoomDiscoveryRole`;

                const creds = await login.login(role);

                for (let region of account.regions) {
                    let allNodes = await this.getAll(customUserAgent, creds, region.name);

                    if (allNodes.Results) {
                        allNodes.Results.reduce((acc, element) => {
                            let result = JSON.parse(element);
                            return acc.set(result.resourceId, result);
                        }, all);
                    }

                    let recentlyChanged = await this.getRecentlyChanged(customUserAgent, creds, region.name);

                    if (recentlyChanged.Results) {
                        recentlyChanged.Results.reduce((acc, element) => {
                            let result = JSON.parse(element);
                            return acc.set(result.resourceId, result);
                        }, changed);
                    }
                }
            }
            catch (err) {
                logger.error(`Import api data failed for account ${account.accountId}: Error was ${err}`);
                zoomUtils.dumpError(err);
            }
        }

        return { all: all, updated: changed };
    }

    async getRecentlyChanged(customUserAgent, creds, region) {
        const msMin = 60000;
        const noMins = 35;
        const endDate = new Date();
        const myStartDate = new Date(endDate - (noMins * msMin));

        const query =  "select configurationItemCaptureTime, resourceId, Relationships where configurationItemCaptureTime > '" + myStartDate.toISOString() + "'";
        return await this.runAdvancedQuery(customUserAgent, query, creds, region);
    }

    async getAll(customUserAgent, creds, region) {
        const query = "select configurationItemCaptureTime, resourceId, accountId, awsRegion";
        return await this.runAdvancedQuery(customUserAgent, query, creds, region);
    }

    async runAdvancedQuery(customUserAgent, query, credentials, region) {
        let config = new AWS.ConfigService({ credentials, customUserAgent, region});

        const params = {
            Expression: query
        };

        return await zoomUtils.callAwsApiWithPagination(config, config.selectResourceConfig, params, 'selectResourceConfig');
    }
}

module.exports = UpdatedResources;

