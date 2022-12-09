// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Box,
  TextContent,
  ExpandableSection,
  ColumnLayout,
  SpaceBetween,
  StatusIndicator,
  Grid,
} from '@awsui/components-react';

import * as R  from 'ramda';

const removeBrackets = (item) =>
  item.replace(/[[\]']+/g, '').replaceAll('"', '');

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box margin={{ bottom: 'xxxs' }} color='text-label'>
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

export const StatementItem = ({ statement }) => {
  const resources = R.split(',', removeBrackets(statement.resources));
  const actions = R.split(',', removeBrackets(statement.actions));
  const warningActions = (action) => action.includes('*');
  const badActions = (action) => action === '*';

  const getEffect = (effect) =>
    R.equals(effect, 'Allow') ? 'success' : 'error';

  const processActions = (actions) =>
    R.reduce(
      (acc, val) => {
        if (badActions(val)) acc.push('error');
        if (warningActions(val)) acc.push('warning');
        return acc;
      },
      [],
      actions
    );

  const getOverview = (items) => {
    const processedActions = processActions(items);
    if (R.includes('error', processedActions)) return 'error';
    if (R.includes('warning', processedActions)) return 'warning';
    else return 'success';
  };

  const getDescription = (items) => {
    const processedActions = processActions(items);
    if (R.includes('error', processedActions)) return 'Only wildcards used.';
    if (R.includes('warning', processedActions)) return 'Wildcards used.';
    else return 'Good';
  };

  const mapIndexed = R.addIndex(R.map);

  return (
    <ColumnLayout columns={1}>
      <ColumnLayout columns={2} variant='text-grid'>
        <SpaceBetween size='l'>
          <ValueWithLabel label='Effect'>
            <StatusIndicator type={getEffect(statement.effect)}>
              {statement.effect}
            </StatusIndicator>
          </ValueWithLabel>
        </SpaceBetween>
        <SpaceBetween size='l'>
          <ValueWithLabel label='No. of Resources'>
            {R.length(resources)}
          </ValueWithLabel>
          <ValueWithLabel label='No. of Actions'>
            {R.length(actions)}
          </ValueWithLabel>
        </SpaceBetween>
      </ColumnLayout>
      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
        <SpaceBetween size='l'>
          <ValueWithLabel label='Actions health'>
            <StatusIndicator type={getOverview(actions)}>
              {getDescription(actions)}
            </StatusIndicator>
          </ValueWithLabel>
          <ExpandableSection header='Actions'>
            <ul>
              {mapIndexed(
                (e, index) => (
                  <TextContent key={index}>
                    <li key={index}>{e}</li>
                  </TextContent>
                ),
                actions
              )}
            </ul>
          </ExpandableSection>
        </SpaceBetween>

        <SpaceBetween size='l'>
          <ValueWithLabel label='Resources health'>
            <StatusIndicator type={getOverview(resources)}>
              {getDescription(resources)}
            </StatusIndicator>
          </ValueWithLabel>
          <ExpandableSection header='Resources'>
            <ul>
              {mapIndexed(
                (e, index) => (
                  <TextContent key={index}>
                    <li key={index}>{e}</li>
                  </TextContent>
                ),
                resources
              )}
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Grid>
    </ColumnLayout>
  );
};

export default StatementItem;
