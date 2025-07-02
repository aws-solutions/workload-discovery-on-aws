// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {describe, it, expect} from 'vitest';
import {render, screen, findByText, getByText} from '@testing-library/react';
import CostsPage from '../../../../../components/Costs/QueryBuilder/CostsPage';
import dayjs from 'dayjs';
import {TableWrapper} from '@cloudscape-design/components/test-utils/dom';
import {diagramSettingsReducer} from '../../../../../components/Contexts/Reducers/DiagramSettingsReducer';
import {ResourceProvider} from '../../../../../components/Contexts/ResourceContext';
import {resourceReducer} from '../../../../../components/Contexts/Reducers/ResourceReducer';
import {DiagramSettingsProvider} from '../../../../../components/Contexts/DiagramSettingsContext';
import {NotificationProvider} from '../../../../../components/Contexts/NotificationContext';
import userEvent from '@testing-library/user-event';
import getResourcesByCost from '../../../../mocks/fixtures/getResourcesByCost/default.json';
import getCostForResource from '../../../../mocks/fixtures/getCostForResource/default.json';
import getCostForService from '../../../../mocks/fixtures/getCostForService/default.json';
import {server} from '../../../../mocks/server';
import {graphql, HttpResponse} from 'msw';

const costData = getResourcesByCost['getResourcesByCost'];

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
                    reducer={diagramSettingsReducer}
                >
                    <ResourceProvider
                        initialState={initialResourceState}
                        reducer={resourceReducer}
                    >
                        <CostsPage />
                    </ResourceProvider>
                </DiagramSettingsProvider>
            </NotificationProvider>
        </QueryClientProvider>
    );
}

function verifyTableRow(table, rowNumber, index) {
    let costInfo = costData['costItems'][index];
    expect(table.findBodyCell(rowNumber, 2).getElement().textContent).toBe(
        costInfo['line_item_resource_id'] == ''
            ? costInfo['product_servicename']
            : costInfo['line_item_resource_id']
    );
    expect(table.findBodyCell(rowNumber, 3).getElement().textContent).toBe(
        `$${costInfo['cost']}`
    );
    expect(table.findBodyCell(rowNumber, 4).getElement().textContent).toBe(
        costInfo['line_item_usage_account_id']
    );
    expect(table.findBodyCell(rowNumber, 5).getElement().textContent).toBe(
        costInfo['region']
    );
}

async function verifyOverview(overview, data) {
    const estimatedCostOverview = await findByText(
        overview,
        /Estimated AWS cost/
    );

    const estimatedCost = getByText(
        estimatedCostOverview.parentElement,
        /^\$?[0-9]+(\.[0-9][0-9])?$/
    );

    expect(estimatedCost).toHaveTextContent(`$${data.totalCost}`);

    const awsResourcesOverview = await findByText(overview, /AWS Resources/);

    const awsResourcesCount = getByText(
        awsResourcesOverview.parentElement,
        /\d+/
    );

    expect(awsResourcesCount).toHaveTextContent(
        data['queryDetails']['resultCount']
    );
}

async function verifyDefaultDates(overview) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const fromDateOverview = await findByText(overview, /From/);

    const fromDate = getByText(
        fromDateOverview.parentElement,
        /\b((Mon|Tue|Wed|Thu|Fri|Sat|Sun))\b(.*)/
    );

    expect(fromDate).toHaveTextContent(dayjs(firstDay).format('llll'));

    const toDateOverview = await findByText(overview, /To/);

    const toDate = getByText(
        toDateOverview.parentElement,
        /\b((Mon|Tue|Wed|Thu|Fri|Sat|Sun))\b(.*)/
    );

    expect(toDate).toHaveTextContent(dayjs(lastDay).format('llll'));
}

