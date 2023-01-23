// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { saveAs } from 'file-saver';
import {
  Button,
  SpaceBetween,
  Input,
  FormField,
  Form,
  Container,
  Header,
  RadioGroup,
} from '@awsui/components-react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../../../../Utils/Breadcrumbs';
import { DRAW, EXPORT, OPEN_DIAGRAM } from '../../../../../routes';
import { exportCSVFromCanvas } from './CSV/CreateCSVExport';
import { exportJSON } from './JSON/CreateJSONExport';
import * as R  from 'ramda';
import {diagramsPrefix, useObject} from "../../../../Hooks/useS3Objects";
import {useDrawIoUrl} from "../../../../Hooks/useDrawIoUrl";
import validFilename from 'valid-filename';

const ExportDiagram = () => {
  const [error, setError] = React.useState(false);
  const { name, visibility } = useParams();
  const [filename, setFilename] = React.useState(name);
  const [fileType, setFileType] = React.useState('drawio');
  const {data=[], isLoading: loadingDiagram} = useObject(name, diagramsPrefix, visibility);
  const { data: drawIoUrl, isLoading: loadingDrawIoUrl } = useDrawIoUrl(name, visibility);

  const saveFile = (blob) => {
    if (validFilename(name)) {
      setError(false);
      saveAs(blob, name);
    } else {
      setError(true);
    }
  };

  const handleExport = () => {
    const diagramData = R.pick(["nodes", "edges"], data)
    switch (fileType) {
      case 'drawio':
        window.open(drawIoUrl, '_blank', 'rel=noreferrer')
        break;
      case 'csv':
        exportCSVFromCanvas(diagramData, name);
        break;
      case 'json':
        saveFile(exportJSON(diagramData));
        break;
      default:
        break;
    }
  };

  return (
    <SpaceBetween direction='vertical' size='l'>
      <Breadcrumbs
        items={[
          { text: 'Diagrams', href: DRAW },
          {
            text: name,
            href: OPEN_DIAGRAM.replace(':name', name).replace(
              ':visibility',
              visibility
            ),
          },
          { text: 'Export', href: EXPORT },
        ]}
      />

      <Container header={<Header variant='h1'>Export</Header>}>
        <Form
          actions={
            <Button
              disabled={loadingDiagram || (fileType === "drawio" && !drawIoUrl)}
              variant='primary'
              loading={loadingDiagram || (fileType === "drawio" && loadingDrawIoUrl)}
              iconName={R.equals('drawio', fileType) ? 'external' : 'download'}
              onClick={handleExport}>
              Export
            </Button>
          }>
          <SpaceBetween direction='vertical' size='l'>
            <FormField
              label='Export type'
              description='Select the type to export as.'>
              <RadioGroup
                onChange={({ detail }) => setFileType(detail.value)}
                value={fileType}
                items={[
                  {
                    value: 'json',
                    label: 'JSON',
                    description:
                      'Export a JSON representation of the architecture diagram',
                  },
                  {
                    value: 'csv',
                    label: 'CSV',
                    description:
                      'Export a Comma-separated values representation of the architecture diagram',
                  },
                  {
                    value: 'drawio',
                    label: 'Diagrams.net (formerly Draw.io)',
                    description: 'Export the architecture diagram as a diagrams.net URL with the diagram contents base64 encoded in the URL query string (opens in a new tab).',
                  },
                ]}
              />
            </FormField>
            <FormField
              label='File name'
              errorText={error ? 'Please enter a valid file name' : null}
              description='Provide a name for the export'>
              <Input
                value={filename}
                invalid={error}
                onChange={({ detail }) => setFilename(detail.value)}
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </Container>
    </SpaceBetween>
  );
};

export default ExportDiagram;
