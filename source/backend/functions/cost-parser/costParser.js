const AWS = require('aws-sdk');
const util = require('util');
const readLine = require('readline');
const ddb = new AWS.DynamoDB.DocumentClient();
const dynamoTable = process.env.DynamoCostTable;
const oneDay = 1000 * 60 * 60 * 24;
const timeToKeep = 1000 * 60 * 60 * 24 * 8;  // Eight Days
const unzip = require('unzipper');
const mime = require('mime-types');
const s3 = new AWS.S3();

exports.handler = async (inputEvent) => {
    console.log(JSON.stringify(inputEvent));
    let resourceProcessor = new Map();
    await handleRead(resourceProcessor, inputEvent);
    //console.log(util.inspect(resourceProcessor, {depth:10}));
    await processData(resourceProcessor);
    // // Give it a bit of time to settle
    //await snooze(10000);
    await handleClearDown();
}

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const uploadS3 = params => s3.upload(params).promise();
const deleteS3 = params => s3.deleteObject(params).promise();

const handleClearDown = async (nextToken) => {
    let deleteJobs = [];

    let results = await retry(this, scanDynamo, [nextToken], 5, 200);

    console.log("Scanned in " + results.Items.length + " records");

    let deleteCounter = 0;
    let updateCounter = 0;

    if (results.Items && results.Items.length > 0) {
        for (let data of results.Items) {
            let update = false;
            let newLineItems = [];
            let key;

            data.data.lineItems.forEach(lineItem => {
                let timeInterval = new Date() - new Date(lineItem.endBillingInterval);
                key = lineItem.resourceDayKey;

                if (timeInterval < timeToKeep) {
                    newLineItems.push(lineItem);
                }
                else {
                    update = true;
                }
            });

            if (newLineItems.length === 0) {
                deleteJobs.push(retry(this, deleteDynamo, [key], 5, 200, "deleteDynamo"));
                deleteCounter++;
            }
            else {
                if (update) {
                    deleteJobs.push(putDynamo(key, {
                        lineItems: newLineItems
                    }));
                    updateCounter++;
                }
            }
        }
    }

    await Promise.all(deleteJobs);
    console.log("=========================");
    console.log("Clean-up complete");
    console.log(`${deleteCounter} records removed`);
    console.log(`${updateCounter} records updated`);
    console.log(util.inspect(results.LastEvaluatedKey, { depth: 10 }));

    if (results.LastEvaluatedKey !== undefined) {
        console.log("next token = ");
        console.log(util.inspect(results.LastEvaluatedKey, { depth: 10 }));
        await handleClearDown(results.LastEvaluatedKey);
    }
}

const scanDynamo = async (nextToken) => {
    let params;

    if (nextToken && nextToken.resourceDayKey) {
        params = {
            TableName: dynamoTable,
            ConsistentRead: true,
            ExclusiveStartKey: nextToken
        };
    }
    else {
        params = {
            TableName: dynamoTable,
            ConsistentRead: true
        };
    }

    return await ddb.scan(params).promise();
};

const handleRead = async (resourceProcessor, inputEvent) => {
    let allPromises = [];
    for (let file of inputEvent.Records) {
        console.log("=========================");
        console.log("importing cost data from:");
        console.log("bucket", file.s3.bucket.name);
        console.log("key", file.s3.object.key);
        console.log("=========================");

        if (file.s3.object.key.endsWith(".csv")) {
            await formatData(file.s3.bucket.name, file.s3.object.key, allPromises, resourceProcessor);
            console.log("About to delete:", file.s3.object.key);
            await deleteS3({ Bucket: file.s3.bucket.name, Key: file.s3.object.key });
            console.log("Deleted: ", file.s3.object.key);
        }
        else if (file.s3.object.key.endsWith(".zip")) {
            console.log("about to unzip file:", file.s3.object.key);
            await unzipFile(file.s3.bucket.name, file.s3.object.key);
            console.log(`${file.s3.bucket.name} unzipped successfully!`);
        }
        else {
            console.log("Error Can only process csv files");
        }
    }
    await Promise.all(allPromises);
    console.log(`Finished reading ${allPromises.length} records`);
}

