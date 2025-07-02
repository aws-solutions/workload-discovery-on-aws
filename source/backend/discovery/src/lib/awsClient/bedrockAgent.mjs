import {
    BedrockAgent,
    BedrockAgentClient,
    paginateListAgents,
    paginateListKnowledgeBases,
    paginateListDataSources,
    paginateListAgentVersions,
    paginateListAgentKnowledgeBases,
} from '@aws-sdk/client-bedrock-agent';
import {createThrottler, throttledPaginator} from '../awsClient.mjs';
import {customUserAgent} from '../config.mjs';

export function createBedrockAgentClient(credentials, region) {
    const bedrockAgentClient = new BedrockAgent({customUserAgent, region, credentials});

    const bedrockAgentPaginatorConfig = {
        client: new BedrockAgentClient({customUserAgent, region, credentials}),
        pageSize: 250,
    };

    const bedrockListAgentsThrottler = createThrottler(
        'bedrockListAgentsThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const bedrockListKnowledgeBasesThrottler = createThrottler(
        'bedrockListKnowledgeBasesThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const bedrockListDataSourcesThrottler = createThrottler(
        'bedrockListDataSourcesThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const bedrockGetAgentThrottler = createThrottler(
        'bedrockGetAgentThrottler',
        credentials,
        region,
        {
            limit: 4,
            interval: 1000,
        },
    );

    const bedrockListAgentVersionsThrottler = createThrottler(
        'bedrockListAgentVersionsThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const bedrockListAgentKnowledgeBasesThrottler = createThrottler(
        'bedrockListAgentKnowledgeBasesThrottler',
        credentials,
        region,
        {
            limit: 5,
            interval: 1000,
        },
    );

    const getAgent = bedrockGetAgentThrottler((agentId) => {
        return bedrockAgentClient.getAgent({agentId});
    });

    return {
        async getAllAgents() {
            const listAgentsPaginator = paginateListAgents(bedrockAgentPaginatorConfig, {
                maxResults: 250,
            });

            const agents = [];

            for await (const {agentSummaries} of throttledPaginator(
                bedrockListAgentsThrottler,
                listAgentsPaginator,
            )) {
                // Process agents serially to reduce chances of rate limiting
                for (const {agentId} of agentSummaries) {
                    const {agent} = await getAgent(agentId);
                    agents.push(agent);
                }
            }

            return agents;
        },
        async getAllKnowledgeBases() {
            const listKnowledgeBasesPaginator = paginateListKnowledgeBases(bedrockAgentPaginatorConfig, {
                maxResults: 250,
            });

            const knowledgeBases = [];

            for await (const {knowledgeBaseSummaries} of throttledPaginator(
                bedrockListKnowledgeBasesThrottler,
                listKnowledgeBasesPaginator,
            )) {
                // Process knowledge bases serially to reduce chances of rate limiting
                for (const {knowledgeBaseId} of knowledgeBaseSummaries) {
                    const {knowledgeBase} = await bedrockAgentClient.getKnowledgeBase({knowledgeBaseId});
                    knowledgeBases.push(knowledgeBase);
                }
            }

            return knowledgeBases;
        },
        async getAllDataSources(knowledgeBaseId) {
            const listDataSourcesPaginator = paginateListDataSources(bedrockAgentPaginatorConfig, {
                knowledgeBaseId,
                maxResults: 250,
            });

            const dataSources = [];

            for await (const {dataSourceSummaries} of throttledPaginator(
                bedrockListDataSourcesThrottler,
                listDataSourcesPaginator,
            )) {
                // Process data sources serially to reduce chances of rate limiting
                for (const {dataSourceId} of dataSourceSummaries) {
                    const {dataSource} = await bedrockAgentClient.getDataSource({knowledgeBaseId, dataSourceId});
                    dataSources.push(dataSource);
                }
            }

            return dataSources;
        },
        async getAllAgentVersions(agentId) {
            const listAgentVersionsPaginator = paginateListAgentVersions(bedrockAgentPaginatorConfig, {
                agentId,
                maxResults: 250,
            });

            const agentVersions = [];

            for await (const {agentVersionSummaries} of throttledPaginator(
                bedrockListAgentVersionsThrottler,
                listAgentVersionsPaginator,
            )) {
                agentVersions.push(...agentVersionSummaries);
            }

            return agentVersions;
        },
        async getAllAgentKnowledgeBases(agentId, agentVersion) {
            const listAgentKnowledgeBasesPaginator = paginateListAgentKnowledgeBases(bedrockAgentPaginatorConfig, {
                agentId,
                agentVersion,
                maxResults: 250,
            });

            const agentKnowledgeBases = [];

            for await (const {agentKnowledgeBaseSummaries} of throttledPaginator(
                bedrockListAgentKnowledgeBasesThrottler,
                listAgentKnowledgeBasesPaginator,
            )) {
                agentKnowledgeBases.push(...agentKnowledgeBaseSummaries.map(x => x.knowledgeBaseId));
            }

            return agentKnowledgeBases;
        },
    };
}