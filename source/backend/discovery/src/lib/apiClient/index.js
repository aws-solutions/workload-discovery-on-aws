// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require("ramda");
const {PromisePool} = require("@supercharge/promise-pool");
const {profileAsync, createArn} = require('../utils');
const logger = require("../logger");
const {parse: parseArn} = require("@aws-sdk/util-arn-parser");
const {
    ACCESS_DENIED,
    IAM,
    ROLE,
    DISCOVERY_ROLE_NAME
} = require("../constants");

function getDbResourcesMap(appSync) {
    const {createPaginator, getResources} = appSync;
    const getResourcesPaginator = createPaginator(getResources, 1000);

    return async () => {
        const resourcesMap = new Map();

        for await (const resources of getResourcesPaginator({})) {
            resources.forEach(r => resourcesMap.set(r.id, {
                id: r.id,
                label: r.label,
                md5Hash: r.md5Hash,
                // gql will return `null` for missing properties which will break the hashing
                // comparison for sdk discovered resources
                properties: R.reject(R.isNil, r.properties)
            }));
        }

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
    return ({concurrency, batchSize}, resources) => PromisePool
        .withConcurrency(concurrency)
        .for(R.splitEvery(batchSize, resources))
        .process(processor);
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
                    regions: regions.map(name => ({name})),
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
                    ? regions.map(x => x.name) : OrganizationAggregationSource.AwsRegions,
                toDelete: dbAccountsMap.has(Id) && !orgAccountsMap.has(Id)
            };
        })
        .concat(deletedAccounts);
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

module.exports = {
    createApiClient(awsClient, appSync, config) {
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
                    : appSync.getAccounts().then(R.map(R.evolve({regions: R.map(x => x.name)})));

                return accountsP
                    .then(addAccountCredentials({stsClient}, config.rootAccountId))
            }),
            addCrawledAccounts: addCrawledAccounts(appSync),
            deleteAccounts: appSync.deleteAccounts,
            storeResources: process(async resources => {
                await appSync.indexResources(resources);
                await appSync.addResources(resources);
            }),
            deleteResources: process(async ids => {
                await appSync.deleteIndexedResources(ids);
                await appSync.deleteResources(ids);
            }),
            updateResources: process(async resources => {
                await appSync.updateIndexedResources(resources);
                await appSync.updateResources(resources);
            }),
            deleteRelationships: process(async ids => {
                return appSync.deleteRelationships(ids);
            }),
            storeRelationships: process(async relationships => {
                return appSync.addRelationships(relationships);
            }),
            updateCrawledAccounts: updateCrawledAccounts(appSync)
        };
    }
}
