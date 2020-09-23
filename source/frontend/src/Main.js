import React, { useRef, useState, useEffect } from 'react';

import { MetadataProvider } from './components/Contexts/MetadataContext';

import { accountConfigReducer } from './components/Contexts/Reducers/AccountConfigReducer';
import Header from './components/Header/Header';
import Graph from './components/Graph/Graph';
import CustomSnackbar from './Utils/SnackBar/CustomSnackbar';

import { GraphProvider } from './components/Contexts/GraphContext';
import { ResourceProvider } from './components/Contexts/ResourceContext';
import { graphReducer } from './components/Contexts/Reducers/GraphReducer';
import {
  fetchMetadata,
  fetchImportConfiguration,
} from './components/Actions/ImportActions';
import { resourceReducer } from './components/Contexts/Reducers/ResourceReducer';
import './css/App.css';
import LandingPageDrawer from './components/LandingPage/LandingPageDrawer';
import ImportProgress from './components/Header/ImportProgress';
import { getObject } from './API/Storage/S3Store';
import { getAccounts, wrapRequest, handleResponse } from './API/GraphQLHandler';
import { AccountsProvider } from './components/Contexts/AccountsContext';
import { requestWrapper } from './API/APIHandler';

let importInterval;

export default (...props) => {
  const [showImportingSnackbar, setShowImportingSnackbar] = useState(false);
  const [showImportLandingPage, setShowImportLandingPage] = useState(false);
  const metadata = useRef(new Map());
  const importConfiguration = useRef();
  const accounts = useRef();
  const [showError, setShowError] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const resourceFilters = useRef();
  const accountFilters = useRef();
  const [render, setRender] = useState(false);

  const importStatus = useRef({
    importRun: false,
    importConfigured: false,
  });

  const checkRender = () => {
    setRender(
      accounts.current && resourceFilters.current && accountFilters.current
    );
  };

  function discoveryProcessingRunning() {
    return (
      accounts.current.filter(
        (account) =>
          account.regions.filter((region) => region.lastCrawled == null)
            .length > 0
      ).length > 0
    );
  }

  useEffect(() => {
    wrapRequest(getAccounts).then((response) => {
      accounts.current = handleResponse(response).body.data.getAccounts;
      setShowImportLandingPage(accounts.current.length === 0);
      setShowImportingSnackbar(discoveryProcessingRunning());
      checkRender();
      importInterval = setInterval(monitorProgress, 30000);
    });

    getObject('filters/accounts/filters', 'private').then((response) => {
      accountFilters.current = response instanceof Error ? [] : response;
      checkRender();
    });

    getObject('filters/resources/filters', 'private').then((response) => {
      resourceFilters.current =
        response instanceof Error ? { typeFilters: [] } : response;
      checkRender();
    });
  }, []);

  const monitorProgress = async () => {
    wrapRequest(getAccounts).then((response) => {
      accounts.current = handleResponse(response).body.data.getAccounts;

      const discoveryComplete = !discoveryProcessingRunning();
      setShowImportingSnackbar(!discoveryComplete);
      setImportComplete(discoveryComplete);
    });
  };

  if (importComplete) {
    clearInterval(importInterval);
  }

  const initialResourceState = {
    resources: [],
    filters: accountFilters.current,
  };

  const initialGraphState = {
    graphResources: [],
    selectedNode: undefined,
    cy: undefined,
    graphFilters: resourceFilters.current,
  };

  return (
    <div>
      {render && (
        <AccountsProvider
          initialState={{ accounts: accounts.current }}
          reducer={accountConfigReducer}>
          <MetadataProvider value={{ metadata: metadata.current }}>
            <GraphProvider
              initialState={initialGraphState}
              reducer={graphReducer}>
              <ResourceProvider
                initialState={initialResourceState}
                reducer={resourceReducer}>
                <Header />
                {!showError &&
                  showImportLandingPage &&
                  !showImportingSnackbar && (
                    <LandingPageDrawer
                      importStatus={importStatus.current}
                      toggleImportModal={() =>
                        setShowImportLandingPage(!showImportLandingPage)
                      }
                    />
                  )}
              </ResourceProvider>
              {!showImportLandingPage && <Graph />}
              {!showError &&
                showImportLandingPage &&
                !showImportingSnackbar && (
                  <LandingPageDrawer
                    importStatus={importStatus.current}
                    toggleImportModal={() =>
                      setShowImportLandingPage(!showImportLandingPage)
                    }
                  />
                )}
              {!showError &&
                showImportingSnackbar &&
                !showImportLandingPage &&
                !importComplete && (
                  <CustomSnackbar
                    type='info'
                    message={`Discovery process is scanning resources in ${
                      accounts.current.filter((account) =>
                        account.regions.filter(
                          (region) => region.lastCrawled == null
                        )
                      ).length
                    } region(s)`}
                    progress={<ImportProgress />}
                  />
                )}
            </GraphProvider>
          </MetadataProvider>
        </AccountsProvider>
      )}
      {showError && (
        <CustomSnackbar
          vertical='bottom'
          horizontal='center'
          type='error'
          message='We could not retrieve your import configuration. Please refresh the page and try again'
        />
      )}
    </div>
  );
};
