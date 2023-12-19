// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { fetchImage } from '../../../../Utils/ImageSelector';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';

import * as R  from 'ramda';

export const parseLambdaFunction = (node) => {

    const properties = R.hasPath(['properties'], node)
        ? node.properties
        : node.data('properties');

    let configuration = JSON.parse(properties.configuration);
    configuration = R.is(Object, configuration)
        ? configuration
        : JSON.parse(configuration);

    const state = getStateInformation(configuration.state);

    return {
        styling: {
            borderStyle: 'dotted',
            borderColour: state.color,
            borderOpacity: 0.25,
            borderSize: 1,
            message: state.text,
            colour: state.color,
        },
        state,
        icon: fetchImage(properties.resourceType, state)
    };
};
