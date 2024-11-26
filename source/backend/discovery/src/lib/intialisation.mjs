// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import logger from './logger.mjs';
import {createApiClient} from "./apiClient/index.mjs";
import {AggregatorNotFoundError, OrgAggregatorValidationError} from './errors.mjs';
import {
    AWS_ORGANIZATIONS,
    ECS,
    WORKLOAD_DISCOVERY_TASKGROUP,
    TASK_DEFINITION,
    DISCOVERY_PROCESS_RUNNING,
} from './constants.mjs'
import {createArn, profileAsync} from './utils.mjs';

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

async function validateOrgAggregator(configServiceClient, aggregatorName) {
    return configServiceClient.getConfigAggregator(aggregatorName)
        .catch(err => {
            if(err.name === 'NoSuchConfigurationAggregatorException') {
                throw new AggregatorNotFoundError(aggregatorName)
            }
            throw err;
        })
        .then(aggregator => {
            if(aggregator.OrganizationAggregationSource == null) throw new OrgAggregatorValidationError(aggregator);
        });
}

export async function initialise(awsClient, appSync, config) {
    logger.info('Initialising discovery process');
    const {region, rootAccountId, configAggregator: configAggregatorName, crossAccountDiscovery} = config;

    const stsClient = awsClient.createStsClient();

    const credentials = await stsClient.getCurrentCredentials();

    const ecsClient = awsClient.createEcsClient(credentials, region);
    const taskDefinitionArn = createArn({service: ECS, region, accountId: rootAccountId, resource: `${TASK_DEFINITION}/${WORKLOAD_DISCOVERY_TASKGROUP}`});

    if (await isDiscoveryEcsTaskRunning(ecsClient, taskDefinitionArn, config)) {
        throw new Error(DISCOVERY_PROCESS_RUNNING);
    }

    const configServiceClient = awsClient.createConfigServiceClient(credentials, region);

    if(crossAccountDiscovery === AWS_ORGANIZATIONS) {
        await validateOrgAggregator(configServiceClient, configAggregatorName);
    }

    const appSyncClient = appSync({...config, creds: credentials});
    const apiClient = createApiClient(awsClient, appSyncClient, config);

    return {
        apiClient,
        configServiceClient
    };
}
