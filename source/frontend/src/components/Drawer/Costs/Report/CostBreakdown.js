import * as React from 'react';
import CostBreakdownTable from './CostBreakdownTable';
import PropTypes from 'prop-types';
import { Container, Header, Button } from '@awsui/components-react';
import CostBreakdownChart from './CostBreakdownChart';
import { fetchImage } from '../../../../Utils/ImageSelector';

const R = require('ramda');


const getResourceIcon = (type) => {
  return (
    <img
      alt={`${type} icon`}
      src={fetchImage(type)}
      style={{
        background: 'white',
        width: '30px',
        height: '30px',
      }}
    />
  );
};

const columns = [
  {
    id: 'icon',
    header: 'Icon',
    cell: (e) => getResourceIcon(e.type),
    width: 100,
    minWidth: 100,
  },
  {
    id: 'resource',
    header: 'Name',
    cell: (e) => e.resource,
    width: 320,
    minWidth: 320,
    sortingField: 'resource',
  },
  {
    id: 'type',
    header: 'Type',
    cell: (e) => e.type,
    width: 250,
    minWidth: 250,
    sortingField: 'type',
  },
  {
    id: 'cost',
    header: 'Estimated cost',
    cell: (e) => `${e.cost}`,
    sortingField: 'cost',
    width: 300,
    minWidth: 300,
  },
  {
    id: 'accountId',
    header: 'Account Id',
    cell: (e) => e.accountId,
    width: 150,
    minWidth: 150,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.region,
    width: 150,
    minWidth: 150,
    sortingField: 'region',
  },
  {
    id: 'arn',
    header: 'ARN',
    cell: (e) => e.resourceArn,
    width: 150,
    minWidth: 150,
  },
];

const CostBreakdown = ({
  resources,
  selectedItems,
  setSelectedItems,
  getDailyCostBreakdown,
  resourceDailyBreakdown,
}) => {
  const mapIndexed = R.addIndex(R.map);

  const getRows = () =>
    mapIndexed((e, index) => {
      return {
        id: index,
        resource: e.data.title,
        type: e.data.properties.resourceType,
        icon: e.image,
        cost: e.data.cost,
        accountId: e.data.resource.accountId,
        region: e.data.resource.region,
        resourceArn: e.data.resource.arn,
      };
    }, resources);



  return (
    <Container
      disableContentPaddings
      >
      <CostBreakdownTable
        columns={columns}
        trackBy='id'
        rows={getRows()}
        sortColumn={'cost'}
        pageSize={10}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        getDailyCostBreakdown={getDailyCostBreakdown}
      />
      <CostBreakdownChart items={resourceDailyBreakdown}/>
    </Container>
  );
};

CostBreakdown.propTypes = {
  resources: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  getDailyCostBreakdown: PropTypes.func.isRequired,
  resourceDailyBreakdown: PropTypes.array.isRequired,
};

export default CostBreakdown;
