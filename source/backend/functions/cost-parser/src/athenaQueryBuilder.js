// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require('ramda');
const dayjs = require('dayjs');

// Helper function that will app singe quotes to an array of values for use with IN SQL command.
const createINValues = (values) => R.map((value) => `'${value}'`, values);

const dateValidator = (date) => {
  if (dayjs(date).isValid()) return true;
  else throw Error('Invalid date provided');
};

const accountIdValidator = (accountId) => {
  if (/^\d{12}$/.test(accountId)) return true;
  else throw Error('Invalid accountId');
};

const regionValidator = (region, regions) => {
  if (R.includes(region, regions)) return true;
  else throw Error('Invalid Region');
};

const serviceNameValidator = (serviceName) => {
  if (/^[\w\s\.\-]+$/.test(serviceName)) return true;
  else throw Error('Invalid service name');
};

const resourceIdValidator = (id) => {
  return R.or(
    /arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):.*/.test(id),
    !/[!@#$%^&*(),.?"{}:|<>;]/.test(id)
  );
};

const getResourcesByCostQuery = ({
  cache,
  accountIds = [],
  athenaTableName,
  regions = [],
  period,
}) => {
  try {
    period && dateValidator(period.from);
    period && dateValidator(period.to);
    accountIds && R.map(accountIdValidator, accountIds);
    regions && R.map((e) => regionValidator(e, cache.regions), regions);

    return `SELECT line_item_resource_id, product_servicename, line_item_usage_account_id, Array_join(Array_distinct(Array_agg(product_region)), '|') AS region, pricing_term, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM ${athenaTableName} WHERE line_item_usage_account_id IN (${createINValues(
      accountIds
    )}) AND product_region IN (${createINValues(
      regions
    )}) AND line_item_usage_start_date >= TIMESTAMP '${
      period.from
    }' AND line_item_usage_end_date <= TIMESTAMP '${
      period.to
    }' GROUP BY line_item_resource_id, product_servicename, pricing_term, line_item_usage_account_id, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY cost DESC;`;
  } catch (err) {
    console.error(err)
    throw Error('Cannot build query');
  }
};

const byServiceQuery = ({
  cache,
  accountIds = [],
  serviceName,
  athenaTableName,
  regions = [],
  period,
}) => {
  try {
    period && dateValidator(period.from);
    period && dateValidator(period.to);
    accountIds && R.map(accountIdValidator, accountIds);
    regions && R.map((e) => regionValidator(e, cache.regions), regions);
    serviceName && serviceNameValidator(serviceName);

    return `SELECT product_servicename, line_item_usage_account_id, product_region AS region, pricing_term, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM ${athenaTableName} WHERE line_item_usage_account_id IN (${createINValues(
      accountIds
    )}) AND product_region IN (${createINValues(
      regions
    )}) AND product_servicename LIKE '%${serviceName}%' AND line_item_usage_start_date >= TIMESTAMP '${
      period.from
    }' AND line_item_usage_end_date <= TIMESTAMP '${
      period.to
    }' GROUP BY  product_servicename, line_item_usage_account_id, pricing_term, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY cost DESC;`;
  } catch (err) {
    throw Error('Cannot build query');
  }
};

const byResourceIdQuery = ({ resourceIds = [], athenaTableName, period }) => {
  try {
    period && dateValidator(period.from);
    period && dateValidator(period.to);
  } catch (err) {
    throw Error('Cannot build query');
  }
  const ids = R.reduce(
    (acc, val) => {
      if (resourceIdValidator(val)) acc.push(val);
      return acc;
    },
    [],
    resourceIds
  );

  return `SELECT line_item_resource_id, product_servicename, line_item_usage_account_id, Array_join(Array_distinct(Array_agg(product_region)), '|') AS region, pricing_term, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM ${athenaTableName} WHERE line_item_resource_id IN (${createINValues(
    ids
  )}) AND line_item_usage_start_date >= TIMESTAMP '${
    period.from
  }' AND line_item_usage_end_date <= TIMESTAMP '${
    period.to
  }' GROUP BY line_item_resource_id, product_servicename, line_item_usage_account_id, pricing_term, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY cost DESC;`;
};

const byResourceIdOrderedByDayQuery = ({
  resourceIds = [],
  athenaTableName,
  period,
}) => {
  try {
    period && dateValidator(period.from);
    period && dateValidator(period.to);
  } catch (err) {
    throw Error('Cannot build query');
  }
  const ids = R.reduce(
    (acc, val) => {
      if (resourceIdValidator(val)) acc.push(val);
      return acc;
    },
    [],
    resourceIds
  );

  return `SELECT line_item_resource_id, product_servicename, line_item_usage_account_id, Array_join(Array_distinct(Array_agg(product_region)), '|') AS region, pricing_term, line_item_usage_start_date, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM ${athenaTableName} WHERE line_item_resource_id IN (${createINValues(
    ids
  )}) AND line_item_usage_start_date >= TIMESTAMP '${
    period.from
  }' AND line_item_usage_end_date <= TIMESTAMP '${
    period.to
  }' GROUP BY line_item_resource_id, product_servicename, line_item_usage_account_id, pricing_term, line_item_usage_start_date, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY line_item_usage_start_date DESC;`;
};

module.exports = {
  getResourcesByCostQuery,
  byServiceQuery,
  byResourceIdQuery,
  byResourceIdOrderedByDayQuery
};
