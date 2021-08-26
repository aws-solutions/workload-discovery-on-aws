import * as React from 'react';
import {
  ExpandableSection,
  Container,
  Header,
  LineChart,
  Box,
  SpaceBetween,
} from '@awsui/components-react';
import PropTypes from 'prop-types';

const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

const R = require('ramda');
const descending = function (a, b) {
  return b - a;
};

const ascending = function (a, b) {
  return a - b;
};

const mapIndexed = R.addIndex(R.map);

const CostBreakdownChart = ({ items }) => {
  const [type, setType] = React.useState('line');

  const processGroups = (groupBy) => {
    const groups = groupBy(items);
    return mapIndexed((e, i) => {
      return {
        id: i,
        title: R.last(R.split(':', e)),
        type: type,
        valueFormatter: (t) => t,
        data: R.map((e) => {
          return {
            x: dayjs(e.line_item_usage_start_date).format('ll'),
            y: e.cost,
          };
        }, groups[`${e}`]),
      };
    }, Object.keys(groups));
  };
  const byARN = R.groupBy((e) => e.line_item_resource_id);

  return (
    <Container>
      <LineChart
        hideFilter
        series={R.isEmpty(processGroups(byARN)) ? [] : processGroups(byARN)}
        xDomain={R.map(
          (x) => x.format('ll'),
          R.sort(
            ascending,
            R.uniq(R.map((e) => dayjs(e.line_item_usage_start_date), items))
          )
        )}
        yDomain={[
          -0,
          R.head(R.sort(descending, R.uniq(R.map((e) => e.cost, items)))),
        ]}
        i18nStrings={{
          chartAriaRoleDescription: 'line chart',
          xTickFormatter: (t) => t.split(',').join('\n'),

          yTickFormatter: (t) => t,
        }}
        ariaLabel='Multiple data series line chart'
        errorText='Error loading data.'
        height={300}
        loadingText='Loading chart'
        recoveryText='Retry'
        statusType='finished'
        xScaleType='categorical'
        xTitle='Date'
        yTitle='Estimated cost ($)'
        empty={
          <Box textAlign='center' color='inherit'>
            <b>No data available</b>
            <Box variant='p' color='inherit'>
              Try selecting a resource in the table above and clicking <strong>Actions</strong> then <strong>Update graph</strong>
            </Box>
          </Box>
        }
        noMatch={
          <Box textAlign='center' color='inherit'>
            <b>No matching data</b>
            <Box variant='p' color='inherit'>
              There is no matching data to display
            </Box>
            {/* <Button>Clear filter</Button> */}
          </Box>
        }
      />
    </Container>
  );
};

CostBreakdownChart.propTypes = {
  items: PropTypes.array.isRequired,
};

export default CostBreakdownChart;
