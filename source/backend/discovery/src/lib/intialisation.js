// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {createArn} = require('./utils');
const {ECS, AWS, PERSPECTIVE, WORKLOAD_DISCOVERY_TASKGROUP, TASK_DEFINITION, DISCOVERY_ROLE_NAME, ACCESS_DENIED} = require('./constants')
const logger = require('./logger');
const R = require("ramda");
const {createApiClient} = require("./apiClient");

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

async function createAccountsMap(awsClient, rootAccountId, accounts) {
    const {getCredentials} = awsClient.createStsClient();

    return Promise.resolve(accounts)
        .then(R.map(async ({accountId, regions}) => {
            const role = `arn:aws:iam::${accountId}:role/${DISCOVERY_ROLE_NAME}-${rootAccountId}`;
            return getCredentials(role)
                .then(credentials => {
                    return {
                        accountId,
                        regions: regions.map(x => x.name),
                        credentials
                    }
                })
                .catch(err => {
                    if (err.Code === ACCESS_DENIED) {
                        logger.error(`Access denied assuming role: ${role}. Ensure it has been deployed to account: ${accountId}.`);
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
        const {region, rootAccountId} = config;
        const stsClient = awsClient.createStsClient();

        const credentials = await stsClient.getCurrentCredentials();

        const ecsClient = awsClient.createEcsClient(credentials, region);
        const taskDefinitionArn = createArn({service: ECS, region, accountId: rootAccountId, resource: `${TASK_DEFINITION}/${WORKLOAD_DISCOVERY_TASKGROUP}`});

        if (await isDiscoveryEcsTaskRunning(ecsClient, taskDefinitionArn, config)) {
            throw new Error('Discovery process ECS task is already running in cluster.');
        }

        const configServiceClient = awsClient.createConfigServiceClient(credentials, region)

        const appSyncClient = appSync({...config, creds: credentials});
        const apiClient = createApiClient(appSyncClient);

        const {getAccounts} = appSyncClient;
        const accounts = await getAccounts();

        if(R.isEmpty(accounts)) throw new Error('No accounts to scan');

        const accountsMap = await createAccountsMap(awsClient, rootAccountId, accounts);

        logger.profile('Time to initialise');
        return {
            accountsMap,
            apiClient,
            configServiceClient
        };
    }
}

