const fs = require('fs').promises;
const gremlin = require('gremlin');

const AwsSigV4DriverRemoteConnection = require('./aws-sigv4-driver-remote-connection');
gremlin.driver.AwsSigV4DriverRemoteConnection = AwsSigV4DriverRemoteConnection;

const R = require('ramda');
const AWS = require('aws-sdk');
const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');
const util = require('util');
const isIsoDate = require( 'is-iso-date' );

const hierarchy = require('./hierarchy');
const queryBuilder = require('./queryBuilder');
const schema = require('./schema.json');

//const DriverRemoteConnection = gremlinDriver.AwsSigV4DriverRemoteConnection;
const Graph = gremlin.structure.Graph;
const { t: { id , label: tLabel} } = gremlin.process;
const __ = gremlin.process.statics;
const p = gremlin.process.P;
const traversal = gremlin.process.AnonymousTraversalSource.traversal;

const neptuneConnectURL = process.env.neptuneConnectURL;
const neptunePort = process.env.neptunePort;

const ajv = new Ajv({ jsonPointers: true });

const validate = ajv.compile(schema);

const parsePostInput = (event) => {
    return JSON.parse(event.body);
}

const parseGetInput = (event) => {
    return {
        command: event.queryStringParameters.command,
        data: {
            id: event.queryStringParameters.id,
            resourceType: event.queryStringParameters.resourceType,
            deleteDate: event.queryStringParameters.deleteDate
        }
    }
}

function queryRunner(runnerFunction) {
    return async (event) => {
        let credentials = new AWS.EnvironmentCredentials('AWS');

        let creds = {
            accessKey: credentials.accessKeyId,
            sessionToken: credentials.sessionToken,
            secretKey: credentials.secretAccessKey,
            region: process.env.AWS_REGION,
        };

        const dc = new gremlin.driver.AwsSigV4DriverRemoteConnection(
            neptuneConnectURL,
            neptunePort,
            creds,
            () => { },
            (code, message) => { }, // disconnected callback
            (error) => { console.log(error) } // error callback
        );

        let result = undefined;

        try {
            await dc.connect();
            result = await runnerFunction(event, dc);
        }
        catch (error) {
            dumpError(error);
            return wrapResponse(500, { error: 'Internal server error' });
        }

        // TODO:  I used to do a finally close here, but it caused the function to fail, WHY?!
        return result;
    }
}

function queryRunnerG(runnerFunction) {
    return async event => {
        const credentials = new AWS.EnvironmentCredentials('AWS');

        const creds = {
            accessKey: credentials.accessKeyId,
            sessionToken: credentials.sessionToken,
            secretKey: credentials.secretAccessKey,
            region: process.env.AWS_REGION
        };

        const dc = new gremlin.driver.AwsSigV4DriverRemoteConnection(
            neptuneConnectURL,
            neptunePort,
            creds,
            () => { },
            (code, message) => { }, // disconnected callback
            (error) => { console.log(error) } // error callback
        );

        let result = undefined;

        try {
            await dc.connect();
            const g = traversal().withRemote(dc);
            result = await runnerFunction(g, event);
        }
        catch (error) {
            dumpError(error);
            return wrapResponse(500, { error: error.toString() });
        }

        // TODO:  I used to do a finally close here, but it caused the function to fail, WHY?!
        return result;
    }
};

