const R = require('ramda');

const logger = require('./logger');

let identity = v => v;

/**
 * Run a function with exponential backoff
 * @param {*} caller 
 * @param {*} callerParameters 
 * @param {*} retries 
 * @param {*} sleepTime 
 */

const asyncForEach = async (array, callback, binding = false) => {
    for (let element of array) {
        if (binding) {
            callback = callback.bind(binding);
        }
        await callback(element);
    }
};

const parallelForEach = async (array, callback, binding = false) => {
    let jobs = [];

    for (let element of array) {
        if (binding) {
            callback = callback.bind(binding);
        }

        jobs.push(callback(element));
    }

    await Promise.all(jobs);
};

const asyncMap = async (array, callback, binding = false) => {
    let data = [];

    if (binding) {
        callback = callback.bind(binding);
    }

    for (let element of array) {
        data.push(await callback(element));
    }

    return data;
};

// async sleep to throttle api calls 
const asleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const DEFAULT_PARAMS = /=[^,]+/mg;
const FAT_ARROWS = /=>.*$/mg;

const getParameterNames = (fn) => {
    var code = fn.toString()
        .replace(COMMENTS, '')
        .replace(FAT_ARROWS, '')
        .replace(DEFAULT_PARAMS, '');

    var result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
        .match(/([^\s,]+)/g);

    return result === null
        ? []
        : result;
};

/**
 * This function is used to run a consecutive array of functions against an expanding data set to produce
 * the hierarchical data that is added to Neptune.
 * 
 * An example of the data is as follows:
 * 
 * [{
 *   resourceId: '1j9fzhcw0b',
 *   resourceType: 'AWS::ApiGateway::RestApi',
 *   accountId: XXXXXXXXXXX2,
 *   properties:
 *   {
 *       resourceId: '1j9fzhcw0b',
 *       title: '1j9fzhcw0b'
 *   },
 *   children:
 *       [{
 *           resourceId: 'anyftjnx13',
 *           resourceType: 'AWS::ApiGateway::Resource',
 *           accountId: XXXXXXXXXXX2,
 *           children: [],
 *           properties:
 *           {
 *               resourceId: 'anyftjnx13',
 *               title: 'anyftjnx13'
 *           }
 *       }]
 *   }]
 * 
 * The reason for writing this library was to simplfy the code in the data capture modules by breaking it down into a 
 * series of functions which are easier to reason about and test.  
 * 
 * The functions are normally a get, a package and a process.  
 * 
 * Process is used to co-ordinate the get and package.  Get is used to get the data.  Package is used to wrap the data into our format.
 * 
 * A list odf the process functions is passed into this function.
 * 
 * A good example would be api-gateway.js
 * 
 * Here each gateway, has many resources, which have many methods which point at a lambda function.
 * 
 * This is an example of an expanding flow of data.
 * 
 * The first time that expand is called the second parameter is a data element. This data element
 * normally contains the output of the first function run in the chain.  This data is used to
 * bootstrap the process.  The parameters for the subsequent procedures in the chain need to
 * be in the property attribute of the data item. 
 * 
 * @param  {...any} args 
 */
const expand = async (...args) => {
    let binding = args[0];
    let dataFromFirstRun = args[1];
    let functionsToRun = args.slice(2);

    // get the function and its parameters.
    // If the function is an array, this means that we want to run a number of
    // functions at this level.  For example getting all of the tasks associated
    // with an container, but also all of the subnets that they are linked to.
    let functionObject = functionsToRun.map(func => {
        if (Array.isArray(func)) {
            return func.map(f => {
                return createFunctionObject(f);
            })
        }
        return createFunctionObject(func);
    });

    let funResults = await runFunction(binding, dataFromFirstRun, functionObject);

    return funResults;
};

const createFunctionObject = (func) => {
    return {
        function: func,
        params: getParameterNames(func.toString())
    }
};

