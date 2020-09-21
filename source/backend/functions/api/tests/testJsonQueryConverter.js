/**
 * These test the enhanced query builder in reverse.  I.e. you give it a json file
 * and it builds a gremlin query.
 */

const chai = require('chai');
const GremlinMock = require('./mockQueryConverter');
//const GremlinRootMock = require('./mockRootGremlin');
const QueryBuilder = require('../src/queryBuilder');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should generate the gremlin for a has query.', async () => {
    const graphTraversal = new GremlinMock();

    const event = {
        "command": "runGremlin",
        "data": [
            {
                "has": [
                    {
                        "resourceId": "aws:cloudformation:logical-id"
                    }
                ]
            }
        ]
    };

    const result = await QueryBuilder.runEnhancedQuery(event, graphTraversal, graphTraversal);

    let expected = `g.V().has("resourceId","aws:cloudformation:logical-id").hasNot("softDeleted").valueMap().toList()`;
    assert.equal(expected, result);
});

it('Should generate the gremlin for a has query.', async () => {
    const graphTraversal = new GremlinMock();

    const event = {
        "command": "runGremlin",
        "data": [
            {
                "as": {
                    "parameter": "a"
                }
            },
            {
                "where": [
                    {
                        "both": {
                            "parameter": "linked",
                            "subFunction": [
                                {
                                    "count": {}
                                },
                                {
                                    "is": {
                                        "parameter": 0
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            {
                "select": {
                    "parameter": "a"
                }
            },
            {
                "has": [
                    {
                        "resourceType": "AWS::VPC::Endpoint"
                    }
                ]
            }
        ]
    };

    const result = await QueryBuilder.runEnhancedQuery(event, graphTraversal, graphTraversal);
    let expected = `g.V().as("a").where(__.both("linked").count().is(0)).select("a").has("resourceType","AWS::VPC::Endpoint").hasNot("softDeleted").valueMap().toList()`;
    assert.equal(expected, result);
});

it('Should generate the gremlin for an and query.', async () => {
    const graphTraversal = new GremlinMock();

    const event = {
        "command": "runGremlin",
        "data": [
            {
                "and": [
                    {
                        "both": {
                            "parameter": "linked",
                            "subFunction": [
                                {
                                    "has": [
                                        {
                                            "resourceId": "app_name"
                                        },
                                        {
                                            "resourceValue": "twobytwo"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "both": {
                            "parameter": "linked",
                            "subFunction": [
                                {
                                    "has": [
                                        {
                                            "resourceId": "tier"
                                        },
                                        {
                                            "resourceValue": "frontend"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "both": {
                            "parameter": "linked",
                            "subFunction": [
                                {
                                    "has": [
                                        {
                                            "resourceId": "subnet-e8ad18b2"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    };

    const result = await QueryBuilder.runEnhancedQuery(event, graphTraversal, graphTraversal);
    let expected = `g.V().and(__.both("linked").has("resourceId","app_name").has("resourceValue","twobytwo"),__.both("linked").has("resourceId","tier").has("resourceValue","frontend"),__.both("linked").has("resourceId","subnet-e8ad18b2")).hasNot("softDeleted").valueMap().toList()`;
    assert.equal(expected, result);
});


it('Should generate the gremlin for a not query.', async () => {
    const graphTraversal = new GremlinMock();

    const event = {
        "command": "runGremlin",
        "data": [
            {
                "has": [
                    {
                        "resourceType": "AWS::EC2::Volume"
                    }
                ]
            },
            {
                "not": [
                    {
                        "both": {
                            "parameter": "linked",
                            "subFunction": [
                                {
                                    "or": [
                                        {
                                            "has": [
                                                {
                                                    "resourceType": {
                                                        subFunction:
                                                            { "neq": "AWS::TAGS::TAG" }
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            "has": [
                                                {
                                                    "resourceType": {
                                                        subFunction:
                                                            { "neq": "AWS::EC2::Instance" }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    };

    const result = await QueryBuilder.runEnhancedQuery(event, graphTraversal, graphTraversal);
    let expected = `g.V().has("resourceType","AWS::EC2::Volume").not(__.both("linked").or(__.has("resourceType",p.neq("AWS::TAGS::TAG")),__.has("resourceType",p.neq("AWS::EC2::Instance")))).hasNot("softDeleted").valueMap().toList()`;
    assert.equal(expected, result);
});

it('Should generate the gremlin for a where, or and query.', async () => {
    const graphTraversal = new GremlinMock();

    const event = {
        "command": "runGremlin",
        "data": [
            {
                "has": [{
                    "resourceType": "AWS::EC2::Volume"
                }]
            },
            {
                "where": [{
                    "or": [{
                        "both": {
                            "parameter": "linked",
                            "subFunction": [{
                                "count": {}
                            },
                            {
                                "is": {
                                    "parameter": 0
                                }
                            }
                            ]
                        }
                    },
                    {
                        "and": [{
                            "both": {
                                "parameter": "linked",
                                "subFunction": [{
                                    "count": {}
                                },
                                {
                                    "is": {
                                        "parameter": 1
                                    }
                                }
                                ]
                            }
                        },
                        {
                            "both": {
                                "parameter": "linked",
                                "subFunction": [{
                                    "has": [{
                                        "resourceType": "AWS::TAGS::TAG"
                                    }]
                                }]
                            }
                        }
                        ]
                    }
                    ]
                }]
            }
        ]
    };

    const result = await QueryBuilder.runEnhancedQuery(event, graphTraversal, graphTraversal);
    let expected = `g.V().has("resourceType","AWS::EC2::Volume").where(__.or(__.both("linked").count().is(0),__.and(__.both("linked").count().is(1),__.both("linked").has("resourceType","AWS::TAGS::TAG")))).hasNot("softDeleted").valueMap().toList()`; 
    assert.equal(expected, result);
});



