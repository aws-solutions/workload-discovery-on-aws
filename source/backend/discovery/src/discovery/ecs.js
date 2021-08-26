const R = require('ramda');
const consoleM = require('./consoleURL');
const logger = require('./logger')
const zoomUtils = require('./zoomUtils');
const gremlinQueries = require('./commonGremlinQueries');

class ECS {

    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        logger.info('Beginning ECS discovery process.');
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
            await this.processECSClusters(accountId, awsRegion),
            [await this.processECSServices, await this.packageLinkedEC2],
            [await this.processECSTasks, await this.processNetwork, await this.processLoadBalancers],
            await this.processTaskDefinition,
            await this.processTaskRole
        );

        await this.dataClient.storeData("AWS::ECS::Cluster", dataToUpload, 0);
        logger.info('ECS discovery process complete.');
    }

    async processECSClusters(accountId, awsRegion) {
        const ecsClusters = await zoomUtils.callAwsApi(this.API.listClusters, {}, this.API, "ECS listClusters");

        if (ecsClusters.clusterArns && ecsClusters.clusterArns.length > 0) {
            const detailedECS = await zoomUtils.callAwsApi(this.API.describeClusters, { clusters: ecsClusters.clusterArns }, this.API, "ECS describeClusters");

            return await this.packageECSClusters(detailedECS, accountId, awsRegion);
        }

        return [];
    }

    async packageECSClusters(ecsClusters, accountId, awsRegion) {
        return ecsClusters.clusters.map(ecsCluster => {
            let data = {
                resourceId: ecsCluster.clusterArn,
                resourceType: "AWS::ECS::Cluster",
                accountId: accountId
            }

            let properties = {
                resourceId: ecsCluster.clusterArn,
                resourceType: "AWS::ECS::Cluster",
                accountId: accountId,
                awsRegion: awsRegion,
                title: ecsCluster.clusterName,
                clusterName: ecsCluster.clusterName,
                state: ecsCluster.status,
                registeredContainerInstancesCount: ecsCluster.registeredContainerInstancesCount,
                runningTasksCount: ecsCluster.runningTasksCount,
                pendingTasksCount: ecsCluster.pendingTasksCount,
                arn: ecsCluster.clusterArn,
                statistics: JSON.stringify(ecsCluster.statistics),
                tags: ecsCluster.tags
            };

            data.properties = properties;
            this.appendConsoleURL(data);
            //generateHeader.generateHeader(data);

            return data;
        });
    }

    async processLoadBalancer(accountId, awsRegion, loadBalancer) {
        let resource = await this.getloadBalancer(loadBalancer, accountId, awsRegion);

        let lbLinkType = "AWS::ElasticLoadBalancingV2::TargetGroup";

        if (loadBalancer.loadBalancerName) {
            lbLinkType = "AWS::ElasticLoadBalancing::LoadBalancer";
        }

        if (resource.success && resource.results.length > 0) {
            return {
                link: resource.results[0].id,
                resourceType: lbLinkType
            }
        }
    }

    processSubnet(accountId, awsRegion) {
        return async (subnet) => {
            let resource = await this.getNetworkSubnet(subnet, accountId, awsRegion);
            if (resource.success && resource.results.length > 0) {
                return {
                    link: resource.results[0].id,
                    resourceType: "AWS::EC2::Subnet"
                }
            }
        }
    }

    processSecurityGroup(accountId, awsRegion) {
        return async (securityGroup) => {
            let resource = await this.getSecurityGroup(securityGroup, accountId, awsRegion);

            if (resource.success && resource.results.length > 0) {
                return {
                    link: resource.results[0].id,
                    resourceType: "AWS::EC2::SecurityGroup"
                }
            }
        }
    }

    async processLoadBalancers(accountId, awsRegion, loadBalancers) {
        if (loadBalancers) {
            const lbs = JSON.parse(loadBalancers);

            return await Promise.all(lbs.map(loadBalancer => {
                return this.processLoadBalancer(accountId, awsRegion, loadBalancer);
            }));
        }
    }

    async processNetwork(accountId, awsRegion, networkConfiguration) {
        let children = [];

        if (networkConfiguration) {
            const network = JSON.parse(networkConfiguration);

            if (network.awsvpcConfiguration) {
                let callBack = this.processSubnet(accountId, awsRegion);
                children.push(await zoomUtils.asyncMap(network.awsvpcConfiguration.subnets, callBack));

                callBack = this.processSecurityGroup(accountId, awsRegion);
                children.push(await zoomUtils.asyncMap(network.awsvpcConfiguration.securityGroups, callBack));
            }
        }

        return children;
    }

    async getNetworkSubnet(subnet, accountId, awsRegion) {
        const query = {
            "command": "filterNodes",
            "data": {
                "resourceType": "AWS::EC2::Subnet",
                "awsRegion": awsRegion,
                "accountId": "" + accountId,
                "resourceId": subnet
            }
        };

        return await this.dataClient.queryGremlin(query)
    }

    async getloadBalancer(loadBalancer, accountId, awsRegion) {
        const query = {
            "command": "filterNodes",
            "data": {
                "awsRegion": awsRegion,
                "accountId": "" + accountId,

            }
        };

        let runQuery;

        if (loadBalancer.targetGroupArn) {
            query.data.arn = loadBalancer.targetGroupArn;
            runQuery = true;
        }
        else if (loadBalancer.loadBalancerName) {
            query.data.resourceId = loadBalancer.loadBalancerName;
            runQuery = true;
        }

        logger.info("ELB link query = ");
        logger.info(query);

        return runQuery ? await this.dataClient.queryGremlin(query) : [];
    }

    async getSecurityGroup(securityGroup, accountId, awsRegion) {
        const query = {
            "command": "filterNodes",
            "data": {
                "resourceType": "AWS::EC2::SecurityGroup",
                "awsRegion": awsRegion,
                "accountId": "" + accountId,
                "resourceId": securityGroup
            }
        };

        return await this.dataClient.queryGremlin(query);
    }

    async processECSServices(arn, accountId, awsRegion) {
        const ecsServices = await zoomUtils.callAwsApi(this.API.listServices, { cluster: arn }, this.API, "ECS listServices");

        if (ecsServices.serviceArns && ecsServices.serviceArns.length > 0) {
            const detailedServices = await this.getServiceDetails(ecsServices.serviceArns, arn);
            return await this.packageECSServices(detailedServices, accountId, awsRegion);
        }

        return [];
    }

    async getServiceDetails(serviceARNs, clusterArn) {
        try {
            var params = {
                services: serviceARNs,
                cluster: clusterArn,
            };

            return await this.API.describeServices(params).promise();
        }
        catch (error) {
            zoomUtils.dumpError(error);
        }
    }

    async packageECSServices(ecsServices, accountId, awsRegion) {
        return ecsServices.services.map(ecsService => {
            let data = {
                resourceId: ecsService.serviceArn,
                resourceType: "AWS::ECS::Service",
                accountId: accountId
            }

            let properties = {
                resourceId: ecsService.serviceArn,
                resourceType: "AWS::ECS::Service",
                accountId: accountId,
                awsRegion: awsRegion,
                title: ecsService.serviceName,
                serviceName: ecsService.serviceName,
                clusterARN: ecsService.clusterArn,
                loadBalancers: JSON.stringify(ecsService.loadBalancers),
                serviceRegistries: JSON.stringify(ecsService.serviceRegistries),
                state: ecsService.status,
                desiredCount: ecsService.desiredCount,
                runningCount: ecsService.runningCount,
                pendingCount: ecsService.pendingCount,
                launchType: ecsService.launchType,
                platformVersion: ecsService.platformVersion,
                taskDefinition: ecsService.taskDefinition,
                deploymentConfiguration: ecsService.deploymentConfiguration,
                deployment: ecsService.deployment,
                roleARN: ecsService.role,
                events: JSON.stringify(ecsService.events),
                createdAt: ecsService.createdAt,
                placementConstraints: JSON.stringify(ecsService.placementConstraints),
                placementStrategy: JSON.stringify(ecsService.placementStrategy),
                networkConfiguration: JSON.stringify(ecsService.networkConfiguration),
                schedulingStrategy: JSON.stringify(ecsService.schedulingStrategy),
                enableECSManagedTags: ecsService.enableECSManagedTags,
                propagateTags: ecsService.propagateTags,
                arn: ecsService.serviceArn
            };

            data.properties = properties;
            this.appendConsoleURL(data);
            //generateHeader.generateHeader(data);

            return data;
        });
    }

    async packageLinkedEC2(arn, accountId, awsRegion) {
        let containerInstances = await zoomUtils.callAwsApi(this.API.listContainerInstances, { cluster: arn }, this.API, "ECS listContainerInstances");

        if (containerInstances && containerInstances.containerInstanceArns.length > 0) {
            let containerDescriptions = await zoomUtils.callAwsApi(this.API.describeContainerInstances,
                {
                    cluster: arn,
                    containerInstances: containerInstances.containerInstanceArns
                }, this.API, "ECS describeContainerInstances");

            let packageInstances = await this.packageInstances(containerDescriptions);
            return packageInstances;
        }

        return [];
    }

    async packageInstances(containerDescriptions) {
        let linkedInstances = [];
        for (let instance of containerDescriptions.containerInstances) {
            let linkedInstance = await gremlinQueries.getEC2Instance(instance.ec2InstanceId, this.dataClient);

            linkedInstances.push({
                link: linkedInstance.results[0].id,
                resourceType: "AWS::EC2::Instance"
            });
        }

        return linkedInstances;
    }

    async processECSTasks(taskDefinition, serviceName, clusterARN, accountId, awsRegion) {
        const ecsTasks = await zoomUtils.callAwsApi(this.API.listTasks, { cluster: clusterARN, serviceName: serviceName }, this.API, "ECS listTasks");

        const taskIds = ecsTasks.taskArns.map(R.compose(R.last, R.split("/")));

        if (!R.isEmpty(taskIds)) {

            const populatedTaskDescriptions = await zoomUtils.callAwsApi(this.API.describeTasks, {
                tasks: taskIds,
                cluster: clusterARN
            }, this.API, 'describeTasks');

            return this.packageTaskDescriptions(R.defaultTo([], populatedTaskDescriptions), accountId, awsRegion);
        }

        return [];
    }

    async packageTaskDescriptions(taskDescriptions, accountId, awsRegion) {
        return taskDescriptions.tasks.map(task => {
            let data = {
                resourceId: task.taskArn,
                resourceType: "AWS::ECS::Task",
                accountId: accountId
            }

            let properties = {
                resourceId: task.taskArn,
                resourceType: "AWS::ECS::Task",
                accountId: accountId,
                awsRegion: awsRegion,
                clusterARN: task.clusterArn,
                taskDefinitionARN: task.taskDefinitionArn,
                overrides: JSON.stringify(task.overrides),
                state: task.lastStatus,
                desiredStatus: task.desiredStatus,
                cpu: task.cpu,
                memory: task.memory,
                containers: JSON.stringify(task.memory),
                startedBy: task.startedBy,
                version: task.version,
                connectivity: task.connectivity,
                connectivityAt: task.connectivityAt,
                pullStartedAt: task.pullStartedAt,
                pullStoppedAt: task.pullStoppedAt,
                createdAt: task.createdAt,
                startedAt: task.startedAt,
                group: task.group,
                title: task.group,
                launchType: task.launchType,
                platformVersion: task.platformVersion,
                attachments: JSON.stringify(task.attachments),
                healthStatus: task.healthStatus,
                arn: task.taskArn
            };

            data.properties = properties;
            this.appendConsoleURL(data);
            //generateHeader.generateHeader(data);

            return data;
        });
    }

    async processTaskDefinition(taskDefinitionARN, accountId, awsRegion) {
        const taskDefinition = await zoomUtils.callAwsApi(this.API.describeTaskDefinition, { taskDefinition: taskDefinitionARN }, this.API, "ECS describeTaskDefinition");
        return [await this.packageTaskDefinition(taskDefinition, accountId, awsRegion)];
    }

    async packageTaskDefinition(taskDefinition, accountId, awsRegion) {
        let task = taskDefinition.taskDefinition;

        let data = {
            resourceId: task.taskDefinitionArn,
            resourceType: "AWS::ECS::TaskDefinition",
            accountId: accountId
        }

        let properties = {
            resourceId: task.taskDefinitionArn,
            resourceType: "AWS::ECS::TaskDefinition",
            accountId: accountId,
            awsRegion: awsRegion,
            title: task.taskDefinitionArn,
            containerDefinitions: JSON.stringify(task.containerDefinitions),
            family: task.family,
            executionRoleARN: task.executionRoleArn,
            networkMode: task.networkMode,
            revision: task.revision,
            volumes: task.volumes,
            state: task.status,
            requiresAttributes: JSON.stringify(task.requiresAttributes),
            placementConstraints: JSON.stringify(task.placementConstraints),
            compatibilities: JSON.stringify(task.compatibilities),
            requiresCompatibilities: JSON.stringify(task.requiresCompatibilities),
            cpu: task.cpu,
            memory: task.memory
        };

        data.properties = properties;
        this.appendConsoleURL(data);

        return data;
    }

    async processTaskRole(executionRoleARN, awsRegion, accountId) {
        let role = await this.getTaskRole(executionRoleARN, awsRegion, accountId);

        if (role.success && role.results.length > 0) {
            return [{
                link: role.results[0].id,
                resourceType: "AWS::IAM::Role"
            }]
        }
    }

    async getTaskRole(executionRoleARN, awsRegion, accountId) {
        const query = {
            "command": "filterNodes",
            "data": {
                "resourceType": "AWS::IAM::Role",
                "accountId": "" + accountId,
                "arn": executionRoleARN
            }
        };

        return await this.dataClient.queryGremlin(query)
    }

    appendConsoleURL(data) {
        // Create the URLS to the console
        let { loginURL, loggedInURL } = consoleM.getConsoleURLs(data);
        data.properties.loginURL = loginURL;
        data.properties.loggedInURL = loggedInURL;
    }
}

module.exports = ECS;