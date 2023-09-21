// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {QueryClient, QueryClientProvider} from "react-query";
import {render, screen} from "@testing-library/react";
import {createMemoryHistory} from 'history';
import {Router} from 'react-router-dom';
import {NotificationProvider} from "../../../../../../../components/Contexts/NotificationContext";
import {DiagramSettingsProvider} from "../../../../../../../components/Contexts/DiagramSettingsContext";
import {diagramSettingsReducer} from "../../../../../../../components/Contexts/Reducers/DiagramSettingsReducer";
import {ResourceProvider} from "../../../../../../../components/Contexts/ResourceContext";
import {resourceReducer} from "../../../../../../../components/Contexts/Reducers/ResourceReducer";
import React from "react";
import {describe, expect, vi, it} from "vitest";
import userEvent from "@testing-library/user-event";
import PolarisLayout from "../../../../../../../PolarisLayout";

function renderDiagramsPage() {
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

describe('Create Diagram Page', () => {

    it('should have public and private visibility option', async () => {
        HTMLCanvasElement.prototype.getContext = vi.fn();
        window.perspectiveMetadata = {version: '2.1.0'};

        vi.mock('@aws-amplify/ui-react', async () => {
            const mod = await vi.importActual('@aws-amplify/ui-react');
            return {
                ...mod,
                useAuthenticator: () => ({ user: {
                        username: 'testUser'
                    }, signOut: vi.fn() }),
            };
        });

        window.scrollTo = vi.fn();
        renderDiagramsPage();

        const manageLink = screen.getByRole('link', { name: /Manage$/, hidden: true });
        await userEvent.click(manageLink);

        await userEvent.click(await screen.findByRole('button', { name: /create/i }));

        await screen.findByRole('heading', {level: 2, name: /Create Diagram/i});

        await userEvent.click(await screen.findByRole('button', { name: /create/i }));

        screen.getByLabelText(/Visibility/i);

        const visibilityButton = screen.getByRole('button', { name: /visibility private/i });

        await userEvent.click(visibilityButton);

        const publicOption = screen.getByRole('option', { name: /public/i });

        await userEvent.click(publicOption);

        const createButton = screen.getByRole('button', { name: /create/i });

        expect(createButton).toBeDisabled();

        const nameComboBox = screen.getByRole('combobox', { name: /name/i });
        await userEvent.type(nameComboBox, 'TestDiagram');

        expect(createButton).toBeEnabled();
    });

});