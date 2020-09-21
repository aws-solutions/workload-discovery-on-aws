const chai = require('chai');
const util = require('util');
const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();
const parser = require('../src/discovery/lambdaParser');

it('Should correctly parse variables from nodejs', async () => {

    const code = `
    /**
    * This is a copy of our lambda function, but the buckets
    * and neptune connectURL are hardcoded rather than environment variables.
    */
   
   const gremlin = require('gremlin');
   const AwsSigV4DriverRemoteConnection = require('./aws-sigv4-driver-remote-connection');
   gremlin.driver.AwsSigV4DriverRemoteConnection = AwsSigV4DriverRemoteConnection;
   
   const _ = require('lodash');
   const AWS = require('aws-sdk');
   const hierarchy = require('./hierarchy');
   
   const util = require('util');
   
   //const DriverRemoteConnection = gremlinDriver.AwsSigV4DriverRemoteConnection; 
   const Graph = gremlin.structure.Graph;
   const { t: { id } } = gremlin.process;
   const __ = gremlin.process.statics;
   const p = gremlin.process.P;
   const queryBuilder = require('./queryBuilder');
   
   const neptuneConnectURL = "zoom-dev-cluster.cluster-cear0sqdk7k7.eu-west-1.neptune.amazonaws.com";
   const metaDataBucket = "zoom-discovery-bucket2-aws-4";

   let anotherNeptune = "wss://zoom-dev-cluster.cluster-cear0sqdk7k.eu-west-1.neptune.amazonaws.com:8182/gremlin";
   
   const s3 = new AWS.S3();
   
   const parsePostInput = (event) => {
       return JSON.parse(event.body);
   }
   
   const parseGetInput = (event) => {
       return {
           command: event.queryStringParameters.command,
           data: {
               id: event.queryStringParameters.id,
               resourceType: event.queryStringParameters.resourceType
           }
       }
   }
   
   const queryRunner = (runnerFunction) => {
       return async (event) => {
           let credentials = new AWS.EnvironmentCredentials('AWS');
   
           let creds = {
               accessKey: credentials.accessKeyId,
               sessionToken: credentials.sessionToken,
               region: "eu-west-1",
           };
   
           const dc = new gremlin.driver.AwsSigV4DriverRemoteConnection(
               neptuneConnectURL,
               8182,
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
               return wrapResponse(500, { error: error.toString() });
           }
   
           // TODO:  I used to do a finally close here, but it caused the function to fail, WHY?!
           return result;
       }
   };
   
   exports.handler = async (inputEvent) => {
       const event = inputEvent.httpMethod === "GET" ? parseGetInput(inputEvent) : parsePostInput(inputEvent);
       let result;
   
       switch (event.command) {
           case "addNode":
               result = await queryRunner(addNode)(event);
               break;
           case "addEdge":
               result = await queryRunner(addEdge)(event);
               break;
           case "viewAllNodesAndLinks":
               result = await queryRunner(viewAllNodesAndLinks)(event);
               break;
           case "viewAllNodes":
               result = await queryRunner(directViewAllNodes)(event);
               break;
           case "viewAllEdges":
               result = await queryRunner(directViewAllEdges)(event);
               break;
           case "downloadAccountCloudFormation":
               result = await downloadCloudFormation("account-import-template.yml");
               break;
           case "downloadRegionCloudFormation":
               result = await downloadCloudFormation("account-region-template.yml");
               break;
           case "getDiscoveryConfig":
               result = await getDiscoveryConfig();
               break;
           case "storeDiscoveryConfig":
               result = await storeDiscoveryConfig(event);
               break;
           case "getImportMetaData":
               result = await getMetaData();
               break;
           case "path":
               result = await queryRunner(path)(event);
               break;
           case "deleteAllNodes":
               result = await queryRunner(deleteAllNodes)(event);
               break;
           case "linkedNodes":
               result = await queryRunner(linkedNodes)(event);
               break;
           case "linkedNodesHierarchy":
               result = await queryRunner(linkedNodesHierarchy)(event);
               break;
           case "filterNodes":
               result = await queryRunner(filterNodes)(event);
               break;
           case "runGremlin":
               result = await queryRunner(runGremlin)(event);
               break;
           case "deleteNodes":
               result = await queryRunner(deleteNodes)(event);
               break;
           case "getAllResources":
               result = await queryRunner(getAllResources)(event);
               break;
           // case "testQuery": 
           //     result = queryRunner(testQuery)(event); 
           //     break; 
           default:
               console.log("Error: ", "Command not found " + event.command);;
               return wrapResponse(404, { error: "Command not found *" + event.command + "*", event: event.data });
       }
   
       return result;
   }
   
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
       const data = await g.addV(label).property(id, event.data.id).next();
       await addProperties(g, data.value.id, event.data.properties);
       return wrapResponse(200, { success: true, results: data });
   };
   
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
   
   const viewAllNodesAndLinks = async (event, dc) => {
       let nodes = await viewAllNodes(event, dc, filterAllNodes);
   
       let map = buildMap(nodes.results);
       let processedEdges = [];
   
       if (nodes.results.length > 0) {
           let edges = await viewAllEdges(event, dc);
   
           edges.results.filter(edge => {
   
               if (map.get(edge.inV) || map.get(edge.outV)) {
                   return true;
               }
           });
   
           processedEdges = edges.results.map(edge => {
               return { from: edge.outV, to: edge.inV, id: edge.id };
           });
       }
   
       return wrapResponse(200, { success: true, nodes: nodes.results, edges: processedEdges });
   };
   
   const directViewAllNodes = async (event, dc, filterFunction = filterNoNodes) => {
       return wrapResponse(200, await viewAllNodes(event, dc, filterFunction));
   };
   
   const viewAllNodes = async (event, dc, filterFunction = filterNoNodes) => {
       const graph = new Graph();
       const g = graph.traversal().withRemote(dc);
   
       const data = await g.V().valueMap(true).toList();
       let listOfNodes = data.map((element) => processMap(element));
       const results = event.data && event.data.accountFilter ? filterFunction(listOfNodes, event.data.accountFilter) : listOfNodes;
       return { success: true, results: results };
   };
   
   const directViewAllEdges = async (event, dc) => {
       return wrapResponse(200, await viewAllEdges(event, dc));
   }
   
   const viewAllEdges = async (event, dc) => {
       const graph = new Graph();
       const g = graph.traversal().withRemote(dc);
       const data = await g.E().toList();
       return { success: true, results: data }
   };
   
   const buildFilterQueries = (event) => {
       const eventDataClone = _.clone(event.data);
       let accountFilter = eventDataClone.accountFilter;
   
       delete eventDataClone.accountFilter;
   
       let queries = [];
   
       if (accountFilter) {
           for (let key of Object.keys(accountFilter)) {
               let regions = accountFilter[key];
   
               if (regions.length === 0) {
                   let query = {};
                   query.data = _.clone(eventDataClone);
                   query.data.accountId = key;
                   queries.push(query);
               }
               else {
                   for (let region of regions) {
                       let query = {};
                       query.data = _.clone(eventDataClone);
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
   
   const createMetaData = (elements) => {
       let holder = new Map();
   
       let metaData = {};
   
       for (let element of elements) {
           let key = "AWS::" + element.mainType + "::" + element.subType;
           let value = holder.get(key);
           value === undefined ? holder.set(key, 1) : holder.set(key, value + 1);
       }
   
       let resourceCount = 0;
   
       let resources = [];
   
       Array.from(holder.keys()).map(function (key, index) {
           let temp = {};
           temp[key] = holder.get(key);
   
           resourceCount += temp[key];
   
           resources.push(temp);
       });
   
       metaData.resourceCount = resourceCount;
       metaData.resourceTypes = resources;
   
       return metaData;
   };
   
   const createNode = (element) => {
       console.log(util.inspect(element, { depth: 10 }));
   
       let node = {};
       node.id = element.id;
       node.label = element.label;
       node.title = element.properties.title;
       node.accountId = element.properties.accountId;
       node.region = element.properties.awsRegion;
   
       if (element.properties.resourceType) {
           let types = element.properties.resourceType.split("::");
           node.mainType = types[1];
           node.subType = types[2];
       }
       return node;
   };
   
   const getAllResources = async (event, dc) => {
       const graph = new Graph();
       const g = graph.traversal().withRemote(dc);
   
       let queries = buildFilterQueries(event);
   
       let nodeResults = [];
   
       if (queries.length > 0) {
           for (let query of queries) {
               let response = await queryBuilder.runQuery(query, g);
               let listOfNodes = response.map((element) => createNode(processMap(element)));
               nodeResults.push({
                   nodes: listOfNodes,
                   metaData: createMetaData(listOfNodes),
                   query: query
               });
           }
       }
       else {
           // Get all of the nodes 
           const data = await g.V().valueMap(true).toList();
           let listOfNodes = data.map((element) => createNode(processMap(element)));
   
           nodeResults.push({
               nodes: listOfNodes,
               metaData: createMetaData(listOfNodes),
               query: undefined
           });
       }
   
       return wrapResponse(200, { success: true, results: nodeResults });
   };
   
   /** 
    * Download CF template from S3 and substitute config values 
    * @param {*} file - Filename for template 
    */
   const downloadCloudFormation = async (file) => {
       let importConfig = JSON.parse(await loadFromS3("importConfig.json"));
   
       let template = await loadFromS3(file);
   
       let substitutons = [
           { key: "<<substitute_zoom_account_id>>", value: importConfig.zoomConfiguration.accountId },
           { key: "<<substitute_zoom_region>>", value: importConfig.zoomConfiguration.zoomRegion },
           { key: "<<substitute_zoom_aggregator>>", value: importConfig.zoomConfiguration.configAggregator }
       ];
   
       substitutons.forEach(subsitution => {
           template = template.replace(subsitution.key, subsitution.value);
       })
   
       return wrapResponse(200, { success: true, template: template });
   };
   
   const getDiscoveryConfig = async () => {
       let data = JSON.parse(await loadFromS3("importConfig.json"));
       return wrapResponse(200, { success: true, results: data });
   };
   
   const storeDiscoveryConfig = async (event) => {
       await storeToS3("importConfig.json", event.data);
       return wrapResponse(200, { success: true });
   };
   
   const getMetaData = async () => {
       let data = JSON.parse(await loadFromS3("dataImport.json"));
       return wrapResponse(200, { success: true, results: data });
   };
   
   const storeToS3 = async (fileName, data) => {
       const toSave = JSON.stringify(data);
   
       try {
           const bucketParams = {
               Bucket: metaDataBucket,
               Key: fileName,
               Body: toSave
           };
   
           await s3.putObject(bucketParams).promise();
       } catch (error) {
           console.log("storeToS3 error:", error);
       }
   };
   
   const loadFromS3 = async (fileName) => {
       try {
           const bucketParams = {
               Bucket: metaDataBucket,
               Key: fileName
           };
   
           let data = await s3.getObject(bucketParams).promise();
           return data.Body.toString('utf8');
       } catch (error) {
           console.log(error);
       }
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
   const filterNodes = async (event, dc) => {
       const graph = new Graph();
       const g = graph.traversal().withRemote(dc);
   
       const accountFilter = event.data.accountFilter;
   
       if (accountFilter) {
           delete event.data.accountFilter;
       }
   
       let response = await queryBuilder.runQuery(event, g);
       let listOfNodes = response.map((element) => processMap(element));
       return wrapResponse(200, { success: true, results: filterAllNodes(listOfNodes, accountFilter) });
   };
   
   /** 
    * Performs a path tarversal query. 
    *  
    * @param {*} event  
    * @param {*} dc  
    */
   const path = async (event, dc) => {
       const graph = new Graph();
       const g = graph.traversal().withRemote(dc);
   
       const data = await g.V().has(event.data.endType, event.data.end)
           .repeat(__.both())
           .until(__.has(event.data.startType, event.data.start).or().loops().is(3)).limit(10)
           .path().toList();
   
       let pathData = [];
   
       for (let result of data) {
           pathData.push(await processPath(result, dc));
       };
   
       return wrapResponse(200, { success: true, results: pathData });
   };
   
   /** 
    * The Path data needs to be reformatted to return to d3. 
    *  
    * Create a list of from to objects and then load the node details for each 
    * of them 
    *  
    * @param {*} pathResult  
    * @param {*} dc  
    */
   const processPath = async (pathResult, dc) => {
       let path = buildPath(pathResult.objects);
   
       let nodes = [];
       for (let object of pathResult.objects) {
           let n = await getNodeFromId(object.id, dc);
   
           let node = {
               id: object.id,
               properties: mapToObj(n.value),
           }
   
           node.label = node.properties.resourceType.replace(/_/g, "::");
   
           nodes.push(node);
       };
   
       return { nodes: nodes, edges: path };
   };
   
   /** 
    *  
    * Using a generator because I wanted to try it. 
    *  
    */
   function* pathGenerator(path) {
       for (let element of path) {
           yield element;
       }
   };
   
   /** 
    * The path data needs to be reformatted into a list of {from:, to:} objects 
    *  
    * The data from neptune looks like this: 
    *  
    * path [ { from:  
        Vertex { 
          id: '00b53cb7-ddd8-81aa-543e-1f795ed5542e', 
          label: 'AWS_EC2_VPC', 
          properties: undefined }, 
       to:  
        Vertex { 
          id: '16b53cb7-edcd-fcec-aeec-cea0d8cfb380', 
          label: 'AWS_EC2_Subnet', 
          properties: undefined } } ] 
    *  
    * @param {*} path  
    */
   
   const buildPath = (path) => {
       let linkList = [];
       let running = true;
   
       const pathGen = pathGenerator(path);
   
       let from;
       let to;
   
       while (running) {
           if (!from) {
               from = pathGen.next();
           }
           if (from.value) {
               to = pathGen.next();
               if (to.value) {
                   linkList.push({ from: from.value, to: to.value });
                   from = to;
               }
               else {
                   running = false;
               }
           }
           else {
               running = false;
           }
       }
   
       return linkList;
   };
   
   /** 
    * Loads all of the nodes linked to a node. 
    * @param {*} event  
    * @param {*} dc  
    */
   const linkedNodes = async (event, dc) => {
       return wrapResponse(200, await getLinkedNodes(event.data.id, dc));
   };
   
   const linkedNodesHierarchy = async (event, dc) => {
       let linkedNodes = await getLinkedNodes(event.data.id, dc);
       return wrapResponse(200, hierarchy.createHierarchy(linkedNodes));
   };
   
   const getLinkedNodes = async (id, dc) => {
       const graph = new Graph();
       const g = graph.traversal().withRemote(dc);
       const data = await g.V(id).both().toList();
   
       let nodeDataHolder = [];
   
       for (let element of data) {
           let node = await getNodeFromId(element.id, dc);
           let nodeData = element;
           nodeData.label = nodeData.label.replace(/_/g, "::");
           nodeData.properties = mapToObj(node.value);
           nodeDataHolder.push(nodeData);
       }
   
       // Return the parent as the last element. 
       let inputNode = await getNodeFromId(id, dc);
   
       if (inputNode.value) {
           let parent = {
               id: id,
               properties: mapToObj(inputNode.value),
               parent: true
           }
   
           parent.label = parent.properties.resourceType.replace(/_/g, "::");
   
           nodeDataHolder.push(parent);
       }
   
       return nodeDataHolder;
   };
   
   
   /** 
    * The properties from neptune sometimes come back as an array of one. 
    * If they do then strip out the array. 
    * @param {*} inputMap  
    */
   const mapToObj = (inputMap) => {
       console.log("inputMap");
       console.log(util.inspect(inputMap, { depth: 10 }));
   
       let obj = {};
   
       if (inputMap) {
           Object.keys(inputMap).forEach(key => {
               let value = inputMap[key];
               obj[key] = value.length == 1 ? value[0] : value
           });
       }
   
       return obj;
   };
   
   /** 
    * Load a node from it's id. 
    *  
    * @param {*} id  
    * @param {*} dc  
    */
   const getNodeFromId = async (id, dc) => {
       const graph = new Graph();
       const g = graph.traversal().withRemote(dc);
       const data = await g.V(id).valueMap().next();
       return data;
   };
   
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
   
   const deleteNode = async (nodeId, dc) => {
       const graph = new Graph();
       const g = graph.traversal().withRemote(dc);
       const results = await g.V(nodeId).drop().next();
       return { success: true, results: results }
   };
   
   const buildMap = (things) => {
       let map = new Map();
   
       for (let thing of things) {
           if (!map.get(thing.id)) {
               map.set(thing.id, "here");
           }
       }
   
       return map;
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
           "XXXXXXXXXXXX": [ 
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
   
   const processMap = (data) => {
       let returnObject = {
           properties: {}
       };
   
       Object.keys(data).map(function (key, index) {
           if (key === "id") {
               returnObject["id"] = data[key];
           }
           else if (key === "label") {
               let label = data[key].replace(/_/g, "::");
               returnObject["label"] = label;
           }
   
           else {
               returnObject.properties[key] = getMapValue(data, key);
           }
       });
   
       return returnObject;
   };
   
   // In neptune the same property can be stored many times so the 
   // database returns an array of values.  99.9% of the time I think 
   // that we'll just need the value 
   const getMapValue = (data, key) => {
       let val = data[key];
       return val.length == 1 ? val[0] : val;
   };
   
   const addProperties = async (g, nodeId, properties) => {
       for (let key of Object.keys(properties)) {
           let property = properties[key];
           if (typeof property !== "string") {
               property = JSON.stringify(property);
           }
   
           await g.V(nodeId).property(key, property).next();
       }
   }; `;

   let result = parser.parseNode({code: code, file: "test.js"});

   let expected = { validBuckets: 
    [ 'zoom-discovery-bucket2-aws-4',
      'account-import-template.yml',
      'account-region-template.yml',
      'linked',
      'here'],
   connectionStrings: 
    [ 'zoom-dev-cluster.cluster-cear0sqdk7k7.eu-west-1.neptune.amazonaws.com',
      'zoom-dev-cluster.cluster-cear0sqdk7k.eu-west-1.neptune.amazonaws.com' ],
   dynamoTables: [] };

   expect(result).to.deep.equal(expected);
});