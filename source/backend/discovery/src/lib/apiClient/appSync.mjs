// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';
import {request} from 'undici';
import retry from 'async-retry';
import aws4 from 'aws4';
import logger from '../logger.mjs';
import {
    CONNECTION_CLOSED_PREMATURELY,
    FUNCTION_RESPONSE_SIZE_TOO_LARGE,
    RESOLVER_CODE_SIZE_ERROR
} from '../constants.mjs';

async function sendQuery(opts, name, {query, variables = {}}) {
    const sigOptions = {
        method: 'POST',
        host: opts.host,
        region: opts.region,
        path: opts.path,
        headers: {
            'x-amzn-workload-discovery-requester': 'discovery-process'
        },
        body: JSON.stringify({
            query,
            variables
        }),
        service: 'appsync'
    };

    const sig = aws4.sign(sigOptions, opts.creds);

    return retry(async bail => {
        return request(opts.graphgQlUrl, {
            method: 'POST',
            headers: sig.headers,
            body: sigOptions.body
        }).catch(err => {
            logger.error(`Error sending gql request, ensure query is not malformed: ${err.message}`)
            bail(err);
        }).then(({body}) => body.json())
            .then((body) => {
                const {errors} = body;
                if (errors != null) {
                    if(errors.length === 1) {
                        const {message} = R.head(errors);
                        // this transient error can happen due to a bug in the Gremlin client library
                        // that the appSync lambda uses, 1 retry is normally sufficient
                        if(message === CONNECTION_CLOSED_PREMATURELY) {
                            throw new Error(message);
                        }
                        if([RESOLVER_CODE_SIZE_ERROR, FUNCTION_RESPONSE_SIZE_TOO_LARGE].includes(message)) {
                            return bail(new Error(message));
                        }
                    }
                    logger.error('Error executing gql request', {errors: body.errors, query, variables})
                    return bail(new Error(JSON.stringify(errors)));
                }
                return body.data[name];
            });
    }, {
        retries: 3,
        onRetry: (err, count) => {
            logger.error(`Retry attempt for ${name} no ${count}: ${err.message}`);
        }
    });
}

function createPaginator(operation, PAGE_SIZE) {
    return async function*(args) {
        let pageSize = PAGE_SIZE;
        let start = 0;
        let end = pageSize;
        let resources = null;

        while(!R.isEmpty(resources)) {
            try {
                resources = await operation({pagination: {start, end}, ...args});
                yield resources
                start = start + pageSize;
                pageSize = PAGE_SIZE;
                end = end + pageSize;
            } catch(err) {
                if([RESOLVER_CODE_SIZE_ERROR, FUNCTION_RESPONSE_SIZE_TOO_LARGE].includes(err.message)) {
                    pageSize = Math.floor(pageSize / 2);
                    logger.debug(`Lambda response size too large, reducing page size to ${pageSize}`);
                    end = start + pageSize;
                } else {
                    throw err;
                }
            }
        }
    }
}

const getAccounts = opts => async () => {
    const name = 'getAccounts';
    const query = `
      query ${name} {
        getAccounts {
          accountId
          lastCrawled
          name
          regions {
            name
          }
        }
      }`;
    return sendQuery(opts, name, {query});
};

const addRelationships = opts => async relationships => {
    const name = 'addRelationships';
    const query = `
    mutation ${name}($relationships: [RelationshipInput]!) {
      ${name}(relationships: $relationships) {
        id
      }
    }`;
    const variables = {relationships};
    return sendQuery(opts, name, {query, variables});
};

const addResources = opts => async resources => {
    const name = 'addResources';
    const query = `
    mutation ${name}($resources: [ResourceInput]!) {
      ${name}(resources: $resources) {
        id
        label
      }
    }`;
    const variables = {resources};
    return sendQuery(opts, name, {query, variables});
};

const getResources = opts => async ({pagination, resourceTypes, accounts}) => {
    const name = 'getResources';
    const query = `
    query ${name}(
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
      label
      md5Hash
      properties {
        accountId
        arn
        availabilityZone
        awsRegion
        configuration
        configurationItemCaptureTime
        configurationStateId
        configurationItemStatus
        loggedInURL
        loginURL
        private
        resourceCreationTime
        resourceName
        resourceId
        resourceType
        resourceValue
        state
        supplementaryConfiguration
        subnetId
        subnetIds
        tags
        title
        version
        vpcId
        dBInstanceStatus
        statement
        instanceType
      }
    }
  }`;
    const variables = {pagination, resourceTypes, accounts};
    return sendQuery(opts, name, {query, variables});
};

