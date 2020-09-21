const AWS = require('aws-sdk');
const util = require('util');
const ddb = new AWS.DynamoDB.DocumentClient();
const dynamoTable = process.env.DynamoCostTable;

exports.handler = async (inputEvent) => {
    console.log("starting delete");
    await handleClearDown();
    console.log("delete finished");
}

const handleClearDown = async (nextToken) => {
    let deleteJobs = [];

    let results = await retry(this, scanDynamo, [nextToken], 5, 200);

    console.log("Scanned in " + results.Items.length + " records");

    let deleteCounter = 0;
    let updateCounter = 0;

    if (results.Items && results.Items.length > 0) {
        for (let data of results.Items) {
            console.log("deleting : ", data.resourceDayKey);
            deleteJobs.push(retry(this, deleteDynamo, [data.resourceDayKey], 5, 200, "deleteDynamo"));
            deleteCounter++;
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


const deleteDynamo = async (key) => {
    const params = {
        TableName: dynamoTable,
        Key: {
            resourceDayKey: key
        },
    };

    await ddb.delete(params).promise();
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

