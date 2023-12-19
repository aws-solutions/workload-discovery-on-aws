// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import dayjs from 'dayjs';
import App from '../../../../../../App';
import defaultResourceGraph from '../../../../../mocks/fixtures/getResourceGraph/default.json';
import eksCluster from '../../../../../mocks/fixtures/getResourceGraph/eks-cluster.json';
import eksNodeGroup from '../../../../../mocks/fixtures/getResourceGraph/nodegroup.json';
import expectedJsonExport from './__file_snapshots__/CsvExportTestDiagram.json';
import {createSearchResourceHandler} from "../../../../../mocks/handlers";

describe('Diagrams Page', () => {

    it('creates diagram from search bar', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        cy.mount(<App />);

        cy.findByRole('link', { name: /Manage$/, hidden: true }).click();

        cy.findByRole('button', { name: /create/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('TestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.findByRole('heading', {level: 2, name: /TestDiagram/});

        cy.findByText(/diagram saved/i);

        cy.findByText(/the private diagram TestDiagram was saved successfully/i);

        cy.findByRole('button', { name: /view cost report/i });

        cy.findByRole('button', { name: /load costs/i });

        cy.findByRole('button', { name: /actions/i });

        cy.findByRole('button', { name: /Diagram Settings/i }).click();

        cy.findByLabelText(/accounts/i);

        cy.findByLabelText(/regions/i);

        cy.findByLabelText(/resource types/i);

        cy.findByRole('button', { name: /Apply/i }).should('be.disabled');

        cy.findByRole('button', { name: /Diagram Settings/i }).click();

        cy.findByRole('button', { name: /add resource find a resource/i }).click()

        cy.findByRole('combobox').type('lambda');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        cy.get('.expand-collapse-canvas').should('be.visible');

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });

    it('clears diagrams', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        cy.mount(<App />);

        cy.findByRole('link', { name: /Manage$/, hidden: true }).click();

        cy.findByRole('button', { name: /create/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('ClearTestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.findByRole('heading', {level: 2, name: /ClearTestDiagram/});

        cy.findByRole('button', { name: /add resource find a resource/i }).click()

        cy.findByRole('combobox').type('lambda');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        cy.findByRole('button', { name: /action/i }).click();

        cy.findByRole('menuitem', { name: /diagram/i }).click();

        cy.findByRole('menuitem', { name: /clear/i }).click({force: true});

        cy.get('.expand-collapse-canvas').scrollIntoView({ duration: 1000 }).matchImage({maxDiffThreshold: 0.1});

    });

    it('should get cost interval from diagram settings', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        const {worker, graphql} = window.msw;

        cy.mount(<App />).then(() => {
            let period = null;
            worker.use(
                graphql.query('GetCostForResource', async(req, res, ctx) => {
                    const costInfo = {
                        'AWS::Lambda::Function': {
                            product_servicename: 'Lambda',
                            cost: 5.00
                        },
                        'AWS::RDS::DBCluster': {
                            product_servicename: 'Amazon Neptune',
                            cost: 50.00
                        }
                    }

                    const costItems = defaultResourceGraph.getResourceGraph.nodes
                        .filter(x => ['AWS::RDS::DBCluster', 'AWS::Lambda::Function'].includes(x.properties.resourceType))
                        .map(({properties}) => {
                            const {resourceId, accountId, awsRegion, resourceType} = properties;
                            return  {
                                ...costInfo[resourceType],
                                "line_item_resource_id": resourceId,
                                "line_item_usage_start_date": null,
                                "line_item_usage_account_id": accountId,
                                "region": awsRegion,
                                "pricing_term":"OnDemand",
                                "line_item_currency_code":"USD"
                            }
                        });

                    period = req.variables.costForResourceQuery.period;

                    return res(ctx.data({
                        getCostForResource: {
                            totalCost: costItems.reduce((total, {cost}) => total + cost),
                            costItems
                        }}));
                }),
            );

            cy.findByRole('link', { name: /Manage$/, hidden: true }).click();

            cy.findByRole('button', { name: /create/i }).click();

            cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

            cy.findByRole('combobox', { name: /name/i }).type('LoadCostsIntervalDiagram');

            cy.findByRole('button', { name: /create/i }).click();

            cy.findByRole('heading', {level: 2, name: /LoadCostsIntervalDiagram/});

            cy.findByRole('button', { name: /add resource find a resource/i }).click()

            cy.findByRole('combobox').type('lambda');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{enter}');

            cy.findByRole('button', { name: /action/i }).click();

            cy.findByRole('button', { name: /Diagram Settings/i }).click();

            cy.findByLabelText(/Cost Data Time Period/i).click();

            cy.findByRole('radio', { name: /Last 30 Days/i }).click();

            cy.findByRole('button', { name: /Confirm/i }).click();

            cy.findByRole('button', { name: /Apply/i }).click();

            cy.findByRole('button', { name: /action/i }).click();

            cy.findByRole('menuitem', { name: /save/i }).click();

            cy.findByRole('button', { name: /Load Costs/i }).click();

            /* eslint-disable */
            cy.wait(500).then(() => {
                const today = dayjs().format("YYYY-MM-DD");
                const thirtyDaysAgo = dayjs().subtract(30, "day").format('YYYY-MM-DD');

                expect(period.to).to.equal(today);
                expect(period.from).to.equal(thirtyDaysAgo);
            });
            /* eslint-disable */
        });

    });

    it('should create a cost report', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query('GetCostForResource', (req, res, ctx) => {
                const costInfo = {
                    'AWS::Lambda::Function': {
                        product_servicename: 'Lambda',
                        cost: 5.00
                    },
                    'AWS::RDS::DBCluster': {
                        product_servicename: 'Amazon Neptune',
                        cost: 50.00
                    }
                }

                const costItems = defaultResourceGraph.getResourceGraph.nodes
                    .filter(x => ['AWS::RDS::DBCluster', 'AWS::Lambda::Function'].includes(x.properties.resourceType))
                    .map(({properties}) => {
                        const {resourceId, accountId, awsRegion, resourceType} = properties;
                        return  {
                            ...costInfo[resourceType],
                            "line_item_resource_id": resourceId,
                            "line_item_usage_start_date": null,
                            "line_item_usage_account_id": accountId,
                            "region": awsRegion,
                            "pricing_term":"OnDemand",
                            "line_item_currency_code":"USD"
                        }
                    });

                return res(ctx.data({
                    getCostForResource: {
                        totalCost: costItems.reduce((total, {cost}) => total + cost),
                        costItems
                    }}));
            }),
        )

        cy.mount(<App />);

        cy.findByRole('link', { name: /Manage$/, hidden: true }).click();

        cy.findByRole('button', { name: /create/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('CostReportDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.findByRole('heading', {level: 2, name: /CostReportDiagram/});

        cy.findByRole('button', { name: /add resource find a resource/i }).click()

        cy.findByRole('combobox').type('lambda');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        cy.findByRole('button', { name: /action/i }).click();

        cy.findByRole('menuitem', { name: /save/i }).click();

        cy.findByRole('button', { name: /view cost report/i }).click();

        cy.findByText(/\$55.00/);

        cy.findByRole('button', { name: /Export CSV/i }).click();

        cy.readFile('cypress/downloads/cost-report.csv')
            .then(actual => {
                return cy.readFile('src/tests/cypress/components/Diagrams/Draw/DrawDiagram/__file_snapshots__/cost-report.csv')
                    .should('deep.equal', actual);
            });

    });

    it('expands resources on diagram with double click', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query('SearchResources', createSearchResourceHandler([
                eksCluster.getResourceGraph.nodes[0]
            ])),
            graphql.query('GetResourceGraph', (req, res, ctx) => {
                const {ids, pagination: {start}} = req.variables;

                let resourceGraph = null;

                const eksClusterArn = eksCluster.getResourceGraph.nodes[0].id;
                const eksNodeGroupArn = eksNodeGroup.getResourceGraph.nodes[0].id;

                if(ids[0] === eksClusterArn) {
                    resourceGraph = eksCluster;
                } else if(ids[0] === eksNodeGroupArn) {
                    resourceGraph = eksNodeGroup;
                }

                const {getResourceGraph: {nodes, edges}} = resourceGraph;

                if (nodes.length < start && edges.length < start) {
                    return res(ctx.data({
                        getResourceGraph: {
                            nodes: [], edges: []
                        }
                    }));
                }
                return res(ctx.data(resourceGraph));
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', { name: /Resources$/, hidden: true }).click();

        cy.findByRole('heading', {level: 2, name: /\(1\)/i});

        cy.findByRole('checkbox', { name: /test-cluster is not selected/i }).click();

        cy.findByRole('button', { name: /add to diagram/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('ExpandTestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').then($canvas => {
            const canvasWidth = $canvas.width();
            const canvasHeight = $canvas.height();

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            cy.wrap($canvas)
                .scrollIntoView()
                // .click(canvasCenterX - 5, canvasCenterY - 10)
                .dblclick(canvasCenterX - 5, canvasCenterY - 10)
        });

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });

    it('expands resources on diagram with action menu', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query('SearchResources', createSearchResourceHandler([
                eksCluster.getResourceGraph.nodes[0]
            ])),
            graphql.query('GetResourceGraph', (req, res, ctx) => {
                const {ids, pagination: {start}} = req.variables;

                let resourceGraph = null;

                const eksClusterArn = eksCluster.getResourceGraph.nodes[0].id;
                const eksNodeGroupArn = eksNodeGroup.getResourceGraph.nodes[0].id;

                if(ids[0] === eksClusterArn) {
                    resourceGraph = eksCluster;
                } else if(ids[0] === eksNodeGroupArn) {
                    resourceGraph = eksNodeGroup;
                }

                const {getResourceGraph: {nodes, edges}} = resourceGraph;

                if (nodes.length < start && edges.length < start) {
                    return res(ctx.data({
                        getResourceGraph: {
                            nodes: [], edges: []
                        }
                    }));
                }
                return res(ctx.data(resourceGraph));
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', { name: /Resources$/, hidden: true }).click();

        cy.findByRole('heading', {level: 2, name: /\(1\)/i});

        cy.findByRole('checkbox', { name: /test-cluster is not selected/i }).click();

        cy.findByRole('button', { name: /add to diagram/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('ExpandMenuTestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').then($canvas => {
            const canvasWidth = $canvas.width();
            const canvasHeight = $canvas.height();

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            cy.wrap($canvas)
                .scrollIntoView()
                .click(canvasCenterX - 5, canvasCenterY - 10)
        });

        cy.findByRole('button', { name: /action/i }).click();

        cy.findByRole('menuitem', { name: /resources/i }).click();

        cy.findByRole('menuitem', { name: /expand/i }).click({force: true});

        cy.get('.expand-collapse-canvas').scrollIntoView({ duration: 3000 }).matchImage({maxDiffThreshold: 0.11});

    });

    it('focuses on selected resource', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query('SearchResources', createSearchResourceHandler([
                eksCluster.getResourceGraph.nodes[0]
            ])),
            graphql.query('GetResourceGraph', (req, res, ctx) => {
                const {ids, pagination: {start}} = req.variables;

                let resourceGraph = null;

                const eksClusterArn = eksCluster.getResourceGraph.nodes[0].id;
                const eksNodeGroupArn = eksNodeGroup.getResourceGraph.nodes[0].id;

                if(ids[0] === eksClusterArn) {
                    resourceGraph = eksCluster;
                } else if(ids[0] === eksNodeGroupArn) {
                    resourceGraph = eksNodeGroup;
                }

                const {getResourceGraph: {nodes, edges}} = resourceGraph;

                if (nodes.length < start && edges.length < start) {
                    return res(ctx.data({
                        getResourceGraph: {
                            nodes: [], edges: []
                        }
                    }));
                }
                return res(ctx.data(resourceGraph));
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', { name: /Resources$/, hidden: true }).click();

        cy.findByRole('heading', {level: 2, name: /\(1\)/i});

        cy.findByRole('checkbox', { name: /test-cluster is not selected/i }).click();

        cy.findByRole('button', { name: /add to diagram/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('FocusMenuTestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').then($canvas => {
            const canvasWidth = $canvas.width();
            const canvasHeight = $canvas.height();

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            cy.wrap($canvas)
                .scrollIntoView()
                .click(canvasCenterX - 5, canvasCenterY - 10)
        });

        cy.findByRole('button', { name: /action/i }).click();

        cy.findByRole('menuitem', { name: /resources/i }).click();

        cy.findByRole('menuitem', { name: /focus/i }).click({force: true});

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });

    it('exports diagram to csv and json', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query('SearchResources', createSearchResourceHandler([
                eksNodeGroup.getResourceGraph.nodes[0]
            ])),
            graphql.query('GetResourceGraph', (req, res, ctx) => {
                const {pagination: {start}} = req.variables;

                const {getResourceGraph: {nodes, edges}} = eksNodeGroup;

                if (nodes.length < start && edges.length < start) {
                    return res(ctx.data({
                        getResourceGraph: {
                            nodes: [], edges: []
                        }
                    }));
                }
                return res(ctx.data(eksNodeGroup));
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', { name: /Manage$/, hidden: true }).click();

        cy.findByRole('button', { name: /create/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('CsvExportTestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.findByRole('heading', {level: 2, name: /CsvExportTestDiagram/});

        cy.findByRole('button', { name: /add resource find a resource/i }).click()

        cy.findByRole('combobox').type('lambda');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.findByRole('button', { name: /action/i }).click();

        cy.findByRole('menuitem', { name: /save/i }).click();

        cy.findByRole('button', { name: /action/i }).click();

        cy.findByRole('menuitem', { name: /diagram/i }).click();

        cy.findByRole('menuitem', { name: /export/i }).click({force: true});

        cy.findByRole('radio', { name: /json/i }).click();

        cy.findByRole('button', { name: /export/i }).click();

        cy.findByRole('radio', { name: /csv/i }).click();

        cy.findByRole('button', { name: /export/i }).click();

        cy.readFile('cypress/downloads/CsvExportTestDiagram.json')
            .then(({nodes, edges}) => {
                // we can see see floating point issues with the the graphing library position values on the
                // canvas (e.g., a value that on most runs is 2 can come back as 1.9999999997) that makes this
                // test unreliable so we round the number to eliminate this variance
                const roundedNodes = nodes.map(({position, ...props}) => {
                    return {
                        position: {
                            x: parseFloat(position.x.toFixed(4)),
                            y: parseFloat(position.y.toFixed(4))
                        },
                        ...props
                    };
                });

                return {
                    nodes: roundedNodes,
                    edges
                }
            })
            .should('deep.equal', expectedJsonExport);

        cy.readFile('cypress/downloads/CsvExportTestDiagram.csv')
            .then(actual => {
                return cy.readFile('src/tests/cypress/components/Diagrams/Draw/DrawDiagram/__file_snapshots__/CsvExportTestDiagram.csv')
                    .should('deep.equal', actual);
            });
    });

    it('deletes selected resource', () => {
        window.perspectiveMetadata = {version: '2.1.0'};

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query('SearchResources', createSearchResourceHandler([
                eksCluster.getResourceGraph.nodes[0]
            ])),
            graphql.query('GetResourceGraph', (req, res, ctx) => {
                const {ids, pagination: {start}} = req.variables;

                let resourceGraph = null;

                const eksClusterArn = eksCluster.getResourceGraph.nodes[0].id;
                const eksNodeGroupArn = eksNodeGroup.getResourceGraph.nodes[0].id;

                if(ids[0] === eksClusterArn) {
                    resourceGraph = eksCluster;
                } else if(ids[0] === eksNodeGroupArn) {
                    resourceGraph = eksNodeGroup;
                }

                const {getResourceGraph: {nodes, edges}} = resourceGraph;

                if (nodes.length < start && edges.length < start) {
                    return res(ctx.data({
                        getResourceGraph: {
                            nodes: [], edges: []
                        }
                    }));
                }
                return res(ctx.data(resourceGraph));
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', { name: /Resources$/, hidden: true }).click();

        cy.findByRole('heading', {level: 2, name: /\(1\)/i});

        cy.findByRole('checkbox', { name: /test-cluster is not selected/i }).click();

        cy.findByRole('button', { name: /add to diagram/i }).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', { name: /name/i }).type('RemoveMenuTestDiagram');

        cy.findByRole('button', { name: /create/i }).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').then($canvas => {
            const canvasWidth = $canvas.width();
            const canvasHeight = $canvas.height();

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            cy.wrap($canvas)
                .scrollIntoView()
                .click(canvasCenterX - 5, canvasCenterY - 10)
        });

        cy.findByRole('button', { name: /action/i }).click();

        cy.findByRole('menuitem', { name: /resources/i }).click();

        cy.findByRole('menuitem', { name: /remove/i }).click({force: true});

        /* eslint-disable */
        cy.wait(2000);
        /* eslint-disable */

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });
});