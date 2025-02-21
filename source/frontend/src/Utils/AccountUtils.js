// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {AWS_ORGANIZATIONS} from '../config/constants.js';

export const isUsingOrganizations = () =>
    window.perspectiveMetadata.crossAccountDiscovery === AWS_ORGANIZATIONS;

export const getAppInsightsDashboardLink = () => {
    const {rootAccount: accountId, rootRegion: region} =
        window.perspectiveMetadata;
    const cloudWatchUrl =
        `https://${region}.console.aws.amazon.com/cloudwatch/home`;
    const resourceGroup = `AWS_AppRegistry_AppTag_${accountId}-workload-discovery-${region}-${accountId}`;

    return `${cloudWatchUrl}?region=${region}#settings:AppInsightsSettings/applicationDetails?resourceGroup=${resourceGroup}&accountId=${accountId}`;
};
