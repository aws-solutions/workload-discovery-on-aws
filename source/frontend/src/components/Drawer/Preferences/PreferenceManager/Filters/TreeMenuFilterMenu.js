import React, { useState } from 'react';
import { useResourceState } from '../../../../Contexts/ResourceContext';
import FilterDialog from './FilterDialog';
import { useGraphState } from '../../../../Contexts/GraphContext';
import { Button } from '@awsui/components-react';
import Notification from '../../../../../Utils/Notifications/Notification';
const R = require('ramda');

const TreeMenuFilterMenu = () => {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [filterDialog, setFilterDialog] = useState(false);
  const [{ filters }] = useResourceState();
  const [{ graphFilters }] = useGraphState();

  const handleSelect = () => {
    setFilterDialog(!filterDialog);
  };

  const toggleDialog = () => {
    setFilterDialog(!filterDialog);
  };

  const getFilterCount = () => {
    return (
      R.length(R.filter((e) => !R.isNil(e.region), filters)) +
      graphFilters.typeFilters.length
    );
  };

  return (
    <>
      <Button
        variant='link'
        onClick={handleSelect}
        className='sidepanel-button'>
        {getFilterCount() > 0 ? (
          <Notification label='Filters' count={getFilterCount()} />
        ) : (
          'Filters'
        )}
      </Button>
      {filterDialog && <FilterDialog toggleDialog={toggleDialog} />}
    </>
  );
};

export default TreeMenuFilterMenu;
