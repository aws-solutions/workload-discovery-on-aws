const chai = require('chai');
const AccountAuthorizationDetailsMock = require('./mockAwsGetAccountAuthorizationDetails');
const GetAccountAuthorizationDetails = require("../src/discovery/getAccountAuthorizationDetails");
const RoleAccountAuthorizationDetails = require("../src/discovery/roleAccountAuthorizationDetails");
const DataClientMock = require('./mockDataClient');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should successfully return an array of resources', async () => {
  // Get the local managed policies

  const roleAccountAuthorizationDetails = new RoleAccountAuthorizationDetails(DataClientMock);
  const results = await roleAccountAuthorizationDetails.processRoles("XXXXXXXXXXXX", "global");
  let expected = [{
    id: '69756df019f1a4d7aacf99e25628c891',
    resourceId: 'AROA5XIWUT3PTKUAI7ZNI',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'e4928a557ef9abd40d1f1513d0bebc6e',
    resourceId: 'AROA5XIWUT3PRI7PL4MBR',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'a9d5672727e01ec4900f3e515e1cf07d',
    resourceId: 'AROA5XIWUT3P4RPLIA3PS',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '70ffbbdf408a2631038679e0504124f4',
    resourceId: 'AROA5XIWUT3PX44FTT4JA',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'c668cc8c26bc41206f8a96f586ce7cd8',
    resourceId: 'AROA5XIWUT3PYU5L4IJ3C',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '301681505a5014b79d3201561e82b3c6',
    resourceId: 'AROA5XIWUT3P6QJACLR3J',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'a6b0967cb81475b3961d1e492c45dfef',
    resourceId: 'AROA5XIWUT3P75UE4SSMG',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'b46b35c036aff0905942411a9799ae96',
    resourceId: 'XXX',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'd2de4cb5fec63430e5211e051e3c8f4f',
    resourceId: 'AROA5XIWUT3PRYCQXWMEB',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'bca84eed48cd69bcd78d8f8ffc2a4f1a',
    resourceId: 'AROA5XIWUT3PXMISEHRQR',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '06253f1603f3f0a0cf18dec22f6585d0',
    resourceId: 'AROA5XIWUT3PY45N7IWAK',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '83f2db3292deccfe7b445b0e974857ee',
    resourceId: 'AROA5XIWUT3PYC6SGRPIW',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '9e886599ea44583d7921e11710e5d5ad',
    resourceId: 'AROA5XIWUT3P4RLNO74DE',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '26d6250dd3eff9f407d9bcb376fb6ee7',
    resourceId: 'AROA5XIWUT3P6QO6KNL2D',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'f4207ebf27b0879d1fd03dc205fbaedd',
    resourceId: 'AROA5XIWUT3PQJS4HAMVJ',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'e3477b8b91565435edae53bac15fc435',
    resourceId: 'AROA5XIWUT3PSGSD4XAFC',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '01e4c3c777996f4b11e884dfdd1b7345',
    resourceId: 'AROA5XIWUT3PV7TH6ENQK',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '3f416c805567e87dfc174c0badbf1c46',
    resourceId: 'AROA5XIWUT3PVZCQSXTB4',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '819bd227d1d27fac394ad3c063b83b7a',
    resourceId: 'AROA5XIWUT3PWY6JHPHC7',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'bb92fd9d332b4c952ad5b3913923c1e6',
    resourceId: 'AROA5XIWUT3PX4YRN3FAR',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '8f18d4ec0decf9bc2a1916b1c3797e99',
    resourceId: 'AROA5XIWUT3P44ZMG5L3A',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'c18cbb8b61406f65364271cbfeb61a34',
    resourceId: 'AROA5XIWUT3P7EXG55OBM',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '2cb63cfa494c520389d0f8311aa34b2d',
    resourceId: 'AROA5XIWUT3PSNBKU6QYR',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '020f0a5b9b1aa2d94bb0049ffc928842',
    resourceId: 'AROA5XIWUT3PTUV47EUQ7',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '009044c4116e158289674ec72743c845',
    resourceId: 'AROA5XIWUT3PUWUGOOPQE',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'd2844e82c5896a232fa241a6edafa966',
    resourceId: 'AROA5XIWUT3PWISDWULIE',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '6e1bea55263da3bd14ade34df2bea360',
    resourceId: 'AROA5XIWUT3PWJJDXMS2S',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '38c21a5fbc41f8266a528a9367e65f42',
    resourceId: 'AROA5XIWUT3PXEK5J3ILX',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '0eda29ffd5a354a2eeadf3cd510ece99',
    resourceId: 'AROA5XIWUT3PXOOFZCSL3',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '7df89f01655208df456eee950a8ef5fe',
    resourceId: 'AROA5XIWUT3PYZMFRQTFI',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '85d0d5afd91aad8ec5b89f41f2144e3e',
    resourceId: 'AROA5XIWUT3P7RYF3GGAW',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'cf14f782d53f1d237c9cdd66b1af7121',
    resourceId: 'AROA5XIWUT3PWOWJSEJJS',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '67ccd48054ecca3144bcacae9a519663',
    resourceId: 'AROA5XIWUT3P2QHWKVOV6',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'c8482c9343ad540c82f408bb19168625',
    resourceId: 'AROA5XIWUT3PS3VYHIH5H',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '5657388afe9ddf1e7c5f2f895027db87',
    resourceId: 'AROA5XIWUT3P6ZM2XLCWR',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '9e67c324025ed0c554515d1915f919c9',
    resourceId: 'AROA5XIWUT3P3LPIILXOX',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'a246e6ac48bf7fda059a647018638800',
    resourceId: 'AROA5XIWUT3P5AHI6ZI3Y',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'b809d54e06de2f1317d80374a3c29199',
    resourceId: 'AROA5XIWUT3P5NP3HKZIF',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'c8e52a361aac6fe7d82d9981a9589109',
    resourceId: 'AROA5XIWUT3P776WPM4DB',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'cf804844381afab8e69fddda45f6432e',
    resourceId: 'AROA5XIWUT3PRXBEGEEMD',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '301c84be3c0a5e66fe8be7b763770d3d',
    resourceId: 'AROA5XIWUT3PTHVHIN35L',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '2fa8149f27b8a39ff6d51fde06c5ee54',
    resourceId: 'AROA5XIWUT3PUOIYQWB2N',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: '4218c7adcd49ee80dd01229cf9b59475',
    resourceId: 'AROA5XIWUT3PVCR7UJYFV',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  },
  {
    id: 'b01b4a098c5e41240c90e5f27e9676bb',
    resourceId: 'AROA5XIWUT3PWPLU4LSBF',
    resourceType: 'AWS::IAM::Role',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
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
    }
  }]

  expect(results).to.deep.equal(expected);
});

