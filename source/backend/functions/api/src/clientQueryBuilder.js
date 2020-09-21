/*

NOTE that neptune does not currently support parameterised queries. (:-( WHY!!!!!!!!!))

This is why I am building the queries as a series of strings.

Turn this into

{
    "command": "multipleLinks",
    "data": {
      "and": [
        {
          "resourceId": "aws:cloudformation:logical-id",
          "resourceValue": "InternetGateway"
        },
        {
          "resourceId": "vpc-06152e4c3f78a180c"
        },
        {
          "resourceId": "Name",
          "resourceValue": "twobytwo-stack"
        }
      ]
    }
  }

  a query like this

  const data = await g.V()
         .and(
                 __.both("linked").has("resourceId", "aws:cloudformation:logical-id").has("resourceValue", "InternetGateway"),
                 __.both("linked").has("resourceId", "vpc-06152e4c3f78a180c"),
                 __.both("linked").has("resourceId", "Name").has("resourceValue", "twobytwo-stack")
             )
         .valueMap(true).toList();


  */