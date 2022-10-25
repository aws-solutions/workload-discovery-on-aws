import React from 'react';
import { HelpPanel } from '@awsui/components-react';

const Welcome = () => {
  return (
    <HelpPanel
      header={<h2>AWS Resources</h2>}>
      <div>
        <p>
          You can explore the AWS Resources that Workload Discovery on AWS has discovered.
        </p>
      </div>
    </HelpPanel>
  );
};

export default Welcome;
