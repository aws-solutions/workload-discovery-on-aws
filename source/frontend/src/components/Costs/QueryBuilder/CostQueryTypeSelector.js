// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import PropTypes from 'prop-types';

import {
  Container,
  RadioGroup,
  Header,
  ColumnLayout,
  SpaceBetween,
} from '@cloudscape-design/components';

const CostQueryTypeSelector = ({ queryType, setQueryType }) => {
  
  return (
    <Container
      header={
        <Header
          variant='h2'
          description='Select the query to perform'>
          Query type
        </Header>
      }>
      <SpaceBetween direction='vertical' size='l'>
        <ColumnLayout columns={2}>
          <RadioGroup
            onChange={({ detail }) => setQueryType(detail.value)}
            value={queryType}
            items={[
              {
                value: 'all',
                label: 'Query all Resources',
                description:
                  'Build a query that will return resources with the highest estimated cost first.',
              },
              {
                value: 'service',
                label: 'Query by Service',
                description:
                  'Build a query that will return estimated cost data for a particular AWS Service',
              },
              {
                value: 'arn',
                label: 'Query by ARN or Resource Id',
                description:
                  'Build a query that will return estimated cost data for the provided Amazon Resource Names (ARNs) or Resource Id',
              },
            ]}
          />
         
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
};

CostQueryTypeSelector.propTypes = {
  setQueryType: PropTypes.func.isRequired,
  queryType: PropTypes.string.isRequired,
};

export default CostQueryTypeSelector;
