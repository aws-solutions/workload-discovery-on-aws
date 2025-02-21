// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import dayjs from 'dayjs';
import App from '../../../../../../App';
import defaultResourceGraph from '../../../../../mocks/fixtures/getResourceGraph/default.json';
import eksCluster from '../../../../../mocks/fixtures/getResourceGraph/eks-cluster.json';
import eksNodeGroup from '../../../../../mocks/fixtures/getResourceGraph/nodegroup.json';
import sqsLambda from '../../../../../mocks/fixtures/getResourceGraph/sqs-lambda.json';
import {createSearchResourceHandler} from '../../../../../mocks/handlers';
import {createSelfManagedPerspectiveMetadata} from '../../../../../vitest/testUtils';
import {HttpResponse} from 'msw';

describe('Diagrams Page', () => {
    it('shows preview of diagram before creation', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />);

        cy.findByRole('link', {name: /Resources$/, hidden: true}).click();

        cy.findByPlaceholderText(/Find a resource type/i).type('lambda');

        cy.findByRole('checkbox', {
            name: /aws::lambda::function is not selected/i,
        }).click();

        cy.findByRole('checkbox', {
            name: /arn:aws:yyyyyyyyyyyy:eu-west-1:AWS::Lambda::Function:0Title is not selected/i,
        }).click();

        cy.findByRole('button', {name: /Add to diagram/i}).click();

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });

    it('creates diagram from search bar', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />);

        cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type('TestDiagram');

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /TestDiagram/});

        cy.findByText(/diagram saved/i);

        cy.findByText(
            /the private diagram TestDiagram was saved successfully/i
        );

        cy.findByRole('button', {name: /view cost report/i});

        cy.findByRole('button', {name: /load costs/i});

        cy.findByRole('button', {name: /actions/i});

        cy.findByRole('button', {name: /Diagram Settings/i}).click();

        cy.findByRole('button', {name: /Resource search bar/i}).click();

        cy.findByRole('combobox').type('lambda');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        cy.findByRole('button', {name: /Add to diagram/i}).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });

    it('has diagram settings to customise diagram', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />);

        cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type('SettingsDiagram');

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /SettingsDiagram/});

        cy.findByText(/diagram saved/i);

        cy.findByText(
            /the private diagram SettingsDiagram was saved successfully/i
        );

        cy.findByRole('button', {name: /Diagram Settings/i}).click();

        cy.findByLabelText(/accounts/i);

        cy.findByLabelText(/regions/i);

        cy.findByLabelText(/resource types/i);

        cy.findByRole('button', {name: /Apply/i}).should('be.disabled');

        cy.findByRole('radio', {name: /Hide Selected/i}).click();

        cy.findByText(/Select which accounts to hide/i);

        cy.findByText(/Select which regions to hide/i);

        cy.findByText(/Select which resource types to hide/i);

        cy.findByRole('radio', {name: /Only Show Selected/i}).click();

        cy.findByText(/Select which accounts to display/i);

        cy.findByText(/Select which regions to display/i);

        cy.findByText(/Select which resource types to display/i);

        cy.findByRole('button', {name: /Diagram Settings/i}).click();

        cy.findByRole('button', {name: /actions/i}).click();

        cy.findByRole('menuitem', {name: /delete/i}).click();

        cy.findByRole('button', {name: /delete/i}).click();
    });

    it('should have resource and diagram action menu options disabled for empty canvas', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />);

        cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type('TestEmptyDiagram');

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /TestEmptyDiagram/});

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /resource/i}).should('have.attr','aria-disabled','true');

        // the aria-disabled attribute does not guarantee the element is disabled so we click on the menu item
        // and check that the submenu does not appear

        cy.findByRole('menuitem', {name: /resource/i}).click();

        cy.findByRole('menuitem', {name: /expand/i}).should('not.exist');

        cy.findByRole('menuitem', {name: /focus/i}).should('not.exist');

        cy.findByRole('menuitem', {name: /remove/i}).should('not.exist');

        // we need to click on something to dismiss the menu so we just click the action button again
        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /diagram/i}).should('have.attr','aria-disabled','true');

        // the aria-disabled attribute does not guarantee the element is disabled so we click on the menu item
        // and check that the submenu does not appear

        cy.findByRole('menuitem', {name: /diagram/i}).click();

        cy.findByRole('menuitem', {name: /group/i}).should('not.exist');

        cy.findByRole('menuitem', {name: /fit/i}).should('not.exist');

        cy.findByRole('menuitem', {name: /clear/i}).should('not.exist');

        cy.findByRole('menuitem', {name: /export/i}).should('not.exist');
    });

    it('clears diagrams', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />);

        cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type('ClearTestDiagram');

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /ClearTestDiagram/});

        cy.findByRole('button', {name: /Resource search bar/i}).click();

        cy.findByRole('combobox').type('lambda');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        cy.findByRole('button', {name: /Add to diagram/i}).click();

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /diagram/i}).click();

        cy.findByRole('menuitem', {name: /clear/i}).click({force: true});

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /save/i}).click();

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.75});
    });

    it('should get cost interval from diagram settings', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const {worker, graphql} = window.msw;

        cy.mount(<App />).then(() => {
            let period = null;
            worker.use(
                graphql.query('GetCostForResource', async ({variables}) => {
                    const costInfo = {
                        'AWS::Lambda::Function': {
                            product_servicename: 'Lambda',
                            cost: 5.0,
                        },
                        'AWS::RDS::DBCluster': {
                            product_servicename: 'Amazon Neptune',
                            cost: 50.0,
                        },
                    };

                    const costItems =
                        defaultResourceGraph.getResourceGraph.nodes
                            .filter(x =>
                                [
                                    'AWS::RDS::DBCluster',
                                    'AWS::Lambda::Function',
                                ].includes(x.properties.resourceType)
                            )
                            .map(({properties}) => {
                                const {
                                    resourceId,
                                    accountId,
                                    awsRegion,
                                    resourceType,
                                } = properties;
                                return {
                                    ...costInfo[resourceType],
                                    line_item_resource_id: resourceId,
                                    line_item_usage_start_date: null,
                                    line_item_usage_account_id: accountId,
                                    region: awsRegion,
                                    pricing_term: 'OnDemand',
                                    line_item_currency_code: 'USD',
                                };
                            });

                    period = variables.costForResourceQuery.period;

                    return HttpResponse.json({
                        data: {
                            getCostForResource: {
                                totalCost: costItems.reduce(
                                    (total, {cost}) => total + cost
                                ),
                                costItems,
                            },
                        },
                    });
                })
            );

            cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

            cy.findByRole('combobox', {name: /name/i}).type(
                'LoadCostsIntervalDiagram'
            );

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {
                level: 2,
                name: /LoadCostsIntervalDiagram/,
            });

            cy.findByRole('button', {name: /Resource search bar/i}).click();

            cy.findByRole('combobox').type('lambda');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{enter}');

            cy.findByRole('button', {name: /Add to diagram/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('button', {name: /Diagram Settings/i}).click();

            cy.findByLabelText(/Cost Data Time Period/i).click();

            cy.findByRole('radio', {name: /Last 30 Days/i}).click();

            cy.findByRole('button', {name: /Confirm/i}).click();

            cy.findByRole('button', {name: /Apply/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /save/i}).click();

            cy.findByRole('button', {name: /Load Costs/i}).click();

            /* eslint-disable */
            cy.wait(500).then(() => {
                const today = dayjs().format('YYYY-MM-DD');
                const thirtyDaysAgo = dayjs()
                    .subtract(30, 'day')
                    .format('YYYY-MM-DD');

                expect(period.to).to.equal(today);
                expect(period.from).to.equal(thirtyDaysAgo);
            });
            /* eslint-disable */
        });
    });

    it('should create a cost report', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query('GetCostForResource', () => {
                const costInfo = {
                    'AWS::Lambda::Function': {
                        product_servicename: 'Lambda',
                        cost: 5.0,
                    },
                    'AWS::RDS::DBCluster': {
                        product_servicename: 'Amazon Neptune',
                        cost: 50.0,
                    },
                };

                const costItems = defaultResourceGraph.getResourceGraph.nodes
                    .filter(x =>
                        [
                            'AWS::RDS::DBCluster',
                            'AWS::Lambda::Function',
                        ].includes(x.properties.resourceType)
                    )
                    .map(({properties}) => {
                        const {resourceId, accountId, awsRegion, resourceType} =
                            properties;
                        return {
                            ...costInfo[resourceType],
                            line_item_resource_id: resourceId,
                            line_item_usage_start_date: null,
                            line_item_usage_account_id: accountId,
                            region: awsRegion,
                            pricing_term: 'OnDemand',
                            line_item_currency_code: 'USD',
                        };
                    });

                return HttpResponse.json({
                    data: {
                        getCostForResource: {
                            totalCost: costItems.reduce(
                                (total, {cost}) => total + cost
                            ),
                            costItems,
                        },
                    },
                });
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type('CostReportDiagram');

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /CostReportDiagram/});

        cy.findByRole('button', {name: /Resource search bar/i}).click();

        cy.findByRole('combobox').type('lambda');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        cy.findByRole('button', {name: /Add to diagram/i}).click();

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /save/i}).click();

        cy.findByRole('button', {name: /view cost report/i}).click();

        cy.findByText(/\$55.00/);

        cy.findByRole('button', {name: /Export CSV/i}).click();

        cy.readFile('cypress/downloads/cost-report.csv').then(actual => {
            return cy
                .readFile(
                    'src/tests/cypress/components/Diagrams/Draw/DrawDiagram/__file_snapshots__/cost-report.csv'
                )
                .should('deep.equal', actual);
        });
    });

    it('expands resources on diagram with double click', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    eksCluster.getResourceGraph.nodes[0],
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    ids,
                    pagination: {start},
                } = variables;

                let resourceGraph = null;

                const eksClusterArn = eksCluster.getResourceGraph.nodes[0].id;
                const eksNodeGroupArn =
                    eksNodeGroup.getResourceGraph.nodes[0].id;

                if (ids[0] === eksClusterArn) {
                    resourceGraph = eksCluster;
                } else if (ids[0] === eksNodeGroupArn) {
                    resourceGraph = eksNodeGroup;
                }

                const {
                    getResourceGraph: {nodes, edges},
                } = resourceGraph;

                if (nodes.length < start && edges.length < start) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: [],
                                edges: [],
                            },
                        },
                    });
                }
                return HttpResponse.json({data: resourceGraph});
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', {name: /Resources$/, hidden: true}).click();

        cy.findByRole('heading', {level: 2, name: /\(1\)/i});

        cy.findByRole('checkbox', {
            name: /test-cluster is not selected/i,
        }).click();

        cy.findByRole('button', {name: /add to diagram/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type('ExpandTestDiagram');

        cy.findByRole('button', {name: /create/i}).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').then($canvas => {
            const canvasWidth = $canvas.width();
            const canvasHeight = $canvas.height();

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            cy.wrap($canvas)
                .scrollIntoView()
                .dblclick(canvasCenterX - 5, canvasCenterY - 10);
        });

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });

    it('expands resources on diagram with action menu', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    eksCluster.getResourceGraph.nodes[0],
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    ids,
                    pagination: {start},
                } = variables;

                let resourceGraph = null;

                const eksClusterArn = eksCluster.getResourceGraph.nodes[0].id;
                const eksNodeGroupArn =
                    eksNodeGroup.getResourceGraph.nodes[0].id;

                if (ids[0] === eksClusterArn) {
                    resourceGraph = eksCluster;
                } else if (ids[0] === eksNodeGroupArn) {
                    resourceGraph = eksNodeGroup;
                }

                const {
                    getResourceGraph: {nodes, edges},
                } = resourceGraph;

                if (nodes.length < start && edges.length < start) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: [],
                                edges: [],
                            },
                        },
                    });
                }
                return HttpResponse.json({data: resourceGraph});
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', {name: /Resources$/, hidden: true}).click();

        cy.findByRole('heading', {level: 2, name: /\(1\)/i});

        cy.findByRole('checkbox', {
            name: /test-cluster is not selected/i,
        }).click();

        cy.findByRole('button', {name: /add to diagram/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type(
            'ExpandMenuTestDiagram'
        );

        cy.findByRole('button', {name: /create/i}).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').then($canvas => {
            const canvasWidth = $canvas.width();
            const canvasHeight = $canvas.height();

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            cy.wrap($canvas)
                .scrollIntoView()
                .click(canvasCenterX - 5, canvasCenterY - 10);
        });

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /resources/i}).click();

        cy.findByRole('menuitem', {name: /expand/i}).click({force: true});

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 3000});

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.11});
    });

    it('focuses on selected resource', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    eksCluster.getResourceGraph.nodes[0],
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    ids,
                    pagination: {start},
                } = variables;

                let resourceGraph = null;

                const eksClusterArn = eksCluster.getResourceGraph.nodes[0].id;
                const eksNodeGroupArn =
                    eksNodeGroup.getResourceGraph.nodes[0].id;

                if (ids[0] === eksClusterArn) {
                    resourceGraph = eksCluster;
                } else if (ids[0] === eksNodeGroupArn) {
                    resourceGraph = eksNodeGroup;
                }

                const {
                    getResourceGraph: {nodes, edges},
                } = resourceGraph;

                if (nodes.length < start && edges.length < start) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: [],
                                edges: [],
                            },
                        },
                    });
                }
                return HttpResponse.json({data: resourceGraph});
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', {name: /Resources$/, hidden: true}).click();

        cy.findByRole('heading', {level: 2, name: /\(1\)/i});

        cy.findByRole('checkbox', {
            name: /test-cluster is not selected/i,
        }).click();

        cy.findByRole('button', {name: /add to diagram/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type('FocusMenuTestDiagram');

        cy.findByRole('button', {name: /create/i}).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').then($canvas => {
            const canvasWidth = $canvas.width();
            const canvasHeight = $canvas.height();

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            cy.wrap($canvas)
                .scrollIntoView()
                .click(canvasCenterX - 5, canvasCenterY - 10);
        });

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /resources/i}).click();

        cy.findByRole('menuitem', {name: /focus/i}).click({force: true});

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });

    it('deletes selected resource', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const {worker, graphql} = window.msw;

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    eksCluster.getResourceGraph.nodes[0],
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    ids,
                    pagination: {start},
                } = variables;

                let resourceGraph = null;

                const eksClusterArn = eksCluster.getResourceGraph.nodes[0].id;
                const eksNodeGroupArn =
                    eksNodeGroup.getResourceGraph.nodes[0].id;

                if (ids[0] === eksClusterArn) {
                    resourceGraph = eksCluster;
                } else if (ids[0] === eksNodeGroupArn) {
                    resourceGraph = eksNodeGroup;
                }

                const {
                    getResourceGraph: {nodes, edges},
                } = resourceGraph;

                if (nodes.length < start && edges.length < start) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: [],
                                edges: [],
                            },
                        },
                    });
                }
                return HttpResponse.json({data: resourceGraph});
            })
        );

        cy.mount(<App />);

        cy.findByRole('link', {name: /Resources$/, hidden: true}).click();

        cy.findByRole('heading', {level: 2, name: /\(1\)/i});

        cy.findByRole('checkbox', {
            name: /test-cluster is not selected/i,
        }).click();

        cy.findByRole('button', {name: /add to diagram/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type(
            'RemoveMenuTestDiagram'
        );

        cy.findByRole('button', {name: /create/i}).click();

        cy.get('.expand-collapse-canvas').should('be.visible');

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').then($canvas => {
            const canvasWidth = $canvas.width();
            const canvasHeight = $canvas.height();

            const canvasCenterX = canvasWidth / 2;
            const canvasCenterY = canvasHeight / 2;

            cy.wrap($canvas)
                .scrollIntoView()
                .click(canvasCenterX - 5, canvasCenterY - 10);
        });

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /resources/i}).click();

        cy.findByRole('menuitem', {name: /remove/i}).click({force: true});

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.get('.expand-collapse-canvas').matchImage({maxDiffThreshold: 0.1});
    });

    it('should allow resources to be added to an existing diagram', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const diagramName = 'ExistingTestDiagram';

        cy.mount(<App />).then(() => {
            const {worker, graphql} = window.msw;

            const lambdaIamRole =
                defaultResourceGraph.getResourceGraph.nodes.find(x => x.label === 'AWS_IAM_Role');

            worker.use(
                graphql.query(
                    'SearchResources',
                    createSearchResourceHandler([
                        sqsLambda.getResourceGraph.nodes[0],
                        lambdaIamRole
                    ])
                ),
                graphql.query('GetResourceGraph', ({variables}) => {
                    const {
                        ids,
                        pagination: {start},
                    } = variables;

                    const sqsLambdaArn =
                        sqsLambda.getResourceGraph.nodes[0].id;
                    const lambdaIamRoleArn = lambdaIamRole.id;

                    let resourceGraph = null;

                    if (ids[0] === sqsLambdaArn) {
                        resourceGraph = sqsLambda;
                    } else if (ids[0] === lambdaIamRoleArn) {
                        resourceGraph = {
                            getResourceGraph: {
                                nodes: [lambdaIamRole],
                                edges: []
                            }
                        }
                    }

                    const {
                        getResourceGraph: {nodes, edges},
                    } = resourceGraph;

                    if (nodes.length < start && edges.length < start) {
                        return HttpResponse.json({
                            data: {
                                getResourceGraph: {
                                    nodes: [],
                                    edges: [],
                                },
                            },
                        });
                    }
                    return HttpResponse.json({data: resourceGraph});
                })
            );

            cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

            cy.findByRole('combobox', {name: /name/i}).type(
                diagramName
            );

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {
                level: 2,
                name: diagramName,
            });

            cy.findByRole('button', {name: /Resource search bar/i}).click();

            cy.findByRole('combobox').type('lambda');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{enter}');

            cy.findByRole('button', {name: /Add to diagram/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /save/i}).click();

            cy.findByText(
                `The private diagram ${diagramName} was saved successfully`
            );

            cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

            cy.findByPlaceholderText('Find a diagram').click();

            cy.findByRole('link', {name: diagramName}).click();

            cy.findByRole('button', {name: /Resource search bar/i}).click();

            cy.findByRole('combobox').type('Lambda');

            cy.findAllByRole('option', 'AWS_IAM_Role');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{enter}');

            cy.findByRole('button', {name: /Add to diagram/i}).click();

            cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /diagram/i}).click();

            cy.findByRole('menuitem', {name: /fit/i}).click({force: true});

            cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

            cy.get('.expand-collapse-canvas').matchImage({
                maxDiffThreshold: 0.1,
            });
        });
    });

});
