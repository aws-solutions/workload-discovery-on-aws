import React from 'react';
import { HelpPanel } from '@awsui/components-react';

const DiagramExplorerHelper = () => {
  return (
    <HelpPanel header={<h2>Manage Diagrams</h2>}>
      <p>
        Choose a Diagram then choose <strong>open</strong> to view and edit the AWS Resources on that diagram.
      </p>
    </HelpPanel>
  )
};

export default DiagramExplorerHelper;
