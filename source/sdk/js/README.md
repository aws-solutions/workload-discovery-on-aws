# Workload Discovery JavaScript SDK

## Overview

This is the JavaScript SDK for Workload Discovery on AWS. It allows users to invoke Workload Discovery GraphQL 
queries and mutations with simple JavaScript functions. The signing of requests is handled internally by the SDK 
client and there is no requirement to write raw GraphQL.

## Installation

Using npm:

```shell
mpn install @aws/workload-discovery-sdk
```

Using Yarn:

```shell
yarn install @aws/workload-discovery-sdk
```

## Prerequisites

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed.
2. [Node.js](https://nodejs.org/en/) installed
3. The CLI [configured](https://docs.aws.amazon.com/cli/latest/reference/configure/) with credentials/profile that will allow:
    * CloudFormation DescribeStacks

The SDK requires the AppSync URL for your Workload Discovery Deployment and the cross account discovery mode.

To retrieve the AppSync API, run the following AWS CLI command:

```shell
aws cloudformation describe-stacks --stack-name <workload-discovery-stack-name> --query 'Stacks[0].Outputs[?OutputKey==`WebUiUrl`].OutputValue | [0]' --region <wd-region>
```

To retrieve the cross account discovery mode:

```shell
aws cloudformation describe-stacks --stack-name <workload-discovery-stack-name> --query 'Stacks[0].Parameters[?ParameterKey==`CrossAccountDiscovery`].ParameterValue | [0]' --region <wd-region>
```

Furthermore, your program must be ran with an IAM role that has the required AppSync permissions (see [Required AppSync IAM policy](#required-appsync-iam-policy)).

## Supported Operations

The SDK does not provide access to all Workload Discovery APIs. Specifically, all mutations that write to the
Neptune or OpenSearch databases are not supported. 

When the cross account discovery mode is set to `AWS_ORGANIZATIONS`, all mutations relating to account management 
are also unavailable for use.

## Usage

### Client Instantiation

Use the provided factory function to create the client. The SDK supports both CommonJS and ESM.

```js
// ESM
import {createClient} from '@aws/workload-discovery-sdk'

// CommonJS
const {createClient} = require('@aws/workload-discovery-sdk');

const client = createClient({
    apiUrl: '<wd-appsync-ulr>',
    crossAccountDiscovery: 'AWS_ORGANIZATIONS | SELF_MANAGED'
})
```

Optionally, you can provide AWS credentials: if these are not provided, the SDK will use the [AWS Credentials
Provider Chain](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

```js
const client = createClient({
    apiUrl: '<wd-appsync-ul>',
    crossAccountDiscovery: 'AWS_ORGANIZATIONS | SELF_MANAGED',
    credentials: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        sessionToken: 'optionalSessionToken'
    }
})
```

### Queries and Mutations

To run a predefined query or mutation, use the functions provided by the client. The predefined queries and mutations 
return all the fields associated with the return type of the operation.

```js
const accounts = await client.getAccounts();

const s3Buckets = await client.getResources({
    resourceTypes: ['AWS::S3::Bucket']
});
```

It is also possible to supply custom GraphQL using the `sendRequest` function.

```js
const s3BucketIds = await client.sendRequest(`
  query S3BucketIdQuery(
    $pagination: Pagination
    $resourceTypes: [String]
    $accounts: [AccountInput]
  ) {
    getResources(
      pagination: $pagination
      resourceTypes: $resourceTypes
      accounts: $accounts
    ) {
      id
    }
  }
`, {resourceTypes: ['AWS::S3::Bucket']})
```

The `sendRequest` function is curried, so reusable functions can be created by supplying
the `query` argument and using the returned function.

```js
const getResourceIds = client.sendRequest(`
  query ResourceIdQuery(
    $pagination: Pagination
    $resourceTypes: [String]
    $accounts: [AccountInput]
  ) {
    getResources(
      pagination: $pagination
      resourceTypes: $resourceTypes
      accounts: $accounts
    ) {
      id
    }
  }
`)

const ec2InstanceIds = await getResourceIds({resourceTypes: ['AWS::EC2::Instance']});

const dbInstanceIds = await getResourceIds({resourceTypes: ['AWS::RDS::DBInstance']});

// Operations created with sendQuery that have no arguments must be provided with an empty parameters object
const allIds = await getResourceIds({});
```

Several of the queries are paginated: the SDK provides a `createPaginator` function to create an async iterator that
allows you to page through the results using a `for await...of` loop:

```js
import {createClient, createPaginator} from '@aws/workload-discovery-sdk'

// ...

// Note that if the query passed to createPaginator is not a paginated API, an error will be thrown
// once it enters the for loop
const getResourcesPaginator = createPaginator(client.getResources, {pageSize: 500});

const s3Buckets = [];

for await(page of getResourcesPaginator({resourceTypes: ['AWS::S3::Bucket']})) {
    s3Buckets.push(...page);
}
```

It is possible that setting a page size that is too large will result in a `Function.ResponseSizeTooLarge` error 
from the lambda function serving the request. In this case, the paginator will automatically halve the page size
and retry the request. It will continue to do this until the request succeeds. It will then revert to the original
page size for the subsequent request.

For a full list of the available functions, see the [API](#api) section.

## Examples

Import a list of accounts and deploy the Workload Discovery global and regional resources in each account 
with CloudFormation:

```js
import {createClient, createPaginator} from '@aws/workload-discovery-sdk';
import {STS} from '@aws-sdk/client-sts';
import {CloudFormation} from '@aws-sdk/client-cloudformation';

const {
    getRegion, addAccounts, getGlobalTemplate, getRegionalTemplate
} = createClient({
    apiUrl: '<wd-appsync-ulr>',
    crossAccountDiscovery: 'SELF_MANAGED'
});

const accounts = [
    {accountId: 123456789012, name: 'Account 1', regions: [{name: 'eu-west-1'}]},
    {accountId: 987654321098, name: 'Account 2', regions: [{name: 'us-east-1'}, {name: 'eu-west-1'}]}
]

const [GLOBAL_TEMPLATE, REGIONAL_TEMPLATE] = await Promise.all([
    getGlobalTemplate(),
    getRegionalTemplate()
]);

async function deployGlobalTemplate(account) {
    const {accountId} = account;
    // this will use the IAM role the script is running as so it must have sts:assumeRole permissions
    const sts = new STS({region: getRegion()});
    const {Credentials} = await sts.assumeRole({
            // This role must be exist in the target account with permissions to create an IAM role and
            // a CloudFormation stack
            RoleArn: '<target-account-role-arn>',
            RoleSessionName: `global-resources-session-${accountId}`
        }
    );

    const cfnClient = new CloudFormation({
        credentials: {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken
        },
        region: getRegion() // the global resource stack will be installed in the same region as Workload Discovery
    });

    return cfnClient.createStack({
        StackName: `workload-discovery-global-resources`,
        TemplateBody: GLOBAL_TEMPLATE,
        Capabilities: ['CAPABILITY_IAM']
    })
}

async function deployRegionalTemplates(account) {
    const {accountId, regions} = account;
    // this will use the IAM role the script is running as so it must have sts:assumeRole permissions
    const sts = new STS({region: getRegion()});
    const {Credentials} = await sts.assumeRole({
            // This role must exist in the target account and have permissions to create an IAM role,
            // AWS Config recorder, AWS Config delivery channel, AWS Config aggregation authorization,
            // Amazon S3 Bucket, Amazon S3 bucket policy and a CloudFormation stack
            RoleArn: '<target-account-role-arn>',
            RoleSessionName: `regional-resources-session-${accountId}`
        }
    );

    return Promise.all(regions.map(region => {
        const cfnClient = new CloudFormation({
            credentials: {
                accessKeyId: Credentials.AccessKeyId,
                secretAccessKey: Credentials.SecretAccessKey,
                sessionToken: Credentials.SessionToken
            },
            region: region.name
        });

        return cfnClient.createStack({
            StackName: `workload-discovery-regional-resources`,
            TemplateBody: REGIONAL_TEMPLATE,
            Parameters: [
                {ParameterKey: 'AggregationRegion', ParameterValue: getRegion()},
                {ParameterKey: 'AlreadyHaveConfigSetup', ParameterValue: 'No'}
            ],
            Capabilities: ['CAPABILITY_IAM']
        })
    }));
}

await addAccounts({accounts});

await Promise.all(accounts.map(deployGlobalTemplate));

await Promise.all(accounts.map(deployRegionalTemplates));
```

Find the relationships of tagged lambda functions:

```js
import {createClient} from '@aws/workload-discovery-sdk';

const {
    searchResources, getResourceGraph
} = createClient({
    apiUrl,
    crossAccountDiscovery: 'SELF_MANAGED'
});

const tags = await searchResources({
    text: 'tagName tagValue',
    resourceTypes: ['AWS::Tags::Tag']
});

const tagResourceGraph = await getResourceGraph({
    ids: [
        tags.resources[0].id
    ]
});

const lambdaIds = tagResourceGraph.nodes
    .filter(x => x.properties.resourceType === 'AWS::Lambda::Function')
    .map(x => x.id)

const lambdaRelationships = await getResourceGraph({
    ids: lambdaIds
});
```

Find costs for all EC2 instances over a period of one week:

```js
import {createClient} from '@aws/workload-discovery-sdk';

const {
    getResources, getCostForResource
} = createClient({
    apiUrl: '<wd-appsync-ulr>',
    crossAccountDiscovery: 'SELF_MANAGED'
});

const getResourcesPaginator = createPaginator(getResources, {pageSize: 100});

const ec2Instances = [];

for await(const resources of getResourcesPaginator({resourceTypes: ['AWS::EC2::Instance']})) {
    ec2Instances.push(...resources);
}

const getCostForResourcePaginator = createPaginator(getCostForResource, {pageSize: 100});

const costs = [];

const costForResourceQuery = {
    period: {
        from: '2023-03-01',
        to: '2023-03-08'
    },
    resourceIds: ec2Instances.map(x => x.properties.resourceId)
}

for await(const {costItems} of getCostForResourcePaginator({costForResourceQuery})) {
    costs.push(...costItems);
}
```

## API

### Types

#### Account

```js
{
    accountId: String,
    name: String,
    organizationId: String,
    isIamRoleDeployed: Boolean,
    isManagementAccount: Boolean,
    regions: [Region],
    lastCrawled: DateString,
}
```

#### Cost

```js
{
  totalCost: Float,
  costItems: [CostItem]
}
```

#### CostForResourceQueryByDay

```js
{
    resourceIds: [String],
    period: {to: DateString, from: DateString},
    pagination: Pagination
}
```

#### CostForResourceQuery

```js
{
    resourceIds: [String],
    period: {to: DateString, from: DateString},
    pagination: Pagination
}
```

#### CostForServiceQuery

```js
{
    accountIds: [String],
    regions: [String],
    serviceName: String,
    period: {to: DateString, from: DateString},
    pagination: Pagination
}
```

#### CostItem

```js
{
    line_item_resource_id: String,
    product_servicename: String,
    line_item_usage_start_date: String,
    line_item_usage_account_id: String,
    region: String,
    pricing_term: String,
    cost: Float,
    line_item_currency_code: String,
}
```

#### DrawIoEdge

```js
{
    id: String,
    source: String,
    target: String
}
```

#### DrawIoNode

```js
{
    id: String,
    parent: String,
    level: Int,
    title: String,
    label: String,
    type: String,
    image: String,
    hasChildren: Boolean,
    position: {
        x: Float
        y: Float
    }
}
```

#### Pagination

```js
{
    start: Int, 
    end: Int
}
```

#### Relationship
```js
{
    id: String,
    label: String,
    source: {
        id: String,
        label: String
    },
    target: {
        id: String,
        label: String
    }
}
```

#### Resource
```js
{
    id: String,
    label: String,
    md5Hash: String,
    properties: {
        accountId: String,
        arn: String,
        availabilityZone: String,
        awsRegion: String,
        configuration: JsonString,
        configurationItemCaptureTime: String,
        configurationItemStatus: String,
        configurationStateId: String,
        resourceCreationTime: String,
        resourceId: String,
        resourceName: String,
        resourceType: String,
        supplementaryConfiguration: JsonString,
        tags: String,
        version: String,
        vpcId: String,
        subnetId: String,
        subnetIds: String,
        resourceValue: String,
        state: String,
        private: String,
        loggedInURL: String,
        loginURL: String,
        title: String,
        dBInstanceStatus: String,
        statement: String,
        instanceType: String
    }
}
```

#### ResourcesByCostQuery

```js
{
    accountIds: [String],
    regions: [String],
    period: {to: DateString, from: DateString},
    pagination: Pagination
}
```

### Client

```js
createClient({apiUrl: String, crossAccountDiscovery: String}) => Object
```

Factory function that creates an instance of the SDK client.

### Queries

```js
exportToDrawIo({nodes: [DrawIoNode], edges: [DrawIoEdge]}) => Promise UrlString
```

Export a diagram to diagrams.net (formerly named draw.io)

```js
getAccount({accountId: String}) => Promise Account
```

Returns a single account of type [Account](#account).

```js
getAccount({accountIds: [String]}) => Promise [Account]
```

Returns all imported accounts in a list of type [Account](#account).

```js
getCostForResource({costForResourceQuery: CostForResourceQuery}) => Promise Cost
```

Gets the [cost](#cost) for a list of resources given their resourceIds or ARNs. Default pagination is 10 elements. 
When the `costItems` list is empty, the pagination is complete.

```js
getCostForService({costForServiceQuery: CostForServiceQuery} => Promise Cost
```

Gets the [cost](#cost) for an AWS Service. Default pagination is 10 elements. When the
`costItems` list is empty, the pagination is complete.

```js
getGlobalTemplate() => String
```

Gets the global CloudFormation template for account importing.

```js
getRegionalTemplate() => String
```

Gets the regional CloudFormation template for account importing.

```js
getRelationships({pagination: Pagination}) => Promise [Relationship]
```
Returns a list of type [Relationship](#relationship) from Neptune. Default pagination is 1000 elements. 
When the returned list is empty, the pagination is complete.

```js
getResourceGraph({ids: [String]!, pagination: Pagination}) => Promise {nodes: [Resource], edges: [Relationship]}
```

Returns a list of type [Resource](#Resource) and a list of type [Relationship](#relationship) containing the
related nodes and edges of the resources specified by the supplied IDs. Default pagination is 1000 elements and
applies to both the `nodes` and `edges` lists. When both lists are empty, the pagination is complete.

```js
getResources({
    resourceTypes : [String], 
    pagination: Pagination, 
    accounts: [{accountId: String, regions: [{name: String}]}]
}) => Promise [Resource]
```
Returns a list of type [Resource](#resource) from Neptune.  If `resourceTypes` is
absent then all resource types will be returned. If `accounts` is absent then resources from all accounts will be 
returned. If `regions` is absent in an account object then resources from all regions in that account will 
be returned. Default pagination is 1000 elements. When the returned list is empty, the pagination is complete.

```js
getResourcesByCost({resourcesByCostQuery: ResourcesByCostQuery}) => Promise Cost
```

Gets the [cost](#cost) of resources ordered from highest to lowest. Default pagination is 10 elements. When the
`costItems` list is empty, the pagination is complete.

```js
getResourcesByCostByDay({costForResourceQueryByDay: CostForResourceQueryByDay}) => Promise Cost
```

Gets [cost](#cost) for the provided resource ARNs broken down by day. Default pagination is 10 elements. When the
`costItems` list is empty, the pagination is complete.

```js
getResourcesAccountMetadata(accounts: [Account]): => Promise [{
    count: Int,
    accountId: [Account],
    resourceTypes: [{count: Int, type: String}]    
}]
```

Returns a list of resource counts and resource types grouped by each account specified in 
`accounts`. If `accounts` is absent then metadata for all accounts will be returned.

```js
getResourcesMetadata() => Promise {
    count: Int,
    accounts: [Account],
    resourceTypes: [{count: Int, type: String}]
}
```

Gets resource counts grouped by resource type and a list of all accounts and associated regions.

```js
getResourcesRegionMetadata(accounts: [Account]) => Promise [{
    count: Int,
    accountId: [Account],
    regions: [{
        count: Int, 
        name: String, 
        resourceTypes: [{count: Int, type: String}]
    }]    
}]
```

Returns a list of resource counts grouped by account and region where each region contains a list of resource
types. If `accounts` is absent then metadata for all accounts will be returned.

```js
searchResources({
    text: String, 
    resourceTypes : [String], 
    pagination: Pagination, 
    accounts: [{accountId: String, regions: [{name: String}]}]}
) => Promise {count: Int, resources: [Resource]}
```
Provides a free text search, returning the resource count and a list of type [Resource](#resource) from OpenSearch.  
If `resourceTypes`is absent then all resource types will be returned. If `accounts` is absent then resources from 
all accounts will be returned. If `regions` is absent in an account object then resources from all regions 
in that account will be returned. Default pagination is 1000 elements. When the `resources` list is empty, the 
pagination is complete.

### Mutations

These functions are only available when the cross account discovery mode is set to `SELF_MANAGED`.

```js
addAccounts(accounts: [Account]) => Promise {unprocessedAccounts: [String]}
```

Imports accounts to be discovered. Returns a list of unprocessed account IDs to allow the client to retry in case of
errors.

```js
addRegions({
    accountId: String, 
    regions: [{name: String, lastCrawled: DateString}]}
) => Promise Account
```
Add regions to a specific account.

```js
deleteAccounts(accountIds: [String]) => Promise {unprocessedAccounts: [String]}
```

Deletes accounts. Returns a list of unprocessed account IDs to allow the client to retry in case of
errors.

```js
deleteRegions({
    accountId: String, 
    regions: [{name: String, lastCrawled: DateString}]}
) => Promise Account
```
Delete regions from a specific account.

```js
updateAccount({
  accountId: String,
  lastCrawled: DateString,
  name: String,
  isIamRoleDeployed: Boolean
}) => Promise {accountId: String, name: String, lastCrawled: DateString} 
```
Updates the top level fields in an account.

```js
updateRegions({
    accountId: String, 
    regions: [{name: String, lastCrawled: DateString}]}
) => Promise Account
```
Update regions of a specific account.

### Utils

```js
createPaginator(query: Function, {pageSize: Int}) => Async Generator
```

Creates a paginator from an SDK query or mutation that can be used in a `for await...of` loop. This function will
throw and error if the query passed to it is not paginated.

```js
getRegion() => String
```

This function retrieves the Workload Discovery region the client infers from `apiUrl`.

```js
sendRequest(query: GraphQLString, variables: Object) => Promise Response
```

Executes an arbitrary GraphQL query, interpolating any variables. This function is curried.

## Required AppSync IAM policy

You must have the following permissions attached to the IAM role your program assumes:

```json
{
  "PolicyName": "access-appsync",
  "PolicyDocument": {
    "Version": "2012-10-17T00:00:00.000Z",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "appsync:GraphQL"
        ],
        "Resource": "<wd-appsync-arn>/*"
      }
    ]
  }
} 
```

Administrators can further control what queries and mutations may be invoked by scoping the `Resources` field 
for the `appsync:GraphQL` action:

```json
"Resource": [
    "<wd-appsync-arn>/types/Query/fields/getResources",
    "<wd-appsync-arn>/types/Mutation/fields/addAccounts"
]

```

To retrieve the AppSync API ARN, run the following CLI command:

```shell
aws cloudformation describe-stacks --stack-name <workload-discovery-stack-name> --query 'Stacks[0].Outputs[?OutputKey==`AppSyncArn`].OutputValue | [0]'
```