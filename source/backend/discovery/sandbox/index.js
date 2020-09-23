const gremlin = require('gremlin');
const getCreds = require('@aws-sdk/credential-provider-node').defaultProvider();
const rewire = require('rewire');
const HttpsAgent = require('socks5-https-client/lib/Agent');
const db = rewire('../src/discovery/db');


/**
 These following environment variables must be set in bash or here:

 process.env.AWS_ACCESS_KEY_ID = <your access key>;
 process.env.AWS_SECRET_ACCESS_KEY = <your secret key>>;
 process.env.AWS_REGION= <your region>;
 process.env.NEPTUNE_URL=<your cluster url>
 process.env.NEPTUNE_PORT=<your cluster port>

 You need to connect to an EC2 instance with the following command and leave it running.
 The EC2 instance must be able to connect to your Neptune cluster.

 ssh -i <your EC2 pem> -N -D ${NEPTUNE_PORT} <your EC2 IP/FQDN>
 */

async function run() {
    const creds = await getCreds();
    const {loadPreviouslyPersisted} = db({
        ...creds,
        url: process.env.NEPTUNE_URL,
        port: process.env.NEPTUNE_PORT,
        agent: new HttpsAgent({
            socksHost: 'localhost',
            socksPort: process.env.NEPTUNE_PORT
        })
    });

    const res = await loadPreviouslyPersisted();
    console.log(res);
}

run();