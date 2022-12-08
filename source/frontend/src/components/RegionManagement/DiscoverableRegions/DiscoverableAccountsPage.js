// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { SpaceBetween } from '@awsui/components-react';
import DiscoverableRegionsTable from './DiscoverableRegionsTable';
import Breadcrumbs from '../../../Utils/Breadcrumbs';
import { ACCOUNTS } from '../../../routes';
import DiscoverableAccountsTable from './DiscoverableAccountsTable';
import * as R from "ramda";

const DiscoverableAccountsPage = () => {
  const [selectedAccounts, setSelectedAccounts] = React.useState([]);

  return (
    <SpaceBetween size='l'>
      <Breadcrumbs items={[{ text: 'Accounts', href: ACCOUNTS }]} />
      <SpaceBetween size='l'>
        <DiscoverableAccountsTable
          selectedAccounts={selectedAccounts}
          onSelect={setSelectedAccounts}
        />
        {!R.isEmpty(selectedAccounts) && (
          <DiscoverableRegionsTable
            selectedAccounts={selectedAccounts}
          />
        )}
      </SpaceBetween>
    </SpaceBetween>
  );
};

export default DiscoverableAccountsPage;
