// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const AWS = require('aws-sdk');
const response = require('cfn-response-promise');
const {Client} = require('@opensearch-project/opensearch');
const createAwsOpensearchConnector = require('aws-opensearch-connector');

const domain = process.env.ES_DOMAIN;

const INDEX = 'data';

const osClient = new Client({
    ...createAwsOpensearchConnector(AWS.config),
    node: `https://${domain}`
});

function isClusterHealthy() {
    async function isHealthyRec(count = 0) {
        if(count > 60) return false;
        // OpenSearch clusters with only 1 node (the default config for WD) will only ever have yellow status. The
        // cluster health API here will return for any status above yellow so we cover multi-node clusters too
        const {body: {status}} = await osClient.cluster.health({ level: 'cluster', waitForStatus: 'yellow', timeout: '1s' });
        return ['yellow', 'green'].includes(status) ? true : isHealthyRec(count + 1);
    }
    return isHealthyRec();
}

exports.handler = async function (event, context) {
    console.log(event)
    try {
        if (event.RequestType === 'Delete') {
            return response.send(event, context, response.SUCCESS);
        } else { // we will try to recreate the index on an update because there may have been a destructive OpenSearch update
            const isHealthy = await isClusterHealthy();
            if(!isHealthy) {
                console.log('Cluster was not healthy after 60s.')
                return response.send(event, context, response.FAILED, {message: 'Cluster was not healthy after 60s.'});
            } else {
                const {body: indexExists} = await osClient.indices.exists({index: INDEX});
                console.log(`Index does ${indexExists ? '' : 'not'} exist.`);
                if(!indexExists) {
                    await osClient.indices.create({index: INDEX});
                    console.log('Index created.');
                }
                return response.send(event, context, response.SUCCESS, {
                    message: `Index ${indexExists ? 'already existed' : 'was created'}.`
                });
            }
        }
    } catch(err) {
        console.log(err)
        return response.send(event, context, response.FAILED, err);
    }
}
