/**
 * Pull the data for a given resource form the costDynamo table
 */

const AWS = require('aws-sdk');
const util = require('util');
const gremlin = require('gremlin');

const Graph = gremlin.structure.Graph;
const { t: { id } } = gremlin.process;
const __ = gremlin.process.statics;
const p = gremlin.process.P;

const R = require('ramda');

const oneDay = 1000 * 60 * 60 * 24;

const ddb = new AWS.DynamoDB.DocumentClient();
const dynamoTable = process.env.DynamoCostTable;

const getCostData = async (node, g) => {
    console.log(`Getting cost data for arn ${node.properties.arn} type: ${node.properties.resourceType}`);

    try {
        switch (node.properties.resourceType) {
            case "AWS::EC2::SpotFleet":
                return await getCostDataSpotFleet(node, g);
            default:
                return await getCostDataOthers(node.properties)
        }
    }
    catch (Error) {
        console.log(util.inspect(Error, { depth: 10 }));
        return [];
    }
}

const mapToObj = R.map(v => Array.isArray(v) ? v[0] : v);

const getCostDataSpotFleet = async (node, g) => {
    let linkedSpot = await g.V(node.id).repeat(__.both()).until(__.has("resourceType", "AWS::EC2::NetworkInterface").or().loops().is(p.eq(5))).dedup().valueMap(true).toList();

    let linked = linkedSpot.map(v => ({
        id: v.id,
        perspectiveBirthDate: v.perspectiveBirthDate ? v.perspectiveBirthDate[0] : undefined,
        label: v.label.replace(/_/g, "::"),
        properties: mapToObj(R.omit(['id', 'label'], v)),
        parent: v.id === id
    }));


    console.log("linkedSpot");
    console.log(util.inspect(linked, { depth: 10 }));

    let totalCost = 0;

    console.log("starting total cost");
    for (let element of linked) {
        let c = await getCostDataOthers(element.properties);
        if (c) {
            totalCost += c.totalCost;
        }
    }

    console.log("total cost:", totalCost);

    return { totalCost: totalCost, currency: "USD", ignore: true };
}

const getCostDataOthers = async (nodeProperties) => {
    let resourceKey = getResourceKey(nodeProperties);

    if (resourceKey) {
        let keys = getHashKeys(resourceKey);

        //let promises = keys.map(key => {
        //    return getDynamo(key);
        //});

        let allData = await getBatchDynamo(keys);//Promise.all(promises);
        let costData = mergeCostItems(allData);

        let totalCostValue = totalCost(costData.costLineItems);
        let dateRange = calcDateRange(costData.costLineItems);

        console.log(`Cost for ${nodeProperties.resourceId} = ${totalCostValue}`);
        return { totalCost: totalCostValue, currency: "USD", startDate: dateRange.startDate, endDate: dateRange.endDate };
    }
}

const mergeCostItems = (data) => {
    return data.reduce((acc, item) => {
        if (item && item.lineItems) {
            let concatList = acc.costLineItems;
            concatList = concatList.concat(item.lineItems);
            acc.costLineItems = concatList;
            return acc;
        }
        return acc;
    }, { costLineItems: [] });
}

const totalCost = (lineItems) => {
    return lineItems.reduce((acc, item) => {
        acc += Number(item.lineItemBlendedCost);
        return acc;
    }, 0);
}

const calcDateRange = (lineItems) => {
    return lineItems.reduce((acc, item) => {
        let sd = new Date(item.startBillingInterval);
        let ed = new Date(item.endBillingInterval);

        if (sd < acc.startDate) {
            acc.startDate = sd;
        }
        if (ed > acc.endDate) {
            acc.endDate = ed;
        }

        return acc;
    }, { startDate: new Date(), endDate: new Date(0) });
}

const getResourceKey = (properties) => {
    switch (properties.resourceType) {
        case "AWS::EC2::Instance":
            return properties.resourceId;
        case "AWS::S3::Bucket":
            return properties.name;
        default:
            return properties.arn;
    }
}

const getDynamo = async (key) => {
    let params = {
        Key: {
            resourceDayKey: key
        },
        TableName: dynamoTable
    };

    let data = await ddb.get(params).promise();

    if (data.Item) {
        return data.Item.data;
    }

    return undefined;
};


const getBatchDynamo = async (keys) => {
    let keyObject = keys.map(k => {
        return {
            resourceDayKey: k
        }
    });

    let params = {
        RequestItems: {
            [dynamoTable] : {
                Keys : {
                }
            }
        }
    };

    params.RequestItems[dynamoTable].Keys = keyObject;

    let data = await ddb.batchGet(params).promise();

    if (data.Responses) {
        return data.Responses[dynamoTable].map(record => record.data);
    }

    return [];
};

const hashKey = key => {
    const crypto = require('crypto');
    const algo = 'md5';
    let shasum = crypto.createHash(algo).update(key);
    return "" + shasum.digest('hex');
}

const getDayOfYear = (inputDate) => {
    const now = new Date(inputDate);
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const day = Math.floor(diff / oneDay);
    return day;
}

const getHashKeys = (resourceId) => {
    console.log(`key for resourceId ${resourceId} = ${resourceId + "-" + getDayOfYear(minusDays(1))}`);
    return [
        hashKey(resourceId + "-" + getDayOfYear(minusDays(1))),
        hashKey(resourceId + "-" + getDayOfYear(minusDays(2))),
        hashKey(resourceId + "-" + getDayOfYear(minusDays(3))),
        hashKey(resourceId + "-" + getDayOfYear(minusDays(4))),
        hashKey(resourceId + "-" + getDayOfYear(minusDays(5))),
        hashKey(resourceId + "-" + getDayOfYear(minusDays(6))),
        hashKey(resourceId + "-" + getDayOfYear(minusDays(7)))
    ];
}

const minusDays = (days) => {
    let date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

exports.getCostData = getCostData;
