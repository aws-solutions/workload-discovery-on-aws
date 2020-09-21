const zoomUtils = require('./zoomUtils');
const logger = require('./logger');
const util = require('util');

class RouteTables {
    constructor(dataClient) {
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        let routeTables = await this.processRouteTablesFromNeptune(accountId, awsRegion);
        let binding = this;
        await zoomUtils.asyncForEach(routeTables, this.processRouteTables, binding);
    }

    async processRouteTablesFromNeptune(accountId, awsRegion) {
        let autoScalingGroups = await this.getRouteTablesFromNeptune(accountId, awsRegion);
        return await this.packageRouteTablesFromNeptune(autoScalingGroups);
    }

    async getRouteTablesFromNeptune(accountId, awsRegion) {
        try {
            let query = {
                "command": "filterNodes",
                "data": {
                    "resourceType": "AWS::EC2::RouteTable",
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

    async packageRouteTablesFromNeptune(groups) {
        return groups.results.map(group => {
            return this.formatRouteTablesFromNeptune(group);
        });
    }

    formatRouteTablesFromNeptune(dataIn) {
        let data = {
            id: dataIn.id,
            resourceId: dataIn.properties.resourceId,
            resourceType: dataIn.properties.resourceType,
            accountId: dataIn.properties.accountId,
        }

        data.properties = dataIn.properties;

        if (data.properties.configuration) {
            let config = data.properties.configuration;

            if (config) {
                config = config.replace('"{', "{");
                config = config.replace('}"', "}");
                config = JSON.parse(config);
                data.properties.configuration = config;
            }
        }

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

    async processRouteTables(routeObject) {
        let config = routeObject.properties.configuration;
        let routes = config.routes;

        for (let route of routes) {
            await this.processRoute(route, routeObject);
        }
    }

    async processRoute(route, routeObject) {
        if (route.destinationCidrBlock === '0.0.0.0/0') {
            if (route.natGatewayId !== null) {
                let natGateway = await this.getResourceId(route.natGatewayId);
                await this.link(routeObject, natGateway);
            }
            else if (route.gatewayId !== null) {
                let gateway = await this.getResourceId(route.gatewayId);
                await this.link(routeObject, gateway);
            }
        }
    }

    async link(routeTable, gateway) {
        if (gateway.results && gateway.results.length > 0) {
            logger.info(`Creating router link between ${routeTable.id} and ${gateway.results[0].id}`);
            await this.dataClient.createLink(routeTable.id, gateway.results[0].id, "AWS::Route");
        }
    }

    async getResourceId(resourceId) {
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
            logger.error(`getResourceId: ${err}`);
            return {
                success: false
            }
        }
    }
}

module.exports = RouteTables;