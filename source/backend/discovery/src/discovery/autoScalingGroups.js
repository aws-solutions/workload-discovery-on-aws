const zoomUtils = require('./zoomUtils');
const logger = require('./logger');

class AutoScalingGroup {

    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    // This is a slightly different use case.  We are not building a tree
    // of data to add to Neptune,  we are looking up the target group of the
    // autoscaling group in order to link it to our existing target group.
    async discover(accountId, awsRegion) {
        let groups = await this.processAutoScalingGroupsFromNeptune(accountId, awsRegion);

        await Promise.all(groups.map(group => {
            return this.processAutoScalingGroups(group);
        }));
    }

    async processAutoScalingGroupsFromNeptune(accountId, awsRegion) {
        let autoScalingGroups = await this.getAutoscalingGroupsFromNeptune(accountId, awsRegion);
        return await this.packageAutoScalingGroupsFromNeptune(autoScalingGroups);
    }

    async getAutoscalingGroupsFromNeptune(accountId, awsRegion) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::AutoScaling::AutoScalingGroup",
                    "awsRegion": awsRegion,
                    "accountId": "" + accountId,
                }
            };

            return await this.dataClient.queryGremlin(query);
        }
        catch (err) {
            logger.error(`getAutoscalingGroups: ${err}`);
            return {
                success: false,
            }
        }
    }

    async packageAutoScalingGroupsFromNeptune(groups) {
        return groups.results.map(group => {
            return this.formatAutoscalingGroupFromNeptune(group);
        });
    }

    formatAutoscalingGroupFromNeptune(dataIn) {
        let data = {
            id: dataIn.id,
            resourceId: dataIn.properties.resourceId,
            resourceType: dataIn.properties.resourceType,
            accountId: dataIn.properties.accountId,
        }

        data.properties = dataIn.properties;
        return data;
    }

    async getAutoScalingGroup(groupName) {
        try {
            var params = {
                AutoScalingGroupNames: [
                    groupName
                ]
            };
        }
        catch (err) {
            logger.error(`getAutoScalingGroup: ${err}`);
        }

        return await this.API.describeAutoScalingGroups(params).promise();
    }

    async processAutoScalingGroups(group) {
        let configuration = JSON.parse(group.properties.configuration);
        let targetGroups = configuration.targetGroupARNs;
      
        await Promise.all(targetGroups.map(targetGroup => {
            return this.linkLB(group, targetGroup, "AWS::ElasticLoadBalancingV2::TargetGroup");
        }));

        let loadBalancers = configuration.loadBalancerNames;

        await Promise.all(loadBalancers.map(loadBalancer => {
            return this.linkLB(group, loadBalancer, "AWS::ElasticLoadBalancing::LoadBalancer");
        }));
    }

    async linkLB(group, targetGroup, linkType) {
        // Load the targetGroup from neptune to get it's id
        let storedTargetGroup = await this.getTargetGroup(targetGroup);

        if (storedTargetGroup.results && storedTargetGroup.results.length > 0) {
            // Create a link between the autoscaling group and the loadbalancer targetGroup
            await this.dataClient.createLink(group.id, storedTargetGroup.results[0].id, linkType);
        }
    }

    async getTargetGroup(resourceId) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceId": resourceId,
                }
            };

            return await this.dataClient.queryGremlin(query);
        }
        catch (err) {
            logger.error(`getTargetGroup: ${err}`);
            return {
                success: false
            }
        }
    }
}

module.exports = AutoScalingGroup;