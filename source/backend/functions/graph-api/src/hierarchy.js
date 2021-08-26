/**
 * This module parses a list of linear nodes (example in testHierarchy) to 
 * split them into a parent child hierarchy based on account, region, vpc and type.
 * 
 * It should be fairly easy to extend this to include other elements into the hierarchy :-)
 * 
 * So how does it work?
 * 
 * The first stage buildNodeMap creates an intermediate data structure that aggregates all of the data by account, region, vpc and type ( the keys ). 
 * 
 * The keys are a list of things that you want to aggregate by.
 * 
 * The second stage translateHierarchy - recursively walks through the datastucture to build a friendly output. 
 * 
 */
const R = require('ramda');

const createHierarchy = (nodesIn) => {
    let nodes = R.clone(nodesIn);
    let keys = ["account", "region", "vpc", "availabilityZone", "subnet", "type"];
    let nodeMap = buildNodeMap(nodes);
    const hierarchy = buildHierarchy(nodes, nodeMap);
    return filterDuplicates(translateHierarchy(hierarchy, keys, nodeMap, new Map()), new Map());
}

const buildNodeMap = (nodes) => {
    return nodes.reduce((acc, element) => { return acc.set(element.properties.resourceId, element) }, new Map());
};

const translateHierarchy = (hierarchy, inKeys, nodeMap, filterMap) => {
    let keys = R.clone(inKeys);

    if (keys.length === 0) {
        return hierarchy.nodes.map(element => {
            element.type = "node";
            return element;
        });
    }

    let key = keys.shift();
    let data = buildObject(hierarchy, key, nodeMap);

    data.nextObjects.forEach((nextObject, index) => {
        data.results[index].children = translateHierarchy(nextObject, keys, nodeMap, filterMap);

        if (data.results[index].label === "undefined") {
            data.results[index] = data.results[index].children;
        }
    });

    return R.flatten(data.results);
};

const buildHierarchy = (nodes, nodeMap) => {
    let structure = {
        account: {}
    };

    nodes.forEach(node => {
        let subnet = extractData(node.properties, "subnetId");
     
        let mapSubnet = nodeMap.get(subnet);

        // If we already have a subnets full details use those instead of from the node where information might be missing
        let account = mapSubnet ? extractData(mapSubnet.properties, "accountId") : extractData(node.properties, "accountId");
        let region = mapSubnet ? extractData(mapSubnet.properties, "awsRegion") : extractData(node.properties, "awsRegion");
        let vpc = mapSubnet ? extractData(mapSubnet.properties, "vpcId") : extractData(node.properties, "vpcId");
        let availabilityZone = mapSubnet ? extractData(mapSubnet.properties, "availabilityZone") : extractData(node.properties, "availabilityZone");
        
        let type = node.properties.resourceType.split("::")[2];

        let keys = [{ name: "account", value: account }, { name: "region", value: region }, { name: "vpc", value: vpc }, { name: "availabilityZone", value: availabilityZone }, { name: "subnet", value: subnet }, { name: "type", value: type }];

        structure = add(keys, structure, node);
    });

    return structure;
};

const extractData = (node, extractParameter) => {
    return handleUndefined(node[extractParameter]);
};

const handleUndefined = (value) => {
    return value && value !== "Not Applicable" && value !== "Regional" ? value : "undefined";
};

const add = (keys, structure, node) => {
    if (keys.length === 0) {
        if (structure.nodes) {
            structure.nodes.push(node);
            return structure;
        }
        else {
            return { nodes: [node] };
        }
    }

    let key = keys.shift();

    if (!structure[key.name][key.value]) {

        let obj = {};

        if (keys.length > 0) {
            obj[keys[0].name] = {};
        }

        structure[key.name][key.value] = add(keys, obj, node);
    }
    else {
        structure[key.name][key.value] = add(keys, structure[key.name][key.value], node);
    }

    return structure;
};

const buildObject = (structure, selector, nodeMap) => {
    let results = [];
    let nextObjects = [];
    let selected = structure[selector];

    for (let key of Object.keys(selected)) {

        let data = nodeMap.get(key);

        let element = {
            //id : uuidv4(),
            label: key,
            type: selector,
            children: []
        };

        if (data) {
            element.data = data;
            element.id = data.id;
        }

        results.push(element);

        nextObjects.push(structure[selector][key]);
    }

    return { results: results, nextObjects: nextObjects };
};

const filterDuplicates = (elements, filterMap) => {
    if (!elements){
        return [];
    }

    let processed = elements.map(element => {   

        let obj = {};

        if (element.data) {
            filterMap.set(element.id, "element " + element.id);
        }

        obj.label = element.label;
        obj.type = element.type;

        if (element.data){
            obj.id = element.id;
            obj.data = element.data;
        }

        if (element.children){

            if (element.type === "type"){
                obj.children = filter(element.children, filterMap);
                if (obj.children.length === 0){
                    obj = undefined;
                }
            }
            else {
                obj.children = filterDuplicates(element.children, filterMap).filter(n=>n);
                  // The client crashes if it comes across an availability zone that has no children
                if (obj.children.length === 0 && obj.type === "availabilityZone"){
                    console.log("no children so set-to-undefined");
                    obj = undefined;
                }
            }
        }

        return obj;
    });

    return processed;
}

const filter = (children, filterMap) => {
    return children.filter(element => {
        return !filterMap.get(element.id);
    });
}


exports.createHierarchy = createHierarchy;