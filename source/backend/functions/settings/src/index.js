// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require('ramda');
const dynoexpr = require('@tuplo/dynoexpr');
const AWSXRay = require('aws-xray-sdk-core');
const {ConfigService} = require("@aws-sdk/client-config-service");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { EC2 } = require("@aws-sdk/client-ec2");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const {CUSTOM_USER_AGENT: customUserAgent} = process.env;

const configService = new ConfigService({customUserAgent});

const ec2Client = new EC2({customUserAgent});

const dbClient = AWSXRay.captureAWSv3Client(new DynamoDB({customUserAgent}));
const docClient = DynamoDBDocument.from(dbClient);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const all = (ps) => Promise.all(ps);

const query = R.curry(async (docClient, TableName, query) => docClient.query({ TableName, ...query }));

const batchWrite = R.curry((docClient, retryDelay, writes) => {
    function batchWrite_(writes, attempt) {
        return docClient
            .batchWrite(writes)
            .then(async ({ UnprocessedItems }) => {
                if (attempt > 3 || R.isEmpty(R.keys(UnprocessedItems)))
                    return { UnprocessedItems };
                await sleep(attempt * retryDelay);
                return batchWrite_({ RequestItems: UnprocessedItems }, attempt + 1);
            });
    }

    return batchWrite_(writes, 0);
});

const createDeleteRequest = ({ PK, SK }) => ({
    DeleteRequest: { Key: { PK, SK } },
});

const createPutRequest = (query) => ({ PutRequest: { Item: query } });

const createBatchWriteRequest = (TableName) => (writes) => ({
    RequestItems: { [TableName]: writes },
});

const getUnprocessedItems = (TableName) =>
    R.pathOr([], ['UnprocessedItems', TableName]);

function getAccountsFromDb(docClient, TableName) {
    return Promise.resolve({
        KeyConditionExpression: 'PK = :PK',
        ProjectionExpression: 'accountId, #name, regions',
        ExpressionAttributeNames:{
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':PK': 'Account',
        }
    })
        .then(query(docClient, TableName))
        .then(R.prop('Items'))
}

const DUPLICATE_ACCOUNTS_ERROR =
    'Your configuration aggregator contains duplicate accounts. Delete the duplicate accounts and try again.';

function deleteAccounts(
    docClient,
    configService,
    TableName,
    { defaultAccountId, defaultRegion, configAggregator, accountIds, retryTime }
) {
    return getAccountsFromDb(docClient, TableName)
        .then(dbAccounts => {
            const accountsToDelete = new Set(accountIds);
            return R.reject(({accountId}) => accountsToDelete.has(accountId), dbAccounts);
        })
        .then(accounts => {
            const AccountIds = R.pluck('accountId', accounts);
            const AwsRegions = R.uniq(accounts.flatMap(x => R.pluck('name', x.regions)));
            return {AccountIds, AwsRegions};
        })
        .then(async ({AccountIds, AwsRegions}) => {
            // The putConfigurationAggregator API requires that AccountIds and AsRegions be arrays of at least
            // length 1. If a user deletes all their accounts an error occurs and the accounts are not deleted.
            // To mitigate this, we supply the default region and account where the config aggregator is deployed.
            return configService
                .putConfigurationAggregator({
                    ConfigurationAggregatorName: configAggregator,
                    AccountAggregationSources: [
                        {
                            AccountIds: R.isEmpty(AccountIds) ? [defaultAccountId] : AccountIds,
                            AllAwsRegions: false,
                            AwsRegions: R.isEmpty(AwsRegions) ? [defaultRegion]: AwsRegions,
                        },
                    ],
                })
        })
        .catch((err) => {
            if (err.message === DUPLICATE_ACCOUNTS_ERROR) {
                console.log(err);
            } else {
                throw err;
            }
        })
        .then(() => accountIds.map(id => ({PK: 'Account', SK: id})))
        .then(R.map(createDeleteRequest))
        .then(R.splitEvery(25))
        .then(R.map(createBatchWriteRequest(TableName)))
        .then(R.map(batchWrite(docClient, retryTime)))
        .then(all)
        .then(R.chain(getUnprocessedItems(TableName)))
        .then(R.map(R.path(['DeleteRequest', 'Key', 'SK'])))
        .then((unprocessedAccounts) => ({ unprocessedAccounts }));
}

function handleUpdateItemNotExistsError(err) {
    if (err.code === 'ConditionalCheckFailedException') {
        throw new Error('Cannot update item that does not exist');
    }
    throw err;
}

