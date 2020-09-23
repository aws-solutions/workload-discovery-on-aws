const gremlin = require('gremlin');
const rewire = require('rewire');
const HttpsAgent = require('socks5-https-client/lib/Agent');
const index = rewire('../src');
const AwsSigV4DriverRemoteConnection = require('../src/aws-sigv4-driver-remote-connection');

gremlin.driver.AwsSigV4DriverRemoteConnection = AwsSigV4DriverRemoteConnection;
const traversal = gremlin.process.AnonymousTraversalSource.traversal;

/**
 These following environment variables must be set in bash or here:

 process.env.AWS_ACCESS_KEY_ID = <your access key>;
 process.env.AWS_SECRET_ACCESS_KEY = <your secret key>>;
 process.env.AWS_REGION= <your region>;
 process.env.NEPTUNE_URL=<your cluster url>

 You need to connect to an EC2 instance with the following command and leave it running.
 The EC2 instance must be able to connect to your Neptune cluster.

 ssh -i <your EC2 pem> -N -D 8182 <your EC2 IP/FQDN>
 */


let options = {
    agent: new HttpsAgent({
        socksHost: 'localhost',
        socksPort: process.env.NEPTUNE_PORT
    })
};

const dc = new gremlin.driver.AwsSigV4DriverRemoteConnection(
    process.env.NEPTUNE_URL,
    process.env.NEPTUNE_PORT,
    options,
    () => { },
    (code, message) => { }, // disconnected callback
    (error) => { console.log(error) } // error callback
);

// select or implement the function you wish to run
const linkedNodes = index.__get__('linkedNodes');
const viewAllNodesAndLinks = index.__get__('viewAllNodesAndLinks');

async function run() {
    try {
        await dc.connect();
        const g = traversal().withRemote(dc);

        const actual = await viewAllNodesAndLinks(g, {
            command: 'viewAllNodesAndLinks'
        });
        console.log(actual);
    } catch(err) {
        console.log(err);
    } finally {
        dc.close();
    }
}

run();