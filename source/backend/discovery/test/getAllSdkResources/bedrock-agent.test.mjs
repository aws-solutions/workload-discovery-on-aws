import {assert, describe, it} from 'vitest';
import * as R from 'ramda';
import {ACCOUNT_X, ACCOUNT_Z, mockAwsClient} from '../getAllSdkResources.test.mjs';
import {credentialsX, credentialsZ} from '../getAllSdkResources.test.mjs';
import * as sdkResources from '../../src/lib/sdkResources/index.mjs';
import {
    AWS_BEDROCK_AGENT, AWS_BEDROCK_AGENT_VERSION, AWS_BEDROCK_DATA_SOURCE,
    AWS_BEDROCK_KNOWLEDGE_BASE, IS_ASSOCIATED_WITH,
    NOT_APPLICABLE,
    RESOURCE_DISCOVERED,
} from '../../src/lib/constants.mjs';
import {generateRandomInt} from '../generator.mjs';

const REGION_EU_WEST_2 = 'eu-west-2';
const REGION_US_WEST_2 = 'us-west-2';

function generateBedrockAgent(region, accountId) {
    const id = `agent-${generateRandomInt(0, 10000)}`;
    return {
        agentId: id,
        agentName: `Agent-${id}`,
        agentArn: `arn:aws:bedrock:${region}:${accountId}:agent/${id}`,
        agentStatus: 'READY',
        promptOverrideConfiguration: {
            promptConfigurations: [
                {
                    basePromptTemplate: 'Should be removed',
                    parserMode: 'DEFAULT',
                    promptCreationMode: 'DEFAULT',
                },
                {
                    basePromptTemplate: 'Should be removed',
                    parserMode: 'ADVANCED',
                    promptCreationMode: 'CUSTOM',
                },
            ],
        },
    };
}

function generateBedrockKnowledgeBase(region, accountId) {
    const id = `kb-${generateRandomInt(0, 10000)}`;
    return {
        knowledgeBaseId: id,
        name: `KnowledgeBase-${id}`,
        knowledgeBaseArn: `arn:aws:bedrock:${region}:${accountId}:knowledge-base/${id}`,
        description: `Description for knowledge base ${id}`,
    };
}

function generateBedrockDataSource(region, accountId, knowledgeBaseId) {
    const id = `ds-${generateRandomInt(0, 10000)}`;
    return {
        dataSourceId: id,
        name: `DataSource-${id}`,
        description: `Description for data source ${id}`,
    };
}

