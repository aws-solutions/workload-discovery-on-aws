/**
 * 
 * This module tests the engine behind the enhanced DSL that runs Gremlin queries.
 * 
 * Here are some example queries, and the gremlin that they generate:
 * 
 * >>> Example 1 - A and query that checks node links.
 * 
 * {
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
  }

  Equivalent to:

   const data = await g.V()
   .and(
     __.both("linked").has("resourceId", "app_name").has("resourceValue", "twobytwo"),
     __.both("linked").has("resourceId", "tier").has("resourceValue", "frontend"),
     __.both("linked").has("resourceId", "subnet-e8ad182b")
   )
   .valueMap(true).toList();


   >>> Example 2 - A Has query

   {
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
  }

  Equivalent to:

  const data = await g.V().has("resourceId": "aws:cloudformation:logical-id")

  >>> Example 3 - A linked node query

  {
    "command": "runGremlin",
    "data": [
        {
            "has": [
                {
                    "arn": "arn:aws:lambda:us-east-2:XXXXXXXXXXXX:function:gremlin"
                }
            ]
        },
        {
            "as": {
                "parameter": "a"
            }
        },
        {
            "both": {
                "parameter": "linked"
            }
        },
        {
            "has": [
                {
                    "resourceId": "XXX"
                }
            ]
        },
        {
            "select": {
                "parameter": "a"
            }
        }
        ]
    }

    Equivalent to:

    const data = await g.V().has("arn", "arn:aws:lambda:us-east-2:XXXXXXXXXXXX:function:gremlin").as("a")
                            .both("linked")
                            .has("resourceId", "XXXXXXXXXXXX")
                            .select("a")
                            .valueMap(true)
                            .toList();

    >>> Example 4 - Tests that Linked nodes are greater than a set value

    {
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
  }

  Equivalent to:

    const data = await g.V().as('a').where(__.both("linked").count().is(event.data.cardinality)).select('a').has("resourceType", "AWS::VPC::Endpoint").valueMap().toList();
 
  >>> Example 4 - get all of the volumes that are not linked to nodes that have either a tag or an instance

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

  Equivalent to:

  const data = await g.V().has("resourceType", "AWS::EC2::Volume")
    .not(
      __.both("linked")
        .or(
          __.has("resourceType", p.neq("AWS::TAGS::TAG")),
          __.has("resourceType", p.neq("AWS::EC2::Instance"))
        )
      )
    .valueMap(true)
    .toList();
  * 
 */

const chai = require('chai');
const GremlinMock = require('./mockGremlin');
const GremlinRootMock = require('./mockRootGremlin');
const QueryBuilder = require('../src/queryBuilder');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should give desired state when manually running gremlin mock', async () => {
  const graphTraversal = new GremlinMock();
  let result = graphTraversal.V().has(1, 2).toList();

  expect(result).to.deep.equal([{ function: "Vertex", parameters: undefined }, { function: "Has", parameters: [1, 2] }]);
});

/**
 *  Equivalent to:
 * 
 *  g.V()
 *   .and(
 *     __.both("linked").has("resourceId", "app_name").has("resourceValue", "twobytwo"),
 *     __.both("linked").has("resourceId", "tier").has("resourceValue", "frontend"),
 *     __.both("linked").has("resourceId", "subnet-e8ad182b")
 *   )
 *    .valueMap(true).toList();
 **/
