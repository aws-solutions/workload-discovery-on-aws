import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';
import InstanceItem from './InstanceDetails/InstanceItem';

export const parseEC2Instance = node => {
  const state = getState(node.properties);

  return {
    styling: {
      borderStyle: 'dotted',
      borderColour: state.color,
      borderOpacity: 0.25,
      borderSize: 1,
      message: state.text,
      colour: state.color
    },
    state: state,
    icon: fetchImage(getImageType(node.properties), state),
    detailsComponent: (
      <InstanceItem
        title='Instance Details'
        configuration={node.properties.configuration}
      />
    )
  };
};

const getImageType = properties => {
  if (properties.instanceType) {
    const type = properties.instanceType.split('.')[0];
    return type ? type : 'AWS::EC2::Instance';
  } else {
    return 'AWS::EC2::Instance';
  }
};

const getState = properties => {
  try {
    return getStateInformation(JSON.parse(properties.state).name);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return properties.state
        ? getStateInformation(properties.state)
        : {
            status: 'status-warning',
            text: 'no state data',
            color: '#FF9900'
          };
    }
    return {
      status: 'status-warning',
      text: 'no state data',
      color: '#FF9900'
    };
  }
};
