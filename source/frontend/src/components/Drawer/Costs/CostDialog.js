import React from 'react';
import {
  Modal,
  Box,
  SpaceBetween,
  Button,
  Header,
  Link,
} from '@awsui/components-react';
import CostQuery from './QueryBuilder/CostQuery';
import PropTypes from 'prop-types';
import { useGraphState } from '../../Contexts/GraphContext';
import { useCostsState } from '../../Contexts/CostsContext';
import {
  getLinkedNodesHierarchy,
  handleResponse,
  sendGetRequests,
  wrapGetLinkedNodesHierachyRequest,
} from '../../../API/Handlers/ResourceGraphQLHandler';
import { processHierarchicalNodeData } from '../../../API/APIProcessors';
import { handleSelectedResource } from '../../../API/Processors/NodeProcessors';
import Flashbar from '../../../Utils/Flashbar/Flashbar';

const R = require('ramda');

const CostDialog = ({ toggleModal }) => {
  const [selectedResources, setSelectedResources] = React.useState([]);
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ costPreferences }] = useCostsState();
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleNodeSelect = () => {
    setLoading(true);
    sendGetRequests(
      R.map(
        (e) =>
          wrapGetLinkedNodesHierachyRequest(getLinkedNodesHierarchy, {
            arn: e,
          })
            .then((node) =>
              handleSelectedResource(
                processHierarchicalNodeData(
                  R.pathOr(
                    [],
                    ['body', 'data', 'getLinkedNodesHierarchy'],
                    node
                  ),
                  e,
                  costPreferences
                ),
                e,
                graphResources
              )
            )
            .catch((err) => {
              setLoading(false);

              console.error(err);
              setError(err);
            }),
        R.map((e) => e.line_item_resource_id, selectedResources)
      )
    )
      .then((e) => Promise.all(e))
      .then(R.flatten)
      .then((nodes) => {
        dispatch({
          type: 'updateGraphResources',
          graphResources: nodes,
        });
        setLoading(false);
        toggleModal();
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
      });
  };

  return (
    <Modal
      onDismiss={toggleModal}
      visible={true}
      closeAriaLabel='Close modal'
      size='max'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={toggleModal} variant='link'>
              Close
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={
        <Header
          variant='h2'
          description='The costs are estimated and based on the unblended totals from Cost & Usage Reports (CURs)'>
          Query Cost & Usage Reports
        </Header>
      }>
      {error && (
        <Flashbar
          type='error'
          message='We could not complete that action. Please try again.'
        />
      )}
      <CostQuery
        selectedResources={selectedResources}
        setSelectedResources={setSelectedResources}
        handleNodeSelect={handleNodeSelect}
      />
    </Modal>
  );
};

CostDialog.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};

export default CostDialog;
