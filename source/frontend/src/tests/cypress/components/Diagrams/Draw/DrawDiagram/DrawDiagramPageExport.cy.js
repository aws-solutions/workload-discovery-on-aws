// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import App from '../../../../../../App';
import eksNodeGroup from '../../../../../mocks/fixtures/getResourceGraph/nodegroup.json';
import {createSearchResourceHandler} from '../../../../../mocks/handlers';
import {createSelfManagedPerspectiveMetadata} from '../../../../../vitest/testUtils';
import sqsLambdaResourceGraph from '../../../../../mocks/fixtures/getResourceGraph/sqs-lambda.json';
import {HttpResponse} from 'msw';

describe('Diagrams Page Local', () => {
    const IS_CODE_BUILD = Cypress.env('IS_CODE_BUILD');

    it('exports diagram to csv and json', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        const {worker, graphql} = window.msw;

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

        cy.mount(<App />);

        cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type('CsvExportTestDiagram');

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /CsvExportTestDiagram/});

        cy.findByRole('button', {name: /Resource search bar/i}).click();

        cy.findByRole('combobox').type('eks');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        cy.findByRole('button', {name: /Add to diagram/i}).click();

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /save/i}).click();

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /diagram/i}).click();

        cy.findByRole('menuitem', {name: /export/i}).click({force: true});

        cy.findByRole('radio', {name: /csv/i}).click();

        cy.findByTestId('export-diagram-modal-button').click();

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /diagram/i}).click();

        cy.findByRole('menuitem', {name: /export/i}).click({force: true});

        cy.findByRole('radio', {name: /json/i}).click();

        cy.findByTestId('export-diagram-modal-button').click();

        if (!IS_CODE_BUILD) {
            cy.readFile('cypress/downloads/CsvExportTestDiagram.json')
                .then(async ({nodes, edges}) => {
                    // we can see see floating point issues with the the graphing library position values on the
                    // canvas (e.g., a value that on most runs is 2 can come back as 1.9999999997) that makes this
                    // test unreliable so we round the number to eliminate this variance
                    const roundedNodes = nodes.map(({position, ...props}) => {
                        return {
                            position: {
                                x: parseFloat(position.x.toFixed(2)),
                                y: parseFloat(position.y.toFixed(2)),
                            },
                            ...props,
                        };
                    });

                    return {
                        nodes: roundedNodes,
                        edges,
                    };
                })
                .then(actual => {
                    const expectedJsonFilePath = `src/tests/cypress/components/Diagrams/Draw/DrawDiagram/__file_snapshots__/JsonExportTestDiagram${IS_CODE_BUILD ? 'Ci' : 'Local'}.json`;
                    return cy
                        .readFile(expectedJsonFilePath)
                        .should('deep.equal', actual);
                });
        }

        cy.readFile('cypress/downloads/CsvExportTestDiagram.csv').then(
            actual => {
                return cy
                    .readFile(
                        'src/tests/cypress/components/Diagrams/Draw/DrawDiagram/__file_snapshots__/CsvExportTestDiagram.csv'
                    )
                    .should('deep.equal', actual);
            }
        );
    });

    if (!IS_CODE_BUILD) {
        it('exports diagram to svg', () => {
            window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

            const {worker, graphql} = window.msw;

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

            cy.mount(<App />);

            cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

            cy.findByRole('combobox', {name: /name/i}).type(
                'ExportToSvgTestDiagram'
            );

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {
                level: 2,
                name: /ExportToSvgTestDiagram/,
            });

            cy.findByRole('button', {name: /Resource search bar/i}).click();

            cy.findByRole('combobox').type('eks');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{enter}');

            cy.findByRole('button', {name: /Add to diagram/i}).click();

            cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /save/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /diagram/i}).click();

            cy.findByRole('menuitem', {name: /export/i}).click({force: true});

            cy.findByRole('radio', {name: /svg/i}).click();

            cy.findByTestId('export-diagram-modal-button').click();

            cy.readFile('cypress/downloads/ExportToSvgTestDiagram.svg').then(
                actual => {
                    // floating point imprecision and autogenerated ids make the generation of the SVG
                    // non-deterministic so we must round numbers and normalize ids to make sure
                    // the test doesn't fail randomly
                    const normalized = actual
                        .replaceAll(/\d{1,5}\.?\d{2,20}/g, num => {
                            const rounded = Number.parseFloat(num).toFixed(2);
                            return parseFloat(rounded);
                        })
                        .replaceAll(
                            /clip-path="url\(#\w{10,13}\)/g,
                            'clip-path="url(#urlId)'
                        )
                        .replaceAll(
                            /clipPath id="\w{12,15}"/g,
                            'clipPath id="urlId"'
                        );

                    const expectedSvgFilePath = `src/tests/cypress/components/Diagrams/Draw/DrawDiagram/__file_snapshots__/ExportToSvgTestDiagram${IS_CODE_BUILD ? 'Ci' : 'Local'}.svg`;

                    return cy
                        .readFile(expectedSvgFilePath)
                        .should('deep.equal', normalized);
                }
            );
        });
    }

    it('should export ensure diagram to drawio button is enabled', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />).then(() => {
            const {worker, graphql} = window.msw;

            worker.use(
                graphql.query(
                    'SearchResources',
                    createSearchResourceHandler([
                        sqsLambdaResourceGraph.getResourceGraph.nodes[0],
                    ])
                ),
                graphql.query('GetResourceGraph', ({variables}) => {
                    const {
                        pagination: {start},
                    } = variables;

                    const {
                        getResourceGraph: {nodes, edges},
                    } = sqsLambdaResourceGraph;

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
                    return HttpResponse.json({data: sqsLambdaResourceGraph});
                })
            );
        });

        cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

        cy.findByRole('combobox', {name: /name/i}).type(
            'ExportToDrawIoTestDiagram'
        );

        cy.findByRole('button', {name: /create/i}).click();

        cy.findByRole('heading', {level: 2, name: /ExportToDrawIoTestDiagram/});

        cy.findByRole('button', {name: /Resource search bar/i}).click();

        cy.findByRole('combobox').type('lambda');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{downArrow}');

        cy.findByRole('combobox').type('{enter}');

        cy.findByRole('button', {name: /Add to diagram/i}).click();

        cy.get('.expand-collapse-canvas').scrollIntoView({duration: 2000});

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /save/i}).click();

        cy.findByRole('button', {name: /action/i}).click();

        cy.findByRole('menuitem', {name: /diagram/i}).click();

        cy.findByRole('menuitem', {name: /export/i}).click({force: true});

        cy.findByRole('radio', {name: /svg/i}).click();

        cy.findByLabelText('File name');

        cy.findByRole('radio', {name: /Diagrams.net/i}).click();

        cy.findByLabelText('File name').should('not.exist');

        cy.findByTestId('export-diagram-modal-button').should(
            'not.be.disabled'
        );
    });

    it('should export to myApplications', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />).then(() => {
            const {worker, graphql} = window.msw;

            worker.use(
                graphql.query(
                    'SearchResources',
                    createSearchResourceHandler([
                        sqsLambdaResourceGraph.getResourceGraph.nodes[0],
                    ])
                ),
                graphql.query('GetResourceGraph', ({variables}) => {
                    const {
                        pagination: {start},
                    } = variables;

                    const {
                        getResourceGraph: {nodes, edges},
                    } = sqsLambdaResourceGraph;

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
                    return HttpResponse.json({data: sqsLambdaResourceGraph});
                })
            );

            cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

            cy.findByRole('combobox', {name: /name/i}).type(
                'ExportToMyApplicationsTestDiagram'
            );

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {
                level: 2,
                name: /ExportToMyApplicationsTestDiagram/,
            });

            cy.findByRole('button', {name: /Resource search bar/i}).click();

            cy.findByRole('combobox').type('lambda');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{enter}');

            cy.findByRole('button', {name: /Add to diagram/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /save/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /diagram/i}).click();

            cy.findByRole('menuitem', {name: /export/i}).click({force: true});

            cy.findByRole('radio', {name: /myapplications/i}).click();

            cy.findByRole('button', {name: /account/i}).click();
            cy.findByRole('option', {name: /xxxxxxxxxxxx/i}).click();

            cy.findByRole('button', {name: /region/i}).click();
            cy.findByRole('option', {name: /eu-west-1/i}).click();

            cy.findByRole('form', {name: 'export'}).within(() => {
                cy.findByRole('button', {name: /export/i}).click();
            });

            cy.findByText(/Application created/i);

            cy.findByText(
                'The application named ExportToMyApplicationsTestDiagram has been created.'
            );

            cy.findByText(
                'However, the following resources were not added:'
            ).should('not.exist');
        });
    });

    it('should export to myApplications and report any unprocessed resources', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />).then(() => {
            const {worker, graphql} = window.msw;

            worker.use(
                graphql.query(
                    'SearchResources',
                    createSearchResourceHandler([
                        sqsLambdaResourceGraph.getResourceGraph.nodes[0],
                    ])
                ),
                graphql.query('GetResourceGraph', ({variables}) => {
                    const {
                        pagination: {start},
                    } = variables;

                    const {
                        getResourceGraph: {nodes, edges},
                    } = sqsLambdaResourceGraph;

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
                    return HttpResponse.json({data: sqsLambdaResourceGraph});
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

            cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

            cy.findByRole('combobox', {name: /name/i}).type(
                'ExportToMyApplicationsUnprocessedTestDiagram'
            );

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {
                level: 2,
                name: /ExportToMyApplicationsUnprocessedTestDiagram/,
            });

            cy.findByRole('button', {name: /Resource search bar/i}).click();

            cy.findByRole('combobox').type('lambda');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{enter}');

            cy.findByRole('button', {name: /Add to diagram/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /save/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /diagram/i}).click();

            cy.findByRole('menuitem', {name: /export/i}).click({force: true});

            cy.findByRole('radio', {name: /myapplications/i}).click();

            cy.findByRole('button', {name: /account/i}).click();
            cy.findByRole('option', {name: /xxxxxxxxxxxx/i}).click();

            cy.findByRole('button', {name: /region/i}).click();
            cy.findByRole('option', {name: /eu-west-1/i}).click();

            cy.findByRole('form', {name: 'export'}).within(() => {
                cy.findByRole('button', {name: /export/i}).click();
            });

            cy.findByText(/Application created/i);

            cy.findByText(
                'The application named ExportToMyApplicationsUnprocessedTestDiagram has been created. However, the following resources were not added: arn:aws:lambda:eu-west-1:xxxxxxxxxxxx:function:sqs'
            );
        });
    });

    it('should return error if application with same name exists', () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        cy.mount(<App />).then(() => {
            const {worker, graphql} = window.msw;

            worker.use(
                graphql.query(
                    'SearchResources',
                    createSearchResourceHandler([
                        sqsLambdaResourceGraph.getResourceGraph.nodes[0],
                    ])
                ),
                graphql.query('GetResourceGraph', ({variables}) => {
                    const {
                        pagination: {start},
                    } = variables;

                    const {
                        getResourceGraph: {nodes, edges},
                    } = sqsLambdaResourceGraph;

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
                    return HttpResponse.json({data: sqsLambdaResourceGraph});
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
                                locations: [
                                    {line: 2, column: 3, sourceName: null},
                                ],
                                message: `An application with the name ${name} already exists.`,
                            },
                        ],
                    });
                })
            );

            cy.findByRole('link', {name: /Manage$/, hidden: true}).click();

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {level: 2, name: /Create Diagram/i});

            cy.findByRole('combobox', {name: /name/i}).type(
                'ExportToMyApplicationsExistsTestDiagram'
            );

            cy.findByRole('button', {name: /create/i}).click();

            cy.findByRole('heading', {
                level: 2,
                name: /ExportToMyApplicationsExistsTestDiagram/,
            });

            cy.findByRole('button', {name: /Resource search bar/i}).click();

            cy.findByRole('combobox').type('lambda');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{downArrow}');

            cy.findByRole('combobox').type('{enter}');

            cy.findByRole('button', {name: /Add to diagram/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /save/i}).click();

            cy.findByRole('button', {name: /action/i}).click();

            cy.findByRole('menuitem', {name: /diagram/i}).click();

            cy.findByRole('menuitem', {name: /export/i}).click({force: true});

            cy.findByRole('radio', {name: /myapplications/i}).click();

            cy.findByRole('button', {name: /account/i}).click();
            cy.findByRole('option', {name: /xxxxxxxxxxxx/i}).click();

            cy.findByRole('button', {name: /region/i}).click();
            cy.findByRole('option', {name: /eu-west-1/i}).click();

            cy.findByRole('form', {name: 'export'}).within(() => {
                cy.findByRole('button', {name: /export/i}).click();
            });

            cy.findByText(
                'An application with the name ExportToMyApplicationsExistsTestDiagram already exists.'
            );
        });
    });
});
