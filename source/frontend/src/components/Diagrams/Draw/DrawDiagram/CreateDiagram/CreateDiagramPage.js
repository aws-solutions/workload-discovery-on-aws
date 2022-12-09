// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useEffect} from 'react';
import { Container, Header, SpaceBetween } from '@awsui/components-react';
import Breadcrumbs from '../../../../../Utils/Breadcrumbs';
import { CREATE_DIAGRAM, DRAW } from '../../../../../routes';
import {useParams} from 'react-router-dom';
import PureCytoscape from '../../Canvas/PureCytoscape';
import CreateDiagramNameForm from './CreateDiagramNameForm';
import { useResourceState } from '../../../../Contexts/ResourceContext';
import { useDiagramSettingsState } from '../../../../Contexts/DiagramSettingsContext';
import { addResources } from '../../Canvas/Commands/CanvasCommands';
import { getStandardLayout } from '../../Canvas/Layout/StandardGraphLayout';

const CreateDiagramPage = () => {
  const [{ canvas }, dispatchCanvas] = useDiagramSettingsState();
  const [{ graphResources }] = useResourceState();
  const [rendered, setRendered] = React.useState(false);
  const { name, visibility } = useParams();
  const showPreview = graphResources?.length > 0;

  const updateCanvas = useCallback((newCanvas) => {
    dispatchCanvas({
      type: 'setCanvas',
      canvas: newCanvas,
    });
  }, [dispatchCanvas]);

  const updateResources =  useCallback(() => {
    dispatchCanvas({
      type: 'setResources',
      resources: canvas.nodes(),
    });
  }, [canvas, dispatchCanvas]);

  useEffect(() => {
    if (canvas && rendered) {
      addResources(
        canvas,
        updateCanvas,
        updateResources,
        graphResources,
        getStandardLayout
      );
    }
  }, [canvas, graphResources, rendered, updateCanvas, updateResources]);

  return (
    <SpaceBetween size='l'>
      <Breadcrumbs
        items={[
          { text: 'Diagrams', href: DRAW },
          { text: 'Create', href: CREATE_DIAGRAM },
        ]}
      />
      <Container header={<Header variant={"h2"}>
        Create Diagram
      </Header>}>
        <CreateDiagramNameForm direction={'vertical'} />
      </Container>
      {
        showPreview && (
          <Container header={<Header>Preview</Header>}>
            <SpaceBetween size='l' direction='vertical'>
              <PureCytoscape
                name={name}
                visibility={visibility}
                setRendered={setRendered}
              />
            </SpaceBetween>
          </Container>
        )
      }
    </SpaceBetween>
  );
};

export default CreateDiagramPage;
