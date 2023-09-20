// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { HelpPanel } from '@cloudscape-design/components';

const ViewExplorerHelper = () => {
  return (
    <HelpPanel header={<h2>Explore Views</h2>}>
      <p>Select a View to see AWS Resources that match its definition</p>
    </HelpPanel>
  );
};

export default ViewExplorerHelper;
