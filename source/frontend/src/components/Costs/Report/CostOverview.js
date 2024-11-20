// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useState} from 'react';
import {
    SpaceBetween,
    Container,
    Header,
    Spinner,
    Box,
} from '@cloudscape-design/components';
import CostBreakdownSummary from './CostBreakdownSummary';
import CostBreakdown from './CostBreakdown';
import CostForm from './CostForm';
import {useParams} from 'react-router-dom';
import {diagramsPrefix, useObject} from '../../Hooks/useS3Objects';
import Breadcrumbs from '../../../Utils/Breadcrumbs';
import {COST_REPORT, DRAW, OPEN_DIAGRAM} from '../../../routes';
import * as R from 'ramda';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import useResourceCosts, {useDailyResourceCosts} from '../../Hooks/useCosts';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const processCosts = (costs, resources) => {
    const processedResources = [];
    R.forEach(e => {
        R.forEach(n => {
            if (R.hasPath(['data', 'resourceId'], n)) {
                if (R.includes(e.id, n.data.resourceId)) {
                    processedResources.push(
                        R.mergeDeepRight(n, {
                            data: {
                                cost: e.cost,
                                service: e.service,
                            },
                        })
                    );
                }
            }
        }, resources);
    }, costs);
    return processedResources;
};

const getPageSize = (items, dateInterval) =>
    dayjs(dateInterval.endDate).diff(dayjs(dateInterval.startDate), 'day') *
    items.length;

const CostOverview = () => {
    const {name, visibility} = useParams();
    const [selectedItems, setSelectedItems] = useState([]);
    const [dateInterval, setDateInterval] = useState({
        type: 'absolute',
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    });
    const {data: diagramData = [], isLoading: loadingDiagram} = useObject(
        name,
        diagramsPrefix,
        visibility
    );
    const resources = R.compose(
        R.uniqBy(R.pathEq(['data', 'title'])),
        R.filter(e => R.equals(e.data?.type, 'resource'))
    )(diagramData.nodes ?? {});
    const {data: costs = [], isLoading: loadingCosts} = useResourceCosts(
        resources,
        dateInterval
    );
    const costResources = processCosts(costs, resources);
    const {
        data: resourceDailyBreakdown = [],
        isLoading: loadingDailyBreakdown,
    } = useDailyResourceCosts(
        selectedItems,
        dateInterval,
        getPageSize(selectedItems, dateInterval)
    );

    return (
        <SpaceBetween direction="vertical" size="l">
            <Breadcrumbs
                items={[
                    {text: 'Diagrams', href: DRAW},
                    {
                        text: name,
                        href: OPEN_DIAGRAM.replace(':name', name).replace(
                            ':visibility',
                            visibility
                        ),
                    },
                    {text: 'Cost Report', href: COST_REPORT},
                ]}
            />
            {loadingDiagram ? (
                <Box textAlign={'center'}>
                    <Spinner size={'large'} />
                </Box>
            ) : (
                <>
                    <Container
                        header={
                            <Header
                                description="This report shows a summary of interesting cost data for this workload"
                                variant="h2"
                            >
                                Cost Report
                            </Header>
                        }
                    >
                        <CostForm setDateInterval={setDateInterval} />
                    </Container>
                    {loadingCosts ? (
                        <Box textAlign={'center'}>
                            <Spinner size={'large'} />
                        </Box>
                    ) : (
                        <>
                            <CostBreakdownSummary resources={costResources} />
                            <CostBreakdown
                                resources={costResources}
                                setSelectedItems={setSelectedItems}
                                loading={loadingDailyBreakdown}
                                resourceDailyBreakdown={resourceDailyBreakdown}
                            />
                        </>
                    )}
                </>
            )}
        </SpaceBetween>
    );
};

export default CostOverview;
