// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Box,
  ColumnLayout,
  Container,
  Header, Spinner,
} from '@cloudscape-design/components';
import * as R from "ramda";
import {
  useResourcesAccountMetadata,
  useResourcesMetadata,
  useResourcesRegionMetadata
} from "../../Hooks/useResourcesMetadata";
import ValueWithLabel from '../../Shared/ValueWithLabel';

const ResourceOverview = () => {
  const { data: resources= {accounts: []}, isLoading: loadingResources } = useResourcesMetadata();
  const accountsFilter = resources.accounts.map(({accountId}) => ({accountId}));
  const { data: accounts=[], isLoading: loadingAccounts } = useResourcesAccountMetadata(accountsFilter, {batchSize: 50});
  const { data: regions=[], isLoading: loadingRegions } = useResourcesRegionMetadata(accountsFilter, {batchSize: 50});

  const regionCount = R.reduce((acc, val) => R.add(acc, R.length(val.regions)), 0, regions);

  return (
    <Container data-testid='resources-metadata-overview' header={<Header>Overview</Header>}>
      {
        loadingAccounts || loadingRegions || loadingResources
          ? <Spinner/>
          : (
            <ColumnLayout columns={4} variant='text-grid'>
              <ValueWithLabel label='Resources discovered'>
                <Box tagOverride={"p"} variant={"h1"}>
                  {resources.count ?? "-"}
                </Box>
              </ValueWithLabel>
              <ValueWithLabel label='Resources types'>
                <Box tagOverride={"p"} variant={"h1"}>
                  {resources.resourceTypes?.length ?? "-"}
                </Box>
              </ValueWithLabel>
              <ValueWithLabel label='Accounts'>
                <Box tagOverride={"p"} variant={"h1"}>
                  {R.length(accounts)}
                </Box>
              </ValueWithLabel>
              <ValueWithLabel label='Regions'>
                <Box tagOverride={"p"} variant={"h1"}>
                  {regionCount}
                </Box>
              </ValueWithLabel>
            </ColumnLayout>
          )
      }
    </Container>
  );
};

export default ResourceOverview;
