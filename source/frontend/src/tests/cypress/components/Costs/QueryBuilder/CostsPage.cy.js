// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import App from '../../../../../App';
import {getResourceGraph} from '../../../../mocks/fixtures/getResourceGraph/default.json';

describe('Costs Page', () => {

    it('should add resources to diagram page', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        const {worker, graphql} = window.msw

        worker.use(
            graphql.query('GetResourcesByCost', (req, res, ctx) => {
                const costItems = getResourceGraph.nodes.map(({properties}) => {
                    const {resourceId, resourceType, accountId, awsRegion} = properties;
                    const [, , serviceName] = resourceType.split('::');
                    return {
                        line_item_resource_id: resourceId ?? '',
                        product_servicename: serviceName,
                        line_item_usage_start_date: null,
                        line_item_usage_account_id: accountId,
                        region: awsRegion,
                        pricing_term: 'OnDemand',
                        cost: 1.00,
                        line_item_currency_code: 'USD'
                    }
                });

                return res(ctx.data({
                    getResourcesByCost: {
                        totalCost: costItems * 1.00,
                        costItems
                    }
                }));
            }));

        cy.mount(<App/>);

        cy.findByRole('link', {name: /Costs$/, hidden: true}).click();

        cy.findByRole('button', {name: /calculate costs/i}).click();

        cy.findByRole('checkbox', {name: /testLambda is not selected/i}).click();

        cy.findByRole('button', { name: /add to diagram/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('TestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});

    })
});