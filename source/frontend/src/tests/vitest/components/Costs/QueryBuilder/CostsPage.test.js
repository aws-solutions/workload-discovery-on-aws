// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {QueryClient, QueryClientProvider} from "react-query";
import {describe, it, expect} from "vitest";
import {render, screen, findByText, getByText} from '@testing-library/react'
import CostsPage from '../../../../../components/Costs/QueryBuilder/CostsPage';
import dayjs from 'dayjs';
import {TableWrapper} from '@cloudscape-design/components/test-utils/dom';
import {diagramSettingsReducer} from "../../../../../components/Contexts/Reducers/DiagramSettingsReducer";
import {ResourceProvider} from "../../../../../components/Contexts/ResourceContext";
import {resourceReducer} from "../../../../../components/Contexts/Reducers/ResourceReducer";
import {DiagramSettingsProvider} from "../../../../../components/Contexts/DiagramSettingsContext";
import { NotificationProvider } from '../../../../../components/Contexts/NotificationContext';
import userEvent from "@testing-library/user-event";
import getResourcesByCost from "../../../../mocks/fixtures/getResourcesByCost/default.json";
import getCostForResource from "../../../../mocks/fixtures/getCostForResource/default.json";
import getCostForService from "../../../../mocks/fixtures/getCostForService/default.json";

const costData = getResourcesByCost["getResourcesByCost"]
const resourceData = getCostForResource["getCostForResource"]
const serviceData = getCostForService["getCostForService"]

function renderCostsPage() {
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

    return render(
        <QueryClientProvider client={queryClient}>
            <NotificationProvider>
                <DiagramSettingsProvider
                    initialState={initialDiagramSettingsState}
                    reducer={diagramSettingsReducer}>
                    <ResourceProvider
                        initialState={initialResourceState}
                        reducer={resourceReducer}>
                        <CostsPage/>
                    </ResourceProvider>
                </DiagramSettingsProvider>
            </NotificationProvider>
        </QueryClientProvider>
    );
}

function verifyTableRow(table, rowNumber, index) {
    let costInfo = costData["costItems"][index]
    expect(table.findBodyCell(rowNumber,2).getElement().innerHTML).toBe(costInfo["line_item_resource_id"] == "" ? costInfo["product_servicename"] : costInfo["line_item_resource_id"])
    expect(table.findBodyCell(rowNumber,3).getElement().innerHTML).toBe(`$${costInfo["cost"]}`)
    expect(table.findBodyCell(rowNumber,4).getElement().innerHTML).toBe(costInfo["line_item_usage_account_id"])
    expect(table.findBodyCell(rowNumber,5).getElement().innerHTML).toBe(costInfo["region"])
}

async function verifyOverview(overview, data) {
    const estimatedCostOverview = await findByText(overview, /Estimated AWS cost/);

    const estimatedCost = getByText(estimatedCostOverview.parentElement, /^\$?[0-9]+(\.[0-9][0-9])?$/);

    expect(estimatedCost).toHaveTextContent(`$${data.totalCost}`);

    const awsResourcesOverview = await findByText(overview, /AWS Resources/);

    const awsResourcesCount = getByText(awsResourcesOverview.parentElement, /\d+/);

    expect(awsResourcesCount).toHaveTextContent(data["queryDetails"]["resultCount"]);
}

async function verifyDefaultDates(overview) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const fromDateOverview = await findByText(overview, /From/);

    const fromDate = getByText(fromDateOverview.parentElement, /\b((Mon|Tue|Wed|Thu|Fri|Sat|Sun))\b(.*)/);

    expect(fromDate).toHaveTextContent(dayjs(firstDay).format('llll'))

    const toDateOverview = await findByText(overview, /To/);

    const toDate = getByText(toDateOverview.parentElement, /\b((Mon|Tue|Wed|Thu|Fri|Sat|Sun))\b(.*)/);

    expect(toDate).toHaveTextContent(dayjs(lastDay).format('llll'))
}

describe('Costs Page', () => {

    describe('Costs Overview', () => {

        it('should display cost data', async () => {
            renderCostsPage();

            const calculateCostsButton = await screen.findByRole('button', { name: /Calculate Costs/i });

            await userEvent.click(calculateCostsButton);

            const Overview = await screen.findByTestId('costs-summary-overview');

            await verifyOverview(Overview, costData);

            await verifyDefaultDates(Overview);
        });

        it('should display cost by resource data', async () => {
            renderCostsPage();

            const serviceRadioButton = screen.getByRole('radio', { name: /query by arn or resource id/i });

            await userEvent.click(serviceRadioButton);

            const accountFilterButton = await screen.findByRole('button', { name: /Add Resource ID or ARN/i });

            await userEvent.click(accountFilterButton);

            const resourceInput = await screen.getByPlaceholderText("Enter an Resource Id or ARN");

            await userEvent.type(resourceInput, resourceData["costItems"][0]["line_item_resource_id"])

            const calculateCostsButton = await screen.findByRole('button', { name: /Calculate Costs/i });

            await userEvent.click(calculateCostsButton);

            const Overview = await screen.findByTestId('costs-summary-overview');

            await verifyOverview(Overview, resourceData);

            await verifyDefaultDates(Overview);
        }, {timeout: 7000});

        it('should display cost by service data', async () => {
            renderCostsPage();

            const serviceRadioButton = await screen.getByRole('radio', { name: /query by service/i });

            await userEvent.click(serviceRadioButton);

            const serviceSelectorButton = await screen.getByRole('button', { name: /service name select a service/i });

            await userEvent.click(serviceSelectorButton);

            const serviceOption = screen.getByRole('option', { name: /cloudtrail/i })

            await userEvent.click(serviceOption);

            const calculateCostsButton = await screen.findByRole('button', { name: /Calculate Costs/i });

            await userEvent.click(calculateCostsButton);

            const Overview = await screen.findByTestId('costs-summary-overview');

            await verifyOverview(Overview, serviceData);

            await verifyDefaultDates(Overview);

        });
    });

    describe('Costs Table', () => {

        it('should display cost table data', async () => {
            renderCostsPage();

            const calculateCostsButton = await screen.findByRole('button', { name: /Calculate Costs/i });

            await userEvent.click(calculateCostsButton);

            await screen.findByRole('heading', {level: 2, name: /Resources/});

            const resourcesTable = screen.getByRole('table', {name: /resources/i});

            const table = new TableWrapper(resourcesTable.parentElement)

            const tableRows = table.findRows();

            expect(tableRows).toHaveLength(10);

            // We pass index + 1 as the rowNumber because findBodyCell starts at index 1.
            tableRows.forEach(function (_, index) {
                verifyTableRow(table, index + 1, index)
            });

        });
    });
});