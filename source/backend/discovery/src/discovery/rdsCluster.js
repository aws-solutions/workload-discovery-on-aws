const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const logger = require('./logger');
const zoomUtils = require('./zoomUtils');
const util = require('util');

const identity = v => v;

class RDSCluster {
    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    async discover(accountId, awsRegion) {
        logger.info('Beginning discovery of RDS clusters.');
        let bind = this;
        let dataToUpload = await zoomUtils.expand(bind,
            await this.processRDSClusters(accountId, awsRegion),
            this.processClusterMembers);

        await this.dataClient.storeData("AWS::RDS::DBCluster", dataToUpload, 0);
        logger.info('Discovery of RDS clusters complete.');
    }

    async processRDSClusters(accountId, awsRegion) {
        const rdsClusters = await this.getRDSClusters();
        return await this.packageRDSClusters(rdsClusters, accountId, awsRegion);
    }

    async getRDSClusters() {
        try {
            var params = {
                MaxRecords: 100,
            };

            return await this.API.describeDBClusters(params).promise();
        }
        catch (error) {
            logger.error("getRDSClusters error:", error);
        }
    }

    async packageRDSClusters(rdsClusters, accountId, awsRegion) {
        return rdsClusters.DBClusters.map(rdsCluster => {
            let data = {
                resourceId: rdsCluster.DBClusterIdentifier + "_" + awsRegion + "_" + accountId,
                resourceType: "AWS::RDS::DBCluster",
                accountId: accountId
            }

            let properties = {
                resourceId: rdsCluster.DBClusterIdentifier + "_" + awsRegion + "_" + accountId,
                dbClusterIdentifier: rdsCluster.DBClusterIdentifier,
                resourceType: "AWS::RDS::DBCluster",
                accountId: accountId,
                availabilityZones: rdsCluster.AvailabilityZones.join(","),
                dbClusterParameterGroup: rdsCluster.DbClusterParameterGroup,
                dBSubnetGroup: rdsCluster.DBSubnetGroup,
                status: rdsCluster.status,
                earliestRestorableTime: rdsCluster.EarliestRestorableTime,
                endpoint: rdsCluster.Endpoint,
                readerEndpoint: rdsCluster.ReaderEndpoint,
                multiAZ: rdsCluster.MultiAZ,
                engine: rdsCluster.Engine,
                engineVersion: rdsCluster.EngineVersion,
                //latestRestorableTime: rdsCluster.LatestRestorableTime,
                port: rdsCluster.Port,
                masterUserName: rdsCluster.MasterUserName,
                preferredBackupWindow: rdsCluster.PreferredBackupWindow,
                preferredMaintenanceWindow: rdsCluster.PrefferedMaintenaceWindow,
                dbClusterMembers: JSON.stringify(rdsCluster.DBClusterMembers),
                vpcSecurityGroups: JSON.stringify(rdsCluster.VpcSecurityGroups),
                hostedZoneId: rdsCluster.HostedZoneId,
                storageEncrypted: rdsCluster.StorageEncrypted,
                dbClusterArn: rdsCluster.DBClusterArn,
                associatedRoles: JSON.stringify(rdsCluster.AssociatedRoles),
                iamDatabaseAuthenticationEnabled: rdsCluster.IamDatabaseAuthenticationEnabled,
                clusterCreateTime: rdsCluster.ClusterCreateTime,
                engineMode: rdsCluster.EngineMode,
                deletionProtection: rdsCluster.DeletionProtection,
                httpEndpointEnabled: rdsCluster.HttpEndpointEnabled,
                awsRegion: awsRegion,
                temporary: {
                    dbClusterMembers: rdsCluster.DBClusterMembers,
                    vpcSecurityGroups: rdsCluster.VpcSecurityGroups
                }
            };

            // Getting the cluster arn.
            this.getClusterARN(properties);

            this.splitOutProperties("dbClusterMembers", rdsCluster.DBClusterMembers, properties);
            this.splitOutProperties("vpcSecurityGroups", rdsCluster.VpcSecurityGroups, properties);

            data.properties = properties;
            this.appendConsoleURL(data);
            generateHeader.generateHeader(data);

            return data;
        });
    }

    getClusterARN(properties) {
        logger.info('Getting cluster properties');
        let arn = properties.dbClusterArn.substring(0, properties.dbClusterArn.lastIndexOf(":"));
        arn += ":" + properties.resourceId
        properties.arn = arn;
        logger.info("cluster arn is " + arn);
    }

    appendConsoleURL(data) {
        // Create the URLS to the console
        let { loginURL, loggedInURL } = consoleM.getConsoleURLs(data);
        data.properties.loginURL = loginURL;
        data.properties.loggedInURL = loggedInURL;
    }

    splitOutProperties(keyString, properties, propertyObject) {
        properties.forEach(property => {
            this.splitOutProperty(keyString, property, propertyObject);
        });
    }

    splitOutProperty(keyString, property, propertyObject) {
        let counter = 1;

        for (let key of Object.keys(property)) {
            let index = keyString + "_" + key + "_" + counter++;
            propertyObject[index] = property[key];
        }
    }

    // NB here we have to pull a temporary variable from the
    // previous properties as a listener has sub-properties (default Action)
    async processClusterMembers(temporary, accountId, awsRegion) {   
        let dbClusterMembers = temporary.dbClusterMembers;

        let clusterMembers = await Promise.all(
                dbClusterMembers.map(clusterMember => {
                    return this.getClusterMember(clusterMember, accountId);
                }
            )
        );
        
        return await this.packageClusterMembers(clusterMembers, accountId, awsRegion);
    }

    async getClusterMember(dbClusterMember, accountId) {
        try {
            let result = await this.dataClient.search(dbClusterMember.DBInstanceIdentifier);
            return this.dataClient.processSearchResult(result, accountId);
        }
        catch (Error) {
            logger.error("getClusterMember Error: ", Error);
        }
    }

    async packageClusterMembers(dbClusterMembers) {
        return dbClusterMembers.filter(identity);
    }
}

module.exports = RDSCluster;