import React from 'react';
import {
  Box,
  Container,
  Header,
  ColumnLayout,
  TextContent,
  SpaceBetween,
} from '@awsui/components-react';
import CostBreakdownCharts from './CostBreakdownCharts';
import PropTypes from 'prop-types';

const R = require('ramda');

const SummaryOverview = ({ resources, timePeriod }) => {
  const byAccount = R.groupBy((e) => e.data.resource.accountId);
  const byRegion = R.groupBy((e) => e.data.resource.region);

  return (
    <Container
      header={
        <Header
          description='Information associated with the cost of this workload'
          variant='h2'>
          Summary
        </Header>
      }>
      <SpaceBetween direction='vertical' size='l'>
        <ColumnLayout disableGutters columns='5' variant='text-grid'>
          <div>
            <Box margin={{ bottom: 'xxxs' }} color='text-label'>
              Estimated cost
            </Box>
            <TextContent>
              <h1>{`$${R.reduce(
                (acc, val) => (acc = acc + parseFloat(val.data.cost)),
                0,
                resources
              ).toFixed(2)}`}</h1>
            </TextContent>
          </div>
          <div>
            <Box margin={{ bottom: 'xxxs' }} color='text-label'>
              Estimated Avg. Daily Cost
            </Box>
            <TextContent>
              <h1>{`$${(
                R.reduce(
                  (acc, val) => (acc = acc + parseFloat(val.data.cost)),
                  0,
                  resources
                ).toFixed(2) / timePeriod
              ).toFixed(2)}`}</h1>
            </TextContent>
          </div>
          <div>
            <Box margin={{ bottom: 'xxxs' }} color='text-label'>
              Time Period
            </Box>
            <TextContent>
              <h1>{`${timePeriod} days`}</h1>
            </TextContent>
          </div>
          <div>
            <Box margin={{ bottom: 'xxxs' }} color='text-label'>
              Accounts
            </Box>
            <TextContent>
              <h1>{R.length(R.keys(byAccount(resources)))}</h1>
            </TextContent>
          </div>
          <div>
            <Box margin={{ bottom: 'xxxs' }} color='text-label'>
              Regions
            </Box>
            <TextContent>
              <h1>{R.length(R.keys(byRegion(resources)))}</h1>
            </TextContent>
          </div>
          <div>
            <Box margin={{ bottom: 'xxxs' }} color='text-label'>
              Resources
            </Box>
            <TextContent>
              <h1>{R.length(resources)}</h1>
            </TextContent>
          </div>
        </ColumnLayout>
        <CostBreakdownCharts resources={resources} />
      </SpaceBetween>
    </Container>
  );
};

SummaryOverview.propTypes = {
  resources: PropTypes.array.isRequired,
  timePeriod: PropTypes.number.isRequired,
};

export default SummaryOverview;
