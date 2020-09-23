/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addAccounts = /* GraphQL */ `
  mutation AddAccounts($accounts: [AccountInput]) {
    addAccounts(accounts: $accounts) {
      unprocessedAccounts
    }
  }
`;
export const updateAccount = /* GraphQL */ `
  mutation UpdateAccount($accountId: String!, $lastCrawled: AWSDateTime) {
    updateAccount(accountId: $accountId, lastCrawled: $lastCrawled) {
      accountId
      regions {
        name
        lastCrawled
      }
      lastCrawled
    }
  }
`;
export const updateRegions = /* GraphQL */ `
  mutation UpdateRegions($accountId: String!, $regions: [RegionInput]!) {
    updateRegions(accountId: $accountId, regions: $regions) {
      accountId
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
      regions {
        name
        lastCrawled
      }
      lastCrawled
    }
  }
`;
export const deleteRegions = /* GraphQL */ `
  mutation DeleteRegions($accountId: String!, $regions: [RegionInput]!) {
    deleteRegions(accountId: $accountId, regions: $regions) {
      accountId
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
