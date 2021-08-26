/**
 * Links  things like lambda functions with their ENIs..
 * 
 * After a bit of digging I found out that you can link an ENI to a lambda function by looking at the requesterId.  
 * 
 * In Lambda functions they have the format <id of role>:<lambda function name>
 */

const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const logger = require('./logger');

class ENILinks {
    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        try {
            logger.info('Beginning discovery of Lambda ENIs.');
            let bind = this;

            let dataToUpload = await zoomUtils.expand(bind,
                await this.processENIs(accountId, awsRegion),
                this.processENILinks);

            dataToUpload = dataToUpload.filter(data => {
                return data.children !== undefined;
            });

            for (let upload of dataToUpload) {
                await this.dataClient.storeData("AWS::EC2::NetworkInterface", upload.children, 1, upload.id);
            }
            logger.info('Discovery of Lambda ENIs complete.');
        }
        catch (Error) {
            console.dir(Error);
            throw Error;
        }
    }

    formatLink(link, linkType) {
        let data = {
            link: link.id,
            resourceType: linkType
        };

        return data;
    }

    sameSecurityGroupAndSubnet(config, accountId, awsRegion, type) {
        const subnet = config.subnetId;
       
        const both = config.groups.map(element => {
            return {
                both: {
                    parameter: "linked",
                    subFunction: [
                        {
                            has: [
                                {
                                    resourceId: element.groupId
                                }
                            ]
                        }
                    ]
                }
            }
        });

        both.push({
            both: {
                parameter: "linked",
                subFunction: [
                    {
                        has: [
                            {
                                subnetId: subnet
                            }
                        ]
                    }
                ]
            }
        })

        return {
            command: "runGremlin",
            data: [
                {
                    has: [
                        {
                            accountId: accountId
                        },
                        {
                            awsRegion: awsRegion
                        },
                        {
                            resourceType: type
                        }
                    ]
                },
                {
                    as: {
                        parameter: "a"
                    }
                },
                {
                    and: both
                },
                {
                    select: {
                        parameter: "a"
                    }
                }
            ]
        };
    }

    async processElastic(config, accountId, awsRegion) {
        let query = this.sameSecurityGroupAndSubnet(config, accountId, awsRegion, "AWS::Elasticsearch::Domain");
        let lambda = await this.dataClient.queryGremlin(query);

        if (lambda.success === true && lambda.results.length > 0) {
            return lambda.results.map(element => {
                return this.formatLink(element, "AWS::Elasticsearch::Domain")
            });
        }
    };

    async processLambda(config, accountId, awsRegion) {
        let query = this.sameSecurityGroupAndSubnet(config, accountId, awsRegion, "AWS::Lambda::Function");
        let lambda = await this.dataClient.queryGremlin(query);

        if (lambda.success === true && lambda.results.length > 0) {
            return lambda.results.map(element => {
                return this.formatLink(element, "AWS::Lambda::Function");
            });
        }
    };

    async processNat(config, accountId, awsRegion, resourceId) {
        //"description": "Interface for NAT Gateway nat-06183bc3e4034034b",
        let nat = config.description.split(" ")[4];

        let query = {
            "command": "runGremlin",
            "data": [
                {
                    "has": [
                        {
                            "resourceId": nat
                        },
                        {
                            "accountId": accountId
                        },
                        {
                            "awsRegion": awsRegion
                        }
                    ]
                }
            ]
        };

        let gateway = await this.dataClient.queryGremlin(query);

        if (gateway.success === true && gateway.results && gateway.results.length > 0) {
            return gateway.results.map(element => {
                return this.formatLink(element, "AWS::EC2::NatGateway");
            });
        }
    }

    async processENILinks(configuration, requesterId, accountId, awsRegion, resourceId) {
        let config = JSON.parse(configuration);

        if (config === null){
            logger.error("eni-links parse error:");
            console.error(configuration);
            return [];
        }

        if (config.requesterId === "amazon-elasticsearch"){
            return await this.processElastic(config, accountId, awsRegion, resourceId);
        }

        switch (config.interfaceType) {
            case "nat_gateway":
                return await this.processNat(config, accountId, awsRegion, resourceId);
                break;
            case "lambda":
                return await this.processLambda(config, accountId, awsRegion, resourceId);
                break;
            default:
                return await this.processInterface(config, requesterId, accountId, awsRegion, resourceId);
        }
    }

    async processInterface(configuration, requesterId, accountId, awsRegion, resourceId) {
        if (configuration.description.startsWith("ELB app")) {
            return await this.processELB(configuration.description, accountId, awsRegion, resourceId);
        }
    }

    async processELB(description, accountId, awsRegion, resourceId) {
        //Description looks like this: ELB app/zoom-autoscaling-group-alb/0ab8aab94c522339"
        let linkedELB = description.split("/")[2].trim();
        let albGroup = description.split("/")[1].trim()

        let lbArn = `arn:aws:elasticloadbalancing:${awsRegion}:${accountId}:loadbalancer/app/${albGroup}/${linkedELB}`

        let query = {
            "command": "runGremlin",
            "data": [
                {
                    "has": [
                        {
                            "resourceId": lbArn
                        },
                        {
                            "accountId": accountId
                        },
                        {
                            "awsRegion": awsRegion
                        }
                    ]
                }
            ]
        };

        let elb = await this.dataClient.queryGremlin(query);

        if (elb.success === true && elb.results) {
            return elb.results.map(element => {
                return this.formatLink(element, "AWS::ElasticLoadBalancingV2::LoadBalancer");
            });
        }
    }

    async getLambdaENIs(resourceId, accountId, awsRegion) {
        try {
            var params = {
                FunctionName: resourceId,
            };

            return await this.API.getFunctionConfiguration(params).promise();
        }
        catch (err) {
            logger.error("getLambdaEni error: " + err);
            return false;
        }
    }

    async getENIs(accountId, region) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::EC2::NetworkInterface",
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

    async packageENIs(ENIs, accountId, awsRegion) {
        return ENIs.results.map(eni => {
            return this.formatENI(eni);
        });
    }

    async processENIs(accountId, awsRegion) {
        let enis = await this.getENIs(accountId, awsRegion);
        let formatted = await this.packageENIs(enis);
        return formatted;
    }

    formatENI(dataIn) {
        let data = {
            id: dataIn.id,
            resourceId: dataIn.properties.resourceId,
            resourceType: dataIn.properties.resourceType,
            accountId: dataIn.properties.accountId,
        }

        data.properties = dataIn.properties;
        return data;
    }
}

module.exports = ENILinks;