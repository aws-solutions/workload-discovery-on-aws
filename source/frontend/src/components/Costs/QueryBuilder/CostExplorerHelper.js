import React from 'react';
import {Box, HelpPanel} from '@awsui/components-react';

const CostExplorerHelper = () => {
  return (
    <HelpPanel header={<h2>Explore Costs</h2>}>
      <Box>
        <Box variant={"p"}>Choose whether to explore costs for all resources, or to narrow the cost query results down by</Box>
        <ul>
          <li>AWS Service</li>
          <li>AWS Resource ID/ARN</li>
        </ul>
      </Box>
      <Box variant={"p"}>
        Ensure you select the appropriate time period for the cost calculation. You can also filter the
        resources included in the cost calculation by Account and Region.
      </Box>
      <Box variant={"p"}>
        Once costs have been calculated, you can select multiple resources from the results table and add
        them to a new diagram via the <strong>Actions</strong> menu button.
      </Box>
    </HelpPanel>
  );
};

export default CostExplorerHelper;
