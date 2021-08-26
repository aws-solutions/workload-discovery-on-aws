import React, { useState, useEffect } from 'react';
import { useResourceState } from '../Contexts/ResourceContext';
import Flashbar from '../../Utils/Flashbar/Flashbar';
import PersistentDrawer from '../Drawer/PersistentDrawer/PersistentDrawer';
import { filterOnAccountAndRegion } from '../Actions/ResourceActions';
import { useGraphState } from '../Contexts/GraphContext';
const R = require('ramda');
import PropTypes from 'prop-types';

const Header = ({ importComplete }) => {
  const [{ filters }, resourceDispatch] = useResourceState();
  const [{ graphFilters }, updateFilters] = useGraphState();
  const [showError, setShowError] = useState(false);


  const isMatch = (node) =>
    !R.includes(node.resourceType, graphFilters.typeFilters);

  const removeFilteredNodes = (resources) =>
    Promise.resolve(R.pathOr([], ['body'], resources)).then((e) => {
      resourceDispatch({
        type: 'updateResources',
        resources: {
          nodes: R.filter((e) => isMatch(e), e.nodes),
          metaData: e.metaData,
        },
      });
    });

  const applyFilters = async () => {
    await filterOnAccountAndRegion(filters).then((response) => {
      if (response.error) {
        setShowError(true);
      } else {
        setShowError(false);
        removeFilteredNodes(response);
      }
    });
  };

  useEffect(() => {
    applyFilters();
  }, [graphFilters, filters]);

  return (
    <>
      {showError && (
        <Flashbar
          type='error'
          message='We could not load resource configuration. It could be a temporary issue. Try reloading the page'
        />
      )}
      {!showError && (
        <div id='header' className='header'>
          <PersistentDrawer importComplete={importComplete} />
        </div>
      )}
    </>
  );
};

Header.propTypes = {
  importComplete: PropTypes.bool.isRequired,
};

export default Header;
