// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {fetchImage} from '../../../../../Utils/ImageSelector';

import * as R from 'ramda';
export const parseAPIGatewayEndpoint = node => {
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
        };
    } catch (e) {
        return {};
    }
};
