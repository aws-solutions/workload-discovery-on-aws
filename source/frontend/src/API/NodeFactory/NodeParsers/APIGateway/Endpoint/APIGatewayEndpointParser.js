import React from 'react';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import APIEndpointHover from './APIEndpointHover';

export const parseAPIGatewayEndpoint = node => {
  try {
    return {
      styling: {
        borderStyle: 'solid',
        borderColour: '#545B64',
        borderOpacity: 0.25,
        borderSize: 1,
        message: '',
        colour: '#fff'
      },
      icon: fetchImage(node.properties.resourceType),
      hoverComponent: <APIEndpointHover name={node.properties.name} />
    };
  } catch (e) {
    return {};
  }
};
