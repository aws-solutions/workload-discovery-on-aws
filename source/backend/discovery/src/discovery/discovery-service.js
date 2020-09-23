"use strict";

const logger = require('./logger');
const zoomUtils = require('./zoomUtils');
const R = require('ramda');

// Volumes seem flaky in config advanced query so added them to list
const advancedQueryUnsupported = ["AWS::KMS::Key", "AWS::Elasticsearch::Domain", "AWS::ApiGateway::RestApi", "AWS::ApiGatewayV2::Api",
  "AWS::EC2::Volume"];

/**
 * Service responsible for discovering Architectural components for a specific resource.
 */
class DiscoveryService {

  constructor(configGateway, accountId, dataClient, visitedMap) {
    this.configGateway = configGateway;
    this.accountId = accountId;
    this.dataClient = dataClient;
    this.visitedMap = visitedMap;
    this.tags = new Map();
    this.linked = new Map();
  }

  /**
   * Use aws config to discover the main resources.
   * @param {*} region 
   */
  async findRelationships(accountId, region) {
    const resourcesToScan = [
      "AWS::IAM::Policy",
      "AWS::IAM::User",
      "AWS::IAM::Role",
      "AWS::EC2::VPC",
      "AWS::EC2::Instance",
      "AWS::EC2::Volume",
      "AWS::RDS::DBInstance",
      "AWS::EC2::NetworkInterface",
      "AWS::Lambda::Function",
      "AWS::S3::Bucket",
      "AWS::DynamoDB::Table",
      "AWS::CloudFormation::Stack",
      "AWS::CloudWatch::Alarm",
      "AWS::EC2::SecurityGroup",
      "AWS::EC2::EIP",
      "AWS::ElasticLoadBalancing::LoadBalancer",
      "AWS::ElasticLoadBalancingV2::LoadBalancer",
      "AWS::AutoScaling::AutoScalingGroup",
      "AWS::EC2::NatGateway",
      "AWS::Elasticsearch::Domain",
      "AWS::KMS::Key",
      "AWS::CodeBuild::Project",
      "AWS::CodePipeline::Pipeline",
      "AWS::SQS::Queue"
    ];

    // Scan in all resources in parallel
    await Promise.all(resourcesToScan.map(key => {
      return this.runScan(key, accountId, region);
    }));
  }

  async runScan(key, accountId, region) {
    try {
      let discoveredResources = await this.configGateway.listDiscoveredResources(key, accountId, region);
      let resources = await this.getResourceType(discoveredResources);
      await this.dataClient.storeData(key, resources, 0);
    } catch (error) {
      logger.error(`findRelationshipsError: Key ${key} Error: ${error}`);
    }
  }

  async getResourceType(resources) {
    let allResourceTypes = [];

    if (resources && resources.ResourceIdentifiers && resources.ResourceIdentifiers.length > 0) {
      for (let resource of resources.ResourceIdentifiers) {
        try {
          let configData = await this.getResource(resource.ResourceId,
            resource.ResourceType,
            resource.SourceAccountId,
            resource.SourceRegion, 0, []);

          if (configData) {
            allResourceTypes.push(configData);
          }
        } catch (err) {
          zoomUtils.dumpError(err);
        }
      }
    }

    return allResourceTypes;
  }

  async getResource(resourceId, resourceType, accountId, region, depth, extrasToStore) {
    let resource = this.visitedMap.get(resourceId);
    if (resource === undefined) {
      // As code is running in promises so need to close off the posibility of two promises scanning the same resource.  Hence adding an inProgress to the visited map.
      this.visitedMap.set(resourceId, "inProgress");

      // When discovery first starts it gets an ICL (Intial Client Load) from neptune of all existing resources.
      let icl = this.dataClient.resourceIdIndex.get(resourceId);
      let recentlyUpdated = this.dataClient.updatedResources.get(resourceId);

      if (advancedQueryUnsupported.includes(resourceType) || (icl && recentlyUpdated) || (!icl)) {
        return await this.getDataFromConfig(resourceId, resourceType, accountId, region, depth, extrasToStore);
      }
      else if (resource === "inProgress") {
        logger.info("Another process is scanning " + resourceId);
        return;
      }
      else if (icl) {
        return await this.getDataFromICL(icl, resourceId, accountId, region, depth, extrasToStore);
      }
    }
    else {
      return resource;
    }
  }

  async getDataFromConfig(resourceId, resourceType, accountId, region, depth, extrasToStore) {
    let configData = await this.getConfiguration(resourceId, resourceType, accountId, region);

    if (configData) {
      let data = this.createDataObject(configData, extrasToStore);

      // set once to stop infinite searching.
      this.visitedMap.set(resourceId, data);

      if (data.resourceType === "AWS::EC2::VPC") {
        extrasToStore = this.addExtraData({ key: "vpcId", value: data.resourceId }, extrasToStore);
      }

      let children = [];
      await this.processExtras(data.properties, children, accountId);
      await this.processConfigurationChildren(data, accountId, region, depth, extrasToStore, children);
      data.children = children;
      delete data.relationships;
      return data;
    }

    return undefined;
  }

  async getConfiguration(resourceId, resourceType, accountId, region) {
    return await this.configGateway.getResourceConfig(resourceId, resourceType, accountId, region);
  }

