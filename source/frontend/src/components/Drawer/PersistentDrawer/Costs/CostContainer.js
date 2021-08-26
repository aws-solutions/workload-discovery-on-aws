import React from 'react';
import { useGraphState } from '../../../Contexts/GraphContext';
import {
  ExpandableSection,
  Header,
  Box,
  SpaceBetween,
  ColumnLayout,
  FormField,
  DatePicker,
  StatusIndicator,
  Spinner,
} from '@awsui/components-react';
import { useCostsState } from '../../../Contexts/CostsContext';
import { uploadObject } from '../../../../API/Storage/S3Store';
import {
  getCostForResource,
  handleResponse,
  wrapCostAPIRequest,
} from '../../../../API/Handlers/CostsGraphQLHandler';

const R = require('ramda');
var dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
const relativeTime = require('dayjs/plugin/relativeTime');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box margin={{ bottom: 'xxxs' }} color='text-label'>
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

export default function PersistentDrawerLeft() {
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ costPreferences }, costDispatch] = useCostsState();
  const [fromDate, setFromDate] = React.useState(
    R.pathOr(
      dayjs()
        .startOf('month')
        .format('YYYY-MM-DD'),
      ['period', 'fromDate'],
      costPreferences
    )
  );
  const [toDate, setToDate] = React.useState(
    R.pathOr(
      dayjs()
        .endOf('month')
        .format('YYYY-MM-DD'),
      ['period', 'toDate'],
      costPreferences
    )
  );
  const [toDateError, setToDateError] = React.useState();
  const [fromDateError, setFromDateError] = React.useState();
  const [processCosts, setProcessCosts] = React.useState(
    R.pathOr(false, ['processCosts'], costPreferences)
  );
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const updateNodesWithCost = R.curry((nodes, costs) => {
    R.equals(
      R.pathOr(0, ['body', 'data', 'getCostForResource', 'totalCost'], costs),
      0
    )
      ? R.forEach((e) => {
          e.data.cost = 0;
        }, nodes)
      : R.forEach((e) => {
          R.forEach((n) => {
            if (R.hasPath(['data', 'resource', 'arn'], n)) {
              if (R.equals(n.data.resource.arn, e.line_item_resource_id)) {
                n.data.cost = e.cost;
              }
            }
          }, nodes);
        }, R.pathOr([], ['body', 'data', 'getCostForResource', 'costItems'], costs));
    return nodes;
  });

  const fetchCosts = (nodes, from, to) => {
    setLoading(true);
    Promise.resolve(
      R.filter(
        (e) =>
          R.equals(e.data.type, 'resource') &&
          R.hasPath(['data', 'resource', 'arn'], e) &&
          !R.isNil(e.data.resource.arn),
        nodes
      )
    )
      .then(R.map((e) => e.data.resource.arn))
      .then((e) =>
        getCostsForARNs(e, from, to)
          .then(updateNodesWithCost(nodes))
          .then((e) => {
            dispatch({
              type: 'updateGraphResources',
              graphResources: e,
            });
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            setError(err);
          })
      )
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  const getCostsForARNs = (resourceIds, from, to) => {
    return wrapCostAPIRequest(getCostForResource, {
      costForResourceQuery: {
        pagination: { start: 0, end: resourceIds.length },
        resourceIds: resourceIds,
        period: {
          from: from,
          to: to,
        },
      },
    }).then(handleResponse);
  };

  const updateFromDate = (date) => {
    fetchCosts(
      R.filter(
        (e) => R.both(!R.equals(e.edge), R.equals(e.data.type, 'resource')),
        graphResources
      ),
      date,
      toDate
    );

    costDispatch({
      type: 'updatePreferences',
      preferences: {
        period: { fromDate: date, toDate: toDate },
        processCosts: processCosts,
      },
    });
    uploadObject(
      'costs/preferences',
      JSON.stringify({
        period: { fromDate: date, toDate: toDate },
        processCosts: processCosts,
      }),
      'private',
      'application/json'
    );
    setFromDate(date);
  };

  const updateToDate = (date) => {
    fetchCosts(
      R.filter(
        (e) => R.both(!R.equals(e.edge), R.equals(e.data.type, 'resource')),
        graphResources
      ),
      fromDate,
      date
    );
    costDispatch({
      type: 'updatePreferences',
      preferences: {
        period: { fromDate: fromDate, toDate: date },
        processCosts: processCosts,
      },
    });
    uploadObject(
      'costs/preferences',
      JSON.stringify({
        period: { fromDate: fromDate, toDate: date },
        processCosts: processCosts,
      }),
      'private',
      'application/json'
    );
    setToDate(date);
  };

  const toDateValid = (newDate) => {
    if (
      !R.and(
        dayjs(newDate, 'YYYY-MM-DD', true).isValid(),
        dayjs(newDate).isAfter(dayjs(fromDate))
      )
    ) {
      setToDateError('Invalid date, check that it is after From date');
      setToDate(newDate);
    } else {
      setToDateError();
      updateToDate(newDate);
    }
  };

  const fromDateValid = (newDate) => {
    if (
      !R.and(
        dayjs(newDate, 'YYYY-MM-DD', true).isValid(),
        dayjs(newDate).isBefore(dayjs(toDate))
      )
    ) {
      setFromDateError('Invalid date, check it is before To date');
      setFromDate(newDate);
    } else {
      setFromDateError();
      updateFromDate(newDate);
    }
  };

  return (
    <ExpandableSection
      variant='container'
      defaultExpanded
      header={
        <Header
          description='The estimated cost of the AWS resources in your diagram'
          variant='h2'>
          Workload costs
        </Header>
      }>
      <SpaceBetween size='l'>
        <ValueWithLabel label='Estimated cost'>
          {loading ? (
            <Spinner size='normal' />
          ) : error ? (
            <StatusIndicator type='error'>Error</StatusIndicator>
          ) : (
            `$${R.reduce(
              (acc, val) => R.add(acc, val.data.cost).toFixed(2),
              0.0,
              R.filter(
                (e) => !e.edge && R.equals(e.data.type, 'resource'),
                graphResources
              )
            )}`
          )}
        </ValueWithLabel>
        <SpaceBetween direction='vertical' size='l'>
          <ColumnLayout columns={2}>
            <FormField
              label='From'
              errorText={fromDateError ? fromDateError : undefined}>
              <DatePicker
                invalid={fromDateError}
                onChange={({ detail }) => fromDateValid(detail.value)}
                value={fromDate}
                nextMonthAriaLabel='Next month'
                placeholder='YYYY-MM-DD'
                previousMonthAriaLabel='Previous month'
                todayAriaLabel='Today'
              />
            </FormField>
            <FormField
              label='To'
              errorText={toDateError ? toDateError : undefined}>
              <DatePicker
                invalid={toDateError}
                onChange={({ detail }) => toDateValid(detail.value)}
                value={toDate}
                nextMonthAriaLabel='Next month'
                placeholder='YYYY-MM-DD'
                previousMonthAriaLabel='Previous month'
                todayAriaLabel='Today'
              />
            </FormField>
          </ColumnLayout>
        </SpaceBetween>
      </SpaceBetween>
    </ExpandableSection>
  );
}
