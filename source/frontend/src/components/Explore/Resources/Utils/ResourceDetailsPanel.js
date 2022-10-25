import React from 'react';
import {
  Box,
  ColumnLayout,
  ExpandableSection,
  Link,
  SpaceBetween,
  StatusIndicator,
} from '@awsui/components-react';

import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import { getStateInformation } from '../../../../Utils/Resources/ResourceStateParser';
import ResourceDetailsTagTable from './ResourceDetailsTagTable';
import * as R  from 'ramda';
import dayjs  from 'dayjs';
import localizedFormat  from 'dayjs/plugin/localizedFormat';
import relativeTime  from 'dayjs/plugin/relativeTime';
import {clean, jsonParseKeys} from "../../../../Utils/ObjectUtils";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box margin={{ bottom: 'xxxs' }} color='text-label'>
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

const parser = R.compose(
  jsonParseKeys(["configuration"]),
  jsonParseKeys(["configuration", "tags"]),
  clean
);

const ResourceDetailsPanel = ({ resource }) => {
  const getTags = () => {
    const tags = JSON.parse(R.pathOr('[]', ['properties', 'tags'], resource));
    return (
      <ResourceDetailsTagTable
        trackBy='name'
        rows={R.map((e) => {
          return {
            name: e.key,
            value: e.value,
          };
        }, tags)}
        visibleColumns={['name', 'value']}
        columns={[
          {
            id: 'id',
            cell: (e) => `${e.name}-${e.value}`,
          },
          {
            id: 'name',
            header: 'Name',
            cell: (e) => e.name,
            sortingField: 'name',
            width: 300,
            minWidth: 300,
          },
          {
            id: 'value',
            header: 'Value',
            cell: (e) => e.value,
            width: 300,
            minWidth: 300,
          },
        ]}
        sortColumn={'id'}
        pageSize={10}
      />
    );
  };

  const getStatusType = (status) => {
    if (R.equals('status-available', status)) return 'success';
    if (R.equals('status-warning', status)) return 'warning';
    if (R.equals('status-negative', status)) return 'error';
  };

  const capitalize = (str) =>
    str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

  return (
    <SpaceBetween size='s'>
      <ColumnLayout columns={2} variant='text-grid'>
        <SpaceBetween size='s'>
          <ValueWithLabel label='Name'>
            {R.pathOr(
              R.pathOr('N/A', ['properties', 'title'], resource),
              ['properties', 'resourceName'],
              resource
            )}
          </ValueWithLabel>
          <ValueWithLabel label='Account Id'>
            {R.pathOr('N/A', ['properties', 'accountId'], resource)}
          </ValueWithLabel>
          <ValueWithLabel label='Region'>
            {R.pathOr('N/A', ['properties', 'awsRegion'], resource)}
          </ValueWithLabel>
          <ValueWithLabel label='Availability Zone'>
            {R.pathOr('N/A', ['properties', 'availabilityZone'], resource)}
          </ValueWithLabel>
        </SpaceBetween>
        <SpaceBetween size='s'>
          <ValueWithLabel label='Status'>
            {
              <StatusIndicator
                type={getStatusType(
                  getStateInformation(
                    R.pathOr('N/A', ['properties', 'state'], resource)
                  )
                )}>
                {capitalize(
                  getStateInformation(
                    R.pathOr('N/A', ['properties', 'state'], resource)
                  ).text
                )}
              </StatusIndicator>
            }
          </ValueWithLabel>
          <ValueWithLabel label='Type'>
            {R.pathOr('N/A', ['properties', 'resourceType'], resource)}
          </ValueWithLabel>
          <ValueWithLabel label='ARN'>
            {
              <Link
                external
                externalIconAriaLabel='Opens in a new tab'
                href={`https://console.aws.amazon.com/go/view/${R.pathOr(
                  'N/A',
                  ['properties', 'arn'],
                  resource
                )}`}>
                {R.pathOr('N/A', ['properties', 'arn'], resource)}
              </Link>
            }
          </ValueWithLabel>
        </SpaceBetween>
      </ColumnLayout>
      <SpaceBetween size='xxs'>
        <ExpandableSection header='Tags'>{getTags()}</ExpandableSection>
        <ExpandableSection header='Raw data'>
          {
            <ReactJson
              enableClipboard={false}
              iconStyle='circle'
              collapseStringsAfterLength={200}
              displayDataTypes={false}
              src={parser(resource.properties)}
            />
          }
        </ExpandableSection>
      </SpaceBetween>
    </SpaceBetween>
  );
};

ResourceDetailsPanel.propTypes = {
  resource: PropTypes.object.isRequired,
};

export default ResourceDetailsPanel;
