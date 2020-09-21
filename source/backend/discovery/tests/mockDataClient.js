/**
 * Mock the data client - which manages the zoom API's
 */

const util = require('util');

const search = async (query) => {

  let response = {
    statusCode: 200,
    statusMessage: 'OK',
    headers: {
      date: 'Thu, 08 Aug 2019 14:30:38 GMT',
      'content-type': 'application/json; charset=UTF-8',
      'content-length': '18918',
      connection: 'keep-alive',
      'access-control-allow-origin': '*'
    },
    body: {
      took: 10,
      timed_out: false,
      _shards: {
        total: 5,
        successful: 5,
        skipped: 0,
        failed: 0
      },
      hits: {
        total: 9,
        max_score: 5.198834,
        hits: [
          {
            _index: 'data',
            _type: '_doc',
            _id: '53a493fa75cb7cb720555be3b1afdcc3',
            _score: 5.198834,
            _source: {
              id: '53a493fa75cb7cb720555be3b1afdcc3',
              label: 'AWS_Lambda_Function',
              properties: {
                version: '1.3',
                accountId: 'XXXXXXXXXXXX',
                configurationItemCaptureTime: '2019-07-30T15:26:36.877Z',
                configurationItemStatus: 'OK',
                configurationStateId: '1564500482281',
                configurationItemMD5Hash: '',
                arn: 'arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin',
                resourceType: 'AWS::Lambda::Function',
                resourceId: 'gremlin',
                resourceName: 'gremlin',
                awsRegion: 'eu-west-1',
                availabilityZone: 'Not Applicable',
                tags: {
                  Environment: 'dev',
                  ServiceNameTag: 'zoom',
                  'aws:cloudformation:logical-id': 'Gremlin',
                  'aws:cloudformation:stack-id': 'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-LambdaStack-ZL61OD8B4PFY/b4f2dbc0-aed6-11e9-ab9e-066324f10f26',
                  'aws:cloudformation:stack-name': 'zoom-platform-LambdaStack-ZL61OD8B4PFY'
                },
                relatedEvents: [],
                configuration: '{"functionName":"gremlin","functionArn":"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin","runtime":"nodejs8.10","role":"arn:aws:iam::XXXXXXXXXXXX:role/ZoomAPILambdaRole","handler":"index.handler","codeSize":637611,"description":"","timeout":10,"memorySize":256,"lastModified":"2019-07-30T15:25:57.173+0000","codeSha256":"vtHSRV6jU5X415fw4Yw+bKc1M41brbugZ3rFkKjyZu4\\u003d","version":"$LATEST","vpcConfig":{"subnetIds":["subnet-06ff07d5c742b84e7","subnet-050bf1a8b9f77b891"],"securityGroupIds":["sg-0816958877aa5f4c1"]},"tracingConfig":{"mode":"PassThrough"},"revisionId":"7fbf7017-68e3-4618-8c8b-f141a3efc28a","layers":[]}',
                supplementaryConfiguration: {
                  Policy: '"{\\"Version\\":\\"2012-10-17\\",\\"Id\\":\\"default\\",\\"Statement\\":[{\\"Sid\\":\\"zoom-platform-ClientAPIStack-1PPM7UGLEJZ5L-GatewayGremlinPermission-IN1E7UV35JW1\\",\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"apigateway.amazonaws.com\\"},\\"Action\\":\\"lambda:invokeFunction\\",\\"Resource\\":\\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin\\",\\"Condition\\":{\\"ArnLike\\":{\\"AWS:SourceArn\\":\\"arn:aws:execute-api:eu-west-1:XXXXXXXXXXXX:oz1pcwzut3/*\\"}}},{\\"Sid\\":\\"zoom-platform-ServerAPIStack-1VSVDCERJTU2Z-GatewayGremlinPermission-1X042556HCE6T\\",\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"apigateway.amazonaws.com\\"},\\"Action\\":\\"lambda:invokeFunction\\",\\"Resource\\":\\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin\\",\\"Condition\\":{\\"ArnLike\\":{\\"AWS:SourceArn\\":\\"arn:aws:execute-api:eu-west-1:XXXXXXXXXXXX:57qj6lrxxa/*\\"}}}]}"',
                  Tags: '{"aws:cloudformation:stack-name":"zoom-platform-LambdaStack-ZL61OD8B4PFY","ServiceNameTag":"zoom","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-LambdaStack-ZL61OD8B4PFY/b4f2dbc0-aed6-11e9-ab9e-066324f10f26","Environment":"dev","aws:cloudformation:logical-id":"Gremlin"}'
                },
                description: '',
                loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/gremlin?tab=graph',
                loggedInURL: 'https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/gremlin?tab=graph',
                title: 'gremlin'
              }
            }
          },
          {
            _index: 'data',
            _type: '_doc',
            _id: '250814db407e196d4ae2665b15a2ec1c',
            _score: 4.916099,
            _source: {
              id: '250814db407e196d4ae2665b15a2ec1c',
              label: 'AWS_CloudWatch_Alarm',
              properties: {
                version: '1.3',
                accountId: 'XXXXXXXXXXXX',
                configurationItemCaptureTime: '2019-07-25T12:14:30.935Z',
                configurationItemStatus: 'ResourceDiscovered',
                configurationStateId: '1564472630906',
                configurationItemMD5Hash: '',
                arn: 'arn:aws:cloudwatch:eu-west-1:XXXXXXXXXXXX:alarm:zoom-platform-NeptuneStack-OMOLJR009EU6-NeptunePrimaryGremlinRequestsPerSecAlarm-1OAZ887DZLR7N',
                resourceType: 'AWS::CloudWatch::Alarm',
                resourceId: 'zoom-platform-NeptuneStack-OMOLJR009EU6-NeptunePrimaryGremlinRequestsPerSecAlarm-1OAZ887DZLR7N',
                resourceName: 'zoom-platform-NeptuneStack-OMOLJR009EU6-NeptunePrimaryGremlinRequestsPerSecAlarm-1OAZ887DZLR7N',
                awsRegion: 'eu-west-1',
                availabilityZone: 'Not Applicable',
                tags: {},
                relatedEvents: [],
                configuration: '{"alarmName":"zoom-platform-NeptuneStack-OMOLJR009EU6-NeptunePrimaryGremlinRequestsPerSecAlarm-1OAZ887DZLR7N","alarmArn":"arn:aws:cloudwatch:eu-west-1:XXXXXXXXXXXX:alarm:zoom-platform-NeptuneStack-OMOLJR009EU6-NeptunePrimaryGremlinRequestsPerSecAlarm-1OAZ887DZLR7N","alarmDescription":"dev-appname primary DB Gremlin Requests Per Second","alarmConfigurationUpdatedTimestamp":1564056730892,"actionsEnabled":true,"alarmActions":["arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-NeptuneStack-OMOLJR009EU6-NeptuneAlarmTopic-IVPNNJXLF80Y"],"insufficientDataActions":["arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-NeptuneStack-OMOLJR009EU6-NeptuneAlarmTopic-IVPNNJXLF80Y"],"metricName":"GremlinRequestsPerSec","namespace":"AWS/Neptune","statistic":"Average","dimensions":[{"name":"DBClusterIdentifier","value":"gremlin-cluster"}],"period":300,"evaluationPeriods":2,"threshold":10000.0,"comparisonOperator":"GreaterThanOrEqualToThreshold","metrics":[],"okactions":[]}',
                supplementaryConfiguration: {},
                title: 'zoom-platform-NeptuneStack-OMOLJR009EU6-NeptunePrimaryGremlinRequestsPerSecAlarm-1OAZ887DZLR7N'
              }
            }
          },
          {
            _index: 'data',
            _type: '_doc',
            _id: '4e8c1efbd1afe77e91ee72978dd0a89b',
            _score: 4.7885942,
            _source: {
              id: '4e8c1efbd1afe77e91ee72978dd0a89b',
              label: 'AWS_IAM_Role',
              properties: {
                version: '1.3',
                accountId: 'XXXXXXXXXXXX',
                configurationItemCaptureTime: '2019-06-04T11:02:18.615Z',
                configurationItemStatus: 'ResourceDiscovered',
                configurationStateId: '1564490635255',
                configurationItemMD5Hash: '',
                arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/gremlin-dev-role-5w4kbr7g',
                resourceType: 'AWS::IAM::Role',
                resourceId: 'AROA5XIWUT3PWOWJSEJJS',
                resourceName: 'gremlin-dev-role-5w4kbr7g',
                awsRegion: 'global',
                availabilityZone: 'Not Applicable',
                resourceCreationTime: '2019-06-04T10:51:11.000Z',
                tags: {},
                relatedEvents: [],
                configuration: '{"path":"/service-role/","roleName":"gremlin-dev-role-5w4kbr7g","roleId":"AROA5XIWUT3PWOWJSEJJS","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/gremlin-dev-role-5w4kbr7g","createDate":"2019-06-04T10:51:11.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22lambda.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c"}],"permissionsBoundary":null,"tags":[]}',
                supplementaryConfiguration: {},
                path: '/service-role/',
                loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
                loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
                title: 'gremlin-dev-role-5w4kbr7g'
              }
            }
          },
          {
            _index: 'data',
            _type: '_doc',
            _id: 'fcfcef61ce42d94052f456a38816657e',
            _score: 4.3900332,
            _source: {
              id: 'fcfcef61ce42d94052f456a38816657e',
              label: 'AWS_Lambda_Function',
              properties: {
                version: '1.3',
                accountId: 'XXXXXXXXXXXX',
                configurationItemCaptureTime: '2019-06-18T14:25:01.454Z',
                configurationItemStatus: 'OK',
                configurationStateId: '1564494231733',
                configurationItemMD5Hash: '',
                arn: 'arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin-dev',
                resourceType: 'AWS::Lambda::Function',
                resourceId: 'gremlin-dev',
                resourceName: 'gremlin-dev',
                awsRegion: 'eu-west-1',
                availabilityZone: 'Not Applicable',
                tags: {},
                relatedEvents: [],
                configuration: '{"functionName":"gremlin-dev","functionArn":"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin-dev","runtime":"nodejs10.x","role":"arn:aws:iam::XXXXXXXXXXXX:role/zoom-lambda-role","handler":"index.handler","codeSize":636440,"description":"","timeout":5,"memorySize":384,"lastModified":"2019-06-18T14:22:56.181+0000","codeSha256":"Uo6BQQubpalovOiWJM5QIPdktO/ABNxxlsa/j1FBmEQ\\u003d","version":"$LATEST","vpcConfig":{"subnetIds":["subnet-0669e6ba1f49ecb27","subnet-0d3b3180ed36e0e68"],"securityGroupIds":["sg-0979f1ed140e2707c"]},"tracingConfig":{"mode":"PassThrough"},"revisionId":"e2c752aa-de97-43a5-822e-0fc1bd135faf","layers":[]}',
                supplementaryConfiguration: {
                  Tags: '{}'
                },
                description: '',
                loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/gremlin-dev?tab=graph',
                loggedInURL: 'https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/gremlin-dev?tab=graph',
                title: 'gremlin-dev'
              }
            }
          },
          {
            _index: 'data',
            _type: '_doc',
            _id: 'f0ac3bf4590319952b822534304656d0',
            _score: 3.9638298,
            _source: {
              id: 'f0ac3bf4590319952b822534304656d0',
              label: 'AWS_TAG',
              properties: {
                resourceType: 'AWS::TAGS::TAG',
                accountId: 'XXXXXXXXXXXX',
                resourceId: 'aws:cloudformation:logical-id',
                resourceValue: 'Gremlin',
                awsRegion: 'unknown',
                title: 'aws:cloudformation:logical-id : Gremlin'
              }
            }
          },
          {
            _index: 'data',
            _type: '_doc',
            _id: 'a832752034d5999f63b4af4c26733947',
            _score: 3.375657,
            _source: {
              id: 'a832752034d5999f63b4af4c26733947',
              label: 'AWS_CloudFormation_Stack',
              properties: {
                version: '1.3',
                accountId: 'XXXXXXXXXXXX',
                configurationItemCaptureTime: '2019-07-25T12:22:18.048Z',
                configurationItemStatus: 'ResourceDiscovered',
                configurationStateId: '1564465431152',
                configurationItemMD5Hash: '',
                arn: 'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-LambdaStack-ZL61OD8B4PFY/b4f2dbc0-aed6-11e9-ab9e-066324f10f26',
                resourceType: 'AWS::CloudFormation::Stack',
                resourceId: 'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-LambdaStack-ZL61OD8B4PFY/b4f2dbc0-aed6-11e9-ab9e-066324f10f26',
                resourceName: 'zoom-platform-LambdaStack-ZL61OD8B4PFY',
                awsRegion: 'eu-west-1',
                availabilityZone: 'Regional',
                resourceCreationTime: '2019-07-25T12:21:19.395Z',
                tags: {
                  Environment: 'dev',
                  ServiceNameTag: 'zoom'
                },
                relatedEvents: [],
                configuration: '{"stackId":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-LambdaStack-ZL61OD8B4PFY/b4f2dbc0-aed6-11e9-ab9e-066324f10f26","stackName":"zoom-platform-LambdaStack-ZL61OD8B4PFY","parameters":[{"parameterKey":"PrivateSubnet0","parameterValue":"subnet-06ff07d5c742b84e7"},{"parameterKey":"PrivateSubnet1","parameterValue":"subnet-050bf1a8b9f77b891"},{"parameterKey":"ZoomDiscoveryBucket","parameterValue":"zoom-discovery-bucket-aws-dev"},{"parameterKey":"NeptuneSG","parameterValue":"sg-0816958877aa5f4c1"},{"parameterKey":"ElasticSearchEndpoint","parameterValue":"vpc-dev-zoom-gy2425illujffdxcabzrplirte.eu-west-1.es.amazonaws.com"},{"parameterKey":"NeptuneClusterURL","parameterValue":"zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com"},{"parameterKey":"NeptuneClusterPort","parameterValue":"8182"},{"parameterKey":"CodeBucket","parameterValue":"zoom-api-bucket"}],"creationTime":"Jul 25, 2019 12:21:19 PM","stackStatus":"CREATE_COMPLETE","disableRollback":true,"notificationARNs":[],"timeoutInMinutes":60,"capabilities":["CAPABILITY_NAMED_IAM"],"outputs":[{"outputKey":"GremlinARN","outputValue":"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin","description":"Gremlin function details"},{"outputKey":"ZoomDiscoveryBucketARN","outputValue":"arn:aws:s3:::zoom-discovery-bucket-aws-dev"},{"outputKey":"ElasticARN","outputValue":"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:elastic","description":"Elastic function details"}],"tags":[{"key":"ServiceNameTag","value":"zoom"},{"key":"Environment","value":"dev"}],"driftInformation":{"stackDriftStatus":"NOT_CHECKED"}}',
                supplementaryConfiguration: {
                  StackResourceSummaries: '[{"logicalResourceId":"Elastic","physicalResourceId":"elastic","resourceType":"AWS::Lambda::Function","lastUpdatedTimestamp":"Jul 25, 2019 12:22:15 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"Gremlin","physicalResourceId":"gremlin","resourceType":"AWS::Lambda::Function","lastUpdatedTimestamp":"Jul 25, 2019 12:22:15 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"ZoomAPILambdaRole","physicalResourceId":"ZoomAPILambdaRole","resourceType":"AWS::IAM::Role","lastUpdatedTimestamp":"Jul 25, 2019 12:22:10 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"ZoomDiscoveryBucketCr","physicalResourceId":"zoom-discovery-bucket-aws-dev","resourceType":"AWS::S3::Bucket","lastUpdatedTimestamp":"Jul 25, 2019 12:21:49 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"ZoomSearchLambdaRole","physicalResourceId":"ZoomSearchLambdaRole","resourceType":"AWS::IAM::Role","lastUpdatedTimestamp":"Jul 25, 2019 12:21:42 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}}]'
                },
                title: 'zoom-platform-LambdaStack-ZL61OD8B4PFY'
              }
            }
          },
          {
            _index: 'data',
            _type: '_doc',
            _id: 'a58924ff192f398b5b96346aa783df3f',
            _score: 2.2906318,
            _source: {
              id: 'a58924ff192f398b5b96346aa783df3f',
              label: 'AWS_Lambda_EnvironmentVariable',
              properties: {
                resourceId: 'neptuneConnectURL_wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin_XXXXXXXXXXXX_eu-west-1',
                resourceType: 'AWS::Lambda::EnvironmentVariable',
                accountId: 'XXXXXXXXXXXX',
                linkedLambda: 'gremlin-dev',
                value: 'wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin',
                awsRegion: 'eu-west-1',
                title: 'neptuneConnectURL:wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin'
              }
            }
          },
          {
            _index: 'data',
            _type: '_doc',
            _id: 'b12ea5158476defad018bd6e733c9c23',
            _score: 2.178622,
            _source: {
              id: 'b12ea5158476defad018bd6e733c9c23',
              label: 'AWS_Lambda_EnvironmentVariable',
              properties: {
                resourceId: 'neptuneConnectURL_wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin_XXXXXXXXXXXX_eu-west-1',
                resourceType: 'AWS::Lambda::EnvironmentVariable',
                accountId: 'XXXXXXXXXXXX',
                linkedLambda: 'gremlin',
                value: 'wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin',
                awsRegion: 'eu-west-1',
                title: 'neptuneConnectURL:wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin'
              }
            }
          },
          {
            _index: 'data',
            _type: '_doc',
            _id: '202d884fb390fc31d15b8e8f1b1ea5e4',
            _score: 0.8405092,
            _source: {
              id: '202d884fb390fc31d15b8e8f1b1ea5e4',
              label: 'AWS_Lambda_EnvironmentVariable',
              properties: {
                resourceId: 'metaDataBucket_zoom-discovery-bucket-aws-dev_XXXXXXXXXXXX_eu-west-1',
                resourceType: 'AWS::Lambda::EnvironmentVariable',
                accountId: 'XXXXXXXXXXXX',
                linkedLambda: 'gremlin',
                value: 'zoom-discovery-bucket-aws-dev',
                awsRegion: 'eu-west-1',
                title: 'metaDataBucket:zoom-discovery-bucket-aws-dev'
              }
            }
          }
        ]
      }
    }
  }

  return response;
}

