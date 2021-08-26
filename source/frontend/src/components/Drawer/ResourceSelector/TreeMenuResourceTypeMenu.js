/* eslint-disable react/display-name */
import React from 'react';
import { useResourceState } from '../../Contexts/ResourceContext';
import { useGraphState } from '../../Contexts/GraphContext';
import { buildResourceTypes } from './MenuBuilder';
import { filterResources } from '../../Actions/GraphActions';
import { useCostsState } from '../../Contexts/CostsContext';
import {
  Button,
  ExpandableSection,
  ColumnLayout,
} from '@awsui/components-react';
import { handleResponse } from '../../../API/Handlers/SettingsGraphQLHandler';
const R = require('ramda');

export default () => {
  const [error, setError] = React.useState();
  const [clicked, setClicked] = React.useState();
  const [{ resources, filters }, resourceDispatch] = useResourceState();
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ costPreferences }, costDispatch] = useCostsState();

  const handleTypeSelect = (nodeId) => {
    setClicked(nodeId);
    filterResources({ resourceType: nodeId }, filters, costPreferences)
      .then(handleResponse)      
      .then((response) => {
        setClicked();
        dispatch({
          type: 'clearGraph',
        });
        dispatch({
          type: 'updateGraphResources',
          graphResources: response.body,
        });
      })
      .catch((err) => {
        setClicked();
        setError(err);
      });
  };

  return (
    <ExpandableSection
      className='first-level'
      variant='navigation'
      header={`Types`}>
      {buildResourceTypes(resources).map((resource, index) => {
        return (
          <ExpandableSection
            key={index}
            className='first-level'
            variant='navigation'
            header={resource.label}>
            <ColumnLayout columns={1} disableGutters>
              {resource.nodes.map((subResource, subIndex) => {
                return (
                  <Button
                    loading={R.equals(subResource.filter.resourceType, clicked)}
                    key={subIndex}
                    variant='link'
                    onClick={(event) =>
                      handleTypeSelect(subResource.filter.resourceType)
                    }
                    className='sidepanel-button'>
                    {subResource.label}
                  </Button>
                );
              })}
            </ColumnLayout>
          </ExpandableSection>
        );
      })}
    </ExpandableSection>
  );
};
