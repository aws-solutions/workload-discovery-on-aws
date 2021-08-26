import React, { useState } from 'react';
import { useGraphState } from '../../Contexts/GraphContext';
import { getHierachicalLinkedNodes } from '../../Actions/GraphActions';
import CustomSnackbar from '../../../Utils/SnackBar/CustomSnackbar';
import { useCostsState } from '../../Contexts/CostsContext';

export default ({ node }) => {
  const [{ graphResources }, dispatch] = useGraphState();
  const [{ costPreferences }, costDispatch] = useCostsState();
  const [showError, setShowError] = useState(false);

  const handleClick = () => {
    const params = {
      focusing: false,
      nodeId: node.nodeId,
    };
    getHierachicalLinkedNodes(params, graphResources, costPreferences).then(
      (response) => {
        if (response.error) {
          setShowError(response.error);
        } else {
          dispatch({
            type: 'updateGraphResources',
            graphResources: response,
          });
        }
      }
    );
  };
  return (
    <div className='resourceLinkDiv'>
      <button
        onClick={(event) => {
          handleClick();
          event.preventDefault();
        }}
        className='resourceLink'>
        {node.label}
      </button>
      {showError && (
        <CustomSnackbar
          vertical='bottom'
          horizontal='center'
          type='error'
          message='We could not load resource link configuration. Refresh page to try again'
        />
      )}
    </div>
  );
};
