import React from 'react';
import { parseNode } from '../../../API/NodeFactory/NodeParserHandler';
import PropTypes from 'prop-types';
import {
  Container,
  SpaceBetween,
  StatusIndicator,
  Box,
  ColumnLayout,
} from '@awsui/components-react';

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
  str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

const HoverDetails = ({ selectedNode }) => {
  const properties = selectedNode.data
    ? selectedNode.data('properties')
    : selectedNode.properties;

  return (
    <Container>
      <SpaceBetween size='l'>
        <ColumnLayout columns={2} variant='text-grid'>
          <SpaceBetween size='l'>
            <ValueWithLabel label='Name'>
              {selectedNode.data('title').length > 64
                ? `${selectedNode.data('title').substring(0, 64)}...`
                : selectedNode.data('title')}
            </ValueWithLabel>
            <ValueWithLabel label='Type'>
              {selectedNode.data('resource') &&
              selectedNode.data('resource').type
                ? selectedNode.data('resource').type
                : '...'}
            </ValueWithLabel>
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
          {parseNode(properties, selectedNode).hoverComponent}
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
};

HoverDetails.propTypes = {
  selectedNode: PropTypes.object.isRequired,
};

export default HoverDetails;
