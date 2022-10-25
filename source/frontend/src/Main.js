import React from 'react';
import { ResourceProvider } from './components/Contexts/ResourceContext';
import { resourceReducer } from './components/Contexts/Reducers/ResourceReducer';
import {
  QueryClient,
  QueryClientProvider,
} from "react-query"
import PolarisLayout from './PolarisLayout';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import { NotificationProvider } from "./components/Contexts/NotificationContext"
import { DiagramSettingsProvider } from './components/Contexts/DiagramSettingsContext';
import { diagramSettingsReducer } from './components/Contexts/Reducers/DiagramSettingsReducer';
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
dayjs.extend(localizedFormat);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const Main = () => {
  const initialResourceState = {
    graphResources: [],
    resources: [],
  };

  const initialDiagramSettingsState = {
    canvas: null,
    selectedResources: null,
    resources: [],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <DiagramSettingsProvider
          initialState={initialDiagramSettingsState}
          reducer={diagramSettingsReducer}>
          <ResourceProvider
            initialState={initialResourceState}
            reducer={resourceReducer}>
            <Router>
              <PolarisLayout />
            </Router>
          </ResourceProvider>
        </DiagramSettingsProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default Main;
