// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {ColumnLayout, SpaceBetween, Link} from '@cloudscape-design/components';
import ValueWithLabel from '../../../../../components/Shared/ValueWithLabel';

const parseConfiguration = configuration => {
    try {
        return JSON.parse(JSON.parse(configuration));
    } catch (Error) {
        return JSON.parse(configuration);
    }
};

export const CloudFrontDistributionItem = ({configuration}) => {
    const parsedConfig = parseConfiguration(configuration);

    return (
        <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="l">
                <ValueWithLabel label="Domain name">
                    <Link
                        external
                        externalIconAriaLabel="Opens in a new tab"
                        href={`https://${parsedConfig.domainName}`}
                    >
                        {`https://${parsedConfig.domainName}`}
                    </Link>
                </ValueWithLabel>
                <ValueWithLabel label="Certificate source">
                    {
                        parsedConfig.distributionConfig.viewerCertificate
                            .certificateSource
                    }
                </ValueWithLabel>
                <ValueWithLabel label="Default root object">
                    {parsedConfig.distributionConfig.defaultRootObject}
                </ValueWithLabel>
                <ValueWithLabel label="WAF WebACL attached">
                    {parsedConfig.distributionConfig.webACLId
                        ? 'true'
                        : 'false'}
                </ValueWithLabel>
            </SpaceBetween>
            <SpaceBetween size="l">
                <ValueWithLabel label="Smooth streaming">
                    {
                        parsedConfig.distributionConfig.defaultCacheBehavior
                            .smoothStreaming
                    }
                </ValueWithLabel>
                <ValueWithLabel label="Viewer protocol policy">
                    {
                        parsedConfig.distributionConfig.defaultCacheBehavior
                            .viewerProtocolPolicy
                    }
                </ValueWithLabel>
                <ValueWithLabel label="Access logging enabled">
                    {parsedConfig.distributionConfig.logging.enabled}
                </ValueWithLabel>
                <ValueWithLabel label="Price class">
                    {parsedConfig.distributionConfig.priceClass}
                </ValueWithLabel>
                <ValueWithLabel label="IPv6 enabled">
                    {parsedConfig.distributionConfig.isIPV6Enabled}
                </ValueWithLabel>
            </SpaceBetween>
        </ColumnLayout>
    );
};

export default CloudFrontDistributionItem;
