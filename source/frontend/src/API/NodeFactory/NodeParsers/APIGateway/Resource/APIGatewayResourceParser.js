import React from 'react';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import APIResourceHover from './APIResourceHover';

export const parseAPIGatewayResource = node => {
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
      hoverComponent: <APIResourceHover path={node.properties.path} />
    };
  } catch (e) {
    return {};
  }
};
