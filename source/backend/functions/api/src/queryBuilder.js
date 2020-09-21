/** 
 * Gremlin is a DSL.
 * 
 * As such queries are written like this
 * 
 * const data = await g.V().has('resourceId', event.data.resourceId).has('resourceType', event.data.resourceType).valueMap(true).toList();
 * 
 * This is great, but how do you build queries that take an unknown number of parameters?
 * 
 * There probably is a part of the DSL that takes in an array of parameters, but I can't find it.  So I wrote this.
 * 
 * It looks like the DSL curries the functions, so this module de-curries them so that we can build
 * our own chain of functions.
 * 
*/

const gremlin = require('gremlin');
const { t: { id } } = gremlin.process;
const __ = gremlin.process.statics;
const p = gremlin.process.P;
const util = require('util');

/**
 *  Make each of the functions addressable from a variable
 */

const g_v = async (_response, g) => {
    return await g.V();
}

const has = async (response, p1, p2) => {
    return await response.has(p1, p2);
}

const hasNot = async (response, p1) => {
    return await response.hasNot(p1);
}

const __has = async (p1, p2, root, stack) => {
    // TODO: This is purely for testing.......I'll find a better way to do this!!!
    stack.unshift("--chain--");
    stack.shift()
    let ans = await root.has(p1, p2);
    stack.unshift("--chainStop--");
    stack.shift()
    return ans;
}

const valueMap = async (response) => {
    return await response.valueMap(true);
}

const toList = async (response) => {
    return await response.toList();
}

const as = async (response, p1) => {
    return await response.as(p1);
}

const select = async (response, p1) => {
    return await response.select(p1);
}

const both = async (response, p1) => {
    return await response.both(p1);
}

const __both = async (p1, root) => {
    return await root.both(p1);
}

const is = async (response, p1) => {
    return await response.is(p1);
}

const count = async (response) => {
    return await response.count();
}

const where = async (response, parameters) => {
    return await response.where(...parameters);
}

const and = async (response, parameters) => {
    // Use the spread operator to convert a list of parameters into the
    // actual parameters
    return await response.and(...parameters);
}

const or = async (response, parameters) => {
    // Use the spread operator to convert a list of parameters into the
    // actual parameters
    return await response.or(...parameters);
}

const not = async (response, parameters) => {
    return await response.not(...parameters);
}

/**
 * Build the parameters list 
 * 
 * An array of objects in the form {fun:<>, parameters:[]}
 * 
 * @param {*} event 
 * @param {*} graphTraversal 
 */
const buildParameters = (event, graphTraversal) => {
    let listOfFunctions = [];
    listOfFunctions.push({ fun: g_v, parameters: [graphTraversal] });

    for (let key of Object.keys(event.data)) {
        listOfFunctions.push({ fun: has, parameters: [key, event.data[key]] })
    }

    // Don't load soft deleted nodes
    listOfFunctions.push({ fun: hasNot, parameters: ["softDelete"]});
    
    listOfFunctions.push({ fun: valueMap, parameters: [true] });
    listOfFunctions.push({ fun: toList, parameters: [] });

    return listOfFunctions;
}

/**
 * Use the apply function to run the functions.
 * 
 * Note that the first parameter of every function is the result of the previous
 * function.  Hence the unshift of the response.  This adds the output of the
 * previous function as the first parameter to the next function.
 * 
 * @param {*} event 
 * @param {*} graphTraversal 
 */
const runQuery = async (event, graphTraversal) => {
    let functions = buildParameters(event, graphTraversal);

    let response = this;

    for (let funObject of functions) {
        funObject.parameters.unshift(response);
        response = await funObject.fun.apply(this, funObject.parameters);
    }

    return response;
}

/**
 * Runs queries gremlin queries using a JSON DSL
 * Please see testQueryBuilder for examples.
 * 
 * Can support a wider range of query types.
 * @param {*} event 
 * @param {*} graphTraversal
 * @param {*} root - optional parameter - used to inject __ for testing.   
 */
const runEnhancedQuery = async (event, graphTraversal, root = __) => {
    let stack = graphTraversal.mock ? graphTraversal : [];
    stack.push(await graphTraversal.V());

    for (let segment of event.data) {
        await processQuerySegment(segment, stack, root);
    }

    let d = stack.shift();

    // Disable searching for softDeleted nodes
    let softDelete = await hasNot(d, "softDeleted");

    // Run the valueMap and toList part of the function chain.
    let ans = await valueMap(softDelete);
    let ans2 = await toList(ans);
    return ans2;
}

/**
 * Get the type of the function to be run.
 * 
 * @param {*} segment 
 */
const getQueryType = (segment) => {
    return Object.keys(segment)[0];
}

/**
 * Router function.  Checks the call type and calls the
 * routes to the right function.  This is called recursively
 * from within the process functions.
 * 
 * @param {*} segment 
 * @param {*} stack 
 */
const processQuerySegment = async (segment, stack, root, underscore = false) => {
    let queryType = getQueryType(segment);

    switch (queryType) {
        case "and":
            await processHigherOrder(segment, stack, "and", and, root, underscore);
            break;
        case "or":
            await processHigherOrder(segment, stack, "or", or, root, underscore);
            break;
        case "where":
            await processHigherOrder(segment, stack, "where", where, root, underscore);
            break;
        case "not":
            await processHigherOrder(segment, stack, "not", not, root, underscore);
            break;
        case "both":
            await processBoth(segment, stack, root, underscore);
            break;
        case "has":
            await processHas(segment, stack, root, underscore);
            break;
        case "as":
            await processAs(segment, stack);
            break;
        case "select":
            await processSelect(segment, stack);
            break;
        case "is":
            await processIs(segment, stack);
            break;
        case "count":
            await processCount(segment, stack);
            break;

        default:
            console.log("Error: unsupported query type:", queryType);
    }
}

