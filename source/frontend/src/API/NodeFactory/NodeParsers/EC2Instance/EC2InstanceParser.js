import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';
import InstanceItem from './InstanceDetails/InstanceItem';

import * as R  from 'ramda';
export const parseEC2Instance = (node) => {
  const getImageType = () => {
    try {
      return R.head(configuration.instanceType.split('.'));
    } catch (error) {
      return 'AWS::EC2::Instance';
    }
  };

  const getState = (properties) => {
    try {
      return getStateInformation(JSON.parse(properties.state).name);
    } catch (e) {
      if (e instanceof SyntaxError) {
        return properties.state
          ? getStateInformation(properties.state)
          : {
              status: 'status-warning',
              text: 'no state data',
              color: '#FF9900',
            };
      }
      return {
        status: 'status-warning',
        text: 'no state data',
        color: '#FF9900',
      };
    }
  };
  const properties = R.hasPath(['properties'], node)
    ? node.properties
    : node.data('properties');
  const state = getState(properties);
  let configuration = JSON.parse(properties.configuration);
  configuration = R.is(Object, configuration)
    ? configuration
    : JSON.parse(configuration);

  return {
    styling: {
      borderStyle: 'dotted',
      borderColour: state.color,
      borderOpacity: 0.25,
      borderSize: 1,
      message: state.text,
      colour: state.color,
    },
    state: state,
    icon: fetchImage(getImageType(), state),
    detailsComponent: (
      <InstanceItem
        title='Instance Details'
        configuration={properties.configuration}
      />
    ),
  };
};