/**
 * @param {*} binding - Some functions use this.  In this case they need to be bound to the right this.
 * @param {*} datas - A list of data elements.  
 * @param {*} inputFunctionObject - A list of the functions and their parameters.
 */
const runFunction = async (binding, datas, inputFunctionObject) => {
    let functionObject = [...inputFunctionObject];
    let functionToRun = functionObject.shift(functionObject);

    let results = [];

    if (functionToRun) {
        for (let data of datas) {
            if (Array.isArray(functionToRun)) {
                //results.push(await executeFunctionArray(data, functionToRun, binding, functionObject));

                let answer = await executeFunctionArray(data, functionToRun, binding, functionObject);
                results.push(answer);

            }
            else {
                let answer = await executeFunction(data, functionToRun, binding, functionObject, true);
                results.push(answer);
            }
        }
    }

    return results;
};

const flatten = (arr) => {
    return [].concat(...arr)
};

const deepFlatten = (arr) => {
    return flatten(           // return shalowly flattened array
        arr.map(x =>             // with each x in array
            Array.isArray(x)      // is x an array?
                ? deepFlatten(x)    // if yes, return deeply flattened x
                : x                 // if no, return just x
        )
    )
};

const executeFunction = async (data, functionToRun, binding, functionObject, expand) => {
    // Make a copy of the input data
    const dataClone = R.clone(data);

    // If the data is a link then don't run the function. 
    // Links are of the following format and are used to tell the DataClient to link a node
    // rather than add a new one.
    // {
    //     link: 'f1a0dee0730aded0b22398076478a757',
    //     resourceType: 'AWS::S3::Bucket'
    // }

    if (dataClone.link) {
        return dataClone;
    }

    // Extract the parameters for the next function call from the data generated in the previous call.
    let parameters = extractParameters(dataClone, functionToRun.params, functionToRun);

    // Set the binding if needs be.
    if (binding) {
        functionToRun.function = functionToRun.function.bind(binding);
    }

    // Run the function
    let result = await functionToRun.function(...parameters);

    if (Array.isArray(result)) {
        result = flatten(result);
    }

    let children = [];

    if (expand) {
        children = await runFunction(binding, result, functionObject);
    }

    dataClone.children = children.length > 0 ? children : result;

    return dataClone;
};

const executeFunctionArray = async (data, functionArray, binding, functionObject) => {

    // We allow expansion of the first function call only
    let expand = true;

    let ans;

    for (let functionToRun of functionArray) {
        let result = await executeFunction(data, functionToRun, binding, functionObject, expand);

        if (expand) {
            ans = result;
        }
        else {
            ans.children.push(result.children);
        }

        expand = false;
    }

    ans.children = deepFlatten(ans.children).filter(identity);

    return ans;
};

/**
 * @param {*} data - The data that the parameters will be extracted from.
 * @param {*} parameters - The parameters that this function is expecting
 * @param {*} functionToRun - Used to generate a good error message if a paremeter is missing
 */
const extractParameters = (data, parameters, functionToRun) => {
    try {
        return parameters.map(parameter => data.properties[parameter]);
    }
    catch (error) {
        logger.error("======================================");
        logger.error("ZoomUtils expand parameter extract error:");
        logger.error(`Trying to extract parameters ${parameters} for function ${functionToRun.function}`);
        logger.error("The Data that parameters are being extracted from is:");
        logger.error(data);
        logger.error("======================================");
        throw error;
    }
};

// Filter the search results so that one of the return attributes has to be ab
// exact match to the seatch value
const exactMatch = (searchResults, searchValue) => {
    if (searchResults.hits) {
        let filtered = searchResults.hits.hits.filter(object => {
            return traverse(object, searchValue);
        });

        searchResults.hits.hits = filtered;
    }
    return searchResults;
};

