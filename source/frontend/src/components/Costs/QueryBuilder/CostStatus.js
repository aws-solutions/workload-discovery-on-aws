// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    Container,
    Header,
    SpaceBetween,
    ColumnLayout,
    StatusIndicator,
    Alert,
    Link,
    Box,
} from '@cloudscape-design/components';
import ValueWithLabel from '../../Shared/ValueWithLabel';
import {useGetCostReportProcessingStatus} from '../../Hooks/useCosts';

dayjs.extend(relativeTime);

const NO_DATA = 'No data available';
const DAY_IN_HOURS = 24;

const CostStatusIndicator = ({
    isLoading,
    type = 'success',
    loadingText = 'Loading',
    children,
    iconAriaLabel,
}) => {
    if (isLoading) {
        return (
            <StatusIndicator
                type="loading"
                iconAriaLabel={`Loading status: ${loadingText}`}
            >
                {loadingText}
            </StatusIndicator>
        );
    }

    return (
        <StatusIndicator type={type} iconAriaLabel={iconAriaLabel}>
            {children}
        </StatusIndicator>
    );
};

export const CostStatus = () => {
    const {data: costStatus, isLoading} = useGetCostReportProcessingStatus();
    const [lastDeliveredStatus, setLastDeliveredStatus] = useState({
        type: 'pending',
        text: NO_DATA,
        isStale: false,
    });
    const [lastProcessedStatus, setLastProcessedStatus] = useState({
        type: 'pending',
        text: NO_DATA,
        isStale: false,
    });

    useEffect(() => {
        if (costStatus?.isEnabled) {
            const lastDelivered = costStatus?.reports?.lastDelivered;

            if (lastDelivered != null) {
                const isStale =
                    dayjs().diff(dayjs(lastDelivered), 'hour') >= DAY_IN_HOURS;
                setLastDeliveredStatus({
                    type: isStale ? 'warning' : 'success',
                    date: dayjs(lastDelivered).format('MMM D, YYYY h:mm A'),
                    isStale,
                });
            }

            const lastProcessed = costStatus?.crawler?.lastCrawled;
            if (lastProcessed != null) {
                const isStale =
                    dayjs().diff(dayjs(lastProcessed), 'hour') > DAY_IN_HOURS;

                const type =
                    costStatus.crawler.errorMessage != null
                        ? 'error'
                        : isStale
                          ? 'warning'
                          : 'success';

                setLastProcessedStatus({
                    type,
                    date: dayjs(lastProcessed).format('MMM D, YYYY h:mm A'),
                    isStale,
                    errorMessage: costStatus.crawler.errorMessage,
                });
            }
        }
    }, [costStatus]);

    const isCostFeatureEnabled = () => {
        return !isLoading && costStatus?.isEnabled;
    };

    const hasStaleReportDelivery = () => {
        return isCostFeatureEnabled() && lastDeliveredStatus.isStale;
    };

    const hasStaleReportProcessing = () => {
        return (
            isCostFeatureEnabled() &&
            lastProcessedStatus.isStale &&
            !lastProcessedStatus.errorMessage
        );
    };

    const hasReportProcessingError = () => {
        return (
            isCostFeatureEnabled() && lastProcessedStatus.errorMessage != null
        );
    };

    return (
        <Container header={<Header>Overview</Header>}>
            <SpaceBetween size="m">
                <ColumnLayout columns={3} variant="text-grid">
                    <ValueWithLabel
                        label="Cost & Usage Report Delivery"
                        variant="awsui-key-label"
                    >
                        <CostStatusIndicator
                            isLoading={isLoading}
                            type={costStatus?.isEnabled ? 'success' : 'pending'}
                        >
                            {costStatus?.isEnabled ? 'Enabled' : 'Not enabled'}
                        </CostStatusIndicator>
                    </ValueWithLabel>
                    <ValueWithLabel
                        label="Last Report Delivered"
                        variant="awsui-key-label"
                    >
                        <CostStatusIndicator
                            isLoading={isLoading}
                            iconAriaLabel={`Delivery status: ${lastDeliveredStatus.type}`}
                            type={lastDeliveredStatus.type}
                        >
                            {lastDeliveredStatus.date}
                        </CostStatusIndicator>
                    </ValueWithLabel>
                    <ValueWithLabel
                        label="Last Report Processed"
                        variant="awsui-key-label"
                    >
                        <CostStatusIndicator
                            isLoading={isLoading}
                            iconAriaLabel={`CUR processing status: ${lastProcessedStatus.type}`}
                            type={lastProcessedStatus.type}
                        >
                            {lastProcessedStatus.date}
                        </CostStatusIndicator>
                    </ValueWithLabel>
                </ColumnLayout>
                {!isCostFeatureEnabled() && (
                    <Alert
                        statusIconAriaLabel="Cost enabled warning"
                        type="warning"
                    >
                        The Workload Discovery cost feature is not enabled by
                        default. You must configure the delivery of your Cost &
                        Usage Reports to the Workload Discovery cost report
                        bucket in S3. Please follow the steps in the{' '}
                        <Link
                            external
                            href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/set-up-the-cost-feature.html"
                        >
                            documentation
                        </Link>{' '}
                        to set up the report delivery.
                    </Alert>
                )}
                {hasStaleReportDelivery() && (
                    <Alert
                        statusIconAriaLabel="Stale delivery warning"
                        type="warning"
                    >
                        Workload Discovery has been configured to receive Cost &
                        Usage reports but has not received a new report{' '}
                        {dayjs(lastDeliveredStatus.date).toNow()}. Please verify
                        that the{' '}
                        <Link
                            external
                            href={`https://console.aws.amazon.com/go/view/${costStatus.reports.curBucketArn}`}
                        >
                            cost and usage report bucket
                        </Link>{' '}
                        is still configured to receive cost reports. The steps
                        on how to configure report delivery are in the{' '}
                        <Link
                            external
                            href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/set-up-the-cost-feature.html"
                        >
                            documentation
                        </Link>{' '}
                        .
                    </Alert>
                )}
                {hasStaleReportProcessing() && (
                    <Alert
                        statusIconAriaLabel="Stale processing warning"
                        type="warning"
                    >
                        The Cost & Usage Report processor has not run{' '}
                        {dayjs(lastProcessedStatus.date).toNow()}. Please check
                        the S3 event trigger is enabled in the{' '}
                        <Link
                            external
                            href={`https://console.aws.amazon.com/go/view/${costStatus.crawler.curProcessorLambdaArn}`}
                        >
                            report processor lambda function
                        </Link>
                        .
                    </Alert>
                )}
                {hasReportProcessingError() && (
                    <Alert
                        statusIconAriaLabel="Report processing error"
                        type="error"
                    >
                        There was an error processing the Cost & Usage report:{' '}
                        <Box variant="code" color="text-status-error">
                            {lastProcessedStatus.errorMessage}
                        </Box>
                        . Please check the{' '}
                        <Link
                            external
                            href={`https://console.aws.amazon.com/go/view/${costStatus.crawler.logGroupArn}`}
                        >
                            AWS Glue crawler logs
                        </Link>{' '}
                        for more details.
                    </Alert>
                )}
            </SpaceBetween>
        </Container>
    );
};
