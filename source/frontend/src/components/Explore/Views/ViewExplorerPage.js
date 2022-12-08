// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect} from "react";
import * as R  from 'ramda';
import {
  ColumnLayout,
  SpaceBetween,
} from '@awsui/components-react';
import Breadcrumbs from '../../../Utils/Breadcrumbs';
import ViewExplorerResourcesTable from './ViewExplorerResourcesTable';
import ViewExplorerAccountsTable from './ViewExplorerAccountsTable';
import ViewExplorerRegionsTable from './ViewExplorerRegionsTable';
import ViewExplorerResourceTypesTable from './ViewExplorerResourceTypesTable';
import ViewSelector from './Shared/ViewSelector';
import ViewOverview from './Shared/ViewOverview';
import { useDiagramSettingsState } from '../../Contexts/DiagramSettingsContext';
import { useResourceState } from '../../Contexts/ResourceContext';
import {VIEWS} from "../../../routes";

const ViewExplorerPage = () => {
  const [selectedView, setSelectedView] = React.useState(null);
  const [, dispatchCanvas] = useDiagramSettingsState();
  const [, dispatch] = useResourceState();

  useEffect(() => {
    dispatch({
      type: 'select',
      resources: {},
    });
    dispatchCanvas({
      type: 'setCanvas',
      canvas: null,
    });
    dispatchCanvas({
      type: 'setResources',
      resources: [],
    });
  }, [dispatch, dispatchCanvas]);

  return (
    <SpaceBetween size='l'>
      <Breadcrumbs items={[{ text: 'Views', href: VIEWS }]} />
      <ColumnLayout columns={1}>
        <ViewSelector selectedOption={selectedView?.key} onSelect={setSelectedView} />
        {
          selectedView && (
            <>
              <ViewOverview
                accounts={R.pathOr([], ['accounts'], selectedView)}
                regions={R.pathOr([], ['regions'], selectedView)}
                resourceTypes={R.pathOr([], ['resourceTypes'], selectedView)}
              />
              <ColumnLayout columns={3}>
                <ViewExplorerAccountsTable selectedView={selectedView} />
                <ViewExplorerRegionsTable selectedView={selectedView} />
                <ViewExplorerResourceTypesTable selectedView={selectedView} />
              </ColumnLayout>
              <ViewExplorerResourcesTable selectedView={selectedView} />
            </>
          )
        }
      </ColumnLayout>
    </SpaceBetween>
  );
};

export default ViewExplorerPage;
