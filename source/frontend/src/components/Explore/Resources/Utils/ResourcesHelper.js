// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {HelpPanel} from '@cloudscape-design/components';

const Welcome = () => {
    return (
        <HelpPanel header={<h2>AWS Resources</h2>}>
            <div>
                <p>
                    You can explore the AWS Resources that Workload Discovery on
                    AWS has discovered.
                </p>
            </div>
        </HelpPanel>
    );
};

export default Welcome;
