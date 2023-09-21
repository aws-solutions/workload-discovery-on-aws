// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import StatementItem from './Statement/StatementItem';
import { fetchImage } from '../../../../Utils/ImageSelector';
import * as R  from 'ramda';

const warningResources = (resources) => {
  return resources.filter((resource) => resource.includes('*')).length > 0;
};
const badResources = (resources) => {
  return resources.filter((resource) => resource === '*').length > 0;
};

const warningActions = (actions) => {
  return actions.filter((action) => action.includes('*')).length > 0;
};

const badActions = (actions) => {
  return actions.filter((action) => action === '*').length > 0;
};

function checkBadConditions(actions, resources) {
  return badActions(actions) || badResources(resources)
}

function checkWarningConditions(actions, resources) {
  return warningActions(actions) || warningResources(resources)
}

const removeBrackets = (item) => item.replace(/[[\]']+/g, '').replace('"', '');
export const parseCustomerManagedPolicyStatement = (node) => {
  const properties = R.hasPath(['properties'], node)
    ? node.properties
    : node.data('properties');

  const configuration = R.hasPath(['properties'], node)
    ? node.properties.configuration
    : node.data('properties').configuration;

  let statement;
  try {
    statement = configuration
      ? JSON.parse(JSON.parse(configuration))
      : properties;
  } catch (e) {
    statement = configuration ? JSON.parse(configuration) : properties;
  }
  const actions = R.split(',', removeBrackets(statement.actions));
  const resources = R.split(',', removeBrackets(statement.resources));

  const getColour = () => {
    if (checkBadConditions(actions, resources)) return '#D13212';
    else if (checkWarningConditions(actions, resources)) return '#FF9900';
    return '#1D8102';
  };

  const getStatus = () => {
    if (checkBadConditions(actions, resources)) return { status: 'status-negative' };
    else if (checkWarningConditions(actions, resources))
      return { status: 'status-warning' };
    return { status: 'status-available' };
  };

  const getTitle = () => {
    if (checkBadConditions(actions, resources))
      return 'This is not secure. You should lockdown your policy statements by providing ARNs and full action names';
    else if (checkWarningConditions(actions, resources))
      return `You could further lockdown your policy by providing full resource ARNs and actions and removing any wildcards`;
    return 'The actions and resources covered by this statement';
  };

  return {
    styling: {
      borderStyle: 'dotted',
      borderColour: getColour(),
      borderOpacity: 0.25,
      borderSize: 1,
      message: getTitle(),
      colour: getColour(),
    },
    icon: fetchImage(properties.resourceType, getStatus()),
    detailsComponent: <StatementItem title='Statement' statement={statement} />,
   
  };
};