const traverse = (object, searchValue) => {
    //We dont want to look in any of these keys.
    const fieldsToIgnore = ["awsRegion", "title", "description"];

    let found = false;

    if (object !== null && typeof object == "object") {
        Object.entries(object).forEach(([key, value]) => {
            if (!fieldsToIgnore.includes(key)) {

                // key is either an array index or object key
                if (searchValue !== value && !found) {
                    // If the value is a string it may be embedded json so try to parseit
                    if (typeof value === "string"){
                        let json = jsonConvert(value);
                        if (json){
                            found = traverse(json, searchValue);
                        }
                    }
                    else {
                        found = traverse(value, searchValue);
                    }
                }
                else {
                    found = true;
                }
            }
        });
    }

    return found;
};

const jsonConvert = (text) => {
    try{
        return JSON.parse(text);
    }
    catch (error) {
        return false;
    }
}

const retry = async (environment, caller, callerParameters, retries, sleepTime, functionName) => {
    if (!functionName){
        functionName = caller.name;
    }

    try {
        if (environment) {
            caller = caller.bind(environment);
        }
        return await caller(...callerParameters);
    }
    catch (error) {
        const metaData = {caller: caller.name, parameters: callerParameters};
        if (error.code === "ResourceNotDiscoveredException") {
            throw error;
        }

        // This error is generated if you look for a get or post method on an API Gateway Integration
        // Which is not found.
        if (error.code === "NotFoundException"){
            return;
        }

        if (retries === 0) {
            logger.error("Retry count exceeded for :");
            logger.error(metaData);
            dumpError(error, metaData);
            throw error;
        }
        else {
            await asleep(sleepTime);
            return await retry(environment, caller, callerParameters, --retries, sleepTime * 2, functionName);
        }
    }
};

const callFunc = async (func, parameters, binding) => { 
    const localParameters = Array.isArray(parameters) ? parameters : [parameters]; 
 
    if (binding){ 
        func = func.bind(binding); 
    } 
    return await func(...localParameters).promise(); 
};

const callAwsApi = async (func, parameters, binding, functionName) => {
    try {
        // setting the timout higher makes things about 45 seconds faster!!!
        return await retry(binding, callFunc, [func, parameters, binding], 6, 5000, functionName);
    }
    catch (error) {
        logger.error("callAwsApi error:");
        dumpError(error);
    }
};

// The getAccountAuthorizationDetails API uses IsTruncated / Marker rather than nextToken?????
const callAwsApiWithMarkPagination = async (func, parameters, binding, apiResults, prevMarker, functionName) => {
    try {
        let results = await retry(binding, callFunc, [func, parameters, binding], 6, 1000, functionName);
        let truncated = results.IsTruncated;

        if (apiResults && results) {
            results.UserDetailList = results.UserDetailList.concat(apiResults.UserDetailList);
            results.GroupDetailList = results.GroupDetailList.concat(apiResults.GroupDetailList);
            results.RoleDetailList = results.RoleDetailList.concat(apiResults.RoleDetailList);
            results.Policies = results.Policies.concat(apiResults.Policies);
        }

        if (!results) {
            return undefined;
        }

        if (truncated && (results.Marker !== prevMarker)) {
            parameters.Marker = results.Marker;
            return await callAwsApiWithMarkPagination(func, parameters, binding, results, results.Marker, functionName);
        }
        else {
            return results;
        }
    }
    catch (error) {
        logger.erro("callAwsApiWithMarkPagination error:");
        dumpError(error);
        return false;
    }
};

const callAwsApiWithPagination = async (func, parameters, binding, apiResults, functionName) => {
    try {
        let results = await retry(binding, callFunc, [func, parameters, binding], 5, 1000, functionName);

        // When called from config advanced query it returns QueryInfo which has to be deleted.
        if (results.QueryInfo){
            delete results.QueryInfo;
        }

        if (apiResults && results) {

            results = merge(results, apiResults);
        }

        if (!results) {
            return undefined;
        }

        if (results.NextToken) {
            parameters.NextToken = results.NextToken;
            return await callAwsApiWithPagination(func, parameters, binding, results, functionName);
        }
        else {
            return results;
        }
    }
    catch (error) {
        logger.error("callAwsApiWithPagination error:");
        dumpError(error);
        return false;
    }
};

