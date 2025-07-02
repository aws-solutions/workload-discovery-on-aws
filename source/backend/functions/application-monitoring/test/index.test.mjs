// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, it, vi, beforeEach} from 'vitest';
import {assert} from 'chai';
import {_handler} from '../src/index.mjs';
import {ZodError} from 'zod';

describe('index.js', () => {

    const mockEnv = {
        ACCOUNT_ID: '123456789012',
        APPLICATION_RESOURCE_GROUP: 'test-resource-group',
        AWS_REGION: 'us-east-1',
        DISCOVERY_TASK_FREQUENCY: '15mins',
    };

    const mockAppInsightsClient = {
        async listProblems() {
            return {
                ProblemList: [],
            };
        },
        async describeProblemObservations() {
            return {
                RelatedObservations: {
                    ObservationList: [],
                },
            };
        },
    };

    const mockEvent = {
        info: {
            fieldName: 'getApplicationProblems',
        },
        identity: {
            username: 'iam:f1f5b46a233d4b1f9e70a6465992ec02',
        },
        arguments: {},
    };

    describe('environment validation', () => {

        it('should throw error when account ID is invalid', async () => {
            const invalidEnv = {
                ACCOUNT_ID: 'invalid',
                APPLICATION_RESOURCE_GROUP: 'test-group',
                AWS_REGION: 'us-east-1',
                DISCOVERY_TASK_FREQUENCY: '15mins',
            };

            const handler = _handler(invalidEnv, mockAppInsightsClient);

            return handler(mockEvent)
                .then(() => assert.fail('Expected Zod error was not thrown'))
                .catch(err => {
                    assert.instanceOf(err, ZodError);
                    assert.strictEqual(err.errors[0].message, 'Not a valid AWS account ID.');
                });
        });

        it('should throw error when discovery task frequency is invalid', async () => {
            const invalidEnv = {
                ...mockEnv,
                DISCOVERY_TASK_FREQUENCY: 'invalid-frequency',
            };

            const handler = _handler(invalidEnv, mockAppInsightsClient);

            return handler(mockEvent)
                .then(() => assert.fail('Expected Zod error was not thrown'))
                .catch(err => {
                    assert.instanceOf(err, ZodError);
                    assert.strictEqual(err.errors[0].message, 'Invalid enum value. Expected \'15mins\' | \'1hr\' | \'2hrs\' | \'4hrs\' | \'8hrs\' | \'12hrs\' | \'24hrs\', received \'invalid-frequency\'');
                });
        });
    });

    describe('getApplicationProblems', () => {

        it('should return empty array when no problems exist', async () => {
            const mockAppInsightsClient = {
                async listProblems() {
                    return {
                        ProblemList: [],
                    };
                },
            };

            const handler = _handler(mockEnv, mockAppInsightsClient);
            const result = await handler(mockEvent);

            assert.deepEqual(result, {logProblems: []});
        });

        it('should filter out problems with status other than RECURRING, RECOVERING, or PENDING', async () => {
            const mockAppInsightsClient = {
                async listProblems() {
                    return {
                        ProblemList: [
                            {Id: 'problem1', Status: 'RECURRING'},
                            {Id: 'problem2', Status: 'RESOLVED'},
                            {Id: 'problem3', Status: 'RECOVERING'},
                            {Id: 'problem4', Status: 'IGNORE'},
                            {Id: 'problem5', Status: 'PENDING'},
                        ],
                    };
                },
                async describeProblemObservations(params) {
                    if (params.ProblemId === 'problem1') {
                        return {
                            RelatedObservations: {
                                ObservationList: [
                                    {
                                        SourceType: 'LOG',
                                        SourceARN: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                                        LogGroup: '/aws/lambda/TestFunction',
                                        LogText: 'Some error occurred',
                                        LogFilter: 'Error',
                                    },
                                ],
                            },
                        };
                    } else if (params.ProblemId === 'problem4') {
                        return {
                            RelatedObservations: {
                                ObservationList: [
                                    {
                                        SourceType: 'LOG',
                                        SourceARN: 'arn:aws:lambda:us-east-1:123456789012:function:NotSeen',
                                        LogGroup: '/aws/lambda/NotSeen',
                                        LogText: 'Another error occurred',
                                        LogFilter: 'ShouldNotBeSeen',
                                    },
                                ],
                            },
                        };
                    } else {
                        return {
                            RelatedObservations: {
                                ObservationList: [],
                            },
                        };
                    }
                },
            };

            const handler = _handler(mockEnv, mockAppInsightsClient);
            const result = await handler(mockEvent);

            assert.deepEqual(result, {
                logProblems: [
                    {
                        __typename: "GenericLogProblem",
                        name: 'Error',
                        sourceArn: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                        logGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/lambda/TestFunction',
                    },
                ],
            });
        });

        it('should filter out non-LOG SourceType observations', async () => {
            const mockAppInsightsClient = {
                async listProblems() {
                    return {
                        ProblemList: [
                            {Id: 'problem1', Status: 'RECURRING'},
                        ],
                    };
                },
                async describeProblemObservations() {
                    return {
                        RelatedObservations: {
                            ObservationList: [
                                {
                                    SourceType: 'LOG',
                                    SourceARN: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                                    LogGroup: '/aws/lambda/TestFunction',
                                    LogText: 'Some error occurred',
                                    LogFilter: 'LambdaErrorFilter',
                                },
                                {
                                    SourceType: 'METRIC',
                                    SourceARN: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                                    MetricName: 'Invocations',
                                },
                            ],
                        },
                    };
                },
            };

            const handler = _handler(mockEnv, mockAppInsightsClient);
            const result = await handler(mockEvent);

            assert.deepEqual(result, {
                    logProblems: [
                        {
                            __typename: "GenericLogProblem",
                            name: 'LambdaErrorFilter',
                            sourceArn: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                            logGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/lambda/TestFunction',
                        },
                    ],
                },
            );
        });

        it('should filter out GremlinAppSyncFunction Connection closed prematurely errors', async () => {
            const mockAppInsightsClient = {
                async listProblems() {
                    return {
                        ProblemList: [
                            {Id: 'problem1', Status: 'RECURRING'},
                        ],
                    };
                },
                async describeProblemObservations() {
                    return {
                        RelatedObservations: {
                            ObservationList: [
                                {
                                    SourceType: 'LOG',
                                    SourceARN: 'arn:aws:lambda:us-east-1:123456789012:function:GremlinAppSyncFunction',
                                    LogGroup: '/aws/lambda/GremlinAppSyncFunction',
                                    LogText: 'Connection closed prematurely',
                                    LogFilter: 'GremlinError',
                                },
                                {
                                    SourceType: 'LOG',
                                    SourceARN: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                                    LogGroup: '/aws/lambda/TestFunction',
                                    LogText: 'Some other error occurred',
                                    LogFilter: 'OtherError',
                                },
                            ],
                        },
                    };
                },
            };

            const handler = _handler(mockEnv, mockAppInsightsClient);
            const result = await handler(mockEvent);

            assert.deepEqual(result, {
                logProblems: [
                    {
                        __typename: "GenericLogProblem",
                        name: 'OtherError',
                        sourceArn: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                        logGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/lambda/TestFunction',
                    },
                ],
            });
        });

        it('should extract services field from VpcConfigurationAwsServiceChecks LogText', async () => {
            const mockAppInsightsClient = {
                async listProblems() {
                    return {
                        ProblemList: [
                            { Id: 'problem1', Status: 'RECURRING' },
                        ],
                    };
                },
                async describeProblemObservations() {
                    return {
                        RelatedObservations: {
                            ObservationList: [
                                {
                                    SourceType: 'LOG',
                                    SourceARN: 'arn:aws:ecs:us-east-1:123456789012:cluster/workload-discovery-cluster',
                                    LogGroup: '/ecs/workload-discovery-task',
                                    LogText: '{"level":"error","message":"Could not connect to 2 AWS service(s).", "natGateways": ["nat-11111111111", "nat-2222222222"], "services":["API Gateway", "ECS"],"timestamp":"2025-03-22T08:21:30.788Z"}',
                                    LogFilter: 'VpcConfigurationAwsServiceChecks',
                                },
                                {
                                    SourceType: 'LOG',
                                    SourceARN: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                                    LogGroup: '/aws/lambda/TestFunction',
                                    LogText: 'Some regular log text',
                                    LogFilter: 'RegularFilter',
                                }
                            ],
                        },
                    };
                },
            };

            const handler = _handler(mockEnv, mockAppInsightsClient);
            const result = await handler(mockEvent);

            assert.deepEqual(result, {
                logProblems: [
                    {
                        __typename: "VpcConfigLogProblem",
                        name: 'VpcConfigurationAwsServiceChecks',
                        services: ['API Gateway', 'ECS'],
                        natGateways: ['nat-11111111111', 'nat-2222222222'],
                        sourceArn: 'arn:aws:ecs:us-east-1:123456789012:cluster/workload-discovery-cluster',
                        logGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/ecs/workload-discovery-task',
                    },
                    {
                        __typename: "GenericLogProblem",
                        name: 'RegularFilter',
                        sourceArn: 'arn:aws:lambda:us-east-1:123456789012:function:TestFunction',
                        logGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/lambda/TestFunction',
                    }
                ],
            });
        });

    });

    describe('unknown field', () => {
        it('should reject requests with unknown field name', async () => {
            const unknownEvent = {
                ...mockEvent,
                info: {
                    fieldName: 'unknownField',
                },
            };

            const handler = _handler(mockEnv, mockAppInsightsClient);

            return handler(unknownEvent)
                .catch(error => assert.equal(error.message, 'Unknown field, unable to resolve unknownField.'));

        });
    });
});