import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  TextContent,
  ExpandableSection,
  ColumnLayout,
  SpaceBetween,
  StatusIndicator,
  Link,
} from '@awsui/components-react';

const R = require('ramda');

export default ({ configuration }) => {
  let parsedConfig;
  try {
    parsedConfig = JSON.parse(JSON.parse(configuration));
  } catch (e) {
    parsedConfig = JSON.parse(configuration);
  }

  const ValueWithLabel = ({ label, children }) => (
    <div>
      <Box margin={{ bottom: 'xxxs' }} color='text-label'>
        {label}
      </Box>
      <div>{children}</div>
    </div>
  );

  return (
    <ColumnLayout columns={2} variant='text-grid'>
      <SpaceBetween size='l'>
        <ValueWithLabel label='Domain name'>
          <Link
            external
            externalIconAriaLabel='Opens in a new tab'
            href={`https://${parsedConfig.domainName}`}>
            {`https://${parsedConfig.domainName}`}
          </Link>
        </ValueWithLabel>
        <ValueWithLabel label='Certificate source'>
          {parsedConfig.distributionConfig.viewerCertificate.certificateSource}
        </ValueWithLabel>
        <ValueWithLabel label='Default root object'>
          {parsedConfig.distributionConfig.defaultRootObject}
        </ValueWithLabel>
        <ValueWithLabel label='WAF WebACL attached'>
          {parsedConfig.distributionConfig.webACLId ? 'true' : 'false'}
        </ValueWithLabel>
      </SpaceBetween>
      <SpaceBetween size='l'>
        <ValueWithLabel label='Smooth streaming'>
          {parsedConfig.distributionConfig.defaultCacheBehavior.smoothStreaming}
        </ValueWithLabel>
        <ValueWithLabel label='Viewer protocol policy'>
          {
            parsedConfig.distributionConfig.defaultCacheBehavior
              .viewerProtocolPolicy
          }
        </ValueWithLabel>
        <ValueWithLabel label='Access logging enabled'>
          {parsedConfig.distributionConfig.logging.enabled}
        </ValueWithLabel>
        <ValueWithLabel label='Price class'>
          {parsedConfig.distributionConfig.priceClass}
        </ValueWithLabel>
        <ValueWithLabel label='IPv6 enabled'>
          {parsedConfig.distributionConfig.isIPV6Enabled}
        </ValueWithLabel>
      </SpaceBetween>
    </ColumnLayout>
  );
};
