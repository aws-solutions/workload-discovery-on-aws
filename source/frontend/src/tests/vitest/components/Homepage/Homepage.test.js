// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {beforeEach, describe, it, vi, expect} from 'vitest';
import {screen} from '@testing-library/react';
import {
    createOrganizationsPerspectiveMetadata,
    createSelfManagedPerspectiveMetadata,
    renderPolarisLayout,
} from '../../testUtils';
import {server} from '../../../mocks/server';
import {graphql, HttpResponse} from 'msw';

describe('Homepage', () => {
    describe('error alerts', () => {
        beforeEach(() => {
            window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

            vi.mock('@aws-amplify/ui-react', async () => {
                const mod = await vi.importActual('@aws-amplify/ui-react');
                return {
                    ...mod,
                    useAuthenticator: () => ({
                        user: {
                            username: 'testUser',
                        },
                        signOut: vi.fn(),
                    }),
                };
            });
        });

        it('should display error alert when discovery process has out of memory error', async () => {
            server.use(
                graphql.query('GetApplicationProblems', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationProblems: {
                                logProblems: [
                                    {
                                        name: 'DiscoveryProcessOutOfMemory',
                                        sourceArn:
                                            'arn:aws:ecs:us-east-1:123456789012:task/default/abcdef12345',
                                        logGroupArn:
                                            'arn:aws:logs:us-east-1:123456789012:log-group:/aws/ecs/containerName:*',
                                    },
                                ],
                            },
                        },
                    });
                })
            );

            renderPolarisLayout();

            await screen.findByLabelText(
                /Discovery process out of memeoy status error/i
            );

            screen.getByText(
                /the ecs task that runs as part of the has exited prematurely with an out of memory error\. you can increase the memory for this task by following \./i
            );

            const discoveryComponentLink = screen.getByRole('link', {
                name: /discovery component/i,
            });

            expect(discoveryComponentLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html'
            );

            const resolutionLink = screen.getByRole('link', {
                name: /the resolution steps in the troubleshooting section of the implementation guide/i,
            });

            expect(resolutionLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/troubleshooting.html#discovery-ecs-task-out-of-memory'
            );
        });

        it('should display UnableToAccessElasticContainerRegistry alert with correct links', async () => {
            server.use(
                graphql.query('GetApplicationProblems', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationProblems: {
                                logProblems: [
                                    {
                                        name: 'UnableToAccessElasticContainerRegistry',
                                        sourceArn:
                                            'arn:aws:ecs:us-east-1:123456789012:task/default/abcdef12345',
                                        logGroupArn:
                                            'arn:aws:logs:us-east-1:123456789012:log-group:/aws/ecs/containerName:*',
                                    },
                                ],
                            },
                        },
                    });
                })
            );

            renderPolarisLayout();

            await screen.findByLabelText(/ECR API connection status error/i);

            await screen.getByText(
                /the encountered an issue connecting to the ECR API endpoint\. ensure that traffic in your VPC can route to this endpoint by following \./i
            );

            const discoveryComponentLink = screen.getByRole('link', {
                name: /discovery component/i,
            });

            expect(discoveryComponentLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html'
            );

            const resolutionLink = screen.getByRole('link', {
                name: /the resolution steps in the troubleshooting section of the implementation guide/i,
            });

            expect(resolutionLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/troubleshooting.html#unable-to-acces-eleastic-container-registry'
            );
        });

        it('should display CannotPullContainerFromRegistry alert with correct links', async () => {
            server.use(
                graphql.query('GetApplicationProblems', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationProblems: {
                                logProblems: [
                                    {
                                        name: 'CannotPullContainerFromRegistry',
                                        sourceArn:
                                            'arn:aws:ecs:us-east-1:123456789012:task/default/abcdef12345',
                                        logGroupArn:
                                            'arn:aws:logs:us-east-1:123456789012:log-group:/aws/ecs/containerName:*',
                                    },
                                ],
                            },
                        },
                    });
                })
            );

            renderPolarisLayout();

            await screen.findByLabelText(
                /ECR Docker API connection status error/i
            );

            await screen.getByText(
                /the encountered an issue connecting to the ECR Docker endpoint\. ensure that traffic in your VPC can route to this endpoint by following \./i
            );

            const discoveryComponentLink = screen.getByRole('link', {
                name: /discovery component/i,
            });

            expect(discoveryComponentLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html'
            );

            const resolutionLink = screen.getByRole('link', {
                name: /the resolution steps in the troubleshooting section of the implementation guide/i,
            });

            expect(resolutionLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/troubleshooting.html#cannot-pull-container-from-registry'
            );
        });

        it('should display VpcConfigurationAwsServiceChecksAlert when no NAT Gateways present', async () => {
            server.use(
                graphql.query('GetApplicationProblems', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationProblems: {
                                logProblems: [
                                    {
                                        logGroupArn:
                                            'arn:aws:logs:eu-west-1:123456789012:log-group:/ecs/workload-discovery-task',
                                        name: 'VpcConfigurationAwsServiceChecks',
                                        services: ['API Gateway', 'ECS'],
                                        natGateways: [],
                                        sourceArn:
                                            'arn:aws:ecs:eu-west-1:123456789012:cluster/workload-discovery-cluster',
                                    },
                                ],
                            },
                        },
                    });
                })
            );

            renderPolarisLayout();

            await screen.findByLabelText(/VPC config check status error/i);

            screen.getByText(
                /the encountered an issue when verifying vpc connectivity to aws services\. the following service api endpoints were not accessible: \. ensure that the vpc fulfils \. this issue is most likely happening because there are no nat gateways configured in the vpc\./i
            );
        });

        it('should display VpcConfigurationAwsServiceChecksAlert when one NAT Gateways present', async () => {
            server.use(
                graphql.query('GetApplicationProblems', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationProblems: {
                                logProblems: [
                                    {
                                        logGroupArn:
                                            'arn:aws:logs:eu-west-1:123456789012:log-group:/ecs/workload-discovery-task',
                                        name: 'VpcConfigurationAwsServiceChecks',
                                        services: ['API Gateway', 'ECS'],
                                        natGateways: [],
                                        sourceArn:
                                            'arn:aws:ecs:eu-west-1:123456789012:cluster/workload-discovery-cluster',
                                    },
                                ],
                            },
                        },
                    });
                })
            );

            renderPolarisLayout();

            await screen.findByLabelText(/VPC config check status error/i);

            screen.getByText(
                /the encountered an issue when verifying vpc connectivity to aws services\. the following service api endpoints were not accessible: \. ensure that the vpc fulfils \. this issue is most likely happening because there are no nat gateways configured in the vpc\./i
            );
        });

        it('should display VpcConfigurationAwsServiceChecksAlert when two NAT Gateways present', async () => {
            server.use(
                graphql.query('GetApplicationProblems', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationProblems: {
                                logProblems: [
                                    {
                                        logGroupArn:
                                            'arn:aws:logs:eu-west-1:123456789012:log-group:/ecs/workload-discovery-task',
                                        name: 'VpcConfigurationAwsServiceChecks',
                                        services: ['API Gateway', 'ECS'],
                                        natGateways: [
                                            'nat-11111111111111111',
                                            'nat-22222222222222222',
                                        ],
                                        sourceArn:
                                            'arn:aws:ecs:eu-west-1:123456789012:cluster/workload-discovery-cluster',
                                    },
                                ],
                            },
                        },
                    });
                })
            );

            renderPolarisLayout();

            await screen.findByLabelText(/VPC config check status error/i);

            screen.getByText(
                /the encountered an issue when verifying vpc connectivity to aws services\. the following service api endpoints were not accessible: \. ensure that the vpc fulfils \./i
            );

            const discoveryComponentLink = screen.getByRole('link', {
                name: /discovery component/i,
            });

            expect(discoveryComponentLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html'
            );

            const preRegDocs = screen.getByRole('link', {
                name: /the pre-requisites described in the documentation/i,
            });

            expect(preRegDocs).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/prerequisites.html#verify-your-vpc-configuration'
            );
        });

        it('should display OrgAggregatorTypeCheckAlert with link to pre-requisite docs', async () => {
            server.use(
                graphql.query('GetApplicationProblems', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationProblems: {
                                logProblems: [
                                    {
                                        name: 'OrgAggregatorTypeCheck',
                                        sourceArn:
                                            'arn:aws:ecs:us-east-1:123456789012:task/default/abcdef12345',
                                        logGroupArn:
                                            'arn:aws:logs:us-east-1:123456789012:log-group:/aws/ecs/containerName:*',
                                    },
                                ],
                            },
                        },
                    });
                })
            );

            renderPolarisLayout();

            await screen.findByLabelText(
                /Invalid config aggregator type error/i
            );

            await screen.getByText(
                /the aws config aggregator supplied to the is not an aws organization wide aggregator\. ensure that the aggregator type fulfils \./i
            );

            const discoveryComponentLink = screen.getByRole('link', {
                name: /discovery component/i,
            });

            expect(discoveryComponentLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/discovery-component.html'
            );

            const preReqDocs = screen.getByRole('link', {
                name: /the pre-requisites described in the documentation/i,
            });

            expect(preReqDocs).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/prerequisites.html#verify-aggregator-type'
            );
        });

        it('should display GenericErrorAlert when no matching error found', async () => {
            server.use(
                graphql.query('GetApplicationProblems', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationProblems: {
                                logProblems: [
                                    {
                                        logGroupArn:
                                            'arn:aws:logs:eu-west-1:123456789012:log-group:/aws/lambda/testLambda',
                                        sourceArn:
                                            'arn:aws:lambda:eu-west-1:123456789012:function:testLambda',
                                        name: 'AWS::GenericError',
                                    },
                                ],
                            },
                        },
                    });
                })
            );

            renderPolarisLayout();

            await screen.findByLabelText(/Generic status error/i);

            screen.getByText(
                /there was an unexpected error, please check the for more information\./i
            );

            const logLink = screen.getByRole('link', {
                name: /logs/i,
            });

            expect(logLink).toHaveAttribute(
                'href',
                'https://console.aws.amazon.com/go/view/arn:aws:logs:eu-west-1:123456789012:log-group:/aws/lambda/testLambda'
            );
        });
    });

    it('should have the base items when not using SSO or Org mode', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();

        vi.mock('@aws-amplify/ui-react', async () => {
            const mod = await vi.importActual('@aws-amplify/ui-react');
            return {
                ...mod,
                useAuthenticator: () => ({
                    user: {
                        username: 'testUser',
                    },
                    signOut: vi.fn(),
                }),
            };
        });

        renderPolarisLayout();

        const importLink = await screen.findByRole('link', {
            name: /Import Accounts/i,
        });
        const createLink = await screen.findByRole('link', {
            name: /Create diagram/i,
        });
        const resourcesLink = await screen.findByRole('link', {
            name: /Search resources/i,
        });

        expect(importLink).toHaveAttribute('href', '/import');
        expect(createLink).toHaveAttribute('href', '/diagrams/create');
        expect(resourcesLink).toHaveAttribute('href', '/resources');
    });

    it('should not have add users item on home page when SSO is enabled', async () => {
        window.perspectiveMetadata = createSelfManagedPerspectiveMetadata();
        window.amplify = {
            Auth: {federatedIdpResource: 'example'},
        };

        vi.mock('@aws-amplify/ui-react', async () => {
            const mod = await vi.importActual('@aws-amplify/ui-react');
            return {
                ...mod,
                useAuthenticator: () => ({
                    user: {
                        username: 'testUser',
                    },
                    signOut: vi.fn(),
                }),
            };
        });

        renderPolarisLayout();

        const importText = screen.queryByText(/Add Users/i);
        expect(importText).toBeNull();

        const importButton = screen.queryByRole('button', {name: /Add Users/i});
        expect(importButton).toBeNull();
    });

    it('should not have import accounts item on home page in organizations mode', async () => {
        window.perspectiveMetadata = createOrganizationsPerspectiveMetadata();

        vi.mock('@aws-amplify/ui-react', async () => {
            const mod = await vi.importActual('@aws-amplify/ui-react');
            return {
                ...mod,
                useAuthenticator: () => ({
                    user: {
                        username: 'testUser',
                    },
                    signOut: vi.fn(),
                }),
            };
        });

        renderPolarisLayout();

        const importText = screen.queryByText(/Import Accounts/i);

        expect(importText).toBeNull();

        const importButton = screen.queryByRole('button', {name: /import/i});
        expect(importButton).toBeNull();
    });
});
