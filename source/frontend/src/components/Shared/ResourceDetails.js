// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  SpaceBetween,
  StatusIndicator,
  ColumnLayout,
  Link,
  ExpandableSection,
} from '@cloudscape-design/components';
import ResourceDetailsTagTable from '../Explore/Resources/Utils/ResourceDetailsTagTable';
import { getStateInformation } from '../../Utils/Resources/ResourceStateParser';
import ReactJson from 'react-json-view';
import * as R  from 'ramda';
import dayjs  from 'dayjs';
import localizedFormat  from 'dayjs/plugin/localizedFormat';
import relativeTime  from 'dayjs/plugin/relativeTime';
import {clean, jsonParseKeys} from "../../Utils/ObjectUtils";
import ValueWithLabel from './ValueWithLabel';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const getStatusType = (status) => {
  if (R.equals('status-available', status)) return 'success';
  if (R.equals('status-warning', status)) return 'warning';
  if (R.equals('status-negative', status)) return 'error';
};

const getStatusColor = (status) => {
    if (R.equals('status-available', status)) return 'green';
    if (R.equals('status-warning', status)) return 'yellow';
    if (R.equals('status-negative', status)) return 'red';
};

const capitalize = (str) =>
  str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });


const parser = R.compose(
  jsonParseKeys(["configuration"]),
  jsonParseKeys(["configuration", "tags"]),
  clean
);

const ResourceDetails = ({ selectedResource }) => {
  const properties = useMemo(() => parser(selectedResource.properties ?? {}), [selectedResource]);

  const getTags = () => {
    return (
      <ResourceDetailsTagTable
        trackBy='name'
        rows={R.map((e) => {
          return {
            name: e.key,
            value: e.value,
          };
        }, properties.tags)}
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

  return (
    <Container>
      <SpaceBetween size='s'>
        <ColumnLayout columns={2} variant='text-grid'>
          <SpaceBetween size='s'>
            <ValueWithLabel label='Name'>
              {properties.resourceName ?? 'N/A'}
            </ValueWithLabel>
            <ValueWithLabel label='Account Id'>
              {properties.accountId ?? 'N/A'}
            </ValueWithLabel>
            <ValueWithLabel label='Region'>
              {properties.awsRegion ?? 'N/A'}
            </ValueWithLabel>
            <ValueWithLabel label='Availability Zone'>
              {properties.availabilityZone ?? 'N/A'}
            </ValueWithLabel>
          </SpaceBetween>
          <SpaceBetween size='s'>
            <ValueWithLabel label='Status'>
              {
                properties.configuration?.state != null ?
                    <StatusIndicator
                        type={getStatusType(getStateInformation(properties.configuration.state).status)}
                        iconAriaLabel={
                        `${getStatusColor(getStateInformation(properties.configuration.state).status)} status icon`
                    }
                    >
                        {capitalize(getStateInformation(properties.configuration.state).text)}
                    </StatusIndicator> : 'N/A'
              }
            </ValueWithLabel>
            <ValueWithLabel label='Type'>
              {properties.resourceType ?? 'N/A'}
            </ValueWithLabel>
            <ValueWithLabel label='ARN'>
              {
                <Link
                  external
                  externalIconAriaLabel='Opens in a new tab'
                  href={`https://console.aws.amazon.com/go/view/${properties.arn}`}>
                  {properties.arn}
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
                src={properties}
              />
            }
          </ExpandableSection>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
};

ResourceDetails.propTypes = {
  selectedResource: PropTypes.object.isRequired,
};

export default ResourceDetails;
