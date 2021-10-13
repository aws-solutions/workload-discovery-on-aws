import React from 'react';
import {
  Box,
  ColumnLayout,
  Container,
  SpaceBetween,
  StatusIndicator,
  ExpandableSection,
} from '@awsui/components-react';
import ResourceDetailsTagTable from './ResourceDetailsTagTable';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';
import { parseNode } from '../../../API/NodeFactory/NodeParserHandler';

const R = require('ramda');

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box margin={{ bottom: 'xxxs' }} color='text-label'>
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

const getStatusType = (status) => {
  if (R.equals('status-available', status)) return 'success';
  if (R.equals('status-warning', status)) return 'warning';
  if (R.equals('status-negative', status)) return 'error';
};

const capitalize = (str) =>
  str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

const columns = [
  {
    id: 'name',
    header: 'Name',
    cell: (e) => e.name,
    sortingField: 'name',
    width: 300,
    minWidth: 300,
  },
  {
    id: 'tag',
    header: 'Value',
    cell: (e) => e.tag,
    width: 300,
    minWidth: 300,
  },
];

const ResourceDetailsPanel = ({ selectedNode }) => {

  const properties = R.hasPath(['properties'], selectedNode)
  ? selectedNode.properties
  : selectedNode.data('properties');

  // const properties = selectedNode.data
  //   ? selectedNode.data('properties')
  //   : selectedNode.properties;

  const getTags = () => {
    if (
      properties.tags
    ) {
      const tags = JSON.parse(properties.tags);
      return (
        <ResourceDetailsTagTable
          trackBy='name'
          rows={R.reduce(
            (acc, val) => {
              acc.push({ name: val, tag: tags[`${val}`] });
              return acc;
            },
            [],
            R.keys(tags)
          )}
          columns={columns}
          sortColumn={'name'}
          pageSize={10}
        />
      );
    } else {
      return '...';
    }
  };

  return (
    <Container>
      <SpaceBetween size='l'>
        <ColumnLayout columns={2} variant='text-grid'>
          <SpaceBetween size='l'>
            <ValueWithLabel label='Account Id'>
              {selectedNode.data('resource') &&
              selectedNode.data('resource').accountId
                ? selectedNode.data('resource').accountId
                : '...'}
            </ValueWithLabel>
            <ValueWithLabel label='Region'>
              {selectedNode.data('properties') &&
              selectedNode.data('properties').awsRegion
                ? selectedNode.data('properties').awsRegion
                : '...'}
            </ValueWithLabel>
            <ValueWithLabel label='Availability Zone'>
              {selectedNode.data('properties') &&
              selectedNode.data('properties').availabilityZone
                ? selectedNode.data('properties').availabilityZone
                : '...'}
            </ValueWithLabel>
          </SpaceBetween>
          <SpaceBetween size='l'>
            <ValueWithLabel label='Status'>
              {R.has('text', selectedNode.data('state')) ? (
                <StatusIndicator
                  type={getStatusType(selectedNode.data('state').status)}>
                  {capitalize(selectedNode.data('state').text)}
                </StatusIndicator>
              ) : (
                '...'
              )}
            </ValueWithLabel>
            <ValueWithLabel label='ARN'>
              {selectedNode.data('properties') &&
              selectedNode.data('properties').arn
                ? selectedNode.data('properties').arn
                : '...'}
            </ValueWithLabel>
            <ValueWithLabel label='Estimated cost'>
              {selectedNode.data('cost')
                ? `$${selectedNode.data('cost')}`
                : '...'}
            </ValueWithLabel>
          </SpaceBetween>
        </ColumnLayout>
        {parseNode(properties, selectedNode).detailsComponent}
        <ExpandableSection header='Tags'>{getTags()}</ExpandableSection>
        <ExpandableSection header='Raw data'>
          {
            <ReactJson
              enableClipboard={false}
              iconStyle='circle'
              collapseStringsAfterLength={200}
              displayDataTypes={false}
              src={selectedNode.data('properties')}
            />
          }
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  );
};

ResourceDetailsPanel.propTypes = {
  selectedNode: PropTypes.object.isRequired,
};

export default ResourceDetailsPanel;