exports.handler = async (inputEvent) => {
    const event = inputEvent.httpMethod === "GET" ? parseGetInput(inputEvent) : parsePostInput(inputEvent);
    let result;

    if(!validate(event)) {
        const errors = betterAjvErrors(schema, event, validate.errors, {format: 'js'});
        return wrapResponse(400, { errors: R.reject(o => R.test(/anyOf/g, o.error), errors)});
    }

    console.log('Executing command: ' + util.inspect(event));

    switch (event.command) {
        case "addNode":
            result = await queryRunner(addNode)(event);
            break;
        case "addEdge":
            result = await queryRunner(addEdge)(event);
            break;
        case "viewAllNodesAndLinks":
            result = await queryRunnerG(viewAllNodesAndLinks)(event);
            break;
        case "viewAllNodes":
            result = await queryRunnerG(directViewAllNodes)(event);
            break;
        case "viewAllEdges":
            result = await queryRunnerG(directViewAllEdges)(event);
            break;
        case "downloadAccountCloudFormation":
            result = await downloadCloudFormation("global-resources.template");
            break;
        case "downloadRegionCloudFormation":
            result = await downloadCloudFormation("regional-resources.template");
            break;
        case "deleteAllNodes":
            result = await queryRunner(deleteAllNodes)(event);
            break;
        case "getDeletedLinkedNodes":
            result = await queryRunnerG(getDeletedLinkedNodes)(event);
            break;
        case "linkedNodes":
            result = await queryRunnerG(linkedNodes)(event);
            break;
        case "linkedNodesHierarchy":
            result = await queryRunnerG(linkedNodesHierarchy)(event);
            break;
        case "filterNodes":
            result = await queryRunnerG(filterNodes)(event);
            break;
        case "filterNodesHierarchy":
            result = await queryRunnerG(filterNodesHierarchy)(event);
            break;
        case "runGremlin":
            result = await queryRunner(runGremlin)(event);
            break;
        // Moved to be a soft delete to stop graph render issues when the graph is being used whilst being updated.
        case "deleteNodes":
            result = await queryRunner(softDeleteNodes)(event);
            break;
        case "hardDeleteNodes":
            result = await queryRunner(deleteNodes)(event);
            break;
        case "getAllResources":
            result = await queryRunnerG(getAllResources)(event);
            break;
        case "getNodeFromId":
            result = await queryRunner(wrapGetNodeFromId)(event);
            break;
        // case "testQuery":
        //     result = queryRunner(testQuery)(event);
        //     break;
        default:
            return wrapResponse(400, { error: "Command not found *" + event.command + "*", event: event.data });
    }

    return result;
};

/**
 * ScratchPad - Used to test gremlin queries.
 *
 * @param {*} event
 */
// const testQuery = async (event, dc) => {
//     const graph = new Graph();
//     const g = graph.traversal().withRemote(dc);

//     const data = await g.V().has("resourceType", "AWS::EC2::Volume")
//         .not(
//             __.both("linked")
//                 .has("resourceType", "AWS::EC2::Instance")
//         )
//         .valueMap(true)
//         .toList();

//     console.log(util.inspect(data, { depth: 10 }));

//     let listOfNodes = data.map((element) => createNode(processMap(element)));

//     return {
//         success: true, results: listOfNodes
//     };
// }

/**
 * Add a node and its properties to the graph
 * @param {*} event
 * @param {*} dc
 */
const addNode = async (event, dc) => {
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);

    let label = "undefined";
    if (event.data && event.data.properties && event.data.properties.resourceType) {
        // :: is a reserved keyword in neptune.  Replace it with _
        label = event.data.properties["resourceType"].replace(/::/g, "_");
    }

    // Add node with custom id.
    try {
        const start = g.addV(label).property(id, event.data.id).property("perspectiveBirthDate", new Date());
        const data = await addProperties(start, event.data.properties).next();
        return wrapResponse(200, { success: true, results: data });
    }
    catch (Error) {
        console.log("Could not add duplicate node, delete it and recreate:");
        console.log(util.inspect(event, { depth: 10 }));
        console.log("Error:");
        console.log(util.inspect(Error, { depth: 10 }));

        /*
            Sometimes we try to add the same node twice.....
            This happens when there is an error in the system and a node
            accidentaly gets soft deleted, and now we are trying to re-add it which
            gives a constraint exception.

            In this case what we want to do is load the old node,
            check to see if it has been soft deleted.  If it has then
            set it back to being a normal node.
        */
        if (JSON.parse(Error.statusMessage).code === "ConstraintViolationException") {
            return await handleWronglyDeletedNode(event, dc);
        }

        throw Error
    }
};

