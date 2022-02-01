const uuidv4 = require('uuid/v4');
const R = require('ramda');

module.exports = (cfn, config) => {

  const {
    STACK_NAME,
    DEPLOYMENT_BUCKET,
    DEPLOYMENT_BUCKET_KEY,
    DISCOVERY_BUCKET,
    REGION,
    IMAGE_VERSION,
    EXISTING_CONFIG,
    CREATE_OPENSEARCH_SERVICE_ROLE,
    NEPTUNE_INSTANCE_CLASS,
    CREATE_READ_REPLICA,
    OPENSEARCH_INSTANCE_TYPE,
    OPENSEARCH_MULTI_AZ,
    AMPLIFY_STORAGE_BUCKET,
    ACCESS_LOGS,
    APPSYNC_API_ARN,
    APPSYNC_API_ID,
    APPSYNC_API_GRAPHQL_URL,
    ATHENA_WORKGROUP,
    PERSPECTIVE_APP_NAME,
    PERSPECTIVE_STACK_NAME,
    COST_AND_USAGE_REPORT_BUCKET,
    COST_AND_USAGE_RESULTS_BUCKET,
  } = config;

  const params = {
    StackName: `${PERSPECTIVE_STACK_NAME}`,
    Capabilities: [
      'CAPABILITY_IAM',
      'CAPABILITY_NAMED_IAM',
      'CAPABILITY_AUTO_EXPAND',
    ],
    ClientRequestToken: `${PERSPECTIVE_APP_NAME}-${uuidv4()}`,
    DisableRollback: true,
    EnableTerminationProtection: true,
    Parameters: [
      {
        ParameterKey: 'AppName',
        ParameterValue: PERSPECTIVE_APP_NAME
      },
      {
        ParameterKey: 'ImageVersion',
        ParameterValue: IMAGE_VERSION,
      },
      {
        ParameterKey: 'DeploymentBucket',
        ParameterValue: `https://s3.${REGION}.amazonaws.com/${DEPLOYMENT_BUCKET}/${DEPLOYMENT_BUCKET_KEY}`,
      },
      {
        ParameterKey: 'DeploymentBucketName',
        ParameterValue: `${DEPLOYMENT_BUCKET}`,
      },
      {
        ParameterKey: 'DeploymentBucketKey',
        ParameterValue: `${DEPLOYMENT_BUCKET_KEY}`,
      },
      {
        ParameterKey: 'DiscoveryBucket',
        ParameterValue: `${DISCOVERY_BUCKET}`,
      },
      {
        ParameterKey: 'ExistingConfigInstallation',
        ParameterValue: `${EXISTING_CONFIG}`,
      },
      {
        ParameterKey: 'CreateOpensearchServiceRole',
        ParameterValue: `${CREATE_OPENSEARCH_SERVICE_ROLE}`,
      },
      {
        ParameterKey: 'NeptuneInstanceClass',
        ParameterValue: `${NEPTUNE_INSTANCE_CLASS}`,
      },
      {
        ParameterKey: 'CreateNeptuneReplica',
        ParameterValue: `${CREATE_READ_REPLICA}`,
      },
      {
        ParameterKey: 'AmplifyStorageBucket',
        ParameterValue: `${AMPLIFY_STORAGE_BUCKET}`,
      },
      {
        ParameterKey: 'AccessLogsBucket',
        ParameterValue: `${ACCESS_LOGS}`,
      },
      {
        ParameterKey: 'PerspectiveAppSyncApiId',
        ParameterValue: `${APPSYNC_API_ID}`,
      },
      {
        ParameterKey: 'PerspectiveAppSyncApiArn',
        ParameterValue: `${APPSYNC_API_ARN}`,
      },
      {
        ParameterKey: 'PerspectiveAppSyncApiUrl',
        ParameterValue: `${APPSYNC_API_GRAPHQL_URL}`,
      },

      {
        ParameterKey: 'AthenaWorkgroup',
        ParameterValue: `${ATHENA_WORKGROUP}`,
      },
      {
        ParameterKey: 'OpensearchInstanceType',
        ParameterValue: `${OPENSEARCH_INSTANCE_TYPE}`,
      },

      {
        ParameterKey: 'OpensearchMultiAz',
        ParameterValue: `${OPENSEARCH_MULTI_AZ}`,
      },

      {
        ParameterKey: 'CostAndUsageReportBucket',
        ParameterValue: `${COST_AND_USAGE_REPORT_BUCKET}`,
      },
      {
        ParameterKey: 'CostAndUsageResultsBucket',
        ParameterValue: `${COST_AND_USAGE_RESULTS_BUCKET}`,
      },
    ],
    Tags: [
      {
        Key: 'AppName',
        Value: PERSPECTIVE_APP_NAME
      }
    ],
    TemplateURL: `https://s3.${REGION}.amazonaws.com/${DEPLOYMENT_BUCKET}/${DEPLOYMENT_BUCKET_KEY}/zoom-main.template`,
    TimeoutInMinutes: '60'
  };

  function describeStackResources(StackName) {
    function describeStackResourcesRec(promise, xs = []) {
      return promise
          .then(x => x.StackResources != null ? x.StackResources : x)
          .then(result => {
            const [stacks, resources] = R.partition(x => x.ResourceType === 'AWS::CloudFormation::Stack', result);
            xs.push(...resources);
            return R.isEmpty(stacks) ?
                xs :
                describeStackResourcesRec(Promise.all(stacks.map(({PhysicalResourceId}) => cfn.describeStackResources({StackName: PhysicalResourceId}).promise())), xs);
          })
          .then(R.chain(x => x.StackResources != null ? x.StackResources : x));
    }

    return describeStackResourcesRec(cfn.describeStackResources({StackName}).promise());
  }

  return {
    createStack: () => cfn.createStack(params).promise(),
    updateStack: () =>
      cfn
        .updateStack(
          R.omit(
            [
              'DisableRollback',
              'EnableTerminationProtection',
              'TimeoutInMinutes',
            ],
            params
          )
        )
        .promise(),
    updateStackTermination: () =>
      cfn.updateTerminationProtection({
        EnableTerminationProtection: false,
        StackName: `${PERSPECTIVE_STACK_NAME}`,
      }),
    deleteStack: () =>
      cfn.deleteStack({ StackName: `${PERSPECTIVE_STACK_NAME}` }),
    getResourceTypes: (resourceTypes) => {
      return Promise.all(
        [STACK_NAME, PERSPECTIVE_STACK_NAME].map(describeStackResources)
      ).then(
        R.chain(R.filter((x) => R.includes(x.ResourceType, resourceTypes)))
      );
    },
  };
};
