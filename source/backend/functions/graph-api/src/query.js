const aws4 = require('aws4');
const gremlin = require('gremlin');
const retry = require('async-retry');
const R = require('ramda');

const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const {driver: {DriverRemoteConnection}} = gremlin;

function getUrlAndHeaders(host, port, options, canonicalUri = '/gremlin', protocol = 'wss') {

    if (R.isNil(host) || R.isNil(port)) {
        throw new Error('Host and port are required');
    }
    const accessKeyId = options.accessKey ?? process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = options.secretKey ?? process.env.AWS_SECRET_ACCESS_KEY;
    const sessionToken = options.sessionToken ?? process.env.AWS_SESSION_TOKEN;
    const region = options.region ?? process.env.AWS_REGION;

    if (R.isNil(accessKeyId) || R.isNil(secretAccessKey) || R.isNil(region)) {
        throw new Error(
            'AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_REGION are required'
        )
    }

    const awsCreds = {
        accessKeyId, secretAccessKey, sessionToken,
    };

    const sigOptions = {
        host: `${host}:${port}`,
        region,
        path: canonicalUri,
        service: 'neptune-db',
    };

    return  {
        url: `${protocol}://${host}:${port}${canonicalUri}`,
        headers: aws4.sign(sigOptions, awsCreds).headers
    }
}

module.exports = ({neptuneConnectURL, neptunePort}) => {
    let conn = null;
    let g = null;

    const createRemoteConnection = () => {
        const {url, headers} = getUrlAndHeaders(neptuneConnectURL, neptunePort, {});

        const c = new DriverRemoteConnection(
            url,
            {
                mimeType: 'application/vnd.gremlin-v2.0+json',
                pingEnabled: false,
                headers: headers
            });

        c._client._connection.on('log', message => {
            console.info(`connection message - ${message}`);
        });

        c._client._connection.on('close', (code, message) => {
            console.info(`close - ${code} ${message}`);
            if (code == 1006){
                console.error('Connection closed prematurely');
                throw new Error('Connection closed prematurely');
            }
        });

        return c;
    };

    const createGraphTraversalSource = conn => {
        return traversal().withRemote(conn);
    };

    return {
        run: async query => {
            if (conn == null){
                console.info('Initializing connection')
                conn = createRemoteConnection();
                g = createGraphTraversalSource(conn);
            }

            return retry(async (bail, count) => {
                return query(g).catch(err => {
                    if(count > 0) console.log('Retry attempt no: ' + count);
                    if (err.message.startsWith('WebSocket is not open')){
                        console.warn('Reopening connection');
                        conn.close();
                        conn = createRemoteConnection();
                        g = createGraphTraversalSource(conn);
                        throw err;
                    } else if (err.message.includes('ConcurrentModificationException')){
                        console.warn('Retrying query because of ConcurrentModificationException');
                        throw err;
                    } else if (err.message.includes('ReadOnlyViolationException')){
                        console.warn('Retrying query because of ReadOnlyViolationException');
                        throw err;
                    } else {
                        console.warn('Unrecoverable error: ' + err);
                        return bail(err);
                    }
                })
            }, {
                factor: 1,
                retries: 5
            })
        }
    }
}
