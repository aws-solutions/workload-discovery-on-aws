// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor, within} from '@testing-library/react';
import ExportDiagramModal from '../../../../../../../components/Diagrams/Draw/Canvas/Export/ExportDiagramModal';
import {QueryClient, QueryClientProvider} from 'react-query';
import {createMemoryHistory} from 'history';
import {Route, Router} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {server} from '../../../../../../mocks/server';
import {graphql, HttpResponse} from 'msw';
import {NotificationProvider} from '../../../../../../../components/Contexts/NotificationContext';
import {regionMap} from '../../../../../../../Utils/Dictionaries/RegionMap';
import * as R from 'ramda';
import {withResolvers} from '../../../../../testUtils';

const regions = R.reject(x => x.id === 'global', regionMap).map(x => x.id);

const EU_WEST_1 = 'eu-west-1';
const EU_WEST_2 = 'eu-west-2';
const US_EAST_1 = 'us-east-1';

const ACCOUNT_ID_1 = '111111111111';
const ACCOUNT_ID_2 = '222222222222';
const ACCOUNT_ID_3 = '333333333333';

describe('Export', () => {
    function renderModal(component, diagramTitle = 'myDiagram') {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    refetchInterval: 60000,
                    refetchOnWindowFocus: false,
                    retry: 1,
                },
            },
        });

        const history = createMemoryHistory();
        history.location = {
            pathname: `/diagrams/private/${diagramTitle}`,
        };

        const container = render(
            <QueryClientProvider client={queryClient}>
                <NotificationProvider>
                    <Router history={history}>
                        <Route
                            exact
                            title={'Open diagram'}
                            path={'/diagrams/:visibility/:name'}
                            key={'Open diagram'}
                        >
                            {component}
                        </Route>
                    </Router>
                </NotificationProvider>
            </QueryClientProvider>
        );

        return {user: userEvent.setup(), container, history};
    }

    const elements = {
        nodes: [
            {
                data: {
                    id: 'arn:s3BucketArn',
                    type: 'resource',
                    properties: {
                        accountId: ACCOUNT_ID_1,
                        awsRegion: EU_WEST_1,
                        resourceType: 'AWS::S3::Bucket',
                    },
                },
            },
            {
                data: {
                    id: 'arn:s3BucketArn1',
                    type: 'resource',
                    properties: {
                        accountId: ACCOUNT_ID_1,
                        awsRegion: EU_WEST_1,
                        resourceType: 'AWS::S3::Bucket',
                    },
                },
            },
            {
                data: {
                    id: 'arn:s3BucketArn1',
                    type: 'resource',
                    properties: {
                        accountId: ACCOUNT_ID_2,
                        awsRegion: EU_WEST_1,
                        resourceType: 'AWS::S3::Bucket',
                    },
                },
            },
            {
                data: {
                    id: 'arn:ec2InstanceArn1',
                    type: 'resource',
                    properties: {
                        accountId: ACCOUNT_ID_2,
                        awsRegion: EU_WEST_2,
                        resourceType: 'AWS::EC2::Instance',
                    },
                },
            },
            {
                data: {
                    id: 'arn:lambdaArn1',
                    type: 'resource',
                    properties: {
                        accountId: ACCOUNT_ID_3,
                        awsRegion: EU_WEST_1,
                        resourceType: 'AWS::Lambda::Function',
                    },
                },
            },
            {
                data: {
                    id: 'arn:lambdaArn1',
                    type: 'resource',
                    properties: {
                        accountId: ACCOUNT_ID_3,
                        awsRegion: EU_WEST_2,
                        resourceType: 'AWS::Lambda::Function',
                    },
                },
            },
            {
                data: {
                    id: 'arn:snsTopicArn1',
                    type: 'resource',
                    properties: {
                        accountId: ACCOUNT_ID_3,
                        awsRegion: US_EAST_1,
                        resourceType: 'AWS::SNS::Topic',
                    },
                },
            },
        ],
        edges: [],
    };

    describe('Export to myApplication', () => {
        it('should not be possible to create an application without providing a name, account ID and region', async () => {
            const {user} = renderModal(
                <ExportDiagramModal
                    canvas={vi.fn()}
                    elements={elements}
                    visible={true}
                    onDismiss={vi.fn()}
                    settings={{hideEdges: false}}
                ></ExportDiagramModal>
            );

            const myApplicationsRadioButton = await screen.findByRole('radio', {
                name: /myapplications/i,
            });

            await user.click(myApplicationsRadioButton);

            const applicationNameTextBox = screen.getByRole('textbox', {
                name: /application name/i,
            });
            expect(applicationNameTextBox).toHaveValue('myDiagram');

            const exportForm = screen.getByRole('form', {name: 'export'});

            const exportButton = within(exportForm).getByRole('button', {
                name: /export/i,
            });
            await waitFor(() => expect(exportButton).toBeDisabled());

            await user.click(screen.getByRole('button', {name: /account/i}));
            await user.click(
                screen.getByRole('option', {name: /111111111111/i})
            );

            await waitFor(() => expect(exportButton).toBeDisabled());

            await user.click(screen.getByRole('button', {name: /region/i}));
            await user.click(screen.getByRole('option', {name: /eu-west-1/i}));

            await waitFor(() => expect(exportButton).toBeEnabled());
        });

        it('should transform the diagram name to a suitable default application name', async () => {
            const applicationName = 'name-with-spaces';

            const {promise: namePromise, resolve} = withResolvers();

            server.use(
                graphql.mutation('CreateApplication', ({variables}) => {
                    resolve(variables.name);

                    return HttpResponse.json({
                        data: {
                            createApplication: {
                                applicationTag: 'myApplicationTag',
                                name,
                                unprocessedResources: [],
                            },
                        },
                    });
                })
            );

            const {user} = renderModal(
                <ExportDiagramModal
                    canvas={vi.fn()}
                    elements={elements}
                    visible={true}
                    onDismiss={vi.fn()}
                    settings={{hideEdges: false}}
                ></ExportDiagramModal>,
                'name with spaces'
            );

            const myApplicationsRadioButton = await screen.findByRole('radio', {
                name: /myapplications/i,
            });

            await user.click(myApplicationsRadioButton);

            const nameTextBox = screen.getByRole('textbox', {
                name: /application name/i,
            });
            expect(nameTextBox).toHaveValue('name-with-spaces');

            await user.click(screen.getByRole('button', {name: /account/i}));
            await user.click(
                screen.getByRole('option', {name: /333333333333/i})
            );

            await user.click(screen.getByRole('button', {name: /region/i}));
            await user.click(screen.getByRole('option', {name: /us-east-1/i}));

            const exportForm = screen.getByRole('form', {name: 'export'});
            const exportButton = within(exportForm).getByRole('button', {
                name: /export/i,
            });
            await user.click(exportButton);

            const name = await namePromise;
            await waitFor(() => expect(name).toEqual(applicationName));
        });

        it('should use prevent the user exporting a diagram with an invalid name', async () => {
            const invalidApplicationName = 'Name with spaces';

            const {user} = renderModal(
                <ExportDiagramModal
                    canvas={vi.fn()}
                    elements={elements}
                    visible={true}
                    onDismiss={vi.fn()}
                    settings={{hideEdges: false}}
                ></ExportDiagramModal>
            );

            const myApplicationsRadioButton = await screen.findByRole('radio', {
                name: /myapplications/i,
            });

            await user.click(myApplicationsRadioButton);

            const nameTextBox = screen.getByRole('textbox', {
                name: /application name/i,
            });

            await user.clear(nameTextBox);
            await user.type(nameTextBox, invalidApplicationName);

            await user.click(screen.getByRole('button', {name: /account/i}));
            await user.click(
                screen.getByRole('option', {name: /333333333333/i})
            );

            await user.click(screen.getByRole('button', {name: /region/i}));
            await user.click(screen.getByRole('option', {name: /us-east-1/i}));

            const exportForm = screen.getByRole('form', {name: 'export'});
            const exportButton = within(exportForm).getByRole('button', {
                name: /export/i,
            });
            expect(exportButton).toBeDisabled();
        });

        it('should not show global region in region dropdown list', async () => {
            const iamRoleResource = {
                data: {
                    id: 'arn:roleArn1',
                    type: 'resource',
                    properties: {
                        accountId: ACCOUNT_ID_1,
                        awsRegion: 'global',
                        resourceType: 'AWS::IAM::Role',
                    },
                },
            };

            const {user} = renderModal(
                <ExportDiagramModal
                    canvas={vi.fn()}
                    elements={{nodes: [...elements.nodes, iamRoleResource]}}
                    visible={true}
                    onDismiss={vi.fn()}
                    settings={{hideEdges: false}}
                ></ExportDiagramModal>
            );

            const myApplicationsRadioButton = await screen.findByRole('radio', {
                name: /myapplications/i,
            });

            await user.click(myApplicationsRadioButton);

            await user.click(screen.getByRole('button', {name: /account/i}));
            await user.click(
                screen.getByRole('option', {name: /111111111111/i})
            );

            await user.click(screen.getByRole('button', {name: /region/i}));
            expect(screen.getAllByRole('option')).toHaveLength(1);
            screen.getByRole('option', {name: /eu-west-1/i});
            expect(screen.queryByRole('option', {name: /global/i})).toBeNull();
        });

        it('should only show regions associated with their account', async () => {
            const {user} = renderModal(
                <ExportDiagramModal
                    canvas={vi.fn()}
                    elements={elements}
                    visible={true}
                    onDismiss={vi.fn()}
                    settings={{hideEdges: false}}
                ></ExportDiagramModal>
            );

            const myApplicationsRadioButton = await screen.findByRole('radio', {
                name: /myapplications/i,
            });

            await user.click(myApplicationsRadioButton);

            await user.click(screen.getByRole('button', {name: /account/i}));
            await user.click(
                screen.getByRole('option', {name: /111111111111/i})
            );
            await user.click(screen.getByRole('button', {name: /region/i}));
            expect(screen.getAllByRole('option')).toHaveLength(1);
            screen.getByRole('option', {name: /eu-west-1/i});
            expect(
                screen.queryByRole('option', {name: /eu-west-2/i})
            ).toBeNull();
            expect(
                screen.queryByRole('option', {name: /us-east-1/i})
            ).toBeNull();

            await user.click(
                screen.getByRole('button', {name: /account 111111111111/i})
            );

            await user.click(
                screen.getByRole('option', {name: /222222222222/i})
            );
            await user.click(screen.getByRole('button', {name: /region/i}));
            expect(screen.getAllByRole('option')).toHaveLength(2);
            screen.getByRole('option', {name: /eu-west-1/i});
            screen.getByRole('option', {name: /eu-west-2/i});
            expect(
                screen.queryByRole('option', {name: /us-east-1/i})
            ).toBeNull();

            await user.click(
                screen.getByRole('button', {name: /account 222222222222/i})
            );

            await user.click(
                screen.getByRole('option', {name: /333333333333/i})
            );
            await user.click(screen.getByRole('button', {name: /region/i}));

            expect(screen.getAllByRole('option')).toHaveLength(3);
            screen.getByRole('option', {name: /eu-west-1/i});
            screen.getByRole('option', {name: /eu-west-2/i});
            screen.getByRole('option', {name: /us-east-1/i});
        });

        it('should should filter out pseudo-resource types', async () => {
            const elements = {
                nodes: [
                    {
                        data: {
                            id: 'arn:TagcArn1',
                            type: 'resource',
                            properties: {
                                accountId: ACCOUNT_ID_3,
                                awsRegion: 'global',
                                resourceType: 'AWS::Tags::Tag',
                            },
                        },
                    },
                    {
                        data: {
                            id: 'arn:TagcArn1',
                            type: 'resource',
                            properties: {
                                accountId: ACCOUNT_ID_3,
                                awsRegion: 'global',
                                resourceType: 'AWS::IAM::InlinePolicy',
                            },
                        },
                    },
                    {
                        data: {
                            id: 'arn:s3BucketArn',
                            type: 'resource',
                            properties: {
                                accountId: ACCOUNT_ID_1,
                                awsRegion: EU_WEST_1,
                                resourceType: 'AWS::S3::Bucket',
                            },
                        },
                    },
                ],
            };

            const {promise: resourcesPromise, resolve} = withResolvers();

            server.use(
                graphql.mutation('CreateApplication', ({variables}) => {
                    resolve(variables.resources);

                    return HttpResponse.json({
                        data: {
                            createApplication: {
                                applicationTag: 'myApplicationTag',
                                name,
                                unprocessedResources: [],
                            },
                        },
                    });
                })
            );

            const {user} = renderModal(
                <ExportDiagramModal
                    canvas={vi.fn()}
                    elements={elements}
                    visible={true}
                    onDismiss={vi.fn()}
                    settings={{hideEdges: false}}
                ></ExportDiagramModal>
            );

            const myApplicationsRadioButton = await screen.findByRole('radio', {
                name: /myapplications/i,
            });

            await user.click(myApplicationsRadioButton);

            await user.click(screen.getByRole('button', {name: /account/i}));

            await user.click(
                screen.getByRole('option', {name: /111111111111/i})
            );

            await user.click(screen.getByRole('button', {name: /region/i}));
            await user.click(screen.getByRole('option', {name: EU_WEST_1}));

            const exportForm = screen.getByRole('form', {name: 'export'});
            const exportButton = within(exportForm).getByRole('button', {
                name: /export/i,
            });
            await user.click(exportButton);

            const resources = await resourcesPromise;

            await waitFor(() => {
                expect(resources).toEqual([
                    {
                        id: 'arn:s3BucketArn',
                        accountId: ACCOUNT_ID_1,
                        region: EU_WEST_1,
                    },
                ]);
            });
        });

        it('should should filter out non-resource types and resources with invalid ARNs', async () => {
            const elements = {
                nodes: [
                    {
                        data: {
                            type: 'account',
                        },
                    },
                    {
                        data: {
                            type: 'region',
                        },
                    },
                    {
                        data: {
                            id: 's3BucketInvalidArn',
                            type: 'resource',
                            properties: {
                                accountId: ACCOUNT_ID_1,
                                awsRegion: EU_WEST_1,
                                resourceType: 'AWS::S3::Bucket',
                            },
                        },
                    },
                    {
                        data: {
                            id: 'arn:s3BucketArn',
                            type: 'resource',
                            properties: {
                                accountId: ACCOUNT_ID_1,
                                awsRegion: EU_WEST_1,
                                resourceType: 'AWS::S3::Bucket',
                            },
                        },
                    },
                ],
            };

            const {promise: resourcesPromise, resolve} = withResolvers();

            server.use(
                graphql.mutation('CreateApplication', ({variables}) => {
                    resolve(variables.resources);

                    return HttpResponse.json({
                        data: {
                            createApplication: {
                                applicationTag: 'myApplicationTag',
                                name,
                                unprocessedResources: [],
                            },
                        },
                    });
                })
            );

            const {user} = renderModal(
                <ExportDiagramModal
                    canvas={vi.fn()}
                    elements={elements}
                    visible={true}
                    onDismiss={vi.fn()}
                    settings={{hideEdges: false}}
                ></ExportDiagramModal>
            );

            const myApplicationsRadioButton = await screen.findByRole('radio', {
                name: /myapplications/i,
            });

            await user.click(myApplicationsRadioButton);

            await user.click(screen.getByRole('button', {name: /account/i}));
            await user.click(
                screen.getByRole('option', {name: /111111111111/i})
            );

            await user.click(screen.getByRole('button', {name: /region/i}));
            await user.click(screen.getByRole('option', {name: /eu-west-1/i}));

            const exportForm = screen.getByRole('form', {name: 'export'});
            const exportButton = within(exportForm).getByRole('button', {
                name: /export/i,
            });
            await user.click(exportButton);

            const resources = await resourcesPromise;
            await waitFor(() => {
                expect(resources).toEqual([
                    {
                        id: 'arn:s3BucketArn',
                        accountId: ACCOUNT_ID_1,
                        region: EU_WEST_1,
                    },
                ]);
            });
        });

        it('should export application to myApplications', async () => {
            const {user} = renderModal(
                <ExportDiagramModal
                    canvas={vi.fn()}
                    elements={elements}
                    visible={true}
                    onDismiss={vi.fn()}
                    settings={{hideEdges: false}}
                ></ExportDiagramModal>
            );

            const myApplicationsRadioButton = await screen.findByRole('radio', {
                name: /myapplications/i,
            });

            await user.click(myApplicationsRadioButton);

            await user.click(screen.getByRole('button', {name: /account/i}));
            await user.click(
                screen.getByRole('option', {name: /333333333333/i})
            );

            await user.click(screen.getByRole('button', {name: /region/i}));
            await user.click(screen.getByRole('option', {name: /us-east-1/i}));

            const exportForm = screen.getByRole('form', {name: 'export'});
            const exportButton = within(exportForm).getByRole('button', {
                name: /export/i,
            });
            await user.click(exportButton);
        });
    });
});
