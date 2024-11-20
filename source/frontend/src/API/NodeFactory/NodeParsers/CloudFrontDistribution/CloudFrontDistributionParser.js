// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {fetchImage} from '../../../../Utils/ImageSelector';
import CloudFrontDistributionItem from './CloudFrontDistributionDetails/CloudFrontDistributionItem';

import * as R from 'ramda';
export const parseCloudFrontDistribution = node => {
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
        icon: fetchImage(properties.resourceType, undefined),
        detailsComponent: (
            <CloudFrontDistributionItem
                title="Distribution Details"
                configuration={properties.configuration}
            />
        ),
    };
};
