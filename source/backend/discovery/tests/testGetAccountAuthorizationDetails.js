const chai = require('chai');
const AccountAuthorizationDetailsMock = require('./mockAwsGetAccountAuthorizationDetails');
const GetAccountAuthorizationDetails = require("../src/discovery/getAccountAuthorizationDetails");
const DataClientMock = require('./mockDataClient');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should successfully call processAuthorization details to retrieve the awsManagedPolicies', async () => {
    const authorizationDetails = new GetAccountAuthorizationDetails(() => { return AccountAuthorizationDetailsMock }, DataClientMock);
    const awsManagedAccountAuthorization = await authorizationDetails.processAuthorizationDetails("AWSManagedPolicy");

    const expected = [{
        resourceId: 'AWSCodeCommitPowerUser',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSCodeCommitPowerUser',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSCodeCommitPowerUser',
            arn: 'arn:aws:iam::aws:policy/AWSCodeCommitPowerUser',
            path: '/',
            defaultVersionId: 'v7',
            attachmentCount: 3,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-06-12T22:47:04Z'
        }
    },
    {
        resourceId: 'AWSCodeCommitFullAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSCodeCommitFullAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSCodeCommitFullAccess',
            arn: 'arn:aws:iam::aws:policy/AWSCodeCommitFullAccess',
            path: '/',
            defaultVersionId: 'v3',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-06-12T21:27:53Z'
        }
    },
    {
        resourceId: 'AutoScalingFullAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AutoScalingFullAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AutoScalingFullAccess',
            arn: 'arn:aws:iam::aws:policy/AutoScalingFullAccess',
            path: '/',
            defaultVersionId: 'v2',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-02-06T21:59:13Z'
        }
    },
    {
        resourceId: 'AutoScalingServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AutoScalingServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AutoScalingServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AutoScalingServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v2',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-10-31T18:19:10Z'
        }
    },
    {
        resourceId: 'ViewOnlyAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'ViewOnlyAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'ViewOnlyAccess',
            arn: 'arn:aws:iam::aws:policy/job-function/ViewOnlyAccess',
            path: '/job-function/',
            defaultVersionId: 'v7',
            attachmentCount: 2,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-10-15T18:34:54Z'
        }
    },
    {
        resourceId: 'AmazonGuardDutyServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonGuardDutyServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonGuardDutyServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AmazonGuardDutyServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v1',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2017-11-28T20:12:59Z'
        }
    },
    {
        resourceId: 'AmazonVPCReadOnlyAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonVPCReadOnlyAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonVPCReadOnlyAccess',
            arn: 'arn:aws:iam::aws:policy/AmazonVPCReadOnlyAccess',
            path: '/',
            defaultVersionId: 'v6',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-03-07T18:34:42Z'
        }
    },
    {
        resourceId: 'AWSElasticLoadBalancingServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSElasticLoadBalancingServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSElasticLoadBalancingServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AWSElasticLoadBalancingServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v3',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-03-18T21:51:14Z'
        }
    },
    {
        resourceId: 'AWSCodeDeployFullAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSCodeDeployFullAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSCodeDeployFullAccess',
            arn: 'arn:aws:iam::aws:policy/AWSCodeDeployFullAccess',
            path: '/',
            defaultVersionId: 'v1',
            attachmentCount: 3,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2015-05-19T18:13:23Z'
        }
    },
    {
        resourceId: 'AmazonRDSServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonRDSServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonRDSServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AmazonRDSServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v6',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-04-16T20:12:27Z'
        }
    },
    {
        resourceId: 'IsengardControllerPolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'IsengardControllerPolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'IsengardControllerPolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/IsengardControllerPolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v4',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: false,
            createdDate: undefined,
            updateDate: '2018-12-19T16:58:28Z'
        }
    },
    {
        resourceId: 'AmazonEC2ContainerServiceEventsRole',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonEC2ContainerServiceEventsRole',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonEC2ContainerServiceEventsRole',
            arn: 'arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceEventsRole',
            path: '/service-role/',
            defaultVersionId: 'v2',
            attachmentCount: 2,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-05-22T19:13:11Z'
        }
    },
    {
        resourceId: 'AmazonEC2ContainerServiceAutoscaleRole',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonEC2ContainerServiceAutoscaleRole',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonEC2ContainerServiceAutoscaleRole',
            arn: 'arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceAutoscaleRole',
            path: '/service-role/',
            defaultVersionId: 'v2',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-02-05T19:15:15Z'
        }
    },
    {
        resourceId: 'AmazonECSServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonECSServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonECSServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AmazonECSServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v6',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-06-24T23:16:41Z'
        }
    },
    {
        resourceId: 'AdministratorAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AdministratorAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AdministratorAccess',
            arn: 'arn:aws:iam::aws:policy/AdministratorAccess',
            path: '/',
            defaultVersionId: 'v1',
            attachmentCount: 7,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2015-02-06T18:39:46Z'
        }
    },
    {
        resourceId: 'SecurityAudit',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'SecurityAudit',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'SecurityAudit',
            arn: 'arn:aws:iam::aws:policy/SecurityAudit',
            path: '/',
            defaultVersionId: 'v29',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-07-18T20:16:48Z'
        }
    },
    {
        resourceId: 'AWSCodeDeployRole',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSCodeDeployRole',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSCodeDeployRole',
            arn: 'arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole',
            path: '/service-role/',
            defaultVersionId: 'v6',
            attachmentCount: 3,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2017-09-11T19:09:51Z'
        }
    },
    {
        resourceId: 'IAMUserChangePassword',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'IAMUserChangePassword',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'IAMUserChangePassword',
            arn: 'arn:aws:iam::aws:policy/IAMUserChangePassword',
            path: '/',
            defaultVersionId: 'v2',
            attachmentCount: 5,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2016-11-15T23:18:55Z'
        }
    },
    {
        resourceId: 'AmazonAPIGatewayAdministrator',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonAPIGatewayAdministrator',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonAPIGatewayAdministrator',
            arn: 'arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator',
            path: '/',
            defaultVersionId: 'v1',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2015-07-09T17:34:45Z'
        }
    },
    {
        resourceId: 'AmazonECS_FullAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonECS_FullAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonECS_FullAccess',
            arn: 'arn:aws:iam::aws:policy/AmazonECS_FullAccess',
            path: '/',
            defaultVersionId: 'v16',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-06-20T17:53:43Z'
        }
    },
    {
        resourceId: 'AWSSupportServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSSupportServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSSupportServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AWSSupportServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v5',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: false,
            createdDate: undefined,
            updateDate: '2019-07-23T22:01:08Z'
        }
    },
    {
        resourceId: 'AmazonElasticsearchServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonElasticsearchServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonElasticsearchServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AmazonElasticsearchServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v2',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-02-08T21:38:27Z'
        }
    },
    {
        resourceId: 'AWSApplicationAutoscalingECSServicePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSApplicationAutoscalingECSServicePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSApplicationAutoscalingECSServicePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AWSApplicationAutoscalingECSServicePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v1',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2017-10-25T23:53:08Z'
        }
    },
    {
        resourceId: 'AmazonECSTaskExecutionRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonECSTaskExecutionRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonECSTaskExecutionRolePolicy',
            arn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
            path: '/service-role/',
            defaultVersionId: 'v1',
            attachmentCount: 2,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2017-11-16T18:48:22Z'
        }
    },
    {
        resourceId: 'AWSTrustedAdvisorServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSTrustedAdvisorServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSTrustedAdvisorServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AWSTrustedAdvisorServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v6',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-06-12T21:21:39Z'
        }
    },
    {
        resourceId: 'AmazonRDSReadOnlyAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AmazonRDSReadOnlyAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AmazonRDSReadOnlyAccess',
            arn: 'arn:aws:iam::aws:policy/AmazonRDSReadOnlyAccess',
            path: '/',
            defaultVersionId: 'v3',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2017-08-28T21:36:32Z'
        }
    },
    {
        resourceId: 'AWSLambdaReadOnlyAccess',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSLambdaReadOnlyAccess',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSLambdaReadOnlyAccess',
            arn: 'arn:aws:iam::aws:policy/AWSLambdaReadOnlyAccess',
            path: '/',
            defaultVersionId: 'v8',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-09-06T18:04:54Z'
        }
    },
    {
        resourceId: 'ElasticLoadBalancingReadOnly',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'ElasticLoadBalancingReadOnly',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'ElasticLoadBalancingReadOnly',
            arn: 'arn:aws:iam::aws:policy/ElasticLoadBalancingReadOnly',
            path: '/',
            defaultVersionId: 'v1',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2018-09-20T20:17:09Z'
        }
    },
    {
        resourceId: 'AWSLambdaBasicExecutionRole',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSLambdaBasicExecutionRole',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSLambdaBasicExecutionRole',
            arn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            path: '/service-role/',
            defaultVersionId: 'v1',
            attachmentCount: 3,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2015-04-09T15:03:43Z'
        }
    },
    {
        resourceId: 'AWSConfigServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSConfigServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSConfigServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/AWSConfigServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v15',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-08-01T23:10:02Z'
        }
    },
    {
        resourceId: 'AWSLambdaVPCAccessExecutionRole',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSLambdaVPCAccessExecutionRole',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSLambdaVPCAccessExecutionRole',
            arn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
            path: '/service-role/',
            defaultVersionId: 'v1',
            attachmentCount: 3,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2016-02-11T23:15:26Z'
        }
    },
    {
        resourceId: 'AWSLambdaRole',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'AWSLambdaRole',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'AWSLambdaRole',
            arn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaRole',
            path: '/service-role/',
            defaultVersionId: 'v1',
            attachmentCount: 3,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2015-02-06T18:41:28Z'
        }
    },
    {
        resourceId: 'ServiceQuotasServiceRolePolicy',
        resourceType: 'AWS::IAM::AWSManagedPolicy',
        properties:
        {
            resourceId: 'ServiceQuotasServiceRolePolicy',
            resourceType: 'AWS::IAM::AWSManagedPolicy',
            title: 'ServiceQuotasServiceRolePolicy',
            arn: 'arn:aws:iam::aws:policy/aws-service-role/ServiceQuotasServiceRolePolicy',
            path: '/aws-service-role/',
            defaultVersionId: 'v2',
            attachmentCount: 1,
            permissionsBoundaryUsageCount: 0,
            isAttachable: true,
            createdDate: undefined,
            updateDate: '2019-06-24T14:52:56Z'
        }
    }];

    expect(awsManagedAccountAuthorization).to.deep.equal(expected);
});