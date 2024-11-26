// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import dynoexpr from '@tuplo/dynoexpr';
import {Logger} from '@aws-lambda-powertools/logger';
import AWSXRay from 'aws-xray-sdk-core';
import {ConfigService} from '@aws-sdk/client-config-service';
import {DynamoDB} from '@aws-sdk/client-dynamodb';
import {EC2} from '@aws-sdk/client-ec2';
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb';

const {CUSTOM_USER_AGENT: customUserAgent} = process.env;

const configService = new ConfigService({customUserAgent});

const ec2Client = new EC2({customUserAgent});

const logger = new Logger({serviceName: 'WdSettingsApi'});

const dbClient = AWSXRay.captureAWSv3Client(new DynamoDB({customUserAgent}));
const docClient = DynamoDBDocument.from(dbClient);

const AWS_ORGANIZATIONS = 'AWS_ORGANIZATIONS';
const DUPLICATE_ACCOUNTS_ERROR =
    'Your configuration aggregator contains duplicate accounts. Delete the duplicate accounts and try again.';

function handleAwsConfigErrors(err) {
    if (
        [DUPLICATE_ACCOUNTS_ERROR].includes(err.message)
    ) {
        logger.error(err);
    } else {
        throw err;
    }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const all = ps => Promise.all(ps);

const query = R.curry(async (docClient, TableName, query) => {
    function query_(params, items = []) {
        return docClient.query(params).then(({Items, LastEvaluatedKey}) => {
            items.push(...Items);
            return LastEvaluatedKey == null
                ? {Items: items}
                : query_(
                      {
                          ExclusiveStartKey: LastEvaluatedKey,
                          TableName,
                          ...query,
                      },
                      items
                  );
        });
    }

    return query_({TableName, ...query});
});

const batchWrite = R.curry((docClient, retryDelay, writes) => {
    function batchWrite_(writes, attempt) {
        return docClient.batchWrite(writes).then(async ({UnprocessedItems}) => {
            if (attempt > 3 || R.isEmpty(R.keys(UnprocessedItems))) {
                return {UnprocessedItems};
            }
            await sleep(attempt * retryDelay);
            return batchWrite_({RequestItems: UnprocessedItems}, attempt + 1);
        });
    }

    return batchWrite_(writes, 0);
});

const batchGet = R.curry((docClient, retryDelay, gets) => {
    function batchGet_(gets, attempt, Items = []) {
        return docClient
            .batchGet(gets)
            .then(async ({Responses, UnprocessedKeys}) => {
                Items.push(...Object.values(Responses).flat());
                if (attempt > 3 || R.isEmpty(R.keys(UnprocessedKeys))) {
                    return {Items, UnprocessedKeys};
                }
                await sleep(attempt * retryDelay);
                return batchGet_(
                    {RequestItems: UnprocessedKeys},
                    attempt + 1,
                    Items
                );
            });
    }

    return batchGet_(gets, 0);
});

const createDeleteRequest = ({PK, SK}) => ({
    DeleteRequest: {Key: {PK, SK}},
});

const createPutRequest = query => ({PutRequest: {Item: query}});

const createBatchWriteRequest = TableName => writes => ({
    RequestItems: {[TableName]: writes},
});

const getUnprocessedItems = TableName =>
    R.pathOr([], ['UnprocessedItems', TableName]);

const DEFAULT_ACCOUNT_PROJECTION_EXPR =
    'accountId, #name, regions, isIamRoleDeployed, organizationId, isManagementAccount, lastCrawled';

const DEFAULT_EXPRESSION_ATT_NAMES = {
    '#name': 'name',
};

function getAllAccountsFromDb(
    docClient,
    TableName,
    {ProjectionExpression, ExpressionAttributeNames}
) {
    return Promise.resolve({
        KeyConditionExpression: 'PK = :PK',
        ProjectionExpression,
        ...(R.isEmpty(ExpressionAttributeNames)
            ? ExpressionAttributeNames
            : {ExpressionAttributeNames}),
        ExpressionAttributeValues: {
            ':PK': 'Account',
        },
    })
        .then(query(docClient, TableName))
        .then(R.prop('Items'));
}

function getFilteredAccountsFromDb(
    docClient,
    TableName,
    {
        ProjectionExpression,
        ExpressionAttributeNames = {},
        accountFilters = [],
        retryTime,
    }
) {
    return Promise.resolve(R.splitEvery(100, accountFilters))
        .then(
            R.map(accountIds => {
                return {
                    RequestItems: {
                        [TableName]: {
                            Keys: accountIds.map(accountId => ({
                                PK: 'Account',
                                SK: accountId,
                            })),
                            ProjectionExpression,
                            ...(R.isEmpty(ExpressionAttributeNames)
                                ? ExpressionAttributeNames
                                : {ExpressionAttributeNames}),
                        },
                    },
                };
            })
        )
        .then(R.map(batchGet(docClient, retryTime)))
        .then(all)
        .then(R.chain(x => x.Items));
}

function getAccountsFromDb(
    docClient,
    TableName,
    {
        ProjectionExpression,
        ExpressionAttributeNames = {},
        accountFilters = [],
        retryTime,
    }
) {
    return R.isEmpty(accountFilters)
        ? getAllAccountsFromDb(docClient, TableName, {
              ProjectionExpression,
              ExpressionAttributeNames,
          })
        : getFilteredAccountsFromDb(docClient, TableName, {
              ProjectionExpression,
              ExpressionAttributeNames,
              accountFilters: accountFilters,
              retryTime,
          });
}

function deleteAccounts(
    docClient,
    configService,
    TableName,
    {defaultAccountId, defaultRegion, configAggregator, isUsingOrganizations, accountIds, retryTime}
) {
    return getAccountsFromDb(docClient, TableName, {
        ProjectionExpression: DEFAULT_ACCOUNT_PROJECTION_EXPR,
        ExpressionAttributeNames: DEFAULT_EXPRESSION_ATT_NAMES,
    })
        .then(dbAccounts => {
            const accountsToDelete = new Set(accountIds);
            return R.reject(
                ({accountId}) => accountsToDelete.has(accountId),
                dbAccounts
            );
        })
        .then(accounts => {
            const AccountIds = R.pluck('accountId', accounts);
            const AwsRegions = R.uniq(
                accounts.flatMap(x => R.pluck('name', x.regions))
            );
            return {AccountIds, AwsRegions};
        })
        .then(async ({AccountIds, AwsRegions}) => {
            if(isUsingOrganizations) return;

            // The putConfigurationAggregator API requires that AccountIds and AsRegions be arrays of at least
            // length 1. If a user deletes all their accounts an error occurs and the accounts are not deleted.
            // To mitigate this, we supply the default region and account where the config aggregator is deployed.
            return configService.putConfigurationAggregator({
                ConfigurationAggregatorName: configAggregator,
                AccountAggregationSources: [
                    {
                        AccountIds: R.isEmpty(AccountIds)
                            ? [defaultAccountId]
                            : AccountIds,
                        AllAwsRegions: false,
                        AwsRegions: R.isEmpty(AwsRegions)
                            ? [defaultRegion]
                            : AwsRegions,
                    },
                ],
            });
        })
        .catch(handleAwsConfigErrors)
        .then(() => accountIds.map(id => ({PK: 'Account', SK: id})))
        .then(R.map(createDeleteRequest))
        .then(R.splitEvery(25))
        .then(R.map(createBatchWriteRequest(TableName)))
        .then(R.map(batchWrite(docClient, retryTime)))
        .then(all)
        .then(R.chain(getUnprocessedItems(TableName)))
        .then(R.map(R.path(['DeleteRequest', 'Key', 'SK'])))
        .then(unprocessedAccounts => ({unprocessedAccounts}));
}

function handleUpdateItemNotExistsError(err) {
    if (err.code === 'ConditionalCheckFailedException') {
        throw new Error('Cannot update item that does not exist');
    }
    throw err;
}

function updateAccount(docClient, TableName, {accountId, ...Update}) {
    const dynamoArg = {PK: 'Account', SK: accountId};
    return docClient
        .update(
            dynoexpr({
                TableName,
                Key: dynamoArg,
                Condition: dynamoArg,
                Update,
            })
        )
        .then(() => ({accountId, ...Update}))
        .catch(handleUpdateItemNotExistsError);
}

function updateRegions(docClient, TableName, {accountId, regions}) {
    // This is a naive implementation because it doesn't take into consideration
    // the race condition that could occur between getting the region list and
    // then updating it. This is very unlikely but if it becomes an issue, we
    // can make a more robust implementation.
    return docClient
        .get({
            TableName,
            Key: {PK: 'Account', SK: accountId},
            ProjectionExpression: 'regions',
        })
        .then(({Item: {regions: dbRegions}}) => {
            return R.uniqBy(R.prop('name'), regions).reduce((acc, region) => {
                const i = dbRegions.findIndex(r => r.name === region.name);
                if (i !== -1) acc.push({i, region});
                return acc;
            }, []);
        })
        .then(updatedRegions => {
            const {PK, SK} = {PK: 'Account', SK: accountId};

            const ExpressionAttributeValues = updatedRegions.reduce(
                (acc, {i, region}) => {
                    acc[':region' + i] = region;
                    return acc;
                },
                {':PK': PK, ':SK': SK}
            );

            const updateExprssion = updatedRegions.map(({i, region}) => {
                return `#regions[${i}] = :region${i}`;
            });

            return docClient.update({
                TableName,
                Key: {
                    PK,
                    SK,
                },
                ConditionExpression: '(#PK = :PK) AND (#SK = :SK)',
                ExpressionAttributeNames: {
                    '#PK': 'PK',
                    '#SK': 'SK',
                    '#regions': 'regions',
                },
                ExpressionAttributeValues,
                UpdateExpression: `SET ${updateExprssion.join(',')}`,
            });
        })
        .catch(handleUpdateItemNotExistsError)
        .then(() => ({accountId, regions}));
}

function getAccount(docClient, TableName, {accountId}) {
    return Promise.resolve({
        KeyConditionExpression: 'PK = :PK AND SK = :SK',
        ProjectionExpression: DEFAULT_ACCOUNT_PROJECTION_EXPR,
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':PK': 'Account',
            ':SK': accountId,
        },
    })
        .then(query(docClient, TableName))
        .then(({Items}) => R.head(Items) ?? []);
}

