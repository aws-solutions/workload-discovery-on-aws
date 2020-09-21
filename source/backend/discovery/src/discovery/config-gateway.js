'use strict';

const zoomUtils = require('./zoomUtils');
const util = require('util');

/**
 * Class containing functionality to interact with the AWS Config Service.
 */
class ConfigGateway {

  /**
   * Create a new ConfigGateway.
   *
   * @param configService {Object} service interface for the Config Service.
   * @param configAggregator {string} name of existing Configuration Aggregator.
   */
  constructor(configService, configAggregator) {
    this.configService = configService;
    this.configAggregator = configAggregator;
  }

  /**
   * List discovered resources for an existing Configuration Aggregator.
   *
   * @param resourceType {string} the resource type to discover resources for.
   * @returns {Promise<PromiseResult<D, E>>} containing a list of discovered resources or an error.
   */
  async listDiscoveredResources(resourceType, accountId, region) {
    return await zoomUtils.callAwsApiWithPagination(
      this.configService.listAggregateDiscoveredResources, {
        Limit: 50,
        ConfigurationAggregatorName: this.configAggregator,
        "Filters": {
          "AccountId": "" + accountId,
          "Region": region
        },
        ResourceType: resourceType
      }, 
      this.configService,
      undefined,
      "Config-Gatway listAggregateDiscoveredResources");
  }

  /**r
   * Obtain the configuration for a specified resource.
   *
   * @param resourceId {string}
   * @param resourceType {string}
   * @param accountId {string}
   * @param region {string}
   * @returns {Promise<PromiseResult<D, E>>}
   */
  async getResourceConfig(resourceId, resourceType, accountId, region) {
    const params = {
      ConfigurationAggregatorName: this.configAggregator,
      ResourceIdentifier: {
        ResourceId: resourceId,
        ResourceType: resourceType,
        SourceAccountId: accountId,
        SourceRegion: region
      }
    };

    return await zoomUtils.callAwsApi(this.configService.getAggregateResourceConfig, params, this.configService, "Config-Gateway getAggregateResourceConfig");
  };
}

module.exports = ConfigGateway;
