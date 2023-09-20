// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {QueryClient, QueryClientProvider} from "react-query";
import {createMemoryHistory} from "history";
import {render} from "@testing-library/react";
import {NotificationProvider} from "../../components/Contexts/NotificationContext";
import {DiagramSettingsProvider} from "../../components/Contexts/DiagramSettingsContext";
import {diagramSettingsReducer} from "../../components/Contexts/Reducers/DiagramSettingsReducer";
import {ResourceProvider} from "../../components/Contexts/ResourceContext";
import {resourceReducer} from "../../components/Contexts/Reducers/ResourceReducer";
import {Router} from "react-router-dom";
import PolarisLayout from "../../PolarisLayout";
import React from "react";

export function renderPolarisLayout()  {
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
                    reducer={diagramSettingsReducer}>
                    <ResourceProvider
                        initialState={initialResourceState}
                        reducer={resourceReducer}>
                        {/*<RoutedDiagramPage history={history}/>*/}
                        <Router history={history}>
                            <PolarisLayout />
                        </Router>
                    </ResourceProvider>
                </DiagramSettingsProvider>
            </NotificationProvider>
        </QueryClientProvider>
    );

    return {container, history};
}

export function getCellText(row, column, table) {
    return table.findBodyCell(row, column).getElement()?.innerHTML;
}