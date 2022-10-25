import React from 'react';
import {Box, HelpPanel} from '@awsui/components-react';

const CostReportHelper = () => {
  return (
    <HelpPanel header={<h2>Diagram Cost Report</h2>}>
      <Box variant={"p"}>
        View the cost data associated with the selected diagram.
      </Box>
      <Box variant={"p"}>
        To view cost data over time, broken down by resource, choose one or more resources
        from the Resources table then choose <strong>Update Graph</strong>.
      </Box>
    </HelpPanel>
  );
};

export default CostReportHelper;