function updateAccount(docClient, TableName, { accountId, ...Update }) {
    const dynamoArg = {PK: 'Account', SK: accountId};
    return docClient
        .update(dynoexpr({
            TableName,
            Key: dynamoArg,
            Condition: dynamoArg,
            Update,
        }))
        .then(() => ({accountId, ...Update}))
        .catch(handleUpdateItemNotExistsError);
}

function updateRegions(docClient, TableName, { accountId, regions }) {
    // This is a naive implementation because it doesn't take into consideration
    // the race condition that could occur between getting the region list and
    // then updating it. This is very unlikely but if it becomes an issue, we
    // can make a more robust implementation.
    return docClient.get({TableName, Key: {PK: 'Account', SK: accountId}, ProjectionExpression: 'regions'})
        .then(({Item: {regions: dbRegions}}) => {
            return R.uniqBy(R.prop('name'), regions).reduce((acc, region) => {
                const i = dbRegions.findIndex(r => r.name === region.name);
                if(i !== -1) acc.push({i, region});
                return acc
            }, []);
        })
        .then(updatedRegions => {
            const {PK, SK} = {PK: 'Account', SK: accountId};

            const ExpressionAttributeValues = updatedRegions.reduce((acc, {i, region}) => {
                acc[':region' + i] = region;
                return acc;
            }, {':PK': PK, ':SK': SK});

            const updateExprssion = updatedRegions.map(({i, region}) => {
                return `#regions[${i}] = :region${i}`;
            });

            return docClient
                .update({
                    TableName,
                    Key: {
                        PK,
                        SK,
                    },
                    ConditionExpression: '(#PK = :PK) AND (#SK = :SK)',
                    ExpressionAttributeNames: {
                        '#PK': 'PK',
                        '#SK': "SK",
                        '#regions': "regions"
                    },
                    ExpressionAttributeValues,
                    UpdateExpression: `SET ${updateExprssion.join(',')}`
                });
        })
        .catch(handleUpdateItemNotExistsError)
        .then(() => ({ accountId, regions }));
}

function getAccount(docClient, TableName, {accountId}) {
    return Promise.resolve({
        KeyConditionExpression: 'PK = :PK AND SK = :SK',
        ProjectionExpression: 'accountId, #name, regions',
        ExpressionAttributeNames:{
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':PK': 'Account',
            ':SK': accountId
        }
    })
        .then(query(docClient, TableName))
        .then(({Items}) => R.head(Items) ?? [])
}

function getAccounts(docClient, TableName) {
    return getAccountsFromDb(docClient, TableName);
}

function addAccounts(
    docClient,
    configService,
    TableName,
    {accounts, configAggregator, retryTime}
) {
    const depudedAccounts = R.map(R.evolve({
        regions: R.uniqBy(R.prop('name'))
    }), accounts);

    return getAccountsFromDb(docClient, TableName)
        .then(R.reduce((acc, {regions, accountId}) => {
            acc[accountId] = {regions, accountId};
            return acc;
        }, {}))
        .then(dbAccounts => {
            const newAccounts = depudedAccounts.reduce((acc, {regions, accountId}) => {
                acc[accountId] = {regions, accountId};
                return acc;
            }, {});
            return R.mergeRight(dbAccounts, newAccounts)
        })
        .then(accountObj => {
            const AccountIds = R.keys(accountObj);
            const AwsRegions = R.uniq(R.values(accountObj).flatMap(x => R.pluck('name', x.regions)));
            return {AccountIds, AwsRegions};
        })
        .then(async ({AccountIds, AwsRegions}) => {
            return configService
                .putConfigurationAggregator({
                    ConfigurationAggregatorName: configAggregator,
                    AccountAggregationSources: [{
                        AccountIds,
                        AllAwsRegions: false,
                        AwsRegions
                    }]
                });
        })
        .then(() => depudedAccounts)
        .then(R.map(account => ({
            PK: 'Account',
            SK: account.accountId,
            type: 'account',
            ...account
        })))
        .then(R.map(createPutRequest))
        .then(R.splitEvery(25))
        .then(R.map(createBatchWriteRequest(TableName)))
        .then(R.map(batchWrite(docClient, retryTime)))
        .then(all)
        .then(R.chain(getUnprocessedItems(TableName)))
        .then(R.map(R.path(['PutRequest', 'Item', 'accountId'])))
        .then((unprocessedAccounts) => ({ unprocessedAccounts }));
}

