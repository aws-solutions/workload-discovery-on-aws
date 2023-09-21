/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addAccounts = /* GraphQL */ `
  mutation AddAccounts($accounts: [AccountInput]!) {
    addAccounts(accounts: $accounts) {
      unprocessedAccounts
    }
  }
`;
export const deleteRelationships = /* GraphQL */ `
  mutation DeleteRelationships($relationshipIds: [String]!) {
    deleteRelationships(relationshipIds: $relationshipIds)
  }
`;
export const deleteResources = /* GraphQL */ `
  mutation DeleteResources($resourceIds: [String]!) {
    deleteResources(resourceIds: $resourceIds)
  }
`;
export const updateAccount = /* GraphQL */ `
  mutation UpdateAccount(
    $accountId: String!
    $lastCrawled: AWSDateTime
    $name: String
    $isIamRoleDeployed: Boolean
  ) {
    updateAccount(
      accountId: $accountId
      lastCrawled: $lastCrawled
      name: $name
      isIamRoleDeployed: $isIamRoleDeployed
    ) {
      accountId
      name
      lastCrawled
    }
  }
`;
export const updateRegions = /* GraphQL */ `
  mutation UpdateRegions($accountId: String!, $regions: [RegionInput]!) {
    updateRegions(accountId: $accountId, regions: $regions) {
      accountId
      name
      organizationId
      isIamRoleDeployed
      isManagementAccount
      regions {
        name
        lastCrawled
      }
      lastCrawled
    }
  }
`;
export const addRegions = /* GraphQL */ `
  mutation AddRegions($accountId: String!, $regions: [RegionInput]!) {
    addRegions(accountId: $accountId, regions: $regions) {
      accountId
      name
      organizationId
      isIamRoleDeployed
      isManagementAccount
      regions {
        name
        lastCrawled
      }
      lastCrawled
    }
  }
`;
export const addRelationships = /* GraphQL */ `
  mutation AddRelationships($relationships: [RelationshipInput]!) {
    addRelationships(relationships: $relationships) {
      id
      label
      source {
        id
        label
      }
      target {
        id
        label
      }
    }
  }
`;
export const addResources = /* GraphQL */ `
  mutation AddResources($resources: [ResourceInput]!) {
    addResources(resources: $resources) {
      id
      label
    }
  }
`;
export const indexResources = /* GraphQL */ `
  mutation IndexResources($resources: [ResourceInput]!) {
    indexResources(resources: $resources) {
      unprocessedResources
    }
  }
`;
export const deleteIndexedResources = /* GraphQL */ `
  mutation DeleteIndexedResources($resourceIds: [String]!) {
    deleteIndexedResources(resourceIds: $resourceIds) {
      unprocessedResources
    }
  }
`;
export const updateResources = /* GraphQL */ `
  mutation UpdateResources($resources: [ResourceInput]!) {
    updateResources(resources: $resources) {
      id
      label
    }
  }
`;
export const updateIndexedResources = /* GraphQL */ `
  mutation UpdateIndexedResources($resources: [ResourceInput]!) {
    updateIndexedResources(resources: $resources) {
      unprocessedResources
    }
  }
`;
export const deleteRegions = /* GraphQL */ `
  mutation DeleteRegions($accountId: String!, $regions: [RegionInput]!) {
    deleteRegions(accountId: $accountId, regions: $regions) {
      accountId
      name
      organizationId
      isIamRoleDeployed
      isManagementAccount
      regions {
        name
        lastCrawled
      }
      lastCrawled
    }
  }
`;
export const deleteAccounts = /* GraphQL */ `
  mutation DeleteAccounts($accountIds: [String]!) {
    deleteAccounts(accountIds: $accountIds) {
      unprocessedAccounts
    }
  }
`;