const getRelationships = opts => async ({pagination}) => {
    const name = 'getRelationships';
    const query = `
    query ${name}($pagination: Pagination) {
      getRelationships(pagination: $pagination) {
        target {
          id
          label
        }
        id
        label
        source {
          id
          label
        }
      }
}`;
    const variables = {pagination};
    return sendQuery(opts, name, {query, variables});
};

const indexResources = opts => async resources => {
    const name = 'indexResources';
    const query = `
    mutation ${name}($resources: [ResourceInput]!) {
      ${name}(resources: $resources) {
        unprocessedResources
      }
    }`;
    const variables = {resources};
    return sendQuery(opts, name, {query, variables});
};

const updateResources = opts => async resources => {
    const name = 'updateResources';
    const query = `
    mutation ${name}($resources: [ResourceInput]!) {
      ${name}(resources: $resources) {
        id
      }
    }`;
    const variables = {resources};
    return sendQuery(opts, name, {query, variables});
};

const deleteRelationships = opts => async relationshipIds => {
    const name = 'deleteRelationships';
    const query = `
    mutation ${name}($relationshipIds: [String]!) {
      ${name}(relationshipIds: $relationshipIds)
    }`;
    const variables = {relationshipIds};
    return sendQuery(opts, name, {query, variables});
};

const deleteResources = opts => async resourceIds => {
    const name = 'deleteResources';
    const query = `
    mutation ${name}($resourceIds: [String]!) {
      ${name}(resourceIds: $resourceIds)
    }`;
    const variables = {resourceIds};
    return sendQuery(opts, name, {query, variables});
};

const deleteIndexedResources = opts => async resourceIds => {
    const name = 'deleteIndexedResources';
    const query = `
    mutation ${name}($resourceIds: [String]!) {
      ${name}(resourceIds: $resourceIds) {
        unprocessedResources
      }
    }`;
    const variables = {resourceIds};
    return sendQuery(opts, name, {query, variables});
};

const updateIndexedResources = opts => async resources => {
    const name = 'updateIndexedResources';
    const query = `
    mutation ${name}($resources: [ResourceInput]!) {
      ${name}(resources: $resources) {
        unprocessedResources
      }
    }`;
    const variables = {resources};
    return sendQuery(opts, name, {query, variables});
};

const addAccounts = opts => async accounts => {
    const name = 'addAccounts';
    const query = `
      mutation ${name}($accounts: [AccountInput]!) {
        addAccounts(accounts: $accounts) {
          unprocessedAccounts
        }
      }
`
    const variables = {accounts};
    return sendQuery(opts, name, {query, variables});
}

const updateAccount = opts => async (accountId, accountName, isIamRoleDeployed, lastCrawled, resourcesRegionMetadata) => {
    const name = 'updateAccount';
    const query = `
    mutation ${name}($accountId: String!, $name: String, $isIamRoleDeployed: Boolean, $lastCrawled: AWSDateTime, $resourcesRegionMetadata: ResourcesRegionMetadataInput) {
      ${name}(accountId: $accountId, name: $name, isIamRoleDeployed: $isIamRoleDeployed, lastCrawled: $lastCrawled, resourcesRegionMetadata: $resourcesRegionMetadata) {
        accountId
        lastCrawled
      }
    }`;
    const variables = {accountId, name: accountName, lastCrawled, isIamRoleDeployed, resourcesRegionMetadata};
    return sendQuery(opts, name, {query, variables});
};

const deleteAccounts = opts => async (accountIds) => {
    const name = 'deleteAccounts';
    const query = `
    mutation ${name}($accountIds: [String]!) {
        deleteAccounts(accountIds: $accountIds) {
            unprocessedAccounts
        }
    }`;
    const variables = {accountIds};
    return sendQuery(opts, name, {query, variables});
};

export default function(config) {
    const [host, path] = config.graphgQlUrl.replace('https://', '').split('/');

    const opts = {
        host,
        path,
        ...config
    };

    return {
        addRelationships: addRelationships(opts),
        addResources: addResources(opts),
        deleteRelationships: deleteRelationships(opts),
        deleteResources: deleteResources(opts),
        indexResources: indexResources(opts),
        addAccounts: addAccounts(opts),
        deleteAccounts: deleteAccounts(opts),
        getAccounts: getAccounts(opts),
        updateAccount: updateAccount(opts),
        updateResources: updateResources(opts),
        deleteIndexedResources: deleteIndexedResources(opts),
        updateIndexedResources: updateIndexedResources(opts),
        getResources: getResources(opts),
        getRelationships: getRelationships(opts),
        createPaginator
    };
};