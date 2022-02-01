import React, { useRef, useState, useEffect } from 'react';
import { MetadataProvider } from './components/Contexts/MetadataContext';
import { accountConfigReducer } from './components/Contexts/Reducers/AccountConfigReducer';
import Header from './components/Header/Header';
import Graph from './components/Graph/Graph';
import { GraphProvider } from './components/Contexts/GraphContext';
import { ResourceProvider } from './components/Contexts/ResourceContext';
import { graphReducer } from './components/Contexts/Reducers/GraphReducer';
import { resourceReducer } from './components/Contexts/Reducers/ResourceReducer';
import './css/App.css';
import { getObject, uploadObject } from './API/Storage/S3Store';
import {
  getAccounts,
  wrapRequest,
  handleResponse,
} from './API/Handlers/SettingsGraphQLHandler';
import { AccountsProvider } from './components/Contexts/AccountsContext';

import { CostsProvider } from './components/Contexts/CostsContext';
import { costsReducer } from './components/Contexts/Reducers/CostsReducer';
import Flashbar from './Utils/Flashbar/Flashbar';
import AccountImportDialog from './components/Drawer/Settings/AccountManagement/Account/AccountImportDialog';

const R = require('ramda');

const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const fromDate = dayjs()
  .startOf('month')
  .format('YYYY-MM-DD');

const toDate = dayjs()
  .format('YYYY-MM-DD');

export default (...props) => {
  const [showImportingSnackbar, setShowImportingSnackbar] = useState(false);
  const [showImportLandingPage, setShowImportLandingPage] = useState(false);
  const metadata = useRef(new Map());
  const accounts = useRef();
  const [showError, setShowError] = useState(false);
  const [warning, setWarning] = React.useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const resourceFilters = useRef();
  const accountFilters = useRef();
  const costPreferences = useRef();
  const [render, setRender] = useState(false);


  const checkRender = () => {
    setRender(
      accounts.current &&
        resourceFilters.current &&
        accountFilters.current &&
        costPreferences.current
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

  const buildDefaultAccountsFilter = () => {
    const filters = [];
    R.forEach((e) => {
      filters.push({
        accountId: e.accountId,
        id: `${e.accountId} :: global`,
        region: 'global',
      });
      R.map(
        (region) =>
          filters.push({
            accountId: e.accountId,
            id: `${e.accountId} :: ${region.name}`,
            region: region.name,
          }),
        e.regions
      );
    }, accounts.current);

    return filters;
  };

  useEffect(() => {
    wrapRequest(getAccounts)
      .then((response) => {
        if (response.error) setShowError(true);
        else {
          accounts.current = response.body.data.getAccounts;
          setShowImportLandingPage(accounts.current.length === 0);
          setShowImportingSnackbar(discoveryProcessingRunning());
          getObject('filters/accounts/filters', 'private')
            .then((response) => {
              setWarning(false);
              accountFilters.current =
                response instanceof Error
                  ? buildDefaultAccountsFilter()
                  : response;
              checkRender();
            })
            .catch((err) => {
              accountFilters.current = buildDefaultAccountsFilter();
              R.equals(err.status, 404) &&
                uploadObject(
                  'filters/accounts/filters',
                  JSON.stringify(accountFilters.current),
                  'private',
                  'application/json'
                );
              checkRender();
            });
          checkRender();
        }
      })
      .catch((err) => {
        setShowError(true);
      });

    getObject('costs/preferences', 'private')
      .then((response) => {
        setWarning(false);
        costPreferences.current =
          response instanceof Error
            ? {
                period: { fromDate: fromDate, toDate: toDate },
                processCosts: false,
              }
            : response;
        checkRender();
      })
      .catch((err) => {
        costPreferences.current = {
          period: { fromDate: fromDate, toDate: toDate },
          processCosts: false,
        };
        R.equals(err.status, 404) &&
          uploadObject(
            'costs/preferences',
            JSON.stringify(costPreferences.current),
            'private',
            'application/json'
          );

        checkRender();
      });

    getObject('filters/resources/filters', 'private')
      .then((response) => {
        setWarning(false);
        resourceFilters.current =
          response instanceof Error ? { typeFilters: [] } : response;
        checkRender();
      })
      .catch((err) => {
        resourceFilters.current = { typeFilters: [] };
        R.equals(err.status, 404) &&
          uploadObject(
            'filters/resources/filters',
            JSON.stringify(resourceFilters.current),
            'private',
            'application/json'
          );

        checkRender();
      });
  }, []);

  const initialResourceState = {
    resources: { nodes: [], metaData: {} },
    filters: accountFilters.current,
  };

  const initialCostsState = {
    costPreferences: costPreferences.current,
  };

  const initialGraphState = {
    graphResources: [],
    selectedNode: undefined,
    cy: undefined,
    graphFilters: resourceFilters.current,
  };

  return (
    <div>
      {render && !warning && (
        <AccountsProvider
          initialState={{ accounts: accounts.current }}
          reducer={accountConfigReducer}>
          <MetadataProvider value={{ metadata: metadata.current }}>
            <CostsProvider
              initialState={initialCostsState}
              reducer={costsReducer}>
              <GraphProvider
                initialState={initialGraphState}
                reducer={graphReducer}>
                <ResourceProvider
                  initialState={initialResourceState}
                  reducer={resourceReducer}>
                  <Header importComplete={importComplete} />
                  {!showError &&
                    showImportLandingPage &&
                    !showImportingSnackbar && (
                      <AccountImportDialog
                        startWithImportTab={true}
                        toggleImportModal={() =>
                          setShowImportLandingPage(!showImportLandingPage)
                        }
                      />
                    )}
                  {!showImportLandingPage && <Graph />}
                  {!showError &&
                    showImportLandingPage &&
                    !showImportingSnackbar && (
                      <AccountImportDialog
                        startWithImportTab={true}
                        toggleImportModal={() =>
                          setShowImportLandingPage(!showImportLandingPage)
                        }
                      />
                    )}
                </ResourceProvider>
              </GraphProvider>
            </CostsProvider>
          </MetadataProvider>
        </AccountsProvider>
      )}
      {showError && (
        <Flashbar
          type='error'
          message='AWS Perspective could not phone home. It could be a temporary issue. Try reloading the page'
        />
      )}
      {warning && (
        <Flashbar
          dismiss={() => setWarning(false)}
          type='warning'
          message='AWS Perspective could load your preferences. It could be a temporary issue. Dismiss this warning to continue using Perspective. Your preferences may not be available.'
        />
      )}
    </div>
  );
};
