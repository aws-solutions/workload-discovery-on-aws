const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const logger = require('./logger');
const R = require('ramda');

class LoadBalancer {

    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
                                                  await this.processLoadBalancers(accountId, awsRegion),
                                                  this.processLoadBalancer);

        for (let l of dataToUpload) {
             await this.dataClient.storeData("AWS::ElasticLoadBalancing::LoadBalancer", l.children, 1, l.id);
        }
    }

    async processLoadBalancers(accountId, awsRegion, resourceId) {
        let loadBalancers = await this.getLoadBalancers(accountId, awsRegion, resourceId);
        return await this.packageLoadBalancers(loadBalancers);
    }

    async getLoadBalancers(accountId, region) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::ElasticLoadBalancing::LoadBalancer",
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

    async processLoadBalancer(accountId, awsRegion, resourceId) {
        let loadBalancer = await this.getLoadBalancer(resourceId);
        let linkedInstances = R.flatten(await this.processLoadBalancerInstances(loadBalancer));
        return linkedInstances;
    }

    async getLoadBalancer(loadBalancerResourceId) {
        try {
            var params = {
                LoadBalancerNames: [loadBalancerResourceId],
            };
            return await this.API.describeLoadBalancers(params).promise();
        } catch (err) {
            logger.error("getListener: ", err);
        }
    }

    async processLoadBalancerInstances(loadBalancer, accountId, region) {
        if (loadBalancer.LoadBalancerDescriptions && 
            loadBalancer.LoadBalancerDescriptions.length > 0 &&
            loadBalancer.LoadBalancerDescriptions[0].Instances.length > 0 ){

            let instances = await Promise.all(loadBalancer.LoadBalancerDescriptions[0].Instances.map(instance => {
                return this.getInstance(instance.InstanceId);
            }));

            return instances.map(instance => {
                return this.packageInstance(instance);
            });
        }
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
            logger.error("getInstance: ", err);
            return {
                success: false
            };
        }
    }

    packageInstance(instance) {
        return instance.results.map(inst => { return this.formatRemoteInstance(inst) });
    }

    formatRemoteInstance(dataIn) {
        let data = {
            link: dataIn.id,
            resourceType: "AWS::EC2::Instance"
        };

        return data;
    }
}

module.exports = LoadBalancer;