it('Should run a "and" query.  The resulting stack trace should be in the order that the queries would be run in neptune.', async () => {
  const graphTraversal = new GremlinMock();
  const rootTraversal = new GremlinRootMock(graphTraversal);

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

  const result = await QueryBuilder.runEnhancedQuery(event, graphTraversal, rootTraversal);

  const actualResult =
    [{ function: 'Vertex', parameters: undefined },
    { function: '_Both', parameters: 'linked' },
    { function: 'Has', parameters: ['resourceId', 'app_name'] },
    { function: 'Has', parameters: ['resourceValue', 'twobytwo'] },
    { function: '_Both', parameters: 'linked' },
    { function: 'Has', parameters: ['resourceId', 'tier'] },
    { function: 'Has', parameters: ['resourceValue', 'frontend'] },
    { function: '_Both', parameters: 'linked' },
    {
      function: 'Has',
      parameters: ['resourceId', 'subnet-e8ad18b2']
    },
    {
      function: 'And',
      parameters:
        [{
          state:
            [{ function: 'Vertex', parameters: undefined },
            { function: '_Both', parameters: 'linked' },
            { function: 'Has', parameters: ['resourceId', 'app_name'] },
            { function: 'Has', parameters: ['resourceValue', 'twobytwo'] },
            { function: '_Both', parameters: 'linked' },
            { function: 'Has', parameters: ['resourceId', 'tier'] },
            { function: 'Has', parameters: ['resourceValue', 'frontend'] },
            { function: '_Both', parameters: 'linked' },
            {
              function: 'Has',
              parameters: ['resourceId', 'subnet-e8ad18b2']
            }]
        },
        {
          state:
            [{ function: 'Vertex', parameters: undefined },
            { function: '_Both', parameters: 'linked' },
            { function: 'Has', parameters: ['resourceId', 'app_name'] },
            { function: 'Has', parameters: ['resourceValue', 'twobytwo'] },
            { function: '_Both', parameters: 'linked' },
            { function: 'Has', parameters: ['resourceId', 'tier'] },
            { function: 'Has', parameters: ['resourceValue', 'frontend'] },
            { function: '_Both', parameters: 'linked' },
            {
              function: 'Has',
              parameters: ['resourceId', 'subnet-e8ad18b2']
            }]
        },
        {
          state:
            [{ function: 'Vertex', parameters: undefined },
            { function: '_Both', parameters: 'linked' },
            { function: 'Has', parameters: ['resourceId', 'app_name'] },
            { function: 'Has', parameters: ['resourceValue', 'twobytwo'] },
            { function: '_Both', parameters: 'linked' },
            { function: 'Has', parameters: ['resourceId', 'tier'] },
            { function: 'Has', parameters: ['resourceValue', 'frontend'] },
            { function: '_Both', parameters: 'linked' },
            {
              function: 'Has',
              parameters: ['resourceId', 'subnet-e8ad18b2']
            }]
        }]
    },
    { function: "HasNot", parameters: ["softDeleted"] },
    { function: 'ValueMap', parameters: true }]

  assert.deepEqual(result, actualResult);
});

/**
 * Equivalent To:
 * 
 * g.V().as('a')
 *  .where(
 *      __.both("linked").count().is(event.data.cardinality)
 *  )
 *  .select('a').has("resourceType", "AWS::VPC::Endpoint").valueMap().toList();
 * 
 **/
it('Should run a "count" query.  The resulting stack trace should be in the order that the queries would be run in neptune.', async () => {
  const graphTraversal = new GremlinMock();
  const rootTraversal = new GremlinRootMock(graphTraversal);

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

  const result = await QueryBuilder.runEnhancedQuery(event, graphTraversal, rootTraversal);

  const actualResult =
    [{ function: 'Vertex', parameters: undefined },
    { function: 'As', parameters: 'a' },
    { function: '_Both', parameters: 'linked' },
    { function: 'Count', parameters: undefined },
    { function: 'Is', parameters: undefined },
    { function: 'Where', parameters: undefined },
    { function: 'Select', parameters: 'a' },
    {
      function: 'Has',
      parameters: ['resourceType', 'AWS::VPC::Endpoint']
    },
    { function: "HasNot", parameters: ["softDeleted"] },
    { function: 'ValueMap', parameters: true }
    ];

  assert.deepEqual(result, actualResult);
});

/**
 * Equivalent To:
 * 
 * g.V().has("resourceId": "aws:cloudformation:logical-id")
 **/
it('Should run a "has" query.  The resulting stack trace should be in the order that the queries would be run in neptune.', async () => {
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

  let actualResult = [{ function: 'Vertex', parameters: undefined },
  {
    function: 'Has',
    parameters: ['resourceId', 'aws:cloudformation:logical-id']
  },
  { function: "HasNot", parameters: ["softDeleted"] },
  { function: 'ValueMap', parameters: true }];

  assert.deepEqual(result, actualResult);
});

/**
 * Equivalent to:
 * 
 * g.V().has("resourceType", "AWS::EC2::Volume")
 * .not(
 *    __.both("linked")
 *    .or(
 *        __.has("resourceType", p.neq("AWS::TAGS::TAG")),
 *        __.has("resourceType", p.neq("AWS::EC2::Instance"))
 *    )
 * )
 * .valueMap(true)
 * .toList();
 **/