const handleWronglyDeletedNode = async (event, dc) => {
    console.log("Updating soft deleted node to normal", event.data.id);
    let node = await getNodeFromId(event.data.id, dc);

    if (node && node.properties.softDelete) {
        const graph = new Graph();
        const g = graph.traversal().withRemote(dc);

        await g.V(event.data.id).properties('softDelete').drop().next();
        await g.V(event.data.id).properties('softDeleteDate').drop().next();

        let result = {
            value:
                {
                    id: event.data.id
                }
        };

        return wrapResponse(200, { success: true, results: result });
    }
    else {
        throw "Cannot handle wrongly Deleted Node " + event.data.id;
    }
}

/**
 * Add an edge to the graph
 * @param {*} event
 * @param {*} dc
 */
const addEdge = async (event, dc) => {
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    const result = await g.V(event.data.source).addE("linked").to(g.V(event.data.target)).next();
    return wrapResponse(200, { success: true, results: result });
};

const viewAllNodesAndLinks = async (g, event) => {

    const nodesP = viewAllNodes(g, event, filterAllNodes, true)
        .then(R.prop('results'))
        .then(R.map(processMap));

    const edgesP = g.E().toList();

    const [nodes, unprocessedEdges] = await Promise.all([nodesP, edgesP]);

    const ids = new Set(nodes.map(node => node.id));

    const edges = unprocessedEdges
        .filter(edge => ids.has(edge.inV.id) || ids.has(edge.outV.id))
        .map(edge => ({from: edge.outV.id, to: edge.inV.id, id: edge.id}));

    return wrapResponse(200, { success: true, nodes, edges });
};

const directViewAllNodes = async (g, event, filterFunction = filterNoNodes) => {
    return wrapResponse(200, await viewAllNodes(g, event, filterFunction));
};

const viewAllNodes = async (g, event, filterFunction = filterNoNodes, minProperties = false) => {
    const data = minProperties
        ? await g.V().hasNot("softDelete").valueMap(true, "id", "resourceId", "accountId", "perspectiveBirthDate", "resourceType", "label", "relationships", "tags", "awsRegion").toList()
        : await g.V().hasNot("softDelete").valueMap(true).toList();

    let listOfNodes = data.map((element) => processMap(element));
    const results = event.data && event.data.accountFilter ? filterFunction(listOfNodes, event.data.accountFilter) : listOfNodes;
    return { success: true, results: results };
};

const directViewAllEdges = async (g, event) => {
    return wrapResponse(200, await viewAllEdges(g, event));
};

const viewAllEdges = async (g, event) => {
    const data = await g.E().toList();
    return { success: true, results: data }
};

const buildFilterQueries = (event) => {
    const eventDataClone = R.clone(event.data) || {};
    let accountFilter = eventDataClone.accountFilter;

    delete eventDataClone.accountFilter;

    let queries = [];

    if (accountFilter) {
        for (let key of Object.keys(accountFilter)) {
            let regions = accountFilter[key];

            if (regions.length === 0) {
                let query = {};
                query.data = R.clone(eventDataClone);
                query.data.accountId = key;
                queries.push(query);
            }
            else {
                for (let region of regions) {
                    let query = {};
                    query.data = R.clone(eventDataClone);
                    query.data.accountId = key;
                    query.data.awsRegion = region;
                    queries.push(query);
                }
            }
        }
    }
    else {
        queries.push(event);
    }

    return queries;
};

const getResourcesCount = R.compose(R.map(R.length), R.groupBy(R.prop('resourceType')));

function createMetaData(nodes) {
    const fNodes = R.reject(x => x.resourceType === 'AWS::undefined::undefined', nodes);
    return {
        resourceCount: fNodes.length,
        resourceTypes: getResourcesCount(fNodes)
    };
}

const createNode = ({id, label, title, accountId, awsRegion: region, resourceType, configuration}) => {
    const node = R.map(v => Array.isArray(v) ? v[0] : v, {
        id, label, title, accountId, region, resourceType, configuration
    })

    if (node.resourceType != null) {
        const [, mainType, subType] = node.resourceType.split("::");
        node.mainType = mainType;
        node.subType = subType;
    }

    return node;
};