function handleRegions(accountHandler) {
    return (docClient, configService, TableName, {accountId, regions, configAggregator}) => {
        return getAccountsFromDb(docClient, TableName)
            .then(R.map(accountHandler(regions, accountId)))
            .then(accounts => {
                const AccountIds = R.pluck('accountId', accounts);
                const AwsRegions = R.uniq(accounts.flatMap(x => R.pluck('name', x.regions)));
                return {AccountIds, AwsRegions, accounts};
            })
            .then(async ({AccountIds, AwsRegions, accounts}) => {
                await configService
                    .putConfigurationAggregator({
                        ConfigurationAggregatorName: configAggregator,
                        AccountAggregationSources: [{
                            AccountIds,
                            AllAwsRegions: false,
                            AwsRegions
                        }]
                    });
                return accounts;
            })
            .catch((err) => {
                console.log(err);
                if (err.message !== DUPLICATE_ACCOUNTS_ERROR) throw err;
            })
            .then(accounts => {
                const dynamoArg = {PK: 'Account', SK: accountId};
                const account = accounts.find(x => x.accountId === accountId);

                return docClient
                    .update(dynoexpr({
                        TableName,
                        Key: dynamoArg,
                        Condition: dynamoArg,
                        Update: {regions: account.regions},
                        ReturnValues: 'ALL_NEW'
                    }));
            })
            .catch(handleUpdateItemNotExistsError)
            .then(({Attributes}) => R.pick(['accountId', 'regions', 'name', 'lastCrawled'], Attributes));
    };
}

const addRegions = handleRegions(R.curry((regions, accountId, account) => {
    const newRegions = R.uniqBy(R.prop('name'), [...regions, ...account.regions]);
    return account.accountId === accountId ? {...account, ...{regions: newRegions}} : account;
}));

const deleteRegions = handleRegions(R.curry((regions, accountId, account)  => {
    const toRemove = new Set(R.pluck('name', regions));
    const newRegions = R.reject(({name}) => toRemove.has(name), account.regions);
    return account.accountId === accountId ? {...account, ...{regions: newRegions}} : account;
}));

const isAccountNumber = R.test(/^(\d{12})$/);

function validateAccountIds({accountId, accountIds, accounts}) {
    if(accountId != null && !isAccountNumber(accountId)) {
        throw new Error(`${accountId} is not a valid AWS account id.`);
    }

    const invalidAccountIds = (accountIds ?? accounts?.map(x => x.accountId) ?? []).filter(x => !isAccountNumber(x));
    if (!R.isEmpty(invalidAccountIds)) {
        throw new Error('The following account ids are invalid: ' + invalidAccountIds);
    }
}

function validateRegions(regionSet, {accounts, regions}) {
    const invalidRegions = (regions ?? accounts?.flatMap(a => a.regions) ?? [])
        .map(r => r.name)
        .filter(r => !regionSet.has(r));

    if (!R.isEmpty(invalidRegions)) {
        throw new Error('The following regions are invalid: ' + invalidRegions);
    }
}

async function getRegions(ec2Client) {
    // make call to aws api to get regions
    const { Regions } = await ec2Client.describeRegions({});
    return new Set(R.pluck('RegionName', Regions));
}

const cache = {};

function handler(ec2Client, docClient, configService, {
    ACCOUNT_ID: defaultAccountId, AWS_REGION: defaultRegion,
    DB_TABLE: TableName, CONFIG_AGGREGATOR: configAggregator, RETRY_TIME: retryTime = 1000
}) {
    return async (event, _) => {
        if (R.isNil(cache.regions)) cache.regions = await getRegions(ec2Client);

        const args = event.arguments;
        console.log(JSON.stringify(args));

        validateAccountIds(args);
        validateRegions(cache.regions, args);

        switch (event.info.fieldName) {
            case 'addAccounts':
                return addAccounts(docClient, configService, TableName, {
                    configAggregator,
                    retryTime,
                    ...R.evolve({accounts: R.uniqBy(R.prop('accountId'))}, args),
                });
            case 'addRegions':
                return addRegions(docClient, configService, TableName, {
                    configAggregator,
                    ...args,
                });
            case 'deleteAccounts':
                return deleteAccounts(docClient, configService, TableName, {
                    defaultAccountId,
                    defaultRegion,
                    configAggregator,
                    retryTime,
                    ...args,
                });
            case 'deleteRegions':
                return deleteRegions(docClient, configService, TableName, {
                    configAggregator,
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
            default:
                return Promise.reject('Unknown field, unable to resolve ' + event.field);
        }
    };
}

exports.handler = handler(ec2Client, docClient, configService, process.env);