function getAccounts(docClient, TableName) {
    return getAccountsFromDb(docClient, TableName, {
        ProjectionExpression: DEFAULT_ACCOUNT_PROJECTION_EXPR,
        ExpressionAttributeNames: DEFAULT_EXPRESSION_ATT_NAMES,
    });
}

function addAccounts(
    docClient,
    configService,
    TableName,
    {accounts, configAggregator, isUsingOrganizations, retryTime}
) {
    const depudedAccounts = R.map(
        R.evolve({
            regions: R.uniqBy(R.prop('name')),
        }),
        accounts
    );

    return getAccountsFromDb(docClient, TableName, {
        ProjectionExpression: DEFAULT_ACCOUNT_PROJECTION_EXPR,
        ExpressionAttributeNames: DEFAULT_EXPRESSION_ATT_NAMES,
    })
        .then(
            R.reduce((acc, {regions, accountId}) => {
                acc[accountId] = {regions, accountId};
                return acc;
            }, {})
        )
        .then(dbAccounts => {
            const newAccounts = depudedAccounts.reduce(
                (acc, {regions, accountId}) => {
                    acc[accountId] = {regions, accountId};
                    return acc;
                },
                {}
            );
            return R.mergeRight(dbAccounts, newAccounts);
        })
        .then(accountObj => {
            const AccountIds = R.keys(accountObj);
            const AwsRegions = R.uniq(
                R.values(accountObj).flatMap(x => R.pluck('name', x.regions))
            );
            return {AccountIds, AwsRegions};
        })
        .then(async ({AccountIds, AwsRegions}) => {
            if(isUsingOrganizations) return;

            return configService.putConfigurationAggregator({
                ConfigurationAggregatorName: configAggregator,
                AccountAggregationSources: [
                    {
                        AccountIds,
                        AllAwsRegions: false,
                        AwsRegions,
                    },
                ],
            });
        })
        .catch(handleAwsConfigErrors)
        .then(() => depudedAccounts)
        .then(
            R.map(account => ({
                PK: 'Account',
                SK: account.accountId,
                type: 'account',
                ...account,
            }))
        )
        .then(R.map(createPutRequest))
        .then(R.splitEvery(25))
        .then(R.map(createBatchWriteRequest(TableName)))
        .then(R.map(batchWrite(docClient, retryTime)))
        .then(all)
        .then(R.chain(getUnprocessedItems(TableName)))
        .then(R.map(R.path(['PutRequest', 'Item', 'accountId'])))
        .then(unprocessedAccounts => ({unprocessedAccounts}));
}

