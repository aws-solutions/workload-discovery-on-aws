// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {ExpandableSection} from '@cloudscape-design/components';

const ExampleCSV = () => {
    return (
        <ExpandableSection header="Example CSV">
            <pre>
                accountId,accountName,region
                <br />
                123456789123,example-account-1,eu-west-1,
                <br />
                123456789123,example-account-1,eu-west-2,
                <br />
                123456789124,example-account-2,eu-west-1,
                <br />
                123456789125,example-account-3,eu-west-1,
            </pre>
        </ExpandableSection>
    );
};

export default ExampleCSV;
