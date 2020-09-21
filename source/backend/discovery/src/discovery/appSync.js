const R = require('ramda');
const axios = require('axios');
const aws4 = require('aws4');

async function sendQuery(opts, name, {query, variables = {}}) {
    const sigOptions = {
        method: 'POST',
        host: opts.host,
        region: opts.region,
        path: opts.path,
        body: JSON.stringify({
            query,
            variables
        }),
        service: 'appsync'
    };

    const sig = aws4.sign(sigOptions, opts.creds);

    return axios({
        url: opts.graphgQlUrl,
        method: 'post',
        headers: sig.headers,
        data: {
            query,
            variables
        }
    }).then(({data}) => {
        if(data.errors != null) throw new Error(JSON.stringify(data.errors));
        return data.data[name];
    });

}

const getAccounts = opts => async () => {
    const name = 'getAccounts';
    const query = `
      query ${name} {
        getAccounts {
          accountId
          regions {
            name
            lastCrawled
          }
        }
      }`;
    return sendQuery(opts, name, {query});
};

const updateRegions = opts => async (accountId, regions) => {
    const name = 'updateRegions';
    const query = `
    mutation ${name}($accountId: String!, $regions: [RegionInput]!) {
      ${name}(accountId: $accountId, regions: $regions) {
        accountId
        regions {
          name
          lastCrawled
        }
      }
    }`;
    const variables = {accountId, regions};
    return sendQuery(opts, name, {query, variables});
};

const updateAccount = opts => async (accountId, lastCrawled) => {
    const name = 'updateAccount';
    const query = `
    mutation ${name}($accountId: String!, $lastCrawled: AWSDateTime) {
      ${name}(accountId: $accountId, lastCrawled: $lastCrawled) {
        accountId
        lastCrawled
      }
    }`;
    const variables = {accountId, lastCrawled};
    return sendQuery(opts, name, {query, variables});
};

module.exports = function(config) {
    const [host, path] = config.graphgQlUrl.replace('https://', '').split('/');

    const opts = {
        host,
        path,
        ...config
    };

    return {
        getAccounts: getAccounts(opts),
        updateRegions: updateRegions(opts),
        updateAccount: updateAccount(opts)
    };
};