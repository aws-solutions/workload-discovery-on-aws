import React, { useRef, useState } from 'react';
import CostDialog from './CostDialog';
import { Button, ColumnLayout } from '@awsui/components-react';
import { useGraphState } from '../../Contexts/GraphContext';
import { useCostsState } from '../../Contexts/CostsContext';
import CostOverview from './Report/CostOverview';
const R = require('ramda');

const TreeMenuCostsMenu = () => {
  const [costDialog, setCostDialog] = useState(false);
  const [showCostReport, setShowCostReport] = useState(false);
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ costPreferences }, costDispatch] = useCostsState();
  const handleSelect = () => {
    setCostDialog(!costDialog);
  };

  const toggleDialog = () => {
    setCostDialog(!costDialog);
  };

  const generateReport = () => {
    setShowCostReport(!showCostReport);
  };

  return (
    <ColumnLayout columns={1} disableGutters>
      <Button
        variant='link'
        onClick={handleSelect}
        className='sidepanel-button'>
        Query
      </Button>
      <Button
        disabled={R.isEmpty(graphResources)}
        variant='link'
        onClick={generateReport}
        className='sidepanel-button'>
        Generate cost report
      </Button>

      {costDialog && <CostDialog toggleModal={toggleDialog} />}
      {showCostReport && (
        <CostOverview
          resources={graphResources}
          costPreferences={costPreferences}
        />
      )}
    </ColumnLayout>
  );
};

export default TreeMenuCostsMenu;
