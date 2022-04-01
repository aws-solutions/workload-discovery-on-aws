import React from 'react';
import Box from '@awsui/components-react/box';

import {
  SpaceBetween,
  Button,
  Modal,
  Container,
  Header,
  Grid,
  ExpandableSection,
} from '@awsui/components-react';
import CostBreakdownSummary from './CostBreakdownSummary';
import CostBreakdown from './CostBreakdown';
import CostForm from './CostForm';
import CostBreakdownCharts from './CostBreakdownCharts';
import {
  wrapCostAPIRequest,
  getResourcesByCostByDay,
  handleResponse,
} from '../../../../API/Handlers/CostsGraphQLHandler';
import PropTypes from 'prop-types';
import { useCostsState } from '../../../Contexts/CostsContext';
import { uploadObject } from '../../../../API/Storage/S3Store';

const R = require('ramda');
const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const CostOverview = ({ resources, costDispatch, costPreferences }) => {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const processCosts = R.pathOr(false, ['processCosts'], costPreferences)
  const [fromDate, setFromDate] = React.useState(
    R.pathOr(
      dayjs().startOf('month').format('YYYY-MM-DD'),
      ['period', 'fromDate'],
      costPreferences
    )
  );
  const [toDate, setToDate] = React.useState(
    R.pathOr(
      dayjs().format('YYYY-MM-DD'),
      ['period', 'toDate'],
      costPreferences
    )
  );
  const [showMoreDetailsModal, setShowMoreDetailsModal] = React.useState(true);
  const [displayedResources, setDisplayedResources] = React.useState(
    R.filter((e) => R.equals(e.data.type, 'resource'), resources)
  );
  const [resourceDailyBreakdown, setResourceDailyBreakdown] = React.useState(
    []
  );
  const [error, setError] = React.useState();

  const updateToDate = (date) => {
   
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

  const updateFromDate = (date) => {
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

  const getCosts = (costs) => {
    R.forEach((e) => {
      R.forEach((n) => {
        if (R.hasPath(['data', 'resource', 'arn'], n)) {
          if (R.equals(n.data.resourceId, e.line_item_resource_id)) {
            n.data.cost = e.cost;
          }
        }
      }, displayedResources);
    }, costs);
    setDisplayedResources(R.map((e) => e, displayedResources));
  };

  React.useEffect(() => {
    setDisplayedResources(
      R.filter(
        (y) => R.and(R.equals(y.data.type, 'resource'), R.gt(y.data.cost, 0)),
        resources
      )
    );
    getDailyCostBreakdown(selectedItems);
  }, [fromDate, toDate]);

  const getPageSize = (items) =>
    dayjs(toDate).diff(dayjs(fromDate), 'day') * items.length;

  const getDailyCostBreakdown = () => {
    wrapCostAPIRequest(getResourcesByCostByDay, {
      costForResourceQueryByDay: {
        pagination: { start: 0, end: getPageSize(selectedItems) },
        resourceIds: R.chain((e) => [e.resource, e.resourceArn], selectedItems),
        period: { from: fromDate, to: toDate },
      },
    })
      .then(handleResponse)
      .then((e) =>
        setResourceDailyBreakdown(
          R.pathOr(
            [],
            ['body', 'data', 'getResourcesByCostByDay', 'costItems'],
            e
          )
        )
      )
      .catch((err) => setError(err));
  };

  return (
    <Modal
      onDismiss={() => setShowMoreDetailsModal(false)}
      visible={showMoreDetailsModal}
      closeAriaLabel='Close modal'
      size='max'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button
              onClick={() => setShowMoreDetailsModal(false)}
              variant='link'>
              Close
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={
        <Header
          description='This report shows a summary of interesting cost data for this workload'
          variant='h2'>
          Cost Report
        </Header>
      }>
      <SpaceBetween direction='vertical' size='l'>
        <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
          <CostForm
            onChange={getCosts}
            resources={displayedResources}
            costPreferences={costPreferences}
            toDate={toDate}
            fromDate={fromDate}
            setToDate={updateToDate}
            setFromDate={updateFromDate}
          />
          <CostBreakdownSummary
            resources={displayedResources}
            timePeriod={dayjs(toDate).diff(dayjs(fromDate), 'day')}
          />
        </Grid>
        <CostBreakdown
          resources={displayedResources}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          getDailyCostBreakdown={getDailyCostBreakdown}
          resourceDailyBreakdown={resourceDailyBreakdown}
        />
      </SpaceBetween>
    </Modal>
  );
};

CostOverview.propTypes = {
  resources: PropTypes.array.isRequired,
  costPreferences: PropTypes.object.isRequired,
};

export default CostOverview;
