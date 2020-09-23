
const consoleM = require('./consoleURL');
const generateHeader = require('./generateHeader');
const zoomUtils = require('./zoomUtils');
const util = require('util');

const extractFunctions = {
    "AWSManagedPolicy": (data) => { return data.Policies },
    "Role": (data) => { return data.RoleDetailList }
};
class GetAccountAuthorizationDetails {

    constructor(AWSSetupFun, dataClient) {
        this.API = AWSSetupFun();
        this.dataClient = dataClient;
    }

    async discover(type) {
        let dataToUpload = await this.processAuthorizationDetails(type);
        await this.dataClient.storeData("AWS::IAM::" + type, dataToUpload, 0);
    }

    async processAuthorizationDetails (type) {
        return await this.getAuthDetails(type);
    }

    async getAuthDetails(type) {
        const params = type !== undefined ? { Filter: [type] } : {};
        let authorisations = await zoomUtils.callAwsApiWithMarkPagination(this.API.getAccountAuthorizationDetails, params, this.API, undefined, "AccountDetails getAccountAuthorizationDetails");
        return this.packageAuthorisations(authorisations, type);
    }

    async packageAuthorisations(authorisations, type) {
        let auths = extractFunctions[type](authorisations);
  
        return auths.map(auth => {
            let data = {
                resourceId: auth.PolicyName,
                resourceType: "AWS::IAM::" + type,
            };

            let properties = {
                resourceId: auth.PolicyName,
                resourceType: "AWS::IAM::" + type,
                title: auth.PolicyName,
                arn: auth.Arn,
                path: auth.Path,
                defaultVersionId: auth.DefaultVersionId,
                attachmentCount: auth.AttachmentCount,
                permissionsBoundaryUsageCount: auth.PermissionsBoundaryUsageCount,
                isAttachable: auth.IsAttachable,
                createdDate: auth.CreatedDate,
                updateDate: auth.UpdateDate
            };

            data.properties = properties;
            return data;
        });
    }
}

module.exports = GetAccountAuthorizationDetails;