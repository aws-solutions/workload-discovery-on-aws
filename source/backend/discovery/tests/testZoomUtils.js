const chai = require('chai');
const zoomUtils = require('../src/discovery/zoomUtils');
const zoomTestUtils = require('./zoomTestUtils');
const _ = require('lodash');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('should run three functions such that the children of function1 are the results of running function2 etc.', async () => {

    const fun1 = (accountId, awsRegion) => {

        let data = {
            resourceId: "fun1",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId: accountId,
                awsRegion: awsRegion,
                restApiId: "1234"
            }
        }

        return [data];
    };

    const fun2 = (accountId, awsRegion, restApiId) => {

        let data = {
            resourceId: "fun2",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId, accountId,
                awsRegion: awsRegion,
                restApiId: restApiId,
                resourceId: "resourceId12345"
            }
        }

        return [data];
    };

    const fun3 = (accountId, awsRegion, restApiId, resourceId) => {

        let data = {
            resourceId: "fun3",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId, accountId,
                awsRegion: awsRegion,
                restApiId: restApiId,
                resourceId: resourceId
            }
        }

        return [data];
    };

    const runExpand = async () => {
        let accountId = 1;
        let region = "aws-west-1";

        let binding = this;

        return await zoomUtils.expand(binding, fun1(accountId, region), fun2, fun3);
    };

    const correctAnswer = [{
        resourceId: 'fun1',
        resourceType: 'AWS::ApiGateway::RestApi',
        accountId: 1,
        properties: { accountId: 1, awsRegion: 'aws-west-1', restApiId: '1234' },
        children:
            [{
                resourceId: 'fun2',
                resourceType: 'AWS::ApiGateway::RestApi',
                accountId: 1,
                properties:
                {
                    accountId: 1,
                    awsRegion: 'aws-west-1',
                    restApiId: '1234',
                    resourceId: 'resourceId12345'
                },
                children:
                    [{
                        resourceId: 'fun3',
                        resourceType: 'AWS::ApiGateway::RestApi',
                        accountId: 1,
                        properties:
                        {
                            accountId: 1,
                            awsRegion: 'aws-west-1',
                            restApiId: '1234',
                            resourceId: 'resourceId12345'
                        }
                    }]
            }]
    }];

    const answer = await runExpand();

    expect(answer).to.deep.equal(correctAnswer);
});

it('should run three functions such that the children of function1 are the results of running function2 etc.  Function 1 returns many things, everything from function 1 should be expanded.', async () => {

    const fun1 = (accountId, awsRegion) => {
        let data = {
            resourceId: "fun1",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId: accountId,
                awsRegion: awsRegion,
                restApiId: "1234"
            }
        }

        let data2 = {
            resourceId: "fun1-2",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId: accountId,
                awsRegion: awsRegion,
                restApiId: "12345"
            }
        }

        return [data, data2];
    };

    const fun2 = (accountId, awsRegion, restApiId) => {

        let data = {
            resourceId: "fun2",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId, accountId,
                awsRegion: awsRegion,
                restApiId: restApiId,
                resourceId: "resourceId12345"
            }
        }

        return [data];
    };

    const fun3 = (accountId, awsRegion, restApiId, resourceId) => {

        let data = {
            resourceId: "fun3",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId, accountId,
                awsRegion: awsRegion,
                restApiId: restApiId,
                resourceId: resourceId
            }
        }

        return [data];
    };

    const runExpand = async () => {
        let accountId = 1;
        let region = "aws-west-1";

        let binding = this;

        return await zoomUtils.expand(binding, fun1(accountId, region), fun2, fun3);
    };

    const correctAnswer = [{
        resourceId: 'fun1',
        resourceType: 'AWS::ApiGateway::RestApi',
        accountId: 1,
        properties: { accountId: 1, awsRegion: 'aws-west-1', restApiId: '1234' },
        children:
            [
                {
                    resourceId: 'fun2',
                    resourceType: 'AWS::ApiGateway::RestApi',
                    accountId: 1,
                    properties:
                    {
                        accountId: 1,
                        awsRegion: 'aws-west-1',
                        restApiId: '1234',
                        resourceId: 'resourceId12345'
                    },
                    children:
                        [{
                            resourceId: 'fun3',
                            resourceType: 'AWS::ApiGateway::RestApi',
                            accountId: 1,
                            properties:
                            {
                                accountId: 1,
                                awsRegion: 'aws-west-1',
                                restApiId: '1234',
                                resourceId: 'resourceId12345'
                            }
                        }]
                }
            ]
    },
    {
        resourceId: 'fun1-2',
        resourceType: 'AWS::ApiGateway::RestApi',
        accountId: 1,
        properties: { accountId: 1, awsRegion: 'aws-west-1', restApiId: '12345' },
        children:
            [
                {
                    resourceId: 'fun2',
                    resourceType: 'AWS::ApiGateway::RestApi',
                    accountId: 1,
                    properties:
                    {
                        accountId: 1,
                        awsRegion: 'aws-west-1',
                        restApiId: '12345',
                        resourceId: 'resourceId12345'
                    },
                    children:
                        [{
                            resourceId: 'fun3',
                            resourceType: 'AWS::ApiGateway::RestApi',
                            accountId: 1,
                            properties:
                            {
                                accountId: 1,
                                awsRegion: 'aws-west-1',
                                restApiId: '12345',
                                resourceId: 'resourceId12345'
                            }
                        }]
                }
            ]
    }
    ];

    const answer = await runExpand();

    expect(answer).to.deep.equal(correctAnswer);
});

it('should run functions such that the children of function1 include the output of function2, which are not expanded, and the output of function3 which are expanded to function 4', async () => {

    const fun1 = (accountId, awsRegion) => {

        let data = {
            resourceId: "fun1",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId: accountId,
                awsRegion: awsRegion,
                restApiId: "1234"
            }
        }

        return [data];
    }

    const fun2 = (accountId, awsRegion, restApiId) => {

        let data = {
            resourceId: "fun2",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId, accountId,
                awsRegion: awsRegion,
                restApiId: restApiId,
                resourceId: "resourceId12345"
            }
        }

        return [data];
    }

    const fun3 = (accountId, awsRegion, restApiId, resourceId) => {

        let data = {
            resourceId: "fun3",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId, accountId,
                awsRegion: awsRegion,
                restApiId: restApiId
            }
        }

        return [data];
    }

    const fun4 = (accountId, awsRegion, restApiId, resourceId) => {

        let data = {
            resourceId: "fun4",
            resourceType: "AWS::ApiGateway::RestApi",
            accountId: accountId,

            properties: {
                accountId, accountId,
                awsRegion: awsRegion,
                restApiId: restApiId,
                resourceId: resourceId
            }
        }

        return [data];
    }

    const runExpand = async () => {
        let accountId = 1;
        let region = "aws-west-1";

        let binding = this;

        return await zoomUtils.expand(binding, fun1(accountId, region), [fun2, fun3], fun4);
    }

    const answer = await runExpand();

    const correctAnswer = [{
        resourceId: 'fun1',
        resourceType: 'AWS::ApiGateway::RestApi',
        accountId: 1,
        properties: { accountId: 1, awsRegion: 'aws-west-1', restApiId: '1234' },
        children:
            [
                {
                    resourceId: 'fun2',
                    resourceType: 'AWS::ApiGateway::RestApi',
                    accountId: 1,
                    properties:
                    {
                        accountId: 1,
                        awsRegion: 'aws-west-1',
                        restApiId: '1234',
                        resourceId: 'resourceId12345'
                    },
                    children:
                        [{
                            resourceId: 'fun4',
                            resourceType: 'AWS::ApiGateway::RestApi',
                            accountId: 1,
                            properties:
                            {
                                accountId: 1,
                                awsRegion: 'aws-west-1',
                                restApiId: '1234',
                                resourceId: 'resourceId12345'
                            }
                        }]
                },
                {
                    resourceId: 'fun3',
                    resourceType: 'AWS::ApiGateway::RestApi',
                    accountId: 1,
                    properties:
                    {
                        accountId: 1,
                        awsRegion: 'aws-west-1',
                        restApiId: '1234',
                    }
                }
            ]
    }];

    expect(answer).to.deep.equal(correctAnswer);
});


