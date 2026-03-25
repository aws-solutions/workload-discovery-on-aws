// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    Box,
    Container,
    ColumnLayout,
    TextContent,
} from '@cloudscape-design/components';
import PropTypes from 'prop-types';

const SummaryOverview = ({cost, from, to, resultCount}) => {
    return (
        <Container data-testid="costs-summary-overview">
            <ColumnLayout disableGutters columns="4" variant="text-grid">
                <div>
                    <Box margin={{bottom: 'xxxs'}} color="text-label">
                        Estimated AWS cost
                    </Box>
                    <TextContent>
                        <h1>{cost}</h1>
                    </TextContent>
                </div>
                <div>
                    <Box margin={{bottom: 'xxxs'}} color="text-label">
                        AWS Resources
                    </Box>
                    <TextContent>
                        <h1>{resultCount}</h1>
                    </TextContent>
                </div>
                <div>
                    <Box margin={{bottom: 'xxxs'}} color="text-label">
                        From
                    </Box>
                    <TextContent>
                        <h1>{from}</h1>
                    </TextContent>
                </div>
                <div>
                    <Box margin={{bottom: 'xxxs'}} color="text-label">
                        To
                    </Box>
                    <TextContent>
                        <h1>{to}</h1>
                    </TextContent>
                </div>
            </ColumnLayout>
        </Container>
    );
};

SummaryOverview.propTypes = {
    cost: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    resultCount: PropTypes.number.isRequired,
};

export default SummaryOverview;
