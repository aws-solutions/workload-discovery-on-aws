const zoomTestUtils = require('./zoomTestUtils');

const listClusters = (_parameters) => {
    const response = {
        clusterArns:
            ['arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster',
                'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/zoom-discovery-cluster']
    };
    return zoomTestUtils.createResponse(response, undefined);
};

const describeClusters = (_parameters) => {
    const response = {
        clusters:
            [{
                clusterArn:
                    'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster',
                clusterName: 'ecs-test-cluster',
                status: 'ACTIVE',
                registeredContainerInstancesCount: 2,
                runningTasksCount: 2,
                pendingTasksCount: 0,
                activeServicesCount: 1,
                statistics: [],
                tags: []
            },
            {
                clusterArn:
                    'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/zoom-discovery-cluster',
                clusterName: 'zoom-discovery-cluster',
                status: 'ACTIVE',
                registeredContainerInstancesCount: 0,
                runningTasksCount: 0,
                pendingTasksCount: 0,
                activeServicesCount: 0,
                statistics: [],
                tags: []
            }],
        failures: []
    };
    return zoomTestUtils.createResponse(response, undefined);
};

const listServices = (_parameters) => {
    const response = { serviceArns: ['arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:service/Nginx-test'] }
    return zoomTestUtils.createResponse(response, undefined);
};

const describeServices = (_parameters) => {
    const response = {
        services:
            [{
                serviceArn: 'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:service/Nginx-test',
                serviceName: 'Nginx-test',
                clusterArn:
                    'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:cluster/ecs-test-cluster',
                loadBalancers: [],
                serviceRegistries:
                    [{
                        registryArn:
                            'arn:aws:servicediscovery:eu-west-1:XXXXXXXXXXXX:service/srv-y4ywr3arkq6lqms4',
                        containerName: 'Nginx',
                        containerPort: 80
                    }],
                status: 'ACTIVE',
                desiredCount: 2,
                runningCount: 2,
                pendingCount: 0,
                launchType: 'EC2',
                taskDefinition:
                    'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:task-definition/Zoom-discovery-test:1',
                deploymentConfiguration: { maximumPercent: 200, minimumHealthyPercent: 100 },
                deployments:
                    [{
                        id: 'ecs-svc/9223370469941626512',
                        status: 'PRIMARY',
                        taskDefinition:
                            'arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:task-definition/Zoom-discovery-test:1',
                        desiredCount: 2,
                        pendingCount: 0,
                        runningCount: 2,
                        createdAt: '2019 - 08 - 27T13: 39: 09.295Z',
                        updatedAt: '2019 - 08 - 27T13: 39: 58.977Z',
                        launchType: 'EC2'
                    }],
                roleArn:
                    'arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS',
                events:
                    [],
                createdAt: '2019 - 08 - 27T13: 39: 09.295Z',
                placementConstraints: [],
                placementStrategy:
                    [{ type: 'spread', field: 'attribute:ecs.availability-zone' },
                    { type: 'spread', field: 'instanceId' }],
                schedulingStrategy: 'REPLICA',
                enableECSManagedTags: false,
                propagateTags: 'NONE'
            }],
        failures: []
    };

    return zoomTestUtils.createResponse(response, undefined);
}

const listContainerInstances = (_parameters) => {
    const response = {
        "containerInstanceArns": [
            "arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:container-instance/969fe12b-2418-45e7-b744-c42ed99a7804",
            "arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:container-instance/c87a89bb-4c0c-41bc-9d52-eeea6442b62f"
        ]
    };

    return zoomTestUtils.createResponse(response, undefined);
};