it('Should run a "not and or" query.  The resulting stack trace should be in the order that the queries would be run in neptune.', async () => {
  const graphTraversal = new GremlinMock();
  const rootTraversal = new GremlinRootMock(graphTraversal);

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

  const result = await QueryBuilder.runEnhancedQuery(event, graphTraversal, rootTraversal);

  let actualResult = [{ function: 'Vertex', parameters: undefined },
  {
    function: 'Has',
    parameters: ['resourceType', 'AWS::EC2::Volume']
  },
  { function: '_Both', parameters: 'linked' },
  {
    function: '_Has',
    parameters:
      ['resourceType',
        { operator: 'neq', value: 'AWS::TAGS::TAG', other: undefined }]
  },
  {
    function: '_Has',
    parameters:
      ['resourceType',
        {
          operator: 'neq',
          value: 'AWS::EC2::Instance',
          other: undefined
        }]
  },
  {
    function: 'Or',
    parameters:
      [{
        state:
          [{ function: 'Vertex', parameters: undefined },
          {
            function: 'Has',
            parameters: ['resourceType', 'AWS::EC2::Volume']
          },
          { function: '_Both', parameters: 'linked' },
          {
            function: '_Has',
            parameters:
              ['resourceType',
                { operator: 'neq', value: 'AWS::TAGS::TAG', other: undefined }]
          },
          {
            function: '_Has',
            parameters:
              ['resourceType',
                {
                  operator: 'neq',
                  value: 'AWS::EC2::Instance',
                  other: undefined
                }]
          }]
      },
      {
        state:
          [{ function: 'Vertex', parameters: undefined },
          {
            function: 'Has',
            parameters: ['resourceType', 'AWS::EC2::Volume']
          },
          { function: '_Both', parameters: 'linked' },
          {
            function: '_Has',
            parameters:
              ['resourceType',
                { operator: 'neq', value: 'AWS::TAGS::TAG', other: undefined }]
          },
          {
            function: '_Has',
            parameters:
              ['resourceType',
                {
                  operator: 'neq',
                  value: 'AWS::EC2::Instance',
                  other: undefined
                }]
          }]
      }]
  },
  {
    function: 'Not',
    parameters:
      [{
        state:
          [{ function: 'Vertex', parameters: undefined },
          {
            function: 'Has',
            parameters: ['resourceType', 'AWS::EC2::Volume']
          },
          { function: '_Both', parameters: 'linked' },
          {
            function: '_Has',
            parameters:
              ['resourceType',
                { operator: 'neq', value: 'AWS::TAGS::TAG', other: undefined }]
          },
          {
            function: '_Has',
            parameters:
              ['resourceType',
                {
                  operator: 'neq',
                  value: 'AWS::EC2::Instance',
                  other: undefined
                }]
          },
          {
            function: 'Or',
            parameters:
              [{
                state:
                  [{ function: 'Vertex', parameters: undefined },
                  {
                    function: 'Has',
                    parameters: ['resourceType', 'AWS::EC2::Volume']
                  },
                  { function: '_Both', parameters: 'linked' },
                  {
                    function: '_Has',
                    parameters:
                      ['resourceType',
                        { operator: 'neq', value: 'AWS::TAGS::TAG', other: undefined }]
                  },
                  {
                    function: '_Has',
                    parameters:
                      ['resourceType',
                        {
                          operator: 'neq',
                          value: 'AWS::EC2::Instance',
                          other: undefined
                        }]
                  }]
              },
              {
                state:
                  [{ function: 'Vertex', parameters: undefined },
                  {
                    function: 'Has',
                    parameters: ['resourceType', 'AWS::EC2::Volume']
                  },
                  { function: '_Both', parameters: 'linked' },
                  {
                    function: '_Has',
                    parameters:
                      ['resourceType',
                        { operator: 'neq', value: 'AWS::TAGS::TAG', other: undefined }]
                  },
                  {
                    function: '_Has',
                    parameters:
                      ['resourceType',
                        {
                          operator: 'neq',
                          value: 'AWS::EC2::Instance',
                          other: undefined
                        }]
                  }]
              }]
          }]
      }]
  },
  { function: "HasNot", parameters: ["softDeleted"] },
  { function: 'ValueMap', parameters: true }]

  assert.deepEqual(result, actualResult);
});

/**
 * Equivalent to:
 * 
 * g.V().has("resourceType", "AWS::EC2::Volume")
 * .where (
 *    __.or(
 *        _.both("linked").count().is(0),
 *        __.and(
 *           __.both("linked").count().is(1),
 *           __.both("linked").has("resourceType", "AWS::TAGS::TAG")
 *        )
 *    )
 * )
 * .valueMap()
 * .toList();         
 **/
it('Should run a query with two counts.  The resulting stack trace should be in the order that the queries would be run in neptune.', async () => {
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

  //console.log(util.inspect(result, {depth:20}));

  // let actualResult = [{ function: 'Vertex', parameters: undefined },
  // {
  //   function: 'Has',
  //   parameters: ['resourceId', 'aws:cloudformation:logical-id']
  // },
  // { function: 'ValueMap', parameters: true }];

  // assert.deepEqual(result, actualResult);
});




