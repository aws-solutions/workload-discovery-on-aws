/**
 * 
 * This module tests the engine behind the DSL that filter queries against Gremlin.
 * 
 * This is a simpler api that only supports filtering.  It was written prior to the EnhancedAPI.
 * 
 * The Enhanced API can do everything that this can do, and more, but is more complex to use...
 * 
 * Here are some example queries.
 * 
 * >>> Example 1 
 * 
 *  {
        "command": "filterNodes",
        "data": {
            "resourceType": "AWS::Lambda::Function"
        }
    }
 * 
 */

const chai = require('chai');
const GremlinMock = require('./mockGremlin');
const QueryBuilder = require('../src/queryBuilder');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();


it('Should build the data structure behind a filter query', async () => {

    const graphTraversal = new GremlinMock();

    const event = {

        "command": "filterNodes",
        "data": {
            "resourceType": "AWS::Lambda::Function"
        }
    }

    // The real result comes back with async functions.  So converting to JSON for now.
    let result = QueryBuilder.buildParameters(event, graphTraversal);

    let jsonResult = JSON.stringify(result);

    const actualResult = JSON.stringify(
        [
            { "parameters": [{ "state": [] }] }, 
            { "parameters": ["resourceType", "AWS::Lambda::Function"] }, 
            { "parameters":["softDelete"] }, 
            { "parameters": [true] },
            { "parameters": [] }
        ]
    );

    assert.deepEqual(jsonResult, actualResult);
});