function handleRegions(accountHandler) {
    return (
        docClient,
        configService,
        TableName,
        {accountId, regions, configAggregator, isUsingOrganizations}
    ) => {
        return getAccountsFromDb(docClient, TableName, {
            ProjectionExpression: DEFAULT_ACCOUNT_PROJECTION_EXPR,
            ExpressionAttributeNames: DEFAULT_EXPRESSION_ATT_NAMES,
        })
            .then(R.map(accountHandler(regions, accountId)))
            .then(accounts => {
                const AccountIds = R.pluck('accountId', accounts);
                const AwsRegions = R.uniq(
                    accounts.flatMap(x => R.pluck('name', x.regions))
                );
                return {AccountIds, AwsRegions, accounts};
            })
            .then(async ({AccountIds, AwsRegions, accounts}) => {
                if(!isUsingOrganizations) {
                    await configService.putConfigurationAggregator({
                        ConfigurationAggregatorName: configAggregator,
                        AccountAggregationSources: [
                            {
                                AccountIds,
                                AllAwsRegions: false,
                                AwsRegions,
                            },
                        ],
                    });
                }

                return accounts;
            })
            .catch(err => {
                console.log(err);
                if (err.message !== DUPLICATE_ACCOUNTS_ERROR) throw err;
            })
            .then(accounts => {
                const dynamoArg = {PK: 'Account', SK: accountId};
                const account = accounts.find(x => x.accountId === accountId);

                return docClient.update(
                    dynoexpr({
                        TableName,
                        Key: dynamoArg,
                        Condition: dynamoArg,
                        Update: {regions: account.regions},
                        ReturnValues: 'ALL_NEW',
                    })
                );
            })
            .catch(handleUpdateItemNotExistsError)
            .then(({Attributes}) =>
                R.pick(
                    ['accountId', 'regions', 'name', 'lastCrawled'],
                    Attributes
                )
            );
    };
}

