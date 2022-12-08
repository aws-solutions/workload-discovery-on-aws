// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Container, SpaceBetween, Header } from '@awsui/components-react';
import DiagramTable from './DiagramTable';
import Breadcrumbs from '../../../Utils/Breadcrumbs';
import { DIAGRAM_MANAGEMENT } from '../../../routes';

const DiagramExplorer = () => {
  return (
    <SpaceBetween size='l' direction='vertical'>
      <Breadcrumbs items={[{ text: 'Diagrams', href: DIAGRAM_MANAGEMENT }]} />
      <DiagramTable />
      <Container header={<Header variant='h2'>Preview</Header>}>
        <div
          id='preview'
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
            border: '1px solid rgba(224, 224, 224, 1)',
          }}></div>
      </Container>
    </SpaceBetween>
  );
};

export default DiagramExplorer;
