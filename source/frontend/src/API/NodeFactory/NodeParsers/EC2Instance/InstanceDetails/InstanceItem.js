import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Container,
  ColumnLayout,
  SpaceBetween,
  ExpandableSection,
} from '@awsui/components-react';

var dayjs = require('dayjs')
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);


const parseConfiguration = (configuration) => {
  try{
    return JSON.parse(JSON.parse(configuration))
  } catch(Error)
  {
    return JSON.parse(configuration)
  }
}

export default ({ configuration }) => {
  const parsedConfig = parseConfiguration(configuration);

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
        <ValueWithLabel label='Launched'>
          {`${dayjs(parsedConfig.launchTime).format('llll')} (${dayjs(parsedConfig.launchTime).fromNow()})`}
        </ValueWithLabel>
        <ValueWithLabel label='Architecture'>
          {parsedConfig.architecture}
        </ValueWithLabel>
        <ValueWithLabel label='AMI'>{parsedConfig.imageId}</ValueWithLabel>
        <ValueWithLabel label='Instance type'>
          {parsedConfig.instanceType}
        </ValueWithLabel>
        <ValueWithLabel label='Private DNS'>
          {parsedConfig.privateDnsName}
        </ValueWithLabel>
        <ValueWithLabel label='Private IP'>
          {`${parsedConfig.privateIpAddress}`}
        </ValueWithLabel>
      </SpaceBetween>
      <SpaceBetween size='l'>
        <ValueWithLabel label='Public DNS'>
          {parsedConfig.publicDnsName}
        </ValueWithLabel>
        <ValueWithLabel label='Public IP'>
          {`${parsedConfig.publicIpAddress}`}
        </ValueWithLabel>
        <ValueWithLabel label='Monitoring'>
          {parsedConfig.monitoring.state}
        </ValueWithLabel>
        <ValueWithLabel label='Platform'>
          {parsedConfig.platform}
        </ValueWithLabel>
        <ValueWithLabel label='CPU cores'>
          {parsedConfig.cpuOptions.coreCount}
        </ValueWithLabel>
        <ValueWithLabel label='CPU threads per core'>
          {parsedConfig.cpuOptions.threadsPerCore}
        </ValueWithLabel>
      </SpaceBetween>
    </ColumnLayout>
  );
};
