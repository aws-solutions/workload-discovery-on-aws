// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const most = require('most');
const readline = require('readline');
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

// Creates a ReadStream from the S3 bucket and key provided by athena-express
const createObjectReadStream = R.curry((client, bucket, key) =>
  Promise.resolve(
    client.getObject({ Bucket: bucket, Key: key }).createReadStream()
  )
);
// Creates a ReadlineInterface from the ReadStream
const createReadlineInterface = (input) =>
  readline.createInterface({
    input,
    terminal: false,
  });

const getCostOfItem = (headers, item) => {
  const mergedResult = {};
  R.split(',', R.replace(/"/g, '', item)).map((e, index) => {
    mergedResult[`${headers[index]}`] = e;
  });
  return parseFloat(parseFloat(mergedResult.cost).toFixed(2));
};

/* Will take an array of headers and results from Athena and return an array of objects with headers for keys and results as values e.g.
  { 
     "line_item_resource_id": "arn:aws:your-resource-id",
     "product_servicename": "Amazon Service Name",
     "line_item_usage_account_id": "account-id",
     "region": "ap-southeast-1",
     "pricing_term": "OnDemand",
     "cost": "100.000000000",
     "line_item_currency_code": "USD"
  }
*/
const buildCostItems = (headers, results) =>
  results.map((result) => {
    const mergedResult = {};
    R.split(',', R.replace(/"/g, '', result)).map((item, index) => {
      if (headers[index] === 'cost') {
        mergedResult[`${headers[index]}`] = parseFloat(item).toFixed(2);
      } else if(headers[index] === 'region') {
        // global services such as S3 often have two line items, one in the region you created the bucket and then us-east-1.
        // These cases return a string that is delimited with `|`, i.e., `region: eu-west-1|us-east-1`, that must be parsed.
        const parsed = item.split('|');
        mergedResult[`${headers[index]}`] = parsed.length > 1 ? R.head(R.reject(x => x === 'us-east-1', parsed)) : R.head(parsed);
      } else {
        mergedResult[`${headers[index]}`] = item;
      }
    });
    return mergedResult;
  });

// Counts up the total cost of items returned by Athena in the S3 result csv.
const buildTotalCost = async (headers, query) => {
  return  Promise.resolve(createObjectReadStream(s3, query.bucket, query.key))
    .then(createReadlineInterface)
    .then((rl) =>
      most
        .fromEvent('line', rl)
        .until(most.fromEvent('close', rl))
        .skip(1)
        .reduce((acc, item) => {
            return parseFloat((acc + getCostOfItem(headers, item)).toFixed(2));
        }, 0)
    );
};

//Counts the number of results returned by Athena in the S3 result csv.
const getResultCount = async (query) => {
  return Promise.resolve(createObjectReadStream(s3, query.bucket, query.key))
    .then(createReadlineInterface)
    .then((rl) =>
      most
        .fromEvent('line', rl)
        .until(most.fromEvent('close', rl))
        .skip(1)
        .reduce((acc, _) => acc + 1, 0)
    );
};

// Creates the header row that includes the column names returned in the Athena result
const buildHeaderRow = async (query) => {
  return Promise.resolve(createObjectReadStream(s3, query.bucket, query.key))
    .then(createReadlineInterface)
    .then((rl) =>
      most
        .fromEvent('line', rl)
        .until(most.fromEvent('close', rl))
        .slice(0, 1)
        .reduce((acc, item) => {
          acc.push(...R.split(',', R.replace(/"/g, '', item)));
          return acc;
        }, [])
    );
};

// Creates and returns an array of cost items requested in the API.
const buildItems = async (query) => {
  return Promise.resolve(createObjectReadStream(s3, query.bucket, query.key))
    .then(createReadlineInterface)
    .then((rl) =>
      most
        .fromEvent('line', rl)
        .until(most.fromEvent('close', rl))
        .skip(1)
        .slice(query.pagination.start, query.pagination.end)
        .reduce((acc, item) => {
            acc.push(item);
            return acc;
        }, [])
    );
};

/* 
  If queryDetails exists then we enrich it with more data about what is being returned else 
  it will return the data to be used as the queryDetails response attribute.
*/
const enrichQueryDetails = async (query, queryDetails) => {
  const enrichedQueryDetails = {
    resultCount: await getResultCount(query),
    pagination: query.pagination,
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
async function fetchPaginatedResults(query) {
  const headers = await buildHeaderRow(query);
  const items = await buildItems(query);
  const result = {
    costItems: buildCostItems(headers, items),
    queryDetails: await enrichQueryDetails(query, query.queryDetails),
  };
  return result;
}

/*
  Provided with a query object containing details of the Athena query. It will build and return the response object to be returned to the client
*/
async function readResultsFromS3(query) {
  const [headers, results, queryDetails] = await Promise.all([
    buildHeaderRow(query),
    buildItems(query),
    enrichQueryDetails(query, query.queryDetails),
  ]);

  return {
    totalCost: await buildTotalCost(headers, query),
    costItems: buildCostItems(headers, results),
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
function getCost(sqlQuery, { pagination = {start: 0, end: 10} }, attempts = 0) {
  return Promise.resolve(athenaExpress.query(sqlQuery))
    .then(buildQueryDetails)
    .then((query) =>
      readResultsFromS3({
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
        return getCost(sqlQuery, { pagination }, attempts + 1);
      } else {
        console.error(err);
        return err;
      }
    });
}

const cache = {};
async function getRegions() {
  // make call to aws api to get regions
  const { Regions } = await ec2.describeRegions({}).promise();
  return R.pluck('RegionName', Regions);
}

exports.handler = async (event, context) => {
  const args = event.arguments;
  if (R.isNil(cache.regions)) cache.regions = await getRegions();
  switch (event.info.fieldName) {
    case 'readResultsFromS3':
      return fetchPaginatedResults({ ...args.s3Query });
    case 'getResourcesByCostByDay':
      return getCost(
        athenaQueryBuilder.byResourceIdOrderedByDayQuery({
          cache,
          athenaTableName,
          ...args.costForResourceQueryByDay,
        }),
        { athenaTableName, ...args.costForResourceQueryByDay }
      );
    case 'getResourcesByCost':
      return getCost(
        athenaQueryBuilder.getResourcesByCostQuery({
          cache,
          athenaTableName,
          ...args.resourcesByCostQuery,
        }),
        { athenaTableName, ...args.resourcesByCostQuery }
      );
    case 'getCostForResource':
      return getCost(
        athenaQueryBuilder.byResourceIdQuery({
          cache,
          athenaTableName,
          ...args.costForResourceQuery,
        }),
        { athenaTableName, ...args.costForResourceQuery }
      );
    case 'getCostForService':
      return getCost(
        athenaQueryBuilder.byServiceQuery({
          cache,
          athenaTableName,
          ...args.costForServiceQuery,
        }),
        { athenaTableName, ...args.costForServiceQuery }
      );
    default:
      return Promise.reject('Unknown field, unable to resolve ' + event.field);
  }
};
