/**
 * Interface between the discovery system and back end.
 */

const crypto = require('crypto');
const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const rest = require('./rest');
const R = require('ramda');
const arnParser = require('./arnParser');
const logger = require('./logger');

const isItemIn = (map, id) => map.has(id) ? map.get(id) : false;

class DataClient {

    constructor(importConfig, accessKeys, configData, opts = {}) {
        this.inNeptune = R.pathOr(new Map(), ['cache', 'inNeptune'], opts);
        this.previousPersistedLinkedMap = R.pathOr(new Map(), ['cache', 'previousPersistedLinkedMap'], opts);
        this.resourceIdIndex = R.pathOr(new Map(), ['cache', 'resourceIdIndex'], opts);
        this.importConfig = importConfig;
        this.nodesProcessed = new Map();
        this.nodesDeleted = new Map();
        // When a node is deleted and recreated map the old ID to the new Id.
        this.substitutedNodes = new Map();
        this.processedTags = new Map();
        this.accessKeys = accessKeys;
        this.updatedResources = configData.updated;
        this.allNodesInConfig = configData.all;
    }

    makeObject(data) {
        return typeof data === "string" ? JSON.parse(data) : data;
    }

    hashNode(node) {
        const algo = 'md5';
        let shasum = crypto.createHash(algo).update(JSON.stringify(node.properties));
        return "" + shasum.digest('hex');
    }

    processTags(resource) {
        // Links and tags do not have tags!
        if (resource.link || resource.resourceType === "AWS::TAGS::TAG") {
            return [];
        }

        if (resource.properties.tags) {
            let tagObject = this.makeObject(resource.properties.tags);
            return Object.keys(tagObject).reduce((acc, key) => {
                return this.processTag(acc, key, resource, tagObject);
            }, []);
        }
        else {
            return [];
        }
    }

    processTag(acc, key, resource, tagObject) {
        let tagKey = `${key}:${tagObject[key]}:${resource.properties.accountId}:${resource.properties.awsRegion}`;

        let tag = {};

        let previousTag = this.processedTags.get(tagKey);

        if (!previousTag) {
            tag = {
                resourceId: tagKey,
                resourceType: "AWS::TAGS::TAG",
                accountId: resource.properties.accountId,
                properties: {
                    resourceType: "AWS::TAGS::TAG",
                    accountId: resource.properties.accountId,
                    resourceId: key,
                    resourceValue: tagObject[key],
                    awsRegion: "global"
                }
            }

            generateHeader.generateHeader(tag);
            acc.push(tag);
        }
        else {
            tag = {
                link: previousTag,
                resourceType: "AWS::TAGS::TAG"
            }
            acc.push(tag);
        }

        return acc;
    }

    async storeData(hierarchyResourceType, allResources, level, parentNodeId) {
        try {
            if (allResources === undefined) return;

            // Naff way of limiting concurrency so that we don't overload neptune!
            while (allResources.length) {
                let concurrency = allResources.splice(0, 5);

                await Promise.all(concurrency.map(resource => {
                    return this.storeResource(resource, parentNodeId, level, hierarchyResourceType);
                }));
            }
        }
        catch (err) {
            logger.error(err);
        }
    }

    async storeResource(resource, parentNodeId, level, hierarchyResourceType) {
        let tags = this.processTags(resource);

        if (resource.children) {
            resource.children = [...tags, ...resource.children]
        }
        else if (tags.length > 0) {
            resource.children = tags;
        }

        return await this.processResource(hierarchyResourceType, resource, parentNodeId, level);
    }

    /**
     * Recusively Uploads all of the discovered resources into Neptune and elastic
     * Creating links where necessary.
     * 
     * If the dataType is just a link then link the item and carry on
     * 
     */
    async processResource(hierarchyResourceType, resource, parentNodeId, level) {
        resource.link
            ? await this.storeLinkAndProcessChildren(resource.link, parentNodeId, level, resource, hierarchyResourceType)
            : await this.processResourceNode(hierarchyResourceType, resource, parentNodeId, level);
    }

    async processResourceNode(hierarchyResourceType, resource, parentNodeId, level) {
        if (resource.id) {
            // Don't allow the node to be deleted if it is found in the config scan
            if (this.allNodesInConfig.get(resource.id)) {
                this.nodesProcessed.set(resource.id, resource);
            }
            await this.storeData(hierarchyResourceType, resource.children, level + 1, resource.id);
        }
        else {
            // Take the md5 to set the id of the node.
            let id = this.hashNode(resource);

            let addLinkOrNodeResult = this.addLinkOrNode(id);
            this.nodesProcessed.set(id, resource);

            addLinkOrNodeResult
                ? await this.storeLinkAndProcessChildren(id, parentNodeId, level, resource, hierarchyResourceType)
                : await this.storeNewNodeAndProcessChildren(id, parentNodeId, level, resource, hierarchyResourceType);
        }
    }