const awsZoomBucketResponse = JSON.parse(`{
    "hits": {
      "total": 1,
      "max_score": 26.514166,
      "hits": [
        {
          "_index": "data",
          "_type": "_doc",
          "_id": "f1a0dee0730aded0b22398076478a757",
          "_score": 26.514166,
          "_source": {
            "id": "f1a0dee0730aded0b22398076478a757",
            "label": "AWS_S3_Bucket",
            "properties": {
              "version": "1.3",
              "accountId": "XXXXXXXXXXXX",
              "configurationItemCaptureTime": "2019-06-24T12:24:45.288Z",
              "configurationItemStatus": "ResourceDiscovered",
              "configurationStateId": "1565677364457",
              "configurationItemMD5Hash": "",
              "arn": "arn:aws:s3:::zoom-api-bucket",
              "resourceType": "AWS::S3::Bucket",
              "resourceId": "zoom-api-bucket",
              "resourceName": "zoom-api-bucket",
              "awsRegion": "eu-west-1",
              "availabilityZone": "Regional",
              "resourceCreationTime": "2019-06-24T12:22:37.000Z",
              "tags": {},
              "relatedEvents": [],
              "name": "zoom-api-bucket",
              "loginURL": "https://.signin.aws.amazon.com/console/s3?region=#",
              "loggedInURL": "https://.console.aws.amazon.com/s3/v2/home?region=#",
              "title": "zoom-api-bucket"
            }
          }
        }
      ]
    }
}`);

const awsZoomBucketResponse2 = JSON.parse(`{
    "hits": {
      "total": 1,
      "max_score": 26.514166,
      "hits": [
        {
          "_index": "data",
          "_type": "_doc",
          "_id": "f1a0dee0730aded0b22398076478a757",
          "_score": 26.514166,
          "_source": {
            "id": "f1a0dee0730aded0b22398076478a757",
            "label": "AWS_S3_Bucket",
            "properties": {
              "version": "1.3",
              "accountId": "XXXXXXXXXXXX",
              "configurationItemCaptureTime": "2019-06-24T12:24:45.288Z",
              "configurationItemStatus": "ResourceDiscovered",
              "configurationStateId": "1565677364457",
              "configurationItemMD5Hash": "",
              "arn": "arn:aws:s3:::zoom-discovery-data",
              "resourceType": "AWS::S3::Bucket",
              "resourceId": "zoom-api-bucket",
              "resourceName": "zoom-api-bucket",
              "awsRegion": "eu-west-1",
              "availabilityZone": "Regional",
              "resourceCreationTime": "2019-06-24T12:22:37.000Z",
              "tags": {},
              "relatedEvents": [],
              "name": "zoom-api-bucket",
              "loginURL": "https://.signin.aws.amazon.com/console/s3?region=#",
              "loggedInURL": "https://.console.aws.amazon.com/s3/v2/home?region=#",
              "title": "zoom-api-bucket"
            }
          }
        }
      ]
    }
}`);

const apiGatewayGremlinLambdaResponse = {
  hits: {
    total: 1,
    max_score: 6.395095,
    hits: [
      {
        _index: 'data',
        _type: '_doc',
        _id: '7e9b39f3f61b2b71fdf8ed8adff71deb',
        _score: 6.395095,
        _source: {
          id: '7e9b39f3f61b2b71fdf8ed8adff71deb',
          label: 'AWS_Lambda_Function',
          properties: {
            version: '1.3',
            accountId: 'XXXXXXXXXXXX',
            configurationItemCaptureTime: '2019-08-13T09:27:11.757Z',
            configurationItemStatus: 'OK',
            configurationStateId: '1566915758825',
            configurationItemMD5Hash: '',
            arn: 'arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin',
            resourceType: 'AWS::Lambda::Function',
            resourceId: 'gremlin',
            resourceName: 'gremlin',
            awsRegion: 'eu-west-1',
            availabilityZone: 'Not Applicable',
            tags: {
              Environment: 'dev',
              ServiceNameTag: 'zoom',
              'aws:cloudformation:logical-id': 'Gremlin',
              'aws:cloudformation:stack-id': 'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c',
              'aws:cloudformation:stack-name': 'zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ'
            },
            relatedEvents: [],
            configuration: '{"functionName":"gremlin","functionArn":"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin","runtime":"nodejs8.10","role":"arn:aws:iam::XXXXXXXXXXXX:role/ZoomAPILambdaRole","handler":"index.handler","codeSize":3189562,"description":"","timeout":10,"memorySize":256,"lastModified":"2019-08-13T09:24:45.214+0000","codeSha256":"jPFqjSOkAjRhvBbSdDXW3u4kYkAZJtwa+b66rbI2i+A\\u003d","version":"$LATEST","vpcConfig":{"subnetIds":["subnet-0306ddd2f189b4662","subnet-0249d376da149810e"],"securityGroupIds":["sg-0ae8a66e0af8fb1ce"]},"tracingConfig":{"mode":"PassThrough"},"revisionId":"9dff7453-ba83-435b-8520-8202aeb33e24","layers":[]}',
            supplementaryConfiguration: {
              Policy: '"{\\"Version\\":\\"2012-10-17\\",\\"Id\\":\\"default\\",\\"Statement\\":[{\\"Sid\\":\\"zoom-platform-dev-ClientAPIStack-1QOFDBA9U71MT-GatewayGremlinPermission-ACPIM7LVK8MM\\",\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"apigateway.amazonaws.com\\"},\\"Action\\":\\"lambda:invokeFunction\\",\\"Resource\\":\\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin\\",\\"Condition\\":{\\"ArnLike\\":{\\"AWS:SourceArn\\":\\"arn:aws:execute-api:eu-west-1:XXXXXXXXXXXX:dw2420u6l4/*\\"}}},{\\"Sid\\":\\"zoom-platform-dev-ServerAPIStack-12KVRCISB8ZU7-ServerGatewayGremlinPermission-D9IS7PH69B1J\\",\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"Service\\":\\"apigateway.amazonaws.com\\"},\\"Action\\":\\"lambda:invokeFunction\\",\\"Resource\\":\\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin\\",\\"Condition\\":{\\"ArnLike\\":{\\"AWS:SourceArn\\":\\"arn:aws:execute-api:eu-west-1:XXXXXXXXXXXX:bkf4l5t4vl/*\\"}}}]}"',
              Tags: '{"aws:cloudformation:stack-name":"zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ","ServiceNameTag":"zoom","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c","Environment":"dev","aws:cloudformation:logical-id":"Gremlin"}'
            },
            description: '',
            loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/gremlin?tab=graph',
            loggedInURL: 'https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/gremlin?tab=graph',
            title: 'gremlin',
            parsedArn: {
              partition: 'aws',
              service: 'lambda',
              region: 'eu-west-1',
              accountId: 'XXXXXXXXXXXX',
              resourceType: 'function',
              resource: 'gremlin',
              qualifier: ''
            }
          }
        }
      }
    ]
  }
};

const emptyAdvancedSearchResponse = JSON.parse(`{
    "hits": {
      "total": 0,
      "max_score": null,
      "hits": []
    }
}`);

const advancedSearch = async (queryObject) => {
  let query = JSON.stringify(queryObject.query.bool.must);

  if (query === `[{"term":{"properties.parsedArn.partition.keyword":"aws"}},{"term":{"properties.parsedArn.service.keyword":"s3"}},{"term":{"properties.parsedArn.resource.keyword":"zoom-api-bucket"}},{"term":{"properties.accountId.keyword":"XXXXXXXXXXXX"}}]`) {
    return awsZoomBucketResponse;
  }
  else if (query === `[{"term":{"properties.parsedArn.partition.keyword":"aws"}},{"term":{"properties.parsedArn.service.keyword":"s3"}},{"term":{"properties.parsedArn.resource.keyword":"zoom-api-bucket"}},{"term":{"properties.accountId.keyword":"XXXXXXXXXXXX"}}]`) {
    return awsZoomBucketResponse;
  }
  else if (query === `[{"term":{"properties.parsedArn.partition.keyword":"aws"}},{"term":{"properties.parsedArn.service.keyword":"s3"}},{"term":{"properties.parsedArn.resource.keyword":"zoom-discovery-data"}},{"term":{"properties.accountId.keyword":"XXXXXXXXXXXX"}}]`) {
    return awsZoomBucketResponse2;
  }
  else if (query === `[{"term":{"properties.resourceType.keyword":"AWS::Lambda::Function"}},{"term":{"properties.arn.keyword":"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin"}},{"term":{"properties.awsRegion.keyword":"eu-west-1"}},{"term":{"properties.accountId.keyword":"XXXXXXXXXXXX"}}]`) {
    return apiGatewayGremlinLambdaResponse;
  }
  else {
    return emptyAdvancedSearchResponse;
  }
};

const queryGremlin = async (query) => {
  if (query.command === "filterNodes" && query.data.resourceType === "AWS::IAM::Policy" && query.data.accountId === "XXXXXXXXXXXX") {
    return createPolicyOutputXXXXXXXXXXXX();
  }
  else if (query.command === "filterNodes" && query.data.resourceType === "AWS::IAM::Role" && query.data.accountId === "XXXXXXXXXXXX") {
    return createRoleOutputXXXXXXXXXXXX();
  }
  else if (query.command === "filterNodes" && query.data.resourceType === "AWS::EC2::Instance" && query.data.instanceId === "i-0394ef01caae786d8") {
    return createInstanceOutputI0394ef01caae786d8();
  }
  else if (query.command === "filterNodes" && query.data.resourceId === "AutoScalingFullAccess" && query.data.arn === "arn:aws:iam::aws:policy/AutoScalingFullAccess") {
    return createAWSManagedPolicyOutput();
  }
  else return emptyQueryGremlinResponse();
};

const emptyQueryGremlinResponse = () => {
  return {
    "success": true,
    "results": []
  };
}

const createAWSManagedPolicyOutput = () => {
  return {
    "success": true,
    "results": [
      {
        "properties": {
          "resourceId": "AutoScalingFullAccess",
          "arn": "arn:aws:iam::aws:policy/AutoScalingFullAccess",
          "resourceType": "AWS::IAM:AWSManagedPolicy"
        },
        "id": "09d825f5087fb1d5009e7c32dfa290a4",
        "label": "AWS::IAM:AWSManagedPolicy"
      }
    ]
  };
};

