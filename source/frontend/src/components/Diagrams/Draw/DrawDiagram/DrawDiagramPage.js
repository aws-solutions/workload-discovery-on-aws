// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  SpaceBetween,
} from '@awsui/components-react';
import Breadcrumbs from '../../../../Utils/Breadcrumbs';
import { DRAW } from '../../../../routes';
import { useDiagramSettingsState } from '../../../Contexts/DiagramSettingsContext';
import DiagramTable from '../../Management/DiagramTable';

const DrawDiagramPage = () => {
  const [, dispatch] = useDiagramSettingsState();

  React.useEffect(() => {
    dispatch({
      type: 'clearCanvas',
    });
  }, [dispatch]);

  return (
    <SpaceBetween size='l'>
      <Breadcrumbs items={[{ text: 'Diagrams', href: DRAW }]} />
      <DiagramTable />
    </SpaceBetween>
  );
};

export default DrawDiagramPage;
