const config = {
    rootAccountId: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
    cluster: process.env.CLUSTER,
    configAggregator: process.env.CONFIG_AGGREGATOR,
    graphgQlUrl: process.env.GRAPHQL_API_URL,
    rootAccountRole: process.env.DISCOVERY_ROLE,
    customUserAgent: process.env.CUSTOM_USER_AGENT
};

module.exports = config;
