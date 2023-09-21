// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Box,
  Container,
  Header,
  ColumnLayout,
  TextContent,
  SpaceBetween,
} from '@cloudscape-design/components';
import CostBreakdownCharts from './CostBreakdownCharts';
import PropTypes from 'prop-types';

import * as R  from 'ramda';

const CostBreakdownSummary = ({ resources }) => {
  const byAccount = R.groupBy((e) => e.data.resource.accountId);
  const byRegion = R.groupBy((e) => e.data.resource.region);
  return (
      <SpaceBetween direction='vertical' size='l'>
        <Container
          header={
            <Header
              description='Information associated with the cost of this workload'
              variant='h2'>
              Summary
            </Header>
          }>
            <ColumnLayout disableGutters columns='4' variant='text-grid'>
              <div>
                <Box margin={{ bottom: 'xxxs' }} color='text-label'>
                  Estimated cost
                </Box>
                <TextContent>
                  <h1>{`$${R.reduce(
                    (acc, val) => (acc + parseFloat(val.data.cost)),
                    0,
                    resources
                  ).toFixed(2)}`}</h1>
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
          </Container>
        <CostBreakdownCharts resources={resources} />
      </SpaceBetween>
  );
};

CostBreakdownSummary.propTypes = {
  resources: PropTypes.array.isRequired,
};

export default CostBreakdownSummary;
