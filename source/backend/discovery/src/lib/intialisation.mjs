// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import logger from './logger.mjs';
import {createApiClient} from './apiClient/index.mjs';
import {
    AggregatorNotFoundError,
    OrgAggregatorValidationError,
    RequiredServicesTimeoutError,
} from './errors.mjs';
import {
    AWS_ORGANIZATIONS,
    ECS,
    WORKLOAD_DISCOVERY_TASKGROUP,
    TASK_DEFINITION,
    DISCOVERY_PROCESS_RUNNING,
} from './constants.mjs'
import {createArn, profileAsync} from './utils.mjs';
import {PromisePool} from '@supercharge/promise-pool';

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

async function validateWdAccountVpcConfiguration(awsClient, {isUsingOrganizations, vpcId, region, graphgQlUrl}) {
    const ec2Client = awsClient.createEc2Client();

    const natGateways = await ec2Client.getNatGateways(vpcId)
        .catch(err => {
            // We don't throw here because we still want to do other connection checks to the required
            // AWS services: this error will caught again when we test the ability to route to EC2
            if (err.name === 'TimeoutError') {
                logger.error(`Failed to list NAT Gateways in ${vpcId}. The discovery process must be able to route to the public internet to function correctly.`);
                return [];
            }
            throw err;
        });

    if (!R.isEmpty(natGateways)) {
        logger.info(`The VPC has ${natGateways.length} NAT Gateway(s).`, {
            natGateways: natGateways.map(x => x.NatGatewayId),
        });
    }

    logger.info('Verifying VPC connectivity to required AWS services and API endpoints.');

    const requiredAwsGlobalServiceUrls = [
        {url: 'https://iam.amazonaws.com/?Action=ListUsers&Version=2010-05-08', service: 'IAM'},
    ];

    if (isUsingOrganizations) {
        requiredAwsGlobalServiceUrls.push({
            url: 'https://organizations.us-east-1.amazonaws.com/?Action=ListAccounts',
            service: 'AWS Organizations',
        });
    }

    const requiredAwsRegionalServiceUrls = [
        {url: `https://sts.${region}.amazonaws.com/?Action=GetCallerIdentity`, service: 'STS'},
        {
            url: `https://config.${region}.amazonaws.com/?Action=DescribeConfigurationRecorders`,
            service: 'AWS Config',
        },
        {url: `https://apigateway.${region}.amazonaws.com/restapis`, service: 'API Gateway'},
        {url: `https://dynamodb.${region}.amazonaws.com/?Action=ListTables`, service: 'DynamoDB'},
        {url: `https://ec2.${region}.amazonaws.com/?Action=DescribeInstances`, service: 'EC2'},
        {url: `https://ecs.${region}.amazonaws.com/?Action=ListClusters`, service: 'ECS'},
        {
            url: `https://elasticloadbalancing.${region}.amazonaws.com/?Action=DescribeLoadBalancers`,
            service: 'ELB',
        },
        {url: `https://eks.${region}.amazonaws.com/?Action=ListClusters`, service: 'EKS'},
        {url: `https://lambda.${region}.amazonaws.com/?Action=ListFunctions`, service: 'Lambda'},
        {
            url: `https://mediaconnect.${region}.amazonaws.com/?Action=ListFlows`,
            service: 'MediaConnect',
        },
        {url: `https://es.${region}.amazonaws.com/?Action=ListDomainNames1`, service: 'OpenSearch'},
        {url: `https://sns.${region}.amazonaws.com/?Action=ListTopics`, service: 'SNS'},
        {
            url: `https://servicecatalog-appregistry.${region}.amazonaws.com/?Action=ListApplications`,
            service: 'Service Catalog App Registry',
        },
        {
            url: `https://logs.${region}.amazonaws.com/?Action=DescribeLogGroups`,
            service: 'CloudWatch',
        },
        {url: graphgQlUrl, service: 'AppSync API'},
    ];

    const {errors} = await PromisePool
        .withConcurrency(10)
        .for([
            ...requiredAwsRegionalServiceUrls,
            ...requiredAwsGlobalServiceUrls,
        ])
        .process(async ({url}) => {
            return fetch(url, {signal: AbortSignal.timeout(5000)});
        });

    const timeoutErrors = errors.filter(error => error.raw.name === 'TimeoutError');

    if (timeoutErrors.length > 0) {
        timeoutErrors.forEach(error => {
            logger.error(`Could not connect to ${error.item.service} API.`);
        });
        throw new RequiredServicesTimeoutError(timeoutErrors.map(error => error.item.service));
    }
}

export async function initialise(awsClient, appSync, config) {
    logger.info('Initialising discovery process');
    const {region, rootAccountId, configAggregator: configAggregatorName, crossAccountDiscovery} = config;

    await validateWdAccountVpcConfiguration(awsClient, config);

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
