// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';
import LoadBalancerItem from './LoadBalancerDetails/LoadBalancerItem';

import * as R  from 'ramda';
export const parseLoadBalancer = (node) => {
  const properties = R.hasPath(['properties'], node)
    ? node.properties
    : node.data('properties');
  let configuration = JSON.parse(properties.configuration);

  configuration = R.is(Object, configuration)
    ? configuration
    : JSON.parse(configuration);

  const getLoadBalancerType = (properties) => {
    return configuration.type
      ? `${properties.resourceType}-${configuration.type}`
      : `${properties.resourceType}`;
  };

  const state = getStateInformation(properties.state);

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
    icon: fetchImage(getLoadBalancerType(properties), state),
    detailsComponent: (
      <LoadBalancerItem
        title='Load Balancer Details'
        configuration={properties.configuration}
      />
    ),
  };
};
