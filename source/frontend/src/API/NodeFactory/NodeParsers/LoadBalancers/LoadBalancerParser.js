import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';
import LoadBalancerHover from './LoadBalancerDetails/LoadBalancerHover';
import LoadBalancerItem from './LoadBalancerDetails/LoadBalancerItem';

export const parseLoadBalancer = node => {
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
    icon: fetchImage(getLoadBalancerType(node.properties), state),
    detailsComponent: (
      <LoadBalancerItem
        title='Load Balancer Details'
        configuration={node.properties.configuration}
      />
    ),
    hoverComponent: (
      <LoadBalancerHover configuration={node.properties.configuration} />
    )
  };
};

const getLoadBalancerType = properties => {
  return `${properties.resourceType}-${properties.type}`;
};

const getState = properties => {
  
    return getStateInformation(properties.state);
};
