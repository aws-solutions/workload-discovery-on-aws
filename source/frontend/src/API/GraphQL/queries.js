// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getResources = /* GraphQL */ `
  query GetResources(
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
        configurationItemStatus
        configurationStateId
        resourceCreationTime
        resourceId
        resourceName
        resourceType
        supplementaryConfiguration
        tags
        version
        vpcId
        subnetId
        subnetIds
        resourceValue
        state
        private
        loggedInURL
        loginURL
        title
        dBInstanceStatus
        statement
        instanceType
      }
    }
  }
`;
// this query has not been autogenerated and must be manually created
export const getLinkedNodesHierarchy = /* GraphQL */ `
    query GetLinkedNodesHierarchy($id: String!) {
        getLinkedNodesHierarchy(id: $id) {
            label
            type
            children {
                ...NodeProps
                children {
                    ...NodeProps
                    children {
                        ...NodeProps
                        children {
                            ...NodeProps
                            children {
                                ...NodeProps
                                children {
                                    ...NodeProps
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fragment NodeProps on Hierarchy {
        id
        label
        parent
        type
        data {
            properties {
                ...AllProps
            }
            id
            label
        }
        properties {
            ...AllProps
        }
    }

    fragment AllProps on ResourceProperties {
        accountId
        arn
        configuration
        awsRegion
        availabilityZone
        vpcId
        subnetId
        loggedInURL
        loginURL
        private
        resourceId
        resourceName
        resourceType
        resourceValue
        state
        tags
        title
        instanceType
        statement
        dBInstanceStatus
    }
`;

// this query has not been autogenerated and must be manually created
export const batchGetLinkedNodesHierarchy = /* GraphQL */ `
    query BatchGetLinkedNodesHierarchy($ids: [String]!) {
        batchGetLinkedNodesHierarchy(ids: $ids) {
            hierarchies {
                parentId
                hierarchy {
                    label
                    type
                    children {
                        ...NodeProps
                        children {
                            ...NodeProps
                            children {
                                ...NodeProps
                                children {
                                    ...NodeProps
                                    children {
                                        ...NodeProps
                                        children {
                                            ...NodeProps
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            notFound
            unprocessedResources
        }
    }

    fragment NodeProps on Hierarchy {
        id
        label
        parent
        type
        data {
            properties {
                ...AllProps
            }
            id
            label
        }
        properties {
            ...AllProps
        }
    }

    fragment AllProps on ResourceProperties {
        accountId
        arn
        configuration
        awsRegion
        availabilityZone
        vpcId
        subnetId
        loggedInURL
        loginURL
        private
        resourceId
        resourceName
        resourceType
        resourceValue
        state
        tags
        title
        instanceType
        statement
        dBInstanceStatus
    }
`;

export const getResourcesMetadata = /* GraphQL */ `
  query GetResourcesMetadata {
    getResourcesMetadata {
      count
      accounts {
          accountId
          regions {
              name
          }
      } 
      resourceTypes {
        count
        type
      }
    }
  }
`;
export const getResourcesAccountMetadata = /* GraphQL */ `
  query GetResourcesAccountMetadata($accounts: [AccountInput]) {
    getResourcesAccountMetadata(accounts: $accounts) {
      accountId
      count
      resourceTypes {
        count
        type
      }
    }
  }
`;
// this query has not been autogenerated and must be manually created
export const getResourcesRegionMetadata = /* GraphQL */ `
    query GetResourcesRegionMetadata($accounts: [AccountInput]) {
        getResourcesRegionMetadata(accounts: $accounts) {
            accountId
            count
            regions {
                count
                name
                resourceTypes {
                    count
                    type
                }
            }
        }
    }
`;
export const getAccount = /* GraphQL */ `
  query GetAccount($accountId: String!) {
    getAccount(accountId: $accountId) {
      accountId
      name
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
      name
      regions {
        name
        lastCrawled
      }
      lastCrawled
    }
  }
`;
export const readResultsFromS3 = /* GraphQL */ `
  query ReadResultsFromS3($s3Query: S3Query) {
    readResultsFromS3(s3Query: $s3Query) {
      totalCost
      costItems {
        line_item_resource_id
        product_servicename
        line_item_usage_start_date
        line_item_usage_account_id
        region
        pricing_term
        cost
        line_item_currency_code
      }
      queryDetails {
        cost
        s3Bucket
        s3Key
        dataScannedInMB
        resultCount
      }
    }
  }
`;
export const getCostForService = /* GraphQL */ `
  query GetCostForService($costForServiceQuery: CostForServiceQuery) {
    getCostForService(costForServiceQuery: $costForServiceQuery) {
      totalCost
      costItems {
        line_item_resource_id
        product_servicename
        line_item_usage_start_date
        line_item_usage_account_id
        region
        pricing_term
        cost
        line_item_currency_code
      }
      queryDetails {
        cost
        s3Bucket
        s3Key
        dataScannedInMB
        resultCount
      }
    }
  }
`;
export const getCostForResource = /* GraphQL */ `
  query GetCostForResource($costForResourceQuery: CostForResourceQuery) {
    getCostForResource(costForResourceQuery: $costForResourceQuery) {
      totalCost
      costItems {
        line_item_resource_id
        product_servicename
        line_item_usage_start_date
        line_item_usage_account_id
        region
        pricing_term
        cost
        line_item_currency_code
      }
      queryDetails {
        cost
        s3Bucket
        s3Key
        dataScannedInMB
        resultCount
      }
    }
  }
`;
export const getResourcesByCost = /* GraphQL */ `
  query GetResourcesByCost($resourcesByCostQuery: ResourcesByCostQuery) {
    getResourcesByCost(resourcesByCostQuery: $resourcesByCostQuery) {
      totalCost
      costItems {
        line_item_resource_id
        product_servicename
        line_item_usage_start_date
        line_item_usage_account_id
        region
        pricing_term
        cost
        line_item_currency_code
      }
      queryDetails {
        cost
        s3Bucket
        s3Key
        dataScannedInMB
        resultCount
      }
    }
  }
`;
export const getResourcesByCostByDay = /* GraphQL */ `
  query GetResourcesByCostByDay(
    $costForResourceQueryByDay: CostForResourceQueryByDay
  ) {
    getResourcesByCostByDay(
      costForResourceQueryByDay: $costForResourceQueryByDay
    ) {
      totalCost
      costItems {
        line_item_resource_id
        product_servicename
        line_item_usage_start_date
        line_item_usage_account_id
        region
        pricing_term
        cost
        line_item_currency_code
      }
      queryDetails {
        cost
        s3Bucket
        s3Key
        dataScannedInMB
        resultCount
      }
    }
  }
`;
export const getGlobalTemplate = /* GraphQL */ `
  query GetGlobalTemplate {
    getGlobalTemplate
  }
`;
export const getRegionalTemplate = /* GraphQL */ `
  query GetRegionalTemplate {
    getRegionalTemplate
  }
`;
export const exportToDrawIo = /* GraphQL */ `
    query ExportToDrawIo(
        $edges: [drawIoEdgeInput],
        $nodes: [drawIoNodeInput]
    ) {
        exportToDrawIo(edges: $edges, nodes: $nodes)
    }
`;
// This query has been edited manually to remove unnecessary fields
export const searchResources = /* GraphQL */ `
    query SearchResources(
      $text: String!,
      $pagination: Pagination,
      $resourceTypes: [String],
      $accounts: [AccountInput]
    ) {
        searchResources(text: $text, pagination: $pagination, resourceTypes: $resourceTypes, accounts: $accounts) {
          count
          resources {
            id
            label
            md5Hash
            properties {
              arn
              accountId
              awsRegion
              resourceId
              resourceName
              resourceType
              title
            }
          } 
        }
    }
`;