const unzipFile = async (bucketName, key) => {
    await unzip.Open.s3(s3, { Bucket: bucketName, Key: key })
        .then(directory => directory.files.filter(x => x.type !== 'Directory'))
        .then(files => {
            console.log('===============Mapping over files====================');
            console.log(files);
            return files.map(file => {
                const stream = file.stream();
                stream.on('end', () => console.log('S3 upload stream completed'));
                return uploadS3({
                    Body: stream,
                    Bucket: bucketName,
                    ContentType: mime.lookup(file.path) || 'application/x-yaml',
                    Key: file.path
                })
            })
        })
        .then(ps => {
            return Promise.all(ps);
        })
        .then(() => { "files unzipped" })
        .catch(err => console.error(err));
}

const formatData = async (bucketName, key, allPromises, resourceProcessor) => {
    const s3 = new AWS.S3();

    try {
        const bucketParams = {
            Bucket: bucketName,
            Key: key,
        };

        await new Promise((resolve, reject) => {
            let s3Stream = s3.getObject(bucketParams).createReadStream();

            let readlineStream = readLine.createInterface({ input: s3Stream, terminal: false });

            readlineStream.on('line', function (line) {
                if (line.indexOf("identity/Line") === -1) {
                    allPromises.push(processLine(handleLineData, line, resourceProcessor));
                }
            });
            readlineStream.on("close", function () {
                resolve(true);
            });
        });

    } catch (error) {
        console.log("s3 load error:", error);
        return false;
    }
}

const processLine = async (handleLineData, line, resourceProcessor) => {
    let lineData = handleLineData(line);

    //console.log("ResourceId == ", lineData.resourceId);

    // We can only process data that is linked to a resourceId
    if (lineData && lineData.resourceId) {
        let localRecordData = resourceProcessor.get(lineData.resourceDayKey);

        if (!localRecordData) {
            resourceProcessor.set(lineData.resourceDayKey, createNewRecord(lineData));
        }
        else {
            localRecordData.lineItems.push(lineData);
        }
    }
}

const processData = async (resourceProcessor) => {
    let allProcesses = [];
    let func = processLineItem(allProcesses);
    resourceProcessor.forEach(func);
    await Promise.all(allProcesses);
    console.log(`Finished processing ${allProcesses.length} jobs`);
}

const processLineItem = (allProcesses) => {
    return (value, key) => {
        allProcesses.push(asyncProcessLineItem(key, value));
    }
}

const asyncProcessLineItem = async (key, value) => {
    let recordData = await retry(this, getDynamo, [key], 5, 200, "getDynamo");

    if (!recordData) {
        await retry(this, putDynamo, [key, value], 5, 200, "putDynamo");
    }
    else {
        let updated = mergeRecord(value, recordData);

        if (updated) {
            //console.log("record was updated");
            await retry(this, putDynamo, [key, recordData], 5, 200, "putDynamo");
        }
    }
}

const createNewRecord = (lineData) => {
    return {
        lineItems: [lineData]
    }
}

const getDateThreshold = (lineItems) => {
    return lineItems.reduce((date, item) => {
        let startBillingInterval = new Date(item.startBillingInterval);

        if (startBillingInterval > date) {
            return startBillingInterval;
        }

    }, new Date(0));
}

const mergeRecord = (newRecord, oldRecord) => {
    let modified = false;

    let dateThreshold = getDateThreshold(oldRecord.lineItems);
    //console.log(dateThreshold)

    newRecord.lineItems.forEach(newElement => {

        if (new Date(newElement.startBillingInterval) > dateThreshold) {
            //console.log("adding record");
            //console.log(util.inspect(newElement, { depth: 10 }));
            oldRecord.lineItems.push(newElement);
            modified = true;
        }
        //else {
        //console.log("not adding record as past date threshold:");
        //console.log(util.inspect(newElement, { depth: 10 }));
        //}
    });

    return modified;
}