const getAllResources = async (g, event) => {
    let start = g.V().hasNot('softDelete')

    let queries = event.data?.accountFilter ?? {};

    if (!R.isEmpty(queries)) {
        const predicates = Object.entries(queries).map(([accountId, regions]) =>
            __.has('accountId', accountId).has('awsRegion', p.within(regions))
        );

        start = start.or(...predicates)//.group().by('accountId')
    }

    const nodes = await start
        // have to use valueMap because elementMap is not optimised in Neptune
        .valueMap(true, 'title', 'accountId', 'awsRegion', 'configuration', 'resourceType')
        .toList()
        .then(R.map(createNode));

    return wrapResponse(200, {
        success: true,
        results: {
            nodes,
            metaData: createMetaData(nodes)
        }
    });
};

/**
 * Download CF template from S3 and substitute config values
 * @param {*} file - Filename for template
 */
const downloadCloudFormation = async (file) => {
    const {configurationAggregator, region, accountId} = process.env;

    let template = await fs.readFile('./' + file, 'utf8');

    let substitutons = [
        { key: "<<substitute_zoom_account_id>>", value:  accountId },
        { key: "<<substitute_zoom_region>>", value: region },
        { key: "<<substitute_zoom_aggregator>>", value: configurationAggregator }
    ];

    substitutons.forEach(subsitution => {
        template = template.replace(subsitution.key, subsitution.value);
    });

    return wrapResponse(200, { success: true, template: template });
};

const wrapResponse = (statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
});

const dumpError = (err) => {
    if (typeof err === 'object') {
        if (err.message) {
            console.log("===================");
            console.log('Error Message: ' + err.message)
        }
        if (err.stack) {
            console.log("====================");
            console.log('Stacktrace:')
            console.log(err.stack);
            console.log("====================");
        }
    } else {
        console.log('dumpError :: argument is not an object');
        console.log(util.inspect(err, { depth: 10 }));
    }
}

/**
 * Runs a gremlin query submitted as a JSON event.
 * @param {*} event
 * @param {*} dc
 */
const runGremlin = async (event, dc) => {
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    let response = await queryBuilder.runEnhancedQuery(event, g);
    let listOfNodes = response.map((element) => processMap(element));
    return wrapResponse(200, { success: true, results: listOfNodes });
};

const filterNodesLogic = async (g, event) => {
    const accountFilter = event.data.accountFilter;

    if (accountFilter) {
        delete event.data.accountFilter;
    }

    let response = await queryBuilder.runQuery(event, g);
    return filterAllNodes(response.map((element) => processMap(element)), accountFilter);
}

/**
 * Returns a filtered list of nodes.
 *
 * The incomming event object must be in the format:
 *
 {
        "command": "filterNodes",
        "data": {
            "resourceId": "app-name",
            "resourceType": "AWS::TAG",
            "resourceValue": "twobytwo"
        }
    }
 *
 * Where the data elements are the key values for the filter.
 *
 * @param {*} event
 * @param {*} dc
 */
const filterNodes = async (g, event) => {
    let listOfNodes = await filterNodesLogic(g, event);
    return wrapResponse(200, { success: true, results: listOfNodes });
};

/**
 * As above but returns in hierarchy format
 * @param {*} event
 * @param {*} dc
 */
const filterNodesHierarchy = async (g, event) => {
    let listOfNodes = await filterNodesLogic(g, event);

    let allVPC = await filterNodesLogic(g, { "command": "filterNodes", "data": { "resourceType": "AWS::EC2::VPC", "accountFilter": {} } });
    let allSubnets = await publicOrPrivateSubnet(g, await filterNodesLogic(g, { "command": "filterNodes", "data": { "resourceType": "AWS::EC2::Subnet", "accountFilter": {} } }));

    return wrapResponse(200, hierarchy.createHierarchy(listOfNodes, [...allVPC, ...allSubnets], false, event.data.resourceType));
};

/**
 * Loads all of the nodes linked to a node.
 * @param {*} event
 * @param {*} dc
 */

const linkedNodes = async (g, event) => {
    return wrapResponse(200, await getLinkedNodes(g, event.data.id, event.data.deleteDate));
};

