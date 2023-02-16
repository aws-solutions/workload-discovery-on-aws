// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require("ramda");
const logger = require('./logger');
const {createApiClient} = require("./apiClient");
const {parse: parseArn} = require("@aws-sdk/util-arn-parser");
const {PromisePool} = require("@supercharge/promise-pool");
const {
    ECS,
    IAM,
    ROLE,
    WORKLOAD_DISCOVERY_TASKGROUP,
    TASK_DEFINITION,
    DISCOVERY_PROCESS_RUNNING,
    DISCOVERY_ROLE_NAME,
    NO_ACCOUNTS_TO_DISCOVER,
    ACCESS_DENIED
} = require('./constants')
const {createArn, profileAsync} = require('./utils');

async function isDiscoveryEcsTaskRunning (ecsClient, taskDefinitionArn, {cluster}) {
    const tasks = await ecsClient.getAllClusterTasks(cluster)
        .then(R.filter(task => {
            // The number after the last colon in the ARN is the version of the task definition. We strip it out
            // as we can't know what number it will be. Furthermore, it's not relevant as we just need to know if
            // there's another discovery task potentially writing to the DB.
            return task.taskDefinitionArn.slice(0, task.taskDefinitionArn.lastIndexOf(':')) === taskDefinitionArn;
        }));

    logger.debug('Discovery ECS tasks currently running:', {tasks});

    return tasks.length > 1;
}

async function getAccounts(
    {ec2Client, organizationsClient, configClient}, appSyncClient, {credentials, region}, {configAggregator, isUsingOrganizations}
) {
    if(!isUsingOrganizations) {
        return appSyncClient.getAccounts();
    }

    const [{Arn: managementAccountArn}, dbAccounts, orgAccounts, {OrganizationAggregationSource}, regions] = await Promise.all([
        organizationsClient.getRootAccount(),
        appSyncClient.getAccounts(),
        organizationsClient.getAllAccounts(),
        configClient.getConfigAggregator(configAggregator),
        ec2Client.getAllRegions()
    ]);

    const dbAccountsMap = new Map(dbAccounts.map(x => [x.accountId, x]))

    const managementAccountId = parseArn(managementAccountArn).accountId;

    return orgAccounts.map(({Id, Name: name, Arn}) => {
        const [, organizationId] = parseArn(Arn).resource.split('/');
        const lastCrawled = dbAccountsMap.get(Id)?.lastCrawled;
        return {
            accountId: Id,
            organizationId,
            name,
            ...(managementAccountId === Id ? {isManagementAccount: true} : {}),
            ...(lastCrawled != null ? {lastCrawled} : {}),
            regions: OrganizationAggregationSource.AllAwsRegions
                ? regions : OrganizationAggregationSource.AwsRegions
        };
    });
}

function createDiscoveryRoleArn(accountId, rootAccountId) {
    return createArn({service: IAM, accountId, resource: `${ROLE}/${DISCOVERY_ROLE_NAME}-${rootAccountId}`});
}

const addAccountCredentials = R.curry(async ({stsClient}, rootAccountId, accounts) => {
    const {errors, results} = await PromisePool
        .withConcurrency(30)
        .for(accounts)
        .process(async ({accountId, organizationId, ...props}) => {
            const roleArn = createDiscoveryRoleArn(accountId, rootAccountId);
            const credentials = await stsClient.getCredentials(roleArn);
            return {
                ...props,
                accountId,
                isIamRoleDeployed: true,
                ...(organizationId != null ? {organizationId} : {}),
                credentials
            };
        });

    errors.forEach(({message, raw: error, item: {accountId, isManagementAccount}}) => {
        const roleArn = createDiscoveryRoleArn(accountId, rootAccountId);
        if (error.Code === ACCESS_DENIED) {
            const errorMessage = `Access denied assuming role: ${roleArn}.`;
            if(isManagementAccount) {
                logger.error(`${errorMessage} This is the management account, ensure the global resources template has been deployed to the account.`);
            } else {
                logger.error(`${errorMessage} Ensure the global resources template has been deployed to account: ${accountId}. The discovery for this account will be skipped.`);
            }
        } else {
            logger.error(`Error assuming role: ${roleArn}: ${message}`);
        }
    });

    return [
        ...errors.filter(({raw}) => raw.Code === ACCESS_DENIED).map(({item}) => ({...item, isIamRoleDeployed: false})),
        ...results,
    ];
});

async function initialise(awsClient, appSync, config) {
    logger.info('Initialising discovery process');
    const {region, rootAccountId} = config;

    const stsClient = awsClient.createStsClient();

    const credentials = await stsClient.getCurrentCredentials();

    const ecsClient = awsClient.createEcsClient(credentials, region);
    const taskDefinitionArn = createArn({service: ECS, region, accountId: rootAccountId, resource: `${TASK_DEFINITION}/${WORKLOAD_DISCOVERY_TASKGROUP}`});

    const ec2Client = awsClient.createEc2Client(credentials, region);
    const organizationsClient = awsClient.createOrganizationsClient(credentials, region);
    const configClient = awsClient.createConfigServiceClient(credentials, region);

    if (await isDiscoveryEcsTaskRunning(ecsClient, taskDefinitionArn, config)) {
        throw new Error(DISCOVERY_PROCESS_RUNNING);
    }

    const configServiceClient = awsClient.createConfigServiceClient(credentials, region)

    const appSyncClient = appSync({...config, creds: credentials});
    const apiClient = createApiClient(appSyncClient);

    const accounts = await getAccounts({ec2Client, organizationsClient, configClient}, appSyncClient, credentials, config)
        .then(R.map(R.evolve({regions: R.map(x => x.name)})))
        .then(addAccountCredentials({stsClient}, rootAccountId));

    if(R.isEmpty(accounts.filter(x => x.isIamRoleDeployed))) throw new Error(NO_ACCOUNTS_TO_DISCOVER);

    return {
        accounts,
        apiClient,
        configServiceClient
    };
}

module.exports = {
    initialise: profileAsync('Time to initialise', initialise)
}