const processCount = async (segment, stack) => {
    let result = await count(stack.shift());
    stack.unshift(result);
}

const processIs = async (segment, stack) => {
    let result = await is(stack.shift(), segment.is.parameter);
    stack.unshift(result);
}

const processSelect = async (segment, stack) => {
    let result = await select(stack.shift(), segment.select.parameter);
    stack.unshift(result);
}

const processAs = async (segment, stack) => {
    let result = await as(stack.shift(), segment.as.parameter);
    stack.unshift(result);
}

/**
 * Runs the both function.  Both is used to look for
 * links between nodes in two directions.
 * 
 * Both is a special case as it does not run on
 * the result of another function.  So can be called
 * using __both ( which runs the function against the graph rather than the results of previous computation)
 * 
 * @param {*} segment 
 * @param {*} stack 
 */

const processBoth = async (segment, stack, root, underscore) => {
    return underscore ?
        await underScoreProcessBoth(segment, stack, root, underscore)
        : await noUnderscoreProcessBoth(segment, stack, root, underscore);
}

const underScoreProcessBoth = async (segment, stack, root, underscore) => {
    // If there is a subfunction then it is probable that we need to call both from __.
    if (segment.both.subFunction) {
        // TODO: This is purely for testing.......I'll find a better way to do this!!!
        stack.unshift("--chain--");
        stack.shift();

        let runBoth = await __both(segment.both.parameter, root);

        // This is where we are adding to the stack.
        stack.unshift(runBoth);

        for (let subSegment of segment.both.subFunction) {
            // Recursively call boths' sub-functions
            await processQuerySegment(subSegment, stack, root);
        }

        // TODO: This is purely for testing.......I'll find a better way to do this!!!
        stack.unshift("--chainStop--");
        stack.shift();
    }
    else {
        let result = await __both(segment.both.parameter, root);
        stack.unshift(result);
    }
}

const noUnderscoreProcessBoth = async (segment, stack, root, underscore) => {
    // If there is a subfunction then it is probable that we need to call both from __.
    if (segment.both.subFunction) {
        let runBoth = await both(segment.both.parameter, root);
        stack.unshift(runBoth);

        for (let subSegment of segment.both.subFunction) {
            // Recursively call boths' sub-functions
            await processQuerySegment(subSegment, stack, root);
        }
    }
    else {
        let result = await both(stack.shift(), segment.both.parameter);
        stack.unshift(result);
    }
}

/**
 * Runs the has function.  The has function make sure that
 * a node has one or many parameters.
 * @param {*} segment 
 * @param {*} stack 
 */
const processHas = async (segment, stack, root, underscore) => {
    return underscore ?
        await underScoreProcessHas(segment, stack, root, underscore)
        : await noUnderscoreProcessHas(segment, stack, root, underscore);
}

const underScoreProcessHas = async (segment, stack, root, underscore) => {
    // we want to call __has for the first iteration of this loop

    let first = true;
    for (let hasFun of segment.has) {
        let key = Object.keys(hasFun)[0];
        let result = first ? await __has(key, await runSubFunction(hasFun[key]), root, stack)
            : await has(stack.shift(), key, hasFun[key]);
        first = false;
        stack.unshift(result);
    }
}

const noUnderscoreProcessHas = async (segment, stack, root, underscore) => {
    for (let hasFun of segment.has) {
        let key = Object.keys(hasFun)[0];
        let result = await has(stack.shift(), key, await runSubFunction(hasFun[key]));
        stack.unshift(result);
    }
}

const runSubFunction = async (input) => {
    if (typeof input === "string") {
        return input;
    }
    else if (input.subFunction) {
        let key = Object.keys(input.subFunction)[0];
        let parameter = input.subFunction[key];

        switch (key) {
            case "neq":
                return await p.neq(parameter);
            case "eq":
                return await p.eq(parameter);
            case "gt":
                return await p.gt(parameter);
            case "gte":
                return await p.gte(parameter);
            case "lt":
                return await p.lt(parameter);
            case "lte":
                return await p.lte(parameter);
            default:
                throw ("Unknown subfunction " + key);
        }
    }
}

/**
 * Functions like where, and, or take in a chain of functions
 * @param {*} segment 
 * @param {*} stack 
 * @param {*} selector 
 * @param {*} func 
 * @param {*} underscore - If this is set to true then the last function to run was a higher order function.
 *                         Therefore run this from root (__.) rather than the first parameter.
 */
const processHigherOrder = async (segment, stack, selector, func, root, underscore) => {
    // When you call a gremlin function, the first parameter of the function is
    // either the root (__.) or the results of the last function calls.  
    let firstParameter = underscore ? root : stack.shift();

    if (underscore){
        stack.unshift("--underscore--");
        stack.shift();
    }

    stack.unshift("--Frame--");

    let parameters = [];
    for (let subSegment of segment[selector]) {
        // Recursively call sub-functions
        await processQuerySegment(subSegment, stack, root, true);
    }

    // clear any parameters off the stack till they hit the stack frame
    let element;
    while ((element = stack.shift()) !== "--Frame--") {
        parameters.push(element);
    }

    // Actually run the function.
    let result = await func(firstParameter, parameters);

    // Add the results to the stack
    stack.unshift(result);
}

module.exports = {
    runQuery: runQuery,
    runEnhancedQuery: runEnhancedQuery,
    buildParameters: buildParameters
};