    addLinkOrNode(id) {
        let inNeptuneBeforeImport = isItemIn(this.inNeptune, id);
        let allreadyImported = this.nodesProcessed.get(id);

        if (inNeptuneBeforeImport) {
            return true;
        }
        else if (allreadyImported) {
            return true;
        }
        else {
            return false;
        }
    }

    async storeLinkAndProcessChildren(id, parentNodeId, level, resource, hierarchyResourceType) {
        await this.createLink(parentNodeId, id, resource.resourceType);
        await this.storeData(hierarchyResourceType, resource.children, level + 1, id);
    }

    async storeNewNodeAndProcessChildren(id, parentNodeId, level, resource, hierarchyResourceType) {
        let added = await this.addNode(resource.properties, id);

        let resourceCheck = isItemIn(this.resourceIdIndex, resource.properties.resourceId);

        if (added && added.success) {
            if (resource.resourceType === "AWS::TAGS::TAG") {
                this.processedTags.set(resource.resourceId, added.results.value.id);
            }

            // Check that this resource is not in the resource Index ( a map keyed on resourceId )
            // Which is loaded at the start of each import.
            // If the resource is found then it means that we have seen the resource before and
            // It's data has changed.  Therefore delete the old resource.
            // Add a record to the substitution map so that any links pointing at the old resource
            // can be updated

            if (resourceCheck) {
                // These nodes already exist so the config has changed. Set the softDeleteType to update 
                await this.performDelete([resourceCheck.id], "update");
                this.substitutedNodes.set(resourceCheck.id, id);
            }

            this.inNeptune.set(id, added);
            await this.createLink(parentNodeId, added.results.value.id, resource.resourceType);
            resource.properties = this.massageForIndex(resource.properties);
            await this.postIndex(id, added.results.value.label, resource.properties);
            await this.storeData(hierarchyResourceType, resource.children, level + 1, id);
        }
    }

    /**
     * Elastic search does not seem to like policyDocumentFields. 
     * @param {*} properties 
     */
    massageForIndex(properties) {
        let localProperties = R.clone(properties);

        if (!typeof localProperties.policyDocument !== 'string') {
            localProperties.policyDocument = JSON.stringify(localProperties.policyDocument);
        }

        return localProperties;
    }

    /**
     * When deleting a node we need to know if the delete was
     * as a result of an update ( i.e. config updated the node )
     * or if it was a hard delete ( i.e. the node has neen removed from config )
     * The softDeleteType parameter is set to "delete" when the config was deleted, "update" when 
     * updated.
     * 
     * @param {*} nodes 
     */
    async performDelete(nodes, softDeleteType) {
        await Promise.all([
            this.deleteModifiedNodesFromNeptune(nodes, softDeleteType),
            this.deleteModifiedNodesFromElastic(nodes)
        ]);
    }

    async deleteModifiedNodesFromNeptune(nodes, softDeleteType) {
        try {
            let payload = {
                "command": "deleteNodes",
                "data": {
                    nodes: nodes,
                    softDeleteType: softDeleteType
                }
            };

            // Delete the record from the internal map of neptune nodes
            nodes.forEach(node => this.inNeptune.delete(node));
            return await rest.postGremlin(payload, this.importConfig, this.accessKeys);
        }
        catch (err ) {
            logger.error("deleteModifiedNodes error:", err);
        }
    }

    async deleteModifiedNodesFromElastic(nodes) {
        for (let node of nodes) {
            try {
                let payload = {
                    "command": "deleteDocument",
                    "data": {
                        "id": node
                    }
                };

                return await rest.postElastic(payload, this.importConfig, this.accessKeys);
            }
            catch (err) {
                logger.error("deleteNodesFromElastic error: ", err)
            }
        }
    }

    checkLink(l1, l2) {
        if (l1 === undefined || l2 === undefined) {
            return false;
        }

        if (this.previousPersistedLinkedMap.get(l1 + "-" + l2) || this.previousPersistedLinkedMap.get(l2 + "-" + l1)) {
            return false;
        }

        return true;
    }

    substitue(link) {
        let newLink = this.substitutedNodes.get(link);
        if (newLink) {
            return newLink;
        }
        else {
            return link;
        }
    }

    async createLink(source, target, type) {
        if (source === target) {
            return;
        }
        if (!source || !target || !type) {
            return;
        }
        else {

            // When a node is updated it's id can change.
            // These alterations are stored in the substitueNodes map.
            source = this.substitue(source);
            target = this.substitue(target);

            if (this.checkLink(source, target)) {
                let link = await this.postLink(source, target, type);
                this.previousPersistedLinkedMap.set(source + "-" + target, link);
                this.previousPersistedLinkedMap.set(target + "-" + source, link);
            }
        }
    }

