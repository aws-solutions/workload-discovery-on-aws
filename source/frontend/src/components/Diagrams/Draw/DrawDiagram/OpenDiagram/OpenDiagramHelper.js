// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { HelpPanel } from '@awsui/components-react';

const OpenDiagramHelper = () => {
  return (
    <HelpPanel header={<h2>Drawing architecture diagrams</h2>}>
      <div>
        <p>Create and update architecture diagrams of AWS workloads</p>
        <h3>Find a resource</h3>
        <p>
          Provide basic configuration information about a resource to the search
          box to find resources of interest. Selecting a resource will add it
          and its related resources to the diagram.
        </p>
        <h3>Actions</h3>
        <h4>Resources</h4>
        <dl>
          <dt>Expand</dt>
          <dd>Fetch related resources of those selected in the diagram.</dd>
          <dt>Focus</dt>
          <dd>
            Remove all resources and show only those related those selected in
            the diagram.
          </dd>
          <dt>Remove</dt>
          <dd>Remove the selected resources from the diagram.</dd>
        </dl>
        <h4>Diagram</h4>
        <dl>
          <dt>Group</dt>
          <dd>Remove edges and show resources grouped by type.</dd>
          <dt>Fit</dt>
          <dd>
            Adjust the zoom to have the diagram in the center of the canvas.
          </dd>
          <dt>Clear</dt>
          <dd>
            Remove <strong>All</strong> the resources from the diagram
          </dd>
          <dt>Delete</dt>
          <dd>Permanently delete the diagram from Workload Discovery on AWS</dd>
        </dl>
      </div>
    </HelpPanel>
  );
};

export default OpenDiagramHelper;
