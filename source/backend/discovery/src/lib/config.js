// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {AWS_ORGANIZATIONS} = require("./constants");
const config = {
    rootAccountId: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
    cluster: process.env.CLUSTER,
    crossAccountDiscovery: process.env.CROSS_ACCOUNT_DISCOVERY,
    isUsingOrganizations: process.env.CROSS_ACCOUNT_DISCOVERY === AWS_ORGANIZATIONS,
    organizationUnitId: process.env.ORGANIZATION_UNIT_ID,
    configAggregator: process.env.CONFIG_AGGREGATOR,
    graphgQlUrl: process.env.GRAPHQL_API_URL,
    rootAccountRole: process.env.DISCOVERY_ROLE,
    customUserAgent: process.env.CUSTOM_USER_AGENT
};

module.exports = config;
