// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {AWS_ORGANIZATIONS} from './constants.mjs';

export const cluster = process.env.CLUSTER;
export const configAggregator = process.env.CONFIG_AGGREGATOR;
export const crossAccountDiscovery = process.env.CROSS_ACCOUNT_DISCOVERY;
export const customUserAgent = process.env.CUSTOM_USER_AGENT;
export const graphgQlUrl = process.env.GRAPHQL_API_URL;
export const isUsingOrganizations =
    process.env.CROSS_ACCOUNT_DISCOVERY === AWS_ORGANIZATIONS;
export const organizationUnitId = process.env.ORGANIZATION_UNIT_ID;
export const region = process.env.AWS_REGION;
export const rootAccountId = process.env.AWS_ACCOUNT_ID;
export const rootAccountRole = process.env.DISCOVERY_ROLE;
export const vpcId = process.env.VPC_ID;