it('Should successfully call ProcessConfigDetails', async () => {
  // Get the local managed policies
  const roleAccountAuthorizationDetails = new RoleAccountAuthorizationDetails(DataClientMock);

  const results = await roleAccountAuthorizationDetails.processConfigDetails("XXXXXXXXXXXX", "global", "ROA5XIWUT3PVCR7UJYF", '{"path":"/","roleName":"twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9","roleId":"AROA5XIWUT3PVCR7UJYFV","arn":"arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9","createDate":"2019-05-10T12:13:47.000Z","assumeRolePolicyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22lambda.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D","instanceProfileList":[],"rolePolicyList":[{"policyName":"NotificationLambdaExecutionRolePolicy","policyDocument":"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Action%22%3A%5B%22logs%3ACreateLogGroup%22%2C%22logs%3ACreateLogStream%22%2C%22logs%3APutLogEvents%22%5D%2C%22Resource%22%3A%22arn%3Aaws%3Alogs%3A%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22ec2%3ACreateNetworkInterface%22%2C%22ec2%3ADescribeNetworkInterfaces%22%2C%22ec2%3ADeleteNetworkInterface%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22sns%3ASubscribe%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22ses%3ASendEmail%22%2C%22ses%3ASendRawEmail%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22lambda%3AInvokeFunction%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%2C%7B%22Action%22%3A%5B%22s3%3Aget%2A%22%2C%22s3%3Alist%2A%22%5D%2C%22Resource%22%3A%22%2A%22%2C%22Effect%22%3A%22Allow%22%7D%5D%7D"}],"attachedManagedPolicies":[],"permissionsBoundary":null,"tags":[]}', "arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9");

  let expected = [{
    resourceId: 'NotificationLambdaExecutionRolePolicy|XXXXXXXXXXXX|0d0fb6665bc20bee607153ed4d86ee03',
    resourceType: 'AWS::IAM::Role_In_Line_Policy',
    accountId: 'XXXXXXXXXXXX',
    properties:
    {
      resourceId: 'NotificationLambdaExecutionRolePolicy|XXXXXXXXXXXX|0d0fb6665bc20bee607153ed4d86ee03',
      resourceType: 'AWS::IAM::Role_In_Line_Policy',
      accountId: 'XXXXXXXXXXXX',
      awsRegion: 'global',
      policyDocument:
      {
        Version: '2012-10-17',
        Statement:
          [{
            Action:
              ['logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents'],
            Resource: 'arn:aws:logs:*',
            Effect: 'Allow'
          },
          {
            Action:
              ['ec2:CreateNetworkInterface',
                'ec2:DescribeNetworkInterfaces',
                'ec2:DeleteNetworkInterface'],
            Resource: '*',
            Effect: 'Allow'
          },
          { Action: ['sns:Subscribe'], Resource: '*', Effect: 'Allow' },
          {
            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
            Resource: '*',
            Effect: 'Allow'
          },
          {
            Action: ['lambda:InvokeFunction'],
            Resource: '*',
            Effect: 'Allow'
          },
          {
            Action: ['s3:get*', 's3:list*'],
            Resource: '*',
            Effect: 'Allow'
          }]
      },
      title: 'NotificationLambdaExecutionRolePolicy'
    }
  }];

  expect(results).to.deep.equal(expected);
});

