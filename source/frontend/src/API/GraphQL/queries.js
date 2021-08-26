/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLinkedNodesHierarchy = /* GraphQL */ `
  query GetLinkedNodesHierarchy($id: String, $arn: String) {
    getLinkedNodesHierarchy(id: $id, arn: $arn) {
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
    perspectiveBirthDate
    type
    data {
      properties {
        ...AllProps
      }
      id
      label
      perspectiveBirthDate
    }
    properties {
      ...AllProps
    }
  }

  fragment AllProps on Properties {
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
  softDelete
  state
  tags
  title
  ... on ApiGatewayMethod {
    path
  }
  ... on EC2Instance {
    instanceType
  }
  ... on IAMCustomerManagedPolicyStatement {
    statement
  }
  ... on RDSDBInstance {
    dBInstanceStatus
  }
}`;

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
      accountId,
      name,
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
        product_region
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
        product_region
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
        product_region
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
        product_region
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
        product_region
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
