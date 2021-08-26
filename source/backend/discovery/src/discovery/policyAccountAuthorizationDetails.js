/**
 * This module processes the data created in getAccountAuthorizationDetails
 */

const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const logger = require('./logger');
const authDetailsUtils = require('./authDetailsUtils');

class PolicyAccountAuthorizationDetails {

    constructor(dataClient) {
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        logger.info('Beginning discovery of CustomerManagedPolicyStatements.');
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
            await this.processPolicies(accountId, awsRegion),
            await this.processAuthorizationDetails,
            await this.processAuthorizationResources);

        await this.dataClient.storeData("AWS::IAM::Policy", dataToUpload, 0);
        logger.info('Discovery of CustomerManagedPolicyStatements completed.');
        return dataToUpload;
    }

    async processPolicies(accountId, awsRegion) {
        const policies = await this.getPolicies(accountId);

        if (policies && policies.results) {
            let formatted = await this.packagePolicies(policies);
            return formatted;
        }

        return undefined;
    }

    async packagePolicies(policies, accountId, awsRegion) {
        return policies.results.map(policy => {
            return this.formatPolicy(policy);
        });
    }

    formatPolicy(dataIn) {
        let data = {
            id: dataIn.id,
            resourceId: dataIn.properties.resourceId,
            resourceType: dataIn.properties.resourceType,
            accountId: dataIn.properties.accountId
        }

        data.properties = dataIn.properties;
        return data;
    }

    async getPolicies(accountId) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::IAM::Policy",
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

    async processAuthorizationDetails(accountId, awsRegion, resourceId, configuration, arn) {
        if (configuration === undefined) {
            return [];
        }

        let config = JSON.parse(configuration);

        // If the json is not parsed correctly then log and return.
        if (config === null){
            logger.error("Policy Config parse error configuration = null check config settings");
            return [];
        }

        let policy = {
            policyVersionList: config.policyVersionList,
            arn: arn,
            policyId: resourceId,
            resources: config.resources
        };

        return await this.packageAccountAuthorizations(accountId, awsRegion, policy);
    }

    async packageAccountAuthorizations(accountId, awsRegion, policy) {
        // The policy version list gives access to all versions of the policy.
        // We want the most recent (last) one.

        let children = [];
        if (policy.policyVersionList && policy.policyVersionList.length > 0) {
            let policyDocument = policy.policyVersionList[policy.policyVersionList.length-1].document;

            // url decode statement document
            policyDocument = JSON.parse(decodeURIComponent(policyDocument));

            // A statement can be a signular or an array.  Convert all to arrays.
            let statements = Array.isArray(policyDocument.Statement) ? policyDocument.Statement : [policyDocument.Statement];

            children = Promise.all(statements.map(async statement => {
                const hash = await authDetailsUtils.md5Async(statement);

                let resourceId = policy.policyId + "|" + policy.arn + "|" + hash;
                let resourceType =  "AWS::IAM::CustomerManagedPolicyStatement";

                let data = {
                    resourceId: resourceId,
                    resourceType: resourceType,
                    accountId: accountId
                };

                let properties = {
                    resourceId: resourceId,
                    resourceType: resourceType,
                    accountId: accountId,
                    awsRegion: awsRegion,
                    resources: statement.Resource,
                    actions: statement.Action,
                    effect: statement.Effect,
                    statement: statement,
                    title: statement.Effect + "-" + statement.Action
                }

                data.properties = properties;

                return data;
            }));
        }
        return children;
    }



    async processAuthorizationResources(accountId, awsRegion, resources, actions) {
        let resourceLinks = await authDetailsUtils.getResources(accountId, awsRegion, resources, actions, this.dataClient);
        return resourceLinks.map(resource => {
            return authDetailsUtils.formatLinkedResource(resource);
        });
    }
}

module.exports = PolicyAccountAuthorizationDetails;