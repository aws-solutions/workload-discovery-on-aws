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

const valueMap = async (response) => {
    return await response.valueMap(true);
}

const toList = async (response) => {
    return await response.toList();
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
    console.log("==buildParameters==");

    let listOfFunctions = [];
    listOfFunctions.push({ fun: g_v, parameters: [graphTraversal] });

    for (let key of Object.keys(event.data)) {
        console.log("keys", key);
        listOfFunctions.push({ fun: has, parameters: [key, event.data[key]] })
    }

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
    console.log("==runQuery==");

    let functions = buildParameters(event, graphTraversal);

    let response = this;

    for (let funObject of functions) {
        funObject.parameters.unshift(response);
        response = await funObject.fun.apply(this, funObject.parameters);
    }

    return response;
}

const testInput = {
    "command": "multipleLinks",
    "data":
        [
            {
                "and":
                    [
                        {
                            "both":
                            {
                                parameter: "linked",
                                subFunction: [
                                    {
                                        "has":
                                            [
                                                { "resourceId": "aws:cloudformation:logical-id" },
                                                { "resourceValue": "InternetGateway" }
                                            ]
                                    }
                                ]
                            }
                        },
                        {
                            "both":
                            {
                                parameter: "linked",
                                subFunction: [
                                    {
                                        "has":
                                            [
                                                { "resourceId": "vpc-06152e4c3f78a180c" }
                                            ]
                                    }
                                ]
                            }
                        },
                        {
                            "both":
                            {
                                parameter: "linked",
                                subFunction: [
                                    {
                                        "has":
                                            [
                                                { "resourceId": "Name" },
                                                { "resourceValue": "twobytwo-stack" }
                                            ]
                                    }
                                ]
                            }

                        }

                    ]
            }
        ]
}

const both = (response, parameter) => {
    return {build: parameter}
}

const proxy_has = (response, p1, p2) => {
    console.log("==proxy_has==");
    return {has: [response, p1, p2]};
}

const proxy_and = (parameters) => {
    console.log("==proxy_and==", parameters);
    return {and: [parameters]};
}

const getQueryType = (segment) => {
    return Object.keys(segment)[0];
}

const runEnhancedQuery = async (event, graphTraversal) => {
    console.log("==runEnfancedQuery==");

    let stack = [];

    stack.push(await graphTraversal.V());
}

// Closure holding the graph traversal
const processQueryFun = (stack, graphTraversal) => {
    return (segment) => {
        return processQuerySegment(segment, graphTraversal, stack)
    }
}

const buildAndParameters = (event, graphTraversal) => {
    let stack = [{run:"g.v()", parameter: graphTraversal}];
    event.data.map(processQueryFun(stack, graphTraversal));

    console.log("stack after all >", util.inspect(stack, showHidden=false, depth=5, colorize=true));
}

const processQuerySegment = (segment, graphTraversal, stack) => {
    console.log("==processQuerySegment==");
    let queryType = getQueryType(segment);

    switch (queryType) {
        case "and":
            processAnd(segment, graphTraversal, stack);
            break;
        case "both":
            processBoth(segment, graphTraversal, stack);
            break;
        case "has":
            processHas(segment, graphTraversal, stack);
            break;
        default:
            console.log("Error: unsupported query type:", queryType);
    }
}

const processBoth = (segment, graphTraversal, stack) => {
    console.log("==processBoth==");

    let runBoth = both(undefined, segment.both.parameter);
    stack.unshift(runBoth);
    segment.both.subFunction.map(processQueryFun(stack, graphTraversal));
}

const processHas = (segment, graphTraversal, stack) => {
    console.log("==processHas==");
    console.log("has segment> ", segment);
    console.log("has stack> ", stack);

    for (let hasFun of segment.has ){
        let key = Object.keys(hasFun)[0];
        let result = proxy_has(stack.shift(), key, hasFun[key]);
        stack.unshift(result);
    }
}

/**
 * process the "And" query.  And takes in parameters which are functions
 * which need to be run and the results put on a stack.
 * @param {*} segment 
 */
const processAnd = (segment, graphTraversal, stack) => {
    console.log("==processAnd==");

    let firstParameter = stack.shift();

    let parameters = [];

    segment.and.map(processQueryFun(stack, graphTraversal));

    parameters.push(firstParameter);

    // clear all three parameters off the stack
    // TODO: if this gets more complex will need to only
    stack.map(element => {
        parameters.push(element)
    });

    let len = stack.length;

    for (let x=0; x < len; x++){
        stack.shift();
    }

    let result = proxy_and(parameters);
    console.log("result:", result);
    stack.unshift(result);

    console.log("********stack", stack);
}

console.log(buildAndParameters(testInput, "graphTraversal"));


module.exports = {
    runQuery: runQuery,
    runEnhancedQuery, runEnhancedQuery
};