// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Button,
  ButtonDropdown, Modal,
  SpaceBetween, StatusIndicator,
} from '@awsui/components-react';
import { useDiagramSettingsState } from '../../../Contexts/DiagramSettingsContext';
import { useResourceState } from '../../../Contexts/ResourceContext';
import {
  showCosts,
  clearGraph,
  fetchResources,
  fitToViewport,
  focusOnResources,
  groupResources,
  removeResource,
  saveDiagram, hideCosts,
} from '../Canvas/Commands/CanvasCommands';
import {Prompt, useHistory, useParams} from 'react-router-dom';
import { COST_REPORT, DRAW, EXPORT } from '../../../../routes';
import dayjs from "dayjs";
import {fetchCosts} from "../../../../API/Processors/NodeProcessors";
import {aggregateCostData} from "../../../../Utils/Resources/CostCalculator";
import PropTypes from "prop-types";
import * as R from "ramda";
import {diagramsPrefix, useRemoveObject} from "../../../Hooks/useS3Objects";
import {usePrevious} from "react-use";

const today = dayjs().format("YYYY-MM-DD")
const fiveDaysAgo = dayjs().subtract(5, "day").format('YYYY-MM-DD')

const DiagramControlPanel = ({
  settings
}) => {
  const [
    { canvas, selectedResources, resources },
    dispatchCanvas,
  ] = useDiagramSettingsState();
  const [{ graphResources }] = useResourceState();
  const { name, visibility } = useParams();
  const history = useHistory();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState();
  const [hasLoadedCosts, setHasLoadedCosts] = useState(false);
  const [loadingCosts, setLoadingCosts] = useState(false);
  const { endDate=today, startDate=fiveDaysAgo } = settings?.costInterval ?? {};
  const {removeAsync} = useRemoveObject(diagramsPrefix);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const previousResources = usePrevious(resources);

  const updateCanvas = useCallback((newCanvas) => {
    dispatchCanvas({
      type: 'setCanvas',
      canvas: newCanvas,
    });
  }, [dispatchCanvas]);

  const updateResources = useCallback(() => {
    dispatchCanvas({
      type: 'setResources',
      resources: canvas.nodes(),
    });
  }, [canvas, dispatchCanvas]);

  useEffect(() => {
    if (canvas && !canvas.destroyed()) {
      const resetEvents = ["add", "remove"];
      resetEvents.forEach(e => canvas.on(e, () => setHasLoadedCosts(false)));
    }
  }, [canvas, setHasLoadedCosts]);

  useEffect(() => {
    if (canvas && !canvas.destroyed()) {
      setHasLoadedCosts(false);
    }
  }, [canvas, settings?.costsInterval, setHasLoadedCosts]);

  useEffect(() => {
    if (!hasLoadedCosts && canvas && !canvas.destroyed()) {
      hideCosts(canvas, updateCanvas, canvas.nodes().jsons())
    }
  }, [canvas, hasLoadedCosts, updateCanvas])

  useEffect(() => {
    if (previousResources?.length && !R.equals(resources, previousResources)) {
      setHasUnsavedChanges(true);
    }
  }, [resources, previousResources]);

  const onActionClick = (id) => {
    switch (id) {
      case 'fetch':
        fetchResources(
          canvas,
          updateCanvas,
          updateResources,
          R.map(
            (e) => e.data('id'),
            R.chain(
              (r) => (r.isParent() ? r.descendants() : r),
              selectedResources
            )
          ),
          graphResources,
        );
        break;
      case 'fit':
        fitToViewport(canvas, updateCanvas);
        break;
      case 'clear':
        clearGraph(canvas, updateCanvas, updateResources);
        break;
      case 'focus':
        focusOnResources(
          canvas,
          updateCanvas,
          updateResources,
          R.map(
            (e) => e.data('id'),
            R.chain(
              (r) => (r.isParent() ? r.descendants() : r),
              selectedResources
            )
          ),
        );
        break;
      case 'group':
        groupResources(canvas, updateCanvas);
        break;
      case 'export':
        history.push(
          EXPORT.replace(':name', name).replace(':visibility', visibility)
        );
        break;
      case 'remove':
        removeResource(
          canvas,
          updateCanvas,
          updateResources,
          R.map((e) => e.data('id'), selectedResources)
        );
        break;
      case 'save':
        saveDiagram(canvas, settings)
          .then(() => setStatusMessage({
            type: "success",
            action: "save",
            message: `Last saved at ${dayjs(Date.now()).format("HH:mm")}`
          }))
          .then(() => setHasUnsavedChanges(false))
          .catch(() => setStatusMessage({
            type: "error",
            action: "save",
            timestamp: 'Unable to save diagram',
          }))
        ;
        break;
      case 'delete':
        setShowDeleteConfirm(true);
        break;
      default:
        break;
    }
  };

  const handleDelete = () => {
    setHasUnsavedChanges(false);
    canvas.destroy();
    removeAsync({key: name, level: visibility})
    setShowDeleteConfirm(false);
    history.push(DRAW);
  }

  const handleRequestCosts = () => {
    setLoadingCosts(true);
    if (statusMessage?.action === "costs") setStatusMessage(null);
    fetchCosts(
      canvas.nodes().jsons(),
      {period: {endDate, startDate}}
    )
      .then(aggregateCostData)
      .then(R.partial(showCosts, [canvas, updateCanvas]))
      .then(() => {
        setHasLoadedCosts(true);
      })
      .catch(err => {
        console.error(err);
        setStatusMessage({
          type: "error",
          action: "costs",
          message: "Unable to load costs"
        });
      })
      .finally(() => {
        setLoadingCosts(false)
      })
  }

  return (
    <Box float='right'>
      <Prompt
        when={hasUnsavedChanges}
        message={() =>
          `Are you sure you want to leave this page without saving?`
        }
      />
      <Modal
        onDismiss={() => setShowDeleteConfirm(false)}
        visible={showDeleteConfirm}
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="link">Cancel</Button>
              <Button onClick={handleDelete} variant="primary">Delete</Button>
            </SpaceBetween>
          </Box>
        }
        header="Delete Diagram"
      >
        Permanently delete <strong>{name}</strong>? This cannot be undone.
      </Modal>
      <SpaceBetween size='s' direction='horizontal'>
        {
          !R.isNil(statusMessage) && <Box margin={{vertical: "xxs"}} display={"block"}>
            <StatusIndicator type={statusMessage.type}>
              {statusMessage.message}
            </StatusIndicator>
          </Box>
        }
        <Button
          onClick={() => {
            history.push(
              COST_REPORT.replace(':name', name).replace(':visibility', visibility)
            );
          }}>
          View Cost Report
        </Button>
        <Button
          onClick={handleRequestCosts}
          loading={loadingCosts}
        >
          Load Costs
        </Button>
        <ButtonDropdown
          onItemClick={(e) => onActionClick(e.detail.id)}
          expandableGroups
          items={[
            {
              id: 'resources',
              text: 'Resources',
              items: [
                {
                  text: 'Expand',
                  id: 'fetch',
                },
                {
                  text: 'Focus',
                  id: 'focus',
                },
                {
                  text: 'Remove',
                  id: 'remove',
                },
              ],
              disabled: !selectedResources || selectedResources.empty(),
            },
            {
              id: 'diagram',
              text: 'Diagram',
              items: [
                { text: 'Group', id: 'group' },
                { text: 'Fit', id: 'fit' },
                { text: 'Clear', id: 'clear' },
                { text: 'Export', id: 'export' },
              ],
            },
            {
              id: 'save',
              text: 'Save',
            },
            {
              id: 'delete',
              text: 'Delete',
            },
          ]}
          variant='primary'>
          Actions
        </ButtonDropdown>
      </SpaceBetween>
    </Box>
  );
};

DiagramControlPanel.propTypes = {
  settings: PropTypes.shape({
    costsInterval: PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string
    }),
    hideSelected: PropTypes.bool,
    hideEdges: PropTypes.bool,
    accounts: PropTypes.array,
    regions: PropTypes.array,
    resourceTypes: PropTypes.array,
  })
}

export default DiagramControlPanel;
