#!/usr/bin/env node

const AWS = require('aws-sdk');
const sts = new AWS.STS();
const getCreds = require('@aws-sdk/credential-provider-node').defaultProvider();

const logger = require('./logger');
const config = require('./config');
const db = require('./db');
const appSync = require('./appSync');
const discoveryConfig = require('./discoveryConfig');
const DiscoveryService = require('./discovery-service');
const ConfigGateway = require('./config-gateway');
const ApiGateway = require('./api-gateway');
const DataClient = require('./dataClient');
const LoadBalancerV2 = require('./load-balancer-v2');
const LoadBalancer = require('./load-balancer');
const AutoScalingGroup = require('./autoScalingGroups');
const LambdaLinks = require('./lamdbda-links');
const RDSCluster = require('./rdsCluster');
const VPCEndpoint = require('./vpcEndpoints');
const login = require('./awsLogin');
const ENILinks = require('./eni-links');
const ECS = require('./ecs');
const TaskDefinitionLinks = require('./taskDefinition-links');
const GetAccountAuthorizationDetails = require('./getAccountAuthorizationDetails');
const PolicyAccountAuthorizationDetails = require('./policyAccountAuthorizationDetails');
const UserPolicies = require('./userPolicies');
const RoleAccountAuthorizationDetails = require('./roleAccountAuthorizationDetails');
const Spot = require('./spot');
const ZoomUtils = require('./zoomUtils');
const RouteTables = require('./routeTables');
const UpdatedResources = require('./updatedResources');

const discover = async () => {

  logger.profile('Discover Process');

  const containerCreds = await getCreds();
  const settingsApi = appSync({...config, creds: containerCreds});
  //await settingsApi.updateAccount(config.rootAccountId, new Date().toISOString());
  const {bootStrap, canImportRun} = discoveryConfig(settingsApi, config);

  //Bootstrap the import
  const configuration = await bootStrap();

  if (!await canImportRun()) {
    logger.info("Stopping import as import is already running.");
    return;
  }
  else {
    logger.info("No duplicate tasks found so allowing discovery to run.")
  }

  // We have to access the db directly rather than through the API because of lambda
  // payload limits when the number of resources gets large.
  const {loadPreviouslyPersisted} = db({
    ...containerCreds,
    url: process.env.NEPTUNE_URL,
    port: process.env.NEPTUNE_PORT,
  });

  logger.info('Loading previously discovered resources');
  const cache = await loadPreviouslyPersisted();
  //const cache = {};

  const { Credentials: creds } = await sts.assumeRole({
    RoleArn: `${configuration.rootAccountRole}`,
    RoleSessionName: 'discovery'
  }
  ).promise();

  let updatedResources = new UpdatedResources();
  let updates = await updatedResources.buildRecentlyChanged(configuration);

  const dataClient = new DataClient(configuration,
      { accessKeyId: creds.AccessKeyId, secretAccessKey: creds.SecretAccessKey, sessionToken: creds.SessionToken },
      updates, {cache});

  // Import data
  await importConfigAggregatorData(configuration, dataClient, creds);
  await importAPIData(settingsApi, configuration, dataClient);

  // Delete nodes which have not been discovered or added.
  await dataClient.deleteNodes();

  logger.profile('Discover Process');
};

/**
 * Import the data from the config aggregator.  Run each job in parrallel for speed !
 * @param {*} configuration
 * @param {*} dataClient
 * @param {*} credentials
 */
const importConfigAggregatorData = async ({accounts, configAggregator}, dataClient, creds) => {

  let visitedMap = new Map();
  let awsConfigJobs = [];

  for (let account of accounts) {
    for (let region of account.regions) {
      awsConfigJobs.push(
        importAwsConfig(account.accountId, region.name, configAggregator, dataClient, creds, visitedMap));
    }
  }

  await Promise.all(awsConfigJobs);
};

const importAwsConfig = async (accountId, region, configAggregator, dataClient, creds, visitedMap) => {
  logger.info(`>>>>>>>>>> importing config from region: ${region} configAggregator ${configAggregator}`);
  try {
    const awsCreds = new AWS.Credentials(creds.AccessKeyId, creds.SecretAccessKey, creds.SessionToken);

    const configservice = new AWS.ConfigService({ credentials: awsCreds });
    const configGateway = new ConfigGateway(configservice, configAggregator);
    const discoveryService = new DiscoveryService(configGateway, accountId, dataClient, visitedMap);
    await discoveryService.findRelationships(accountId, region, dataClient);
  }
  catch (Error) {
    logger.error(`error importing config from account: ${accountId} region: ${region}: ` + Error);
  }
  finally {
    logger.info(`<<<<<<<<<< import of config complete for account: ${accountId} region: ${region} finished!`);
  }
};

// Call GetAccountAuthorizationDetails to store AWSManaged Roles and Policies
const importAccountAuthorisationDetails = async (awsCreds, dataClient) => {
  logger.info("importAccountAuthorisationDetails");
  const authorizationDetails = new GetAccountAuthorizationDetails(() => { return new AWS.IAM({ credentials: awsCreds, region: "Global" }) }, dataClient);
  await ZoomUtils.wrapOutput(authorizationDetails.discover, ["AWSManagedPolicy"], authorizationDetails);
};

