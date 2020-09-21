
/**
 * Links a user account to its attached managed policies and userPolicylist
 */

const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const logger = require('./logger');
const authDetailsUtils = require('./authDetailsUtils');

class UserPolicies {

    constructor(dataClient) {
        this.dataClient = dataClient;
    }

    async discover(accountId) {
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
            await this.processUsers(accountId),
            await this.processUserPolicies);

        await this.dataClient.storeData("AWS::IAM::User", dataToUpload, 0);
        return dataToUpload;
    }

    async processUsers(accountId) {
        const users = await this.getUsers(accountId);

        if (users) {
            let formatted = await this.packageUsers(users);
            return formatted;
        }

        return undefined;
    }

    async getUsers(accountId) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::IAM::User",
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

    async packageUsers(users) {
        return users.results.map(user => {
            return this.formatUser(user);
        });
    }

    formatUser(dataIn) {
        let data = {
            id: dataIn.id,
            resourceId: dataIn.properties.resourceId,
            resourceType: dataIn.properties.resourceType,
            accountId: dataIn.properties.accountId
        }

        data.properties = dataIn.properties;
        return data;
    }

    async processUserPolicies(configuration) {
        if (configuration === undefined) {
            return [];
        }

        let config = JSON.parse(configuration);

        if (config === null){
            logger.error("user policies Config parse error configuration = null check config settings");
            return [];
        }

        let linkedManagedPolicies = await this.linkPolicies(config.attachedManagedPolicies);
        let linkedUserPolicyList = await this.linkPolicies(config.userPolicyList);
        return linkedManagedPolicies.concat(linkedUserPolicyList);
    }

    async linkPolicies(policyList) {
        let linkedPolicies = [];

        for (let policy of policyList) {
            let linkedPolicy = await this.getPolicy(policy.policyArn);

            if (linkedPolicy) {
                for (let lp of linkedPolicy.results) {
                    linkedPolicies.push(this.formatLinkedResource(lp.id, lp.properties.resourceType));
                }
            }
        }

        return linkedPolicies;
    }

    async getPolicy(policyArn) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "arn": "" + policyArn,
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

    formatLinkedResource(resourceId, resourceType) {
        let data = {
            link: resourceId,
            resourceType: resourceType
        };

        return data;
    }
}

module.exports = UserPolicies;