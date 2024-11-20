// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {ColumnLayout, SpaceBetween} from '@cloudscape-design/components';
import ValueWithLabel from '../../../../../components/Shared/ValueWithLabel';

const parseConfiguration = configuration => {
    try {
        return JSON.parse(JSON.parse(configuration));
    } catch (Error) {
        return JSON.parse(configuration);
    }
};

export const LoadBalancerItem = ({configuration}) => {
    const parsedConfig = parseConfiguration(configuration);

    return (
        <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="l">
                <ValueWithLabel label="Scheme">
                    {parsedConfig.scheme}
                </ValueWithLabel>
            </SpaceBetween>
            <SpaceBetween size="l">
                <ValueWithLabel label="Type">
                    {parsedConfig.type ? parsedConfig.type : 'Classic'}
                </ValueWithLabel>
            </SpaceBetween>
        </ColumnLayout>
    );
};

export default LoadBalancerItem;
