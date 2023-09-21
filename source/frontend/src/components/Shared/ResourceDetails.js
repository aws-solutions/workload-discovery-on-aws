// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
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
  const getTags = () => {
    const tags = JSON.parse(
      R.pathOr('[]', ['properties', 'tags'], selectedResource)
    );
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

  return (
    <Container>
      <SpaceBetween size='s'>
        <ColumnLayout columns={2} variant='text-grid'>
          <SpaceBetween size='s'>
            <ValueWithLabel label='Name'>
              {R.pathOr(
                'N/A',
                ['properties', 'resourceName'],
                selectedResource
              )}
            </ValueWithLabel>
            <ValueWithLabel label='Account Id'>
              {R.pathOr('N/A', ['properties', 'accountId'], selectedResource)}
            </ValueWithLabel>
            <ValueWithLabel label='Region'>
              {R.pathOr('N/A', ['properties', 'awsRegion'], selectedResource)}
            </ValueWithLabel>
            <ValueWithLabel label='Availability Zone'>
              {R.pathOr(
                'N/A',
                ['properties', 'availabilityZone'],
                selectedResource
              )}
            </ValueWithLabel>
          </SpaceBetween>
          <SpaceBetween size='s'>
            <ValueWithLabel label='Status'>
              {
                <StatusIndicator
                  type={getStatusType(
                    getStateInformation(
                      R.pathOr({text: 'N/A'}, ['properties', 'state'], selectedResource)
                    ).text
                  )}>
                  {capitalize(
                    getStateInformation(
                      R.pathOr({text: 'N/A'}, ['properties', 'state'], selectedResource)
                    ).text
                  )}
                </StatusIndicator>
              }
            </ValueWithLabel>
            <ValueWithLabel label='Type'>
              {R.pathOr(
                'N/A',
                ['properties', 'resourceType'],
                selectedResource
              )}
            </ValueWithLabel>
            <ValueWithLabel label='ARN'>
              {
                <Link
                  external
                  externalIconAriaLabel='Opens in a new tab'
                  href={`https://console.aws.amazon.com/go/view/${R.pathOr(
                    'N/A',
                    ['properties', 'arn'],
                    selectedResource
                  )}`}>
                  {R.pathOr('N/A', ['properties', 'arn'], selectedResource)}
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
                src={parser(selectedResource.properties ?? {})}
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