const createInstanceOutputI0394ef01caae786d8 = () => {
  return {
    "success": true,
    "results": [
      {
        "properties": {
          "kernelId": "null",
          "resourceId": "i-0394ef01caae786d8",
          "enaSupport": "true",
          "availabilityZone": "eu-west-1b",
          "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Instances:sort=instanceId",
          "state": "{\"code\":16,\"name\":\"running\"}",
          "ebsOptimized": "false",
          "imageId": "ami-02bf9e90a6e30dc74",
          "configurationItemMD5Hash": "",
          "publicDnsName": "ec2-34-247-174-40.eu-west-1.compute.amazonaws.com",
          "version": "1.3",
          "privateIpAddress": "10.0.1.249",
          "capacityReservationId": "null",
          "tags": "{\"Description\":\"This instance is the part of the Auto Scaling group which was created through ECS Console\",\"Name\":\"ECS Instance - EC2ContainerService-ecs-test-cluster\",\"aws:autoscaling:groupName\":\"EC2ContainerService-ecs-test-cluster-EcsInstanceAsg-1O5QT346V8WKU\",\"aws:cloudformation:logical-id\":\"EcsInstanceAsg\",\"aws:cloudformation:stack-id\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/EC2ContainerService-ecs-test-cluster/f1b0e130-c8ce-11e9-a575-0a675d25b48e\",\"aws:cloudformation:stack-name\":\"EC2ContainerService-ecs-test-cluster\"}",
          "accountId": "XXXXXXXXXXXX",
          "launchTime": "2019-08-27T13:32:04.000Z",
          "sriovNetSupport": "null",
          "configurationItemStatus": "ResourceDiscovered",
          "ramdiskId": "null",
          "virtualizationType": "hvm",
          "configuration": "{\"amiLaunchIndex\":0,\"imageId\":\"ami-02bf9e90a6e30dc74\",\"instanceId\":\"i-0394ef01caae786d8\",\"instanceType\":\"m5a.large\",\"kernelId\":null,\"keyName\":\"zoom-discovery\",\"launchTime\":\"2019-08-27T13:32:04.000Z\",\"monitoring\":{\"state\":\"enabled\"},\"placement\":{\"availabilityZone\":\"eu-west-1b\",\"affinity\":null,\"groupName\":\"\",\"partitionNumber\":null,\"hostId\":null,\"tenancy\":\"default\",\"spreadDomain\":null},\"platform\":null,\"privateDnsName\":\"ip-10-0-1-249.eu-west-1.compute.internal\",\"privateIpAddress\":\"10.0.1.249\",\"productCodes\":[],\"publicDnsName\":\"ec2-34-247-174-40.eu-west-1.compute.amazonaws.com\",\"publicIpAddress\":\"34.247.174.40\",\"ramdiskId\":null,\"state\":{\"code\":16,\"name\":\"running\"},\"stateTransitionReason\":\"\",\"subnetId\":\"subnet-00a29deb6dc36de8b\",\"vpcId\":\"vpc-0ca0621e6beedf8d7\",\"architecture\":\"x86_64\",\"blockDeviceMappings\":[{\"deviceName\":\"/dev/xvda\",\"ebs\":{\"attachTime\":\"2019-08-27T13:32:04.000Z\",\"deleteOnTermination\":true,\"status\":\"attached\",\"volumeId\":\"vol-06cc53979255dc92f\"}},{\"deviceName\":\"/dev/xvdcz\",\"ebs\":{\"attachTime\":\"2019-08-27T13:32:04.000Z\",\"deleteOnTermination\":true,\"status\":\"attached\",\"volumeId\":\"vol-0a2e9facd2a4449b2\"}}],\"clientToken\":\"68c5b34d-1ad6-94f4-260b-c777c5447484_subnet-00a29deb6dc36de8b_1\",\"ebsOptimized\":false,\"enaSupport\":true,\"hypervisor\":\"xen\",\"iamInstanceProfile\":{\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:instance-profile/ecsInstanceRole\",\"id\":\"AIPA5XIWUT3PYY2IXUDMG\"},\"instanceLifecycle\":null,\"elasticGpuAssociations\":[],\"elasticInferenceAcceleratorAssociations\":[],\"networkInterfaces\":[{\"association\":{\"ipOwnerId\":\"amazon\",\"publicDnsName\":\"ec2-34-247-174-40.eu-west-1.compute.amazonaws.com\",\"publicIp\":\"34.247.174.40\"},\"attachment\":{\"attachTime\":\"2019-08-27T13:32:04.000Z\",\"attachmentId\":\"eni-attach-0b9808ae3e633841a\",\"deleteOnTermination\":true,\"deviceIndex\":0,\"status\":\"attached\"},\"description\":\"\",\"groups\":[{\"groupName\":\"EC2ContainerService-ecs-test-cluster-EcsSecurityGroup-C327BPEETPWA\",\"groupId\":\"sg-0743cca5f8539f498\"}],\"ipv6Addresses\":[],\"macAddress\":\"02:b3:54:c7:e6:4e\",\"networkInterfaceId\":\"eni-0b8430b1acb973d2d\",\"ownerId\":\"XXXXXXXXXXXX\",\"privateDnsName\":\"ip-10-0-1-249.eu-west-1.compute.internal\",\"privateIpAddress\":\"10.0.1.249\",\"privateIpAddresses\":[{\"association\":{\"ipOwnerId\":\"amazon\",\"publicDnsName\":\"ec2-34-247-174-40.eu-west-1.compute.amazonaws.com\",\"publicIp\":\"34.247.174.40\"},\"primary\":true,\"privateDnsName\":\"ip-10-0-1-249.eu-west-1.compute.internal\",\"privateIpAddress\":\"10.0.1.249\"}],\"sourceDestCheck\":true,\"status\":\"in-use\",\"subnetId\":\"subnet-00a29deb6dc36de8b\",\"vpcId\":\"vpc-0ca0621e6beedf8d7\",\"interfaceType\":\"interface\"}],\"rootDeviceName\":\"/dev/xvda\",\"rootDeviceType\":\"ebs\",\"securityGroups\":[{\"groupName\":\"EC2ContainerService-ecs-test-cluster-EcsSecurityGroup-C327BPEETPWA\",\"groupId\":\"sg-0743cca5f8539f498\"}],\"sourceDestCheck\":true,\"spotInstanceRequestId\":null,\"sriovNetSupport\":null,\"stateReason\":null,\"tags\":[{\"key\":\"Description\",\"value\":\"This instance is the part of the Auto Scaling group which was created through ECS Console\"},{\"key\":\"Name\",\"value\":\"ECS Instance - EC2ContainerService-ecs-test-cluster\"},{\"key\":\"aws:cloudformation:stack-name\",\"value\":\"EC2ContainerService-ecs-test-cluster\"},{\"key\":\"aws:autoscaling:groupName\",\"value\":\"EC2ContainerService-ecs-test-cluster-EcsInstanceAsg-1O5QT346V8WKU\"},{\"key\":\"aws:cloudformation:stack-id\",\"value\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/EC2ContainerService-ecs-test-cluster/f1b0e130-c8ce-11e9-a575-0a675d25b48e\"},{\"key\":\"aws:cloudformation:logical-id\",\"value\":\"EcsInstanceAsg\"}],\"virtualizationType\":\"hvm\",\"cpuOptions\":{\"coreCount\":1,\"threadsPerCore\":2},\"capacityReservationId\":null,\"capacityReservationSpecification\":{\"capacityReservationPreference\":\"open\",\"capacityReservationTarget\":null},\"hibernationOptions\":{\"configured\":false},\"licenses\":[]}",
          "amiLaunchIndex": "0",
          "sourceDestCheck": "true",
          "stateReason": "null",
          "title": "i-0394ef01caae786d8",
          "platform": "null",
          "instanceId": "i-0394ef01caae786d8",
          "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Instances:sort=instanceId",
          "hypervisor": "xen",
          "relatedEvents": "[]",
          "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:instance/i-0394ef01caae786d8",
          "resourceCreationTime": "2019-08-27T13:32:04.000Z",
          "architecture": "x86_64",
          "awsRegion": "eu-west-1",
          "publicIpAddress": "34.247.174.40",
          "supplementaryConfiguration": "{}",
          "stateTransitionReason": "",
          "clientToken": "68c5b34d-1ad6-94f4-260b-c777c5447484_subnet-00a29deb6dc36de8b_1",
          "instanceType": "m5a.large",
          "keyName": "zoom-discovery",
          "configurationItemCaptureTime": "2019-08-27T13:33:26.487Z",
          "iamInstanceProfile": "{\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:instance-profile/ecsInstanceRole\",\"id\":\"AIPA5XIWUT3PYY2IXUDMG\"}",
          "instanceLifecycle": "null",
          "configurationStateId": "1566912808731",
          "spotInstanceRequestId": "null",
          "privateDnsName": "ip-10-0-1-249.eu-west-1.compute.internal",
          "resourceType": "AWS::EC2::Instance"
        },
        "id": "09d825f5087fb1d5009e7c32dfa290a4",
        "label": "AWS::EC2::Instance"
      }
    ]
  };
}

