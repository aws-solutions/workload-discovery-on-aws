import * as React from 'react';
import { PieChart, Box } from '@awsui/components-react';
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