const linkedNodesHierarchy = async (g, event) => {
    const [linkedNodes, allVPC, allSubnets] = await Promise.all(
        [
            getLinkedNodes(g, event.data.id, event.data.deleteDate),
            filterNodesLogic(g, { "command": "filterNodes", "data": { "resourceType": "AWS::EC2::VPC", "accountFilter": {} } }),
            publicOrPrivateSubnet(g, await filterNodesLogic(g, { "command": "filterNodes", "data": { "resourceType": "AWS::EC2::Subnet", "accountFilter": {} } }))
        ]
    );

    return wrapResponse(200, hierarchy.createHierarchy(linkedNodes, [...allVPC, ...allSubnets], true));
};

const getLinkedNodes = async (g, id, deleteDate) => {
    const vs = await g.V(id).repeat(__.both().hasNot("softDelete")).times(1).dedup().elementMap().toList();

    if (deleteDate && isIsoDate(deleteDate)) {
        const deletedNodes = await g.V(id).repeat(__.both()).times(1).dedup().has('softDeleteDate', p.gte(new Date(deleteDate))).elementMap().toList();

        if (deletedNodes && deleteNodes.length > 0) {
            vs.push(...deletedNodes);
        }
    }

    const parent = (deleteDate && isIsoDate(deleteDate))
        ? await g.V(id).has('softDeleteDate', p.gte(new Date(deleteDate))).elementMap().next()
        : await g.V(id).elementMap().next();

    if (parent && parent.value) {
        vs.push(parent.value);
    }

    return vs.map(({id: vId, label, perspectiveBirthDate, ...properties}) => {
        return {
            id: vId,
            perspectiveBirthDate,
            label: label.replace(/_/g, "::"),
            properties,
            parent: vId === id
        }
    });
}

const getDeletedLinkedNodes = async (g, event) => {
    if (event.data.id && event.data.deleteDate && isIsoDate(event.data.deleteDate)) {
        let deletedNodes = await g.V(event.data.id).repeat(__.both()).times(1).dedup().has('softDeleteDate', p.gte(new Date(event.data.deleteDate))).valueMap(true).toList();

        let linked = deletedNodes.map(v => ({
            id: v.id,
            perspectiveBirthDate: v.perspectiveBirthDate ? v.perspectiveBirthDate[0] : undefined,
            label: v.label.replace(/_/g, "::"),
            properties: mapToObj(R.omit(['id', 'label'], v)),
            parent: v.id === id
        }));

        return wrapResponse(200, linked);
    }

    return wrapResponse(200, []);
}

/**
 * The properties from neptune sometimes come back as an array of one.
 * If they do then strip out the array.
 * @param {*} inputMap
 */
const mapToObj = R.map(v => Array.isArray(v) ? v[0] : v);

/**
 * Load a node from it's id.
 *
 * @param {*} id
 * @param {*} dc
 */
const getNodeFromId = async (id, dc) => {
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    const data = await g.V(id).valueMap(true).next();

    console.log("data = ");
    console.log(util.inspect(data, { depth: 10 }));

    return data.value ?
        {
            id: data.value.id,
            perspectiveBirthDate: data.value.perspectiveBirthDate[0],
            label: data.value.label.replace(/_/g, "::"),
            properties: mapToObj(R.omit(['id', 'label'], data.value)),
        } : undefined
};

const wrapGetNodeFromId = async (event, dc) => {
    return await getNodeFromId(event.data.id, dc);
}

const deleteAllNodes = async (event, dc) => {
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    const results = await g.V().drop().next();
    return wrapResponse(200, { success: true, results: results });
};

const deleteNodes = async (event, dc) => {
    let deleted = [];

    for (let node of event.data.nodes) {
        let response = await deleteNode(node, dc);
        deleted.push(response);
    }

    return wrapResponse(200, { success: true, results: deleted });
};

