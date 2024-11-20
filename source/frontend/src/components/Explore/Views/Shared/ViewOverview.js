// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    ColumnLayout,
    Container,
    Header,
    TextContent,
} from '@cloudscape-design/components';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import ValueWithLabel from '../../../Shared/ValueWithLabel';

const ViewOverview = ({accounts, resourceTypes}) => {
    const accountsToRegionList = R.uniq(R.chain(i => i.regions, accounts));

    return (
        <Container header={<Header>Overview</Header>}>
            <ColumnLayout columns={4} variant="text-grid">
                <ValueWithLabel label="Accounts">
                    <TextContent>
                        <h1>{R.length(accounts)}</h1>
                    </TextContent>
                </ValueWithLabel>
                <ValueWithLabel label="Regions">
                    <TextContent>
                        <h1>{R.length(accountsToRegionList)}</h1>
                    </TextContent>
                </ValueWithLabel>
                <ValueWithLabel label="Resources types">
                    <TextContent>
                        <h1>{R.length(resourceTypes)}</h1>
                    </TextContent>
                </ValueWithLabel>
            </ColumnLayout>
        </Container>
    );
};

ViewOverview.propTypes = {
    accounts: PropTypes.array.isRequired,
    regions: PropTypes.array.isRequired,
    resourceTypes: PropTypes.array.isRequired,
};

export default ViewOverview;
