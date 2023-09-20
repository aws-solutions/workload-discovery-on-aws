// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Box, Header, Table } from '@cloudscape-design/components';
import PropTypes from 'prop-types';
import * as R  from 'ramda';
import dayjs  from 'dayjs';
import localizedFormat  from 'dayjs/plugin/localizedFormat';
import relativeTime  from 'dayjs/plugin/relativeTime';
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

function ComparisonType(comparisonType) {
  return <b>{comparisonType}</b>
}
const MultipleResourceDetailsPanel = ({ resources }) => {

    const keyHeaderMap = {
        resourceType: 'Resource type',
        accountId: 'Account Id',
        awsRegion: 'Region',
        availabilityZone: 'Availability zone',
      };
      const transformedData = [
        'resourceType',
        'accountId',
        'awsRegion',
        'availabilityZone',
      ].map(key => {
        const data = { comparisonType: keyHeaderMap[key] };

        R.map(e => data[e.id] = e.properties[key], resources)
    
        return data;
      });
    
      const columnDefinitions = [
        {
          id: 'comparisonType',
          header: '',
          cell: ({ comparisonType }) => ComparisonType(comparisonType)
        },
        ...resources.map(({ id, properties }) => ({
          id,
          header: properties.title,
          cell: item => (Array.isArray(item[id]) ? item[id].join(', ') : item[id])
        }))
      ];

  return (
    <Box padding={{ bottom: 'l' }}>
    <Table
      ariaLabels={{
          tableLabel: 'Resources Details'
      }}
      header={<Header variant="h2">Resource details</Header>}
      items={transformedData}
      columnDefinitions={columnDefinitions}
      variant="embedded"
    />
  </Box>
  );
};

MultipleResourceDetailsPanel.propTypes = {
  resources: PropTypes.array.isRequired,
};

export default MultipleResourceDetailsPanel;