const merge = (ina, inb) => {
    let a = R.clone(ina);
    let b = R.clone(inb);

    let nextToken = a.NextToken;

    delete a.NextToken;
    delete b.NextToken;

    let keysA = Object.keys(a);
    let keysB = Object.keys(b);

    if (keysA.length == 1 && keysB.length == 1 && keysA[0] === keysB[0]) {
        let arrayA = a[keysA[0]];
        let arrayB = b[keysB[0]];

        if (Array.isArray(arrayA) && Array.isArray(arrayB)) {
            let o = {};
            o[keysA] = a[keysA].concat(b[keysB]);

            if (nextToken) {
                o.NextToken = nextToken;
            }

            return o;
        }
    }

    logger.error("!!!!!Unable to merge! return a");
    throw new Error('zoomUtils merge error');
};

/**
 * Trying Idea from https://medium.com/@gchudnov/using-es6-proxies-for-polymorphic-functions-54a7e04eb009
 * To see if it works for polymorphic functions
 */
const createMultiMethod = (dispatch, noMatch) => {
    if (typeof dispatch !== 'function') {
        throw new TypeError('dispatch must be a function');
    }

    const dict = {};
    if (typeof noMatch == 'function') {
        dict.noMatch = noMatch;
    }

    return new Proxy(() => { throw new Error('No match'); }, {
        set(target, property, value) {
            dict[property] = value;
            return true;
        },
        apply(target, thisArg, args) {
            const value = dispatch.apply(null, args);
            const func = (value && dict.hasOwnProperty(value)
                ? dict[value]
                : (dict.hasOwnProperty('noMatch')
                    ? dict['noMatch']
                    : target));
            return func.apply(thisArg, args);
        }
    });
}

const outputFullError = (err, metaData) => {
    if (err.message) {
        logger.debug('Error Message: ' + err.message)
    }
    if (err.stack) {
        logger.debug(err.stack);
    }
};

const outputSmallError = (err) => {
    logger.error('Error Message: ' + err.message);
}

const dumpError = (err, metaData) => {
    // A list of errors that we are not too concerned with right now.
    const ignoredErrors = ["Invalid Integration identifier specified", "Rate exceeded", "You have specified a resource that is either unknown or has not been discovered.", "Invalid Method identifier specified"]

    if (typeof err === 'object') {
        ignoredErrors.includes(err.message) ? outputSmallError(err, metaData) : outputFullError(err, metaData);
    } else {
        logger.error('dumpError :: argument is not an object');
        logger.error(err);
    }
}

const wrapOutput = async (fun, parameters, binding = false) => {
    const startTime = new Date();
    let moduleName = binding ? binding.constructor.name : "unknown";
    let funName = fun.name;

    logger.profile(`${moduleName}.${fun.name}`);
    let result;
    try {
        if (binding){
            fun = fun.bind(binding);
        }
        result = await fun(...parameters);
    }
    catch (error) {
        dumpError(error);
    }
    const endTime = new Date();
    const diffSeconds = Math.round((endTime - startTime) / 1000);
    logger.profile(`${moduleName}.${fun.name}`);
    return result;
}

const convertToObject = (data) => {
    return data.reduce((acc, element) => {
        acc[element.Key] = element.Value
        return acc;
    },{});
}

exports.exactMatch = exactMatch;
exports.retry = retry;
exports.asyncForEach = asyncForEach;
exports.asyncMap = asyncMap;
exports.expand = expand;
exports.parallelForEach = parallelForEach;
exports.callAwsApi = callAwsApi;
exports.callAwsApiWithPagination = callAwsApiWithPagination;
exports.callAwsApiWithMarkPagination = callAwsApiWithMarkPagination;
exports.merge = merge;
exports.identity = identity;
exports.createMultiMethod = createMultiMethod;
exports.dumpError = dumpError;
exports.wrapOutput = wrapOutput;
exports.asleep = asleep;
exports.convertToObject = convertToObject;
