// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

async function get() {
    return {
      Items: [
        {
          line_item_usage_account_id: 'XXXXXXXXXXXX',
          line_item_usage_start_date: '2020-11-22 00:00:00.000',
          line_item_usage_end_date: '2020-11-22 01:00:00.000',
          line_item_currency_code: 'USD',
          line_item_unblended_cost: 4,
          line_item_resource_id:
            'a-resource-1',
          product_region: 'ap-northeast-1',
          product_servicename: 'AWS CloudTrail',
          pricing_term: 'OnDemand',
        },
        {
          line_item_usage_account_id: 'XXXXXXXXXXXX',
          line_item_usage_start_date: '2020-11-22 00:00:00.000',
          line_item_usage_end_date: '2020-11-22 01:00:00.000',
          line_item_currency_code: 'USD',
          line_item_unblended_cost: 10,
          line_item_resource_id:
            'a-resource-1',
          product_region: 'ap-northeast-1',
          product_servicename: 'AWS CloudTrail',
          pricing_term: 'OnDemand',
        },
        {
          line_item_usage_account_id: 'XXXXXXXXXXXX',
          line_item_usage_start_date: '2020-11-22 00:00:00.000',
          line_item_usage_end_date: '2020-11-22 01:00:00.000',
          line_item_currency_code: 'USD',
          line_item_unblended_cost: 6,
          line_item_resource_id:
            'a-resource-1',
          product_region: 'ap-northeast-1',
          product_servicename: 'AWS CloudTrail',
          pricing_term: 'OnDemand',
        },
        {
          line_item_usage_account_id: 'XXXXXXXXXXXX',
          line_item_usage_start_date: '2020-11-22 00:00:00.000',
          line_item_usage_end_date: '2020-11-22 01:00:00.000',
          line_item_currency_code: 'USD',
          line_item_unblended_cost: 6,
          line_item_resource_id:
            'a-resource-1',
          product_region: 'ap-northeast-1',
          product_servicename: 'AWS CloudTrail',
          pricing_term: 'OnDemand',
        },
        {
          line_item_usage_account_id: 'XXXXXXXXXXXX',
          line_item_usage_start_date: '2020-11-22 00:00:00.000',
          line_item_usage_end_date: '2020-11-22 01:00:00.000',
          line_item_currency_code: 'USD',
          line_item_unblended_cost: 4,
          line_item_resource_id:
            'a-resource-2',
          product_region: 'ap-northeast-1',
          product_servicename: 'AWS Lambda',
          pricing_term: 'OnDemand',
        },
      ],
    };
  }
  
  module.exports = { get };
  