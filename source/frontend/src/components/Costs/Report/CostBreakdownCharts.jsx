// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {Container, Header, ColumnLayout} from '@cloudscape-design/components';
import CostBreakdownPie from './CostBreakdownPie';
import {
    getAccountColour,
    getRegionColour,
    getResourceTypeColor,
} from '../../../Utils/ColorCreator';
import PropTypes from 'prop-types';

import * as R from 'ramda';

const CostSummary = ({resources, showZeroCosts}) => {
    const processGroups = (groupBy, colorGenerator) => {
        const groups = groupBy(resources);
        return R.map(e => {
            return {
                title: e,
                color: colorGenerator(e),
                value: showZeroCosts
                    ? R.length(groups[`${e}`])
                    : R.reduce(
                          (acc, val) => R.add(acc, val.data.cost),
                          0,
                          groups[`${e}`]
                      ),
            };
        }, Object.keys(groups));
    };
    const byAccount = R.groupBy(e => e.data.resource.accountId);

    const byRegion = R.groupBy(e => e.data.resource.region);

    const byResourceType = R.groupBy(e => e.data.resource.type);

    return (
        <ColumnLayout columns="3">
            <Container header={<Header variant="h5">Accounts</Header>}>
                <CostBreakdownPie
                    items={processGroups(byAccount, getAccountColour)}
                    value={showZeroCosts ? 'Resource Count' : 'Estimated cost'}
                />
            </Container>
            <Container header={<Header variant="h5">Regions</Header>}>
                <CostBreakdownPie
                    items={processGroups(byRegion, getRegionColour)}
                    value={showZeroCosts ? 'Resource Count' : 'Estimated cost'}
                />
            </Container>
            <Container header={<Header variant="h5">Resource Types</Header>}>
                <CostBreakdownPie
                    items={processGroups(byResourceType, getResourceTypeColor)}
                    value={showZeroCosts ? 'Resource Count' : 'Estimated cost'}
                />
            </Container>
        </ColumnLayout>
    );
};

CostSummary.propTypes = {
    resources: PropTypes.array.isRequired,
};

export default CostSummary;
