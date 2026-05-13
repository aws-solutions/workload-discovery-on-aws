// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {HelpPanel} from '@cloudscape-design/components';
import {matchPath, useLocation} from 'react-router';
import {EDIT_VIEW} from '../../../../routes';

const ViewFormHelper = () => {
    const location = useLocation();
    const isEdit = matchPath({path: EDIT_VIEW, end: true}, location.pathname);

    return (
        <HelpPanel header={<h2>{isEdit ? 'Edit' : 'Create'} a View</h2>}>
            <p>Build a View of specific AWS Resources.</p>
            <dl>
                <dd>
                    <ol>
                        <li>
                            Select <strong>AWS Accounts</strong>.
                        </li>
                        <li>
                            Select <strong>AWS Regions (optional)</strong>.
                        </li>
                        <li>
                            Select <strong>AWS Resource types</strong>.
                        </li>
                        <li>
                            Choose <strong>Save</strong>.
                        </li>
                    </ol>
                </dd>
            </dl>
        </HelpPanel>
    );
};

export default ViewFormHelper;
