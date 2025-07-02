// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {RadioGroup} from '@cloudscape-design/components';
import {IMPORT_CSV, IMPORT_INPUT} from '../../../config/constants';

const RegionUploadMethod = ({setUploadMethod}) => {
    const [value, setValue] = React.useState(IMPORT_INPUT);

    const onSelectionChange = uploadMethod => {
        setValue(uploadMethod);
        setUploadMethod(uploadMethod);
    };
    return (
        <RadioGroup
            onChange={({detail}) => onSelectionChange(detail.value)}
            value={value}
            items={[
                {
                    value: IMPORT_INPUT,
                    label: 'Add Accounts & Regions using a form.',
                    description:
                        'Provide the AWS Account and Region details using the form provided.',
                },
                {
                    value: IMPORT_CSV,
                    label: 'Add Accounts & Regions using a CSV file',
                    description:
                        'Provide up to 50 AWS Account/Region pairs in a CSV file.',
                },
            ]}
        />
    );
};

export default RegionUploadMethod;
