// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react';
import {ColumnLayout, Container, Header, SpaceBetween} from '@cloudscape-design/components';
import ResourcesTypes from './Types/TypeOverview/ResourcesTypes';
import ResourceOverview from './ResourceOverview';
import Breadcrumbs from '../../../Utils/Breadcrumbs';
import { RESOURCES } from '../../../routes';
import { useDiagramSettingsState } from '../../Contexts/DiagramSettingsContext';
import { useResourceState } from '../../Contexts/ResourceContext';
import AccountMultiSelect from "./Types/TypeOverview/AccountMultiSelect";
import RegionMultiSelect from "./Types/TypeOverview/RegionMultiSelect";
import * as R from "ramda";
import {useDeepCompareEffect} from "react-use";
import ResourcesTable from "../Shared/ResourcesTable";

const ResourcesPage = () => {
  const [, dispatchCanvas] = useDiagramSettingsState();
  const [, dispatch] = useResourceState();
  const [selectedResourceTypes, setSelectedResourceTypes] = React.useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);

  useEffect(() => {
    dispatchCanvas({
      type: 'setCanvas',
      canvas: null,
    });
    dispatchCanvas({
      type: 'setResources',
      resources: [],
    });
    dispatch({
      type: 'select',
      resources: {},
    });
  }, [dispatch, dispatchCanvas]);

  useDeepCompareEffect(() => {
    if(selectedAccounts.length === 0)
      setSelectedRegions([]);
  }, [selectedAccounts, setSelectedRegions]);

  const handleAvailableRegionsChange = (options) => {
    if (!selectedRegions.every(i => options.includes(i)))
      setSelectedRegions(selectedRegions.filter(i => options.includes(i)))
  }

  const regionsToQueryParam = selectedRegions.length > 0
    ? {regions: R.uniq(R.map(i => ({name: i}), selectedRegions))}
    : {}

  return (
    <SpaceBetween size='l'>
      <Breadcrumbs items={[{ text: 'Resources', href: RESOURCES }]} />
      <ColumnLayout columns={1}>
        <ResourceOverview/>
        <Container header={<Header variant={"h2"}>Resource Filters</Header>}>
          <SpaceBetween size={"s"}>
            <AccountMultiSelect selected={selectedAccounts} onChange={setSelectedAccounts}/>
            <RegionMultiSelect
              accounts={selectedAccounts}
              selected={selectedRegions}
              onChange={setSelectedRegions}
              onOptionsChange={handleAvailableRegionsChange}
              disabled={selectedAccounts.length === 0}
            />
          </SpaceBetween>
        </Container>
        <ResourcesTypes
          accounts={selectedAccounts.map(i => ({
            accountId: i,
            ...regionsToQueryParam
          }))}
          onSelection={setSelectedResourceTypes}
        />
        <ResourcesTable
            accounts={selectedAccounts.map(i => ({
                accountId: i,
                ...(selectedRegions.length > 0 ? {regions: selectedRegions.map(i => ({name: i}))} : {})
            }))}
            resourceTypes={R.map((e) => e.type, selectedResourceTypes)}
            pageSize={10}
        />
      </ColumnLayout>
    </SpaceBetween>
  );
};

export default ResourcesPage;
