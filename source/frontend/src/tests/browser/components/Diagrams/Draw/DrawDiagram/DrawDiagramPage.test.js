// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import dayjs from 'dayjs';
import {render} from 'vitest-browser-react';
import {beforeAll, describe, expect} from 'vitest';
import {userEvent} from '@vitest/browser/context';
import {it} from '../../../../../vitest/setupFiles/testContext';
import {userEvent as rtlUserEvent} from '@testing-library/user-event';
import App from '../../../../../../App';
import {graphql, HttpResponse} from 'msw';
import defaultResourceGraph from '../../../../../mocks/fixtures/getResourceGraph/default.json';
import eksCluster from '../../../../../mocks/fixtures/getResourceGraph/eks-cluster.json';
import eksNodeGroup from '../../../../../mocks/fixtures/getResourceGraph/nodegroup.json';
import sqsLambda from '../../../../../mocks/fixtures/getResourceGraph/sqs-lambda.json';
import {createSearchResourceHandler} from '../../../../../mocks/handlers';
import {
    createSelfManagedPerspectiveMetadata,
    sleep,
} from '../../../../../vitest/testUtils';

describe('Diagrams Page', () => {
    beforeAll(() => {
        window.addEventListener('unhandledrejection', function (event) {
            // There is a bug in Cytoscape when running in headless browser mode that doesn't affect
            // the application but does generate an error that will cause the test suite to return a
            // non-zero error code. This handler checks for this very specific error and downgrades it
            // to a warning.
            const error = event.reason;

            if (
                error instanceof TypeError &&
                (error.message.includes(
                    "Cannot read properties of null (reading 'isHeadless')"
                ) ||
                    (error.stack && error.stack.includes('Core2.headless')))
            ) {
                console.warn(
                    'Suppressed Cytoscape headless error:',
                    error.message
                );

                // Prevent the error from propagating to Vitest
                event.preventDefault();
                event.stopPropagation();
            }
        });
    });

    it('shows preview of diagram before creation', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    sqsLambda.getResourceGraph.nodes[0],
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    pagination: {start},
                } = variables;

                const {
                    getResourceGraph: {nodes, edges},
                } = sqsLambda;

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
                return HttpResponse.json({data: sqsLambda});
            })
        );

        const screen = render(<App />);

        await screen
            .getByRole('link', {name: /Resources$/, hidden: true})
            .click();

        await screen
            .getByRole('searchbox', {name: 'Find a resource type', exact: true})
            .fill('lambda');

        await screen
            .getByRole('checkbox', {
                name: /aws::lambda::function is not selected/i,
            })
            .click();

        await screen
            .getByRole('checkbox', {
                name: /arn:aws:xxxxxxxxxxxx:eu-west-1:lambda:function:sqs-Title is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /Add to diagram/i}).click();

        const canvas = await screen.getByTestId('wd-cytoscape-canvas');

        // wait for diagram animations on canvas to complete
        await sleep(2000);

        const screenshotPath = await canvas.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 7.5,
        });
    });

    it('creates diagram from search bar', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen.getByRole('combobox', {name: /name/i}).fill('TestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /TestDiagram/})
            )
            .toBeInTheDocument();

        await expect
            .element(
                screen.getByText(
                    /the private diagram TestDiagram was saved successfully/i
                )
            )
            .toBeInTheDocument();

        await screen.getByRole('button', {name: /view cost report/i});

        await screen.getByRole('button', {name: /load costs/i});

        await screen.getByRole('button', {name: /action/i}).click();

        // resource and diagram actions should be disabled when canvas is empty
        expect(
            screen.getByRole('menuitem', {name: /resource/i})
        ).toBeDisabled();

        expect(
            await screen.getByRole('menuitem', {name: /diagram/i})
        ).toBeDisabled();

        const searchBox = screen.getByRole('button', {
            name: /Resource search bar/i,
        });

        await searchBox.click();

        await screen.getByRole('combobox').fill('lambda');

        await userEvent.type(searchBox, '[ArrowDown][ArrowDown][Enter]');

        await screen
            .getByRole('button', {
                name: /Add 1 selected resource to diagram/i,
            })
            .click();

        const canvas = await screen.getByTestId('wd-cytoscape-canvas');

        // wait for diagram animations on canvas to complete
        await sleep(2000);

        const screenshotPath = await canvas.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 5.0,
        });
    });

    it('has diagram settings to customise diagram', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const screen = render(<App />);

        await screen
            .getByRole('link', {name: /Resources$/, hidden: true})
            .click();

        await screen
            .getByRole('searchbox', {name: 'Find a resource type', exact: true})
            .fill('lambda');

        await screen
            .getByRole('checkbox', {
                name: /aws::lambda::function is not selected/i,
            })
            .click();

        await screen
            .getByRole('checkbox', {
                name: /arn:aws:yyyyyyyyyyyy:eu-west-1:AWS::Lambda::Function:0Title is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /Add to diagram/i}).click();

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('SettingsDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /SettingsDiagram/})
            )
            .toBeInTheDocument();

        await expect
            .element(screen.getByText(/diagram saved/i))
            .toBeInTheDocument();

        await screen.getByText(
            /the private diagram SettingsDiagram was saved successfully/i
        );

        await screen
            .getByRole('button', {
                name: /Diagram Settings/i,
            })
            .click();

        await screen.getByLabelText(/accounts/i);

        await screen.getByLabelText(/regions/i);

        await screen.getByLabelText(/resource types/i);

        await expect
            .element(screen.getByRole('button', {name: /Apply/i}))
            .toBeDisabled();

        await screen.getByRole('radio', {name: /Hide Selected/i}).click();

        expect(
            screen.getByText(/Select which accounts to hide/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Select which regions to hide/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Select which resource types to hide/i)
        ).toBeInTheDocument();

        await screen.getByRole('radio', {name: /Only Show Selected/i}).click();

        expect(
            screen.getByText(/Select which accounts to display/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Select which regions to display/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/Select which resource types to display/i)
        ).toBeInTheDocument();

        await screen.getByRole('button', {name: /Diagram Settings/i}).click();

        await screen.getByRole('button', {name: /actions/i}).click();

        await screen.getByRole('menuitem', {name: /delete/i}).click();

        const deleteBtn = await screen.getByRole('button', {name: /delete/i});

        // This button is contained in a model dialog, which can be displayed inconsistently
        // in headless mode so we use the keyboard to select it rather than a mouse click.
        await userEvent.type(deleteBtn, '[Enter]');
    });

    it('clears diagrams', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    sqsLambda.getResourceGraph.nodes[0],
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    pagination: {start},
                } = variables;

                const {
                    getResourceGraph: {nodes, edges},
                } = sqsLambda;

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
                return HttpResponse.json({data: sqsLambda});
            })
        );

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('ClearTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {
                    level: 2,
                    name: /ClearTestDiagram/,
                })
            )
            .toBeInTheDocument();

        const searchBar = screen.getByRole('button', {
            name: /Resource search bar/i,
        });

        await searchBar.click();

        await screen.getByRole('combobox').fill('lambda');

        const listBox = screen.getByRole('listbox');

        await expect
            .poll(() => listBox.getByRole('option').all(), {timeout: 4000})
            .toHaveLength(3);

        await userEvent.type(searchBar, '[ArrowDown][ArrowDown][Enter]');

        await screen
            .getByRole('button', {
                name: /Add 1 selected resource to diagram/i,
            })
            .click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /clear/i}).click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        // allow items to be removed from canvas before screenshot
        await sleep(2000);

        const canvas = await screen.getByTestId('wd-cytoscape-canvas');

        const screenshotPath = await canvas.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 5.0,
        });
    });

    it('should get cost interval from diagram settings', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const screen = render(<App />);

        const {promise: periodPromise, resolve} = Promise.withResolvers();

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

                resolve(variables.costForResourceQuery.period);

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

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('LoadCostsIntervalDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                await screen.getByRole('heading', {
                    level: 2,
                    name: /LoadCostsIntervalDiagram/,
                })
            )
            .toBeInTheDocument();

        await screen
            .getByRole('button', {name: /Resource search bar/i})
            .click();

        await screen.getByRole('combobox').fill('lambda');

        const listBox = screen.getByRole('listbox');

        await expect
            .poll(() => listBox.getByRole('option').all(), {timeout: 7500})
            .toHaveLength(3);

        const lambdaOption = await screen.getByRole('option', {
            name: /arn:aws:yyyyyyyyyyyy:eu-west-1:AWS::Lambda::Function:0Title/i,
        });

        await userEvent.type(lambdaOption, '[ArrowDown][ArrowDown][Enter]');

        await screen
            .getByRole('button', {
                name: /Add 1 selected resource to diagram/i,
            })
            .click();

        await screen.getByRole('button', {name: /Diagram Settings/i}).click();

        await screen.getByLabelText(/Cost Data Time Period/i).click();

        await screen.getByRole('radio', {name: /Last 30 Days/i}).click();

        await screen.getByRole('button', {name: /Confirm/i}).click();

        await screen.getByRole('button', {name: /Apply/i}).click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByRole('button', {name: /Load Costs/i}).click();

        const period = await periodPromise;

        const today = dayjs().format('YYYY-MM-DD');
        const thirtyDaysAgo = dayjs().subtract(30, 'day').format('YYYY-MM-DD');

        expect(period.to).to.equal(today);
        expect(period.from).to.equal(thirtyDaysAgo);
    });

    it('should create a cost report', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

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

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('CostReportDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {
            level: 2,
            name: /CostReportDiagram/,
        });

        await screen
            .getByRole('button', {name: /Resource search bar/i})
            .click();

        await screen.getByRole('combobox').fill('lambda');

        const listBox = screen.getByRole('listbox');

        await expect
            .poll(() => listBox.getByRole('option').all(), {timeout: 4000})
            .toHaveLength(3);

        const lambdaOption = await screen.getByRole('option', {
            name: /arn:aws:yyyyyyyyyyyy:eu-west-1:AWS::Lambda::Function:0Title/i,
        });

        await userEvent.type(lambdaOption, '[ArrowDown][ArrowDown][Enter]');

        await screen
            .getByRole('button', {
                name: /Add 1 selected resource to diagram/i,
            })
            .click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByRole('button', {name: /view cost report/i}).click();

        await screen.getByText(/$55.00/);

        await screen.getByRole('button', {name: /Export CSV/i}).click();
    });

    it('expands resources on diagram with double click', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

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

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Resources$/}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('checkbox', {
                name: /test-cluster is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /add to diagram/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('ExpandTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        // wait for diagram animations on canvas to complete
        await sleep(3000);

        const canvasDiv = await screen.getByTestId('wd-cytoscape-canvas');

        // to interact with the canvas we need the actual canvas HTML element rather than
        // the containing div with the test id
        const canvas = canvasDiv.element().querySelector('canvas');

        const user = rtlUserEvent.setup();

        await user.pointer({
            target: canvas,
            coords: {
                clientX: 2586,
                clientY: 1007,
            },
        });

        await user.dblClick(canvas);

        // allow items to be removed from canvas before screenshot
        await sleep(2000);

        const screenshotPath = await canvasDiv.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 5.0,
        });
    });

    it('expands resources on diagram with action menu', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

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

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Resources$/}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('checkbox', {
                name: /test-cluster is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /add to diagram/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('ExpandMenuTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        // wait for diagram animations on canvas to complete
        await sleep(2000);

        const canvasDiv = await screen.getByTestId('wd-cytoscape-canvas');

        // to interact with the canvas we need the actual canvas HTML element rather than
        // the containing div with the test id
        const canvas = canvasDiv.element().querySelector('canvas');

        const user = rtlUserEvent.setup();

        await user.pointer({
            target: canvas,
            coords: {
                clientX: 1606,
                clientY: 684,
            },
        });

        await user.click(canvas);

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /resources/i}).click();

        await screen.getByRole('menuitem', {name: /expand/i}).click();

        // allow items to be removed from canvas before screenshot
        await sleep(2000);

        const screenshotPath = await canvasDiv.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 7.5,
        });
    });

    it('focuses on selected resource', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

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

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Resources$/}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('checkbox', {
                name: /test-cluster is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /add to diagram/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('FocusMenuTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        // wait for diagram animations on canvas to complete
        await sleep(2000);

        const canvasDiv = await screen.getByTestId('wd-cytoscape-canvas');

        // to interact with the canvas we need the actual canvas HTML element rather than
        // the containing div with the test id
        const canvas = canvasDiv.element().querySelector('canvas');

        const user = rtlUserEvent.setup();

        await user.pointer({
            target: canvas,
            coords: {
                clientX: 1606,
                clientY: 775,
            },
        });

        await user.click(canvas);

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /resources/i}).click();

        await screen
            .getByRole('menuitem', {name: /focus/i})
            .click({force: true});

        // allow items to be removed from canvas before screenshot
        await sleep(2500);

        const screenshotPath = await canvasDiv.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 5.0,
        });
    });

    it('deletes selected resource', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

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

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Resources$/}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('checkbox', {
                name: /test-cluster is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /add to diagram/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('RemoveMenuTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        // wait for diagram animations on canvas to complete
        await sleep(3000);

        const canvasDiv = await screen.getByTestId('wd-cytoscape-canvas');

        // to interact with the canvas we need the actual canvas HTML element rather than
        // the containing div with the test id
        const canvas = canvasDiv.element().querySelector('canvas');

        const user = rtlUserEvent.setup();

        await user.pointer({
            target: canvas,
            coords: {
                clientX: 1335,
                clientY: 1080,
            },
        });

        await sleep(5000);

        await user.click(canvas);

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /resources/i}).click();

        await screen
            .getByRole('menuitem', {name: /remove/i})
            .click({force: true});

        // allow items to be removed from canvas before screenshot
        await sleep(2000);

        const screenshotPath = await canvasDiv.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 5.0,
        });
    }, 20000);

    it('should allow resources to be added to an existing diagram', async ({
        worker,
    }) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const diagramName = 'ExistingTestDiagram';

        const screen = render(<App />);

        const lambdaIamRole = defaultResourceGraph.getResourceGraph.nodes.find(
            x => x.label === 'AWS_IAM_Role'
        );

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    sqsLambda.getResourceGraph.nodes[0],
                    lambdaIamRole,
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    ids,
                    pagination: {start},
                } = variables;

                const sqsLambdaArn = sqsLambda.getResourceGraph.nodes[0].id;
                const lambdaIamRoleArn = lambdaIamRole.id;

                let resourceGraph = null;

                if (ids[0] === sqsLambdaArn) {
                    resourceGraph = sqsLambda;
                } else if (ids[0] === lambdaIamRoleArn) {
                    resourceGraph = {
                        getResourceGraph: {
                            nodes: [lambdaIamRole],
                            edges: [],
                        },
                    };
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

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {level: 2, name: /Create Diagram/i});

        await screen.getByRole('combobox', {name: /name/i}).fill(diagramName);

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {
            level: 2,
            name: diagramName,
        });

        const searchBox = screen.getByRole('button', {
            name: /Resource search bar/i,
        });

        await searchBox.click();

        await screen.getByRole('combobox').fill('lambda');

        const listBox = screen.getByRole('listbox');

        await expect
            .poll(() => listBox.getByRole('option').all(), {timeout: 4000})
            .toHaveLength(3);

        await userEvent.type(searchBox, '[ArrowDown][ArrowDown][Enter]');

        await screen
            .getByRole('button', {
                name: /Add 1 selected resource to diagram/i,
            })
            .click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByText(
            `The private diagram ${diagramName} was saved successfully`
        );

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByPlaceholder('Find a diagram').click();

        await screen.getByRole('link', {name: diagramName}).click();

        await screen
            .getByRole('button', {name: /Resource search bar/i})
            .click();

        await screen.getByRole('combobox').fill('role');

        await screen
            .getByRole('option', {
                name: /arn:aws:iam::yyyyyyyyyyyy:role\/testRole-Title/i,
            })
            .click();

        await screen
            .getByRole('button', {name: /Add 1 selected resource to diagram/i})
            .click();

        await sleep(2500);

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /fit/i}).click();

        // allow items to be added to canvas before screenshot
        await sleep(2500);

        const canvas = await screen.getByTestId('wd-cytoscape-canvas');

        const screenshotPath = await canvas.screenshot({
            scale: 'device',
        });

        await expect(screenshotPath).toMatchImageSnapshot({
            maxDiffPercentage: 7.5,
        });
    }, 20000);
});