const handleLineData = (line) => {
    let columns = line.split(/,(?=(?:(?:[^'"]*(?:'|")){2})*[^'"]*$)/);
    let data = {};

    addKeyToObject(data, "lineItemId", columns[0]);

    let timeInterval = separateDates(columns[1]);

    addKeyToObject(data, "startBillingInterval", timeInterval[0]);
    addKeyToObject(data, "endBillingInterval", timeInterval[1]);

    let period = new Date(timeInterval[0]) - new Date(timeInterval[1]);

    let billingInterval = "Hourly";

    if (period === oneDay) {
        billingInterval = "Daily";
    }

    addKeyToObject(data, "billingInterval", billingInterval);
    addKeyToObject(data, "billPayerAccount", columns[5]);
    addKeyToObject(data, "usageAccount", columns[8]);
    addKeyToObject(data, "productCode", columns[12]);
    addKeyToObject(data, "usageType", columns[13]);
    addKeyToObject(data, "operation", columns[14]);
    addKeyToObject(data, "availabilityZone", columns[15]);
    addKeyToObject(data, "resourceId", columns[16]);
    addKeyToObject(data, "usageAmount", columns[17]);
    addKeyToObject(data, "currencyCode", columns[20]);
    addKeyToObject(data, "lineItemUnBlendedRate", columns[21]);
    addKeyToObject(data, "lineItemUnblendedCost", columns[22]);
    addKeyToObject(data, "lineItemBlendedRate", columns[23]);
    addKeyToObject(data, "lineItemBlendedCost", columns[24]);
    addKeyToObject(data, "lineItemDescription", columns[25]);
    addKeyToObject(data, "productName", columns[28]);
    addKeyToObject(data, "resourceDayKey", hashKey(columns[16] + "-" + getDayOfYear(timeInterval[0])));

    return data;
}

const addKeyToObject = (object, key, value) => {
    if (value && value.length > 0) {
        object[key] = value;
    }
}

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

const separateDates = (dateString) => {
    return dateString.split("/");
}

const getDynamo = async (key) => {
    let params = {
        Key: {
            resourceDayKey: key
        },
        TableName: dynamoTable,
        ConsistentRead: true
    };

    let data = await ddb.get(params).promise();

    if (data.Item) {
        return data.Item.data;
    }

    return undefined;
};

const putDynamo = async (key, data, retry = 0) => {
    const params = {
        TableName: dynamoTable,
        Item: {
            resourceDayKey: key,
            data
        }
    };

    // Extract the resourceId as a top level field.

    if (data.lineItems.length > 0){
        params.Item.resourceId = data.lineItems[0].resourceId;
    }

    let result = await ddb.put(params).promise();
    return result;
};

const deleteDynamo = async (key) => {
    const params = {
        TableName: dynamoTable,
        Key: {
            resourceDayKey: key
        },
    };

    await ddb.delete(params).promise();
}

const retry = async (environment, caller, callerParameters, retries, sleepTime, functionName) => {
    if (!functionName) {
        functionName = caller.name;
    }

    try {
        if (environment) {
            caller = caller.bind(environment);
        }
        return await caller(...callerParameters);
    }
    catch (error) {
        const metaData = { caller: caller.name, parameters: callerParameters };
        //console.log(`Retry: functionName: ${functionName} retry: ${retries} sleep: ${sleepTime}`);

        if (retries === 0) {
            console.log("Retry count exceeded for ");
            console.log(util.inspect(metaData, { depth: 10 }));
            dumpError(error, metaData);
            throw error;
        }
        else {
            await snooze(sleepTime);
            return await retry(environment, caller, callerParameters, --retries, sleepTime * 2, functionName);
        }
    }
};

const dumpError = (err, metaData) => {
    // A list of errors that we are not too concerned with right now.
    const ignoredErrors = ["Invalid Integration identifier specified", "Rate exceeded", "You have specified a resource that is either unknown or has not been discovered.", "Invalid Method identifier specified"]

    if (typeof err === 'object') {
        ignoredErrors.includes(err.message) ? outputSmallError(err, metaData) : outputFullError(err, metaData);
    } else {
        console.log('dumpError :: argument is not an object');
        console.log(util.inspect(err, { depth: 10 }));
    }
}

const outputSmallError = (err) => {
    console.log('Error Message: ' + err.message);
}

const outputFullError = (err, metaData) => {
    console.log("===================");
    if (err.message) {
        console.log('Error Message: ' + err.message)
    }
    if (err.stack) {
        console.log("====================");
        console.log('Stacktrace:')
        console.log('====================')
        console.log(err.stack);
    }
    if (metaData) {
        console.log("====================");
        console.log('MetaData:')
        console.log('====================')
        console.log(util.inspect(metaData, { depth: 10 }));
    }
}