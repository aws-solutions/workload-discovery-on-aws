const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const {
  ACCOUNT_ID,
  DEPLOYMENT_BUCKET,
  DEPLOYMENT_BUCKET_KEY,
  DISCOVERY_BUCKET,
  REGION,
  IMAGE_VERSION,
  EXISTING_CONFIG, 
  CREATE_ES_SERVICE_ROLE,
  NEPTUNE_INSTANCE_CLASS,
  CREATE_READ_REPLICA,
  ELASTICSEARCH_INSTANCE_TYPE,
  AMPLIFY_STORAGE_BUCKET,
  ACCESS_LOGS,
  APPSYNC_API_ARN,
  APPSYNC_API_ID,
  APPSYNC_API_GRAPHQL_URL
} = process.env;
const PERSPECTIVE = `aws-perspective-${ACCOUNT_ID}`;
module.exports = cloudformation => {

  var params = {
    StackName: `${PERSPECTIVE}-${REGION}`,
    Capabilities: [
      'CAPABILITY_IAM',
      'CAPABILITY_NAMED_IAM',
      'CAPABILITY_AUTO_EXPAND'
    ],
    ClientRequestToken: `${PERSPECTIVE}-${uuidv4()}`,
    DisableRollback: true,
    EnableTerminationProtection: true,
    Parameters: [
      {
        ParameterKey: 'AppName',
        ParameterValue: PERSPECTIVE
      },
      {
        ParameterKey: 'ImageVersion',
        ParameterValue: IMAGE_VERSION
      },
      {
        ParameterKey: 'DeploymentBucket',
        ParameterValue: `https://s3.${REGION}.amazonaws.com/${DEPLOYMENT_BUCKET}/${DEPLOYMENT_BUCKET_KEY}`
      },
      {
        ParameterKey: 'DeploymentBucketName',
        ParameterValue: `${DEPLOYMENT_BUCKET}`
      },
      {
        ParameterKey: 'DeploymentBucketKey',
        ParameterValue: `${DEPLOYMENT_BUCKET_KEY}`
      },
      {
        ParameterKey: 'DiscoveryBucket',
        ParameterValue: `${DISCOVERY_BUCKET}`
      },
      {
        ParameterKey: 'ExistingConfigInstallation',
        ParameterValue: `${EXISTING_CONFIG}`
      },
      {
        ParameterKey: 'CreateElasticSearchServiceRole',
        ParameterValue: `${CREATE_ES_SERVICE_ROLE}`
      },
      {
        ParameterKey: 'NeptuneInstanceClass',
        ParameterValue: `${NEPTUNE_INSTANCE_CLASS}`
      },
      {
        ParameterKey: 'CreateNeptuneReplica',
        ParameterValue: `${CREATE_READ_REPLICA}`
      },
      {
        ParameterKey: 'AmplifyStorageBucket',
        ParameterValue: `${AMPLIFY_STORAGE_BUCKET}`
      },
      {
        ParameterKey: 'AccessLogsBucket',
        ParameterValue: `${ACCESS_LOGS}`
      },
      {
        ParameterKey: 'PerspectiveAppSyncApiId',
        ParameterValue: `${APPSYNC_API_ID}`
      },
      {
        ParameterKey: 'PerspectiveAppSyncApiArn',
        ParameterValue: `${APPSYNC_API_ARN}`
      },
      {
        ParameterKey: 'PerspectiveAppSyncApiUrl',
        ParameterValue: `${APPSYNC_API_GRAPHQL_URL}`
      },
      {
        ParameterKey: 'ElasticsearchInstanceType',
        ParameterValue: `${ELASTICSEARCH_INSTANCE_TYPE}`
      }
    ],
    Tags: [
      {
        Key: 'AppName',
        Value: PERSPECTIVE
      }
    ],
    TemplateURL: `https://s3.${REGION}.amazonaws.com/${DEPLOYMENT_BUCKET}/${DEPLOYMENT_BUCKET_KEY}/zoom-main.template`,
    TimeoutInMinutes: '60'
  };

  return {
    executeStack: () =>
      cloudformation
        .createStack(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        })
        .promise()
  };
};
