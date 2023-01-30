const {AWS_ORGANIZATIONS} = require("./constants");

async function finalise(config, apiClient, accountsMap) {
    if(config.crossAccountDiscovery === AWS_ORGANIZATIONS) {
        return apiClient.addCrawledAccounts(Array.from(accountsMap.values()));
    } else {
        return apiClient.updateAccountsCrawledTime(Array.from(accountsMap.keys()));
    }
}

module.exports = {
    finalise
}
