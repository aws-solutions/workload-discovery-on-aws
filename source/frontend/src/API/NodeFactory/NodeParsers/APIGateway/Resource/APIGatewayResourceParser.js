import React from 'react';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import APIResourceHover from './APIResourceHover';
const R = require('ramda');
export const parseAPIGatewayResource = (node) => {
  
  try {
    const properties = R.hasPath(['properties'], node)
    ? node.properties
    : node.data('properties');
    return {
      styling: {
        borderStyle: 'solid',
        borderColour: '#545B64',
        borderOpacity: 0.25,
        borderSize: 1,
        message: '',
        colour: '#fff',
      },
      icon: fetchImage(properties.resourceType),
      hoverComponent: (
        <APIResourceHover
          path={properties.path}
        />
      ),
    };
  } catch (e) {
    return {};
  }
};
