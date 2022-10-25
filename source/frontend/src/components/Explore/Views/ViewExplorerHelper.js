import React from 'react';
import { HelpPanel } from '@awsui/components-react';

const ViewExplorerHelper = () => {
  return (
    <HelpPanel header={<h2>Explore Views</h2>}>
      <p>Select a View to see AWS Resources that match its definition</p>
    </HelpPanel>
  );
};

export default ViewExplorerHelper;