const addRegions = handleRegions(
    R.curry((regions, accountId, account) => {
        const newRegions = R.uniqBy(R.prop('name'), [
            ...regions,
            ...account.regions,
        ]);
        return account.accountId === accountId
            ? {...account, ...{regions: newRegions}}
            : account;
    })
);

const deleteRegions = handleRegions(
    R.curry((regions, accountId, account) => {
        const toRemove = new Set(R.pluck('name', regions));
        const newRegions = R.reject(
            ({name}) => toRemove.has(name),
            account.regions
        );

        if (R.isEmpty(newRegions)) {
            throw new Error(
                'Unable to delete region(s), an account must have at least one region.'
            );
        }

        return account.accountId === accountId
            ? {...account, ...{regions: newRegions}}
            : account;
    })
);

function getResourcesMetadata(docClient, TableName, {retryTime}) {
    console.time('getResourcesMetadata elapsed time');

    return getAccountsFromDb(docClient, TableName, {
        ProjectionExpression: 'accountId, regions, resourcesRegionMetadata',
        retryTime,
    })
        .then(R.reject(x => x.resourcesRegionMetadata == null))
        .then(dbResponse => {
            const accounts = R.map(
                R.pick(['accountId', 'regions']),
                dbResponse
            );

            const resourcesRegionMetadata = dbResponse.map(
                x => x.resourcesRegionMetadata
            );

            const count = resourcesRegionMetadata.reduce(
                (acc, {count}) => acc + count,
                0
            );

            const resourceTypesObj = resourcesRegionMetadata.reduce(
                (acc, {regions}) => {
                    regions.forEach(({resourceTypes}) => {
                        resourceTypes.forEach(({count, type}) => {
                            if (acc[type] == null) {
                                acc[type] = {
                                    count: 0,
                                    type,
                                };
                            }
                            acc[type].count = acc[type].count + count;
                        });
                    });
                    return acc;
                },
                {}
            );

            return {
                count,
                accounts,
                resourceTypes: Object.values(resourceTypesObj),
            };
        })
        .then(
            R.tap(() => console.timeEnd('getResourcesMetadata elapsed time'))
        );
}

