// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {render} from 'vitest-browser-react';
import {describe, expect} from 'vitest';
import {it} from '../../../../vitest/setupFiles/testContext';
import App from '../../../../../App';
import {getResourceGraph} from '../../../../mocks/fixtures/getResourceGraph/default.json';
import {getCostForResource} from '../../../../mocks/fixtures/getCostForResource/default.json';
import {getCostForService} from '../../../../mocks/fixtures/getCostForService/default.json';
import {graphql, HttpResponse} from 'msw';
import {sleep} from '../../../../vitest/testUtils';
import {userEvent} from '@vitest/browser/context';
import dayjs from 'dayjs';

async function verifyOverview(overview, data) {
    await expect
        .element(overview.getByText(/Estimated AWS cost/))
        .toBeInTheDocument();

    await expect
        .element(overview.getByText(`$${data.totalCost}`))
        .toBeInTheDocument();

    await expect
        .element(overview.getByText(/AWS Resources/))
        .toBeInTheDocument();
}

async function verifyDefaultDates(overview) {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const fromDateFormatted = dayjs(firstDay).format('llll');
    const toDateFormatted = dayjs(lastDay).format('llll');

    await expect.element(overview.getByText(fromDateFormatted)).toBeVisible();
    await expect.element(overview.getByText(toDateFormatted)).toBeVisible();
}

describe('Costs Page', () => {
    it('should display cost by resource data', async () => {
        window.perspectiveMetadata = {version: '2.3.0'};

        const screen = render(<App />);

        await screen
            .getByRole('link', {
                name: /Costs$/,
                hidden: true,
            })
            .click();

        await screen
            .getByRole('radio', {
                name: /query by arn or resource id/i,
            })
            .click();

        await screen
            .getByRole('button', {
                name: /Add Resource ID or ARN/i,
            })
            .click();

        const resourceInput = await screen.getByPlaceholder(
            'Enter an Resource Id or ARN'
        );

        await userEvent.type(
            resourceInput,
            getCostForResource.costItems[0].line_item_resource_id
        );

        await screen
            .getByRole('button', {
                name: /Calculate Costs/i,
            })
            .click();

        const Overview = await screen.getByTestId('costs-summary-overview');

        await verifyOverview(Overview, getCostForResource);

        await verifyDefaultDates(Overview);
    });

    it('should display cost by service data', async () => {
        window.perspectiveMetadata = {version: '2.3.0'};

        const screen = render(<App />);

        await screen
            .getByLabelText('Explore')
            .getByRole('link', {
                name: /Costs$/,
            })
            .click();

        await screen
            .getByRole('radio', {
                name: /query by service/i,
            })
            .click();

        await screen
            .getByRole('button', {
                name: /service name select a service/i,
            })
            .click();

        await screen
            .getByRole('option', {
                name: /cloudtrail/i,
            })
            .click();

        await screen
            .getByRole('button', {
                name: /Calculate Costs/i,
            })
            .click();

        const Overview = await screen.getByTestId('costs-summary-overview');

        await verifyOverview(Overview, getCostForService);

        await verifyDefaultDates(Overview);
    });

    it('should add resources to diagram page', async ({worker}) => {
        window.perspectiveMetadata = {version: '2.3.0'};

        worker.use(
            graphql.query('GetResourcesByCost', () => {
                const costItems = getResourceGraph.nodes.map(({properties}) => {
                    const {resourceId, resourceType, accountId, awsRegion} =
                        properties;
                    const [, , serviceName] = resourceType.split('::');
                    return {
                        line_item_resource_id: resourceId ?? '',
                        product_servicename: serviceName,
                        line_item_usage_start_date: null,
                        line_item_usage_account_id: accountId,
                        region: awsRegion,
                        pricing_term: 'OnDemand',
                        cost: 1.0,
                        line_item_currency_code: 'USD',
                    };
                });

                return HttpResponse.json({
                    data: {
                        getResourcesByCost: {
                            totalCost: costItems * 1.0,
                            costItems,
                        },
                    },
                });
            })
        );

        const screen = render(<App />);

        await screen
            .getByLabelText('Explore')
            .getByRole('link', {
                name: /Costs$/,
                hidden: true,
            })
            .click();

        await screen.getByRole('button', {name: /calculate costs/i}).click();

        await screen
            .getByRole('checkbox', {
                name: /testLambda is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /add to diagram/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        const comboBox = await screen.getByRole('combobox', {name: /name/i});

        await comboBox.fill('TestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        const canvas = await screen.getByTestId('wd-cytoscape-canvas');

        // wait for diagram animations on canvas to complete
        await sleep(2500);

        const screenshotPath = await canvas.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 7.5,
        });
    });
});
