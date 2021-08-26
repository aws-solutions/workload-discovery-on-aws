/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { useGraphState } from '../../Contexts/GraphContext';
import { useResourceState } from '../../Contexts/ResourceContext';
import { getHierachicalLinkedNodes } from '../../Actions/GraphActions';
import Flashbar from '../../../Utils/Flashbar/Flashbar';
import { makeStyles } from '@material-ui/core/styles';
import { useCostsState } from '../../Contexts/CostsContext';
import { Select, Autosuggest } from '@awsui/components-react';
import { fetchImage } from '../../../Utils/ImageSelector';
import {
  handleResponse,
  getLinkedNodesHierarchy,
  wrapGetLinkedNodesHierachyRequest,
  sendGetRequests,
} from '../../../API/Handlers/ResourceGraphQLHandler';
import { handleSelectedResource } from '../../../API/Processors/NodeProcessors';
import { processHierarchicalNodeData } from '../../../API/APIProcessors';

const R = require('ramda');
const useStyles = makeStyles((theme) => ({
  div: { maxWidth: '100%', width: '100%' },
}));

const getResourceIcon = (type) => {
  return (
    <img
      alt={`${type} icon`}
      src={fetchImage(type)}
      style={{
        background: 'white',
        width: '20px',
        height: '20px',
      }}
    />
  );
};

export default ({ setLoading }) => {
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ costPreferences }, costDispatch] = useCostsState();
  const [{ resources }, resourceDispatch] = useResourceState();
  const [error, setError] = useState(false);
  const [selectedOption, setSelectedOption] = React.useState('');
  const classes = useStyles();
  const byType = R.groupBy((e) => e.label);

  const getNodes = () => {
    const groups = byType(R.pathOr([], ['nodes'], resources));
    return R.map((e) => {
      return {
        label: e,
        id: e,
        options: R.map((v) => {
          return {
            label: v.title,
            id: v.id,
            labelTag: v.label,
            tags: [v.accountId, v.region],
            value: R.toString(v),
          };
        }, groups[`${e}`]),
      };
    }, Object.keys(groups));
  };

  const nodeSelected = (nodeId) => {
    setLoading(true);

    sendGetRequests(
      R.map(
        (e) =>
          wrapGetLinkedNodesHierachyRequest(
            getLinkedNodesHierarchy,
            {
              id: e,
            },
            e,
            costPreferences,
            graphResources
          )
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
              console.error(err);
              setLoading(false);
              setError(err);
            }),
        [nodeId.id]
      )
    )
      .then((e) => Promise.all(e))
      .then(R.flatten)
      .then((nodes) => {
        dispatch({
          type: 'updateGraphResources',
          graphResources: nodes,
        });
        setLoading(false)
      })
  };

  return (
    <div id='searchBar' className={classes.div}>
      <Select
        virtualScroll
        placeholder='Find a resource'
        selectedOption={selectedOption}
        onChange={({ detail }) => nodeSelected(detail.selectedOption)}
        options={getNodes()}
        filteringType='auto'
        selectedAriaLabel='Selected'
      />

      {error && (
        <Flashbar
          type='error'
          message='We could not load the search configuration. It could be a temporary issue. Try reloading the page'
        />
      )}
    </div>
  );
};
