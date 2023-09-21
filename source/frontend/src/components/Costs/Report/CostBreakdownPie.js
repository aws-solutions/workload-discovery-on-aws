// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { PieChart, Box } from '@cloudscape-design/components';
import PropTypes from 'prop-types';

const CostBreakdownPie = ({ items, value }) => {

  return (
    <PieChart
      data={items}
      i18nStrings={{
        detailsValue: value,
        detailsPercentage: 'Percentage',
        filterLabel: 'Filter displayed data',
        filterPlaceholder: 'Filter data',
        filterSelectedAriaLabel: 'selected',
        detailPopoverDismissAriaLabel: 'Dismiss',
        legendAriaLabel: 'Legend',
        chartAriaRoleDescription: 'pie chart',
        segmentAriaRoleDescription: 'segment',
      }}
      detailPopoverContent={(datum, sum) => {
        return  [
          { key: "Estimated Cost", value: `$${parseFloat(datum.value).toFixed(2) }`},
          {
            key: "Percentage",
            value: `${((datum.value / sum) * 100).toFixed(
              0
            )}%`
          },
        ]
      }}
      ariaDescription='Donut chart showing cost breakdown.'
      ariaLabel='Small donut chart'
      errorText='Error loading data.'
      hideDescriptions
      hideFilter
      hideTitles
      loadingText='Loading chart'
      recoveryText='Retry'
      size='small'
      variant='donut'
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No data available</b>
          <Box variant='p' color='inherit'>
            There is no data available
          </Box>
        </Box>
      }
    />
  );
};

CostBreakdownPie.propTypes = {
  items: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
};

export default CostBreakdownPie;