it('should find an array containing exact matches within a object for an rds endpoint', async () => {

    let input = {
        "hits": {
            "total": 5,
            "max_score": 16.78381,
            "hits": [
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "7467b4bf7623cfa5de6b6d16e1e611ff",
                    "_score": 16.78381,
                    "_source": {
                        "id": "7467b4bf7623cfa5de6b6d16e1e611ff",
                        "label": "AWS_CloudFormation_Stack",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-08-13T08:39:55.779Z",
                            "configurationItemStatus": "ResourceDiscovered",
                            "configurationStateId": "1566447759487",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c",
                            "resourceType": "AWS::CloudFormation::Stack",
                            "resourceId": "arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c",
                            "resourceName": "zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ",
                            "awsRegion": "eu-west-1",
                            "availabilityZone": "Regional",
                            "resourceCreationTime": "2019-08-13T08:39:10.663Z",
                            "tags": {
                                "Environment": "dev",
                                "ServiceNameTag": "zoom"
                            },
                            "relatedEvents": [],
                            "configuration": "{\"stackId\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c\",\"stackName\":\"zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ\",\"parameters\":[{\"parameterKey\":\"PrivateSubnet0\",\"parameterValue\":\"subnet-0306ddd2f189b4662\"},{\"parameterKey\":\"PrivateSubnet1\",\"parameterValue\":\"subnet-0249d376da149810e\"},{\"parameterKey\":\"ZoomDiscoveryBucket\",\"parameterValue\":\"zoom-discovery-bucket-aws-2\"},{\"parameterKey\":\"NeptuneSG\",\"parameterValue\":\"sg-0ae8a66e0af8fb1ce\"},{\"parameterKey\":\"ElasticSearchEndpoint\",\"parameterValue\":\"vpc-dev-zoom-gy2425illujffdxcabzrplirte.eu-west-1.es.amazonaws.com\"},{\"parameterKey\":\"NeptuneClusterURL\",\"parameterValue\":\"zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com\"},{\"parameterKey\":\"NeptuneClusterPort\",\"parameterValue\":\"8182\"},{\"parameterKey\":\"CodeBucket\",\"parameterValue\":\"zoom-api-bucket\"}],\"creationTime\":\"Aug 13, 2019 8:39:10 AM\",\"stackStatus\":\"CREATE_COMPLETE\",\"disableRollback\":true,\"notificationARNs\":[],\"timeoutInMinutes\":60,\"capabilities\":[\"CAPABILITY_NAMED_IAM\"],\"outputs\":[{\"outputKey\":\"GremlinARN\",\"outputValue\":\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin\",\"description\":\"Gremlin function details\"},{\"outputKey\":\"ZoomDiscoveryBucketARN\",\"outputValue\":\"arn:aws:s3:::zoom-discovery-bucket-aws-2\"},{\"outputKey\":\"ElasticARN\",\"outputValue\":\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:elastic\",\"description\":\"Elastic function details\"}],\"tags\":[{\"key\":\"ServiceNameTag\",\"value\":\"zoom\"},{\"key\":\"Environment\",\"value\":\"dev\"}],\"driftInformation\":{\"stackDriftStatus\":\"NOT_CHECKED\"}}",
                            "supplementaryConfiguration": {
                                "StackResourceSummaries": "[{\"logicalResourceId\":\"Elastic\",\"physicalResourceId\":\"elastic\",\"resourceType\":\"AWS::Lambda::Function\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:39:52 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"Gremlin\",\"physicalResourceId\":\"gremlin\",\"resourceType\":\"AWS::Lambda::Function\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:39:53 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"ZoomAPILambdaRole\",\"physicalResourceId\":\"ZoomAPILambdaRole\",\"resourceType\":\"AWS::IAM::Role\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:39:49 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"ZoomDiscoveryBucketCr\",\"physicalResourceId\":\"zoom-discovery-bucket-aws-2\",\"resourceType\":\"AWS::S3::Bucket\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:39:35 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"ZoomSearchLambdaRole\",\"physicalResourceId\":\"ZoomSearchLambdaRole\",\"resourceType\":\"AWS::IAM::Role\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:39:33 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}}]"
                            },
                            "title": "zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "cloudformation",
                                "region": "eu-west-1",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "stack",
                                "resource": "zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ",
                                "qualifier": "d23edf20-bda5-11e9-bbf6-0a3aaca2533c"
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "ad307166675ffd9c138a337d153cac3c",
                    "_score": 11.560171,
                    "_source": {
                        "id": "ad307166675ffd9c138a337d153cac3c",
                        "label": "AWS_CloudFormation_Stack",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-08-13T08:37:45.883Z",
                            "configurationItemStatus": "ResourceDiscovered",
                            "configurationStateId": "1566447759562",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV/54cdf220-bda4-11e9-a446-02761942ff2c",
                            "resourceType": "AWS::CloudFormation::Stack",
                            "resourceId": "arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV/54cdf220-bda4-11e9-a446-02761942ff2c",
                            "resourceName": "zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV",
                            "awsRegion": "eu-west-1",
                            "availabilityZone": "Regional",
                            "resourceCreationTime": "2019-08-13T08:28:30.745Z",
                            "tags": {
                                "Environment": "dev",
                                "ServiceNameTag": "zoom"
                            },
                            "relatedEvents": [],
                            "configuration": "{\"stackId\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV/54cdf220-bda4-11e9-a446-02761942ff2c\",\"stackName\":\"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV\",\"description\":\"AWS CloudFormation template to automatically provision AWS Neptune Graph Database through optimized CI/CD method with AWS CloudWatch and AWS SNS.\",\"parameters\":[{\"parameterKey\":\"StorageEncrypted\",\"parameterValue\":\"false\"},{\"parameterKey\":\"Owner\",\"parameterValue\":\"\"},{\"parameterKey\":\"User\",\"parameterValue\":\"test\"},{\"parameterKey\":\"MajorVersionUpgrade\",\"parameterValue\":\"true\"},{\"parameterKey\":\"Compliance\",\"parameterValue\":\"pci\"},{\"parameterKey\":\"NeptuneDBSubnetGroupName\",\"parameterValue\":\"zoom-dev-sng\"},{\"parameterKey\":\"SparqlRequestsPerSecThreshold\",\"parameterValue\":\"10000\"},{\"parameterKey\":\"Port\",\"parameterValue\":\"8182\"},{\"parameterKey\":\"DBClusterIdentifier\",\"parameterValue\":\"zoom-dev-cluster\"},{\"parameterKey\":\"MinorVersionUpgrade\",\"parameterValue\":\"true\"},{\"parameterKey\":\"VPCStack\",\"parameterValue\":\"vpc\"},{\"parameterKey\":\"Env\",\"parameterValue\":\"dev\"},{\"parameterKey\":\"AppName\",\"parameterValue\":\"appname\"},{\"parameterKey\":\"PrivateSubnet0\",\"parameterValue\":\"subnet-0306ddd2f189b4662\"},{\"parameterKey\":\"PrivateSubnet1\",\"parameterValue\":\"subnet-0249d376da149810e\"},{\"parameterKey\":\"NeptuneDBClusterPreferredMaintenanceWindow\",\"parameterValue\":\"mon:03:00-mon:04:00\"},{\"parameterKey\":\"Version\",\"parameterValue\":\"\"},{\"parameterKey\":\"IAMAuthEnabled\",\"parameterValue\":\"false\"},{\"parameterKey\":\"HighCpuAlarmThreshold\",\"parameterValue\":\"80\"},{\"parameterKey\":\"NeptuneDBInstancePreferredMaintenanceWindow\",\"parameterValue\":\"mon:03:00-mon:04:00\"},{\"parameterKey\":\"NeptuneQueryTimeout\",\"parameterValue\":\"120000\"},{\"parameterKey\":\"GremlinRequestsPerSecThreshold\",\"parameterValue\":\"10000\"},{\"parameterKey\":\"NeptuneSNSTopicArn\",\"parameterValue\":\"\"},{\"parameterKey\":\"VPCId\",\"parameterValue\":\"vpc-0e10109041c39ad16\"},{\"parameterKey\":\"NeptuneDBClusterPreferredBackupWindow\",\"parameterValue\":\"02:00-03:00\"},{\"parameterKey\":\"DBInstanceClass\",\"parameterValue\":\"db.r4.large\"},{\"parameterKey\":\"Tier\",\"parameterValue\":\"\"},{\"parameterKey\":\"NeptuneEnableAuditLog\",\"parameterValue\":\"0\"},{\"parameterKey\":\"Storage\",\"parameterValue\":\"ebs\"},{\"parameterKey\":\"LowMemoryAlarmThreshold\",\"parameterValue\":\"700000000\"},{\"parameterKey\":\"SNSEmailSubscription\",\"parameterValue\":\"someone@somewhere.co\"},{\"parameterKey\":\"BackupRetentionPeriod\",\"parameterValue\":\"31\"},{\"parameterKey\":\"UploadAuditLogs\",\"parameterValue\":\"true\"}],\"creationTime\":\"Aug 13, 2019 8:28:30 AM\",\"stackStatus\":\"CREATE_COMPLETE\",\"disableRollback\":true,\"notificationARNs\":[],\"timeoutInMinutes\":60,\"capabilities\":[\"CAPABILITY_NAMED_IAM\"],\"outputs\":[{\"outputKey\":\"NeptuneReadEndpointAddress\",\"outputValue\":\"zoom-dev-cluster.cluster-ro-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com\",\"description\":\"Neptune DB read-only endpoint address\"},{\"outputKey\":\"NeptuneDBSubnetGroupName\",\"outputValue\":\"zoom-dev-sng\",\"description\":\"Neptune Subnet Group\"},{\"outputKey\":\"SNSEmailSubscription\",\"outputValue\":\"someone@somewhere.co\",\"description\":\"Neptune notifiees Output\"},{\"outputKey\":\"NeptuneSnsTopic\",\"outputValue\":\"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH\",\"description\":\"Neptune SNS Topic for alarms\"},{\"outputKey\":\"DBClusterIdentifier\",\"outputValue\":\"zoom-dev-cluster\",\"description\":\"Neptune Cluster Endpoint\"},{\"outputKey\":\"NeptuneEndpointPort\",\"outputValue\":\"8182\",\"description\":\"Endpoint port\"},{\"outputKey\":\"NeptuneDBSG\",\"outputValue\":\"sg-0ae8a66e0af8fb1ce\",\"description\":\"Neptune Security Group\"},{\"outputKey\":\"NeptuneEndpointAddress\",\"outputValue\":\"zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com\",\"description\":\"Neptune DB endpoint address\"}],\"tags\":[{\"key\":\"ServiceNameTag\",\"value\":\"zoom\"},{\"key\":\"Environment\",\"value\":\"dev\"}],\"driftInformation\":{\"stackDriftStatus\":\"NOT_CHECKED\"}}",
                            "supplementaryConfiguration": {
                                "StackResourceSummaries": "[{\"logicalResourceId\":\"NeptuneAlarmSubscription\",\"physicalResourceId\":\"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH:0fd85148-7529-451c-bc6b-8cf682b2bbff\",\"resourceType\":\"AWS::SNS::Subscription\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:51 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneAlarmTopic\",\"physicalResourceId\":\"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH\",\"resourceType\":\"AWS::SNS::Topic\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:47 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneCloudWatchPolicy\",\"physicalResourceId\":\"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-cw-policy-eu-west-1\",\"resourceType\":\"AWS::IAM::ManagedPolicy\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:45 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneDBCluster\",\"physicalResourceId\":\"zoom-dev-cluster\",\"resourceType\":\"AWS::Neptune::DBCluster\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:29:38 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneDBClusterParameterGroup\",\"physicalResourceId\":\"dev-appname-neptune-cluster-parameter-group\",\"resourceType\":\"AWS::Neptune::DBClusterParameterGroup\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:39 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneDBInstance\",\"physicalResourceId\":\"neptunedbinstance-f7zodzvz6x77\",\"resourceType\":\"AWS::Neptune::DBInstance\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:37:40 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneDBParameterGroup\",\"physicalResourceId\":\"dev-appname-parameter-group\",\"resourceType\":\"AWS::Neptune::DBParameterGroup\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:40 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneDBSG\",\"physicalResourceId\":\"sg-0ae8a66e0af8fb1ce\",\"resourceType\":\"AWS::EC2::SecurityGroup\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:42 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneDBSubnetGroup\",\"physicalResourceId\":\"zoom-dev-sng\",\"resourceType\":\"AWS::Neptune::DBSubnetGroup\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:39 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneDbsgIngressRule\",\"physicalResourceId\":\"NeptuneDbsgIngressRule\",\"resourceType\":\"AWS::EC2::SecurityGroupIngress\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:46 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptunePrimaryCpuAlarm\",\"physicalResourceId\":\"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptunePrimaryCpuAlarm-O6NZ01LKOGNP\",\"resourceType\":\"AWS::CloudWatch::Alarm\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:29:42 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptunePrimaryGremlinRequestsPerSecAlarm\",\"physicalResourceId\":\"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptunePrimaryGremlinRequestsPerSecAlarm-1JGNBNAUPE9OK\",\"resourceType\":\"AWS::CloudWatch::Alarm\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:51 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptunePrimaryMemoryAlarm\",\"physicalResourceId\":\"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptunePrimaryMemoryAlarm-1B0OV36SPKU5G\",\"resourceType\":\"AWS::CloudWatch::Alarm\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:29:42 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptunePrimarySparqlRequestsPerSecAlarm\",\"physicalResourceId\":\"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptunePrimarySparqlRequestsPerSecAlarm-AFMPXLN74HW7\",\"resourceType\":\"AWS::CloudWatch::Alarm\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:29:42 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneRole\",\"physicalResourceId\":\"dev-appname-neptune-iam-role-eu-west-1\",\"resourceType\":\"AWS::IAM::Role\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:29:09 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}},{\"logicalResourceId\":\"NeptuneS3Policy\",\"physicalResourceId\":\"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-s3-policy-eu-west-1\",\"resourceType\":\"AWS::IAM::ManagedPolicy\",\"lastUpdatedTimestamp\":\"Aug 13, 2019 8:28:46 AM\",\"resourceStatus\":\"CREATE_COMPLETE\",\"driftInformation\":{\"stackResourceDriftStatus\":\"NOT_CHECKED\"}}]",
                                "unsupportedResources": "[{\"resourceId\":\"NeptuneDbsgIngressRule\",\"resourceType\":\"AWS::EC2::SecurityGroupIngress\"},{\"resourceId\":\"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-cw-policy-eu-west-1\",\"resourceType\":\"AWS::IAM::ManagedPolicy\"},{\"resourceId\":\"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-s3-policy-eu-west-1\",\"resourceType\":\"AWS::IAM::ManagedPolicy\"},{\"resourceId\":\"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH:0fd85148-7529-451c-bc6b-8cf682b2bbff\",\"resourceType\":\"AWS::SNS::Subscription\"},{\"resourceId\":\"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH\",\"resourceType\":\"AWS::SNS::Topic\"},{\"resourceId\":\"dev-appname-neptune-cluster-parameter-group\",\"resourceType\":\"AWS::Neptune::DBClusterParameterGroup\"},{\"resourceId\":\"dev-appname-parameter-group\",\"resourceType\":\"AWS::Neptune::DBParameterGroup\"},{\"resourceId\":\"neptunedbinstance-f7zodzvz6x77\",\"resourceType\":\"AWS::Neptune::DBInstance\"},{\"resourceId\":\"zoom-dev-cluster\",\"resourceType\":\"AWS::Neptune::DBCluster\"},{\"resourceId\":\"zoom-dev-sng\",\"resourceType\":\"AWS::Neptune::DBSubnetGroup\"}]"
                            },
                            "description": "AWS CloudFormation template to automatically provision AWS Neptune Graph Database through optimized CI/CD method with AWS CloudWatch and AWS SNS.",
                            "title": "zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "cloudformation",
                                "region": "eu-west-1",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "stack",
                                "resource": "zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV",
                                "qualifier": "54cdf220-bda4-11e9-a446-02761942ff2c"
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "a58924ff192f398b5b96346aa783df3f",
                    "_score": 11.449574,
                    "_source": {
                        "id": "a58924ff192f398b5b96346aa783df3f",
                        "label": "AWS_Lambda_EnvironmentVariable",
                        "properties": {
                            "resourceId": "neptuneConnectURL_wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin_XXXXXXXXXXXX_eu-west-1",
                            "resourceType": "AWS::Lambda::EnvironmentVariable",
                            "accountId": "XXXXXXXXXXXX",
                            "linkedLambda": "gremlin-dev",
                            "value": "wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin",
                            "awsRegion": "eu-west-1",
                            "title": "neptuneConnectURL:wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin"
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "b12ea5158476defad018bd6e733c9c23",
                    "_score": 11.355625,
                    "_source": {
                        "id": "b12ea5158476defad018bd6e733c9c23",
                        "label": "AWS_Lambda_EnvironmentVariable",
                        "properties": {
                            "resourceId": "neptuneConnectURL_wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin_XXXXXXXXXXXX_eu-west-1",
                            "resourceType": "AWS::Lambda::EnvironmentVariable",
                            "accountId": "XXXXXXXXXXXX",
                            "linkedLambda": "gremlin",
                            "value": "wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin",
                            "awsRegion": "eu-west-1",
                            "title": "neptuneConnectURL:wss://zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com:8182/gremlin"
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "32dd5bf7e72cf1734a318b8b0cba66e2",
                    "_score": 2.0137746,
                    "_source": {
                        "id": "32dd5bf7e72cf1734a318b8b0cba66e2",
                        "label": "AWS_RDS_DBCluster",
                        "properties": {
                            "resourceId": "zoom-dev-cluster_eu-west-1_XXXXXXXXXXXX",
                            "dbClusterIdentifier": "zoom-dev-cluster",
                            "resourceType": "AWS::RDS::DBCluster",
                            "accountId": "XXXXXXXXXXXX",
                            "availabilityZones": "eu-west-1a,eu-west-1b,eu-west-1c",
                            "dBSubnetGroup": "zoom-dev-sng",
                            "earliestRestorableTime": "2019-08-13T08:29:24.311Z",
                            "endpoint": "zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com",
                            "readerEndpoint": "zoom-dev-cluster.cluster-ro-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com",
                            "multiAZ": false,
                            "engine": "neptune",
                            "engineVersion": "1.0.1.0",
                            "latestRestorableTime": "2019-08-22T13:55:56.708Z",
                            "port": 8182,
                            "preferredBackupWindow": "02:00-03:00",
                            "dbClusterMembers": "[{\"DBInstanceIdentifier\":\"neptunedbinstance-f7zodzvz6x77\",\"IsClusterWriter\":true,\"DBClusterParameterGroupStatus\":\"in-sync\",\"PromotionTier\":1}]",
                            "vpcSecurityGroups": "[{\"VpcSecurityGroupId\":\"sg-0ae8a66e0af8fb1ce\",\"Status\":\"active\"}]",
                            "hostedZoneId": "ZINKV47VFXLOC",
                            "storageEncrypted": false,
                            "arn": "arn:aws:rds:eu-west-1:XXXXXXXXXXXX:cluster:zoom-dev-cluster",
                            "associatedRoles": "[]",
                            "clusterCreateTime": "2019-08-13T08:28:48.149Z",
                            "engineMode": "provisioned",
                            "deletionProtection": false,
                            "httpEndpointEnabled": false,
                            "awsRegion": "eu-west-1",
                            "temporary": {
                                "dbClusterMembers": [
                                    {
                                        "DBInstanceIdentifier": "neptunedbinstance-f7zodzvz6x77",
                                        "IsClusterWriter": true,
                                        "DBClusterParameterGroupStatus": "in-sync",
                                        "PromotionTier": 1
                                    }
                                ],
                                "vpcSecurityGroups": [
                                    {
                                        "VpcSecurityGroupId": "sg-0ae8a66e0af8fb1ce",
                                        "Status": "active"
                                    }
                                ]
                            },
                            "dbClusterMembers_DBInstanceIdentifier_1": "neptunedbinstance-f7zodzvz6x77",
                            "dbClusterMembers_IsClusterWriter_2": true,
                            "dbClusterMembers_DBClusterParameterGroupStatus_3": "in-sync",
                            "dbClusterMembers_PromotionTier_4": 1,
                            "vpcSecurityGroups_VpcSecurityGroupId_1": "sg-0ae8a66e0af8fb1ce",
                            "vpcSecurityGroups_Status_2": "active",
                            "title": "zoom-dev-cluster",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "rds",
                                "region": "eu-west-1",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "cluster",
                                "resource": "zoom-dev-cluster",
                                "qualifier": ""
                            }
                        }
                    }
                }
            ]
        }
    }

    let results = zoomUtils.exactMatch(input, "zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com");

    let expected = { hits:
        { total: 5,
          max_score: 16.78381,
          hits:
           [ { _index: 'data',
               _type: '_doc',
               _id: '7467b4bf7623cfa5de6b6d16e1e611ff',
               _score: 16.78381,
               _source:
                { id: '7467b4bf7623cfa5de6b6d16e1e611ff',
                  label: 'AWS_CloudFormation_Stack',
                  properties:
                   { version: '1.3',
                     accountId: 'XXXXXXXXXXXX',
                     configurationItemCaptureTime: '2019-08-13T08:39:55.779Z',
                     configurationItemStatus: 'ResourceDiscovered',
                     configurationStateId: '1566447759487',
                     configurationItemMD5Hash: '',
                     arn:
                      'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c',
                     resourceType: 'AWS::CloudFormation::Stack',
                     resourceId:
                      'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c',
                     resourceName: 'zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ',
                     awsRegion: 'eu-west-1',
                     availabilityZone: 'Regional',
                     resourceCreationTime: '2019-08-13T08:39:10.663Z',
                     tags: { Environment: 'dev', ServiceNameTag: 'zoom' },
                     relatedEvents: [],
                     configuration:
                      '{"stackId":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c","stackName":"zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ","parameters":[{"parameterKey":"PrivateSubnet0","parameterValue":"subnet-0306ddd2f189b4662"},{"parameterKey":"PrivateSubnet1","parameterValue":"subnet-0249d376da149810e"},{"parameterKey":"ZoomDiscoveryBucket","parameterValue":"zoom-discovery-bucket-aws-2"},{"parameterKey":"NeptuneSG","parameterValue":"sg-0ae8a66e0af8fb1ce"},{"parameterKey":"ElasticSearchEndpoint","parameterValue":"vpc-dev-zoom-gy2425illujffdxcabzrplirte.eu-west-1.es.amazonaws.com"},{"parameterKey":"NeptuneClusterURL","parameterValue":"zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com"},{"parameterKey":"NeptuneClusterPort","parameterValue":"8182"},{"parameterKey":"CodeBucket","parameterValue":"zoom-api-bucket"}],"creationTime":"Aug 13, 2019 8:39:10 AM","stackStatus":"CREATE_COMPLETE","disableRollback":true,"notificationARNs":[],"timeoutInMinutes":60,"capabilities":["CAPABILITY_NAMED_IAM"],"outputs":[{"outputKey":"GremlinARN","outputValue":"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin","description":"Gremlin function details"},{"outputKey":"ZoomDiscoveryBucketARN","outputValue":"arn:aws:s3:::zoom-discovery-bucket-aws-2"},{"outputKey":"ElasticARN","outputValue":"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:elastic","description":"Elastic function details"}],"tags":[{"key":"ServiceNameTag","value":"zoom"},{"key":"Environment","value":"dev"}],"driftInformation":{"stackDriftStatus":"NOT_CHECKED"}}',
                     supplementaryConfiguration:
                      { StackResourceSummaries:
                         '[{"logicalResourceId":"Elastic","physicalResourceId":"elastic","resourceType":"AWS::Lambda::Function","lastUpdatedTimestamp":"Aug 13, 2019 8:39:52 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"Gremlin","physicalResourceId":"gremlin","resourceType":"AWS::Lambda::Function","lastUpdatedTimestamp":"Aug 13, 2019 8:39:53 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"ZoomAPILambdaRole","physicalResourceId":"ZoomAPILambdaRole","resourceType":"AWS::IAM::Role","lastUpdatedTimestamp":"Aug 13, 2019 8:39:49 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"ZoomDiscoveryBucketCr","physicalResourceId":"zoom-discovery-bucket-aws-2","resourceType":"AWS::S3::Bucket","lastUpdatedTimestamp":"Aug 13, 2019 8:39:35 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"ZoomSearchLambdaRole","physicalResourceId":"ZoomSearchLambdaRole","resourceType":"AWS::IAM::Role","lastUpdatedTimestamp":"Aug 13, 2019 8:39:33 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}}]' },
                     title: 'zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ',
                     parsedArn:
                      { partition: 'aws',
                        service: 'cloudformation',
                        region: 'eu-west-1',
                        accountId: 'XXXXXXXXXXXX',
                        resourceType: 'stack',
                        resource: 'zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ',
                        qualifier: 'd23edf20-bda5-11e9-bbf6-0a3aaca2533c' } } } },
             { _index: 'data',
               _type: '_doc',
               _id: 'ad307166675ffd9c138a337d153cac3c',
               _score: 11.560171,
               _source:
                { id: 'ad307166675ffd9c138a337d153cac3c',
                  label: 'AWS_CloudFormation_Stack',
                  properties:
                   { version: '1.3',
                     accountId: 'XXXXXXXXXXXX',
                     configurationItemCaptureTime: '2019-08-13T08:37:45.883Z',
                     configurationItemStatus: 'ResourceDiscovered',
                     configurationStateId: '1566447759562',
                     configurationItemMD5Hash: '',
                     arn:
                      'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV/54cdf220-bda4-11e9-a446-02761942ff2c',
                     resourceType: 'AWS::CloudFormation::Stack',
                     resourceId:
                      'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV/54cdf220-bda4-11e9-a446-02761942ff2c',
                     resourceName: 'zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV',
                     awsRegion: 'eu-west-1',
                     availabilityZone: 'Regional',
                     resourceCreationTime: '2019-08-13T08:28:30.745Z',
                     tags: { Environment: 'dev', ServiceNameTag: 'zoom' },
                     relatedEvents: [],
                     configuration:
                      '{"stackId":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV/54cdf220-bda4-11e9-a446-02761942ff2c","stackName":"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV","description":"AWS CloudFormation template to automatically provision AWS Neptune Graph Database through optimized CI/CD method with AWS CloudWatch and AWS SNS.","parameters":[{"parameterKey":"StorageEncrypted","parameterValue":"false"},{"parameterKey":"Owner","parameterValue":""},{"parameterKey":"User","parameterValue":"test"},{"parameterKey":"MajorVersionUpgrade","parameterValue":"true"},{"parameterKey":"Compliance","parameterValue":"pci"},{"parameterKey":"NeptuneDBSubnetGroupName","parameterValue":"zoom-dev-sng"},{"parameterKey":"SparqlRequestsPerSecThreshold","parameterValue":"10000"},{"parameterKey":"Port","parameterValue":"8182"},{"parameterKey":"DBClusterIdentifier","parameterValue":"zoom-dev-cluster"},{"parameterKey":"MinorVersionUpgrade","parameterValue":"true"},{"parameterKey":"VPCStack","parameterValue":"vpc"},{"parameterKey":"Env","parameterValue":"dev"},{"parameterKey":"AppName","parameterValue":"appname"},{"parameterKey":"PrivateSubnet0","parameterValue":"subnet-0306ddd2f189b4662"},{"parameterKey":"PrivateSubnet1","parameterValue":"subnet-0249d376da149810e"},{"parameterKey":"NeptuneDBClusterPreferredMaintenanceWindow","parameterValue":"mon:03:00-mon:04:00"},{"parameterKey":"Version","parameterValue":""},{"parameterKey":"IAMAuthEnabled","parameterValue":"false"},{"parameterKey":"HighCpuAlarmThreshold","parameterValue":"80"},{"parameterKey":"NeptuneDBInstancePreferredMaintenanceWindow","parameterValue":"mon:03:00-mon:04:00"},{"parameterKey":"NeptuneQueryTimeout","parameterValue":"120000"},{"parameterKey":"GremlinRequestsPerSecThreshold","parameterValue":"10000"},{"parameterKey":"NeptuneSNSTopicArn","parameterValue":""},{"parameterKey":"VPCId","parameterValue":"vpc-0e10109041c39ad16"},{"parameterKey":"NeptuneDBClusterPreferredBackupWindow","parameterValue":"02:00-03:00"},{"parameterKey":"DBInstanceClass","parameterValue":"db.r4.large"},{"parameterKey":"Tier","parameterValue":""},{"parameterKey":"NeptuneEnableAuditLog","parameterValue":"0"},{"parameterKey":"Storage","parameterValue":"ebs"},{"parameterKey":"LowMemoryAlarmThreshold","parameterValue":"700000000"},{"parameterKey":"SNSEmailSubscription","parameterValue":"someone@somewhere.co"},{"parameterKey":"BackupRetentionPeriod","parameterValue":"31"},{"parameterKey":"UploadAuditLogs","parameterValue":"true"}],"creationTime":"Aug 13, 2019 8:28:30 AM","stackStatus":"CREATE_COMPLETE","disableRollback":true,"notificationARNs":[],"timeoutInMinutes":60,"capabilities":["CAPABILITY_NAMED_IAM"],"outputs":[{"outputKey":"NeptuneReadEndpointAddress","outputValue":"zoom-dev-cluster.cluster-ro-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com","description":"Neptune DB read-only endpoint address"},{"outputKey":"NeptuneDBSubnetGroupName","outputValue":"zoom-dev-sng","description":"Neptune Subnet Group"},{"outputKey":"SNSEmailSubscription","outputValue":"someone@somewhere.co","description":"Neptune notifiees Output"},{"outputKey":"NeptuneSnsTopic","outputValue":"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH","description":"Neptune SNS Topic for alarms"},{"outputKey":"DBClusterIdentifier","outputValue":"zoom-dev-cluster","description":"Neptune Cluster Endpoint"},{"outputKey":"NeptuneEndpointPort","outputValue":"8182","description":"Endpoint port"},{"outputKey":"NeptuneDBSG","outputValue":"sg-0ae8a66e0af8fb1ce","description":"Neptune Security Group"},{"outputKey":"NeptuneEndpointAddress","outputValue":"zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com","description":"Neptune DB endpoint address"}],"tags":[{"key":"ServiceNameTag","value":"zoom"},{"key":"Environment","value":"dev"}],"driftInformation":{"stackDriftStatus":"NOT_CHECKED"}}',
                     supplementaryConfiguration:
                      { StackResourceSummaries:
                         '[{"logicalResourceId":"NeptuneAlarmSubscription","physicalResourceId":"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH:0fd85148-7529-451c-bc6b-8cf682b2bbff","resourceType":"AWS::SNS::Subscription","lastUpdatedTimestamp":"Aug 13, 2019 8:28:51 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneAlarmTopic","physicalResourceId":"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH","resourceType":"AWS::SNS::Topic","lastUpdatedTimestamp":"Aug 13, 2019 8:28:47 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneCloudWatchPolicy","physicalResourceId":"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-cw-policy-eu-west-1","resourceType":"AWS::IAM::ManagedPolicy","lastUpdatedTimestamp":"Aug 13, 2019 8:28:45 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneDBCluster","physicalResourceId":"zoom-dev-cluster","resourceType":"AWS::Neptune::DBCluster","lastUpdatedTimestamp":"Aug 13, 2019 8:29:38 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneDBClusterParameterGroup","physicalResourceId":"dev-appname-neptune-cluster-parameter-group","resourceType":"AWS::Neptune::DBClusterParameterGroup","lastUpdatedTimestamp":"Aug 13, 2019 8:28:39 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneDBInstance","physicalResourceId":"neptunedbinstance-f7zodzvz6x77","resourceType":"AWS::Neptune::DBInstance","lastUpdatedTimestamp":"Aug 13, 2019 8:37:40 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneDBParameterGroup","physicalResourceId":"dev-appname-parameter-group","resourceType":"AWS::Neptune::DBParameterGroup","lastUpdatedTimestamp":"Aug 13, 2019 8:28:40 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneDBSG","physicalResourceId":"sg-0ae8a66e0af8fb1ce","resourceType":"AWS::EC2::SecurityGroup","lastUpdatedTimestamp":"Aug 13, 2019 8:28:42 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneDBSubnetGroup","physicalResourceId":"zoom-dev-sng","resourceType":"AWS::Neptune::DBSubnetGroup","lastUpdatedTimestamp":"Aug 13, 2019 8:28:39 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneDbsgIngressRule","physicalResourceId":"NeptuneDbsgIngressRule","resourceType":"AWS::EC2::SecurityGroupIngress","lastUpdatedTimestamp":"Aug 13, 2019 8:28:46 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptunePrimaryCpuAlarm","physicalResourceId":"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptunePrimaryCpuAlarm-O6NZ01LKOGNP","resourceType":"AWS::CloudWatch::Alarm","lastUpdatedTimestamp":"Aug 13, 2019 8:29:42 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptunePrimaryGremlinRequestsPerSecAlarm","physicalResourceId":"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptunePrimaryGremlinRequestsPerSecAlarm-1JGNBNAUPE9OK","resourceType":"AWS::CloudWatch::Alarm","lastUpdatedTimestamp":"Aug 13, 2019 8:28:51 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptunePrimaryMemoryAlarm","physicalResourceId":"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptunePrimaryMemoryAlarm-1B0OV36SPKU5G","resourceType":"AWS::CloudWatch::Alarm","lastUpdatedTimestamp":"Aug 13, 2019 8:29:42 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptunePrimarySparqlRequestsPerSecAlarm","physicalResourceId":"zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptunePrimarySparqlRequestsPerSecAlarm-AFMPXLN74HW7","resourceType":"AWS::CloudWatch::Alarm","lastUpdatedTimestamp":"Aug 13, 2019 8:29:42 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneRole","physicalResourceId":"dev-appname-neptune-iam-role-eu-west-1","resourceType":"AWS::IAM::Role","lastUpdatedTimestamp":"Aug 13, 2019 8:29:09 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"NeptuneS3Policy","physicalResourceId":"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-s3-policy-eu-west-1","resourceType":"AWS::IAM::ManagedPolicy","lastUpdatedTimestamp":"Aug 13, 2019 8:28:46 AM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}}]',
                        unsupportedResources:
                         '[{"resourceId":"NeptuneDbsgIngressRule","resourceType":"AWS::EC2::SecurityGroupIngress"},{"resourceId":"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-cw-policy-eu-west-1","resourceType":"AWS::IAM::ManagedPolicy"},{"resourceId":"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-s3-policy-eu-west-1","resourceType":"AWS::IAM::ManagedPolicy"},{"resourceId":"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH:0fd85148-7529-451c-bc6b-8cf682b2bbff","resourceType":"AWS::SNS::Subscription"},{"resourceId":"arn:aws:sns:eu-west-1:XXXXXXXXXXXX:zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV-NeptuneAlarmTopic-CVHDF8R89BYH","resourceType":"AWS::SNS::Topic"},{"resourceId":"dev-appname-neptune-cluster-parameter-group","resourceType":"AWS::Neptune::DBClusterParameterGroup"},{"resourceId":"dev-appname-parameter-group","resourceType":"AWS::Neptune::DBParameterGroup"},{"resourceId":"neptunedbinstance-f7zodzvz6x77","resourceType":"AWS::Neptune::DBInstance"},{"resourceId":"zoom-dev-cluster","resourceType":"AWS::Neptune::DBCluster"},{"resourceId":"zoom-dev-sng","resourceType":"AWS::Neptune::DBSubnetGroup"}]' },
                     description:
                      'AWS CloudFormation template to automatically provision AWS Neptune Graph Database through optimized CI/CD method with AWS CloudWatch and AWS SNS.',
                     title: 'zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV',
                     parsedArn:
                      { partition: 'aws',
                        service: 'cloudformation',
                        region: 'eu-west-1',
                        accountId: 'XXXXXXXXXXXX',
                        resourceType: 'stack',
                        resource: 'zoom-platform-dev-NeptuneStack-5O1RMRWIJ6LV',
                        qualifier: '54cdf220-bda4-11e9-a446-02761942ff2c' } } } },
             { _index: 'data',
               _type: '_doc',
               _id: '32dd5bf7e72cf1734a318b8b0cba66e2',
               _score: 2.0137746,
               _source:
                { id: '32dd5bf7e72cf1734a318b8b0cba66e2',
                  label: 'AWS_RDS_DBCluster',
                  properties:
                   { resourceId: 'zoom-dev-cluster_eu-west-1_XXXXXXXXXXXX',
                     dbClusterIdentifier: 'zoom-dev-cluster',
                     resourceType: 'AWS::RDS::DBCluster',
                     accountId: 'XXXXXXXXXXXX',
                     availabilityZones: 'eu-west-1a,eu-west-1b,eu-west-1c',
                     dBSubnetGroup: 'zoom-dev-sng',
                     earliestRestorableTime: '2019-08-13T08:29:24.311Z',
                     endpoint:
                      'zoom-dev-cluster.cluster-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com',
                     readerEndpoint:
                      'zoom-dev-cluster.cluster-ro-c0cfg2sozclw.eu-west-1.neptune.amazonaws.com',
                     multiAZ: false,
                     engine: 'neptune',
                     engineVersion: '1.0.1.0',
                     latestRestorableTime: '2019-08-22T13:55:56.708Z',
                     port: 8182,
                     preferredBackupWindow: '02:00-03:00',
                     dbClusterMembers:
                      '[{"DBInstanceIdentifier":"neptunedbinstance-f7zodzvz6x77","IsClusterWriter":true,"DBClusterParameterGroupStatus":"in-sync","PromotionTier":1}]',
                     vpcSecurityGroups:
                      '[{"VpcSecurityGroupId":"sg-0ae8a66e0af8fb1ce","Status":"active"}]',
                     hostedZoneId: 'ZINKV47VFXLOC',
                     storageEncrypted: false,
                     arn:
                      'arn:aws:rds:eu-west-1:XXXXXXXXXXXX:cluster:zoom-dev-cluster',
                     associatedRoles: '[]',
                     clusterCreateTime: '2019-08-13T08:28:48.149Z',
                     engineMode: 'provisioned',
                     deletionProtection: false,
                     httpEndpointEnabled: false,
                     awsRegion: 'eu-west-1',
                     temporary:
                      { dbClusterMembers:
                         [ { DBInstanceIdentifier: 'neptunedbinstance-f7zodzvz6x77',
                             IsClusterWriter: true,
                             DBClusterParameterGroupStatus: 'in-sync',
                             PromotionTier: 1 } ],
                        vpcSecurityGroups:
                         [ { VpcSecurityGroupId: 'sg-0ae8a66e0af8fb1ce', Status: 'active' } ] },
                     dbClusterMembers_DBInstanceIdentifier_1: 'neptunedbinstance-f7zodzvz6x77',
                     dbClusterMembers_IsClusterWriter_2: true,
                     dbClusterMembers_DBClusterParameterGroupStatus_3: 'in-sync',
                     dbClusterMembers_PromotionTier_4: 1,
                     vpcSecurityGroups_VpcSecurityGroupId_1: 'sg-0ae8a66e0af8fb1ce',
                     vpcSecurityGroups_Status_2: 'active',
                     title: 'zoom-dev-cluster',
                     parsedArn:
                      { partition: 'aws',
                        service: 'rds',
                        region: 'eu-west-1',
                        accountId: 'XXXXXXXXXXXX',
                        resourceType: 'cluster',
                        resource: 'zoom-dev-cluster',
                        qualifier: '' } } } } ] } }

    expect(results).to.deep.equal(expected);
});

it ('should find an array of exact matches for an elastic search cluster', async () => {

    let input = {
        hits: {
            total: 4,
            max_score: 9.521036,
            hits: [
              {
                _index: 'data',
                _type: '_doc',
                _id: '26bb93a2a868068927ce0f16f97415b5',
                _score: 9.521036,
                _source: {
                  id: '26bb93a2a868068927ce0f16f97415b5',
                  label: 'AWS_Elasticsearch_Domain',
                  properties: {
                    version: '1.3',
                    accountId: 'XXXXXXXXXXXX',
                    configurationItemCaptureTime: '2019-11-28T16:35:18.059Z',
                    configurationItemStatus: 'ResourceDiscovered',
                    configurationStateId: '1574958918059',
                    configurationItemMD5Hash: '',
                    arn: 'arn:aws:es:eu-west-1:XXXXXXXXXXXX:domain/aws-perspective',
                    resourceType: 'AWS::Elasticsearch::Domain',
                    resourceId: 'XXXXXXXXXXXX/aws-perspective',
                    resourceName: 'aws-perspective',
                    awsRegion: 'eu-west-1',
                    availabilityZone: 'Multiple Availability Zones',
                    tags: {
                      App: 'aws-perspective',
                      AppName: 'aws-perspective',
                      Name: 'aws-perspective-ES-Cluster',
                      Version: '6.4'
                    },
                    relatedEvents: [],
                    configuration: '{"domainId":"XXXXXXXXXXXX/aws-perspective","domainName":"aws-perspective","created":true,"deleted":false,"endpoints":{"vpc":"vpc-aws-perspective-7w7csosfv4e55bkzwkxu353qmm.eu-west-1.es.amazonaws.com"},"processing":false,"upgradeProcessing":false,"elasticsearchVersion":"6.4","elasticsearchClusterConfig":{"instanceType":"m4.large.elasticsearch","instanceCount":1,"dedicatedMasterEnabled":false,"zoneAwarenessEnabled":false},"accessPolicies":"{\\"Version\\":\\"2012-10-17\\",\\"Statement\\":[{\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"AWS\\":\\"arn:aws:iam::XXXXXXXXXXXX:role/PerspectiveAPILambdaRole\\"},\\"Action\\":\\"es:*\\",\\"Resource\\":\\"*\\"}]}","snapshotOptions":{"automatedSnapshotStartHour":0},"cognitoOptions":{"enabled":false},"encryptionAtRestOptions":{"enabled":true,"kmsKeyId":"arn:aws:kms:eu-west-1:XXXXXXXXXXXX:key/5609402f-7171-4f70-bd9f-712d23b27688"},"nodeToNodeEncryptionOptions":{"enabled":true},"advancedOptions":{"rest.action.multi.allow_explicit_index":"true"},"serviceSoftwareOptions":{"currentVersion":"R20190927-P3","newVersion":"","updateAvailable":false,"cancellable":false,"updateStatus":"COMPLETED","description":"There is no software update available for this domain.","automatedUpdateDate":1573631774000},"domainEndpointOptions":{"enforceHTTPS":false,"tlssecurityPolicy":"Policy-Min-TLS-1-0-2019-07"},"ebsoptions":{"volumeType":"gp2","volumeSize":10,"ebsenabled":true},"vpcoptions":{"subnetIds":["subnet-0a16a51172002b187"],"availabilityZones":["eu-west-1a"],"securityGroupIds":["sg-0f9b26af83cc65912"],"vpcid":"vpc-0d1489acdc666462d"},"arn":"arn:aws:es:eu-west-1:XXXXXXXXXXXX:domain/aws-perspective"}',
                    supplementaryConfiguration: {
                      Tags: '[{"key":"App","value":"aws-perspective"},{"key":"Version","value":"6.4"},{"key":"AppName","value":"aws-perspective"},{"key":"Name","value":"aws-perspective-ES-Cluster"}]'
                    },
                    title: 'XXXXXXXXXXXX/aws-perspective',
                    parsedArn: {
                      partition: 'aws',
                      service: 'es',
                      region: 'eu-west-1',
                      accountId: 'XXXXXXXXXXXX',
                      resourceType: 'domain',
                      resource: 'aws-perspective',
                      qualifier: ''
                    }
                  }
                }
              },
              {
                _index: 'data',
                _type: '_doc',
                _id: '4b216af93fc330f5065e5d188cb0b7f4',
                _score: 8.0005,
                _source: {
                  id: '4b216af93fc330f5065e5d188cb0b7f4',
                  label: 'AWS_CloudFormation_Stack',
                  properties: {
                    version: '1.3',
                    accountId: 'XXXXXXXXXXXX',
                    configurationItemCaptureTime: '2019-11-28T16:34:16.917Z',
                    configurationItemStatus: 'ResourceDiscovered',
                    configurationStateId: '1574958856917',
                    configurationItemMD5Hash: '',
                    arn: 'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9/5668e580-11fb-11ea-8e93-06d3aeb0d9f6',
                    resourceType: 'AWS::CloudFormation::Stack',
                    resourceId: 'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9/5668e580-11fb-11ea-8e93-06d3aeb0d9f6',
                    resourceName: 'aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9',
                    awsRegion: 'eu-west-1',
                    availabilityZone: 'Regional',
                    resourceCreationTime: '2019-11-28T16:22:57.387Z',
                    tags: { AppName: 'aws-perspective' },
                    relatedEvents: [],
                    configuration: '{"stackId":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9/5668e580-11fb-11ea-8e93-06d3aeb0d9f6","stackName":"aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9","description":"ElasticsearchDomain resource","parameters":[{"parameterKey":"PrivateSubnet0","parameterValue":"subnet-0a16a51172002b187"},{"parameterKey":"KMSKey","parameterValue":"5609402f-7171-4f70-bd9f-712d23b27688"},{"parameterKey":"LambdaIAMRoleARN","parameterValue":"arn:aws:iam::XXXXXXXXXXXX:role/PerspectiveAPILambdaRole"},{"parameterKey":"PerspectiveVPCId","parameterValue":"vpc-0d1489acdc666462d"},{"parameterKey":"AppName","parameterValue":"aws-perspective"}],"creationTime":"Nov 28, 2019 4:22:57 PM","stackStatus":"CREATE_COMPLETE","disableRollback":true,"notificationARNs":[],"timeoutInMinutes":60,"capabilities":["CAPABILITY_IAM","CAPABILITY_NAMED_IAM","CAPABILITY_AUTO_EXPAND"],"outputs":[{"outputKey":"DomainEndpoint","outputValue":"vpc-aws-perspective-7w7csosfv4e55bkzwkxu353qmm.eu-west-1.es.amazonaws.com"},{"outputKey":"SecurityGroupId","outputValue":"sg-0f9b26af83cc65912"},{"outputKey":"DomainArn","outputValue":"arn:aws:es:eu-west-1:XXXXXXXXXXXX:domain/aws-perspective"}],"tags":[{"key":"AppName","value":"aws-perspective"}],"driftInformation":{"stackDriftStatus":"NOT_CHECKED"}}',
                    supplementaryConfiguration: {
                      StackResourceSummaries: '[{"logicalResourceId":"ElasticsearchDomain","physicalResourceId":"aws-perspective","resourceType":"AWS::Elasticsearch::Domain","lastUpdatedTimestamp":"Nov 28, 2019 4:34:14 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"ElasticsearchSG","physicalResourceId":"sg-0f9b26af83cc65912","resourceType":"AWS::EC2::SecurityGroup","lastUpdatedTimestamp":"Nov 28, 2019 4:23:06 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}}]'
                    },
                    description: 'ElasticsearchDomain resource',
                    title: 'aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9',
                    parsedArn: {
                      partition: 'aws',
                      service: 'cloudformation',
                      region: 'eu-west-1',
                      accountId: 'XXXXXXXXXXXX',
                      resourceType: 'stack',
                      resource: 'aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9',
                      qualifier: '5668e580-11fb-11ea-8e93-06d3aeb0d9f6'
                    }
                  }
                }
              }
            ]
        }
    };

    let results = zoomUtils.exactMatch(input, "vpc-aws-perspective-7w7csosfv4e55bkzwkxu353qmm.eu-west-1.es.amazonaws.com");

    let expected = { hits:
        { total: 4,
          max_score: 9.521036,
          hits:
           [ { _index: 'data',
               _type: '_doc',
               _id: '26bb93a2a868068927ce0f16f97415b5',
               _score: 9.521036,
               _source:
                { id: '26bb93a2a868068927ce0f16f97415b5',
                  label: 'AWS_Elasticsearch_Domain',
                  properties:
                   { version: '1.3',
                     accountId: 'XXXXXXXXXXXX',
                     configurationItemCaptureTime: '2019-11-28T16:35:18.059Z',
                     configurationItemStatus: 'ResourceDiscovered',
                     configurationStateId: '1574958918059',
                     configurationItemMD5Hash: '',
                     arn: 'arn:aws:es:eu-west-1:XXXXXXXXXXXX:domain/aws-perspective',
                     resourceType: 'AWS::Elasticsearch::Domain',
                     resourceId: 'XXXXXXXXXXXX/aws-perspective',
                     resourceName: 'aws-perspective',
                     awsRegion: 'eu-west-1',
                     availabilityZone: 'Multiple Availability Zones',
                     tags:
                      { App: 'aws-perspective',
                        AppName: 'aws-perspective',
                        Name: 'aws-perspective-ES-Cluster',
                        Version: '6.4' },
                     relatedEvents: [],
                     configuration:
                      '{"domainId":"XXXXXXXXXXXX/aws-perspective","domainName":"aws-perspective","created":true,"deleted":false,"endpoints":{"vpc":"vpc-aws-perspective-7w7csosfv4e55bkzwkxu353qmm.eu-west-1.es.amazonaws.com"},"processing":false,"upgradeProcessing":false,"elasticsearchVersion":"6.4","elasticsearchClusterConfig":{"instanceType":"m4.large.elasticsearch","instanceCount":1,"dedicatedMasterEnabled":false,"zoneAwarenessEnabled":false},"accessPolicies":"{\\"Version\\":\\"2012-10-17\\",\\"Statement\\":[{\\"Effect\\":\\"Allow\\",\\"Principal\\":{\\"AWS\\":\\"arn:aws:iam::XXXXXXXXXXXX:role/PerspectiveAPILambdaRole\\"},\\"Action\\":\\"es:*\\",\\"Resource\\":\\"*\\"}]}","snapshotOptions":{"automatedSnapshotStartHour":0},"cognitoOptions":{"enabled":false},"encryptionAtRestOptions":{"enabled":true,"kmsKeyId":"arn:aws:kms:eu-west-1:XXXXXXXXXXXX:key/5609402f-7171-4f70-bd9f-712d23b27688"},"nodeToNodeEncryptionOptions":{"enabled":true},"advancedOptions":{"rest.action.multi.allow_explicit_index":"true"},"serviceSoftwareOptions":{"currentVersion":"R20190927-P3","newVersion":"","updateAvailable":false,"cancellable":false,"updateStatus":"COMPLETED","description":"There is no software update available for this domain.","automatedUpdateDate":1573631774000},"domainEndpointOptions":{"enforceHTTPS":false,"tlssecurityPolicy":"Policy-Min-TLS-1-0-2019-07"},"ebsoptions":{"volumeType":"gp2","volumeSize":10,"ebsenabled":true},"vpcoptions":{"subnetIds":["subnet-0a16a51172002b187"],"availabilityZones":["eu-west-1a"],"securityGroupIds":["sg-0f9b26af83cc65912"],"vpcid":"vpc-0d1489acdc666462d"},"arn":"arn:aws:es:eu-west-1:XXXXXXXXXXXX:domain/aws-perspective"}',
                     supplementaryConfiguration:
                      { Tags:
                         '[{"key":"App","value":"aws-perspective"},{"key":"Version","value":"6.4"},{"key":"AppName","value":"aws-perspective"},{"key":"Name","value":"aws-perspective-ES-Cluster"}]' },
                     title: 'XXXXXXXXXXXX/aws-perspective',
                     parsedArn:
                      { partition: 'aws',
                        service: 'es',
                        region: 'eu-west-1',
                        accountId: 'XXXXXXXXXXXX',
                        resourceType: 'domain',
                        resource: 'aws-perspective',
                        qualifier: '' } } } },
             { _index: 'data',
               _type: '_doc',
               _id: '4b216af93fc330f5065e5d188cb0b7f4',
               _score: 8.0005,
               _source:
                { id: '4b216af93fc330f5065e5d188cb0b7f4',
                  label: 'AWS_CloudFormation_Stack',
                  properties:
                   { version: '1.3',
                     accountId: 'XXXXXXXXXXXX',
                     configurationItemCaptureTime: '2019-11-28T16:34:16.917Z',
                     configurationItemStatus: 'ResourceDiscovered',
                     configurationStateId: '1574958856917',
                     configurationItemMD5Hash: '',
                     arn:
                      'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9/5668e580-11fb-11ea-8e93-06d3aeb0d9f6',
                     resourceType: 'AWS::CloudFormation::Stack',
                     resourceId:
                      'arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9/5668e580-11fb-11ea-8e93-06d3aeb0d9f6',
                     resourceName: 'aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9',
                     awsRegion: 'eu-west-1',
                     availabilityZone: 'Regional',
                     resourceCreationTime: '2019-11-28T16:22:57.387Z',
                     tags: { AppName: 'aws-perspective' },
                     relatedEvents: [],
                     configuration:
                      '{"stackId":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9/5668e580-11fb-11ea-8e93-06d3aeb0d9f6","stackName":"aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9","description":"ElasticsearchDomain resource","parameters":[{"parameterKey":"PrivateSubnet0","parameterValue":"subnet-0a16a51172002b187"},{"parameterKey":"KMSKey","parameterValue":"5609402f-7171-4f70-bd9f-712d23b27688"},{"parameterKey":"LambdaIAMRoleARN","parameterValue":"arn:aws:iam::XXXXXXXXXXXX:role/PerspectiveAPILambdaRole"},{"parameterKey":"PerspectiveVPCId","parameterValue":"vpc-0d1489acdc666462d"},{"parameterKey":"AppName","parameterValue":"aws-perspective"}],"creationTime":"Nov 28, 2019 4:22:57 PM","stackStatus":"CREATE_COMPLETE","disableRollback":true,"notificationARNs":[],"timeoutInMinutes":60,"capabilities":["CAPABILITY_IAM","CAPABILITY_NAMED_IAM","CAPABILITY_AUTO_EXPAND"],"outputs":[{"outputKey":"DomainEndpoint","outputValue":"vpc-aws-perspective-7w7csosfv4e55bkzwkxu353qmm.eu-west-1.es.amazonaws.com"},{"outputKey":"SecurityGroupId","outputValue":"sg-0f9b26af83cc65912"},{"outputKey":"DomainArn","outputValue":"arn:aws:es:eu-west-1:XXXXXXXXXXXX:domain/aws-perspective"}],"tags":[{"key":"AppName","value":"aws-perspective"}],"driftInformation":{"stackDriftStatus":"NOT_CHECKED"}}',
                     supplementaryConfiguration:
                      { StackResourceSummaries:
                         '[{"logicalResourceId":"ElasticsearchDomain","physicalResourceId":"aws-perspective","resourceType":"AWS::Elasticsearch::Domain","lastUpdatedTimestamp":"Nov 28, 2019 4:34:14 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}},{"logicalResourceId":"ElasticsearchSG","physicalResourceId":"sg-0f9b26af83cc65912","resourceType":"AWS::EC2::SecurityGroup","lastUpdatedTimestamp":"Nov 28, 2019 4:23:06 PM","resourceStatus":"CREATE_COMPLETE","driftInformation":{"stackResourceDriftStatus":"NOT_CHECKED"}}]' },
                     description: 'ElasticsearchDomain resource',
                     title: 'aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9',
                     parsedArn:
                      { partition: 'aws',
                        service: 'cloudformation',
                        region: 'eu-west-1',
                        accountId: 'XXXXXXXXXXXX',
                        resourceType: 'stack',
                        resource: 'aws-perspective-eu-west-1-ElasticsearchStack-1HEPHRHRQJHA9',
                        qualifier: '5668e580-11fb-11ea-8e93-06d3aeb0d9f6' } } } } ] } };

    expect(results).to.deep.equal(expected);

});

it('should find an array containing exact matches within a object for a region eu-west-1 ', async () => {

    let input = {
        "hits": {
            "total": 311,
            "max_score": 6.5707817,
            "hits": [
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "16350e05db93367b9fa8c5c12a3257e9",
                    "_score": 6.5707817,
                    "_source": {
                        "id": "16350e05db93367b9fa8c5c12a3257e9",
                        "label": "AWS_S3_Bucket",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-04-29T16:36:15.991Z",
                            "configurationItemStatus": "ResourceDiscovered",
                            "configurationStateId": "1566454962646",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:s3:::cf-templates-1mfb6u5ip16se-eu-west-1",
                            "resourceType": "AWS::S3::Bucket",
                            "resourceId": "cf-templates-1mfb6u5ip16se-eu-west-1",
                            "resourceName": "cf-templates-1mfb6u5ip16se-eu-west-1",
                            "awsRegion": "eu-west-1",
                            "availabilityZone": "Regional",
                            "resourceCreationTime": "2019-04-25T15:31:25.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"name\":\"cf-templates-1mfb6u5ip16se-eu-west-1\",\"owner\":{\"displayName\":null,\"id\":\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\"},\"creationDate\":\"2019-04-25T15:31:25.000Z\"}",
                            "supplementaryConfiguration": {
                                "AccessControlList": "\"{\\\"grantSet\\\":null,\\\"grantList\\\":[{\\\"grantee\\\":{\\\"id\\\":\\\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\\\",\\\"displayName\\\":null},\\\"permission\\\":\\\"FullControl\\\"}],\\\"owner\\\":{\\\"displayName\\\":null,\\\"id\\\":\\\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\\\"},\\\"isRequesterCharged\\\":false}\"",
                                "BucketAccelerateConfiguration": "{\"status\":null}",
                                "BucketLoggingConfiguration": "{\"destinationBucketName\":null,\"logFilePrefix\":null}",
                                "BucketNotificationConfiguration": "{\"configurations\":{}}",
                                "BucketPolicy": "{\"policyText\":null}",
                                "BucketVersioningConfiguration": "{\"status\":\"Off\",\"isMfaDeleteEnabled\":null}",
                                "IsRequesterPaysEnabled": "false",
                                "ServerSideEncryptionConfiguration": "{\"rules\":[{\"applyServerSideEncryptionByDefault\":{\"sseAlgorithm\":\"AES256\",\"kmsMasterKeyID\":null}}]}"
                            },
                            "name": "cf-templates-1mfb6u5ip16se-eu-west-1",
                            "loginURL": "https://.signin.aws.amazon.com/console/s3?region=#",
                            "loggedInURL": "https://.console.aws.amazon.com/s3/v2/home?region=#",
                            "title": "cf-templates-1mfb6u5ip16se-eu-west-1",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "s3",
                                "region": "",
                                "accountId": "",
                                "resource": "cf-templates-1mfb6u5ip16se-eu-west-1",
                                "resourceType": "",
                                "qualifier": ""
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "d643ec6e1ed342c6d28177556eddc3b1",
                    "_score": 6.4979305,
                    "_source": {
                        "id": "d643ec6e1ed342c6d28177556eddc3b1",
                        "label": "AWS_IAM_Policy",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-06-24T12:43:49.778Z",
                            "configurationItemStatus": "OK",
                            "configurationStateId": "1566451361164",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1",
                            "resourceType": "AWS::IAM::Policy",
                            "resourceId": "ANPA5XIWUT3P7CLHX2ZMO",
                            "resourceName": "CodeBuildBasePolicy-zoom-api-eu-west-1",
                            "awsRegion": "global",
                            "availabilityZone": "Not Applicable",
                            "resourceCreationTime": "2019-06-24T12:03:58.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"policyName\":\"CodeBuildBasePolicy-zoom-api-eu-west-1\",\"policyId\":\"ANPA5XIWUT3P7CLHX2ZMO\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1\",\"path\":\"/service-role/\",\"defaultVersionId\":\"v5\",\"attachmentCount\":1,\"permissionsBoundaryUsageCount\":0,\"isAttachable\":true,\"description\":null,\"createDate\":\"2019-06-24T12:03:58.000Z\",\"updateDate\":\"2019-06-24T12:26:36.000Z\",\"policyVersionList\":[{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v5\",\"isDefaultVersion\":true,\"createDate\":\"2019-06-24T12:26:36.000Z\"},{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v4\",\"isDefaultVersion\":false,\"createDate\":\"2019-06-24T12:23:26.000Z\"},{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v3\",\"isDefaultVersion\":false,\"createDate\":\"2019-06-24T12:20:18.000Z\"},{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v2\",\"isDefaultVersion\":false,\"createDate\":\"2019-06-24T12:08:22.000Z\"},{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v1\",\"isDefaultVersion\":false,\"createDate\":\"2019-06-24T12:03:58.000Z\"}]}",
                            "supplementaryConfiguration": {},
                            "path": "/service-role/",
                            "description": null,
                            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy",
                            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/policy",
                            "title": "CodeBuildBasePolicy-zoom-api-eu-west-1",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "iam",
                                "region": "",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "policy",
                                "resource": "service-role",
                                "qualifier": "CodeBuildBasePolicy-zoom-api-eu-west-1"
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "386f8e17f3b3fefb3055d5be8a7aeead",
                    "_score": 6.362196,
                    "_source": {
                        "id": "386f8e17f3b3fefb3055d5be8a7aeead",
                        "label": "AWS_S3_Bucket",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-05-17T15:22:56.341Z",
                            "configurationItemStatus": "ResourceDiscovered",
                            "configurationStateId": "1566454962910",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:s3:::codepipeline-eu-west-1-364136788941",
                            "resourceType": "AWS::S3::Bucket",
                            "resourceId": "codepipeline-eu-west-1-364136788941",
                            "resourceName": "codepipeline-eu-west-1-364136788941",
                            "awsRegion": "eu-west-1",
                            "availabilityZone": "Regional",
                            "resourceCreationTime": "2019-05-17T15:20:50.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"name\":\"codepipeline-eu-west-1-364136788941\",\"owner\":{\"displayName\":null,\"id\":\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\"},\"creationDate\":\"2019-05-17T15:20:50.000Z\"}",
                            "supplementaryConfiguration": {
                                "AccessControlList": "\"{\\\"grantSet\\\":null,\\\"grantList\\\":[{\\\"grantee\\\":{\\\"id\\\":\\\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\\\",\\\"displayName\\\":null},\\\"permission\\\":\\\"FullControl\\\"}],\\\"owner\\\":{\\\"displayName\\\":null,\\\"id\\\":\\\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\\\"},\\\"isRequesterCharged\\\":false}\"",
                                "BucketAccelerateConfiguration": "{\"status\":null}",
                                "BucketLoggingConfiguration": "{\"destinationBucketName\":null,\"logFilePrefix\":null}",
                                "BucketNotificationConfiguration": "{\"configurations\":{}}",
                                "BucketPolicy": "{\"policyText\":\"{\\\"Version\\\":\\\"2012-10-17\\\",\\\"Id\\\":\\\"SSEAndSSLPolicy\\\",\\\"Statement\\\":[{\\\"Sid\\\":\\\"DenyUnEncryptedObjectUploads\\\",\\\"Effect\\\":\\\"Deny\\\",\\\"Principal\\\":\\\"*\\\",\\\"Action\\\":\\\"s3:PutObject\\\",\\\"Resource\\\":\\\"arn:aws:s3:::codepipeline-eu-west-1-364136788941/*\\\",\\\"Condition\\\":{\\\"StringNotEquals\\\":{\\\"s3:x-amz-server-side-encryption\\\":\\\"aws:kms\\\"}}},{\\\"Sid\\\":\\\"DenyInsecureConnections\\\",\\\"Effect\\\":\\\"Deny\\\",\\\"Principal\\\":\\\"*\\\",\\\"Action\\\":\\\"s3:*\\\",\\\"Resource\\\":\\\"arn:aws:s3:::codepipeline-eu-west-1-364136788941/*\\\",\\\"Condition\\\":{\\\"Bool\\\":{\\\"aws:SecureTransport\\\":\\\"false\\\"}}}]}\"}",
                                "BucketVersioningConfiguration": "{\"status\":\"Off\",\"isMfaDeleteEnabled\":null}",
                                "IsRequesterPaysEnabled": "false"
                            },
                            "name": "codepipeline-eu-west-1-364136788941",
                            "loginURL": "https://.signin.aws.amazon.com/console/s3?region=#",
                            "loggedInURL": "https://.console.aws.amazon.com/s3/v2/home?region=#",
                            "title": "codepipeline-eu-west-1-364136788941",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "s3",
                                "region": "",
                                "accountId": "",
                                "resource": "codepipeline-eu-west-1-364136788941",
                                "resourceType": "",
                                "qualifier": ""
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "01a408f8b0b7830b0d77942bbdacf53a",
                    "_score": 6.3614445,
                    "_source": {
                        "id": "01a408f8b0b7830b0d77942bbdacf53a",
                        "label": "AWS_IAM_Policy",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-05-15T12:43:55.897Z",
                            "configurationItemStatus": "OK",
                            "configurationStateId": "1566451361164",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom_discovery-eu-west-1",
                            "resourceType": "AWS::IAM::Policy",
                            "resourceId": "ANPA5XIWUT3PSXI6FK57R",
                            "resourceName": "CodeBuildBasePolicy-zoom_discovery-eu-west-1",
                            "awsRegion": "global",
                            "availabilityZone": "Not Applicable",
                            "resourceCreationTime": "2019-05-15T10:53:17.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"policyName\":\"CodeBuildBasePolicy-zoom_discovery-eu-west-1\",\"policyId\":\"ANPA5XIWUT3PSXI6FK57R\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom_discovery-eu-west-1\",\"path\":\"/service-role/\",\"defaultVersionId\":\"v3\",\"attachmentCount\":1,\"permissionsBoundaryUsageCount\":0,\"isAttachable\":true,\"description\":null,\"createDate\":\"2019-05-15T10:53:17.000Z\",\"updateDate\":\"2019-05-15T11:48:50.000Z\",\"policyVersionList\":[{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v3\",\"isDefaultVersion\":true,\"createDate\":\"2019-05-15T11:48:50.000Z\"},{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v2\",\"isDefaultVersion\":false,\"createDate\":\"2019-05-15T11:47:43.000Z\"},{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom_discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-discovery%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-discovery-codebuild%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v1\",\"isDefaultVersion\":false,\"createDate\":\"2019-05-15T10:53:17.000Z\"}]}",
                            "supplementaryConfiguration": {},
                            "path": "/service-role/",
                            "description": null,
                            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy",
                            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/policy",
                            "title": "CodeBuildBasePolicy-zoom_discovery-eu-west-1",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "iam",
                                "region": "",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "policy",
                                "resource": "service-role",
                                "qualifier": "CodeBuildBasePolicy-zoom_discovery-eu-west-1"
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "d03786e9f56c083232eb4c797297e3f8",
                    "_score": 5.9818125,
                    "_source": {
                        "id": "d03786e9f56c083232eb4c797297e3f8",
                        "label": "AWS_IAM_Policy",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-08-22T05:22:41.164Z",
                            "configurationItemStatus": "OK",
                            "configurationStateId": "1566451361164",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1",
                            "resourceType": "AWS::IAM::Policy",
                            "resourceId": "ANPA5XIWUT3P4VOIWQQEW",
                            "resourceName": "CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1",
                            "awsRegion": "global",
                            "availabilityZone": "Not Applicable",
                            "resourceCreationTime": "2019-08-21T09:38:11.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"policyName\":\"CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1\",\"policyId\":\"ANPA5XIWUT3P4VOIWQQEW\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1\",\"path\":\"/service-role/\",\"defaultVersionId\":\"v1\",\"attachmentCount\":0,\"permissionsBoundaryUsageCount\":0,\"isAttachable\":true,\"description\":null,\"createDate\":\"2019-08-21T09:38:11.000Z\",\"updateDate\":\"2019-08-21T09:38:11.000Z\",\"policyVersionList\":[{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui-codepipeline%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui-codepipeline%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-ui%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui-build-artifacts%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui-build-artifacts%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v1\",\"isDefaultVersion\":true,\"createDate\":\"2019-08-21T09:38:11.000Z\"}]}",
                            "supplementaryConfiguration": {},
                            "path": "/service-role/",
                            "description": null,
                            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy",
                            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/policy",
                            "title": "CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "iam",
                                "region": "",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "policy",
                                "resource": "service-role",
                                "qualifier": "CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1"
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "73d4229950c96064b4ee432ed632c8f9",
                    "_score": 5.965585,
                    "_source": {
                        "id": "73d4229950c96064b4ee432ed632c8f9",
                        "label": "AWS_IAM_Role",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-08-14T05:22:50.981Z",
                            "configurationItemStatus": "OK",
                            "configurationStateId": "1566451365146",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:iam::XXXXXXXXXXXX:role/dev-appname-neptune-iam-role-eu-west-1",
                            "resourceType": "AWS::IAM::Role",
                            "resourceId": "AROA5XIWUT3PTCCDN56FT",
                            "resourceName": "dev-appname-neptune-iam-role-eu-west-1",
                            "awsRegion": "global",
                            "availabilityZone": "Not Applicable",
                            "resourceCreationTime": "2019-08-13T08:28:50.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"path\":\"/\",\"roleName\":\"dev-appname-neptune-iam-role-eu-west-1\",\"roleId\":\"AROA5XIWUT3PTCCDN56FT\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:role/dev-appname-neptune-iam-role-eu-west-1\",\"createDate\":\"2019-08-13T08:28:50.000Z\",\"assumeRolePolicyDocument\":\"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%5B%22rds.amazonaws.com%22%2C%22monitoring.rds.amazonaws.com%22%5D%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D\",\"instanceProfileList\":[],\"rolePolicyList\":[],\"attachedManagedPolicies\":[{\"policyName\":\"dev-appname-neptune-s3-policy-eu-west-1\",\"policyArn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-s3-policy-eu-west-1\"},{\"policyName\":\"dev-appname-neptune-cw-policy-eu-west-1\",\"policyArn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-cw-policy-eu-west-1\"}],\"permissionsBoundary\":null,\"tags\":[{\"key\":\"ServiceNameTag\",\"value\":\"zoom\"},{\"key\":\"Environment\",\"value\":\"dev\"}]}",
                            "supplementaryConfiguration": {},
                            "path": "/",
                            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles",
                            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/roles",
                            "title": "dev-appname-neptune-iam-role-eu-west-1",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "iam",
                                "region": "",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "role",
                                "resource": "dev-appname-neptune-iam-role-eu-west-1",
                                "qualifier": ""
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "d58b5e428a1179897cb82d3047f19224",
                    "_score": 5.792181,
                    "_source": {
                        "id": "d58b5e428a1179897cb82d3047f19224",
                        "label": "AWS_IAM_Policy",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-08-14T05:22:46.531Z",
                            "configurationItemStatus": "OK",
                            "configurationStateId": "1566451361164",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-cw-policy-eu-west-1",
                            "resourceType": "AWS::IAM::Policy",
                            "resourceId": "ANPA5XIWUT3PRDUQV2LPM",
                            "resourceName": "dev-appname-neptune-cw-policy-eu-west-1",
                            "awsRegion": "global",
                            "availabilityZone": "Not Applicable",
                            "resourceCreationTime": "2019-08-13T08:28:37.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"policyName\":\"dev-appname-neptune-cw-policy-eu-west-1\",\"policyId\":\"ANPA5XIWUT3PRDUQV2LPM\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/dev-appname-neptune-cw-policy-eu-west-1\",\"path\":\"/\",\"defaultVersionId\":\"v1\",\"attachmentCount\":1,\"permissionsBoundaryUsageCount\":0,\"isAttachable\":true,\"description\":null,\"createDate\":\"2019-08-13T08:28:37.000Z\",\"updateDate\":\"2019-08-13T08:28:37.000Z\",\"policyVersionList\":[{\"document\":\"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22logs%3ACreateLogGroup%22%2C%22logs%3APutRetentionPolicy%22%5D%2C%22Resource%22%3A%5B%22arn%3Aaws%3Alogs%3A%2A%3A%2A%3Alog-group%3A%2Faws%2Fneptune%2F%2A%22%5D%2C%22Effect%22%3A%22Allow%22%2C%22Sid%22%3A%22EnableLogGroups%22%7D%2C%7B%22Action%22%3A%5B%22logs%3ACreateLogStream%22%2C%22logs%3APutLogEvents%22%2C%22logs%3ADescriptLogStreams%22%2C%22logs%3AGetLogEvents%22%5D%2C%22Resource%22%3A%5B%22arn%3Aaws%3Alogs%3A%2A%3A%2A%3Alog-group%3A%2Faws%2Fneptune%2F%2A%3Alog-stream%3A%2A%22%5D%2C%22Effect%22%3A%22Allow%22%2C%22Sid%22%3A%22EnableLogStreams%22%7D%5D%7D\",\"versionId\":\"v1\",\"isDefaultVersion\":true,\"createDate\":\"2019-08-13T08:28:37.000Z\"}]}",
                            "supplementaryConfiguration": {},
                            "path": "/",
                            "description": null,
                            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy",
                            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/policy",
                            "title": "dev-appname-neptune-cw-policy-eu-west-1",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "iam",
                                "region": "",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "policy",
                                "resource": "dev-appname-neptune-cw-policy-eu-west-1",
                                "qualifier": ""
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "70f98c613b6bc7ca89be1b66b697e811",
                    "_score": 5.7876325,
                    "_source": {
                        "id": "70f98c613b6bc7ca89be1b66b697e811",
                        "label": "AWS_IAM_Policy",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-05-18T12:43:54.020Z",
                            "configurationItemStatus": "OK",
                            "configurationStateId": "1566451361164",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery",
                            "resourceType": "AWS::IAM::Policy",
                            "resourceId": "ANPA5XIWUT3PYAQ6FAKPI",
                            "resourceName": "AWSCodePipelineServiceRole-eu-west-1-zoom-discovery",
                            "awsRegion": "global",
                            "availabilityZone": "Not Applicable",
                            "resourceCreationTime": "2019-05-17T15:20:49.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"policyName\":\"AWSCodePipelineServiceRole-eu-west-1-zoom-discovery\",\"policyId\":\"ANPA5XIWUT3PYAQ6FAKPI\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery\",\"path\":\"/service-role/\",\"defaultVersionId\":\"v1\",\"attachmentCount\":1,\"permissionsBoundaryUsageCount\":0,\"isAttachable\":true,\"description\":null,\"createDate\":\"2019-05-17T15:20:49.000Z\",\"updateDate\":\"2019-05-17T15:20:49.000Z\",\"policyVersionList\":[{\"document\":\"%7B%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3APassRole%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Condition%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22StringEqualsIfExists%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22iam%3APassedToService%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticbeanstalk.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ec2.amazonaws.com%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecs-tasks.amazonaws.com%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3ACancelUploadArchive%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetBranch%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetCommit%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGetUploadArchiveStatus%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AUploadArchive%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3ACreateDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetApplication%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetApplicationRevision%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3AGetDeploymentConfig%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codedeploy%3ARegisterApplicationRevision%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticbeanstalk%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ec2%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22elasticloadbalancing%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22autoscaling%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudwatch%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22sns%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22rds%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22sqs%3A%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecs%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22lambda%3AInvokeFunction%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22lambda%3AListFunctions%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ACreateDeployment%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeApps%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeCommands%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeDeployments%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeInstances%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3ADescribeStacks%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3AUpdateApp%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22opsworks%3AUpdateStack%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ACreateStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADeleteStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADescribeStacks%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AUpdateStack%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ACreateChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADeleteChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ADescribeChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AExecuteChangeSet%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3ASetStackPolicy%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AValidateTemplate%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codebuild%3ABatchGetBuilds%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codebuild%3AStartBuild%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AListProjects%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AListDevicePools%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AGetRun%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AGetUpload%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3ACreateUpload%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22devicefarm%3AScheduleRun%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3AListProvisioningArtifacts%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ACreateProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ADescribeProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3ADeleteProvisioningArtifact%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22servicecatalog%3AUpdateProduct%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22cloudformation%3AValidateTemplate%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22ecr%3ADescribeImages%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%22%2A%22%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%2C%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%0A%7D\",\"versionId\":\"v1\",\"isDefaultVersion\":true,\"createDate\":\"2019-05-17T15:20:49.000Z\"}]}",
                            "supplementaryConfiguration": {},
                            "path": "/service-role/",
                            "description": null,
                            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy",
                            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/policy",
                            "title": "AWSCodePipelineServiceRole-eu-west-1-zoom-discovery",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "iam",
                                "region": "",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "policy",
                                "resource": "service-role",
                                "qualifier": "AWSCodePipelineServiceRole-eu-west-1-zoom-discovery"
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "dd7ccf743ba563f4c478874f646c8df8",
                    "_score": 5.6475577,
                    "_source": {
                        "id": "dd7ccf743ba563f4c478874f646c8df8",
                        "label": "AWS_IAM_Policy",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-05-16T12:43:52.046Z",
                            "configurationItemStatus": "OK",
                            "configurationStateId": "1566451361164",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1",
                            "resourceType": "AWS::IAM::Policy",
                            "resourceId": "ANPA5XIWUT3PZWY35FBHP",
                            "resourceName": "CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1",
                            "awsRegion": "global",
                            "availabilityZone": "Not Applicable",
                            "resourceCreationTime": "2019-05-15T20:43:53.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"policyName\":\"CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1\",\"policyId\":\"ANPA5XIWUT3PZWY35FBHP\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1\",\"path\":\"/service-role/\",\"defaultVersionId\":\"v1\",\"attachmentCount\":1,\"permissionsBoundaryUsageCount\":0,\"isAttachable\":true,\"description\":null,\"createDate\":\"2019-05-15T20:43:53.000Z\",\"updateDate\":\"2019-05-15T20:43:53.000Z\",\"policyVersionList\":[{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3Azoom-discovery%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3Azoom-discovery%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v1\",\"isDefaultVersion\":true,\"createDate\":\"2019-05-15T20:43:53.000Z\"}]}",
                            "supplementaryConfiguration": {},
                            "path": "/service-role/",
                            "description": null,
                            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy",
                            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/policy",
                            "title": "CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "iam",
                                "region": "",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "policy",
                                "resource": "service-role",
                                "qualifier": "CodeBuildCloudWatchLogsPolicy-zoom_discovery-eu-west-1"
                            }
                        }
                    }
                },
                {
                    "_index": "data",
                    "_type": "_doc",
                    "_id": "7fe5f5eb2ba8d479c4c985f7db438e52",
                    "_score": 5.308773,
                    "_source": {
                        "id": "7fe5f5eb2ba8d479c4c985f7db438e52",
                        "label": "AWS_IAM_Role",
                        "properties": {
                            "version": "1.3",
                            "accountId": "XXXXXXXXXXXX",
                            "configurationItemCaptureTime": "2019-05-17T15:31:57.204Z",
                            "configurationItemStatus": "ResourceDiscovered",
                            "configurationStateId": "1566451365146",
                            "configurationItemMD5Hash": "",
                            "arn": "arn:aws:iam::XXXXXXXXXXXX:role/service-role/cwe-role-eu-west-1-zoom-discovery",
                            "resourceType": "AWS::IAM::Role",
                            "resourceId": "AROA5XIWUT3PX44FTT4JA",
                            "resourceName": "cwe-role-eu-west-1-zoom-discovery",
                            "awsRegion": "global",
                            "availabilityZone": "Not Applicable",
                            "resourceCreationTime": "2019-05-17T15:20:51.000Z",
                            "tags": {},
                            "relatedEvents": [],
                            "configuration": "{\"path\":\"/service-role/\",\"roleName\":\"cwe-role-eu-west-1-zoom-discovery\",\"roleId\":\"AROA5XIWUT3PX44FTT4JA\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:role/service-role/cwe-role-eu-west-1-zoom-discovery\",\"createDate\":\"2019-05-17T15:20:51.000Z\",\"assumeRolePolicyDocument\":\"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22events.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D\",\"instanceProfileList\":[],\"rolePolicyList\":[],\"attachedManagedPolicies\":[{\"policyName\":\"start-pipeline-execution-eu-west-1-zoom-discovery\",\"policyArn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/start-pipeline-execution-eu-west-1-zoom-discovery\"}],\"permissionsBoundary\":null,\"tags\":[]}",
                            "supplementaryConfiguration": {},
                            "path": "/service-role/",
                            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles",
                            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/roles",
                            "title": "cwe-role-eu-west-1-zoom-discovery",
                            "parsedArn": {
                                "partition": "aws",
                                "service": "iam",
                                "region": "",
                                "accountId": "XXXXXXXXXXXX",
                                "resourceType": "role",
                                "resource": "service-role",
                                "qualifier": "cwe-role-eu-west-1-zoom-discovery"
                            }
                        }
                    }
                }
            ]
        }
    };

    let results = zoomUtils.exactMatch(input, "eu-west-1");

    let expected = {
        hits: { total: 311, max_score: 6.5707817, hits: [] }
    };

    expect(results).to.deep.equal(expected);
});

it('should run a basic test of callAwsAPI with a NextToken.', async () => {
    const fun1 = (param) => {
        console.log("fun1", param.counter--);

        let data = {};

        if (param.counter > 0) {

            data = {
                NextToken: param.counter,
                properties: [param.counter]
            }
        }
        else {
            data = {
                properties: [param.counter]
            }
        }

        return zoomTestUtils.createResponse(data);
    };

    let ans = await zoomUtils.callAwsApiWithPagination(fun1, { counter: 5 }, this);

    const expected = { properties: [0, 1, 2, 3, 4] };

    expect(ans).to.deep.equal(expected);
});

it('should run a more realistic merge of two API objects.', async () => {
    let object1 = {
        ResourceIdentifiers:
            [{
                SourceAccountId: 'XXXXXXXXXXXX',
                SourceRegion: 'eu-west-1',
                ResourceId: 'AIDA5XIWUT3P3ITLUG7G4',
                ResourceType: 'AWS::IAM::User',
                ResourceName: 'rpcraig',
                anArray: [1]
            },
            {
                SourceAccountId: 'XXXXXXXXXXXX',
                SourceRegion: 'eu-west-1',
                ResourceId: 'AIDA5XIWUT3P5NWNVLAGS',
                ResourceType: 'AWS::IAM::User',
                ResourceName: 'dan',
                anArray: [2]
            }]
    };

    let object2 = {
        ResourceIdentifiers:
            [{
                SourceAccountId: 'XXXXXXXXXXXX',
                SourceRegion: 'eu-west-1',
                ResourceId: 'AIDA5XIWUT3PVFH5FG6AD',
                ResourceType: 'AWS::IAM::User',
                ResourceName: 'eastonm',
                anArray: [3]
            },
            {
                SourceAccountId: 'XXXXXXXXXXXX',
                SourceRegion: 'eu-west-1',
                ResourceId: 'AIDA5XIWUT3PVKQN7OVTN',
                ResourceType: 'AWS::IAM::User',
                ResourceName: 'chwhitta',
                anArray: [4]
            },]
    }

    let object3 = zoomUtils.merge(object1, object2);

    const expected = {
        ResourceIdentifiers:
            [{
                SourceAccountId: 'XXXXXXXXXXXX',
                SourceRegion: 'eu-west-1',
                ResourceId: 'AIDA5XIWUT3P3ITLUG7G4',
                ResourceType: 'AWS::IAM::User',
                ResourceName: 'rpcraig',
                anArray: [1]
            },
            {
                SourceAccountId: 'XXXXXXXXXXXX',
                SourceRegion: 'eu-west-1',
                ResourceId: 'AIDA5XIWUT3P5NWNVLAGS',
                ResourceType: 'AWS::IAM::User',
                ResourceName: 'dan',
                anArray: [2]
            },
            {
                SourceAccountId: 'XXXXXXXXXXXX',
                SourceRegion: 'eu-west-1',
                ResourceId: 'AIDA5XIWUT3PVFH5FG6AD',
                ResourceType: 'AWS::IAM::User',
                ResourceName: 'eastonm',
                anArray: [3]
            },
            {
                SourceAccountId: 'XXXXXXXXXXXX',
                SourceRegion: 'eu-west-1',
                ResourceId: 'AIDA5XIWUT3PVKQN7OVTN',
                ResourceType: 'AWS::IAM::User',
                ResourceName: 'chwhitta',
                anArray: [4]
            }]
    }

    expect(object3).to.deep.equal(expected);
});
