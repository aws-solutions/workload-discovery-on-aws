// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const add = require('add');
const {parse} = require('csv-parse');
const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();
const R = require('ramda');
const athenaQueryBuilder = require('./athenaQueryBuilder');

const {
    AthenaDatabaseName: athenaDatabaseName,
    AthenaTableName: athenaTableName,
    AthenaResultsBucketName: athenaResultsBucketName,
    AthenaWorkgroup: athenaWorkgroup,
    CustomUserAgent: customUserAgent,
} = process.env;

const s3 = new AWS.S3({
    customUserAgent: customUserAgent,
    apiVersion: '2006-03-01',
});

const AthenaExpress = require('athena-express'),
    aws = AWS;

/* Configuration object for athena-express library.
  db - specified as an envrionment variable and can be found in the Athena console.
  s3 - athena-express will store ALL results in this bucket.
  skipResults - athena-express will NOT return results to the Lambda function, but stores them in S3 instead.
  getStats - athena-express will return basic query statistics from Athena e.g. cost, data scanned.
  workgroup - the Athena workgroup to use when executing a query.
*/
const athenaExpressConfig = {
    aws,
    db: athenaDatabaseName,
    s3: athenaResultsBucketName,
    skipResults: true,
    getStats: true,
    workgroup: athenaWorkgroup,
};

const athenaExpress = new AthenaExpress(athenaExpressConfig);
// The delay in milliseconds that will be used in our exponential backoff strategy.
const retryDelay = 1500;

// Helper function to sleep for a given number of milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function that will parse the return S3 URL from athena-express and return the bucket name and the key.
const parseS3URL = (url) => {
    return (
        url && {
            Bucket: url.match(/^[sS]3:\/\/(.*?)\/(.*)/)[1],
            Key: url.match(/^[sS]3:\/\/(.*?)\/(.*)/)[2],
        }
    );
};

// We define our own stream `reduce` function here because the reduce
// method on the Readable class is marked as experimental in Node 18:
// https://nodejs.org/docs/latest-v18.x/api/stream.html#readablereducefn-initial-options
async function reduce(f, initial, stream) {
    let accum = initial;
    for await (const chunk of stream) {
        accum = f(accum, chunk);
    }
    return accum;
}

async function buildTotalCost(s3, query) {
    const stream = s3.getObject({Bucket: query.bucket, Key: query.key}).createReadStream()
        .pipe(parse({columns: true}));

    return reduce((acc, {cost}) => {
        return add([acc, parseFloat(cost)]);
    }, 0, stream)
        .then(cost => parseFloat(parseFloat(cost).toFixed(2)));
}

//Counts the number of results returned by Athena in the S3 result csv.
async function getResultCount(s3, query) {
    const stream = s3.getObject({Bucket: query.bucket, Key: query.key}).createReadStream()
        .pipe(parse({columns: true}));

    return reduce((acc, _) => acc + 1, 0, stream);
}

function createCostItem(item) {
    const parsed = item.region.split('|');
    // Global services such as S3 often have two line items, one in the region you created the bucket and then
    // us-east-1. These cases return a string that is delimited with `|`, i.e., `region: eu-west-1|us-east-1`,
    // that must be parsed.
    const region = parsed.length > 1 ? R.head(R.reject(x => x === 'us-east-1', parsed)) : R.head(parsed)

    return {
        ...item,
        cost: parseFloat(parseFloat(item.cost).toFixed(2)),
        region
    };
}

// Creates and returns an array of cost items requested in the API.
const getCostItems = async (s3, query) => {
    const {start, end} = query.pagination ?? {start: 0, end: 100};
    const stream = s3.getObject({Bucket: query.bucket, Key: query.key}).createReadStream()
        .pipe(parse({columns: true}));

    const result = [];
    let count = 0;

    // When the Readable API is stable we can make this declarative by using the `drop`,
    // `take`, `map` and `reduce` methods.
    for await(const item of stream) {
        if (count === end) break;
        if ((count >= start) || (count > end)) {
            result.push(createCostItem(item));
        }
        count++;
    }

    return result;
};