function getResourcesAccountMetadata(
    docClient,
    TableName,
    {retryTime, accounts = []}
) {
    const accountsMap = new Map(
        accounts.map(({accountId, regions = []}) => [
            accountId,
            {
                accountId,
                regions: new Set(regions.map(x => x.name)),
            },
        ])
    );

    console.time('getResourcesAccountMetadata elapsed time');
    return getAccountsFromDb(docClient, TableName, {
        ProjectionExpression: 'resourcesRegionMetadata',
        accountFilters: accounts.map(x => x.accountId),
        retryTime,
    })
        .then(
            R.chain(({resourcesRegionMetadata}) => {
                if (resourcesRegionMetadata == null) return [];

                const {accountId, regions} = resourcesRegionMetadata;
                let totalCount = 0;

                const resourceTypesObj = regions
                    .filter(({name}) => {
                        if (accountsMap.has(accountId)) {
                            const regionSet =
                                accountsMap.get(accountId).regions;
                            return regionSet.size === 0 || regionSet.has(name);
                        }
                        return true;
                    })
                    .reduce((acc, {resourceTypes}) => {
                        resourceTypes.forEach(({count, type}) => {
                            if (acc[type] == null) {
                                acc[type] = {
                                    count: 0,
                                    type,
                                };
                            }

                            const resourceType = acc[type];

                            resourceType.count = resourceType.count + count;
                            totalCount = totalCount + count;
                        });
                        return acc;
                    }, {});

                return [
                    {
                        accountId,
                        count: totalCount,
                        resourceTypes: Object.values(resourceTypesObj),
                    },
                ];
            })
        )
        .then(
            R.tap(() =>
                console.timeEnd('getResourcesAccountMetadata elapsed time')
            )
        );
}

function getResourcesRegionMetadata(
    docClient,
    TableName,
    {retryTime, accounts = []}
) {
    const accountsMap = new Map(
        accounts.map(({accountId, regions = []}) => [
            accountId,
            {
                accountId,
                regions: new Set(regions.map(x => x.name)),
            },
        ])
    );

    console.time('getResourcesRegionMetadata elapsed time');
    return getAccountsFromDb(docClient, TableName, {
        ProjectionExpression: 'resourcesRegionMetadata',
        accountFilters: accounts.map(x => x.accountId),
        retryTime,
    })
        .then(R.reject(R.isEmpty))
        .then(
            R.map(({resourcesRegionMetadata}) => {
                if (accountsMap.size === 0) return resourcesRegionMetadata;

                const {accountId, regions, count} = resourcesRegionMetadata;

                const {regions: regionsSet} = accountsMap.get(accountId);

                const filteredRegions =
                    regionsSet.size === 0
                        ? regions
                        : regions.filter(x => regionsSet.has(x.name));
                const filteredCount =
                    regionsSet.size === 0
                        ? count
                        : filteredRegions.reduce(
                              (acc, {count}) => acc + count,
                              0
                          );

                return {
                    accountId,
                    count: filteredCount,
                    regions: filteredRegions,
                };
            })
        )
        .then(
            R.tap(() =>
                console.timeEnd('getResourcesRegionMetadata elapsed time')
            )
        );
}

const isAccountNumber = R.test(/^(\d{12})$/);

