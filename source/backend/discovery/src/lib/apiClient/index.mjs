// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import {PromisePool, PromisePoolError} from '@supercharge/promise-pool';
import {profileAsync, createArn} from '../utils.mjs';
import {UnprocessedOpenSearchResourcesError} from '../errors.mjs'
import logger from '../logger.mjs';
import {parse as parseArn} from '@aws-sdk/util-arn-parser';
import {
    ACCESS_DENIED,
    ACCESS_DENIED_EXCEPTION,
    IAM,
    ROLE,
    DISCOVERY_ROLE_NAME,
} from '../constants.mjs';

function getDbResourcesMap(appSync) {
    const {createPaginator, getResources} = appSync;
    const getResourcesPaginator = createPaginator(getResources, 1000);

    return async ({accounts} = {}) => {
        const resourcesMap = new Map();

        // if `accounts` is not specified we create a single paginator that will page through the results
        // serially, else we create a paginator per account and execute them concurrently up to the
        // limit defined for the promise pool
        const paginators = accounts == null ?
            [getResourcesPaginator({})] :
            accounts.map(({accountId}) => getResourcesPaginator({accounts: [{accountId}]}));

        await PromisePool
            .withConcurrency(20)
            .for(paginators)
            .handleError(async (error) => {
                logger.error(`There was a problem downloading accounts from Neptune: ${error}.`);
                throw error;
            })
            .process(async paginator => {
                for await (const resources of paginator) {
                    resources.forEach(r => resourcesMap.set(r.id, {
                        id: r.id,
                        label: r.label,
                        md5Hash: r.md5Hash,
                        // gql will return `null` for missing properties which will break the hashing
                        // comparison for sdk discovered resources
                        properties: R.reject(R.isNil, r.properties),
                    }));
                }
            });

        return resourcesMap;
    };
}

function getDbRelationshipsMap(appSync) {
    const pageSize = 2500;

    function getDbRelationships(pagination, relationshipsMap= new Map()) {
        return appSync.getRelationships({pagination})
            .then(relationships => {
                if(R.isEmpty(relationships)) return relationshipsMap;
                relationships.forEach(rel => {
                    const {id: source} = rel.source;
                    const {id: target} = rel.target;
                    const {label, id} = rel;
                    relationshipsMap.set(`${source}_${label}_${target}`, {
                        source, target, id, label
                    })
                });
                const {start, end} = pagination;
                return getDbRelationships({start: start + pageSize, end: end + pageSize}, relationshipsMap);
            })
    }

    return async () => getDbRelationships({start: 0, end: pageSize});
}

function process(processor) {
    return async ({concurrency, batchSize}, resources) => {
        const errors = [];
        const {results} = await PromisePool
            .withConcurrency(concurrency)
            .for(R.splitEvery(batchSize, resources))
            .handleError(async (error, batch) => {
                const failures = error instanceof UnprocessedOpenSearchResourcesError ? error.failures : batch;
                errors.push(new PromisePoolError(error, failures));
            })
            .process(processor);
        return {results, errors};
    }
}

function createResourceProcessor(openSearchMutation, neptuneMutation, errorMsg) {
    return async resources => {
        const {unprocessedResources: unprocessedResourceArns} = await openSearchMutation(resources)
        const unprocessedSet = new Set(unprocessedResourceArns);
        const [unprocessedResources, processedResources] = R.partition(x => unprocessedSet.has(x.id ?? x), resources);

        await neptuneMutation(processedResources)

        if(!R.isEmpty(unprocessedResources)) {
            logger.error(`${unprocessedResources.length} resources ${errorMsg}`, {unprocessedResources});
            throw new UnprocessedOpenSearchResourcesError(unprocessedResources);
        }
    }
}

function updateCrawledAccounts(appSync) {
    return async accounts => {
        const {errors, results} = await PromisePool
            .withConcurrency(10) // the reserved concurrency of the settings lambda is 10
            .for(accounts)
            .process(async ({accountId, name, isIamRoleDeployed, lastCrawled, resourcesRegionMetadata}) => {
                return appSync.updateAccount(
                    accountId,
                    name,
                    isIamRoleDeployed, isIamRoleDeployed ? new Date().toISOString() : lastCrawled,
                    resourcesRegionMetadata
                );
            });

        logger.error(`There were ${errors.length} errors when updating last crawled time for accounts.`);
        logger.debug('Errors: ', {errors});

        return {errors, results};
    }
}

function addCrawledAccounts(appSync) {
    return async accounts => {
        return Promise.resolve(accounts)
            // we must ensure we do not persist any temporary credentials to the db
            .then(R.map(R.omit(['credentials', 'toDelete'])))
            .then(R.map(({regions, isIamRoleDeployed, lastCrawled, ...props}) => {
                return {
                    ...props,
                    isIamRoleDeployed,
                    regions: regions.map(R.omit(['isConfigEnabled'])),
                    lastCrawled: isIamRoleDeployed ? new Date().toISOString() : lastCrawled
                }
            }))
            .then(appSync.addAccounts);
    }
}