const createRoleOutputXXXXXXXXXXXX = () => {
  let results = {
    success: true,
    results: [
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PTKUAI7ZNI',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"AwsSecurityNacundaAudit","roleId":"AROA5XIWUT3PTKUAI7ZNI","arn":"arn:aws:iam::XXXXXXXXXXXX:role/AwsSecurityNacundaAudit","createDate":"2019-04-03T09:07:24.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A350429083849%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22AwsSecurityNacundaAuditX9NmrlMWQOip%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AwsSecurityNacundaAuditPolicy","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/AwsSecurityNacundaAuditPolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AwsSecurityNacundaAudit',
          title: 'AwsSecurityNacundaAudit',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/AwsSecurityNacundaAudit',
          resourceCreationTime: '2019-04-03T09:07:24.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '69756df019f1a4d7aacf99e25628c891'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'AROA5XIWUT3PRI7PL4MBR',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"zoom-bootstrap-role","roleId":"AROA5XIWUT3PRI7PL4MBR","arn":"arn:aws:iam::XXXXXXXXXXXX:role/zoom-bootstrap-role","createDate":"2019-06-13T09:35:49.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22ec2.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[{"path":"/","instanceProfileName":"zoom-bootstrap-role","instanceProfileId":"AIPA5XIWUT3P7Z3HNDK6Y","arn":"arn:aws:iam::XXXXXXXXXXXX:instance-profile/zoom-bootstrap-role","createDate":"2019-06-13T09:35:49.000Z","roles":[{"path":"/","roleName":"zoom-bootstrap-role","roleId":"AROA5XIWUT3PRI7PL4MBR","arn":"arn:aws:iam::XXXXXXXXXXXX:role/zoom-bootstrap-role","createDate":"2019-06-13T09:35:49.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22ec2.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","description":null,"maxSessionDuration":null,"permissionsBoundary":null,"tags":[]}]}],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"zoom-bootstrap-policy","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/zoom-bootstrap-policy"},{"policyName":"CodeDeploy-EC2-Permissions","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/CodeDeploy-EC2-Permissions"},{"policyName":"AWSCodeDeployFullAccess","policyArn":"arn:aws:iam::aws:policy/AWSCodeDeployFullAccess"},{"policyName":"AWSCodeDeployRole","policyArn":"arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'zoom-bootstrap-role',
          title: 'zoom-bootstrap-role',
          configurationItemCaptureTime: '2019-06-13T11:27:33.255Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/zoom-bootstrap-role',
          resourceCreationTime: '2019-06-13T09:35:49.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'e4928a557ef9abd40d1f1513d0bebc6e'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P4RPLIA3PS',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"IsengardCloudTrailRole","roleId":"AROA5XIWUT3P4RPLIA3PS","arn":"arn:aws:iam::XXXXXXXXXXXX:role/IsengardCloudTrailRole","createDate":"2019-04-03T09:07:23.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A086441151436%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22IsengardCloudTrailRoleXgyVrPVLGred%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSCloudTrailAccessPolicy","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/AWSCloudTrailAccessPolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'IsengardCloudTrailRole',
          title: 'IsengardCloudTrailRole',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/IsengardCloudTrailRole',
          resourceCreationTime: '2019-04-03T09:07:23.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'a9d5672727e01ec4900f3e515e1cf07d'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PX44FTT4JA',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/service-role/","roleName":"cwe-role-eu-west-1-zoom-discovery","roleId":"AROA5XIWUT3PX44FTT4JA","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/cwe-role-eu-west-1-zoom-discovery","createDate":"2019-05-17T15:20:51.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22events.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"start-pipeline-execution-eu-west-1-zoom-discovery","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/start-pipeline-execution-eu-west-1-zoom-discovery"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'cwe-role-eu-west-1-zoom-discovery',
          title: 'cwe-role-eu-west-1-zoom-discovery',
          configurationItemCaptureTime: '2019-05-17T15:31:57.204Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/service-role/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/cwe-role-eu-west-1-zoom-discovery',
          resourceCreationTime: '2019-05-17T15:20:51.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '70ffbbdf408a2631038679e0504124f4'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PYU5L4IJ3C',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/service-role/","roleName":"AWSCodePipelineServiceRole-eu-west-1-zoom-api","roleId":"AROA5XIWUT3PYU5L4IJ3C","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-api","createDate":"2019-06-24T12:51:39.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22codepipeline.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSCodePipelineServiceRole-eu-west-1-zoom-api","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-api"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSCodePipelineServiceRole-eu-west-1-zoom-api',
          title: 'AWSCodePipelineServiceRole-eu-west-1-zoom-api',
          configurationItemCaptureTime: '2019-06-24T13:02:32.586Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/service-role/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-api',
          resourceCreationTime: '2019-06-24T12:51:39.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'c668cc8c26bc41206f8a96f586ce7cd8'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P6QJACLR3J',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/isengard.aws.internal/","roleName":"AWSServiceRoleForIsengardControllerRoleInternal","roleId":"AROA5XIWUT3P6QJACLR3J","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/isengard.aws.internal/AWSServiceRoleForIsengardControllerRoleInternal","createDate":"2019-04-03T09:07:22.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A727820809195%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22IsengardExternalId0ZX3FPFYgBXA%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"IsengardControllerPolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/IsengardControllerPolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForIsengardControllerRoleInternal',
          title: 'AWSServiceRoleForIsengardControllerRoleInternal',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/isengard.aws.internal/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/isengard.aws.internal/AWSServiceRoleForIsengardControllerRoleInternal',
          resourceCreationTime: '2019-04-03T09:07:22.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '301681505a5014b79d3201561e82b3c6'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P75UE4SSMG',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/guardduty.amazonaws.com/","roleName":"AWSServiceRoleForAmazonGuardDuty","roleId":"AROA5XIWUT3P75UE4SSMG","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/guardduty.amazonaws.com/AWSServiceRoleForAmazonGuardDuty","createDate":"2019-04-03T09:12:25.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22guardduty.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AmazonGuardDutyServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AmazonGuardDutyServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForAmazonGuardDuty',
          title: 'AWSServiceRoleForAmazonGuardDuty',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/guardduty.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/guardduty.amazonaws.com/AWSServiceRoleForAmazonGuardDuty',
          resourceCreationTime: '2019-04-03T09:12:25.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'a6b0967cb81475b3961d1e492c45dfef'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'XXX',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"zoomui46f3964f_userpoolclient_lambda_role-dev","roleId":"XXX","arn":"arn:aws:iam::XXXXXXXXXXXX:role/zoomui46f3964f_userpoolclient_lambda_role-dev","createDate":"2019-06-21T10:25:36.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22lambda.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"zoomui46f3964f_userpoolclient_lambda_iam_policy","policyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22cognito-idp%3ADescribeUserPoolClient%22%5D%2C%22Resource%22%3A%22arn%3Aaws%3Acognito-idp%3Aeu-west-1%3AXXXXXXXXXXXX%3Auserpool%2Feu-west-1_LAws8manr%22%2C%22Effect%22%3A%22Allow%22%7D%5D%7D"},{"policyName":"zoomui46f3964f_userpoolclient_lambda_log_policy","policyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22logs%3ACreateLogGroup%22%2C%22logs%3ACreateLogStream%22%2C%22logs%3APutLogEvents%22%5D%2C%22Resource%22%3A%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Flambda%2Fzoom-ui-dev-20190621112019-au-UserPoolClientLambda-MTHWXIONYB79%3Alog-stream%3A%2A%22%2C%22Effect%22%3A%22Allow%22%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'zoomui46f3964f_userpoolclient_lambda_role-dev',
          title: 'zoomui46f3964f_userpoolclient_lambda_role-dev',
          configurationItemCaptureTime: '2019-06-21T10:36:59.618Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/zoomui46f3964f_userpoolclient_lambda_role-dev',
          resourceCreationTime: '2019-06-21T10:25:36.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'b46b35c036aff0905942411a9799ae96'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PRYCQXWMEB',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"IsengardAuditorRole-DO-NOT-DELETE","roleId":"XXX","arn":"arn:aws:iam::XXXXXXXXXXXX:role/IsengardAuditorRole-DO-NOT-DELETE","createDate":"2019-04-04T00:57:37.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A727820809195%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22IsengardAuditorExternalIdmDnJOQluzkG5%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"IsengardAuditorPolicy","policyDocument":"%7B%22Version%22%3A%20%222012-10-17%22%2C%22Statement%22%3A%20%5B%7B%22Action%22%3A%20%5B%22autoscaling%3ADescribeAdjustmentTypes%22%2C%22autoscaling%3ADescribeAutoScalingGroups%22%2C%22autoscaling%3ADescribeAutoScalingInstances%22%2C%22autoscaling%3ADescribeAutoScalingNotificationTypes%22%2C%22autoscaling%3ADescribeLaunchConfigurations%22%2C%22autoscaling%3ADescribeMetricCollectionTypes%22%2C%22autoscaling%3ADescribeNotificationConfigurations%22%2C%22autoscaling%3ADescribePolicies%22%2C%22autoscaling%3ADescribeScalingActivities%22%2C%22autoscaling%3ADescribeScalingProcessTypes%22%2C%22autoscaling%3ADescribeScheduledActions%22%2C%22autoscaling%3ADescribeTags%22%2C%22autoscaling%3ADescribeTriggers%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22cloudformation%3ADescribeStackEvents%22%2C%22cloudformation%3ADescribeStackResource%22%2C%22cloudformation%3ADescribeStackResources%22%2C%22cloudformation%3ADescribeStacks%22%2C%22cloudformation%3AGetTemplate%22%2C%22cloudformation%3AListStacks%22%2C%22cloudformation%3AListStackResources%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22cloudfront%3AGetCloudFrontOriginAccessIdentity%22%2C%22cloudfront%3AGetCloudFrontOriginAccessIdentityConfig%22%2C%22cloudfront%3AGetDistribution%22%2C%22cloudfront%3AGetDistributionConfig%22%2C%22cloudfront%3AGetInvalidation%22%2C%22cloudfront%3AGetStreamingDistribution%22%2C%22cloudfront%3AGetStreamingDistributionConfig%22%2C%22cloudfront%3AListCloudFrontOriginAccessIdentities%22%2C%22cloudfront%3AListDistributions%22%2C%22cloudfront%3AListInvalidations%22%2C%22cloudfront%3AListStreamingDistributions%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22cloudtrail%3ADescribeTrails%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22cloudwatch%3ADescribeAlarms%22%2C%22cloudwatch%3ADescribeAlarmsForMetric%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22directconnect%3ADescribeConnectionDetail%22%2C%22directconnect%3ADescribeConnections%22%2C%22directconnect%3ADescribeOfferingDetail%22%2C%22directconnect%3ADescribeOfferings%22%2C%22directconnect%3ADescribeVirtualGateways%22%2C%22directconnect%3ADescribeVirtualInterfaces%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22dynamodb%3AListTables%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22ec2%3ADescribeAccountAttributes%22%2C%22ec2%3ADescribeAddresses%22%2C%22ec2%3ADescribeAvailabilityZones%22%2C%22ec2%3ADescribeBundleTasks%22%2C%22ec2%3ADescribeConversionTasks%22%2C%22ec2%3ADescribeCustomerGateways%22%2C%22ec2%3ADescribeDhcpOptions%22%2C%22ec2%3ADescribeExportTasks%22%2C%22ec2%3ADescribeImageAttribute%22%2C%22ec2%3ADescribeImages%22%2C%22ec2%3ADescribeInstanceAttribute%22%2C%22ec2%3ADescribeInstanceStatus%22%2C%22ec2%3ADescribeInstances%22%2C%22ec2%3ADescribeInternetGateways%22%2C%22ec2%3ADescribeKeyPairs%22%2C%22ec2%3ADescribeLicenses%22%2C%22ec2%3ADescribeNetworkAcls%22%2C%22ec2%3ADescribeNetworkInterfaceAttribute%22%2C%22ec2%3ADescribeNetworkInterfaces%22%2C%22ec2%3ADescribePlacementGroups%22%2C%22ec2%3ADescribeRegions%22%2C%22ec2%3ADescribeReservedInstances%22%2C%22ec2%3ADescribeReservedInstancesOfferings%22%2C%22ec2%3ADescribeRouteTables%22%2C%22ec2%3ADescribeSecurityGroups%22%2C%22ec2%3ADescribeSnapshotAttribute%22%2C%22ec2%3ADescribeSnapshots%22%2C%22ec2%3ADescribeSpotDatafeedSubscription%22%2C%22ec2%3ADescribeSpotInstanceRequests%22%2C%22ec2%3ADescribeSpotPriceHistory%22%2C%22ec2%3ADescribeSubnets%22%2C%22ec2%3ADescribeTags%22%2C%22ec2%3ADescribeVolumeAttribute%22%2C%22ec2%3ADescribeVolumeStatus%22%2C%22ec2%3ADescribeVolumes%22%2C%22ec2%3ADescribeVpcPeeringConnection%22%2C%22ec2%3ADescribeVpcs%22%2C%22ec2%3ADescribeVpnConnections%22%2C%22ec2%3ADescribeVpnGateways%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22elasticbeanstalk%3ADescribeApplicationVersions%22%2C%22elasticbeanstalk%3ADescribeApplications%22%2C%22elasticbeanstalk%3ADescribeConfigurationOptions%22%2C%22elasticbeanstalk%3ADescribeConfigurationSettings%22%2C%22elasticbeanstalk%3ADescribeEnvironmentResources%22%2C%22elasticbeanstalk%3ADescribeEnvironments%22%2C%22elasticbeanstalk%3ADescribeEvents%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22elasticache%3ADescribeCacheClusters%22%2C%22elasticache%3ADescribeCacheParameterGroups%22%2C%22elasticache%3ADescribeCacheParameters%22%2C%22elasticache%3ADescribeCacheSecurityGroups%22%2C%22elasticache%3ADescribeEngineDefaultParameters%22%2C%22elasticache%3ADescribeEvents%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22elasticloadbalancing%3ADescribeInstanceHealth%22%2C%22elasticloadbalancing%3ADescribeLoadBalancers%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22elasticmapreduce%3ADescribeJobFlows%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22glacier%3AListVaults%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22iam%3AGenerateCredentialReport%22%2C%22iam%3AGetAccountPasswordPolicy%22%2C%22iam%3AGetAccountSummary%22%2C%22iam%3AGetGroup%22%2C%22iam%3AGetGroupPolicy%22%2C%22iam%3AGetInstanceProfile%22%2C%22iam%3AGetLoginProfile%22%2C%22iam%3AGetRole%22%2C%22iam%3AGetRolePolicy%22%2C%22iam%3AGetServerCertificate%22%2C%22iam%3AGetUser%22%2C%22iam%3AGetUserPolicy%22%2C%22iam%3AListAccessKeys%22%2C%22iam%3AListAccountAliases%22%2C%22iam%3AListGroupPolicies%22%2C%22iam%3AListGroups%22%2C%22iam%3AListGroupsForUser%22%2C%22iam%3AListInstanceProfiles%22%2C%22iam%3AListInstanceProfilesForRole%22%2C%22iam%3AListMFADevices%22%2C%22iam%3AListRolePolicies%22%2C%22iam%3AListRoles%22%2C%22iam%3AListServerCertificates%22%2C%22iam%3AListSigningCertificates%22%2C%22iam%3AListUserPolicies%22%2C%22iam%3AListUsers%22%2C%22iam%3AListVirtualMFADevices%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22rds%3ADescribeEngineDefaultParameters%22%2C%22rds%3ADescribeDBInstances%22%2C%22rds%3ADescribeDBLogFiles%22%2C%22rds%3ADescribeDBParameterGroups%22%2C%22rds%3ADescribeDBParameters%22%2C%22rds%3ADescribeDBSecurityGroups%22%2C%22rds%3ADescribeDBSnapshots%22%2C%22rds%3ADescribeDBEngineVersions%22%2C%22rds%3ADescribeDBSubnetGroups%22%2C%22rds%3ADescribeEventCategories%22%2C%22rds%3ADescribeEvents%22%2C%22rds%3ADescribeEventSubscriptions%22%2C%22rds%3ADescribeOptionGroups%22%2C%22rds%3ADescribeOptionGroupOptions%22%2C%22rds%3ADescribeOrderableDBInstanceOptions%22%2C%22rds%3ADescribeReservedDBInstances%22%2C%22rds%3ADescribeReservedDBInstancesOfferings%22%2C%22rds%3ADownloadDBLogFilePortion%22%2C%22rds%3AListTagsForResource%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22redshift%3ADescribeClusterParameterGroups%22%2C%22redshift%3ADescribeClusterParameters%22%2C%22redshift%3ADescribeClusterSecurityGroups%22%2C%22redshift%3ADescribeClusterSnapshots%22%2C%22redshift%3ADescribeClusterSubnetGroups%22%2C%22redshift%3ADescribeClusterVersions%22%2C%22redshift%3ADescribeClusters%22%2C%22redshift%3ADescribeDefaultClusterParameters%22%2C%22redshift%3ADescribeEvents%22%2C%22redshift%3ADescribeOrderableClusterOptions%22%2C%22redshift%3ADescribeReservedNodeOfferings%22%2C%22redshift%3ADescribeReservedNodes%22%2C%22redshift%3ADescribeResize%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22route53%3AGetHostedZone%22%2C%22route53%3AListHostedZones%22%2C%22route53%3AListResourceRecordSets%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22s3%3AGetBucketAcl%22%2C%22s3%3AGetBucketLocation%22%2C%22s3%3AGetBucketLogging%22%2C%22s3%3AGetBucketNotification%22%2C%22s3%3AGetBucketPolicy%22%2C%22s3%3AGetBucketRequestPayment%22%2C%22s3%3AGetBucketVersioning%22%2C%22s3%3AGetBucketWebsite%22%2C%22s3%3AGetLifecycleConfiguration%22%2C%22s3%3AGetObjectAcl%22%2C%22s3%3AGetObjectVersionAcl%22%2C%22s3%3AListAllMyBuckets%22%2C%22s3%3AListBucket%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22sdb%3ADomainMetadata%22%2C%22sdb%3AListDomains%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22sns%3AGetTopicAttributes%22%2C%22sns%3AListTopics%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22sqs%3AGetQueueAttributes%22%2C%22sqs%3AListQueues%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%22%2A%22%7D%2C%7B%22Action%22%3A%20%5B%22kms%3ADescribe%2A%22%2C%22kms%3AGet%2A%22%2C%22kms%3AList%2A%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%5B%22%2A%22%5D%20%7D%2C%7B%22Action%22%3A%20%5B%22ds%3ACheck%2A%22%2C%22ds%3ADescribe%2A%22%2C%22ds%3AGet%2A%22%2C%22ds%3AList%2A%22%5D%2C%22Effect%22%3A%20%22Allow%22%2C%22Resource%22%3A%20%5B%22%2A%22%5D%7D%2C%7B%22Action%22%20%3A%20%5B%22codedeploy%3AGet%2A%22%2C%22codedeploy%3AList%2A%22%5D%2C%22Effect%22%20%3A%20%22Allow%22%2C%22Resource%22%3A%20%5B%22%2A%22%5D%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'IsengardAuditorRole-DO-NOT-DELETE',
          title: 'IsengardAuditorRole-DO-NOT-DELETE',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/IsengardAuditorRole-DO-NOT-DELETE',
          resourceCreationTime: '2019-04-04T00:57:37.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'd2de4cb5fec63430e5211e051e3c8f4f'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PXMISEHRQR',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/rds.amazonaws.com/","roleName":"AWSServiceRoleForRDS","roleId":"AROA5XIWUT3PXMISEHRQR","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS","createDate":"2019-04-25T15:37:01.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22rds.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AmazonRDSServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AmazonRDSServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForRDS',
          title: 'AWSServiceRoleForRDS',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/rds.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS',
          resourceCreationTime: '2019-04-25T15:37:01.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'bca84eed48cd69bcd78d8f8ffc2a4f1a'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PY45N7IWAK',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"amplifyconsole-backend-role","roleId":"AROA5XIWUT3PY45N7IWAK","arn":"arn:aws:iam::XXXXXXXXXXXX:role/amplifyconsole-backend-role","createDate":"2019-06-25T15:55:43.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22amplify.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AdministratorAccess","policyArn":"arn:aws:iam::aws:policy/AdministratorAccess"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'amplifyconsole-backend-role',
          title: 'amplifyconsole-backend-role',
          configurationItemCaptureTime: '2019-06-25T16:08:16.291Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/amplifyconsole-backend-role',
          resourceCreationTime: '2019-06-25T15:55:43.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '06253f1603f3f0a0cf18dec22f6585d0'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PYC6SGRPIW',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"IsengardRole-DO-NOT-DELETE","roleId":"AROA5XIWUT3PYC6SGRPIW","arn":"arn:aws:iam::XXXXXXXXXXXX:role/IsengardRole-DO-NOT-DELETE","createDate":"2019-04-03T09:07:11.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A727820809195%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22IsengardExternalId0ZX3FPFYgBXA%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"IsengardControllerPolicy","policyDocument":"%7B%22Version%22%3A%20%222012-10-17%22%2C%20%22Statement%22%3A%20%5B%20%7B%22Effect%22%3A%20%22Allow%22%2C%20%22Action%22%3A%20%22%2A%22%2C%20%22Resource%22%3A%20%22%2A%22%20%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'IsengardRole-DO-NOT-DELETE',
          title: 'IsengardRole-DO-NOT-DELETE',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/IsengardRole-DO-NOT-DELETE',
          resourceCreationTime: '2019-04-03T09:07:11.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '83f2db3292deccfe7b445b0e974857ee'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P4RLNO74DE',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"IsengardConfigRole","roleId":"AROA5XIWUT3P4RLNO74DE","arn":"arn:aws:iam::XXXXXXXXXXXX:role/IsengardConfigRole","createDate":"2019-04-03T09:07:24.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22config-setup.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22IsengardConfigRoleGnpikaR0Pm0O%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"ConfigAccessPolicy","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/ConfigAccessPolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'IsengardConfigRole',
          title: 'IsengardConfigRole',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/IsengardConfigRole',
          resourceCreationTime: '2019-04-03T09:07:24.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '9e886599ea44583d7921e11710e5d5ad'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P6QO6KNL2D',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/service-role/","roleName":"AWSCodePipelineServiceRole-eu-west-1-zoom-discovery","roleId":"AROA5XIWUT3P6QO6KNL2D","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery","createDate":"2019-05-17T15:20:49.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22codepipeline.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSCodePipelineServiceRole-eu-west-1-zoom-discovery","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSCodePipelineServiceRole-eu-west-1-zoom-discovery',
          title: 'AWSCodePipelineServiceRole-eu-west-1-zoom-discovery',
          configurationItemCaptureTime: '2019-05-17T15:31:56.736Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/service-role/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery',
          resourceCreationTime: '2019-05-17T15:20:49.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '26d6250dd3eff9f407d9bcb376fb6ee7'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PQJS4HAMVJ',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/ecs.application-autoscaling.amazonaws.com/","roleName":"AWSServiceRoleForApplicationAutoScaling_ECSService","roleId":"AROA5XIWUT3PQJS4HAMVJ","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService","createDate":"2019-07-19T12:52:14.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22ecs.application-autoscaling.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSApplicationAutoscalingECSServicePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AWSApplicationAutoscalingECSServicePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForApplicationAutoScaling_ECSService',
          title: 'AWSServiceRoleForApplicationAutoScaling_ECSService',
          configurationItemCaptureTime: '2019-07-20T12:43:59.208Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/ecs.application-autoscaling.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService',
          resourceCreationTime: '2019-07-19T12:52:14.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'f4207ebf27b0879d1fd03dc205fbaedd'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PSGSD4XAFC',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"twobytwo-api-APIGatewayCloudWatchLogsRole-RDITH91LZF6Y","roleId":"AROA5XIWUT3PSGSD4XAFC","arn":"arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-api-APIGatewayCloudWatchLogsRole-RDITH91LZF6Y","createDate":"2019-05-10T13:14:47.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22apigateway.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"ApiGatewayLogsPolicy","policyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22logs%3ACreateLogGroup%22%2C%22logs%3ACreateLogStream%22%2C%22logs%3ADescribeLogGroups%22%2C%22logs%3ADescribeLogStreams%22%2C%22logs%3APutLogEvents%22%2C%22logs%3AGetLogEvents%22%2C%22logs%3AFilterLogEvents%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'twobytwo-api-APIGatewayCloudWatchLogsRole-RDITH91LZF6Y',
          title: 'twobytwo-api-APIGatewayCloudWatchLogsRole-RDITH91LZF6Y',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-api-APIGatewayCloudWatchLogsRole-RDITH91LZF6Y',
          resourceCreationTime: '2019-05-10T13:14:47.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'e3477b8b91565435edae53bac15fc435'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PV7TH6ENQK',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"AwsSecurityAudit","roleId":"AROA5XIWUT3PV7TH6ENQK","arn":"arn:aws:iam::XXXXXXXXXXXX:role/AwsSecurityAudit","createDate":"2019-04-03T09:07:23.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A877377650033%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22AwsSecurityAuditB96BMLcIdZjm%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"SecurityAudit","policyArn":"arn:aws:iam::aws:policy/SecurityAudit"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AwsSecurityAudit',
          title: 'AwsSecurityAudit',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/AwsSecurityAudit',
          resourceCreationTime: '2019-04-03T09:07:23.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '01e4c3c777996f4b11e884dfdd1b7345'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'AROA5XIWUT3PVZCQSXTB4',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"DiscoveryRole","roleId":"AROA5XIWUT3PVZCQSXTB4","arn":"arn:aws:iam::XXXXXXXXXXXX:role/DiscoveryRole","createDate":"2019-05-10T13:46:28.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3AXXXXXXXXXXXX%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"idea-backfill","policyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22config%3AGet%2A%22%2C%22config%3ADescribe%2A%22%2C%22config%3ADeliver%2A%22%2C%22config%3AList%2A%22%2C%22tag%3AGetResources%22%2C%22tag%3AGetTagKeys%22%2C%22cloudtrail%3ADescribeTrails%22%2C%22cloudtrail%3AGetTrailStatus%22%2C%22cloudtrail%3ALookupEvents%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%5D%7D"},{"policyName":"zoom-discovery-data-s3","policyDocument":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sid%22%3A%20%22VisualEditor0%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%22s3%3AListBucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Abucket-name%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sid%22%3A%20%22VisualEditor1%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%22s3%3A%2AObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-data%2F%2A%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D"}],"attachedManagedPolicies":[{"policyName":"AutoScalingFullAccess","policyArn":"arn:aws:iam::aws:policy/AutoScalingFullAccess"},{"policyName":"AWSConfigUserAccess","policyArn":"arn:aws:iam::aws:policy/AWSConfigUserAccess"},{"policyName":"AmazonAPIGatewayAdministrator","policyArn":"arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator"},{"policyName":"ElasticLoadBalancingReadOnly","policyArn":"arn:aws:iam::aws:policy/ElasticLoadBalancingReadOnly"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'DiscoveryRole',
          title: 'DiscoveryRole',
          configurationItemCaptureTime: '2019-06-11T09:22:32.744Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/DiscoveryRole',
          resourceCreationTime: '2019-05-10T13:46:28.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '3f416c805567e87dfc174c0badbf1c46'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PWY6JHPHC7',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/support.amazonaws.com/","roleName":"AWSServiceRoleForSupport","roleId":"AROA5XIWUT3PWY6JHPHC7","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/support.amazonaws.com/AWSServiceRoleForSupport","createDate":"2019-04-03T09:06:59.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22support.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSSupportServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AWSSupportServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForSupport',
          title: 'AWSServiceRoleForSupport',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/support.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/support.amazonaws.com/AWSServiceRoleForSupport',
          resourceCreationTime: '2019-04-03T09:06:59.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '819bd227d1d27fac394ad3c063b83b7a'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PX4YRN3FAR',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/service-role/","roleName":"cwe-role-eu-west-1-zoom-api","roleId":"AROA5XIWUT3PX4YRN3FAR","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/cwe-role-eu-west-1-zoom-api","createDate":"2019-06-24T12:51:39.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22events.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"start-pipeline-execution-eu-west-1-zoom-api","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/start-pipeline-execution-eu-west-1-zoom-api"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'cwe-role-eu-west-1-zoom-api',
          title: 'cwe-role-eu-west-1-zoom-api',
          configurationItemCaptureTime: '2019-06-24T13:02:33.066Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/service-role/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/cwe-role-eu-west-1-zoom-api',
          resourceCreationTime: '2019-06-24T12:51:39.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'bb92fd9d332b4c952ad5b3913923c1e6'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'AROA5XIWUT3P44ZMG5L3A',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"CodeDeployServiceRole","roleId":"AROA5XIWUT3P44ZMG5L3A","arn":"arn:aws:iam::XXXXXXXXXXXX:role/CodeDeployServiceRole","createDate":"2019-05-17T10:52:08.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22codedeploy.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"CodeDeploy-EC2-Permissions","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/CodeDeploy-EC2-Permissions"},{"policyName":"AWSCodeDeployFullAccess","policyArn":"arn:aws:iam::aws:policy/AWSCodeDeployFullAccess"},{"policyName":"AWSCodeDeployRole","policyArn":"arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'CodeDeployServiceRole',
          title: 'CodeDeployServiceRole',
          configurationItemCaptureTime: '2019-05-17T11:35:21.179Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/CodeDeployServiceRole',
          resourceCreationTime: '2019-05-17T10:52:08.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '8f18d4ec0decf9bc2a1916b1c3797e99'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P7EXG55OBM',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"zoom-ui-dev-20190621112019-unauthRole","roleId":"AROA5XIWUT3P7EXG55OBM","arn":"arn:aws:iam::XXXXXXXXXXXX:role/zoom-ui-dev-20190621112019-unauthRole","createDate":"2019-06-21T10:20:27.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Federated%22%3A%22cognito-identity.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRoleWithWebIdentity%22%2C%22Condition%22%3A%7B%22ForAnyValue%3AStringLike%22%3A%7B%22cognito-identity.amazonaws.com%3Aamr%22%3A%22unauthenticated%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'zoom-ui-dev-20190621112019-unauthRole',
          title: 'zoom-ui-dev-20190621112019-unauthRole',
          configurationItemCaptureTime: '2019-06-21T10:32:29.870Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/zoom-ui-dev-20190621112019-unauthRole',
          resourceCreationTime: '2019-06-21T10:20:27.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'c18cbb8b61406f65364271cbfeb61a34'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PSNBKU6QYR',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/es.amazonaws.com/","roleName":"AWSServiceRoleForAmazonElasticsearchService","roleId":"AROA5XIWUT3PSNBKU6QYR","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/es.amazonaws.com/AWSServiceRoleForAmazonElasticsearchService","createDate":"2019-04-25T16:12:44.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22es.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AmazonElasticsearchServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AmazonElasticsearchServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForAmazonElasticsearchService',
          title: 'AWSServiceRoleForAmazonElasticsearchService',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/es.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/es.amazonaws.com/AWSServiceRoleForAmazonElasticsearchService',
          resourceCreationTime: '2019-04-25T16:12:44.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '2cb63cfa494c520389d0f8311aa34b2d'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'AROA5XIWUT3PTUV47EUQ7',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"ZoomDiscoveryRole","roleId":"AROA5XIWUT3PTUV47EUQ7","arn":"arn:aws:iam::XXXXXXXXXXXX:role/ZoomDiscoveryRole","createDate":"2019-06-12T08:18:39.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3AXXXXXXXXXXXX%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[{"path":"/","instanceProfileName":"ZoomDiscoveryRole","instanceProfileId":"AIPA5XIWUT3PTY3D5J77U","arn":"arn:aws:iam::XXXXXXXXXXXX:instance-profile/ZoomDiscoveryRole","createDate":"2019-06-12T08:18:39.000Z","roles":[{"path":"/","roleName":"ZoomDiscoveryRole","roleId":"AROA5XIWUT3PTUV47EUQ7","arn":"arn:aws:iam::XXXXXXXXXXXX:role/ZoomDiscoveryRole","createDate":"2019-06-12T08:18:39.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3AXXXXXXXXXXXX%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","description":null,"maxSessionDuration":null,"permissionsBoundary":null,"tags":[]}]}],"rolePolicyList":[{"policyName":"zoom-discovery-data-s3","policyDocument":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sid%22%3A%20%22VisualEditor0%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%22s3%3AListBucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Abucket-name%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sid%22%3A%20%22VisualEditor1%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%22s3%3A%2AObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-data%2F%2A%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D"}],"attachedManagedPolicies":[{"policyName":"AutoScalingFullAccess","policyArn":"arn:aws:iam::aws:policy/AutoScalingFullAccess"},{"policyName":"AmazonVPCReadOnlyAccess","policyArn":"arn:aws:iam::aws:policy/AmazonVPCReadOnlyAccess"},{"policyName":"AWSConfigUserAccess","policyArn":"arn:aws:iam::aws:policy/AWSConfigUserAccess"},{"policyName":"AmazonAPIGatewayAdministrator","policyArn":"arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator"},{"policyName":"AmazonECS_FullAccess","policyArn":"arn:aws:iam::aws:policy/AmazonECS_FullAccess"},{"policyName":"AmazonRDSReadOnlyAccess","policyArn":"arn:aws:iam::aws:policy/AmazonRDSReadOnlyAccess"},{"policyName":"AWSLambdaReadOnlyAccess","policyArn":"arn:aws:iam::aws:policy/AWSLambdaReadOnlyAccess"},{"policyName":"ElasticLoadBalancingReadOnly","policyArn":"arn:aws:iam::aws:policy/ElasticLoadBalancingReadOnly"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'ZoomDiscoveryRole',
          title: 'ZoomDiscoveryRole',
          configurationItemCaptureTime: '2019-07-04T05:58:08.576Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/ZoomDiscoveryRole',
          resourceCreationTime: '2019-06-12T08:18:39.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '020f0a5b9b1aa2d94bb0049ffc928842'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PUWUGOOPQE',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"zoom-lambda-role","roleId":"AROA5XIWUT3PUWUGOOPQE","arn":"arn:aws:iam::XXXXXXXXXXXX:role/zoom-lambda-role","createDate":"2019-06-04T11:02:35.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22lambda.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSLambdaBasicExecutionRole","policyArn":"arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"},{"policyName":"AWSLambdaVPCAccessExecutionRole","policyArn":"arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"},{"policyName":"AWSLambdaRole","policyArn":"arn:aws:iam::aws:policy/service-role/AWSLambdaRole"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'zoom-lambda-role',
          title: 'zoom-lambda-role',
          configurationItemCaptureTime: '2019-06-04T11:12:51.794Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/zoom-lambda-role',
          resourceCreationTime: '2019-06-04T11:02:35.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '009044c4116e158289674ec72743c845'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PWISDWULIE',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"Admin","roleId":"AROA5XIWUT3PWISDWULIE","arn":"arn:aws:iam::XXXXXXXXXXXX:role/Admin","createDate":"2019-04-03T09:11:12.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A727820809195%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22IsengardExternalIdHkBRs0c9ug8v%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AdministratorAccess","policyArn":"arn:aws:iam::aws:policy/AdministratorAccess"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'Admin',
          title: 'Admin',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/Admin',
          resourceCreationTime: '2019-04-03T09:11:12.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'd2844e82c5896a232fa241a6edafa966'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PWJJDXMS2S',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/ecs.amazonaws.com/","roleName":"AWSServiceRoleForECS","roleId":"AROA5XIWUT3PWJJDXMS2S","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS","createDate":"2019-07-03T13:43:56.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22ecs.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AmazonECSServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AmazonECSServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForECS',
          title: 'AWSServiceRoleForECS',
          configurationItemCaptureTime: '2019-07-04T12:43:57.674Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/ecs.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS',
          resourceCreationTime: '2019-07-03T13:43:56.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '6e1bea55263da3bd14ade34df2bea360'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PXEK5J3ILX',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"twobytwo-lambda-InsightLambdaExecutionRole-1VNFHGXL9PQ1W","roleId":"AROA5XIWUT3PXEK5J3ILX","arn":"arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-lambda-InsightLambdaExecutionRole-1VNFHGXL9PQ1W","createDate":"2019-05-10T12:18:02.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22lambda.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"LambdaExecutionRolePolicy","policyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22es%3AESHttpDelete%22%2C%22es%3AESHttpGet%22%2C%22es%3AESHttpHead%22%2C%22es%3AESHttpPost%22%2C%22es%3AESHttpPut%22%5D%2C%22Resource%22%3A%22arn%3Aaws%3Aes%3A%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22logs%3ACreateLogGroup%22%2C%22logs%3ACreateLogStream%22%2C%22logs%3APutLogEvents%22%5D%2C%22Resource%22%3A%22arn%3Aaws%3Alogs%3A%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22ec2%3ACreateNetworkInterface%22%2C%22ec2%3ADescribeNetworkInterfaces%22%2C%22ec2%3ADeleteNetworkInterface%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22sns%3APublish%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22lambda%3AInvokeFunction%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22s3%3Aget%2A%22%2C%22s3%3Alist%2A%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22comprehend%3A%2A%22%2C%22s3%3AListAllMyBuckets%22%2C%22s3%3AListBucket%22%2C%22s3%3AGetBucketLocation%22%2C%22iam%3AListRoles%22%2C%22iam%3AGetRole%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22dynamodb%3ABatchGetItem%22%2C%22dynamodb%3AGetItem%22%2C%22dynamodb%3AQuery%22%2C%22dynamodb%3AScan%22%2C%22dynamodb%3ABatchWriteItem%22%2C%22dynamodb%3APutItem%22%2C%22dynamodb%3AUpdateItem%22%2C%22dynamodb%3ADeleteItem%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'twobytwo-lambda-InsightLambdaExecutionRole-1VNFHGXL9PQ1W',
          title: 'twobytwo-lambda-InsightLambdaExecutionRole-1VNFHGXL9PQ1W',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-lambda-InsightLambdaExecutionRole-1VNFHGXL9PQ1W',
          resourceCreationTime: '2019-05-10T12:18:02.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '38c21a5fbc41f8266a528a9367e65f42'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PXOOFZCSL3',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/trustedadvisor.amazonaws.com/","roleName":"AWSServiceRoleForTrustedAdvisor","roleId":"AROA5XIWUT3PXOOFZCSL3","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/trustedadvisor.amazonaws.com/AWSServiceRoleForTrustedAdvisor","createDate":"2019-04-03T09:06:59.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22trustedadvisor.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSTrustedAdvisorServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AWSTrustedAdvisorServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForTrustedAdvisor',
          title: 'AWSServiceRoleForTrustedAdvisor',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/trustedadvisor.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/trustedadvisor.amazonaws.com/AWSServiceRoleForTrustedAdvisor',
          resourceCreationTime: '2019-04-03T09:06:59.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '0eda29ffd5a354a2eeadf3cd510ece99'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PYZMFRQTFI',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/config.amazonaws.com/","roleName":"AWSServiceRoleForConfig","roleId":"AROA5XIWUT3PYZMFRQTFI","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig","createDate":"2019-04-29T16:35:46.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22config.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSConfigServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AWSConfigServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForConfig',
          title: 'AWSServiceRoleForConfig',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/config.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig',
          resourceCreationTime: '2019-04-29T16:35:46.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '7df89f01655208df456eee950a8ef5fe'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P7RYF3GGAW',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/service-role/","roleName":"codebuild-zoom-api-service-role","roleId":"AROA5XIWUT3P7RYF3GGAW","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/codebuild-zoom-api-service-role","createDate":"2019-06-24T12:03:58.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22codebuild.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"CodeBuildBasePolicy-zoom-api-eu-west-1","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'codebuild-zoom-api-service-role',
          title: 'codebuild-zoom-api-service-role',
          configurationItemCaptureTime: '2019-06-24T12:18:03.281Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/service-role/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/codebuild-zoom-api-service-role',
          resourceCreationTime: '2019-06-24T12:03:58.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '85d0d5afd91aad8ec5b89f41f2144e3e'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PWOWJSEJJS',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/service-role/","roleName":"gremlin-dev-role-5w4kbr7g","roleId":"AROA5XIWUT3PWOWJSEJJS","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/gremlin-dev-role-5w4kbr7g","createDate":"2019-06-04T10:51:11.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22lambda.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'gremlin-dev-role-5w4kbr7g',
          title: 'gremlin-dev-role-5w4kbr7g',
          configurationItemCaptureTime: '2019-06-04T11:02:18.615Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/service-role/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/gremlin-dev-role-5w4kbr7g',
          resourceCreationTime: '2019-06-04T10:51:11.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'cf14f782d53f1d237c9cdd66b1af7121'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'AROA5XIWUT3P2QHWKVOV6',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/service-role/","roleName":"codebuild-zoom-discovery-service-role","roleId":"AROA5XIWUT3P2QHWKVOV6","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/codebuild-zoom-discovery-service-role","createDate":"2019-05-15T10:49:10.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22codebuild.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"CodeBuildBasePolicy-zoom_discovery-eu-west-1","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom_discovery-eu-west-1"},{"policyName":"CodeBuildBasePolicy-zoom-discovery-eu-west-1","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-discovery-eu-west-1"},{"policyName":"CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'codebuild-zoom-discovery-service-role',
          title: 'codebuild-zoom-discovery-service-role',
          configurationItemCaptureTime: '2019-05-15T20:56:54.687Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/service-role/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/codebuild-zoom-discovery-service-role',
          resourceCreationTime: '2019-05-15T10:49:10.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '67ccd48054ecca3144bcacae9a519663'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PS3VYHIH5H',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"ec2-codedeploy","roleId":"AROA5XIWUT3PS3VYHIH5H","arn":"arn:aws:iam::XXXXXXXXXXXX:role/ec2-codedeploy","createDate":"2019-05-17T12:28:03.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22ec2.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[{"path":"/","instanceProfileName":"ec2-codedeploy","instanceProfileId":"AIPA5XIWUT3PX5K6M2DMW","arn":"arn:aws:iam::XXXXXXXXXXXX:instance-profile/ec2-codedeploy","createDate":"2019-05-17T12:28:03.000Z","roles":[{"path":"/","roleName":"ec2-codedeploy","roleId":"AROA5XIWUT3PS3VYHIH5H","arn":"arn:aws:iam::XXXXXXXXXXXX:role/ec2-codedeploy","createDate":"2019-05-17T12:28:03.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22ec2.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","description":null,"maxSessionDuration":null,"permissionsBoundary":null,"tags":[]}]}],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"CodeDeploy-EC2-Permissions","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/CodeDeploy-EC2-Permissions"},{"policyName":"AWSCodeDeployFullAccess","policyArn":"arn:aws:iam::aws:policy/AWSCodeDeployFullAccess"},{"policyName":"AWSCodeDeployRole","policyArn":"arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'ec2-codedeploy',
          title: 'ec2-codedeploy',
          configurationItemCaptureTime: '2019-05-17T12:42:06.439Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/ec2-codedeploy',
          resourceCreationTime: '2019-05-17T12:28:03.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'c8482c9343ad540c82f408bb19168625'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P6ZM2XLCWR',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/service-role/","roleName":"codebuild-zoom-ui-service-role","roleId":"AROA5XIWUT3P6ZM2XLCWR","arn":"arn:aws:iam::XXXXXXXXXXXX:role/service-role/codebuild-zoom-ui-service-role","createDate":"2019-05-20T14:32:42.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22codebuild.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"CodeBuildBasePolicy-zoom-ui-eu-west-1","policyArn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-ui-eu-west-1"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'codebuild-zoom-ui-service-role',
          title: 'codebuild-zoom-ui-service-role',
          configurationItemCaptureTime: '2019-05-20T14:42:03.899Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/service-role/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/service-role/codebuild-zoom-ui-service-role',
          resourceCreationTime: '2019-05-20T14:32:42.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '5657388afe9ddf1e7c5f2f895027db87'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P3LPIILXOX',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"GatedGardenInternalAudit","roleId":"AROA5XIWUT3P3LPIILXOX","arn":"arn:aws:iam::XXXXXXXXXXXX:role/GatedGardenInternalAudit","createDate":"2019-04-03T09:07:23.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A222385417670%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22GatedGardenInternalAudit1SPzz2YQPjcp%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"GatedGardenInternalAuditPolicy","policyDocument":"%7B%0A%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22VerifyCloudTrailsExistAndAreMultiRegion%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22cloudtrail%3ADescribeTrails%22%2C%0A%20%20%20%20%20%20%20%20%22cloudtrail%3AGetTrailStatus%22%2C%0A%20%20%20%20%20%20%20%20%22cloudtrail%3AGetEventSelectors%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22CreateCloudTrailIfMissing%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22cloudtrail%3ACreateTrail%22%2C%0A%20%20%20%20%20%20%20%20%22cloudtrail%3AStartLogging%22%2C%0A%20%20%20%20%20%20%20%20%22cloudtrail%3ADeleteTrail%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Acloudtrail%3A%2A%3A%2A%3Atrail%2FDO-NOT-DELETE-GatedGarden-Audit%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22VerifyCWEAuditRulesExists%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22events%3AListRuleNamesByTarget%22%2C%0A%20%20%20%20%20%20%20%20%22events%3AListRules%22%2C%0A%20%20%20%20%20%20%20%20%22events%3AListTargetsByRule%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22VerifyCWESingleAuditRule%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22events%3ADescribeRule%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Aevents%3A%2A%3A%2A%3Arule%2FDO-NOT-DELETE-GatedGarden-Audit%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22CreateCodeDeployAndLambdaCWERules%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22events%3APutRule%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Aevents%3A%2A%3A%2A%3Arule%2FDO-NOT-DELETE-GatedGarden-Audit%2A%22%2C%0A%20%20%20%20%20%20%22Condition%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22StringEquals%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22events%3Asource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22aws.codedeploy%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22aws.lambda%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22aws.codecommit%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22aws.codebuild%22%0A%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22DeliverCWEEventsToGatedGardenBus%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22events%3APutTargets%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Aevents%3A%2A%3A%2A%3Arule%2FDO-NOT-DELETE-GatedGarden-Audit%2A%22%2C%0A%20%20%20%20%20%20%22Condition%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22ArnLike%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22events%3ATargetArn%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Aevents%3A%2A%3A222385417670%3Aevent-bus%2Fdefault%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Aevents%3A%2A%3A714005885464%3Aevent-bus%2Fdefault%22%0A%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22CreateCloudTrailBucketIfMissing%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22s3%3ACreateBucket%22%2C%0A%20%20%20%20%20%20%20%20%22s3%3APutLifecycleConfiguration%22%2C%0A%20%20%20%20%20%20%20%20%22s3%3APutBucketPolicy%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Acloudtrail-awslogs-gatedgardenaudit-%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22CreateCodeBuildTrackingInfoBucketIfMissing%22%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22s3%3ACreateBucket%22%2C%0A%20%20%20%20%20%20%20%20%22s3%3APutBucketPolicy%22%2C%0A%20%20%20%20%20%20%20%20%22s3%3APutLifecycleConfiguration%22%2C%0A%20%20%20%20%20%20%20%20%22s3%3AGet%2A%22%2C%0A%20%20%20%20%20%20%20%20%22s3%3AList%2A%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Ado-not-delete-gatedgarden-audit-%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22AntiEntropyListOfLambdaAndValidatingLatest%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22lambda%3AGetFunctionConfiguration%22%2C%0A%20%20%20%20%20%20%20%20%22lambda%3AListFunctions%22%2C%0A%20%20%20%20%20%20%20%20%22lambda%3AListVersionsByFunction%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22GetFunctionMetadata%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22lambda%3AGetFunction%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22CodeDeployAudit%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22codedeploy%3ABatchGetApplications%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3ABatchGetDeployments%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3ABatchGetOnPremisesInstances%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AGetApplication%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AGetApplicationRevision%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeployment%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeploymentConfig%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeploymentGroup%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeploymentInstance%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AGetOnPremisesInstance%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AListApplicationRevisions%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AListApplications%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AListDeploymentConfigs%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AListDeploymentGroups%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AListDeploymentInstances%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AListDeployments%22%2C%0A%20%20%20%20%20%20%20%20%22codedeploy%3AListOnPremisesInstances%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22CodeCommitAudit%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%2C%0A%20%20%20%20%20%20%20%20%22codecommit%3AGetCommit%22%2C%0A%20%20%20%20%20%20%20%20%22codecommit%3AGetRepository%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Acodecommit%3A%2A%3A%2A%3A%2A%22%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Sid%22%3A%20%22CodeBuildBuildHistoryAndDetailsReadAccess%22%2C%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22codebuild%3ABatchGetBuilds%22%2C%0A%20%20%20%20%20%20%20%20%22codebuild%3AListBuilds%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Acodebuild%3A%2A%3A%2A%3A%2A%22%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D%0A"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'GatedGardenInternalAudit',
          title: 'GatedGardenInternalAudit',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/GatedGardenInternalAudit',
          resourceCreationTime: '2019-04-03T09:07:23.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '9e67c324025ed0c554515d1915f919c9'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P5AHI6ZI3Y',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"GatedGardenAudit","roleId":"AROA5XIWUT3P5AHI6ZI3Y","arn":"arn:aws:iam::XXXXXXXXXXXX:role/GatedGardenAudit","createDate":"2019-04-03T09:07:23.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22AWS%22%3A%22arn%3Aaws%3Aiam%3A%3A638951966944%3Aroot%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22GatedGardenAuditv3QxXOeI3CO8%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"GatedGardenPolicy","policyDocument":"%7B%22Version%22%3A%20%222012-10-17%22%2C%20%22Statement%22%3A%20%5B%20%7B%20%22Sid%22%3A%20%22Stmt1464749381022%22%2C%20%22Action%22%3A%20%5B%20%22codedeploy%3ABatchGetApplications%22%2C%20%22codedeploy%3ABatchGetDeployments%22%2C%20%22codedeploy%3ABatchGetOnPremisesInstances%22%2C%20%22codedeploy%3AGetApplication%22%2C%20%22codedeploy%3AGetApplicationRevision%22%2C%20%22codedeploy%3AGetDeployment%22%2C%20%22codedeploy%3AGetDeploymentConfig%22%2C%20%22codedeploy%3AGetDeploymentGroup%22%2C%20%22codedeploy%3AGetDeploymentInstance%22%2C%20%22codedeploy%3AGetOnPremisesInstance%22%2C%20%22codedeploy%3AListApplicationRevisions%22%2C%20%22codedeploy%3AListApplications%22%2C%20%22codedeploy%3AListDeploymentConfigs%22%2C%20%22codedeploy%3AListDeploymentGroups%22%2C%20%22codedeploy%3AListDeploymentInstances%22%2C%20%22codedeploy%3AListDeployments%22%2C%20%22codedeploy%3AListOnPremisesInstances%22%5D%2C%20%22Effect%22%3A%20%22Allow%22%2C%20%22Resource%22%3A%20%22%2A%22%20%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'GatedGardenAudit',
          title: 'GatedGardenAudit',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/GatedGardenAudit',
          resourceCreationTime: '2019-04-03T09:07:23.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'a246e6ac48bf7fda059a647018638800'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P5NP3HKZIF',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"ecsTaskExecutionRole","roleId":"AROA5XIWUT3P5NP3HKZIF","arn":"arn:aws:iam::XXXXXXXXXXXX:role/ecsTaskExecutionRole","createDate":"2019-07-03T15:09:39.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222008-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22ecs-tasks.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AmazonECSTaskExecutionRolePolicy","policyArn":"arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'ecsTaskExecutionRole',
          title: 'ecsTaskExecutionRole',
          configurationItemCaptureTime: '2019-07-03T15:23:33.762Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/ecsTaskExecutionRole',
          resourceCreationTime: '2019-07-03T15:09:39.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'b809d54e06de2f1317d80374a3c29199'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3P776WPM4DB',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"zoomui46f3964f_sns-role-dev","roleId":"AROA5XIWUT3P776WPM4DB","arn":"arn:aws:iam::XXXXXXXXXXXX:role/zoomui46f3964f_sns-role-dev","createDate":"2019-06-21T10:25:03.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22cognito-idp.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%2C%22Condition%22%3A%7B%22StringEquals%22%3A%7B%22sts%3AExternalId%22%3A%22zoomui46f3964f_role_external_id%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"zoomui46f3964f-sns-policy","policyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22sns%3APublish%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'zoomui46f3964f_sns-role-dev',
          title: 'zoomui46f3964f_sns-role-dev',
          configurationItemCaptureTime: '2019-06-21T10:36:58.857Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/zoomui46f3964f_sns-role-dev',
          resourceCreationTime: '2019-06-21T10:25:03.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'c8e52a361aac6fe7d82d9981a9589109'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PRXBEGEEMD',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"zoom-ui-dev-20190621112019-authRole","roleId":"AROA5XIWUT3PRXBEGEEMD","arn":"arn:aws:iam::XXXXXXXXXXXX:role/zoom-ui-dev-20190621112019-authRole","createDate":"2019-06-21T10:20:26.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Sid%22%3A%22%22%2C%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Federated%22%3A%22cognito-identity.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRoleWithWebIdentity%22%2C%22Condition%22%3A%7B%22ForAnyValue%3AStringLike%22%3A%7B%22cognito-identity.amazonaws.com%3Aamr%22%3A%22authenticated%22%7D%7D%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'zoom-ui-dev-20190621112019-authRole',
          title: 'zoom-ui-dev-20190621112019-authRole',
          configurationItemCaptureTime: '2019-06-21T10:32:30.489Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/zoom-ui-dev-20190621112019-authRole',
          resourceCreationTime: '2019-06-21T10:20:26.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'cf804844381afab8e69fddda45f6432e'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PTHVHIN35L',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/elasticloadbalancing.amazonaws.com/","roleName":"AWSServiceRoleForElasticLoadBalancing","roleId":"AROA5XIWUT3PTHVHIN35L","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing","createDate":"2019-04-30T12:51:40.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22elasticloadbalancing.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AWSElasticLoadBalancingServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AWSElasticLoadBalancingServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForElasticLoadBalancing',
          title: 'AWSServiceRoleForElasticLoadBalancing',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/elasticloadbalancing.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing',
          resourceCreationTime: '2019-04-30T12:51:40.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '301c84be3c0a5e66fe8be7b763770d3d'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PUOIYQWB2N',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"ecsAutoscaleRole","roleId":"AROA5XIWUT3PUOIYQWB2N","arn":"arn:aws:iam::XXXXXXXXXXXX:role/ecsAutoscaleRole","createDate":"2019-07-19T12:52:03.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22application-autoscaling.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AmazonEC2ContainerServiceAutoscaleRole","policyArn":"arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceAutoscaleRole"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'ecsAutoscaleRole',
          title: 'ecsAutoscaleRole',
          configurationItemCaptureTime: '2019-07-19T13:03:09.189Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/ecsAutoscaleRole',
          resourceCreationTime: '2019-07-19T12:52:03.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '2fa8149f27b8a39ff6d51fde06c5ee54'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PVCR7UJYFV',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/","roleName":"twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9","roleId":"AROA5XIWUT3PVCR7UJYFV","arn":"arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9","createDate":"2019-05-10T12:13:47.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22lambda.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"NotificationLambdaExecutionRolePolicy","policyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22logs%3ACreateLogGroup%22%2C%22logs%3ACreateLogStream%22%2C%22logs%3APutLogEvents%22%5D%2C%22Resource%22%3A%22arn%3Aaws%3Alogs%3A%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22ec2%3ACreateNetworkInterface%22%2C%22ec2%3ADescribeNetworkInterfaces%22%2C%22ec2%3ADeleteNetworkInterface%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22sns%3ASubscribe%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22ses%3ASendEmail%22%2C%22ses%3ASendRawEmail%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22lambda%3AInvokeFunction%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22s3%3Aget%2A%22%2C%22s3%3Alist%2A%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9',
          title: 'twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9',
          resourceCreationTime: '2019-05-10T12:13:47.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: '4218c7adcd49ee80dd01229cf9b59475'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'AROA5XIWUT3PWPLU4LSBF',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"path":"/aws-service-role/autoscaling.amazonaws.com/","roleName":"AWSServiceRoleForAutoScaling","roleId":"AROA5XIWUT3PWPLU4LSBF","arn":"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling","createDate":"2019-05-10T13:26:07.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22autoscaling.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[],"attachedManagedPolicies":[{"policyName":"AutoScalingServiceRolePolicy","policyArn":"arn:aws:iam::aws:policy/aws-service-role/AutoScalingServiceRolePolicy"}],"permissionsBoundary":null,"tags":[]}',
          configurationItemMD5Hash: '',
          resourceName: 'AWSServiceRoleForAutoScaling',
          title: 'AWSServiceRoleForAutoScaling',
          configurationItemCaptureTime: '2019-05-13T12:43:51.795Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/roles',
          path: '/aws-service-role/autoscaling.amazonaws.com/',
          configurationStateId: '1563713040609',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling',
          resourceCreationTime: '2019-05-10T13:26:07.000Z',
          resourceType: 'AWS::IAM::Role'
        },
        label: 'AWS::IAM::Role',
        id: 'b01b4a098c5e41240c90e5f27e9676bb'
      }
    ]
  }

  return results;
};

