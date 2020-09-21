/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = /* GraphQL */ `
  query GetAccount($accountId: String!) {
    getAccount(accountId: $accountId) {
      accountId
      regions {
        name
        lastCrawled
      }
      lastCrawled
    }
  }
`;
export const getAccounts = /* GraphQL */ `
  query GetAccounts {
    getAccounts {
      accountId
      regions {
        name
        lastCrawled
      }
      lastCrawled
    }
  }
`;
