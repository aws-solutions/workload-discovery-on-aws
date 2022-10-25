import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';
import DatabaseInstanceItem from './DatabaseInstanceDetails/DatabaseInstanceItem';

import * as R  from 'ramda';
export const parseDatabaseInstance = (node) => {
  const properties = R.hasPath(['properties'], node)
    ? node.properties
    : node.data('properties');

  let configuration = JSON.parse(properties.configuration);
  configuration = R.is(Object, configuration)
    ? configuration
    : JSON.parse(configuration);

  const state = getStateInformation(configuration.dBInstanceStatus);

  const getEngineType = () => {
    if (configuration.engine) {
      return `AWS::RDS::DBInstance-${configuration.engine}`;
    } else {
      return 'AWS::RDS::DBInstance';
    }
  };

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
    icon: fetchImage(getEngineType(), state),
    detailsComponent: (
      <DatabaseInstanceItem
        title='Instance Details'
        configuration={properties.configuration}
      />
    ),
  };
};