describe('getAllSdkResources - Bedrock Agent', () => {

    const getAllSdkResources = sdkResources.getAllSdkResources(
        new Map([
            [
                ACCOUNT_X,
                {
                    credentials: credentialsX,
                    regions: [REGION_EU_WEST_2],
                },
            ],
            [
                ACCOUNT_Z,
                {
                    credentials: credentialsZ,
                    regions: [REGION_US_WEST_2],
                },
            ],
        ]),
    );

    describe(AWS_BEDROCK_AGENT, () => {

        it('should discover Bedrock agents', async () => {
            const agentEuWest2 = generateBedrockAgent(REGION_EU_WEST_2, ACCOUNT_X);
            const agentUsWest2 = generateBedrockAgent(REGION_US_WEST_2, ACCOUNT_Z);

            const mockBedrockAgentClient = {
                createBedrockAgentClient(credentials, region) {
                    return {
                        getAllAgents() {
                            if (R.equals(credentials, credentialsX) && region === REGION_EU_WEST_2) {
                                return [agentEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === REGION_US_WEST_2) {
                                return [agentUsWest2];
                            } else {
                                return [];
                            }
                        },
                        getAllDataSources() {
                            return [];
                        },
                        getAllKnowledgeBases() {
                            return [];
                        },
                        getAllAgentVersions() {
                            return [];
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockBedrockAgentClient},
                [],
            );

            const agentEuWest2Arn = agentEuWest2.agentArn;
            const agentUsWest2Arn = agentUsWest2.agentArn;

            const actualAgentEuWest2 = actual.find(x => x.arn === agentEuWest2Arn);
            const actualAgentUsWest2 = actual.find(x => x.arn === agentUsWest2Arn);

            const expectedRedactedPromptConfigurationsEuWest2 =
                agentEuWest2.promptOverrideConfiguration.promptConfigurations.map(R.omit(['basePromptTemplate']));

            const expectedRedactedPromptConfigurationsUsWest2 =
                agentUsWest2.promptOverrideConfiguration.promptConfigurations.map(R.omit(['basePromptTemplate']));

            assert.deepEqual(actualAgentEuWest2, {
                id: agentEuWest2Arn,
                accountId: ACCOUNT_X,
                arn: agentEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: REGION_EU_WEST_2,
                configuration: {
                    ...agentEuWest2,
                    promptOverrideConfiguration: {
                        ...agentEuWest2.promptOverrideConfiguration,
                        promptConfigurations: expectedRedactedPromptConfigurationsEuWest2,
                    },
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: agentEuWest2.agentId,
                resourceName: agentEuWest2.agentName,
                resourceType: AWS_BEDROCK_AGENT,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualAgentUsWest2, {
                id: agentUsWest2Arn,
                accountId: ACCOUNT_Z,
                arn: agentUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: REGION_US_WEST_2,
                configuration: {
                    ...agentUsWest2,
                    promptOverrideConfiguration: {
                        ...agentUsWest2.promptOverrideConfiguration,
                        promptConfigurations: expectedRedactedPromptConfigurationsUsWest2,
                    },
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: agentUsWest2.agentId,
                resourceName: agentUsWest2.agentName,
                resourceType: AWS_BEDROCK_AGENT,
                tags: [],
                relationships: [],
            });
        });

    });

    describe(AWS_BEDROCK_KNOWLEDGE_BASE, () => {

        it('should discover Bedrock knowledge bases', async () => {
            const kbEuWest2 = generateBedrockKnowledgeBase(REGION_EU_WEST_2, ACCOUNT_X);
            const kbUsWest2 = generateBedrockKnowledgeBase(REGION_US_WEST_2, ACCOUNT_Z);

            const mockBedrockAgentClient = {
                createBedrockAgentClient(credentials, region) {
                    return {
                        getAllKnowledgeBases() {
                            if (R.equals(credentials, credentialsX) && region === REGION_EU_WEST_2) {
                                return [kbEuWest2];
                            } else if (R.equals(credentials, credentialsZ) && region === REGION_US_WEST_2) {
                                return [kbUsWest2];
                            } else {
                                return [];
                            }
                        },
                        getAllDataSources() {
                            return [];
                        },
                        getAllAgents() {
                            return [];
                        },
                        getAllAgentVersions() {
                            return [];
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockBedrockAgentClient},
                [],
            );

            const kbEuWest2Arn = kbEuWest2.knowledgeBaseArn;
            const kbUsWest2Arn = kbUsWest2.knowledgeBaseArn;

            const actualKbEuWest2 = actual.find(x => x.arn === kbEuWest2Arn);
            const actualKbUsWest2 = actual.find(x => x.arn === kbUsWest2Arn);

            assert.deepEqual(actualKbEuWest2, {
                id: kbEuWest2Arn,
                accountId: ACCOUNT_X,
                arn: kbEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: REGION_EU_WEST_2,
                configuration: kbEuWest2,
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: kbEuWest2.knowledgeBaseId,
                resourceName: kbEuWest2.name,
                resourceType: AWS_BEDROCK_KNOWLEDGE_BASE,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualKbUsWest2, {
                id: kbUsWest2Arn,
                accountId: ACCOUNT_Z,
                arn: kbUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: REGION_US_WEST_2,
                configuration: kbUsWest2,
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: kbUsWest2.knowledgeBaseId,
                resourceName: kbUsWest2.name,
                resourceType: AWS_BEDROCK_KNOWLEDGE_BASE,
                tags: [],
                relationships: [],
            });
        });
    });

    describe(AWS_BEDROCK_DATA_SOURCE, () => {
        it('should discover data sources for knowledge bases', async () => {
            // Create knowledge bases
            const kbEuWest2 = generateBedrockKnowledgeBase(REGION_EU_WEST_2, ACCOUNT_X);
            const kbUsWest2 = generateBedrockKnowledgeBase(REGION_US_WEST_2, ACCOUNT_Z);

            // Create one data source for each knowledge base
            const dsEuWest2 = generateBedrockDataSource(REGION_EU_WEST_2, ACCOUNT_X, kbEuWest2.knowledgeBaseId);
            const dsUsWest2 = generateBedrockDataSource(REGION_US_WEST_2, ACCOUNT_Z, kbUsWest2.knowledgeBaseId);

            // Create knowledge base resources to pass to getAllSdkResources
            const kbResources = [
                {
                    id: kbEuWest2.knowledgeBaseArn,
                    accountId: ACCOUNT_X,
                    arn: kbEuWest2.knowledgeBaseArn,
                    awsRegion: REGION_EU_WEST_2,
                    resourceId: kbEuWest2.knowledgeBaseId,
                    resourceName: kbEuWest2.name,
                    resourceType: AWS_BEDROCK_KNOWLEDGE_BASE,
                    configuration: kbEuWest2,
                },
                {
                    id: kbUsWest2.knowledgeBaseArn,
                    accountId: ACCOUNT_Z,
                    arn: kbUsWest2.knowledgeBaseArn,
                    awsRegion: REGION_US_WEST_2,
                    resourceId: kbUsWest2.knowledgeBaseId,
                    resourceName: kbUsWest2.name,
                    resourceType: AWS_BEDROCK_KNOWLEDGE_BASE,
                    configuration: kbUsWest2,
                },
            ];

            const mockBedrockAgentClient = {
                createBedrockAgentClient(credentials, region) {
                    return {
                        getAllAgents() {
                            return [];
                        },
                        getAllKnowledgeBases() {
                            return [];
                        },
                        getAllAgentVersions() {
                            return [];
                        },
                        getAllDataSources(knowledgeBaseId) {
                            if (R.equals(credentials, credentialsX) &&
                                region === REGION_EU_WEST_2 &&
                                knowledgeBaseId === kbEuWest2.knowledgeBaseId) {
                                return [dsEuWest2];
                            } else if (R.equals(credentials, credentialsZ) &&
                                region === REGION_US_WEST_2 &&
                                knowledgeBaseId === kbUsWest2.knowledgeBaseId) {
                                return [dsUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockBedrockAgentClient},
                kbResources,
            );

            const dsEuWest2Arn = `arn:aws:bedrock:${REGION_EU_WEST_2}:${ACCOUNT_X}:data-source/${dsEuWest2.dataSourceId}`;
            const dsUsWest2Arn = `arn:aws:bedrock:${REGION_US_WEST_2}:${ACCOUNT_Z}:data-source/${dsUsWest2.dataSourceId}`;

            const actualDsEuWest2 = actual.find(x => x.arn === dsEuWest2Arn);
            const actualDsUsWest2 = actual.find(x => x.arn === dsUsWest2Arn);

            assert.deepEqual(actualDsEuWest2, {
                id: dsEuWest2Arn,
                accountId: ACCOUNT_X,
                arn: dsEuWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: REGION_EU_WEST_2,
                configuration: dsEuWest2,
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: dsEuWest2.dataSourceId,
                resourceName: dsEuWest2.name,
                resourceType: AWS_BEDROCK_DATA_SOURCE,
                tags: [],
                relationships: [],
            });

            assert.deepEqual(actualDsUsWest2, {
                id: dsUsWest2Arn,
                accountId: ACCOUNT_Z,
                arn: dsUsWest2Arn,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: REGION_US_WEST_2,
                configuration: dsUsWest2,
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: dsUsWest2.dataSourceId,
                resourceName: dsUsWest2.name,
                resourceType: AWS_BEDROCK_DATA_SOURCE,
                tags: [],
                relationships: [],
            });
        });
    });

    describe(AWS_BEDROCK_AGENT_VERSION, () => {
        it('should discover agent versions for Bedrock agents', async () => {
            // Create agents
            const agentEuWest2 = generateBedrockAgent(REGION_EU_WEST_2, ACCOUNT_X);
            const agentUsWest2 = generateBedrockAgent(REGION_US_WEST_2, ACCOUNT_Z);

            // Generate agent versions
            const agentVersionEuWest2 = {
                agentVersion: '1',
                agentName: agentEuWest2.agentName,
                agentStatus: 'READY',
            };

            const agentVersionUsWest2 = {
                agentVersion: '2',
                agentName: agentUsWest2.agentName,
                agentStatus: 'READY',
            };

            // Create agent resources to pass to getAllSdkResources
            const agentResources = [
                {
                    id: agentEuWest2.agentArn,
                    accountId: ACCOUNT_X,
                    arn: agentEuWest2.agentArn,
                    awsRegion: REGION_EU_WEST_2,
                    resourceId: agentEuWest2.agentId,
                    resourceName: agentEuWest2.agentName,
                    resourceType: AWS_BEDROCK_AGENT,
                    configuration: agentEuWest2,
                },
                {
                    id: agentUsWest2.agentArn,
                    accountId: ACCOUNT_Z,
                    arn: agentUsWest2.agentArn,
                    awsRegion: REGION_US_WEST_2,
                    resourceId: agentUsWest2.agentId,
                    resourceName: agentUsWest2.agentName,
                    resourceType: AWS_BEDROCK_AGENT,
                    configuration: agentUsWest2,
                },
            ];

            const mockBedrockAgentClient = {
                createBedrockAgentClient(credentials, region) {
                    return {
                        getAllAgents() {
                            return [];
                        },
                        getAllKnowledgeBases() {
                            return [];
                        },
                        getAllDataSources() {
                            return [];
                        },
                        getAllAgentVersions(agentId) {
                            if (R.equals(credentials, credentialsX) &&
                                region === REGION_EU_WEST_2 &&
                                agentId === agentEuWest2.agentId) {
                                return [agentVersionEuWest2];
                            } else if (R.equals(credentials, credentialsZ) &&
                                region === REGION_US_WEST_2 &&
                                agentId === agentUsWest2.agentId) {
                                return [agentVersionUsWest2];
                            } else {
                                return [];
                            }
                        },
                    };
                },
            };

            const actual = await getAllSdkResources(
                {...mockAwsClient, ...mockBedrockAgentClient},
                agentResources,
            );

            const versionResourceIdEuWest2 = `${agentEuWest2.agentId}:${agentVersionEuWest2.agentVersion}`;
            const versionResourceIdUsWest2 = `${agentUsWest2.agentId}:${agentVersionUsWest2.agentVersion}`;

            const versionArnEuWest2 = `arn:aws:bedrock:${REGION_EU_WEST_2}:${ACCOUNT_X}:agentversion/${versionResourceIdEuWest2}`;
            const versionArnUsWest2 = `arn:aws:bedrock:${REGION_US_WEST_2}:${ACCOUNT_Z}:agentversion/${versionResourceIdUsWest2}`;

            const actualVersionEuWest2 = actual.find(x => x.resourceId === versionResourceIdEuWest2);
            const actualVersionUsWest2 = actual.find(x => x.resourceId === versionResourceIdUsWest2);

            assert.deepEqual(actualVersionEuWest2, {
                id: versionArnEuWest2,
                accountId: ACCOUNT_X,
                arn: versionArnEuWest2,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: REGION_EU_WEST_2,
                configuration: {
                    agentId: agentEuWest2.agentId,
                    ...agentVersionEuWest2
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: versionResourceIdEuWest2,
                resourceName: agentEuWest2.agentName,
                resourceType: AWS_BEDROCK_AGENT_VERSION,
                tags: [],
                relationships: [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        arn: agentEuWest2.agentArn,
                    },
                ],
            });

            assert.deepEqual(actualVersionUsWest2, {
                id: versionArnUsWest2,
                accountId: ACCOUNT_Z,
                arn: versionArnUsWest2,
                availabilityZone: NOT_APPLICABLE,
                awsRegion: REGION_US_WEST_2,
                configuration: {
                    agentId: agentUsWest2.agentId,
                    ...agentVersionUsWest2
                },
                configurationItemStatus: RESOURCE_DISCOVERED,
                resourceId: versionResourceIdUsWest2,
                resourceName: agentUsWest2.agentName,
                resourceType: AWS_BEDROCK_AGENT_VERSION,
                tags: [],
                relationships: [
                    {
                        relationshipName: IS_ASSOCIATED_WITH,
                        arn: agentUsWest2.agentArn,
                    },
                ],
            });
        });
    });

});