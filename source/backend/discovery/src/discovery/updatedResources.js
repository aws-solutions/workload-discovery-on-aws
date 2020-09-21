const login = require('./awsLogin');
const logger = require('./logger');
const zoomUtils = require('./zoomUtils');
const util = require('util');
const AWS = require('aws-sdk');

class UpdatedResources {
 
    async buildRecentlyChanged({rootAccountId, accounts, rootAccountRole}) {
        logger.info("buildRecentlyChanged");

        let changed = new Map();
        let all = new Map();

        for (let account of accounts) {
            try {
                const role = account.accountId === rootAccountId ? rootAccountRole :
                    `arn:aws:iam::${account.accountId}:role/ZoomDiscoveryRole`;

                const creds = await login.login(role);

                for (let region of account.regions) {
                    let allNodes = await this.getAll(creds, region.name);

                    if (allNodes.Results) {
                        allNodes.Results.reduce((acc, element) => {
                            let result = JSON.parse(element);
                            return acc.set(result.resourceId, result);
                        }, all);
                    }

                    let recentlyChanged = await this.getRecentlyChanged(creds, region.name);

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

    async getRecentlyChanged(creds, region) {
        const msMin = 60000;
        const noMins = 35;
        const endDate = new Date();
        const myStartDate = new Date(endDate - (noMins * msMin));

        const query =  "select configurationItemCaptureTime, resourceId, Relationships where configurationItemCaptureTime > '" + myStartDate.toISOString() + "'";
        return await this.runAdvancedQuery(query, creds, region);
    }

    async getAll(creds, region) {
        return await this.runAdvancedQuery("select configurationItemCaptureTime, resourceId, accountId, awsRegion", creds, region);
    }

    async runAdvancedQuery(query, creds, region) {
        let config = new AWS.ConfigService({ apiVersion: '2014-11-12', credentials: creds, region: region});

        const params = {
            Expression: query
        };

        return await zoomUtils.callAwsApiWithPagination(config.selectResourceConfig, params, config, undefined, "updateResources - runAdvancedQuery");
    }
}

module.exports = UpdatedResources;