const describeContainerInstances = (_parameters) => {
    const response = {
        "containerInstances": [
            {
                "containerInstanceArn": "arn:aws:ecs:eu-west-1:XXXXXXXXXXXX:container-instance/969fe12b-2418-45e7-b744-c42ed99a7804",
                "ec2InstanceId": "i-0394ef01caae786d8",
                "version": 134,
                "versionInfo": {
                    "agentVersion": "1.30.0",
                    "agentHash": "02ff320c",
                    "dockerVersion": "DockerVersion: 18.06.1-ce"
                },
                "remainingResources": [
                    {
                        "name": "CPU",
                        "type": "INTEGER",
                        "doubleValue": 0.0,
                        "longValue": 0,
                        "integerValue": 1023
                    },
                    {
                        "name": "MEMORY",
                        "type": "INTEGER",
                        "doubleValue": 0.0,
                        "longValue": 0,
                        "integerValue": 6701
                    },
                    {
                        "name": "PORTS",
                        "type": "STRINGSET",
                        "doubleValue": 0.0,
                        "longValue": 0,
                        "integerValue": 0,
                        "stringSetValue": [
                            "22",
                            "2376",
                            "2375",
                            "80",
                            "51678",
                            "51679"
                        ]
                    },
                    {
                        "name": "PORTS_UDP",
                        "type": "STRINGSET",
                        "doubleValue": 0.0,
                        "longValue": 0,
                        "integerValue": 0,
                        "stringSetValue": []
                    }
                ],
                "registeredResources": [
                    {
                        "name": "CPU",
                        "type": "INTEGER",
                        "doubleValue": 0.0,
                        "longValue": 0,
                        "integerValue": 2048
                    },
                    {
                        "name": "MEMORY",
                        "type": "INTEGER",
                        "doubleValue": 0.0,
                        "longValue": 0,
                        "integerValue": 7725
                    },
                    {
                        "name": "PORTS",
                        "type": "STRINGSET",
                        "doubleValue": 0.0,
                        "longValue": 0,
                        "integerValue": 0,
                        "stringSetValue": [
                            "22",
                            "2376",
                            "2375",
                            "51678",
                            "51679"
                        ]
                    },
                    {
                        "name": "PORTS_UDP",
                        "type": "STRINGSET",
                        "doubleValue": 0.0,
                        "longValue": 0,
                        "integerValue": 0,
                        "stringSetValue": []
                    }
                ],
                "status": "ACTIVE",
                "agentConnected": true,
                "runningTasksCount": 1,
                "pendingTasksCount": 0,
                "attributes": [
                    {
                        "name": "ecs.capability.secrets.asm.environment-variables"
                    },
                    {
                        "name": "ecs.capability.branch-cni-plugin-version",
                        "value": "cdd89b92-"
                    },
                    {
                        "name": "ecs.ami-id",
                        "value": "ami-02bf9e90a6e30dc74"
                    },
                    {
                        "name": "ecs.capability.secrets.asm.bootstrap.log-driver"
                    },
                    {
                        "name": "ecs.capability.task-eia.optimized-cpu"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.logging-driver.none"
                    },
                    {
                        "name": "ecs.capability.ecr-endpoint"
                    },
                    {
                        "name": "ecs.capability.docker-plugin.local"
                    },
                    {
                        "name": "ecs.capability.task-cpu-mem-limit"
                    },
                    {
                        "name": "ecs.capability.secrets.ssm.bootstrap.log-driver"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.30"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.31"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.32"
                    },
                    {
                        "name": "ecs.availability-zone",
                        "value": "eu-west-1b"
                    },
                    {
                        "name": "ecs.capability.aws-appmesh"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.logging-driver.awslogs"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.24"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.25"
                    },
                    {
                        "name": "ecs.capability.task-eni-trunking"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.26"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.27"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.28"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.privileged-container"
                    },
                    {
                        "name": "ecs.cpu-architecture",
                        "value": "x86_64"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.29"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.ecr-auth"
                    },
                    {
                        "name": "ecs.capability.firelens.fluentbit"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.20"
                    },
                    {
                        "name": "ecs.os-type",
                        "value": "linux"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.21"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.22"
                    },
                    {
                        "name": "ecs.capability.private-registry-authentication.secretsmanager"
                    },
                    {
                        "name": "ecs.capability.task-eia"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.23"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.logging-driver.syslog"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.logging-driver.awsfirelens"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.logging-driver.json-file"
                    },
                    {
                        "name": "ecs.capability.execution-role-awslogs"
                    },
                    {
                        "name": "ecs.vpc-id",
                        "value": "vpc-0ca0621e6beedf8d7"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.17"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.18"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.docker-remote-api.1.19"
                    },
                    {
                        "name": "ecs.capability.task-eni"
                    },
                    {
                        "name": "ecs.capability.firelens.fluentd"
                    },
                    {
                        "name": "ecs.capability.execution-role-ecr-pull"
                    },
                    {
                        "name": "ecs.capability.container-health-check"
                    },
                    {
                        "name": "ecs.subnet-id",
                        "value": "subnet-00a29deb6dc36de8b"
                    },
                    {
                        "name": "ecs.instance-type",
                        "value": "m5a.large"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.task-iam-role-network-host"
                    },
                    {
                        "name": "ecs.capability.container-ordering"
                    },
                    {
                        "name": "ecs.capability.cni-plugin-version",
                        "value": "91ccefc8-2019.06.0"
                    },
                    {
                        "name": "ecs.capability.pid-ipc-namespace-sharing"
                    },
                    {
                        "name": "ecs.capability.secrets.ssm.environment-variables"
                    },
                    {
                        "name": "com.amazonaws.ecs.capability.task-iam-role"
                    }
                ],
                "registeredAt": 1566912753.229,
                "attachments": [],
                "tags": []
            }
        ],
        "failures": []
    };
    return zoomTestUtils.createResponse(response, undefined);
};

const listTasks = (_parameters) => {
    return zoomTestUtils.createResponse(undefined, undefined);
};

module.exports = {
    listClusters: listClusters,
    describeClusters: describeClusters,
    listContainerInstances: listContainerInstances,
    listServices: listServices,
    describeServices, describeServices,
    describeContainerInstances: describeContainerInstances,
}