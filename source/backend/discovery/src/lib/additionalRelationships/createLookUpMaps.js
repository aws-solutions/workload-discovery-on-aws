const R = require("ramda");
const {
    AWS_AUTOSCALING_AUTOSCALING_GROUP,
    AWS_ELASTICSEARCH_DOMAIN,
    AWS_OPENSEARCH_DOMAIN,
    AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER,
    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
    AWS_RDS_DB_CLUSTER,
    AWS_RDS_DB_INSTANCE,
    AWS_REDSHIFT_CLUSTER,
    AWS_S3_BUCKET
} = require("../constants");
const {createResourceNameKey, createResourceIdKey} = require('../utils');

function createLookUpMaps(resources) {
    const targetGroupToAsgMap = new Map();
    const resourceIdentifierToIdMap = new Map();
    // we can't reuse resourceIdentifierToIdMap because we don't know the resource type for env vars
    const envVarResourceIdentifierToIdMap = new Map();
    const dbUrlToIdMap = new Map();
    const elbDnsToResourceIdMap = new Map();
    const asgResourceNameToResourceIdMap = new Map();
    const s3ResourceIdToRegionMap = new Map();

    for(let resource of resources) {
        const {id, resourceType, resourceId, resourceName, accountId, awsRegion, arn, configuration} = resource;

        if(resourceName != null) {
            envVarResourceIdentifierToIdMap.set(createResourceNameKey({resourceName, accountId, awsRegion}), id);
            resourceIdentifierToIdMap.set(
                createResourceNameKey({resourceName, resourceType, accountId, awsRegion}),
                id);
        }

        resourceIdentifierToIdMap.set(
            createResourceIdKey({resourceId, resourceType, accountId, awsRegion}),
            id);
        envVarResourceIdentifierToIdMap.set(createResourceIdKey({resourceId, accountId, awsRegion}), id);

        switch (resourceType) {
            case AWS_AUTOSCALING_AUTOSCALING_GROUP:
                configuration.targetGroupARNs.forEach(tg =>
                    targetGroupToAsgMap.set(tg, {
                        arn,
                        instances: new Set(configuration.instances.map(R.prop('instanceId')))
                    }));
                asgResourceNameToResourceIdMap.set(
                    createResourceNameKey(
                        {resourceName, accountId, awsRegion}),
                    resourceId);
                break;
            case AWS_ELASTICSEARCH_DOMAIN:
                if(configuration.endpoint != null) dbUrlToIdMap.set(configuration.endpoint, id)
                Object.values(configuration.endpoints ?? []).forEach(endpoint => dbUrlToIdMap.set(endpoint, id));
                break;
            case AWS_OPENSEARCH_DOMAIN:
                if(configuration.Endpoint != null) dbUrlToIdMap.set(configuration.Endpoint, id)
                Object.values(configuration.Endpoints ?? []).forEach(endpoint => dbUrlToIdMap.set(endpoint, id));
                break;
            case AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER:
                elbDnsToResourceIdMap.set(configuration.dnsname, {resourceId, resourceType, awsRegion});
                break;
            case AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER:
                elbDnsToResourceIdMap.set(configuration.dNSName, {resourceId, resourceType, awsRegion});
                break;
            // databases in the 'creating' phase don't have an endpoint field
            case AWS_RDS_DB_CLUSTER:
                if(configuration.endpoint != null) dbUrlToIdMap.set(configuration.endpoint.value, id);
                if(configuration.readerEndpoint != null) dbUrlToIdMap.set(configuration.readerEndpoint, id);
                break;
            case AWS_RDS_DB_INSTANCE:
                if(configuration.endpoint != null) dbUrlToIdMap.set(configuration.endpoint.address, id);
                break;
            case AWS_REDSHIFT_CLUSTER:
                if(configuration.endpoint != null) dbUrlToIdMap.set(configuration.endpoint.address, id);
                break;
            case AWS_S3_BUCKET:
                s3ResourceIdToRegionMap.set(resourceId, awsRegion);
                break
            default:
                break;
        }
    }

    return {
        dbUrlToIdMap,
        resourceIdentifierToIdMap,
        targetGroupToAsgMap,
        elbDnsToResourceIdMap,
        asgResourceNameToResourceIdMap,
        s3ResourceIdToRegionMap,
        envVarResourceIdentifierToIdMap
    }
}

module.exports = createLookUpMaps;