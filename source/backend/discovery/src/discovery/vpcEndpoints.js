const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const logger = require('./logger');

const identity = v => v;

class VPCEndpoints {
    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        logger.info('Beginning discovery of VPC endpoints.');
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
            await this.processVPCEndpoints(accountId, awsRegion),
            this.processNetworkInterfaces);

        await this.dataClient.storeData("AWS::VPC::Endpoint", dataToUpload, 0);
        logger.info('Discovery of VPC endpoints complete.');
    }

    async processNetworkInterfaces(temporary, accountId, awsRegion) {
        let networkInterfaceIds = temporary.networkInterfaceIds;

        let bind = this;
        let clusterMembers = await zoomUtils.asyncMap(networkInterfaceIds, this.getInterface, bind);
        return await this.packageNetworkInterfaces(clusterMembers);
    }

    async packageNetworkInterfaces(interfaces) {
        return interfaces.filter(identity);
    }

    async getInterface(networkId) {
        try {
            let result = await this.dataClient.search(networkId);
            if (result.hits) {

                for (let sr of result.hits.hits) {
                    // For now only interested in DB instance links.

                    let data = {
                        link: result.hits.hits[0]._source.id,
                        resourceType: "AWS::EC2::NetworkInterface"
                    };

                    return data;
                }
            }
        }
        catch (err) {
            logger.error("getInterface Error: " + err);
        }
    }

    async processVPCEndpoints(accountId, awsRegion) {
        const VPCEndpoints = await this.getVPCEndpoints();
        return await this.packageVPCEndpoints(VPCEndpoints, accountId, awsRegion);
    }

    async getVPCEndpoints() {
        try {
            var params = {
            };

            return await this.API.describeVpcEndpoints(params).promise();
        }
        catch (err) {
            logger.error("getRDSClusters error:", err);
        }
    }

    async packageVPCEndpoints(vpcEndpoints, accountId, awsRegion) {
        return vpcEndpoints.VpcEndpoints.map(vpcEndpoint => {
            let data = {
                resourceId: vpcEndpoint.VpcEndpointId + "_" + awsRegion + "_" + accountId,
                resourceType: "AWS::VPC::Endpoint",
                accountId: accountId
            }

            let properties = {
                resourceId: vpcEndpoint.VpcEndpointId + "_" + awsRegion + "_" + accountId,
                vpcEndpointId: vpcEndpoint.VpcEndpointId,
                resourceType: "AWS::VPC::Endpoint",
                accountId: accountId,
                awsRegion: awsRegion,
                vpcId: vpcEndpoint.VpcId,
                serviceName: vpcEndpoint.Servicename,
                state: vpcEndpoint.State,
                policyDocument: JSON.stringify(vpcEndpoint.PolicyDocument),
                groups: JSON.stringify(vpcEndpoint.Groups),
                dnsEntries: JSON.stringify(vpcEndpoint.DnsEntries),
                networkInterfaceIds: JSON.stringify(vpcEndpoint.NetworkInterfaceIds),
                temporary: {
                    networkInterfaceIds: vpcEndpoint.NetworkInterfaceIds
                }
            };

            data.properties = properties;
            this.appendConsoleURL(data);
            generateHeader.generateHeader(data);

            return data;
        });
    }

    appendConsoleURL(data) {
        // Create the URLS to the console
        let { loginURL, loggedInURL } = consoleM.getConsoleURLs(data);
        data.properties.loginURL = loginURL;
        data.properties.loggedInURL = loggedInURL;
    }
}

module.exports = VPCEndpoints;

