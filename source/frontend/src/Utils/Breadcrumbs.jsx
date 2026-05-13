// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {BreadcrumbGroup} from '@cloudscape-design/components';
import {useNavigate} from 'react-router';
import PropTypes from 'prop-types';
import {HOMEPAGE_PATH} from '../routes';

const Breadcrumbs = ({items = []}) => {
    const navigate = useNavigate();

    return (
        <BreadcrumbGroup
            onFollow={e => {
                e.preventDefault();
                navigate(e.detail.href);
            }}
            ariaLabel="Breadcrumbs"
            items={[
                {text: 'Workload Discovery on AWS', href: HOMEPAGE_PATH},
            ].concat(items)}
        />
    );
};

Breadcrumbs.propTypes = {
    items: PropTypes.array,
};

export default Breadcrumbs;
