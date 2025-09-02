// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {QueryClient, QueryClientProvider} from 'react-query';
import {createMemoryHistory} from 'history';
import {render} from '@testing-library/react';
import {NotificationProvider} from '../../components/Contexts/NotificationContext';
import {DiagramSettingsProvider} from '../../components/Contexts/DiagramSettingsContext';
import {diagramSettingsReducer} from '../../components/Contexts/Reducers/DiagramSettingsReducer';
import {ResourceProvider} from '../../components/Contexts/ResourceContext';
import {resourceReducer} from '../../components/Contexts/Reducers/ResourceReducer';
import {WebGLProvider} from '../../components/Contexts/WebGLContext';
import {Router} from 'react-router-dom';
import PolarisLayout from '../../PolarisLayout';
import React from 'react';

export function renderPolarisLayout() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchInterval: 60000,
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    });

    const initialResourceState = {
        graphResources: [],
        resources: [],
    };

    const initialDiagramSettingsState = {
        canvas: null,
        selectedResources: null,
        resources: [],
    };

    const history = createMemoryHistory();
    const container = render(
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
                            {/*<RoutedDiagramPage history={history}/>*/}
                            <Router history={history}>
                                <PolarisLayout />
                            </Router>
                        </WebGLProvider>
                    </ResourceProvider>
                </DiagramSettingsProvider>
            </NotificationProvider>
        </QueryClientProvider>
    );

    return {container, history};
}

function createPerspectiveMetadata(crossAccountDiscovery) {
    return () => {
        return {version: '2.2.0', crossAccountDiscovery};
    };
}

export const createOrganizationsPerspectiveMetadata =
    createPerspectiveMetadata('AWS_ORGANIZATIONS');

export const createSelfManagedPerspectiveMetadata =
    createPerspectiveMetadata('SELF_MANAGED');

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getCellContent = (table, row, column) => {
    const cell = table.findBodyCell(row, column).getElement();

    // Check if cell contains an SVG/image
    const svgPath =
        cell?.querySelector('img')?.getAttribute('src') ||
        cell?.querySelector('svg path')?.getAttribute('d');

    return svgPath ?? cell?.textContent;
};

export const withResolvers = () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {promise, resolve, reject};
};