const softDeleteNodes = async (event, dc) => {
    let deleted = [];

    /*
         Most perspective deletes are soft deletes, but there are two types
         of softDelete (stored in the node as softDeleteType).
         The first type of softDelete are when event.data.softDeleteType = delete.
         This is set when the node has been removed from config / the api. For example
         when an ec2 instance is terminated it will be removed from config.  The second
         type of delete happens when there is a change to a node, i.e. its ip address
         changes.  Here a new node is created, and the old one soft deleted, but the
         softDeleteType parameter is set to update.
    */

    for (let node of event.data.nodes) {
        let response = await softDeleteNode(node, event.data.softDeleteType, dc);
        console.log("Soft deleted:");
        console.log(util.inspect(node, { depth: 10 }));
        deleted.push(response);
    }

    return wrapResponse(200, { success: true, results: deleted });
};

const deleteNode = async (nodeId, dc) => {
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    const results = await g.V(nodeId).drop().next();
    return { success: true, results: results }
};

const softDeleteNode = async (nodeId, softDeleteType = "unknown", dc) => {
    console.log("softDeleteType=", softDeleteType);
    const graph = new Graph();
    const g = graph.traversal().withRemote(dc);
    const results = await addProperties(g.V(nodeId), {
        softDelete: true,
        softDeleteDate: new Date(),
        softDeleteType: softDeleteType }).next();
    return { success: true, results: results }
};

/**
 * Filters the nodes according to account and region.
 *
 * TODO:  This should be done in neptune!
 *
 * THIS IS WHAT the filter looks like
 *
 * {
  "command": "viewAllNodesAndLinks",
  "data": {
      "accountFilter": {
        "XXXXXXXXXXX1": [
            "eu-west-1",
            "us-east-2"
        ],
        "XXXXXXXXXXX2": [
            "us-east-2"
        ]
    }
  }
}
 *
 * @param {*} nodes
 * @param {*} filterParameters
 */
const filterAllNodes = (nodes, filterParameters) => {
    if (filterParameters === undefined) {
        return nodes;
    }

    // If there are no parmeters then return the nodes unfiltered
    if (Object.keys(filterParameters).length === 0) {
        return nodes;
    }

    let fnodes = nodes.filter(node => {
        let allow = false;

        for (let accountId of Object.keys(filterParameters)) {

            if (node.properties.accountId === accountId) {

                if (filterParameters[accountId].length > 0) {
                    for (let region of filterParameters[accountId]) {
                        if (node.properties.awsRegion === region) {
                            allow = true;
                        }

                        if (node.properties.awsRegion === "unknown") {
                            allow = true;
                        }
                    }
                }
                else {
                    allow = true;
                }
            }
        }

        return allow;

    });

    return fnodes;
};

const filterNoNodes = (nodes, _filterParameters) => {
    return nodes;
};

const processMap = data => {
    return Object.entries(data).reduce((obj, [k, v]) => {
        if (k === 'id') {
            obj.id = v;
        } else if (k === 'label') {
            obj.label = v.replace(/_/g, "::");
        } else if (k === 'perspectiveBirthDate') {
            obj.perspectiveBirthDate = Array.isArray(v) ? v[0] : v;
        }

        else {
            // In neptune the same property can be stored many times so the
            // database returns an array of values.  99.9% of the time I think
            // that we'll just need the value
            obj.properties[k] = Array.isArray(v) ? v[0] : v;
        }
        return obj;
    }, { properties: {} });
};

const addProperties = (gV, properties) => {
    return Object.entries(properties).reduce((query, [k, v]) => {
        return query.property(k, R.is(String, v) ? v : R.is(Date, v) ? v : JSON.stringify(v));
    }, gV);
};

const isPrivateSubnet = async (g, id) => {
    let linked = await g.V(id).both().has("resourceType", "AWS::EC2::RouteTable").both().has("resourceType", "AWS::EC2::NatGateway").valueMap(true).toList();
    return linked.length > 0 ? true : false;
}

const publicOrPrivateSubnet = async (g, nodes) => {
    return Promise.all(nodes.map(node => {
        if (node.properties.resourceType === "AWS::EC2::Subnet") {
            let runnerFun = async (node) => {
                let private = await isPrivateSubnet(g, node.id);

                if (private) {
                    node.properties.private = true;
                }

                return node;
            }

            return runnerFun(node);
        }
        return node;
    }))
}