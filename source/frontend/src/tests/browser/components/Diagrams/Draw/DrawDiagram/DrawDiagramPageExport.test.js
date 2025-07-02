// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {describe, expect} from 'vitest';
import {it} from '../../../../../vitest/setupFiles/testContext';
import App from '../../../../../../App';
import eksNodeGroup from '../../../../../mocks/fixtures/getResourceGraph/nodegroup.json';
import {createSearchResourceHandler} from '../../../../../mocks/handlers';
import {
    createSelfManagedPerspectiveMetadata,
    sleep,
} from '../../../../../vitest/testUtils';
import {graphql, HttpResponse} from 'msw';
import sqsLambda from '../../../../../mocks/fixtures/getResourceGraph/sqs-lambda.json';
import {render} from 'vitest-browser-react';
import {userEvent} from '@vitest/browser/context';
import * as R from 'ramda';
import {regionMap} from '../../../../../../Utils/Dictionaries/RegionMap';

describe('Diagrams Page Export', () => {
    it('exports diagram to csv and json', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    eksNodeGroup.getResourceGraph.nodes[0],
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    pagination: {start},
                } = variables;

                const {
                    getResourceGraph: {nodes, edges},
                } = eksNodeGroup;

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
                return HttpResponse.json({data: eksNodeGroup});
            })
        );

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Create Diagram/i})
            )
            .toBeInTheDocument();

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('CsvExportTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {
                    level: 2,
                    name: /CsvExportTestDiagram/,
                })
            )
            .toBeInTheDocument();

        const searchBox = screen.getByRole('button', {
            name: /Resource search bar/i,
        });

        await searchBox.click();

        await screen.getByRole('combobox').fill('eks');

        const listBox = screen.getByRole('listbox');

        await expect
            .poll(() => listBox.getByRole('option').all(), {timeout: 4000})
            .toHaveLength(3);

        await userEvent.type(searchBox, '[ArrowDown][ArrowDown][Enter]');

        await screen
            .getByRole('button', {name: /Add 1 selected resource to diagram/i})
            .click();

        // Wait for the canvas to render
        await sleep(2000);

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /export/i}).click();

        const csvRadio = screen.getByRole('radio', {name: /csv/i});

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(csvRadio, '[Space]');

        const exportForm = screen.getByRole('form', {name: 'export'});
        const exportButton = await exportForm.getByRole('button', {
            name: /export/i,
        });

        await userEvent.type(exportButton, '[Enter]');

        // Export to JSON
        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /export/i}).click();

        const jsonRadio = screen.getByRole('radio', {name: /json/i});

        await userEvent.type(jsonRadio, '[Enter]');

        await userEvent.type(exportButton, '[Enter]');

        // When Vitest browser testing adds support for file downloads, we will verify
        // the CSV and JSON file contents
    });

    it('exports diagram to svg', async ({worker}) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler([
                    eksNodeGroup.getResourceGraph.nodes[0],
                ])
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    pagination: {start},
                } = variables;

                const {
                    getResourceGraph: {nodes, edges},
                } = eksNodeGroup;

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
                return HttpResponse.json({data: eksNodeGroup});
            })
        );

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Create Diagram/i})
            )
            .toBeInTheDocument();

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('ExportToSvgTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {
                    level: 2,
                    name: /ExportToSvgTestDiagram/,
                })
            )
            .toBeInTheDocument();

        const searchBox = screen.getByRole('button', {
            name: /Resource search bar/i,
        });

        await searchBox.click();

        await screen.getByRole('combobox').fill('eks');

        const listBox = screen.getByRole('listbox');

        await expect
            .poll(() => listBox.getByRole('option').all(), {timeout: 4000})
            .toHaveLength(3);

        await userEvent.type(searchBox, '[ArrowDown][ArrowDown][Enter]');

        await screen
            .getByRole('button', {name: /Add 1 selected resource to diagram/i})
            .click();

        // Wait for the canvas to render
        await sleep(2000);

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /export/i}).click();

        const svgRadio = screen.getByRole('radio', {name: /svg/i});

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(svgRadio, '[Space]');

        const exportForm = await screen.getByRole('form', {name: 'export'});

        const exportButton = await exportForm.getByRole('button', {
            name: /export/i,
        });

        await userEvent.type(exportButton, '[Enter]');

        // When Vitest browser testing adds support for file downloads, we will verify
        // the SVG file contents
    });

    it('should export ensure diagram to drawio button is enabled', async ({
        worker,
    }) => {
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

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Create Diagram/i})
            )
            .toBeInTheDocument();

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('ExportToDrawIoTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {
                    level: 2,
                    name: /ExportToDrawIoTestDiagram/,
                })
            )
            .toBeInTheDocument();

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
            .getByRole('button', {name: /Add 1 selected resource to diagram/i})
            .click();

        // Wait for the canvas to render
        await sleep(2000);

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /export/i}).click();

        const svgRadio = screen.getByRole('radio', {name: /svg/i});

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(svgRadio, '[Space]');

        await expect
            .element(await screen.getByLabelText('File name'))
            .toBeInTheDocument();

        const drawIoRadio = screen.getByRole('radio', {name: /Diagrams.net/i});

        await userEvent.type(drawIoRadio, '[Space]');

        // Check that the file name field doesn't exist when drawio is selected
        expect(screen.getByLabelText('File name').query()).toBeNull();

        const exportForm = await screen.getByRole('form', {name: 'export'});

        const exportButton = await exportForm.getByRole('button', {
            name: /export/i,
        });

        await expect.element(exportButton).toBeEnabled();
    });

    it('should export to myApplications', async ({worker}) => {
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

        const diagramName = 'ExportToMyApplicationsTestDiagram';

        await screen.getByRole('combobox', {name: /name/i}).fill(diagramName);

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {
            level: 2,
            name: /ExportToMyApplicationsTestDiagram/,
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
            .getByRole('button', {name: /Add 1 selected resource to diagram/i})
            .click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /export/i}).click();

        const myAppRadio = screen.getByRole('radio', {name: /myapplications/i});

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(myAppRadio, '[Space]');

        const appNameInput = screen.getByRole('textbox', {
            name: 'Application name',
        });

        expect(appNameInput).toHaveValue(diagramName);

        const applicationName = diagramName + 'Renamed';

        await appNameInput.fill(applicationName);

        const accountButton = screen.getByRole('button', {name: /account/i});
        await userEvent.type(accountButton, '[Enter]');

        const accountOption = screen.getByRole('option', {
            name: /xxxxxxxxxxxx/i,
        });
        await userEvent.type(accountOption, '[ArrowDown][Enter]');

        const regionButton = screen.getByRole('button', {name: /region/i});
        await userEvent.type(regionButton, '[ArrowDown][Enter]');

        const exportForm = await screen.getByRole('form', {name: 'export'});

        const exportButton = await exportForm.getByRole('button', {
            name: /export/i,
        });

        await userEvent.type(exportButton, '[Enter]');

        await expect
            .element(screen.getByText(/Application created/i))
            .toBeInTheDocument();

        await expect
            .element(
                screen.getByText(
                    `The application named ${applicationName} has been created.`
                )
            )
            .toBeInTheDocument();

        expect(
            screen
                .getByText('However, the following resources were not added:')
                .query()
        ).toBeNull();
    });

    it('should give user choice of all regions to create application in when diagram only has global resources', async ({
        worker,
    }) => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const regions = R.reject(x => x.id === 'global', regionMap).map(
            x => x.id
        );

        const US_EAST_1 = 'us-east-1';

        const ACCOUNT_ID_1 = '111111111111';

        const iamRoleArn1 = `arn:aws:iam::${ACCOUNT_ID_1}:role/test-role-name`;
        const iamRoleArn2 = `arn:aws:iam::${ACCOUNT_ID_1}:role/test-role-name2`;

        const getResourceGraph = {
            nodes: [
                {
                    id: iamRoleArn1,
                    type: 'resource',
                    properties: {
                        arn: iamRoleArn1,
                        accountId: ACCOUNT_ID_1,
                        awsRegion: 'global',
                        resourceType: 'AWS::IAM::Role',
                        title: 'test-role-name',
                        tags: '[]',
                    },
                },
                {
                    id: iamRoleArn2,
                    type: 'resource',
                    properties: {
                        arn: iamRoleArn2,
                        accountId: ACCOUNT_ID_1,
                        awsRegion: 'global',
                        resourceType: 'AWS::IAM::Role',
                        title: 'test-role-name2',
                        tags: '[]',
                    },
                },
            ],
            edges: [
                {
                    id: 'c8c61a6d-ffe7-9524-a55c-a9473154e444',
                    label: 'IS_ASSOCIATED_WITH',
                    source: {
                        id: iamRoleArn1,
                        label: 'AWS_IAM_Role',
                    },
                    target: {
                        id: iamRoleArn2,
                        label: 'AWS_IAM_Role',
                    },
                },
            ],
        };

        worker.use(
            graphql.query(
                'SearchResources',
                createSearchResourceHandler(getResourceGraph.nodes)
            ),
            graphql.query('GetResourceGraph', ({variables}) => {
                const {
                    ids,
                    pagination: {start},
                } = variables;

                if (
                    ids[0] !== getResourceGraph.nodes[0].id ||
                    (getResourceGraph.nodes.length < start &&
                        getResourceGraph.edges.length < start)
                ) {
                    return HttpResponse.json({
                        data: {
                            getResourceGraph: {
                                nodes: [],
                                edges: [],
                            },
                        },
                    });
                }
                return HttpResponse.json({data: {getResourceGraph}});
            })
        );

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Resources$/}).click();

        await screen
            .getByRole('checkbox', {
                name: /test-role-name is not selected/i,
            })
            .click();

        await screen.getByRole('button', {name: /add to diagram/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Create Diagram/i})
            )
            .toBeInTheDocument();

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('RegionSelectionTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {
                    level: 2,
                    name: /RegionSelectionTestDiagram/,
                })
            )
            .toBeInTheDocument();

        // Wait for the diagram to load
        await sleep(1000);

        // Export the diagram
        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /export/i}).click();

        const myAppRadio = screen.getByRole('radio', {name: /myapplications/i});
        await userEvent.type(myAppRadio, '[Space]');

        const accountButton = screen.getByRole('button', {name: /account/i});
        await userEvent.type(accountButton, '[Enter][ArrowDown][Enter]');

        const regionButton = screen.getByRole('button', {name: /region/i});
        await userEvent.type(regionButton, '[Enter]');

        const regionOptions = screen.getByRole('listbox').getByRole('option');

        await expect
            .poll(() => regionOptions.all(), {timeout: 4000})
            .toHaveLength(regions.length);

        await Promise.all(
            regions.map(region => {
                return expect
                    .element(
                        screen.getByRole('option', {
                            name: new RegExp(region, 'i'),
                        })
                    )
                    .toBeInTheDocument();
            })
        );
    });

    it('should export to myApplications and report any unprocessed resources', async ({
        worker,
    }) => {
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
            }),
            graphql.mutation('CreateApplication', ({variables}) => {
                const {resources} = variables;

                return HttpResponse.json({
                    data: {
                        createApplication: {
                            applicationTag: 'myApplicationTag',
                            name: variables.name,
                            unprocessedResources: [resources[0].id],
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
            .fill('ExportToMyApplicationsUnprocessedTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await screen.getByRole('heading', {
            level: 2,
            name: /ExportToMyApplicationsUnprocessedTestDiagram/,
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
            .getByRole('button', {name: /Add 1 selected resource to diagram/i})
            .click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /export/i}).click();

        const myAppRadio = screen.getByRole('radio', {name: /myapplications/i});

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(myAppRadio, '[Space]');

        const accountButton = screen.getByRole('button', {name: /account/i});
        await userEvent.type(accountButton, '[Enter]');

        const accountOption = screen.getByRole('option', {
            name: /xxxxxxxxxxxx/i,
        });
        await userEvent.type(accountOption, '[ArrowDown][Enter]');

        const regionButton = screen.getByRole('button', {name: /region/i});
        await userEvent.type(regionButton, '[ArrowDown][Enter]');

        const exportForm = await screen.getByRole('form', {name: 'export'});
        const exportButton = await exportForm.getByRole('button', {
            name: /export/i,
        });
        await userEvent.type(exportButton, '[Enter]');

        await expect
            .element(screen.getByText(/Application created/i))
            .toBeInTheDocument();

        await expect
            .element(
                await screen.getByText(
                    'The application named ExportToMyApplicationsUnprocessedTestDiagram has been created. However, the following resources were not added: arn:aws:xxxxxxxxxxxx:eu-west-1:lambda:function:sqs'
                )
            )
            .toBeInTheDocument();
    });

    it('should return error if application with same name exists', async ({
        worker,
    }) => {
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
            }),
            graphql.mutation('CreateApplication', ({variables}) => {
                const {name} = variables;

                return HttpResponse.json({
                    errors: [
                        {
                            path: ['createApplication'],
                            data: null,
                            errorType: 'Lambda:Unhandled',
                            errorInfo: null,
                            locations: [{line: 2, column: 3, sourceName: null}],
                            message: `An application with the name ${name} already exists.`,
                        },
                    ],
                });
            })
        );

        const screen = render(<App />);

        await screen.getByRole('link', {name: /Manage$/, hidden: true}).click();

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {level: 2, name: /Create Diagram/i})
            )
            .toBeInTheDocument();

        await screen
            .getByRole('combobox', {name: /name/i})
            .fill('ExportToMyApplicationsExistsTestDiagram');

        await screen.getByRole('button', {name: /create/i}).click();

        await expect
            .element(
                screen.getByRole('heading', {
                    level: 2,
                    name: /ExportToMyApplicationsExistsTestDiagram/,
                })
            )
            .toBeInTheDocument();

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
            .getByRole('button', {name: /Add 1 selected resource to diagram/i})
            .click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /save/i}).click();

        await screen.getByRole('button', {name: /action/i}).click();

        await screen.getByRole('menuitem', {name: /diagram/i}).click();

        await screen.getByRole('menuitem', {name: /export/i}).click();

        const myAppRadio = screen.getByRole('radio', {name: /myapplications/i});

        // in headless mode we need to interact with modal dialogs using the keyboard due
        // to inconsistencies in how they are displayed in this mode
        await userEvent.type(myAppRadio, '[Space]');

        const accountButton = screen.getByRole('button', {name: /account/i});
        await userEvent.type(accountButton, '[Enter]');

        const accountOption = screen.getByRole('option', {
            name: /xxxxxxxxxxxx/i,
        });
        await userEvent.type(accountOption, '[ArrowDown][Enter]');

        const regionButton = screen.getByRole('button', {name: /region/i});
        await userEvent.type(regionButton, '[ArrowDown][Enter]');

        const exportForm = await screen.getByRole('form', {name: 'export'});
        const exportButton = await exportForm.getByRole('button', {
            name: /export/i,
        });
        await userEvent.type(exportButton, '[Enter]');

        await expect
            .element(
                await screen.getByText(
                    'An application with the name ExportToMyApplicationsExistsTestDiagram already exists.'
                )
            )
            .toBeInTheDocument();
    });
});
