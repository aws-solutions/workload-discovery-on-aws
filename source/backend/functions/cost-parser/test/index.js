const rewire = require('rewire');
const athenaQueryBuilder = rewire('../src/athenaQueryBuilder');
const { assert } = require('chai');
const { getRegions } = require('./data/regions');

describe('testing the athena query builder', () => {
  describe('getResourcesByCostQuery', () => {
    it('should return a valid sql query string that Athena can process', async () => {
      const getResourcesByCostQuery = athenaQueryBuilder.__get__(
        'getResourcesByCostQuery'
      );

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', 'us-east-1'];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-21 00:00:00.000';

      const queryResult = `SELECT line_item_resource_id, product_servicename, line_item_usage_account_id, product_region, pricing_term, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM test-table WHERE line_item_usage_account_id IN ('123456789012','123456789013','123456789014') AND product_region IN ('eu-west-1','us-east-1') AND line_item_usage_start_date >= TIMESTAMP '2020-01-01 00:00:00.000' AND line_item_usage_end_date <= TIMESTAMP '2020-01-21 00:00:00.000' GROUP BY line_item_resource_id, product_servicename, pricing_term, line_item_usage_account_id, product_region, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY cost DESC;`;
      const actual = getResourcesByCostQuery({
        cache: getRegions(),
        accountIds: accountIds,
        regions: regions,
        athenaTableName: athenaTableName,
        period: { from: from, to: to },
      });

      assert.deepEqual(actual, queryResult);
    });

    it('should throw an Error as the from date is invalid', async () => {
      const getResourcesByCostQuery = athenaQueryBuilder.__get__(
        'getResourcesByCostQuery'
      );

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', 'us-east-1'];
      const athenaTableName = 'test-table';
      const from = ';Select * from nastypasty';
      const to = '2020-01-02 00:00:00.000';

      assert.throws(
        () =>
          getResourcesByCostQuery({
            cache: getRegions(),
            accountIds: accountIds,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the to date is invalid', async () => {
      const getResourcesByCostQuery = athenaQueryBuilder.__get__(
        'getResourcesByCostQuery'
      );

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', 'us-east-1'];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = ';Select * from nastypasty';

      assert.throws(
        () =>
          getResourcesByCostQuery({
            cache: getRegions(),
            accountIds: accountIds,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the to region is invalid', async () => {
      const getResourcesByCostQuery = athenaQueryBuilder.__get__(
        'getResourcesByCostQuery'
      );

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', ';Select * From nastypasty'];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-02 00:00:00.000';

      assert.throws(
        () =>
          getResourcesByCostQuery({
            cache: getRegions(),
            accountIds: accountIds,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the accountId date is invalid', async () => {
      const getResourcesByCostQuery = athenaQueryBuilder.__get__(
        'getResourcesByCostQuery'
      );

      const accountIds = [
        ';Select * from nastypasty',
        '123456789013',
        '123456789014',
      ];
      const regions = ['eu-west-1', 'us-east-1'];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = ';Select * from nastypasty';

      assert.throws(
        () =>
          getResourcesByCostQuery({
            cache: getRegions(),
            accountIds: accountIds,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw a Error when passed an empty object', async () => {
      const getResourcesByCostQuery = athenaQueryBuilder.__get__(
        'getResourcesByCostQuery'
      );

      assert.throws(
        () => getResourcesByCostQuery({}),
        Error,
        `Cannot build query`
      );
    });
  });

  describe('byServiceQuery', () => {
    it('should return a valid sql query string that Athena can process', async () => {
      const byServiceQuery = athenaQueryBuilder.__get__('byServiceQuery');

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', 'us-east-1'];
      const serviceName = 'some-random-name-of a service 2.0';
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-21 00:00:00.000';

      const queryResult = `SELECT product_servicename, line_item_usage_account_id, product_region, pricing_term, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM test-table WHERE line_item_usage_account_id IN ('123456789012','123456789013','123456789014') AND product_region IN ('eu-west-1','us-east-1') AND product_servicename LIKE '%some-random-name-of a service 2.0%' AND line_item_usage_start_date >= TIMESTAMP '2020-01-01 00:00:00.000' AND line_item_usage_end_date <= TIMESTAMP '2020-01-21 00:00:00.000' GROUP BY  product_servicename, line_item_usage_account_id, product_region, pricing_term, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY cost DESC;`;

      const actual = byServiceQuery({
        cache: getRegions(),
        accountIds: accountIds,
        serviceName: serviceName,
        regions: regions,
        athenaTableName: athenaTableName,
        period: { from: from, to: to },
      });

      assert.deepEqual(actual, queryResult);
    });

    it('should throw an Error as the accountId is invalid', async () => {
      const byServiceQuery = athenaQueryBuilder.__get__('byServiceQuery');

      const accountIds = [
        ';Select * from nastypasty;',
        '123456789013',
        '123456789014',
      ];
      const regions = ['eu-west-1', 'us-east-1'];
      const serviceName = 'some-random-name-of a service 2.0';
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-21 00:00:00.000';

      assert.throws(
        () =>
          byServiceQuery({
            cache: getRegions(),
            accountIds: accountIds,
            serviceName: serviceName,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the region is invalid', async () => {
      const byServiceQuery = athenaQueryBuilder.__get__('byServiceQuery');

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', ');Select * from nastypasty'];
      const serviceName = 'some-random-name-of a service 2.0';
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-21 00:00:00.000';

      assert.throws(
        () =>
          byServiceQuery({
            cache: getRegions(),
            accountIds: accountIds,
            serviceName: serviceName,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the serviceName is invalid', async () => {
      const byServiceQuery = athenaQueryBuilder.__get__('byServiceQuery');

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', 'us-east-1'];
      const serviceName = ');Select * from nastypasty';
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-21 00:00:00.000';

      assert.throws(
        () =>
          byServiceQuery({
            cache: getRegions(),
            accountIds: accountIds,
            serviceName: serviceName,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the to date is invalid', async () => {
      const byServiceQuery = athenaQueryBuilder.__get__('byServiceQuery');

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', 'us-east-1'];
      const serviceName = ');Select * from nastypasty';
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = ';Select * from nastypasty';

      assert.throws(
        () =>
          byServiceQuery({
            cache: getRegions(),
            accountIds: accountIds,
            serviceName: serviceName,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the from date is invalid', async () => {
      const byServiceQuery = athenaQueryBuilder.__get__('byServiceQuery');

      const accountIds = ['123456789012', '123456789013', '123456789014'];
      const regions = ['eu-west-1', 'us-east-1'];
      const serviceName = ');Select * from nastypasty';
      const athenaTableName = 'test-table';
      const from = ';Select * from nastypasty';
      const to = '2020-01-02 00:00:00.000';

      assert.throws(
        () =>
          byServiceQuery({
            cache: getRegions(),
            accountIds: accountIds,
            serviceName: serviceName,
            regions: regions,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw a Error when passed an empty object', async () => {
      const getResourcesByCostQuery = athenaQueryBuilder.__get__(
        'getResourcesByCostQuery'
      );

      assert.throws(
        () => getResourcesByCostQuery({}),
        Error,
        `Cannot build query`
      );
    });
  });

  describe('byResourceIdQuery', () => {
    it('should return a valid sql query string that Athena can process', async () => {
      const byResourceIdQuery = athenaQueryBuilder.__get__('byResourceIdQuery');

      const resourceIds = [
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhk',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl',
        'vol-012b559287dd97d1e',
      ];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-21 00:00:00.000';

      const queryResult = `SELECT line_item_resource_id, line_item_usage_account_id, product_region, pricing_term, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM test-table WHERE line_item_resource_id IN ('arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhk','arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj','arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl','vol-012b559287dd97d1e') AND line_item_usage_start_date >= TIMESTAMP '2020-01-01 00:00:00.000' AND line_item_usage_end_date <= TIMESTAMP '2020-01-21 00:00:00.000' GROUP BY line_item_resource_id, line_item_usage_account_id, product_region, pricing_term, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY cost DESC;`;

      const actual = byResourceIdQuery({
        resourceIds: resourceIds,
        athenaTableName: athenaTableName,
        period: { from: from, to: to },
      });

      assert.deepEqual(actual, queryResult);
    });

    it('should throw an Error as the from date is invalid', async () => {
      const byResourceIdQuery = athenaQueryBuilder.__get__('byResourceIdQuery');
      const resourceIds = [
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhk',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl',
        'vol-012b559287dd97d1e',
      ];
      const athenaTableName = 'test-table';
      const from = ';Select * from nastypasty';
      const to = '2020-01-02 00:00:00.000';

      assert.throws(
        () =>
          byResourceIdQuery({
            resourceIds: resourceIds,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the to date is invalid', async () => {
      const byResourceIdQuery = athenaQueryBuilder.__get__('byResourceIdQuery');

      const resourceIds = [
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhk',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl',
        'vol-012b559287dd97d1e',
      ];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = ';Select * from nastypasty';

      assert.throws(
        () =>
          byResourceIdQuery({
            resourceIds: resourceIds,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should return a query with only the valid ids', async () => {
      const byResourceIdQuery = athenaQueryBuilder.__get__('byResourceIdQuery');

      const resourceIds = [
        '; Select * from nastypasty',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl',
        'vol-012b559287dd97d1e',
      ];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-02 00:00:00.000';

      const queryResult = `SELECT line_item_resource_id, line_item_usage_account_id, product_region, pricing_term, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM test-table WHERE line_item_resource_id IN ('arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj','arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl','vol-012b559287dd97d1e') AND line_item_usage_start_date >= TIMESTAMP '2020-01-01 00:00:00.000' AND line_item_usage_end_date <= TIMESTAMP '2020-01-02 00:00:00.000' GROUP BY line_item_resource_id, line_item_usage_account_id, product_region, pricing_term, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY cost DESC;`;

      const actual = byResourceIdQuery({
        resourceIds: resourceIds,
        athenaTableName: athenaTableName,
        period: { from: from, to: to },
      });

      assert.deepEqual(actual, queryResult);
    });
  });

  describe('byResourceIdOrderedByDayQuery', () => {
    it('should return a valid sql query string that Athena can process', async () => {
      const byResourceIdOrderedByDayQuery = athenaQueryBuilder.__get__(
        'byResourceIdOrderedByDayQuery'
      );

      const resourceIds = [
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhk',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl',
        'vol-012b559287dd97d1e',
      ];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-21 00:00:00.000';

      const queryResult = `SELECT line_item_resource_id, line_item_usage_account_id, product_region, pricing_term, line_item_usage_start_date, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM test-table WHERE line_item_resource_id IN ('arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhk','arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj','arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl','vol-012b559287dd97d1e') AND line_item_usage_start_date >= TIMESTAMP '2020-01-01 00:00:00.000' AND line_item_usage_end_date <= TIMESTAMP '2020-01-21 00:00:00.000' GROUP BY line_item_resource_id, line_item_usage_account_id, product_region, pricing_term, line_item_usage_start_date, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY line_item_usage_start_date DESC;`;

      const actual = byResourceIdOrderedByDayQuery({
        resourceIds: resourceIds,
        athenaTableName: athenaTableName,
        period: { from: from, to: to },
      });

      assert.deepEqual(actual, queryResult);
    });

    it('should throw an Error as the from date is invalid', async () => {
      const byResourceIdOrderedByDayQuery = athenaQueryBuilder.__get__(
        'byResourceIdOrderedByDayQuery'
      );
      const resourceIds = [
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhk',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl',
        'vol-012b559287dd97d1e',
      ];
      const athenaTableName = 'test-table';
      const from = ';Select * from nastypasty';
      const to = '2020-01-02 00:00:00.000';

      assert.throws(
        () =>
          byResourceIdOrderedByDayQuery({
            resourceIds: resourceIds,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should throw an Error as the to date is invalid', async () => {
      const byResourceIdOrderedByDayQuery = athenaQueryBuilder.__get__(
        'byResourceIdOrderedByDayQuery'
      );

      const resourceIds = [
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhk',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl',
        'vol-012b559287dd97d1e',
      ];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = ';Select * from nastypasty';

      assert.throws(
        () =>
          byResourceIdOrderedByDayQuery({
            resourceIds: resourceIds,
            athenaTableName: athenaTableName,
            period: { from: from, to: to },
          }),
        Error,
        `Cannot build query`
      );
    });

    it('should build a query with only the valid ids', async () => {
      const byResourceIdOrderedByDayQuery = athenaQueryBuilder.__get__(
        'byResourceIdOrderedByDayQuery'
      );

      const resourceIds = [
        '; Select * from nastypasty',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj',
        'arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl',
        'vol-012b559287dd97d1e',
      ];
      const athenaTableName = 'test-table';
      const from = '2020-01-01 00:00:00.000';
      const to = '2020-01-02 00:00:00.000';

      const queryResult = `SELECT line_item_resource_id, line_item_usage_account_id, product_region, pricing_term, line_item_usage_start_date, sum(line_item_unblended_cost) AS cost, line_item_currency_code FROM test-table WHERE line_item_resource_id IN ('arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhj','arn:aws:lambda:eu-west-2:XXXXXXXXXXXX:function:aws-perspective-XXXXXXXXXX-PerspectiveCostFunction-s4c66HdWdGhl','vol-012b559287dd97d1e') AND line_item_usage_start_date >= TIMESTAMP '2020-01-01 00:00:00.000' AND line_item_usage_end_date <= TIMESTAMP '2020-01-02 00:00:00.000' GROUP BY line_item_resource_id, line_item_usage_account_id, product_region, pricing_term, line_item_usage_start_date, line_item_currency_code HAVING sum(line_item_unblended_cost) > 0 ORDER BY line_item_usage_start_date DESC;`;

      const actual = byResourceIdOrderedByDayQuery({
        resourceIds: resourceIds,
        athenaTableName: athenaTableName,
        period: { from: from, to: to },
      });
      assert.deepEqual(actual, queryResult);
    });
  });
});
