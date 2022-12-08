// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { HelpPanel } from '@awsui/components-react';
import ExampleCSV from './ExampleCSV'

const ImportRegionHelper = () => {
  return (
    <HelpPanel header={<h2>Import Regions</h2>}>
      <div>
        <p>
          Make AWS Regions discoverable to Workload Discovery on AWS by completing the
          details on this page.
        </p>
        <h3>Deployment method</h3>
        <p>
          Decide which method to use when making AWS Regions discoverable to
          Workload Discovery on AWS.
        </p>
        <dl>
          <dt>AWS CloudFormation StackSets</dt>
          <dd>
            Make a large number of AWS Regions discoverable. Requires additional
            configuration
          </dd>
          <dt>AWS CloudFormation</dt>
          <dd>
            Make an AWS Region discoverable using AWS CloudFormation templates.
            This is useful for small numbers of Regions.
          </dd>
        </dl>
        <h3>Download AWS CloudFormation templates</h3>
        <p>
          Depending on whether the AWS Region being imported is within an AWS
          account that already have a Region discoverable to Workload Discovery on AWS,
          determines which AWS CloudFormation templates you need.
        </p>
        <h3>Regions</h3>
        <p>
          Provide details of the AWS Regions to be made discoverable to
          Workload Discovery on AWS
        </p>
        <dl>
          <dt>Add AWS Regions using a CSV file</dt>
          <dd>Bulk import AWS Region details using a CSV file</dd>
          <ExampleCSV />
        <dt>Add AWS Region using a form</dt>
        <dd>Use the form provided to supply details about the AWS Regions to be imported.</dd>
        </dl>
        <h3>Deploy infrastructure</h3>
        <p>
          Using the <strong>Deploy</strong> button to navigate to the AWS CloudFormation console in the AWS Region to be imported. Deploy the CloudFormation templates downloaded earlier.
        </p>
        <h3>Import</h3>        
        <p>Click <strong>Import</strong> to tell Workload Discovery on AWS to discover resources within the provided AWS Regions</p>
      </div>
    </HelpPanel>
  );
};

export default ImportRegionHelper;
