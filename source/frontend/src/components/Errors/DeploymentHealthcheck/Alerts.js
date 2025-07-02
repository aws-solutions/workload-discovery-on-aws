// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {Alert, Box, Link} from '@cloudscape-design/components';
import * as R from 'ramda';

export function DiscoveryProcessOutOfMemoryAlert() {
    return (
        <Alert
            statusIconAriaLabel="Discovery process out of memeoy status error"
            type="error"
        >
            The ECS task that runs as part of the{' '}
            <Link
                external
                href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html"
            >
                discovery component
            </Link>{' '}
            has exited prematurely with an out of memory error. You can increase
            the memory for this task by following{' '}
            <Link
                external
                href={
                    'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/troubleshooting.html#discovery-ecs-task-out-of-memory'
                }
            >
                the resolution steps in the troubleshooting section of the
                implementation guide
            </Link>
            .
        </Alert>
    );
}

export function UnableToAccessElasticContainerRegistryAlert() {
    return (
        <Alert
            statusIconAriaLabel="ECR API connection status error"
            type="error"
        >
            The{' '}
            <Link
                external
                href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html"
            >
                discovery component
            </Link>{' '}
            encountered an issue connecting to the ECR API endpoint. Ensure that
            traffic in your VPC can route to this endpoint by following{' '}
            <Link
                external
                href={
                    'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/troubleshooting.html#unable-to-acces-eleastic-container-registry'
                }
            >
                the resolution steps in the troubleshooting section of the
                implementation guide
            </Link>
            .
        </Alert>
    );
}

export function CannotPullContainerFromRegistryAlert() {
    return (
        <Alert
            statusIconAriaLabel="ECR Docker API connection status error"
            type="error"
        >
            The{' '}
            <Link
                external
                href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html"
            >
                discovery component
            </Link>{' '}
            encountered an issue connecting to the ECR Docker endpoint. Ensure
            that traffic in your VPC can route to this endpoint by following{' '}
            <Link
                external
                href={
                    'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/troubleshooting.html#cannot-pull-container-from-registry'
                }
            >
                the resolution steps in the troubleshooting section of the
                implementation guide
            </Link>
            .
        </Alert>
    );
}

export function VpcConfigurationAwsServiceChecksAlert({services, natGateways}) {
    return (
        <Alert statusIconAriaLabel="VPC config check status error" type="error">
            The{' '}
            <Link
                external
                href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html"
            >
                discovery component
            </Link>{' '}
            encountered an issue when verifying VPC connectivity to AWS
            services. The following service API endpoints were not accessible:{' '}
            <Box variant="code" color="text-status-error">
                {services.join(', ')}
            </Box>
            . Ensure that the VPC fulfils{' '}
            <Link
                external
                href={
                    'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/prerequisites.html#verify-your-vpc-configuration'
                }
            >
                the pre-requisites described in the documentation
            </Link>
            .{' '}
            {R.isEmpty(natGateways) &&
                'This issue is most likely happening because there are no NAT Gateways configured in the VPC.'}
            {natGateways.length === 1 &&
                'Note, only one NAT Gateway has been provisioned in this VPC, ensure that traffic from both subnets can route to the gateway.'}
        </Alert>
    );
}

export function OrgAggregatorTypeCheckAlert() {
    return (
        <Alert
            statusIconAriaLabel="Invalid config aggregator type error"
            type="error"
        >
            The AWS Config aggregator supplied to the{' '}
            <Link
                external
                href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html"
            >
                discovery component
            </Link>{' '}
            is not an AWS organization wide aggregator. Ensure that the
            aggregator type fulfils{' '}
            <Link
                external
                href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/prerequisites.html#verify-aggregator-type"
            >
                the pre-requisites described in the documentation
            </Link>
            .{' '}
        </Alert>
    );
}

export function GenericErrorAlert({logGroupArn}) {
    return (
        <Alert statusIconAriaLabel="Generic status error" type="error">
            There was an unexpected error, please check the{' '}
            <Link
                external
                href={`https://console.aws.amazon.com/go/view/${logGroupArn}`}
            >
                logs
            </Link>{' '}
            for more information.
        </Alert>
    );
}
