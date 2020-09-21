const config = {
    rootAccountId: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
    cluster: process.env.CLUSTER,
    configAggregator: process.env.CONFIG_AGGREGATOR,
    apiURL: process.env.REST_API_URL,
    graphgQlUrl: process.env.GRAPHQL_API_URL,
    dataPath: process.env.DATA_PATH,
    searchPath: process.env.SEARCH_PATH,
    rootAccountRole: process.env.DISCOVERY_ROLE
};

module.exports = config;
