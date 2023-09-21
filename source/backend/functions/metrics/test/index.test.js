"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const aws_sdk_client_mock_1 = require("aws-sdk-client-mock");
const axios_1 = __importDefault(require("axios"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const client_s3_1 = require("@aws-sdk/client-s3");
const index_1 = require("../src/index");
const client_ssm_1 = require("@aws-sdk/client-ssm");
const axiosMock = new axios_mock_adapter_1.default(axios_1.default);
const s3Mock = (0, aws_sdk_client_mock_1.mockClient)(client_s3_1.S3Client);
const ssmMock = (0, aws_sdk_client_mock_1.mockClient)(client_ssm_1.SSMClient);
process.env = Object.assign(Object.assign({}, process.env), { REGION: "us-east-2", costFeatureBucket: "testCostFeatureBucket", diagramBucket: "testDiagramBucket", GRAPHQL_API_ENDPOINT: "https://mock.appsync-api.us-east-2.amazonaws.com/graphql", AWS_ACCESS_KEY_ID: "mock-access-key-id", AWS_SECRET_ACCESS_KEY: "mock-secret-access-key-id", CROSS_ACCOUNT_DISCOVERY: "AWS_ORGANIZATIONS" });
beforeEach(() => {
    axiosMock.reset();
    s3Mock.reset();
    ssmMock;
});
describe('index.js', () => {
    describe('handler', () => {
        it('should send metric data as expected', () => __awaiter(void 0, void 0, void 0, function* () {
            s3Mock.on(client_s3_1.ListObjectsV2Command, {
                Bucket: process.env.diagramBucket,
                Prefix: "private/"
            }).resolvesOnce({
                Contents: [{ Key: "test" }, { Key: "test2" }],
                KeyCount: 2
            });
            s3Mock.on(client_s3_1.ListObjectsV2Command, {
                Bucket: process.env.diagramBucket,
                Prefix: "public/"
            }).resolvesOnce({
                Contents: [{ Key: "test" }, { Key: "test2" }],
                KeyCount: 2
            });
            s3Mock.on(client_s3_1.HeadObjectCommand, {
                Bucket: process.env.costFeatureBucket,
                Key: "aws-programmatic-access-test-object"
            }).resolves({
                ContentLength: 500
            });
            ssmMock.on(client_ssm_1.GetParameterCommand, {
                Name: "/Solutions/WorkloadDiscovery/anonymous_metrics_uuid"
            }).resolvesOnce({
                Parameter: {
                    Value: "Test"
                }
            });
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
            });
            axiosMock.onPost('https://metrics.awssolutionsbuilder.com/generic').replyOnce(200);
            yield (0, index_1.handler)();
            chai_1.default.expect(axiosMock.history.post.length).to.eql(2);
            let sentData = JSON.parse(axiosMock.history.post[1].data);
            chai_1.default.expect(sentData.Data).to.eql({
                "numberOfDiagrams": 4,
                "costFeatureEnabled": true,
                "crossAccountDiscovery": "AWS_ORGANIZATIONS",
                "numberOfAccounts": 1,
                "numberOfResources": 1226
            });
        }));
        it('should create new UUID when it doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
            s3Mock.on(client_s3_1.ListObjectsV2Command, {
                Bucket: process.env.diagramBucket,
                Prefix: "private/"
            }).resolves({
                Contents: [{ Key: "test" }, { Key: "test2" }],
                KeyCount: 2
            });
            s3Mock.on(client_s3_1.ListObjectsV2Command, {
                Bucket: process.env.diagramBucket,
                Prefix: "public/"
            }).resolves({
                Contents: [{ Key: "test" }, { Key: "test2" }],
                KeyCount: 2
            });
            s3Mock.on(client_s3_1.HeadObjectCommand, {
                Bucket: process.env.costFeatureBucket,
                Key: "aws-programmatic-access-test-object"
            }).resolves({
                ContentLength: 500
            });
            ssmMock.on(client_ssm_1.GetParameterCommand, {
                Name: "/Solutions/WorkloadDiscovery/anonymous_metrics_uuid"
            }).rejects({
                name: "ParameterNotFound"
            });
            ssmMock.on(client_ssm_1.PutParameterCommand, {
                Name: "/Solutions/WorkloadDiscovery/anonymous_metrics_uuid"
            }).resolvesOnce({});
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
            });
            axiosMock.onPost('https://metrics.awssolutionsbuilder.com/generic').replyOnce(200);
            yield (0, index_1.handler)();
            let sentData = JSON.parse(axiosMock.history.post[1].data);
            chai_1.default.expect(sentData.UUID).to.not.eql("Test");
        }));
    });
});