    /**
    * Neptune cannot store a hierarchy of properties.
    * Therefore this function extracts config items and adds them to the main object.
    * Only config items that you want to query from the graph database should be extracted.
    * @param {*} node 
    */
    formatNode(node) {
        const apiGatewayToKeep = ["name", "createdDate", "apiKeySource", "policy", "endpointConfiguration", "parentId",
            "pathPart", "path", "resourceMethods", "type", "httpMethod", "uri",
            "passthroughBehavior", "contentHandling", "timeoutInMillis",
            "cacheNamespace", "integrationResponses"];
        const vpcConfigToKeep = ["cidrBlock", "dhcpOptionsId", "state", "instanceTenancy", "isDefault"];
        const subnetConfigToKeep = ["availableIpAddressCount", "cidrBlock", "defaultForAz", "mapPublicIpOnLaunch", "state", "assignIpv6AddressOnCreation"];
        const networkAclConfigToKeep = ["associations", "isDefault"];
        const securityGroupConfigToKeep = ["description", "groupName"];
        const ec2NetworkConfigToKeep = ["interfaceType", "macAddress", "networkInterfaceId", "privateDnsName", "privateIpAddress", "requesterId", "requesterManaged", "sourceDestCheck", "status"];
        const ec2InstanceConfigToKeep = ["imageId", "amiLaunchIndex", "instanceId", "instanceType", "kernelId", "keyName", "launchTime", "platform", "privateDnsName", "privateIpAddress", "publicDnsName", "publicIpAddress",
            "ramdiskId", "state", "stateTransitionReason", "architecture", "clientToken", "ebsOptimized", "enaSupport", "hypervisor", "iamInstanceProfile", "instanceLifecycle", "description",
            "macAddress", "spotInstanceRequestId", "sriovNetSupport", "stateReason", "virtualizationType", "capacityReservationId"];

        const dbInstanceConfigToKeep = ["dBInstanceIdentifier", "dBInstanceClass", "engine", "dBInstanceStatus", "masterUsername", "dBName", "endpoint", "allocatedStorage", "instanceCreateTime", "preferredBackupWindow", "backupRetentionPeriod",
            "preferredMaintenanceWindow", "latestRestorableTime", "multiAZ", "engineVersion", "autoMinorVersionUpgrade", "readReplicaSourceDBInstanceIdentifier", "licenseModel", "iops",
            "characterSetName", "secondaryAvailabilityZone", "publiclyAccessible", "storageType", "tdeCredentialArn", "dbInstancePort", "dBClusterIdentifier", "storageEncrypted",
            "kmsKeyId", "dbiResourceId", "cACertificateIdentifier", "copyTagsToSnapshot", "monitoringInterval", "enhancedMonitoringResourceArn", "monitoringRoleArn", "timezone", "iAMDatabaseAuthenticationEnabled",
            "performanceInsightsEnabled", "performanceInsightsKMSKeyId", "performanceInsightsRetentionPeriod", "enabledCloudwatchLogsExports", "processorFeatures", "deletionProtection", "associatedRoles", "listenerEndpoint"];

        const genericToKeep = ["vpcId", "subnetId"];

        const configToKeep = [].concat(vpcConfigToKeep).concat(subnetConfigToKeep).concat(networkAclConfigToKeep)
            .concat(securityGroupConfigToKeep).concat(ec2NetworkConfigToKeep).concat(ec2InstanceConfigToKeep)
            .concat(dbInstanceConfigToKeep).concat(apiGatewayToKeep).concat(genericToKeep);

        let configuration = JSON.parse(node.properties.configuration);

        if (configuration === null) {
            logger.error("Config parse error, configuration = null check config settings");
        }

        if (configuration && configuration !== null) {
            for (let element of Object.keys(configuration)) {
                if (configToKeep.includes(element)) {
                    node.properties[element] = configuration[element]
                }
            }
        }

        if (node.properties.state) {
            node.properties.state = JSON.stringify(node.properties.state);
        }

        if (node.properties.stateReason) {
            node.properties.stateReason = JSON.stringify(node.properties.stateReason);
        }

        if (node.properties.endpoint) {
            node.properties.endpoint = JSON.stringify(node.properties.endpoint);
        }

        // Create the URLS to the console
        let { loginURL, loggedInURL } = consoleM.getConsoleURLs(node);
        node.properties.loginURL = loginURL;
        node.properties.loggedInURL = loggedInURL;

        // Generate the title property
        generateHeader.generateHeader(node);

        // Add in missing VPC and subnet config
        if (node.properties.resourceType === "AWS::Lambda::Function" && configuration) {
            if (configuration.vpcConfig) {
                node.properties.subnetIds = configuration.vpcConfig.subnetIds;
            }
        }

        // Sometimes we have to store temporary data in the node to allow for
        // further processing.  See zoomUtils.expand....
        delete node.properties.temporary;

        return node;
    }

