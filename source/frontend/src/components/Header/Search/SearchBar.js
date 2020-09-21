import React, { useState } from 'react';
import { useGraphState } from '../../Contexts/GraphContext';
import { useResourceState } from '../../Contexts/ResourceContext';
import { getHierachicalLinkedNodes } from '../../Actions/GraphActions';
import CustomSnackbar from '../../../Utils/SnackBar/CustomSnackbar';
import SearchField from './SearchField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  div: { maxWidth: '100%', width: '100%' }
}));

export default () => {
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ resources }, resourceDispatch] = useResourceState();
  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  const getNodes = () => {
    return resources.length > 0
      ? resources[0].nodes.map(node => {
          return {
            id: node.id,
            label: node.title,
            group: node.label,
            search: JSON.stringify(node)
          };
        })
      : [];
  };

  const nodeSelected = item => {
    if (item) {
      const params = {
        focusing: false,
        nodeId: item.id
      };
      getHierachicalLinkedNodes(params, graphResources).then(response => {
        if (response.error) {
          setShowError(response.error);
        } else {
          dispatch({
            type: 'updateGraphResources',
            graphResources: response
          });
        }
      });
    }
  };

  return (
    <div id='searchBar' className={classes.div}>
      <SearchField
        onSelected={(event, input) => nodeSelected(input)}
        width='100%'
        margin='0'
        options={getNodes()}
        multiSelect={false}
        group={true}
      />
      {showError && (
        <CustomSnackbar
          vertical='bottom'
          horizontal='center'
          type='error'
          message='We could not load resource search configuration. Refresh page to try again'
        />
      )}
    </div>
  );
};