it('Should successfully call processRoleAuthorizationStatements', async () => {
  // Get the local managed policies

  let policy = {
    assumeRolePolicyDocument:
    {
      Version: '2012-10-17',
      Statement:
        [{
          Effect: 'Allow',
          Principal: { Service: 'lambda.amazonaws.com' },
          Action: 'sts:AssumeRole'
        }]
    },
    rolePolicyList:
      [{
        policyName: 'NotificationLambdaExecutionRolePolicy',
        policyDocument:
        {
          Version: '2012-10-17',
          Statement:
            [{
              Action:
                ['logs:CreateLogGroup',
                  'logs:CreateLogStream',
                  'logs:PutLogEvents'],
              Resource: 'arn:aws:logs:*',
              Effect: 'Allow'
            },
            {
              Action:
                ['ec2:CreateNetworkInterface',
                  'ec2:DescribeNetworkInterfaces',
                  'ec2:DeleteNetworkInterface'],
              Resource: '*',
              Effect: 'Allow'
            },
            { Action: ['sns:Subscribe'], Resource: '*', Effect: 'Allow' },
            {
              Action: ['ses:SendEmail', 'ses:SendRawEmail'],
              Resource: '*',
              Effect: 'Allow'
            },
            {
              Action: ['lambda:InvokeFunction'],
              Resource: '*',
              Effect: 'Allow'
            },
            {
              Action: ['s3:get*', 's3:list*'],
              Resource: '*',
              Effect: 'Allow'
            }]
        }
      }],
    attachedManagedPolicies: [],
    instanceProfileList: [],
    arn: 'arn:aws:iam::XXXXXXXXXXXX:role/twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9',
    roleName: 'twobytwo-sns-NotificationLambdaExecutionRole-1P17QC9RH3CI9',
    policyId: 'ROA5XIWUT3PVCR7UJYF'
  };

  const roleAccountAuthorizationDetails = new RoleAccountAuthorizationDetails(DataClientMock);
  const results = await roleAccountAuthorizationDetails.processRoleAuthorizationStatements("XXXXXXXXXXXX", "global", {
    Version: '2012-10-17',
    Statement:
      [{
        Action:
          ['logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents'],
        Resource: 'arn:aws:logs:*',
        Effect: 'Allow'
      },
      {
        Action:
          ['ec2:CreateNetworkInterface',
            'ec2:DescribeNetworkInterfaces',
            'ec2:DeleteNetworkInterface'],
        Resource: '*',
        Effect: 'Allow'
      },
      { Action: ['sns:Subscribe'], Resource: '*', Effect: 'Allow' },
      {
        Action: ['ses:SendEmail', 'ses:SendRawEmail'],
        Resource: '*',
        Effect: 'Allow'
      },
      {
        Action: ['lambda:InvokeFunction'],
        Resource: '*',
        Effect: 'Allow'
      },
      {
        Action: ['s3:get*', 's3:list*'],
        Resource: '*',
        Effect: 'Allow'
      }]
  }, policy);

  let expected = [ { resourceId: 'a856463cbe27fd04ca75f636acda3d06',
  resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
  accountId: 'XXXXXXXXXXXX',
  properties:
   { resourceId: 'a856463cbe27fd04ca75f636acda3d06',
     resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
     accountId: 'XXXXXXXXXXXX',
     awsRegion: 'global',
     resources: 'arn:aws:logs:*',
     actions:
      [ 'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents' ],
     effect: 'Allow',
     statement:
      { Action:
         [ 'logs:CreateLogGroup',
           'logs:CreateLogStream',
           'logs:PutLogEvents' ],
        Resource: 'arn:aws:logs:*',
        Effect: 'Allow' },
     title:
      'Allow-logs:CreateLogGroup,logs:CreateLogStream,logs:PutLogEvents' } },
{ resourceId: '8c907022beed0fe705dd6162c4b23b19',
  resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
  accountId: 'XXXXXXXXXXXX',
  properties:
   { resourceId: '8c907022beed0fe705dd6162c4b23b19',
     resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
     accountId: 'XXXXXXXXXXXX',
     awsRegion: 'global',
     resources: '*',
     actions:
      [ 'ec2:CreateNetworkInterface',
        'ec2:DescribeNetworkInterfaces',
        'ec2:DeleteNetworkInterface' ],
     effect: 'Allow',
     statement:
      { Action:
         [ 'ec2:CreateNetworkInterface',
           'ec2:DescribeNetworkInterfaces',
           'ec2:DeleteNetworkInterface' ],
        Resource: '*',
        Effect: 'Allow' },
     title:
      'Allow-ec2:CreateNetworkInterface,ec2:DescribeNetworkInterfaces,ec2:DeleteNetworkInterface' } },
{ resourceId: '3b9cd7e66d14fd0fcf7d9a3ce045a9c5',
  resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
  accountId: 'XXXXXXXXXXXX',
  properties:
   { resourceId: '3b9cd7e66d14fd0fcf7d9a3ce045a9c5',
     resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
     accountId: 'XXXXXXXXXXXX',
     awsRegion: 'global',
     resources: '*',
     actions: [ 'sns:Subscribe' ],
     effect: 'Allow',
     statement:
      { Action: [ 'sns:Subscribe' ], Resource: '*', Effect: 'Allow' },
     title: 'Allow-sns:Subscribe' } },
{ resourceId: '647404986a7a593127544c2db1817173',
  resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
  accountId: 'XXXXXXXXXXXX',
  properties:
   { resourceId: '647404986a7a593127544c2db1817173',
     resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
     accountId: 'XXXXXXXXXXXX',
     awsRegion: 'global',
     resources: '*',
     actions: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
     effect: 'Allow',
     statement:
      { Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
        Resource: '*',
        Effect: 'Allow' },
     title: 'Allow-ses:SendEmail,ses:SendRawEmail' } },
{ resourceId: 'ea3e3858ee03b4f1c6cc171aa0060c95',
  resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
  accountId: 'XXXXXXXXXXXX',
  properties:
   { resourceId: 'ea3e3858ee03b4f1c6cc171aa0060c95',
     resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
     accountId: 'XXXXXXXXXXXX',
     awsRegion: 'global',
     resources: '*',
     actions: [ 'lambda:InvokeFunction' ],
     effect: 'Allow',
     statement:
      { Action: [ 'lambda:InvokeFunction' ],
        Resource: '*',
        Effect: 'Allow' },
     title: 'Allow-lambda:InvokeFunction' } },
{ resourceId: '64a1c1c857cc7764d28514bdac3291dd',
  resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
  accountId: 'XXXXXXXXXXXX',
  properties:
   { resourceId: '64a1c1c857cc7764d28514bdac3291dd',
     resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
     accountId: 'XXXXXXXXXXXX',
     awsRegion: 'global',
     resources: '*',
     actions: [ 's3:get*', 's3:list*' ],
     effect: 'Allow',
     statement:
      { Action: [ 's3:get*', 's3:list*' ],
        Resource: '*',
        Effect: 'Allow' },
     title: 'Allow-s3:get*,s3:list*' } } ];

  expect(results).to.deep.equal(expected);
});

it('Should successfully call processRoleAuthorizationResources', async () => {
  // Get the local managed policies

  const roleAccountAuthorizationDetails = new RoleAccountAuthorizationDetails(DataClientMock);

  let results = await roleAccountAuthorizationDetails.processRoleAuthorizationResources("XXXXXXXXXXXX", "eu-west-1", "arn:aws:s3:::zoom-api-bucket", ['s3:get*', 's3:list*']);

  let expected = [{
    link: 'f1a0dee0730aded0b22398076478a757',
    resourceType: 'AWS::S3::Bucket'
  }];

  expect(results).to.deep.equal(expected);
});