/* 
  If queryDetails exists then we enrich it with more data about what is being returned else 
  it will return the data to be used as the queryDetails response attribute.
*/
const enrichQueryDetails = async (s3, query, queryDetails) => {
    const pagination = query.pagination ?? {start: 0, end: 100};
    const enrichedQueryDetails = {
        resultCount: await getResultCount(s3, query),
        pagination: pagination,
        s3Bucket: query.bucket,
        s3Key: query.key,
    };
    return queryDetails
        ? R.mergeAll([queryDetails, enrichedQueryDetails])
        : enrichedQueryDetails;
};

/*
  Will fetch the next set of results as requested from the API request. It does not process total cost of all items.
*/
async function fetchPaginatedResults(s3, query) {
    const [costItems, queryDetails] = await Promise.all([
        getCostItems(s3, query),
        enrichQueryDetails(s3, query, query.queryDetails)
    ]);

    return {
        costItems,
        queryDetails
    };
}

/*
  Provided with a query object containing details of the Athena query. It will build and return the response object to be returned to the client
*/
async function readResultsFromS3(s3, query) {
    const [totalCost, costItems, queryDetails] = await Promise.all([
        buildTotalCost(s3, query),
        getCostItems(s3, query),
        enrichQueryDetails(s3, query, query.queryDetails),
    ]);

    return {
        totalCost,
        costItems,
        queryDetails,
    };
}

// Build queryDetails from the athena-express response. This provides us with the location of the results CSV in S3 and some metadata about the Athena query
const buildQueryDetails = (result) => {
    return {
        queryDetails: {
            cost: R.prop('QueryCostInUSD', result),
            s3Bucket: R.prop('Bucket', parseS3URL(R.prop('S3Location', result))),
            s3Key: R.prop('Key', parseS3URL(R.prop('S3Location', result))),
            dataScannedInMB: R.prop('DataScannedInMB', result),
        },
    };
};

/* Responsible for controlling the events:
  1. Takes the Athena query a paginiation object
  2. Execute the query against Athena
  3. Build the queryDetails from the athena-express response
  4. Reads the results from S3
  5. Exponentially backoff when errors are detected.
*/
function getCost(sqlQuery, {pagination = {start: 0, end: 10}}, attempts = 0) {
    return Promise.resolve(athenaExpress.query(sqlQuery))
        .then(buildQueryDetails)
        .then((query) =>
            readResultsFromS3(s3, {
                cost: query.queryDetails.cost,
                bucket: query.queryDetails.s3Bucket,
                key: query.queryDetails.s3Key,
                pagination: pagination,
                queryDetails: query.queryDetails,
            })
        )
        .catch(async (err) => {
            if (attempts < 3) {
                await sleep(attempts * retryDelay);
                return getCost(sqlQuery, {pagination}, attempts + 1);
            } else {
                console.error(err);
                return err;
            }
        });
}

const cache = {};

async function getRegions() {
    // make call to aws api to get regions
    const {Regions} = await ec2.describeRegions({}).promise();
    return R.pluck('RegionName', Regions);
}

exports.handler = async (event, context) => {
    const args = event.arguments;
    if (R.isNil(cache.regions)) cache.regions = await getRegions();
    switch (event.info.fieldName) {
        case 'readResultsFromS3':
            return fetchPaginatedResults(s3, {...args.s3Query});
        case 'getResourcesByCostByDay':
            return getCost(
                athenaQueryBuilder.byResourceIdOrderedByDayQuery({
                    cache,
                    athenaTableName,
                    ...args.costForResourceQueryByDay,
                }),
                {athenaTableName, ...args.costForResourceQueryByDay}
            );
        case 'getResourcesByCost':
            return getCost(
                athenaQueryBuilder.getResourcesByCostQuery({
                    cache,
                    athenaTableName,
                    ...args.resourcesByCostQuery,
                }),
                {athenaTableName, ...args.resourcesByCostQuery}
            );
        case 'getCostForResource':
            return getCost(
                athenaQueryBuilder.byResourceIdQuery({
                    cache,
                    athenaTableName,
                    ...args.costForResourceQuery,
                }),
                {athenaTableName, ...args.costForResourceQuery}
            );
        case 'getCostForService':
            return getCost(
                athenaQueryBuilder.byServiceQuery({
                    cache,
                    athenaTableName,
                    ...args.costForServiceQuery,
                }),
                {athenaTableName, ...args.costForServiceQuery}
            );
        default:
            return Promise.reject('Unknown field, unable to resolve ' + event.field);
    }
}
