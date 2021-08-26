import React from 'react';
import {
  downloadCloudFormationTemplateForAccount,
  downloadCloudFormationTemplateForRegion,
} from '../../../../../../Utils/CloudFormation/TemplateGenerator';
import { HelpPanel, Button, SpaceBetween, Box } from '@awsui/components-react';

const fileDownload = require('js-file-download');

const AccountImportDownload = () => {
  return (
    <SpaceBetween direction='vertical' size='l'>
      <HelpPanel>
        <dl>
          <dt>Why do we need to do this?</dt>
          <dd>
            AWS Perspective needs to set up a small amount of infrastructure
            within each AWS Region made discoverable to it. This includes an AWS
            Config Aggregator and an IAM Role.
          </dd>
          <br />
          <dt>Why is there 2 AWS CloudFormation templates?</dt>
          <dd>
            An IAM Role is required when importing a Region from an account that
            does not already contain a Region already discoverable to Perspective. The
            IAM Role is global, so we do not need to create this for subsequent
            AWS Regions within the same account.
          </dd>
          <br />
          <dt>What template do I need to download?</dt>
          <dd>
            Download the <strong>Global resources</strong> template when making
            a new account discoverable to Perspective.
            <br />
            Download the <strong>Regional resources</strong> template when
            making additional Regions in an existing account discoverable to
            Perspective.
          </dd>
        </dl>
      </HelpPanel>
      <Box float='right'>
        <SpaceBetween direction='horizontal' size='l'>
        <Button
            iconName='download'
            onClick={async () =>
              fileDownload(
                await downloadCloudFormationTemplateForAccount(),
                `${
                  'global-resources-' +
                  new Date().getTime() + '.template'
                }`
              )
            }>
            Global resources
          </Button>
          <Button
            iconName='download'
            onClick={async () =>
              fileDownload(
                await downloadCloudFormationTemplateForRegion(),
                `${
                  'aws-perspective-region-import-' +
                  new Date().getTime() + '.template'
                }`
              )
            }>
            Regional resources
          </Button>
        </SpaceBetween>
      </Box>
    </SpaceBetween>
  );
};

export default AccountImportDownload;