const createPolicyOutputXXXXXXXXXXXX = () => {

  let results = {
    success: true,
    results: [
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3P7CLHX2ZMO',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"CodeBuildBasePolicy-zoom-api-eu-west-1","policyId":"ANPA5XIWUT3P7CLHX2ZMO","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1","path":"/service-role/","defaultVersionId":"v5","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-06-24T12:03:58.000Z","updateDate":"2019-06-24T12:26:36.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v5","isDefaultVersion":true,"createDate":"2019-06-24T12:26:36.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v4","isDefaultVersion":false,"createDate":"2019-06-24T12:23:26.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v3","isDefaultVersion":false,"createDate":"2019-06-24T12:20:18.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v2","isDefaultVersion":false,"createDate":"2019-06-24T12:08:22.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":false,"createDate":"2019-06-24T12:03:58.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'CodeBuildBasePolicy-zoom-api-eu-west-1',
          title: 'CodeBuildBasePolicy-zoom-api-eu-west-1',
          configurationItemCaptureTime: '2019-06-24T12:43:49.778Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1',
          resourceCreationTime: '2019-06-24T12:03:58.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: '6773ec50a59017f1b50b60ef6af45d19'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3P4MSGYBY25',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"start-pipeline-execution-eu-west-1-zoom-api","policyId":"ANPA5XIWUT3P4MSGYBY25","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/start-pipeline-execution-eu-west-1-zoom-api","path":"/service-role/","defaultVersionId":"v2","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-06-24T12:51:40.000Z","updateDate":"2019-06-24T12:51:40.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codepipeline%3AStartPipelineExecution%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodepipeline%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v2","isDefaultVersion":true,"createDate":"2019-06-24T12:51:40.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codepipeline%3AStartPipelineExecution%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodepipeline%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":false,"createDate":"2019-06-24T12:51:40.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'start-pipeline-execution-eu-west-1-zoom-api',
          title: 'start-pipeline-execution-eu-west-1-zoom-api',
          configurationItemCaptureTime: '2019-06-25T12:43:53.436Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/start-pipeline-execution-eu-west-1-zoom-api',
          resourceCreationTime: '2019-06-24T12:51:40.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: 'a2059ab1efd0edabe5e2f3811fe14aab'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'ANPA5XIWUT3P75I565ABS',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"AwsSecurityNacundaAuditPolicy","policyId":"ANPA5XIWUT3P75I565ABS","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/AwsSecurityNacundaAuditPolicy","path":"/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-04-03T09:07:23.000Z","updateDate":"2019-04-03T09:07:23.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22guardduty%3ACreateDetector%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22guardduty%3AGetDetector%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22guardduty%3AListDetectors%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22guardduty%3AUpdateDetector%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3ACreateServiceLinkedRole%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Aiam%3A%3AXXXXXXXXXXXX%3Arole%2Faws-service-role%2Fguardduty.amazonaws.com%2FAWSServiceRoleForAmazonGuardDuty%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Condition%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22StringLike%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3AAWSServiceName%22%3A%20%22guardduty.amazonaws.com%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22events%3APutRule%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22events%3ADeleteRule%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22events%3ADescribeRule%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22events%3ADisableRule%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22events%3AEnableRule%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22events%3AListTargetsByRule%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22events%3APutTargets%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22events%3ARemoveTargets%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Aevents%3A%2A%3AXXXXXXXXXXXX%3Arule%2FAwsSecurityNacundaAuditFindings-DO-NOT-DELETE%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":true,"createDate":"2019-04-03T09:07:23.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'AwsSecurityNacundaAuditPolicy',
          title: 'AwsSecurityNacundaAuditPolicy',
          configurationItemCaptureTime: '2019-05-13T12:43:50.962Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/AwsSecurityNacundaAuditPolicy',
          resourceCreationTime: '2019-04-03T09:07:23.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: 'adafbdf8d857daef00c188526389e56f'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PQZCZZTZNJ',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c","policyId":"ANPA5XIWUT3PQZCZZTZNJ","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c","path":"/service-role/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-06-04T10:51:11.000Z","updateDate":"2019-06-04T10:51:11.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3A%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Flambda%2Fgremlin-dev%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":true,"createDate":"2019-06-04T10:51:11.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c',
          title: 'AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c',
          configurationItemCaptureTime: '2019-06-04T12:43:50.523Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSLambdaBasicExecutionRole-6c1b4505-af7c-4018-9512-9128f0b5a04c',
          resourceCreationTime: '2019-06-04T10:51:11.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: 'ba37dfa2bb3ee08a6ff9af2262181e00'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PTSOS4EAST',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"start-pipeline-execution-eu-west-1-zoom-discovery","policyId":"ANPA5XIWUT3PTSOS4EAST","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/start-pipeline-execution-eu-west-1-zoom-discovery","path":"/service-role/","defaultVersionId":"v2","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-05-17T15:20:52.000Z","updateDate":"2019-05-17T15:20:52.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codepipeline%3AStartPipelineExecution%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodepipeline%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v2","isDefaultVersion":true,"createDate":"2019-05-17T15:20:52.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codepipeline%3AStartPipelineExecution%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodepipeline%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":false,"createDate":"2019-05-17T15:20:52.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'start-pipeline-execution-eu-west-1-zoom-discovery',
          title: 'start-pipeline-execution-eu-west-1-zoom-discovery',
          configurationItemCaptureTime: '2019-05-18T12:43:54.020Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/start-pipeline-execution-eu-west-1-zoom-discovery',
          resourceCreationTime: '2019-05-17T15:20:52.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: '8c5086a58c8970d3185501ccf98030fd'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PXXDERMG6N',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"CodeBuildBasePolicy-zoom-ui-eu-west-1","policyId":"ANPA5XIWUT3PXXDERMG6N","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-ui-eu-west-1","path":"/service-role/","defaultVersionId":"v6","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-05-20T14:32:42.000Z","updateDate":"2019-05-20T15:30:00.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-ui%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v6","isDefaultVersion":true,"createDate":"2019-05-20T15:30:00.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-ui%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v5","isDefaultVersion":false,"createDate":"2019-05-20T15:15:01.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-ui%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v4","isDefaultVersion":false,"createDate":"2019-05-20T15:01:46.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-ui%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v3","isDefaultVersion":false,"createDate":"2019-05-20T14:39:07.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-ui%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v2","isDefaultVersion":false,"createDate":"2019-05-20T14:37:27.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'CodeBuildBasePolicy-zoom-ui-eu-west-1',
          title: 'CodeBuildBasePolicy-zoom-ui-eu-west-1',
          configurationItemCaptureTime: '2019-05-21T12:43:56.357Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-ui-eu-west-1',
          resourceCreationTime: '2019-05-20T14:32:42.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: '5ecc11ab6dc6dd6d3d412059016612ea'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PYCWBHZSHU',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"AWSCodePipelineServiceRole-eu-west-1-zoom-api","policyId":"ANPA5XIWUT3PYCWBHZSHU","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-api","path":"/service-role/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-06-24T12:51:39.000Z","updateDate":"2019-06-24T12:51:39.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3APassRole%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Condition%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22StringEqualsIfExists%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3APassedToService%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticbeanstalk.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ec2.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecs-tasks.amazonaws.com%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3ACancelUploadArchive%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetBranch%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetCommit%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetUploadArchiveStatus%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AUploadArchive%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3ACreateDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetApplication%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetApplicationRevision%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeploymentConfig%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3ARegisterApplicationRevision%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticbeanstalk%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ec2%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticloadbalancing%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22autoscaling%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudwatch%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22sns%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22rds%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22sqs%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecs%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22lambda%3AInvokeFunction%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22lambda%3AListFunctions%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ACreateDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeApps%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeCommands%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeDeployments%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeInstances%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeStacks%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3AUpdateApp%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3AUpdateStack%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ACreateStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADeleteStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADescribeStacks%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AUpdateStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ACreateChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADeleteChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADescribeChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AExecuteChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ASetStackPolicy%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AValidateTemplate%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codebuild%3ABatchGetBuilds%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codebuild%3AStartBuild%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AListProjects%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AListDevicePools%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AGetRun%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AGetUpload%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3ACreateUpload%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AScheduleRun%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3AListProvisioningArtifacts%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ACreateProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ADescribeProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ADeleteProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3AUpdateProduct%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AValidateTemplate%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecr%3ADescribeImages%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%2C%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%0A%7D","versionId":"v1","isDefaultVersion":true,"createDate":"2019-06-24T12:51:39.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'AWSCodePipelineServiceRole-eu-west-1-zoom-api',
          title: 'AWSCodePipelineServiceRole-eu-west-1-zoom-api',
          configurationItemCaptureTime: '2019-06-25T12:43:53.436Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-api',
          resourceCreationTime: '2019-06-24T12:51:39.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: '4437643b1637d6bf0bb917d4b9f64358'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'ANPA5XIWUT3PRL4FSZTUD',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"AWSCloudTrailAccessPolicy","policyId":"ANPA5XIWUT3PRL4FSZTUD","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/AWSCloudTrailAccessPolicy","path":"/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-04-03T09:07:23.000Z","updateDate":"2019-04-03T09:07:23.000Z","policyVersionList":[{"document":"%7B%22Version%22%3A%20%222012-10-17%22%2C%20%22Statement%22%3A%20%5B%20%7B%20%22Effect%22%3A%20%22Allow%22%2C%20%22Action%22%3A%20%5B%20%22s3%3ACreateBucket%22%2C%20%22s3%3APutBucketPolicy%22%2C%20%22s3%3APutLifecycleConfiguration%22%20%5D%2C%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Acloudtrail-awslogs-%2A%22%20%7D%2C%20%7B%22Effect%22%3A%20%22Allow%22%2C%20%22Action%22%3A%20%5B%20%22s3%3AListAllMyBuckets%22%20%5D%2C%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3A%2A%22%20%7D%2C%20%7B%22Effect%22%3A%20%22Allow%22%2C%20%22Action%22%3A%20%5B%20%22cloudtrail%3ACreateTrail%22%2C%20%22cloudtrail%3AStartLogging%22%20%5D%2C%20%22Resource%22%3A%20%22%2A%22%20%7D%20%5D%20%7D%20","versionId":"v1","isDefaultVersion":true,"createDate":"2019-04-03T09:07:23.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'AWSCloudTrailAccessPolicy',
          title: 'AWSCloudTrailAccessPolicy',
          configurationItemCaptureTime: '2019-05-13T12:43:50.962Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/AWSCloudTrailAccessPolicy',
          resourceCreationTime: '2019-04-03T09:07:23.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: 'c0f145149bbc4f68af6972aaae36f2fe'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PYAQ6FAKPI',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"AWSCodePipelineServiceRole-eu-west-1-zoom-discovery","policyId":"ANPA5XIWUT3PYAQ6FAKPI","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery","path":"/service-role/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-05-17T15:20:49.000Z","updateDate":"2019-05-17T15:20:49.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3APassRole%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Condition%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22StringEqualsIfExists%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3APassedToService%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticbeanstalk.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ec2.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecs-tasks.amazonaws.com%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3ACancelUploadArchive%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetBranch%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetCommit%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetUploadArchiveStatus%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AUploadArchive%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3ACreateDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetApplication%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetApplicationRevision%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeploymentConfig%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3ARegisterApplicationRevision%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticbeanstalk%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ec2%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticloadbalancing%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22autoscaling%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudwatch%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22sns%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22rds%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22sqs%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecs%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22lambda%3AInvokeFunction%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22lambda%3AListFunctions%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ACreateDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeApps%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeCommands%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeDeployments%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeInstances%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeStacks%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3AUpdateApp%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3AUpdateStack%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ACreateStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADeleteStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADescribeStacks%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AUpdateStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ACreateChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADeleteChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADescribeChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AExecuteChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ASetStackPolicy%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AValidateTemplate%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codebuild%3ABatchGetBuilds%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codebuild%3AStartBuild%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AListProjects%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AListDevicePools%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AGetRun%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AGetUpload%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3ACreateUpload%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AScheduleRun%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3AListProvisioningArtifacts%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ACreateProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ADescribeProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ADeleteProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3AUpdateProduct%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AValidateTemplate%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecr%3ADescribeImages%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%2C%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%0A%7D","versionId":"v1","isDefaultVersion":true,"createDate":"2019-05-17T15:20:49.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'AWSCodePipelineServiceRole-eu-west-1-zoom-discovery',
          title: 'AWSCodePipelineServiceRole-eu-west-1-zoom-discovery',
          configurationItemCaptureTime: '2019-05-18T12:43:54.020Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery',
          resourceCreationTime: '2019-05-17T15:20:49.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: 'bd8d64e1d38a5b23c5761876d7ad58e3'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PR7TBVFPVQ',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"zoom-bootstrap-policy","policyId":"ANPA5XIWUT3PR7TBVFPVQ","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/zoom-bootstrap-policy","path":"/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-06-13T09:34:15.000Z","updateDate":"2019-06-13T09:34:15.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sid%22%3A%20%22VisualEditor0%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%22s3%3AListBucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Abucket-name%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Sid%22%3A%20%22VisualEditor1%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%22s3%3A%2AObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-data%2F%2A%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":true,"createDate":"2019-06-13T09:34:15.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'zoom-bootstrap-policy',
          title: 'zoom-bootstrap-policy',
          configurationItemCaptureTime: '2019-06-13T12:43:51.652Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/zoom-bootstrap-policy',
          resourceCreationTime: '2019-06-13T09:34:15.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: '94fe68ae8d8b304afb5c82ca0d6517b7'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PSXI6FK57R',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"CodeBuildBasePolicy-zoom_discovery-eu-west-1","policyId":"ANPA5XIWUT3PSXI6FK57R","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom_discovery-eu-west-1","path":"/service-role/","defaultVersionId":"v3","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-05-15T10:53:17.000Z","updateDate":"2019-05-15T11:48:50.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v3","isDefaultVersion":true,"createDate":"2019-05-15T11:48:50.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v2","isDefaultVersion":false,"createDate":"2019-05-15T11:47:43.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":false,"createDate":"2019-05-15T10:53:17.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'CodeBuildBasePolicy-zoom_discovery-eu-west-1',
          title: 'CodeBuildBasePolicy-zoom_discovery-eu-west-1',
          configurationItemCaptureTime: '2019-05-15T12:43:55.897Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom_discovery-eu-west-1',
          resourceCreationTime: '2019-05-15T10:53:17.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: 'a6e62e11df861039982eb199d9432935'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PUSMAS3GEO',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"CodeBuildBasePolicy-zoom-discovery-eu-west-1","policyId":"ANPA5XIWUT3PUSMAS3GEO","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-discovery-eu-west-1","path":"/service-role/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-05-15T10:49:10.000Z","updateDate":"2019-05-15T10:49:10.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codeBuild%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codeBuild%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":true,"createDate":"2019-05-15T10:49:10.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'CodeBuildBasePolicy-zoom-discovery-eu-west-1',
          title: 'CodeBuildBasePolicy-zoom-discovery-eu-west-1',
          configurationItemCaptureTime: '2019-05-15T12:43:55.897Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-discovery-eu-west-1',
          resourceCreationTime: '2019-05-15T10:49:10.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: '94dd416a754d513cea37234f0ab162d9'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PVWIUE4O2M',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"CodeDeploy-EC2-Permissions","policyId":"ANPA5XIWUT3PVWIUE4O2M","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/CodeDeploy-EC2-Permissions","path":"/","defaultVersionId":"v2","attachmentCount":3,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-05-17T11:00:41.000Z","updateDate":"2019-05-17T14:00:09.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGet%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AList%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v2","isDefaultVersion":true,"createDate":"2019-05-17T14:00:09.000Z"},{"document":"%7B%0A%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22s3%3AGet%2A%22%2C%0A%20%20%20%20%20%20%20%20%22s3%3AList%2A%22%0A%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-us-east-2%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-us-east-1%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-us-west-1%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-us-west-2%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-ca-central-1%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-eu-west-1%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-eu-west-2%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-eu-west-3%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-eu-central-1%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-ap-east-1%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-ap-northeast-1%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-ap-northeast-2%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-ap-southeast-1%2F%2A%22%2C%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-ap-southeast-2%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-ap-south-1%2F%2A%22%2C%0A%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Aaws-codedeploy-sa-east-1%2F%2A%22%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":false,"createDate":"2019-05-17T11:00:41.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'CodeDeploy-EC2-Permissions',
          title: 'CodeDeploy-EC2-Permissions',
          configurationItemCaptureTime: '2019-06-13T12:43:51.652Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/CodeDeploy-EC2-Permissions',
          resourceCreationTime: '2019-05-17T11:00:41.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: 'ae076959bdbe1ef0ce951c099919fb08'
      },
      {
        properties: {
          configurationItemStatus: 'ResourceDiscovered',
          resourceId: 'ANPA5XIWUT3PXNZWZKOKL',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"ConfigAccessPolicy","policyId":"ANPA5XIWUT3PXNZWZKOKL","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/ConfigAccessPolicy","path":"/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-04-03T09:07:24.000Z","updateDate":"2019-04-03T09:07:24.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3ACreateBucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3ADeleteBucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutBucketPolicy%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3Aconfig-bucket-trustedservice-do-not-delete-%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AListAllMyBuckets%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3As3%3A%3A%3A%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22config%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3AGetRole%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3APassRole%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3ACreateServiceLinkedRole%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3ADeleteServiceLinkedRole%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3AGetServiceLinkedRoleDeletionStatus%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22arn%3Aaws%3Aiam%3A%3A%2A%3Arole%2Faws-service-role%2Fconfig.amazonaws.com%2F%2A%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":true,"createDate":"2019-04-03T09:07:24.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'ConfigAccessPolicy',
          title: 'ConfigAccessPolicy',
          configurationItemCaptureTime: '2019-05-13T12:43:50.962Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/ConfigAccessPolicy',
          resourceCreationTime: '2019-04-03T09:07:24.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: '9d3e6535f7278eda50bdf9c85edc2115'
      },
      {
        properties: {
          configurationItemStatus: 'OK',
          resourceId: 'ANPA5XIWUT3PZWY35FBHP',
          awsRegion: 'global',
          supplementaryConfiguration: '{}',
          configuration: '{"policyName":"CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1","policyId":"ANPA5XIWUT3PZWY35FBHP","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1","path":"/service-role/","defaultVersionId":"v1","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-05-15T20:43:53.000Z","updateDate":"2019-05-15T20:43:53.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3Azoom-discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3Azoom-discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":true,"createDate":"2019-05-15T20:43:53.000Z"}]}',
          configurationItemMD5Hash: '',
          description: 'null',
          resourceName: 'CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1',
          title: 'CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1',
          configurationItemCaptureTime: '2019-05-16T12:43:52.046Z',
          availabilityZone: 'Not Applicable',
          version: '1.3',
          tags: '{}',
          loggedInURL: 'https://.console.aws.amazon.com/iam/v2/home?region=#/policy',
          path: '/service-role/',
          configurationStateId: '1563713036959',
          accountId: 'XXXXXXXXXXXX',
          loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy',
          relatedEvents: '[]',
          arn: 'arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1',
          resourceCreationTime: '2019-05-15T20:43:53.000Z',
          resourceType: 'AWS::IAM::Policy'
        },
        label: 'AWS::IAM::Policy',
        id: 'c4dfdd2f60eb8b6378dd1586cd69439b'
      }
    ]
  }

  return results;
};

const writeOutput = (p1, p2) => {
  console.log("Mock writeOutput");
};

const storeData = (type, data, level) => {
  console.log("Stored data");
};


module.exports = {
  search: search,
  advancedSearch: advancedSearch,
  queryGremlin: queryGremlin,
  writeOutput: writeOutput,
  storeData: storeData
}