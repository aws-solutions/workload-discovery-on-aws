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
export const getRelationships = /* GraphQL */ `
  query GetRelationships($pagination: Pagination) {
    getRelationships(pagination: $pagination) {
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
export const getResourceGraph = /* GraphQL */ `
  query GetResourceGraph($ids: [String]!, $pagination: Pagination) {
    getResourceGraph(ids: $ids, pagination: $pagination) {
      nodes {
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
      edges {
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
  }
`;
export const getLinkedNodesHierarchy = /* GraphQL */ `
  query GetLinkedNodesHierarchy($id: String!) {
    getLinkedNodesHierarchy(id: $id) {
      id
      label
      type
      data {
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
      children {
        id
        label
        type
        data {
          id
          label
          md5Hash
        }
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
        children {
          id
          label
          type
          md5Hash
          parent
        }
        parent
      }
      parent
    }
  }
`;
export const batchGetLinkedNodesHierarchy = /* GraphQL */ `
  query BatchGetLinkedNodesHierarchy($ids: [String]!) {
    batchGetLinkedNodesHierarchy(ids: $ids) {
      hierarchies {
        parentId
        hierarchy {
          id
          label
          type
          md5Hash
          parent
        }
      }
      notFound
      unprocessedResources
    }
  }
`;
export const getResourcesMetadata = /* GraphQL */ `
  query GetResourcesMetadata {
    getResourcesMetadata {
      count
      accounts {
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
export const getAccounts = /* GraphQL */ `
  query GetAccounts {
    getAccounts {
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
        pagination {
          start
          end
        }
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
        pagination {
          start
          end
        }
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
        pagination {
          start
          end
        }
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
        pagination {
          start
          end
        }
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
        pagination {
          start
          end
        }
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
export const searchResources = /* GraphQL */ `
  query SearchResources(
    $text: String!
    $pagination: Pagination
    $resourceTypes: [String]
    $accounts: [AccountInput]
  ) {
    searchResources(
      text: $text
      pagination: $pagination
      resourceTypes: $resourceTypes
      accounts: $accounts
    ) {
      count
      resources {
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
  }
`;
export const exportToDrawIo = /* GraphQL */ `
  query ExportToDrawIo($nodes: [drawIoNodeInput], $edges: [drawIoEdgeInput]) {
    exportToDrawIo(nodes: $nodes, edges: $edges)
  }
`;
