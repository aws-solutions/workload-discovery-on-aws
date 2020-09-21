const chai = require('chai');
const ECS = require('../src/discovery/ecs');
const mockAwsEcsApi = require('./mockAwsECS');
const DataClientMock = require('./mockDataClient');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should correctly call processECSClusters', async () => {
    const ecs = new ECS(() => { return mockAwsEcsApi }, undefined);
    const processedECS = await ecs.processECSClusters("XXXXXXXXXXXX", "eu-west-1");

    let expected = [{
        resourceId: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster',
        resourceType: 'AWS::ECS::Cluster',
        accountId: 'XXXXXXXXXXXX',
        properties:
        {
            resourceId: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster',
            resourceType: 'AWS::ECS::Cluster',
            accountId: 'XXXXXXXXXXXX',
            awsRegion: 'eu-west-1',
            title: 'ecs-test-cluster',
            clusterName: 'ecs-test-cluster',
            state: 'ACTIVE',
            registeredContainerInstancesCount: 2,
            runningTasksCount: 2,
            pendingTasksCount: 0,
            arn: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster',
            statistics: '[]',
            tags: [],
            loginURL: undefined,
            loggedInURL: undefined
        }
    },
    {
        resourceId: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/zoom-discovery-cluster',
        resourceType: 'AWS::ECS::Cluster',
        accountId: 'XXXXXXXXXXXX',
        properties:
        {
            resourceId: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/zoom-discovery-cluster',
            resourceType: 'AWS::ECS::Cluster',
            accountId: 'XXXXXXXXXXXX',
            awsRegion: 'eu-west-1',
            title: 'zoom-discovery-cluster',
            clusterName: 'zoom-discovery-cluster',
            state: 'ACTIVE',
            registeredContainerInstancesCount: 0,
            runningTasksCount: 0,
            pendingTasksCount: 0,
            arn: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/zoom-discovery-cluster',
            statistics: '[]',
            tags: [],
            loginURL: undefined,
            loggedInURL: undefined
        }
    }];

    expect(processedECS).to.deep.equal(expected);
});

it('Should correctly call processECSServices', async () => {
    const ecs = new ECS(() => { return mockAwsEcsApi }, undefined);
    const processedServices = await ecs.processECSServices("arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster", "XXXXXXXXXXXX", "eu-west-1");

    let expected = [{
        resourceId: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:service/Nginx-test',
        resourceType: 'AWS::ECS::Service',
        accountId: 'XXXXXXXXXXXX',
        properties:
        {
            resourceId: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:service/Nginx-test',
            resourceType: 'AWS::ECS::Service',
            accountId: 'XXXXXXXXXXXX',
            awsRegion: 'eu-west-1',
            title: 'Nginx-test',
            serviceName: 'Nginx-test',
            clusterARN: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster',
            loadBalancers: '[]',
            serviceRegistries: '[{"registryArn":"arn:aws:servicediscovery:eu-west-1:XXXXXXXXXXXX:service/srv-y4ywr3arkq6lqms4","containerName":"Nginx","containerPort":80}]',
            state: 'ACTIVE',
            desiredCount: 2,
            runningCount: 2,
            pendingCount: 0,
            launchType: 'EC2',
            platformVersion: undefined,
            taskDefinition: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:task-definition/Zoom-discovery-test:1',
            deploymentConfiguration: { maximumPercent: 200, minimumHealthyPercent: 100 },
            deployment: undefined,
            roleARN: undefined,
            events: '[]',
            createdAt: '2019 - 08 - 27T13: 39: 09.295Z',
            placementConstraints: '[]',
            placementStrategy: '[{"type":"spread","field":"attribute:ecs.availability-zone"},{"type":"spread","field":"instanceId"}]',
            networkConfiguration: undefined,
            schedulingStrategy: '"REPLICA"',
            enableECSManagedTags: false,
            propagateTags: 'NONE',
            arn: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:service/Nginx-test',
            loginURL: undefined,
            loggedInURL: undefined
        }
    }];

    expect(processedServices).to.deep.equal(expected);
});

it('Should correctly call packagedLinkedEC2', async () => {
    const ecs = new ECS(() => { return mockAwsEcsApi }, DataClientMock);
    const linkedEC2 = await ecs.packageLinkedEC2("arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster", "XXXXXXXXXXXX", "eu-west-1");

    const expected = [{
        link: '09d825f5087fb1d5009e7c32dfa290a4',
        resourceType: 'AWS::EC2::Instance'
    }];

    expect(linkedEC2).to.deep.equal(expected);
});