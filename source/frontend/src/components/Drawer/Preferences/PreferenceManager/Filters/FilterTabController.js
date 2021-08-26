import React from 'react';

import { useResourceState } from '../../../../Contexts/ResourceContext';
import { useGraphState } from '../../../../Contexts/GraphContext';

import Tabs from '@awsui/components-react/tabs';
import ResourceType from './ResourceType/ResourceType';
import AccountFilter from './AccountAndRegionFilter/AccountFilter';

const R = require('ramda');

const FilterTabController = () => {
  const [{ filters }, dispatch] = useResourceState();
  const [{ graphFilters }, updateFilters] = useGraphState();
  return (
    <Tabs    
      tabs={[        
        {
          label: `Regions (${R.length(R.filter(e => !R.isNil(e.region), filters))})`,
          id: 'second',
          content: <AccountFilter />,
        },
        {
          label: `Resource Types (${R.pathOr([], ['typeFilters'], graphFilters).length})`,
          id: 'first',
          content: <ResourceType />,
        },
      ]}
      variant='container'
    />
  );
};

export default FilterTabController;
