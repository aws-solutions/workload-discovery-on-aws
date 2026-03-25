// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {fetchImage} from '../../../../Utils/ImageSelector';
import {getStateInformation} from '../../../../Utils/Resources/ResourceStateParser';
import InstanceItem from './InstanceDetails/InstanceItem';

import * as R from 'ramda';

const getImageType = configuration => {
    try {
        return R.head(configuration.instanceType.split('.'));
    } catch (error) {
        return 'AWS::EC2::Instance';
    }
};

export const parseEC2Instance = node => {
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
        state: state,
        icon: fetchImage(getImageType(configuration), state),
        detailsComponent: (
            <InstanceItem
                title="Instance Details"
                configuration={properties.configuration}
            />
        ),
    };
};
