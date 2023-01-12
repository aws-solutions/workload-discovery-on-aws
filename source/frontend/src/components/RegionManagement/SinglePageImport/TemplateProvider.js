// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Button,
  SpaceBetween,
  Box,
} from '@awsui/components-react';
import {GLOBAL_TEMPLATE, REGIONAL_TEMPLATE, useTemplate} from "../../Hooks/useTemplate";

import fileDownload from 'js-file-download';

const TemplateProvider = () => {
  const {data: globalTemplate, isLoading: isLoadingGlobal} = useTemplate(GLOBAL_TEMPLATE);
  const {data: regionalTemplate, isLoading: isLoadingRegional} = useTemplate(REGIONAL_TEMPLATE);
  return (
    <Box>
      <SpaceBetween direction='vertical' size='s'>
        <Box variant={"p"}>
          Using the AWS CloudFormation templates below:
          <ul>
            <li>Deploy the <strong>Global Resources</strong> template once in each target account.</li>
            <li>Deploy the <strong>Regional Resources</strong> template to each AWS region in a target account that you want to be discoverable.</li>
          </ul>
          For a target account to be discovered you must deploy the <strong>Global Resources</strong> template exactly once,
          and the <strong>Regional Resources</strong> template at least once.
        </Box>
        <Box>
          <SpaceBetween size={"s"} direction={"horizontal"}>
            <Button
              iconName='download'
              disabled={isLoadingGlobal}
              onClick={async () =>
                fileDownload(
                  globalTemplate,
                  'global-resources.template'
                )
              }>
              Global Resources
            </Button>
            <Button
            iconName='download'
            disabled={isLoadingRegional}
            onClick={async () =>
              fileDownload(
                regionalTemplate,
                'regional-resources.template'
              )
            }>
            Regional Resources</Button>
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </Box>
  );
};

export default TemplateProvider;
