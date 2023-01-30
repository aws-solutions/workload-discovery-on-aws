// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require("ramda");
const logger = require('./logger');
const {createApiClient} = require("./apiClient");
const {parse: parseArn} = require("@aws-sdk/util-arn-parser");
const {
    AWS_ORGANIZATIONS,
    ECS,
    WORKLOAD_DISCOVERY_TASKGROUP,
    TASK_DEFINITION,
    DISCOVERY_ROLE_NAME,
    ACCESS_DENIED
} = require('./constants')
const {createArn} = require('./utils');

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

    const [{Arn: managementAccountArn}, orgAccounts, {OrganizationAggregationSource}, regions] = await Promise.all([
        organizationsClient.getRootAccount(),
        organizationsClient.getAllAccounts(),
        configClient.getConfigAggregator(configAggregator),
        ec2Client.getAllRegions()
    ]);

    const managementAccountId = parseArn(managementAccountArn).accountId;

    return orgAccounts.map(({Id, Name: name, Arn}) => {
        const [, organizationId] = parseArn(Arn).resource.split('/');
        return {
            accountId: Id,
            organizationId,
            isManagementAccount: managementAccountId === Id,
            name,
            regions: OrganizationAggregationSource.AllAwsRegions
                ? regions : OrganizationAggregationSource.AwsRegions
        }
    });
}

async function createAccountsMap({stsClient}, {rootAccountId, accounts}) {
    return Promise.resolve(accounts)
        .then(R.map(async ({accountId, name, organizationId, isManagementAccount, regions}) => {
            const role = `arn:aws:iam::${accountId}:role/${DISCOVERY_ROLE_NAME}-${rootAccountId}`;
            return stsClient.getCredentials(role)
                .then(credentials => {
                    return {
                        accountId,
                        name,
                        ...({organizationId} ?? {}),
                        regions: regions.map(x => x.name),
                        credentials
                    }
                })
                .catch(err => {
                    if (err.Code === ACCESS_DENIED) {
                        const errorMessage = `Access denied assuming role: ${role}.`;
                        if(isManagementAccount) {
                            logger.error(`${errorMessage} This is the Management account, discovering this account is currently not supported.`);
                        } else {
                            logger.error(`${errorMessage} Ensure it has been deployed to account: ${accountId}. The discovery for this account will be skipped.`);
                        }
                        return {};
                    }
                    throw err;
                })
        }))
        .then(ps => Promise.all(ps))
        .then(R.reject(R.isEmpty))
        .then(accounts => new Map(accounts.map(account => [account.accountId, account])))
}

module.exports = {
    async initialise(awsClient, appSync, config) {
        logger.info('Initialising discovery process');
        logger.profile('Time to initialise');
        const {region, rootAccountId, crossAccountDiscovery, configAggregator} = config;
        const isUsingOrganizations = crossAccountDiscovery === AWS_ORGANIZATIONS;

        const stsClient = awsClient.createStsClient();

        const credentials = await stsClient.getCurrentCredentials();

        const ecsClient = awsClient.createEcsClient(credentials, region);
        const taskDefinitionArn = createArn({service: ECS, region, accountId: rootAccountId, resource: `${TASK_DEFINITION}/${WORKLOAD_DISCOVERY_TASKGROUP}`});

        const ec2Client = awsClient.createEc2Client(credentials, region);
        const organizationsClient = awsClient.createOrganizationsClient(credentials, region);
        const configClient = awsClient.createConfigServiceClient(credentials, region);

        if (await isDiscoveryEcsTaskRunning(ecsClient, taskDefinitionArn, config)) {
            throw new Error('Discovery process ECS task is already running in cluster.');
        }

        const configServiceClient = awsClient.createConfigServiceClient(credentials, region)

        const appSyncClient = appSync({...config, creds: credentials});
        const apiClient = createApiClient(appSyncClient);

        const accounts = await getAccounts({
            ec2Client, organizationsClient, configClient}, appSyncClient, credentials, {isUsingOrganizations, configAggregator}
        );

        const accountsMap = await createAccountsMap({stsClient}, {rootAccountId, accounts});

        if(accountsMap.size === 0) throw new Error('No accounts to scan');

        logger.profile('Time to initialise');
        return {
            accountsMap,
            apiClient,
            configServiceClient
        };
    }
}

