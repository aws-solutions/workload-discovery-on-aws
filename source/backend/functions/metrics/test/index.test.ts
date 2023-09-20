// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import chai from 'chai';
import {mockClient} from 'aws-sdk-client-mock';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { S3Client, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { handler } from '../src/index';
import { GetParameterCommand, PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const axiosMock = new MockAdapter(axios);
const s3Mock = mockClient(S3Client);
const ssmMock = mockClient(SSMClient);

process.env = {
    ...process.env,
    REGION: "us-east-2",
    costFeatureBucket: "testCostFeatureBucket",
    diagramBucket: "testDiagramBucket",
    GRAPHQL_API_ENDPOINT: "https://mock.appsync-api.us-east-2.amazonaws.com/graphql",
    AWS_ACCESS_KEY_ID: "mock-access-key-id",
    AWS_SECRET_ACCESS_KEY: "mock-secret-access-key-id",
    CROSS_ACCOUNT_DISCOVERY: "AWS_ORGANIZATIONS"
}

beforeEach(() => {
    axiosMock.reset()
    s3Mock.reset()
    ssmMock
})

describe('index.js', () => {
    
    describe('handler', () => {
            it('should send metric data as expected', async () => {
                s3Mock.on(ListObjectsV2Command, {
                    Bucket: process.env.diagramBucket,
                    Prefix: "private/"
                }).resolvesOnce({
                    Contents: [{Key: "test"}, {Key: "test2"}],
                    KeyCount: 2
                })
                s3Mock.on(ListObjectsV2Command,{
                    Bucket: process.env.diagramBucket,
                    Prefix: "public/"
                }).resolvesOnce({
                    Contents: [{Key: "test"}, {Key: "test2"}],
                    KeyCount: 2
                })
                s3Mock.on(HeadObjectCommand, {
                    Bucket: process.env.costFeatureBucket,
                    Key: "aws-programmatic-access-test-object"
                }).resolves({
                    ContentLength: 500
                })
                ssmMock.on(GetParameterCommand, {
                    Name: "/Solutions/WorkloadDiscovery/anonymous_metrics_uuid"
                }).resolvesOnce({
                    Parameter: {
                        Value: "Test"
                    }
                })
                axiosMock.onPost(process.env.GRAPHQL_API_ENDPOINT).reply(200, {
                    data: {
                        getResourcesAccountMetadata: [
                                {
                                  "accountId": "aws",
                                  "count": 31
                                },
                                {
                                  "accountId": "xxxxxxxxxxxx",
                                  "count": 1195
                                }
                        ]
                    }
                })
                axiosMock.onPost('https://metrics.awssolutionsbuilder.com/generic').replyOnce(200)
                await handler();
                chai.expect(axiosMock.history.post.length).to.eql(2)
                let sentData = JSON.parse(axiosMock.history.post[1].data)
                chai.expect(sentData.Data).to.eql({
                    "numberOfDiagrams": 4,
                    "costFeatureEnabled": true,
                    "crossAccountDiscovery": "AWS_ORGANIZATIONS",
                    "numberOfAccounts": 1,
                    "numberOfResources": 1226
                })
        });

        it('should create new UUID when it doesnt exist', async () => {
            s3Mock.on(ListObjectsV2Command, {
                Bucket: process.env.diagramBucket,
                Prefix: "private/"
            }).resolves({
                Contents: [{Key: "test"}, {Key: "test2"}],
                KeyCount: 2
            })
            s3Mock.on(ListObjectsV2Command,{
                Bucket: process.env.diagramBucket,
                Prefix: "public/"
            }).resolves({
                Contents: [{Key: "test"}, {Key: "test2"}],
                KeyCount: 2
            })
            s3Mock.on(HeadObjectCommand, {
                Bucket: process.env.costFeatureBucket,
                Key: "aws-programmatic-access-test-object"
            }).resolves({
                ContentLength: 500
            })
            ssmMock.on(GetParameterCommand, {
                Name: "/Solutions/WorkloadDiscovery/anonymous_metrics_uuid"
            }).rejects({
                name: "ParameterNotFound"
            })
            ssmMock.on(PutParameterCommand, {
                Name: "/Solutions/WorkloadDiscovery/anonymous_metrics_uuid"
            }).resolvesOnce({})

            axiosMock.onPost(process.env.GRAPHQL_API_ENDPOINT).reply(200, {
                data: {
                    getResourcesAccountMetadata: [
                            {
                              "accountId": "aws",
                              "count": 31
                            },
                            {
                              "accountId": "xxxxxxxxxxxx",
                              "count": 1195
                            }
                    ]
                }
            })
            axiosMock.onPost('https://metrics.awssolutionsbuilder.com/generic').replyOnce(200)
            await handler();
            let sentData = JSON.parse(axiosMock.history.post[1].data)
            chai.expect(sentData.UUID).to.not.eql("Test")
    });
})
});