async function getOrgAccounts(
    {ec2Client, organizationsClient, configClient}, appSyncClient, {configAggregator, organizationUnitId}
) {

    const [dbAccounts, orgAccounts, {OrganizationAggregationSource}, regions] = await Promise.all([
        appSyncClient.getAccounts(),
        organizationsClient.getAllActiveAccountsFromParent(organizationUnitId),
        configClient.getConfigAggregator(configAggregator),
        ec2Client.getAllRegions()
    ]);

    logger.info(`Organization source info.`, {OrganizationAggregationSource});

    const dbAccountsMap = new Map(dbAccounts.map(x => [x.accountId, x]));

    logger.info('Accounts from db.', {dbAccounts});

    const orgAccountsMap = new Map(orgAccounts.map(x => [x.Id, x]));

    const deletedAccounts = dbAccounts.reduce((acc, account) => {
        const {accountId} = account;
        if(dbAccountsMap.has(accountId) && !orgAccountsMap.has(accountId)) {
            acc.push({...account, toDelete: true});
        }
        return acc;
    }, []);

    return orgAccounts
        .map(({Id, isManagementAccount, Name: name, Arn}) => {
            const [, organizationId] = parseArn(Arn).resource.split('/');
            const lastCrawled = dbAccountsMap.get(Id)?.lastCrawled;
            return {
                accountId: Id,
                organizationId,
                name,
                ...(isManagementAccount ? {isManagementAccount} : {}),
                ...(lastCrawled != null ? {lastCrawled} : {}),
                regions: OrganizationAggregationSource.AllAwsRegions
                    ? regions : OrganizationAggregationSource.AwsRegions.map(name => ({name})),
                toDelete: dbAccountsMap.has(Id) && !orgAccountsMap.has(Id)
            };
        })
        .concat(deletedAccounts);
}

function createDiscoveryRoleArn(accountId, rootAccountId) {
    return createArn({service: IAM, accountId, resource: `${ROLE}/${DISCOVERY_ROLE_NAME}-${rootAccountId}`});
}

const addConfigStatus = R.curry(async (awsClient, accounts) => {
    const {errors, results} = await PromisePool
        .withConcurrency(5)
        .for(accounts.map(({regions, ...account}) => {
            return {
                ...account,
                regions: regions.map(region => {
                    return {
                        ...region,
                        isConfigEnabled: null,
                    }
                })
            }
        }))
        .process(async (account) => {
            // don't check accounts that don't have the global resources template deployed
            if(!account.isIamRoleDeployed) return account;

            const {accountId, credentials} = account;

            const regions = await Promise.resolve(account.regions)
                .then(R.map(async region => {
                    const configClient = awsClient.createConfigServiceClient(credentials, region.name);
                    const isConfigEnabled = await configClient.isConfigEnabled()
                        .catch(error => {
                            // don't continue if IAM role doesn't have necessary permissions
                            if (error.name === ACCESS_DENIED_EXCEPTION) throw error;
                            logger.error(`Error verifying AWS Config is enabled in the ${region.name} of account ${accountId}: ${error}`);
                            return null;
                        });

                    return {
                        ...region,
                        isConfigEnabled
                    };
                }))
                .then(ps => Promise.all(ps))
                .catch(error => {
                    if (error.name === ACCESS_DENIED_EXCEPTION) {
                        logger.error(`AWS Config enablement check failed, the Workload discovery role does not have permission to verify if AWS Config is enabled in account ${accountId}. Ensure that the global resources template has been updated in this account.`, {error: error.message});
                    } else {
                        logger.error(`Error verifying AWS Config is enabled in account ${accountId}: ${error}`);
                    }

                    return account.regions;
                });

            return {
                ...account,
                regions
            };
        });

    logger.error(`There were ${errors.length} account errors when verifying if Config was enabled in accounts to be discovered.`, {errors});

    return [
        ...errors.map(e => e.item),
        ...results
    ];
});

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

export function createApiClient(awsClient, appSync, config) {
    const ec2Client = awsClient.createEc2Client();
    const organizationsClient = awsClient.createOrganizationsClient();
    const configClient = awsClient.createConfigServiceClient();
    const stsClient = awsClient.createStsClient();

    return {
        getDbResourcesMap: profileAsync('Time to download resources from Neptune', getDbResourcesMap(appSync)),
        getDbRelationshipsMap: profileAsync('Time to download relationships from Neptune', getDbRelationshipsMap(appSync)),
        getAccounts: profileAsync('Time to get accounts', () => {
            const accountsP = config.isUsingOrganizations
                ? getOrgAccounts({ec2Client, organizationsClient, configClient}, appSync, config)
                : appSync.getAccounts()

            return accountsP
                .then(addAccountCredentials({stsClient}, config.rootAccountId))
                .then(addConfigStatus(awsClient))
        }),
        addCrawledAccounts: addCrawledAccounts(appSync),
        deleteAccounts: appSync.deleteAccounts,
        storeResources: process(createResourceProcessor(appSync.indexResources, appSync.addResources, 'not written to OpenSearch')),
        deleteResources: process(createResourceProcessor(appSync.deleteIndexedResources, appSync.deleteResources, 'not deleted from OpenSearch')),
        updateResources: process(createResourceProcessor(appSync.updateIndexedResources, appSync.updateResources, 'not updated in OpenSearch')),
        deleteRelationships: process(async ids => {
            return appSync.deleteRelationships(ids);
        }),
        storeRelationships: process(async relationships => {
            return appSync.addRelationships(relationships);
        }),
        updateCrawledAccounts: updateCrawledAccounts(appSync)
    };
}