    async addNode(data, id) {
        try {
            let payload = {
                "command": "addNode",
                "data": {
                    "properties": data,
                    "id": id
                }
            };

            return await rest.postGremlin(payload, this.importConfig, this.accessKeys);
        }
        catch (err) {
            logger.error("error: ", err)

        }
    }

    /**
     * In order to perform resource look-ups within ARNs split the arn into its constituant parts
     */
    splitARN(data) {
        let dataCopy = R.clone(data);
        dataCopy.parsedArn = arnParser.storeParse(dataCopy.arn);
        return dataCopy;
    }

    async postIndex(id, label, data) {
        let processedData = this.splitARN(data);
        try {
            let payload = {
                "command": "index",
                "data": {
                    "id": id,
                    "label": label,
                    "properties": processedData
                }
            };

            let response = await rest.postElastic(payload, this.importConfig, this.accessKeys);
            return response;
        }
        catch (err) {
            logger.error("error: " + err);
        }
    }

    async postLink(source, target, label) {
        try {
            let payload = {
                "command": "addEdge",
                "data": {
                    "source": source,
                    "target": target,
                    "label": label
                }
            };

            return await rest.postGremlin(payload, this.importConfig, this.accessKeys);
        }
        catch (err) {
            logger.error("error: ", err)
        }
    }

    async search(query) {
        try {
            let payload = {
                command: "fetch",
                data: {
                    index: "zoom",
                    searchTerms: "\"" + query + "\""
                }
            };

            return await rest.postElastic(payload, this.importConfig, this.accessKeys);
        }
        catch (err) {
            logger.error("error: " + err)
        }
    }

    async advancedSearch(query) {
        try {
            let payload = {
                command: "queryIndex",
                data: query
            };

            return await rest.postElastic(payload, this.importConfig, this.accessKeys);
        }
        catch (err) {
            logger.error("error: " + err)
        }
    }

    /**
    * Processes the results of a search by taking the first
    * "top" result and formatting the data correctly
    * @param {*} result 
    */
    processSearchResult(result, accountId) {
        if (result.hits) {
            for (let hit of result.hits.hits) {
                if (hit._source.properties.accountId === accountId) {

                    let data = {
                        link: hit._source.id,
                        resourceType: hit._source.properties.resourceType
                    };

                    return data;
                }
            }
        }

        return undefined;
    }

    /**
     * Processes search results making sure that the search result matches the correct account.
     * @param {*} result 
     * @param {*} accountId 
     */
    processSearchResults(result, accountId) {
        let children = [];

        if (result.hits) {
            for (let hit of result.hits.hits) {

                // AccountId from elastic is a number so == not ====
                if (hit._source.properties.accountId == accountId) {

                    let data = {
                        link: hit._source.id,
                        resourceType: hit._source.properties.resourceType
                    };

                    children.push(data);
                }
                else {
                    logger.error("not equal");
                    logger.error(":" + hit._source.properties.accountId + ":");
                    logger.error(":" + accountId + ":");
                    logger.error(typeof hit._source.properties.accountId);
                    logger.error(typeof accountId);
                }
            }
        }

        return children;
    }

    async clearSearch() {
        try {
            let payload = {
                "command": "deleteIndex",
                "data": {
                    "index": "test"
                }

            };

            return await rest.postElastic(payload, this.importConfig, this.accessKeys);
        }
        catch (err) {
            logger.error ("error: " + err);
        }
    }

    /**
     * Query gremlin passing in a query object of the form:
     * 
     * {
        "command": "filterNodes",
        "data": {
            "resourceType": "AWS::ElasticLoadBalancingV2::LoadBalancer"
        }
    }
     * 
     * @param {*} query 
     */
    async queryGremlin(query) {
        try {
            return await rest.postGremlin(query, this.importConfig, this.accessKeys);
        }
        catch (error) {
            zoomUtils.dumpError(error);
            return {
                success: false
            }
        }
    }

    async deleteNodes() {
        let inNeptuneKeys = [...this.inNeptune.keys(this.inNeptune)];

        let nodesToBeDeleted = inNeptuneKeys.filter(node => {
            return this.nodesProcessed.get(node) === undefined ? true : false;
        });

        logger.info("Deleted Nodes=");
        logger.info(nodesToBeDeleted);

        if (nodesToBeDeleted.length > 0) {
            // These nodes have been removed from config or api so hard delete them.
            await this.performDelete(nodesToBeDeleted, "delete");
        }
    }
}

module.exports = DataClient;
