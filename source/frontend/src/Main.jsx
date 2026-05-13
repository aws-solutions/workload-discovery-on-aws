// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {ResourceProvider} from './components/Contexts/ResourceContext';
import {resourceReducer} from './components/Contexts/Reducers/ResourceReducer';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import PolarisLayout from './PolarisLayout';
import {createBrowserRouter, RouterProvider} from 'react-router';
import {NotificationProvider} from './components/Contexts/NotificationContext';
import {DiagramSettingsProvider} from './components/Contexts/DiagramSettingsContext';
import {diagramSettingsReducer} from './components/Contexts/Reducers/DiagramSettingsReducer';
import {WebGLProvider} from './components/Contexts/WebGLContext';
import Homepage from './components/Homepage/Homepage';
import DiscoverableAccountsPage from './components/RegionManagement/DiscoverableRegions/DiscoverableAccountsPage';
import ImportContent from './components/RegionManagement/SinglePageImport/ImportContent';
import ViewExplorerPage from './components/Explore/Views/ViewExplorerPage';
import ViewFormPage from './components/Explore/Views/ViewForm/ViewFormPage';
import ResourcesPage from './components/Explore/Resources/ResourcesPage';
import CostsPage from './components/Costs/QueryBuilder/CostsPage';
import DiagramExplorer from './components/Diagrams/Management/DiagramExplorer';
import OpenDiagramPage from './components/Diagrams/Draw/DrawDiagram/OpenDiagram/OpenDiagramPage';
import CreateDiagramPage from './components/Diagrams/Draw/DrawDiagram/CreateDiagram/CreateDiagramPage';
import CostOverview from './components/Costs/Report/CostOverview';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';
dayjs.extend(localizedFormat);
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchInterval: 60000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export const routeChildren = [
    {index: true, element: <Homepage />},
    {path: 'accounts', element: <DiscoverableAccountsPage />},
    {path: 'import', element: <ImportContent />},
    {path: 'views', element: <ViewExplorerPage />},
    {path: 'views/create', element: <ViewFormPage />},
    {path: 'views/:name', element: <ViewExplorerPage />},
    {path: 'views/:name/edit', element: <ViewFormPage />},
    {path: 'diagrams', element: <DiagramExplorer />},
    {path: 'diagrams/create', element: <CreateDiagramPage />},
    {path: 'diagrams/:visibility/:name', element: <OpenDiagramPage />},
    {path: 'diagrams/:visibility/:name/cost_report', element: <CostOverview />},
    {path: 'resources', element: <ResourcesPage />},
    {path: 'costs', element: <CostsPage />},
];

const Main = () => {
    const [router] = React.useState(() =>
        createBrowserRouter([
            {
                path: '/',
                element: <PolarisLayout />,
                children: routeChildren,
            },
        ])
    );
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
                    reducer={diagramSettingsReducer}
                >
                    <ResourceProvider
                        initialState={initialResourceState}
                        reducer={resourceReducer}
                    >
                        <WebGLProvider>
                            <RouterProvider router={router} />
                        </WebGLProvider>
                    </ResourceProvider>
                </DiagramSettingsProvider>
            </NotificationProvider>
        </QueryClientProvider>
    );
};

export default Main;