describe('Costs Page', () => {
    describe('Costs Overview', () => {
        it('should show warning alert when cost feature is not enabled', async () => {
            server.use(
                graphql.query('GetCostReportProcessingStatus', () => {
                    return HttpResponse.json({
                        data: {
                            getCostReportProcessingStatus: {
                                isEnabled: false,
                            },
                        },
                    });
                })
            );

            renderCostsPage();

            await screen.findByText('Not enabled');

            screen.getByLabelText('Cost enabled warning');

            screen.getByText(
                /The workload discovery cost feature is not enabled by default\. you must configure the delivery of your cost & usage reports to the workload discovery cost report bucket in s3\. please follow the steps in the to set up the report delivery\./i
            );

            const documentationLink = screen.getByRole('link', {
                name: /documentation/,
            });
            expect(documentationLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/set-up-the-cost-feature.html'
            );

            screen.getByLabelText('Delivery status: pending');
            screen.getByLabelText('CUR processing status: pending');
        });

        it('should show warning when cost feature is enabled and last report and processing was delivered over 24 hours ago', async () => {
            const staleDateDelivered = dayjs()
                .subtract(2, 'days')
                .toISOString();
            const staleDateProcessed = dayjs()
                .subtract(3, 'days')
                .toISOString();

            const formattedStaleDateDelivered =
                dayjs(staleDateDelivered).format('MMM D, YYYY h:mm A');
            const formattedStaleDateProcessed =
                dayjs(staleDateProcessed).format('MMM D, YYYY h:mm A');

            server.use(
                graphql.query('GetCostReportProcessingStatus', () => {
                    return HttpResponse.json({
                        data: {
                            getCostReportProcessingStatus: {
                                isEnabled: true,
                                reports: {
                                    lastDelivered: staleDateDelivered,
                                    curBucketArn: 'arn:aws:s3:::cost-bucket',
                                },
                                crawler: {
                                    lastCrawled: staleDateProcessed,
                                    logGroupArn: 'arn:aws:logs:crawler-logs',
                                    curProcessorLambdaArn:
                                        'arn:aws:lambda:processor-function',
                                },
                            },
                        },
                    });
                })
            );

            renderCostsPage();

            await screen.findByText('Enabled');

            const costEnabledWarning = screen.queryByLabelText(
                'Cost enabled warning'
            );
            expect(costEnabledWarning).toBeNull();

            await screen.findByLabelText('Delivery status: warning');

            await screen.findByLabelText('Stale delivery warning');
            screen.getByText(formattedStaleDateDelivered);

            await screen.findByLabelText('CUR processing status: warning');
            screen.getByText(formattedStaleDateProcessed);

            screen.getByText(
                /workload discovery has been configured to receive cost & usage reports but has not received a new report in 2 days\. please verify that the is still configured to receive cost reports\. the steps on how to configure report delivery are in the \./i
            );

            const bucketLink = screen.getByRole('link', {
                name: /cost and usage report bucket/i,
            });
            expect(bucketLink).toHaveAttribute(
                'href',
                'https://console.aws.amazon.com/go/view/arn:aws:s3:::cost-bucket'
            );

            const documentationLink = screen.getByRole('link', {
                name: /documentation/,
            });
            expect(documentationLink).toHaveAttribute(
                'href',
                'https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/set-up-the-cost-feature.html'
            );

            await screen.findByLabelText('Stale processing warning');

            screen.getByText(
                /the cost & usage report processor has not run in 3 days\. please check the s3 event trigger is enabled in the \./i
            );

            const processorLambdaLink = screen.getByRole('link', {
                name: /report processor lambda function/i,
            });
            expect(processorLambdaLink).toHaveAttribute(
                'href',
                'https://console.aws.amazon.com/go/view/arn:aws:lambda:processor-function'
            );
        });

        it('should show error when cost feature is enabled, report delivery was successful but there was an error in the crawler', async () => {
            const recentDateDelivered = dayjs()
                .subtract(2, 'hours')
                .toISOString();
            const recentDateProcessed = dayjs()
                .subtract(3, 'hours')
                .toISOString();
            const errorMessage =
                'Failed to process cost data: Access denied to crawler';

            const formattedRecentDateDelivered =
                dayjs(recentDateDelivered).format('MMM D, YYYY h:mm A');
            const formattedRecentDateProcessed =
                dayjs(recentDateProcessed).format('MMM D, YYYY h:mm A');

            server.use(
                graphql.query('GetCostReportProcessingStatus', () => {
                    return HttpResponse.json({
                        data: {
                            getCostReportProcessingStatus: {
                                isEnabled: true,
                                reports: {
                                    lastDelivered: recentDateDelivered,
                                    curBucketArn: 'arn:aws:s3:::cost-bucket',
                                },
                                crawler: {
                                    lastCrawled: recentDateProcessed,
                                    errorMessage: errorMessage,
                                    logGroupArn: 'arn:aws:logs:crawler-logs',
                                    curProcessorLambdaArn:
                                        'arn:aws:lambda:processor-function',
                                },
                            },
                        },
                    });
                })
            );

            renderCostsPage();

            await screen.findByText('Enabled');

            const costEnabledWarning = screen.queryByLabelText(
                'Cost enabled warning'
            );
            expect(costEnabledWarning).toBeNull();

            await screen.findByLabelText('Delivery status: success');
            screen.getByText(formattedRecentDateDelivered);

            const staleDeliveryWarning = screen.queryByLabelText(
                'Stale delivery warning'
            );
            expect(staleDeliveryWarning).toBeNull();

            const staleProcessingWarning = screen.queryByLabelText(
                'Stale processing warning'
            );
            expect(staleProcessingWarning).toBeNull();

            await screen.findByLabelText('CUR processing status: error');
            screen.getByText(formattedRecentDateProcessed);

            screen.getByText(
                /there was an error processing the cost & usage report: \. please check the for more details\./i
            );
            screen.getByText(
                /failed to process cost data: access denied to crawler/i
            );

            const logsLink = screen.getByRole('link', {
                name: /AWS Glue crawler logs/i,
            });
            expect(logsLink).toHaveAttribute(
                'href',
                'https://console.aws.amazon.com/go/view/arn:aws:logs:crawler-logs'
            );
        });

        it('should show success status when cost feature is enabled and there are no issues with report delivery or processing', async () => {
            const recentDateDelivered = dayjs()
                .subtract(2, 'hours')
                .toISOString();
            const recentDateProcessed = dayjs()
                .subtract(3, 'hours')
                .toISOString();

            const formattedRecentDateDelivered =
                dayjs(recentDateDelivered).format('MMM D, YYYY h:mm A');
            const formattedRecentDateProcessed =
                dayjs(recentDateProcessed).format('MMM D, YYYY h:mm A');

            server.use(
                graphql.query('GetCostReportProcessingStatus', () => {
                    return HttpResponse.json({
                        data: {
                            getCostReportProcessingStatus: {
                                isEnabled: true,
                                reports: {
                                    lastDelivered: recentDateDelivered,
                                    curBucketArn: 'arn:aws:s3:::cost-bucket',
                                },
                                crawler: {
                                    lastCrawled: recentDateProcessed,
                                    logGroupArn: 'arn:aws:logs:crawler-logs',
                                    curProcessorLambdaArn:
                                        'arn:aws:lambda:processor-function',
                                },
                            },
                        },
                    });
                })
            );

            renderCostsPage();

            await screen.findByText('Enabled');

            const costEnabledWarning = screen.queryByLabelText(
                'Cost enabled warning'
            );
            expect(costEnabledWarning).toBeNull();

            await screen.findByLabelText('Delivery status: success');
            screen.getByText(formattedRecentDateDelivered);

            await screen.findByLabelText('CUR processing status: success');
            screen.getByText(formattedRecentDateProcessed);

            const staleDeliveryWarning = screen.queryByLabelText(
                'Stale delivery warning'
            );
            expect(staleDeliveryWarning).toBeNull();

            const staleProcessingWarning = screen.queryByLabelText(
                'Stale processing warning'
            );
            expect(staleProcessingWarning).toBeNull();

            const alerts = screen.queryAllByRole('alert');
            expect(alerts).toHaveLength(0);
        });

        it('should display cost data', async () => {
            const user = userEvent.setup();

            renderCostsPage();

            const calculateCostsButton = await screen.findByRole('button', {
                name: /Calculate Costs/i,
            });

            await user.click(calculateCostsButton);

            const Overview = await screen.findByTestId(
                'costs-summary-overview'
            );

            await verifyOverview(Overview, costData);

            await verifyDefaultDates(Overview);
        });
    });

    describe('Costs Table', () => {
        it('should display cost table data', async () => {
            const user = userEvent.setup();

            renderCostsPage();

            const calculateCostsButton = await screen.findByRole('button', {
                name: /Calculate Costs/i,
            });

            await user.click(calculateCostsButton);

            await screen.findByRole('heading', {level: 2, name: /Resources/});

            const resourcesTable = screen.getByRole('table', {
                name: /resources/i,
            });

            const table = new TableWrapper(resourcesTable.parentElement);

            const tableRows = table.findRows();

            expect(tableRows).toHaveLength(10);

            // We pass index + 1 as the rowNumber because findBodyCell starts at index 1.
            tableRows.forEach(function (_, index) {
                verifyTableRow(table, index + 1, index);
            });
        });
    });
});