async function importAPIData(settingsApi, {accounts, rootAccountId, rootAccountRole}, dataClient) {
  return Promise.all(accounts.map(async account => {
    try {
      const role = account.accountId === rootAccountId ? rootAccountRole :
          `arn:aws:iam::${account.accountId}:role/ZoomDiscoveryRole`;

      logger.info("Main account = ", rootAccountRole);
      logger.info("Account being imported");
      logger.info(account);

      let creds = await login.login(role);

      await importAccountAuthorisationDetails(creds, dataClient);
      await linkRolesAndPolicies(account, dataClient);

      await Promise.all(account.regions.map(async region => {
        await callAPIDiscovery(creds, account.accountId, region.name, dataClient);
        return settingsApi.updateRegions(account.accountId, [
          {
            name: region.name,
            lastCrawled: new Date().toISOString()
          }
        ]);
      }));

      return settingsApi.updateAccount(account.accountId, new Date().toISOString());
    } catch (err) {
      logger.error(`Import api data failed for account ${account.accountId}: Error was ${err}`);
      ZoomUtils.dumpError(err);
    }
  }))
}

const linkRolesAndPolicies = async (account, dataClient) => {
  logger.info('linkRolesAndPolicies');
  const localPolicyAccountAuthorizationDetails = new PolicyAccountAuthorizationDetails(dataClient);
  await ZoomUtils.wrapOutput(localPolicyAccountAuthorizationDetails.discover, [account.accountId, "global"], localPolicyAccountAuthorizationDetails);

  const localRoleAccountAuthorizationDetails = new RoleAccountAuthorizationDetails(dataClient);
  await ZoomUtils.wrapOutput(localRoleAccountAuthorizationDetails.discover, [account.accountId, "global"], localRoleAccountAuthorizationDetails);

  // Link users to roles and policies.
  const userPolicies = new UserPolicies(dataClient);
  await ZoomUtils.wrapOutput(userPolicies.discover, [account.accountId], userPolicies);
};

const callAPIDiscovery = async (awsCreds, accountId, region, dataClient) => {
  logger.info(`importing API data from account: ${accountId} region: ${region}`);

  try {
    let loadBalancerV2 = new LoadBalancerV2(() => { return new AWS.ELBv2({ apiVersion: '2015-12-01', credentials: awsCreds, region: region }) }, dataClient);
    let loadBalancer = new LoadBalancer(() => { return new AWS.ELB({ apiVersion: '2012-06-01', credentials: awsCreds, region: region }) }, dataClient);
    let apiGateway = new ApiGateway(() => { return new AWS.APIGateway({ apiVersion: '2015/07/09', credentials: awsCreds, region: region }) }, dataClient);
    let autoScalingGroup = new AutoScalingGroup(() => { return new AWS.AutoScaling({ credentials: awsCreds, region: region }) }, dataClient);
    let rdsCluster = new RDSCluster(() => { return new AWS.RDS({ credentials: awsCreds, region: region }) }, dataClient);
    let lambdaLinks = new LambdaLinks(() => { return new AWS.Lambda({ credentials: awsCreds, region: region }) }, dataClient);
    let vpcEndpoint = new VPCEndpoint(() => { return new AWS.EC2({ credentials: awsCreds, region: region }) }, dataClient);
    let eniLinks = new ENILinks(() => { return new AWS.Lambda({ credentials: awsCreds, region: region }) }, dataClient);
    let ecs = new ECS(() => { return new AWS.ECS({ credentials: awsCreds, region: region }) }, dataClient);
    let taskDefinitionLinks = new TaskDefinitionLinks(dataClient);
    let spot = new Spot(() => { return new AWS.EC2({ credentials: awsCreds, region: region }) }, dataClient);
    let routeTables = new RouteTables(dataClient);

    await ZoomUtils.wrapOutput(loadBalancerV2.discover, [accountId, region], loadBalancerV2);
    await ZoomUtils.wrapOutput(loadBalancer.discover, [accountId, region], loadBalancer);
    await ZoomUtils.wrapOutput(apiGateway.discover, [accountId, region], apiGateway);
    await ZoomUtils.wrapOutput(autoScalingGroup.discover, [accountId, region], autoScalingGroup);
    await ZoomUtils.wrapOutput(rdsCluster.discover, [accountId, region], rdsCluster);
    await ZoomUtils.wrapOutput(lambdaLinks.discover, [accountId, region], lambdaLinks);
    await ZoomUtils.wrapOutput(vpcEndpoint.discover, [accountId, region], vpcEndpoint);
    await ZoomUtils.wrapOutput(eniLinks.discover, [accountId, region], eniLinks);
    await ZoomUtils.wrapOutput(ecs.discover, [accountId, region], ecs);
    await ZoomUtils.wrapOutput(taskDefinitionLinks.discover, [accountId, region], taskDefinitionLinks);
    await ZoomUtils.wrapOutput(spot.discover, [accountId, region], spot);
    await ZoomUtils.wrapOutput(routeTables.discover, [accountId, region], routeTables);
  }
  catch (err) {
    logger.error(`error importing API data from account: ${accountId} region: ${region}: ` + err);
    ZoomUtils.dumpError(err);
  }
};

discover();