function validateAccountIds({accountId, accountIds, accounts}) {
    if (accountId != null && !isAccountNumber(accountId)) {
        throw new Error(`${accountId} is not a valid AWS account id.`);
    }

    const invalidAccountIds = (
        accountIds ??
        accounts?.map(x => x.accountId) ??
        []
    ).filter(accountId => {
        // this is a special account where AWS managed policies live
        if (accountId === 'aws') return false;
        return !isAccountNumber(accountId);
    });

    if (!R.isEmpty(invalidAccountIds)) {
        throw new Error(
            'The following account ids are invalid: ' + invalidAccountIds
        );
    }
}

function validateRegions(regionSet, {accounts, regions}) {
    const invalidRegions = (
        regions ??
        accounts?.flatMap(a => a.regions ?? []) ??
        []
    )
        .map(r => r.name)
        .filter(r => !regionSet.has(r));

    if (!R.isEmpty(invalidRegions)) {
        throw new Error('The following regions are invalid: ' + invalidRegions);
    }
}

async function getRegions(ec2Client) {
    // make call to aws api to get regions
    const {Regions} = await ec2Client.describeRegions({});
    const regionsSet = new Set(R.pluck('RegionName', Regions));
    regionsSet.add('global');
    return regionsSet;
}

const cache = {};

export function _handler(
    ec2Client,
    docClient,
    configService,
    {
        ACCOUNT_ID: defaultAccountId,
        AWS_REGION: defaultRegion,
        DB_TABLE: TableName,
        CONFIG_AGGREGATOR: configAggregator,
        CROSS_ACCOUNT_DISCOVERY: crossAccountDiscovery,
        RETRY_TIME: retryTime = 1000,
    }
) {
    return async (event, _) => {
        const fieldName = event.info.fieldName;

        const args = R.reject(R.isNil, event.arguments);
        logger.info(
            'GraphQL arguments:',
            {arguments: args, operation: fieldName}
        );

        const {username} = event.identity;
        logger.info(`User ${username} invoked the ${fieldName} operation.`);

        if (R.isNil(cache.regions)) cache.regions = await getRegions(ec2Client);

        const isUsingOrganizations = crossAccountDiscovery === AWS_ORGANIZATIONS;

        validateAccountIds(args);
        validateRegions(cache.regions, args);

        switch (fieldName) {
            case 'addAccounts':
                return addAccounts(docClient, configService, TableName, {
                    configAggregator,
                    isUsingOrganizations,
                    retryTime,
                    ...R.evolve(
                        {accounts: R.uniqBy(R.prop('accountId'))},
                        args
                    ),
                });
            case 'addRegions':
                return addRegions(docClient, configService, TableName, {
                    configAggregator,
                    isUsingOrganizations,
                    ...args,
                });
            case 'deleteAccounts':
                return deleteAccounts(docClient, configService, TableName, {
                    defaultAccountId,
                    defaultRegion,
                    configAggregator,
                    isUsingOrganizations,
                    retryTime,
                    ...args,
                });
            case 'deleteRegions':
                return deleteRegions(docClient, configService, TableName, {
                    configAggregator,
                    isUsingOrganizations,
                    ...args,
                });
            case 'getAccount':
                return getAccount(docClient, TableName, args);
            case 'getAccounts':
                return getAccounts(docClient, TableName);
            case 'updateAccount':
                return updateAccount(docClient, TableName, args);
            case 'updateRegions':
                return updateRegions(docClient, TableName, args);
            case 'getResourcesMetadata':
                return getResourcesMetadata(docClient, TableName, {retryTime});
            case 'getResourcesAccountMetadata':
                return getResourcesAccountMetadata(docClient, TableName, {
                    retryTime,
                    ...args,
                });
            case 'getResourcesRegionMetadata':
                return getResourcesRegionMetadata(docClient, TableName, {
                    retryTime,
                    ...args,
                });
            default:
                return Promise.reject(
                    new Error(`Unknown field, unable to resolve ${fieldName}.`)
                );
        }
    };
}

export const handler = _handler(
    ec2Client,
    docClient,
    configService,
    process.env
);
