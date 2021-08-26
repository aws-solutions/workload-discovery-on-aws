const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const logger = require('./logger');
const util = require('util');
const gremlinQueries = require('./commonGremlinQueries');

class Spot {

    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        logger.info('Beginning discovery of spot instances.');
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
            await this.processSpotInstanceRequests(accountId, awsRegion),
            [await this.processSpotFleet, await this.processLinkedEC2]
        );

        await this.dataClient.storeData("AWS::EC2::Spot", dataToUpload, 0);
        logger.info('Discovery of spot instances complete.');
    }

    async processSpotFleet(accountId, awsRegion, spotFleetRequestId) {
        if (!spotFleetRequestId) {
            return [];
        }

        let spotFleetRequest = await zoomUtils.callAwsApi(this.API.describeSpotFleetRequests, { SpotFleetRequestIds: [spotFleetRequestId] }, this.API, "Spot escribeSpotFleetRequests");

        if (spotFleetRequest) {
            let sr = this.packageSpotFleetRequests(spotFleetRequest.SpotFleetRequestConfigs, spotFleetRequestId, accountId, awsRegion);

            for (let request of sr){
                request.properties.tags = await this.getSpotFleetTags(request.resourceId);
            }

            return sr;

        }
        else return [];
    }

    packageSpotFleetRequests(spotFleetRequest, spotFleetRequestId, accountId, awsRegion) {
        return spotFleetRequest.map(request => {
            let data = {
                resourceId: spotFleetRequestId,
                resourceType: "AWS::EC2::SpotFleet",
                accountId: accountId
            }

            let properties = {
                resourceId: spotFleetRequestId,
                resourceType: "AWS::EC2::SpotFleet",
                accountId: accountId,
                awsRegion: awsRegion,
                activityStatus: request.ActivityStatus,
                createdTime: request.CreateTime,
                spotFleetRequestConfig: request.SpotFleetRequestConfig,
                spotFleetRequestState: request.SpotFleetRequestState,
                spotFleetRequestId: request.SpotFleetRequestId,
                title: request.SpotFleetRequestId
            };

            data.properties = properties;
            return data;
        });
    }

    async getSpotFleetTags(requestId) {
        const params = {
            Filters: [
                {
                    Name: "resource-id",
                    Values: [
                        requestId
                    ]
                }
            ]
        };
        const tags = await zoomUtils.callAwsApi(this.API.describeTags, params, this.API, "spot describeTags");

        if (tags.Tags){
            return zoomUtils.convertToObject(tags.Tags);
        }
        return {};
    }

    async processSpotInstanceRequests(accountId, awsRegion) {
        const instanceRequests = await zoomUtils.callAwsApi(this.API.describeSpotInstanceRequests, {}, this.API, "spot describeSpotInstanceRequests");
        return await this.packageSpotInstanceRequests(instanceRequests, accountId, awsRegion);
    }

    async packageSpotInstanceRequests(spotInstanceRequests, accountId, awsRegion) {
        return spotInstanceRequests.SpotInstanceRequests.map(spotInstanceRequest => {
            let data = {
                resourceId: spotInstanceRequest.SpotInstanceRequestId,
                resourceType: "AWS::EC2::Spot",
                accountId: accountId
            }

            let properties = {
                resourceId: spotInstanceRequest.SpotInstanceRequestId,
                resourceType: "AWS::EC2::Spot",
                accountId: accountId,
                title: spotInstanceRequest.SpotInstanceRequestId,
                createTime: spotInstanceRequest.CreateTime,
                instanceId: spotInstanceRequest.InstanceId,
                launchSpecification: spotInstanceRequest.LaunchSpecification,
                launchedAvailabilityZone: spotInstanceRequest.LaunchedAvailabilityZone,
                productDescription: spotInstanceRequest.ProductDescription,
                spotInstanceRequestId: spotInstanceRequest.SpotInstanceRequestId,
                spotPrice: spotInstanceRequest.SpotPrice,
                state: spotInstanceRequest.State,
                awsRegion: awsRegion,
                tags: zoomUtils.convertToObject(spotInstanceRequest.Tags)
            };

            if (spotInstanceRequest.Tags) {
                let spotFleetObject = spotInstanceRequest.Tags.filter(tag => {
                    if (tag.Key === "aws:ec2spot:fleet-request-id") return true;
                });

                if (spotFleetObject && spotFleetObject.length > 0) {
                    properties.spotFleetRequestId = spotFleetObject[0].Value
                }
                else {
                    properties.spotFleetRequestId = false;
                }
            }

            data.properties = properties;
            //this.appendConsoleURL(data);
            //generateHeader.generateHeader(data);

            return data;
        });
    }

    async processLinkedEC2(accountId, awsRegion, instanceId) {
        logger.info("InstanceId = " + instanceId);
        let linkedInstance = await gremlinQueries.getEC2Instance(instanceId, this.dataClient);

        return linkedInstance.results.length > 0 ?
            [{
                link: linkedInstance.results[0].id,
                resourceType: "AWS::EC2::Instance"
            }]
            : await this.describeEC2Instance(instanceId);
    }

    async describeEC2Instance(instanceId, accountId, awsRegion) {
        logger.info("!!Calling ec2 describe for missing spot instance " + instanceId);
        const param = {
            InstanceIds: [instanceId]
        };

        let results = await this.API.describeInstances(param).promise();
        logger.info(results);
        return this.packageEC2Instance(results, accountId, awsRegion);
    }

    /* If a spot fleet is stopped and started quickly then 
       config can not see the data.  So query the ec2 
       api directly to plug the hole*/

    packageEC2Instance(ec2Instance, accountId, awsRegion) {
        if (ec2Instance.Reservations.length === 0){
            return [];
        }
        else {
            let instance = ec2Instance.Reservations[0].Instances[0];

            logger.info(instance);

            let data = {
                     resourceId: instance.InstanceId,
                     resourceType: "AWS::EC2::Instance",
                     accountId: accountId,
                     label:instance.InstanceId,
                     arn: `arn:aws:ec2:${awsRegion}:${accountId}:instance/${instance.instanceId}`
            }

            let properties = {
                resourceType: "AWS::EC2::Instance",
                resourceId: instance.InstanceId,
                arn: `arn:aws:ec2:${awsRegion}:${accountId}:instance/${instance.instanceId}`,
                title: instance.InstanceId,
                accountId: accountId,
                awsRegion: awsRegion,
                state: JSON.stringify(instance.State),
                instanceType: instance.InstanceType,
                imageId: instance.ImageId,
                keyName: instance.KeyName,
                launchTime: instance.LaunchTime,
                privateDnsName: instance.PrivateDnsName,
                publicDnsName: instance.PublicDnsName,
                stateTransitionReason: instance.StateTransitionReason,
                architecture: instance.Architecture,
                clientToken: instance.ClientToken,
                ebsOptimised: instance.EbsOptimised,
                enaSupport: instance.EnaSupport,
                hypervisor: instance.Hypervisor,
                instanceLifecycle: instance.InstanceLifecycle
            };

            data.properties = properties;

            return [data];
        }
    }
}

module.exports = Spot;