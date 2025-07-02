// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import {mockClient} from 'aws-sdk-client-mock';
import {
    BedrockAgentClient,
    GetAgentCommand,
    GetDataSourceCommand,
    GetKnowledgeBaseCommand,
    ListAgentsCommand,
    ListAgentVersionsCommand,
    ListAgentKnowledgeBasesCommand,
    ListDataSourcesCommand,
    ListKnowledgeBasesCommand,
} from '@aws-sdk/client-bedrock-agent';
import {createAwsClient} from '../../src/lib/awsClient.mjs';

const {createBedrockAgentClient} = createAwsClient();

describe('BedrockAgent Client', () => {
    const mockCredentials = {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
        sessionToken: 'optionalSessionToken',
    };

    const {
        getAllAgents,
        getAllDataSources,
        getAllKnowledgeBases,
        getAllAgentVersions,
        getAllAgentKnowledgeBases,
    } = createBedrockAgentClient(mockCredentials, 'us-east-1');

    describe('getAllAgents', () => {

        it('should get all agents with pagination', async () => {
            const mockBedrockAgentClient = mockClient(BedrockAgentClient);

            const agentSummariesPages = {
                page1: {
                    agentSummaries: [
                        {agentId: 'agent1', agentName: 'Agent 1', agentStatus: 'READY'},
                        {agentId: 'agent2', agentName: 'Agent 2', agentStatus: 'READY'},
                    ],
                    nextToken: 'token1',
                },
                token1: {
                    agentSummaries: [
                        {agentId: 'agent3', agentName: 'Agent 3', agentStatus: 'READY'},
                        {agentId: 'agent4', agentName: 'Agent 4', agentStatus: 'READY'},
                    ],
                    nextToken: 'token2',
                },
                token2: {
                    agentSummaries: [
                        {agentId: 'agent5', agentName: 'Agent 5', agentStatus: 'READY'},
                    ],
                },
            };

            const agentDetails = {
                agent1: {
                    agent: {
                        agentId: 'agent1',
                        agentName: 'Agent 1',
                        description: 'Description for Agent 1',
                    },
                },
                agent2: {
                    agent: {
                        agentId: 'agent2',
                        agentName: 'Agent 2',
                        description: 'Description for Agent 2',
                    },
                },
                agent3: {
                    agent: {
                        agentId: 'agent3',
                        agentName: 'Agent 3',
                        description: 'Description for Agent 3',
                    },
                },
                agent4: {
                    agent: {
                        agentId: 'agent4',
                        agentName: 'Agent 4',
                        description: 'Description for Agent 4',
                    },
                },
                agent5: {
                    agent: {
                        agentId: 'agent5',
                        agentName: 'Agent 5',
                        description: 'Description for Agent 5',
                    },
                },
            };

            mockBedrockAgentClient.on(ListAgentsCommand)
                .callsFake(input => {
                    const {nextToken} = input;
                    if (nextToken) {
                        return agentSummariesPages[nextToken];
                    }
                    return agentSummariesPages['page1'];
                });

            mockBedrockAgentClient.on(GetAgentCommand)
                .callsFake(input => {
                    const {agentId} = input;
                    return agentDetails[agentId];
                });

            const agents = await getAllAgents();

            assert.deepEqual(agents, [
                {
                    agentId: 'agent1',
                    agentName: 'Agent 1',
                    description: 'Description for Agent 1',
                },
                {
                    agentId: 'agent2',
                    agentName: 'Agent 2',
                    description: 'Description for Agent 2',
                },
                {
                    agentId: 'agent3',
                    agentName: 'Agent 3',
                    description: 'Description for Agent 3',
                },
                {
                    agentId: 'agent4',
                    agentName: 'Agent 4',
                    description: 'Description for Agent 4',
                },
                {
                    agentId: 'agent5',
                    agentName: 'Agent 5',
                    description: 'Description for Agent 5',
                },
            ]);
        });

    });

    describe('getAllKnowledgeBases', () => {
        it('should get all knowledge bases with pagination', async () => {
            const mockBedrockAgentClient = mockClient(BedrockAgentClient);

            const knowledgeBaseSummariesPages = {
                page1: {
                    knowledgeBaseSummaries: [
                        {knowledgeBaseId: 'kb1', name: 'Knowledge Base 1', status: 'READY'},
                        {knowledgeBaseId: 'kb2', name: 'Knowledge Base 2', status: 'READY'},
                    ],
                    nextToken: 'token1',
                },
                token1: {
                    knowledgeBaseSummaries: [
                        {knowledgeBaseId: 'kb3', name: 'Knowledge Base 3', status: 'READY'},
                        {knowledgeBaseId: 'kb4', name: 'Knowledge Base 4', status: 'READY'},
                    ],
                    nextToken: 'token2',
                },
                token2: {
                    knowledgeBaseSummaries: [
                        {knowledgeBaseId: 'kb5', name: 'Knowledge Base 5', status: 'READY'},
                    ],
                },
            };

            const knowledgeBaseDetails = {
                kb1: {
                    knowledgeBase: {
                        knowledgeBaseId: 'kb1',
                        name: 'Knowledge Base 1',
                        description: 'Description for Knowledge Base 1',
                    },
                },
                kb2: {
                    knowledgeBase: {
                        knowledgeBaseId: 'kb2',
                        name: 'Knowledge Base 2',
                        description: 'Description for Knowledge Base 2',
                    },
                },
                kb3: {
                    knowledgeBase: {
                        knowledgeBaseId: 'kb3',
                        name: 'Knowledge Base 3',
                        description: 'Description for Knowledge Base 3',
                    },
                },
                kb4: {
                    knowledgeBase: {
                        knowledgeBaseId: 'kb4',
                        name: 'Knowledge Base 4',
                        description: 'Description for Knowledge Base 4',
                    },
                },
                kb5: {
                    knowledgeBase: {
                        knowledgeBaseId: 'kb5',
                        name: 'Knowledge Base 5',
                        description: 'Description for Knowledge Base 5',
                    },
                },
            };

            mockBedrockAgentClient.on(ListKnowledgeBasesCommand)
                .callsFake(input => {
                    const {nextToken} = input;
                    if (nextToken) {
                        return knowledgeBaseSummariesPages[nextToken];
                    }
                    return knowledgeBaseSummariesPages['page1'];
                });

            mockBedrockAgentClient.on(GetKnowledgeBaseCommand)
                .callsFake(input => {
                    const {knowledgeBaseId} = input;
                    return knowledgeBaseDetails[knowledgeBaseId];
                });

            const knowledgeBases = await getAllKnowledgeBases();

            assert.deepEqual(knowledgeBases, [
                {
                    knowledgeBaseId: 'kb1',
                    name: 'Knowledge Base 1',
                    description: 'Description for Knowledge Base 1',
                },
                {
                    knowledgeBaseId: 'kb2',
                    name: 'Knowledge Base 2',
                    description: 'Description for Knowledge Base 2',
                },
                {
                    knowledgeBaseId: 'kb3',
                    name: 'Knowledge Base 3',
                    description: 'Description for Knowledge Base 3',
                },
                {
                    knowledgeBaseId: 'kb4',
                    name: 'Knowledge Base 4',
                    description: 'Description for Knowledge Base 4',
                },
                {
                    knowledgeBaseId: 'kb5',
                    name: 'Knowledge Base 5',
                    description: 'Description for Knowledge Base 5',
                },
            ]);
        });
    });

    describe('getAllDataSources', () => {
        it('should get all data sources for a knowledge base with pagination', async () => {
            const mockBedrockAgentClient = mockClient(BedrockAgentClient);
            const knowledgeBaseId = 'test-kb-id';

            const dataSourceSummariesPages = {
                [`page1-${knowledgeBaseId}`]: {
                    dataSourceSummaries: [
                        {dataSourceId: 'ds1', name: 'Data Source 1', status: 'READY'},
                        {dataSourceId: 'ds2', name: 'Data Source 2', status: 'READY'},
                    ],
                    nextToken: 'token1',
                },
                token1: {
                    dataSourceSummaries: [
                        {dataSourceId: 'ds3', name: 'Data Source 3', status: 'READY'},
                        {dataSourceId: 'ds4', name: 'Data Source 4', status: 'READY'},
                    ],
                    nextToken: 'token2',
                },
                token2: {
                    dataSourceSummaries: [
                        {dataSourceId: 'ds5', name: 'Data Source 5', status: 'READY'},
                    ],
                },
            };

            const dataSourceDetails = {
                [`ds1-${knowledgeBaseId}`]: {
                    dataSource: {
                        dataSourceId: 'ds1',
                        name: 'Data Source 1',
                        description: 'Description for Data Source 1',
                    },
                },
                [`ds2-${knowledgeBaseId}`]: {
                    dataSource: {
                        dataSourceId: 'ds2',
                        name: 'Data Source 2',
                        description: 'Description for Data Source 2',
                    },
                },
                [`ds3-${knowledgeBaseId}`]: {
                    dataSource: {
                        dataSourceId: 'ds3',
                        name: 'Data Source 3',
                        description: 'Description for Data Source 3',
                    },
                },
                [`ds4-${knowledgeBaseId}`]: {
                    dataSource: {
                        dataSourceId: 'ds4',
                        name: 'Data Source 4',
                        description: 'Description for Data Source 4',
                    },
                },
                [`ds5-${knowledgeBaseId}`]: {
                    dataSource: {
                        dataSourceId: 'ds5',
                        name: 'Data Source 5',
                        description: 'Description for Data Source 5',
                    },
                },
            };

            mockBedrockAgentClient.on(ListDataSourcesCommand)
                .callsFake(input => {
                    const {nextToken, knowledgeBaseId} = input;

                    if (nextToken) {
                        return dataSourceSummariesPages[nextToken];
                    }
                    return dataSourceSummariesPages[`page1-${knowledgeBaseId}`];
                });

            mockBedrockAgentClient.on(GetDataSourceCommand)
                .callsFake(input => {
                    const {dataSourceId, knowledgeBaseId: kbId} = input;
                    return dataSourceDetails[`${dataSourceId}-${kbId}`];
                });

            const dataSources = await getAllDataSources(knowledgeBaseId);

            assert.deepEqual(dataSources, [
                {
                    dataSourceId: 'ds1',
                    name: 'Data Source 1',
                    description: 'Description for Data Source 1',
                },
                {
                    dataSourceId: 'ds2',
                    name: 'Data Source 2',
                    description: 'Description for Data Source 2',
                },
                {
                    dataSourceId: 'ds3',
                    name: 'Data Source 3',
                    description: 'Description for Data Source 3',
                },
                {
                    dataSourceId: 'ds4',
                    name: 'Data Source 4',
                    description: 'Description for Data Source 4',
                },
                {
                    dataSourceId: 'ds5',
                    name: 'Data Source 5',
                    description: 'Description for Data Source 5',
                },
            ]);
        });
    });

    describe('getAllAgentVersions', () => {
        it('should get all agent versions with pagination', async () => {
            const mockBedrockAgentClient = mockClient(BedrockAgentClient);
            const agentId = 'test-agent-id';

            const agentVersionSummariesPages = {
                [`page1-${agentId}`]: {
                    agentVersionSummaries: [
                        {agentId, agentVersion: '1', agentName: 'Agent Version 1', agentStatus: 'READY'},
                        {agentId, agentVersion: '2', agentName: 'Agent Version 2', agentStatus: 'READY'},
                    ],
                    nextToken: 'token1',
                },
                token1: {
                    agentVersionSummaries: [
                        {agentId, agentVersion: '3', agentName: 'Agent Version 3', agentStatus: 'READY'},
                        {agentId, agentVersion: '4', agentName: 'Agent Version 4', agentStatus: 'READY'},
                    ],
                    nextToken: 'token2',
                },
                token2: {
                    agentVersionSummaries: [
                        {agentId, agentVersion: '5', agentName: 'Agent Version 5', agentStatus: 'READY'},
                    ],
                },
            };

            mockBedrockAgentClient.on(ListAgentVersionsCommand)
                .callsFake(input => {
                    const {nextToken, agentId} = input;

                    if (nextToken) {
                        return agentVersionSummariesPages[nextToken];
                    }
                    return agentVersionSummariesPages[`page1-${agentId}`];
                });

            const agentVersions = await getAllAgentVersions(agentId);

            assert.deepEqual(agentVersions, [
                {agentId, agentVersion: '1', agentName: 'Agent Version 1', agentStatus: 'READY'},
                {agentId, agentVersion: '2', agentName: 'Agent Version 2', agentStatus: 'READY'},
                {agentId, agentVersion: '3', agentName: 'Agent Version 3', agentStatus: 'READY'},
                {agentId, agentVersion: '4', agentName: 'Agent Version 4', agentStatus: 'READY'},
                {agentId, agentVersion: '5', agentName: 'Agent Version 5', agentStatus: 'READY'},
            ]);
        });
    });

    describe('getAllAgentKnowledgeBases', () => {
        it('should get all agent knowledge bases with pagination', async () => {
            const mockBedrockAgentClient = mockClient(BedrockAgentClient);
            const agentId = 'test-agent-id';
            const agentVersion = 'DRAFT';

            const agentKnowledgeBaseSummariesPages = {
                [`page1-${agentId}-${agentVersion}`]: {
                    agentKnowledgeBaseSummaries: [
                        {
                            knowledgeBaseId: 'kb1',
                            description: 'Knowledge Base 1',
                            knowledgeBaseName: 'Test KB 1',
                        },
                        {
                            knowledgeBaseId: 'kb2',
                            description: 'Knowledge Base 2',
                            knowledgeBaseName: 'Test KB 2',
                        },
                    ],
                    nextToken: 'token1',
                },
                token1: {
                    agentKnowledgeBaseSummaries: [
                        {
                            knowledgeBaseId: 'kb3',
                            description: 'Knowledge Base 3',
                            knowledgeBaseName: 'Test KB 3',
                        },
                        {
                            knowledgeBaseId: 'kb4',
                            description: 'Knowledge Base 4',
                            knowledgeBaseName: 'Test KB 4',
                        },
                    ],
                    nextToken: 'token2',
                },
                token2: {
                    agentKnowledgeBaseSummaries: [
                        {
                            knowledgeBaseId: 'kb5',
                            description: 'Knowledge Base 5',
                            knowledgeBaseName: 'Test KB 5',
                        },
                    ],
                },
            };

            mockBedrockAgentClient.on(ListAgentKnowledgeBasesCommand)
                .callsFake(input => {
                    const {nextToken, agentId, agentVersion} = input;

                    if (nextToken) {
                        return agentKnowledgeBaseSummariesPages[nextToken];
                    }
                    return agentKnowledgeBaseSummariesPages[`page1-${agentId}-${agentVersion}`];
                });

            const agentKnowledgeBases = await getAllAgentKnowledgeBases(agentId, agentVersion);

            assert.deepEqual(agentKnowledgeBases, [
                'kb1',
                'kb2',
                'kb3',
                'kb4',
                'kb5',
            ]);
        });

    });

});