  async processConfigurationChildren(data, accountId, region, depth, extrasToStore, children){
    for (let resource of data.relationships) {
      if (resource.resourceId) {
        await this.handleChildResources(resource, accountId, region, depth, extrasToStore, children);
      }
      // roles don't have a resourceId
      else {
        logger.info("handleNoResourceId");
        logger.info(resource);
        await this.handleNoResourceId(resource, accountId, children, resource.resourceType);
      }
    }
  }

  async getDataFromICL(icl, resourceId, accountId, region, depth, extrasToStore) {
    let children = [];
    this.visitedMap.set(resourceId, icl);

    // Stop node from being deleted unless it is not in config
    if (this.dataClient.allNodesInConfig.get(resourceId)) {
      this.dataClient.nodesProcessed.set(icl.id, icl);
    }

    this.preventTagsFromBeingDeleted(icl);
    await this.processICLChildren(icl, accountId, region, depth, extrasToStore, children);

    icl.children = children;
    delete icl.relationships;
    return icl;
  }

  async processICLChildren(icl, accountId, region, depth, extrasToStore, children){
    if (icl.properties.relationships && icl.properties.relationships.length > 0) {
      let relationShips = JSON.parse(icl.properties.relationships);

      if (relationShips) {
        for (let resource of relationShips) {
          if (!resource.resourceId && resource.resourceName) {
            resource.resourceId = resource.resourceName;
          }

          await this.handleChildResources(resource, accountId, region, depth, extrasToStore, children);
        }
      }
    }
  }

  // Tag nodes are auto generated from the data.  Therefore when loading from an ICL 
  // we need to reprocess them and add them to the nodesProcessed map so that they are 
  // not deleted.
  preventTagsFromBeingDeleted(icl) {
    let tags = this.dataClient.processTags(icl);

    if (tags) {
      tags.forEach(tag => {
        let hash = this.dataClient.hashNode(tag);
        this.dataClient.nodesProcessed.set(hash, "");
      });
    }
  }

  async handleChildResources(resource, accountId, region, depth, extrasToStore, children) {
    // Recursive get the resources of this resource.
    try {
      let child = await this.getResource(resource.resourceId, resource.resourceType, accountId, region, ++depth, extrasToStore);

      if (child) {
        delete child.relationships;
        children.push(R.clone(child));
      }
    } catch (Error) {
      zoomUtils.dumpError(Error);
    }
  }

  async handleNoResourceId(resource, accountId, children, type) {
    logger.info("handling no resourceId: " + resource.resourceName);

    //Look-up the role and attach to existing role (roles are one of the first categories to be discovered)
    const query = {
      "query": {
        "bool": {
          "must": [{
            "term": {
              "properties.resourceType.keyword": type
            }
          },
          {
            "term": {
              "properties.resourceName.keyword": resource.resourceName
            }
          },
          {
            "term": {
              "properties.parsedArn.accountId.keyword": accountId
            }
          }
          ]
        }
      }
    };

    let result = await this.dataClient.advancedSearch(query);
    let processedResult = this.dataClient.processSearchResult(result, accountId);

    logger.info("ProcessedResult:");
    logger.info(processedResult);

    if (processedResult) {
      children.push(R.clone(processedResult));
    }
    else {
      logger.info("handleStrangeRoleResources: Could not find role" + resource.resourceName);
    }
  }

  createDataObject(configData, extrasToStore) {
    let data = {
      resourceId: configData.ConfigurationItem.resourceId,
      resourceType: configData.ConfigurationItem.resourceType,
      accountId: configData.ConfigurationItem.accountId,
      arn: configData.ConfigurationItem.arn,
      relationships: configData.ConfigurationItem.relationships,
      properties: configData.ConfigurationItem,
    };

    data = this.dataClient.formatNode(data);

    extrasToStore.forEach(extras => {
      data.properties[extras.key] = extras.value;
    });

    // store the relationships as json.
    data.properties.relationships = JSON.stringify(data.properties.relationships);

    return data;
  }

  addExtraData(data, extraData) {
    // remove duplicate keys as we move throughout the recursion. 
    extraData = extraData.filter(extra => {
      return extra.key !== data.key && extra.value !== data.value;
    });

    extraData.push(data);
    return extraData;
  }

  /**
   * Process any extra links like IAM roles or environment variables
   * @param {*} data 
   * @param {*} children 
   */
  async processExtras(data, children, accountId) {
    let keys = Object.keys(data);

    for (let key of keys) {
      switch (key) {
        case "iamInstanceProfile":
          await this.processIamInstanceProfile(data[key], children, accountId)
          break;
        default:
      }
    }
  }

  /**
   * Create a link to any IAM roles.
   * @param {*} iam 
   * @param {*} children 
   */
  async processIamInstanceProfile(iam, children, accountId) {
    if (iam !== null && iam.arn) {
      let result = await this.dataClient.search(iam.arn);

      let processedResult = this.dataClient.processSearchResult(result, accountId);

      if (processedResult) {
        children.push(processedResult);
      }
    }
  }

  resourcesLinked(resourceId, child) {
    let a = this.exists(resourceId, child);
    let b = this.exists(child, resourceId);
    return a || b;
  }

  exists(id1, id2) {
    if (id1 === id2) {
      return true;
    }

    let temp = this.linked.get(id1);

    if (temp === undefined) {
      this.linked.set(id1, id2);
      return false;
    }

    else if (temp === id2) {
      return true;
    }

    return false;
  }
}

module.exports = DiscoveryService;