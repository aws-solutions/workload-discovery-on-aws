const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const logger = require('./logger');
const zoomUtils = require('./zoomUtils');

class LoadBalancerV2 {

    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    /**
     * There is a complex discovery hierarchy here.
     * First you get the loadbalancers from neptune.  
     * A load balancer can have one or many listeners.
     * A listener has one or many default actions - which forward to a target group.
     * A target group has one or more targets.
     * Each target has a health status.
     * I have merged the target and targetHealth data.
     * Each health status links to an instance.
     */

    async discover(accountId, awsRegion) {
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
                                                  await this.processLoadBalancers(accountId, awsRegion),
                                                  this.processListeners,
                                                  this.processTargetGroups,
                                                  this.processTargetHealth,
                                                  this.processInstance);

        for (let l of dataToUpload) {
             await this.dataClient.storeData("AWS::ElasticLoadBalancingV2::LoadBalancer", l.children, 1, l.id);
        }
    }

    async getLoadBalancers(accountId, region) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::ElasticLoadBalancingV2::LoadBalancer",
                    "awsRegion": region,
                    "accountId": "" + accountId,
                }
            };

            return await this.dataClient.queryGremlin(query)
        }
        catch (err) {
            logger.error(err);
            return {
                success: false
            }
        }
    }

    async packageLoadBalancers(loadBalancers) {
        return loadBalancers.results.map(loadBalancer => {
            let lb = this.formatRemoteLoadBalancer(loadBalancer);
            return lb;
        });
    }

    async processLoadBalancers(accountId, awsRegion) {
        let loadBalancers = await this.getLoadBalancers(accountId, awsRegion);
        return await this.packageLoadBalancers(loadBalancers);
    }

    async getListeners(loadBalancerARN) {
        try {
            var params = {
                LoadBalancerArn: loadBalancerARN,
            };
            return await this.API.describeListeners(params).promise();
        } catch (err) {
            logger.error("getListener: " + err);
        }
    }

    async packageListeners(listeners, accountId, awsRegion) {
        return listeners.Listeners.map(listener => {
            return this.formatListener(listener, accountId, awsRegion);
        });
    }

    async processListeners(accountId, awsRegion, arn) {
        let listeners = await this.getListeners(arn);
        return await this.packageListeners(listeners, accountId, awsRegion);
    }

    async getTargetGroups(defaultAction) {
        let listenerARN = defaultAction.TargetGroupArn;

        try {
            var params = {
                TargetGroupArns: [listenerARN],
            };

            let targetGroups = await this.API.describeTargetGroups(params).promise();
 
            return {
                defaultAction: defaultAction,
                targetGroups: targetGroups
            };
        }
        catch (err) {
            logger.error("getTargetGroups: ", err);
            return {
                targetGroups: []
            };
        }
    }

    async packageTargetGroups(targetGroups, accountId, awsRegion) {
        return targetGroups.map(tg => {
            return this.formatTargetGroup(tg.targetGroups, tg.defaultAction, accountId, awsRegion);
        });
    }

    // NB here we have to pull a temporary variable from the
    // previous properties as a listener has sub-properties (default Action)
    async processTargetGroups(temporary, accountId, awsRegion) {
        let defaultActions = temporary.defaultActions;
        let bind = this;

        let targetGroups = await zoomUtils.asyncMap(defaultActions, this.getTargetGroups, bind);

        return await this.packageTargetGroups(targetGroups, accountId, awsRegion);
    }

    async getTargetHealth(targetARN) {
        try {
            var params = {
                TargetGroupArn: targetARN,
            };

            return await this.API.describeTargetHealth(params).promise();
        }
        catch (err) {
            logger.error("getTargetHealth: " + err);
        }
    }

    async packageTargetHealth(targetHealth, accountId, awsRegion, arn) {
        return targetHealth.TargetHealthDescriptions.map(targetHealth => {
            return this.formatTargetHealth(targetHealth, accountId, awsRegion, arn)
        });
    }

    async processTargetHealth(arn, accountId, awsRegion) {
        let targetHealth = await this.getTargetHealth(arn);
        return await this.packageTargetHealth(targetHealth, accountId, awsRegion, arn);
    }

    async getInstance(instanceId) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceId": instanceId
                }
            };

            return await this.dataClient.queryGremlin(query);
        }
        catch (err) {
            logger.error("getInstance: " + err);
            return {
                success: false
            };
        }
    }

    async packageInstance(instance) {
        return instance.results.map(inst => { return this.formatRemoteInstance(inst) });
    }

    async processInstance(target) {
        let instance = await this.getInstance(target);
        return await this.packageInstance(instance);
    }

    formatRemoteLoadBalancer(dataIn) {
        let data = {
            id: dataIn.id,
            resourceId: dataIn.properties.resourceId,
            resourceType: dataIn.properties.resourceType,
            accountId: dataIn.properties.accountId,
        }

        data.properties = dataIn.properties;
        return data;
    }

    appendConsoleURL(data) {
        // Create the URLS to the console
        let { loginURL, loggedInURL } = consoleM.getConsoleURLs(data);
        data.properties.loginURL = loginURL;
        data.properties.loggedInURL = loggedInURL;
    }

    formatTargetHealth(targetHealth, accountId, region, arn) {
        let id = "Target-" + targetHealth.Target.Id + "-" + targetHealth.Target.Port;

        let data = {
            resourceId: id,
            resourceType: "AWS::ElasticLoadBalancingV2::Target",
            accountId: accountId
        };

        let properties = {
            resourceId: id,
            resourceType: "AWS::ElasticLoadBalancingV2::Target",
            accountId: accountId,
            healthCheckPort: targetHealth.HealthCheckPort,
            target: targetHealth.Target.Id,
            targetPort: targetHealth.Target.Port,
            targetState: targetHealth.TargetHealth.State,
            targetReason: targetHealth.TargetHealth.Reason,
            awsRegion: region,
            arn: arn
        }

        data.properties = properties;
        this.appendConsoleURL(data);

        // set the title attribute.
        generateHeader.generateHeader(data);
        return data;
    }

    formatTargetGroup(targetGroup, listenerDefaultAction, accountId, region) {
        let data = {
            resourceId: listenerDefaultAction.TargetGroupArn,
            resourceType: "AWS::ElasticLoadBalancingV2::TargetGroup",
            accountId: accountId
        };

        let properties = {
            resourceId: listenerDefaultAction.TargetGroupArn,
            resourceType: "AWS::ElasticLoadBalancingV2::TargetGroup",
            accountId: accountId,
            protocol: targetGroup.Protocol,
            port: targetGroup.Port,
            healthCheckProtocol: targetGroup.HealthCheckProtocol,
            healthCheckPort: targetGroup.HealthCheckPort,
            healthCheckEnabled: targetGroup.HealthCheckEnabled,
            healthCheckIntervalSeconds: targetGroup.HealthCheckIntervalSeconds,
            healthCheckTimeoutSeconds: targetGroup.HealthCheckTimeoutSeconds,
            healthyTresholdCount: targetGroup.HealthyTresholdCount,
            unHealthyThresholdCount: targetGroup.UnHealthyThresholdCount,
            healthCheckPath: targetGroup.HealthCheckPath,
            targetType: targetGroup.TargetType,
            defaultActionType: listenerDefaultAction.Type,
            arn: listenerDefaultAction.TargetGroupArn,
            awsRegion: region
        };

        data.properties = properties;

        this.appendConsoleURL(data);

        // set the title attribute.
        generateHeader.generateHeader(data);

        return data;
    }

    getRegionFromArn(arn) {
        let parsed = arn.split(":");
        return parsed[3];
    }

    formatListener(listener, accountId, region) {
        let data = {
            resourceId: listener.ListenerArn,
            resourceType: "AWS::ElasticLoadBalancingV2::Listener",
            accountId: accountId
        }

        let properties = {
            resourceId: listener.ListenerArn,
            arn: listener.ListenerArn,
            resourceType: "AWS::ElasticLoadBalancingV2::Listener",
            accountId: accountId,
            port: listener.Port,
            protocol: listener.Protocol,
            awsRegion: region,
            temporary: {
                defaultActions: listener.DefaultActions
            }
        }

        data.properties = properties;

        // Add the URL to the console
        this.appendConsoleURL(data);
        // set the title attribute.
        generateHeader.generateHeader(data);
        return data;
    }

    formatRemoteInstance(dataIn) {
        let data = {
            link: dataIn.id,
            resourceType: "AWS::EC2::Instance"
        };

        return data;
    }
}

module.exports = LoadBalancerV2;