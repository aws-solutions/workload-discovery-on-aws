import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';
import DatabaseInstanceItem from './DatabaseInstanceDetails/DatabaseInstanceItem';

export const parseDatabaseInstance = node => {
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
    icon: fetchImage(getEngineType(node.properties), state),
    detailsComponent: (
      <DatabaseInstanceItem
        title='Instance Details'
        configuration={node.properties.configuration}
      />
    )
    // hoverComponent: (
    //   <StatementHover
    //     statement={statement}
    //     resourceStatus={getResourceStatus(statement)}
    //     actionStatus={getActionStatus(statement)}
    //   />
    // )
  };
};

const getEngineType = properties => {
  const configuration = JSON.parse(properties.configuration);
  if (configuration.engine) {
    return `AWS::RDS::DBInstance-${configuration.engine}`;
  } else {
    return 'AWS::RDS::DBInstance';
  }
};

const getState = properties => {
  return getStateInformation(properties.dBInstanceStatus);
};
