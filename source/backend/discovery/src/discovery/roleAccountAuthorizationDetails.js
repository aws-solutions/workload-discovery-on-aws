/**
 * This module loads all of the roles and pulls out their configuration details.
 */

const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const logger = require('./logger');
const authDetailsUtils = require('./authDetailsUtils');
const {md5Async} = require('./authDetailsUtils');

const hash = data => {
    const crypto = require('crypto');
    const algo = 'md5';
    let shasum = crypto.createHash(algo).update(JSON.stringify(data));
    return "" + shasum.digest('hex');
}

class RoleAccountAuthorizationDetails {

    constructor(dataClient) {
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
            await this.processRoles(accountId, awsRegion),
            await this.processConfigDetails,
            await this.processRoleAuthorizationStatements,
            await this.processRoleAuthorizationResources);

        await this.dataClient.storeData("AWS::IAM::Role", dataToUpload, 0);
        return dataToUpload;
    }

    async processRoles(accountId, awsRegion) {
        const roles = await this.getRoles(accountId);

        if (roles) {
            let formatted = await this.packageRoles(roles);
            return formatted;
        }

        return undefined;
    }

    async packageRoles(policies, accountId, awsRegion) {
        return policies.results.map(policy => {
            return this.formatRole(policy);
        });
    }

    formatRole(dataIn) {
        let data = {
            id: dataIn.id,
            resourceId: dataIn.properties.resourceId,
            resourceType: dataIn.properties.resourceType,
            accountId: dataIn.properties.accountId
        }

        data.properties = dataIn.properties;
        return data;
    }

    async getRoles(accountId) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::IAM::Role",
                    "accountId": "" + accountId,
                }
            };

            return await this.dataClient.queryGremlin(query)
        }
        catch (error) {
            return {
                success: false
            }
        }
    }

    async processConfigDetails(accountId, awsRegion, resourceId, configuration, arn) {
        if (configuration === undefined) {
            return [];
        }

        let config = JSON.parse(configuration);

        if (config === null){
            logger.error("Role Config parse error configuration = null check config settings");
            return [];
        }

        let policy = {
            assumeRolePolicyDocument: JSON.parse(decodeURIComponent(config.assumeRolePolicyDocument)),
            rolePolicyList: this.processRolePolicyList(config.rolePolicyList),
            attachedManagedPolicies: config.attachedManagedPolicies,
            instanceProfileList: config.instanceProfileList,
            arn: arn,
            roleName: config.roleName,
            policyId: resourceId,
        };

        return await this.packageConfigDetails(accountId, awsRegion, policy);
    }

    processRolePolicyList(rolePolicyList) {
        return rolePolicyList.map(policy => {
            return {
                policyName: policy.policyName,
                policyDocument: JSON.parse(decodeURIComponent(policy.policyDocument))
            }
        });
    }

    // Creates any in-line policies and links in any aws managed policies,
    async packageConfigDetails(accountId, awsRegion, policy) {
        let policyChildren = this.processRolePolicies(accountId, awsRegion, policy);
        let roleAwsManagedChildren = await this.processManagedPolicies(policy.attachedManagedPolicies);
        return policyChildren.concat(roleAwsManagedChildren).filter(zoomUtils.identity);
    }

    processRolePolicies(accountId, awsRegion, policy) {
        return policy.rolePolicyList.map(rolePolicy => {
            let resourceId = rolePolicy.policyName + "|" + accountId + "|" + hash(rolePolicy.policyDocument);

            let data = {
                resourceId: resourceId,
                resourceType: "AWS::IAM::Role_In_Line_Policy",
                accountId: accountId
            };

            let properties = {
                resourceId: resourceId,
                resourceType: "AWS::IAM::Role_In_Line_Policy",
                accountId: accountId,
                awsRegion: awsRegion,
                policyDocument: rolePolicy.policyDocument
            }

            properties.title = rolePolicy.policyName;

            data.properties = properties;
            return data;
        });
    }

    async processManagedPolicies(managedPolicies) {
        return await zoomUtils.asyncMap(managedPolicies, this.createManagedPolicyLink, this);
    }

    async createManagedPolicyLink(policy) {
        let query = {
            "command": "filterNodes",
            "data": {
                "resourceId": policy.policyName,
                "arn": policy.policyArn
            }
        };

        let results = await this.dataClient.queryGremlin(query);

        if (results.results.length > 0) {
            return {
                link: results.results[0].id,
                resourceType: results.results[0].properties.resourceType
            };
        }
    }

    // The policy is stored in the temporary field....
    async processRoleAuthorizationStatements(accountId, awsRegion, policyDocument) {
        // A statement can be a signular or an array.  Convert all to arrays.
        const statements = Array.isArray(policyDocument.Statement) ? policyDocument.Statement : [policyDocument.Statement];

        return Promise.all(statements.map(async statement => {
            let resourceId = await md5Async(statement);
            let resourceType = "AWS::IAM::CustomerManagedPolicyStatement";

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

    async processRoleAuthorizationResources(accountId, awsRegion, resources, actions) {
        let resourceLinks = [];

        let results = await authDetailsUtils.getResources(accountId, awsRegion, resources, actions, this.dataClient);

        if (results) {
            for (let result of results) {
                resourceLinks.push(authDetailsUtils.formatLinkedResource(result));
            }
        }


        return resourceLinks;
    }
}

module.exports = RoleAccountAuthorizationDetails;