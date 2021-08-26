const AWS = require('aws-sdk');
const gremlin = require('gremlin');
const R = require('ramda');
const AwsSigV4DriverRemoteConnection = require('./aws-sigv4-driver-remote-connection');
const logger = require('./logger');

gremlin.driver.AwsSigV4DriverRemoteConnection = AwsSigV4DriverRemoteConnection;
const traversal = gremlin.process.AnonymousTraversalSource.traversal;

function processMap(data) {
    return Object.entries(data).reduce((obj, [k, v]) => {
        // In neptune the same property can be stored many times so the
        // database returns an array of values.  99.9% of the time I think
        // that we'll just need the value
        const unboxed = Array.isArray(v) ? v[0] : v;
        
        if (k === 'id') {
            obj.id = unboxed;
        } else if (k === 'label') {
            obj.label = unboxed.replace(/_/g, '::');
        } else if (k === 'perspectiveBirthDate') {
            obj.perspectiveBirthDate = unboxed
        } else {
            obj.properties[k] = unboxed;
        }
        return obj;
    }, { properties: {} });
}

const getAllNodesAndEdges = async g => {
    const nodesP = g.V()
        .hasNot('softDelete')
        .valueMap(true, 'id', 'resourceId', 'accountId', 'perspectiveBirthDate', 'resourceType', 'label', 'relationships', 'tags', 'awsRegion')
        .toList()
        .then(R.map(processMap));

    const edgesP = g.E().toList();

    const [nodes, unprocessedEdges] = await Promise.all([nodesP, edgesP]);

    const ids = new Set(nodes.map(node => node.id));

    const edges = unprocessedEdges
        .filter(edge => ids.has(edge.inV.id) || ids.has(edge.outV.id))
        .map(edge => ({from: edge.outV.id, to: edge.inV.id, id: edge.id}));

    logger.info(`No of nodes: ${nodes.length} No of edges: ${edges.length}`);

    return {nodes, edges} // nodes: 559 edges: 895
};

const loadPreviouslyPersisted = (dc, g) => async () => {
    // Connecting and disconnecting at the call site here because they way we connect
    // does not seem to be very robust. This will have to be fixed if we ever containerise
    // the Gremlin API.
    logger.info('Connecting to Neptune');
    await dc.connect();

    const data = await getAllNodesAndEdges(g)
        .finally(async () => {
            dc._client._connection._ws.terminate();
            await dc.close().catch(err => logger.error('Error closing Neptune DB connection ' + err))
        });

    if (data == null || data.nodes == null) {
        throw new Error('Previous data did not load correctly!');
    }

    const {nodes: unprocessedNodes, edges} = data;

    // Copy the resourceId value to the lowest level to make it compatible with
    // how the import works.
    const nodes = unprocessedNodes.map(n => {
        n.resourceId = n.properties.resourceId;
        n.resourceType = n.properties.resourceType;
        return n;
    });

    return {
        inNeptune: new Map(nodes.map(n => [n.id, n])),
        previousPersistedLinkedMap: new Map(edges.map(e => [`${e.from}-${e.to}`, e])),
        resourceIdIndex: new Map(nodes.map(n => [n.properties.resourceId, n]))
    };
};

module.exports = function(opts) {
    const dc = new gremlin.driver.AwsSigV4DriverRemoteConnection(
        opts.url,
        opts.port,
        {
            region: process.env.AWS_REGION,
            ...R.omit(['port', 'url'], opts)
        },
        () => { },
        (code, message) => { },
        (error) => { logger.error(error) }
    );

    const g = traversal().withRemote(dc);

    return {
        loadPreviouslyPersisted: loadPreviouslyPersisted(dc, g)
    }
};