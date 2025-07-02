// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {Box} from '@cloudscape-design/components';
import PropTypes from 'prop-types';

const ValueWithLabel = ({label, textAlign, variant, children}) => (
    <div>
        <Box
            margin={{bottom: 'xxxs'}}
            color="text-label"
            variant={variant}
            textAlign={textAlign}
        >
            {label}
        </Box>
        <div>{children}</div>
    </div>
);

ValueWithLabel.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.object,
};

export default ValueWithLabel;
