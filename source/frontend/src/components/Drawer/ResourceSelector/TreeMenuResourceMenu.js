/* eslint-disable react/display-name */
import React from 'react';

import { useResourceState } from '../../Contexts/ResourceContext';
import { useGraphState } from '../../Contexts/GraphContext';
import { buildResources } from './MenuBuilder';

import { useCostsState } from '../../Contexts/CostsContext';
import {
  ExpandableSection,
  Button,
  ColumnLayout,
} from '@awsui/components-react';
import {
  getLinkedNodesHierarchy,
  sendGetRequests,
  wrapGetLinkedNodesHierachyRequest,
} from '../../../API/Handlers/ResourceGraphQLHandler';
import { handleSelectedResource } from '../../../API/Processors/NodeProcessors';
import { processHierarchicalNodeData } from '../../../API/APIProcessors';
const R = require('ramda');

export default () => {
  const [clicked, setClicked] = React.useState();
  const [error, setError] = React.useState();
  const [{ resources }, resourceDispatch] = useResourceState();
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ costPreferences }, costDispatch] = useCostsState();

  const handleNodeSelect = (nodeId) => {
    setClicked(nodeId);
    sendGetRequests(
      R.map(
        (e) =>
          wrapGetLinkedNodesHierachyRequest(
            getLinkedNodesHierarchy,
            {
              id: e,
            },
            e,
            costPreferences,
            graphResources
          )
            .then((node) =>
              handleSelectedResource(
                processHierarchicalNodeData(
                  R.pathOr(
                    [],
                    ['body', 'data', 'getLinkedNodesHierarchy'],
                    node
                  ),
                  e,
                  costPreferences
                ),
                e,
                graphResources
              )
            )
            .catch((err) => {
              setClicked(false);
              setError(err);
            }),
        [nodeId]
      )
    )
      .then((e) => Promise.all(e))
      .then(R.flatten)
      .then((nodes) => {
        dispatch({
          type: 'updateGraphResources',
          graphResources: nodes,
        });
        setClicked(false);
      })
      .catch((err) => {
        setError(true);
        setClicked(false);
      });
  };

  return (
    <ExpandableSection
      className='second-level'
      variant='navigation'
      header={`All`}>
      {buildResources(resources).map((resource, index) => {
        return (
          <ExpandableSection
            key={index}
            className='third-level'
            variant='navigation'
            header={resource.label}>
            {resource.nodes.map((subResource, subIndex) => {
              return (
                <ExpandableSection
                  key={subIndex}
                  className='third-level'
                  variant='navigation'
                  header={subResource.label}>
                  <ColumnLayout columns={1} disableGutters>
                    {subResource.nodes.map((node, nodeIndex) => {
                      return (
                        <Button
                          loading={R.equals(node.nodeId, clicked)}
                          key={nodeIndex}
                          variant='link'
                          onClick={(nodeIndex) => handleNodeSelect(node.nodeId)}
                          className='sidepanel-button'>
                          {node.fullLabel}
                        </Button>
                      );
                    })}
                  </ColumnLayout>
                </ExpandableSection>
              );
            })}
          </ExpandableSection>
        );
      })}
    </ExpandableSection>
  );
};
