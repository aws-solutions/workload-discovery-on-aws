import React, { useState, useEffect, useContext } from 'react';
import SearchBar from './Search/SearchBar';
import { getAllResources } from '../Actions/ResourceActions';
import { useResourceState } from '../Contexts/ResourceContext';
import CustomSnackbar from '../../Utils/SnackBar/CustomSnackbar';
import PersistentDrawer from '../Drawer/PersistentDrawer/PersistentDrawer';
import { filterOnAccountAndRegion } from '../Actions/ResourceActions';

export default () => {
  const [{ filters }, resourceDispatch] = useResourceState();
  const [showError, setShowError] = useState(false);

  // const fetchResources = async () => {
  //   const response = await getAllResources();
  //   response && setShowError(response.error);
  //   // console.dir(response);
  //   // console.dir(
  //   //   response.body[0].nodes
  //   //     .filter((resource) => resource.configuration)
  //   //     .map(
  //   //       (resource) =>
  //   //         resource.configuration && {id: resource.id, configuration: JSON.parse(resource.configuration)}
  //   //     )
  //   //     .filter(resource => resource.configuration.tags && resource.configuration.tags.length > 0)
  //   // );

  //   resourceDispatch({
  //     type: 'updateResources',
  //     resources: response && !response.error ? response.body : [],
  //   });
  // };

  const applyFilters = async () => {
    await filterOnAccountAndRegion(filters).then((response) => {
      if (response.error) {
        setShowError(true);
      } else {
        setShowError(false);
        resourceDispatch({
          type: 'updateResources',
          resources: response.body,
        });
      }
    });
  };

  useEffect(() => {
    applyFilters();
  }, []);

  return (
    <div id='header' className='header'>
      {/* <link
        rel='stylesheet'
        href='https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css'
        integrity='sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS'
        crossOrigin='anonymous'
      />
      {/* <NavBar /> */}
      <PersistentDrawer />
      {/* <SearchBar /> */}
      {showError && (
        <CustomSnackbar
          vertical='bottom'
          horizontal='center'
          type='error'
          message='We could not load resource configuration. Refresh page to try again'
        />
      )}
    </div>
  );
};
