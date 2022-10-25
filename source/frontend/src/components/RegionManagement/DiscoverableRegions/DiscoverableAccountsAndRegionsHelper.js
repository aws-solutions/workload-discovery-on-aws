import React from 'react';
import { HelpPanel } from '@awsui/components-react';

const DiscoverableAccountsAndRegionsHelper = () => {
  return (
    <HelpPanel header={<h2>Discoverable Accounts & Regions</h2>}>
      <div>
        <p>
          Managed the AWS accounts and Regions that are discoverable to
          Workload Discovery on AWS.
        </p>
        <h3>View Regions</h3>
        <p>
          Select an account in the <strong>Accounts</strong> table to see the
          Regions that are discoverable.
        </p>
        <h3>
          Region displays <strong>Not discovered</strong>
        </h3>
        <p>
          This can be caused by the AWS CloudFormation template not being
          deployed in that Region.
        </p>
        <h3>Remove a Region</h3>
        <p>
          Select the Region from the <strong>Regions</strong> table and click on
          <strong>Remove</strong>. This will remove the Region from the
          Workload Discovery on AWS discovery process and resources from that
          Region will no longer be available.
        </p>
      </div>
    </HelpPanel>
  );
};

export default DiscoverableAccountsAndRegionsHelper;
