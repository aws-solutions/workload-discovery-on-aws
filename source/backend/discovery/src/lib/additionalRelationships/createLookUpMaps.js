const R = require("ramda");
const {
    AWS_AUTOSCALING_AUTOSCALING_GROUP,
    AWS_ELASTICSEARCH_DOMAIN,
    AWS_OPENSEARCH_DOMAIN,
    AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER,
    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
    AWS_RDS_DB_CLUSTER
} = require("../constants");
const {createResourceNameKey, createResourceIdKey} = require('../utils');

function getEndpoint(configuration) {
    const endpoint = configuration.endpoint ?? configuration.Endpoint;
    return endpoint?.value ?? endpoint?.address ?? endpoint;
}

function createLookUpMaps(resources) {
    const targetGroupToAsgMap = new Map();
    const resourceIdentifierToIdMap = new Map();
    // we can't reuse resourceIdentifierToIdMap because we don't know the resource type for env vars
    const envVarResourceIdentifierToIdMap = new Map();
    const endpointToIdMap = new Map();
    const elbDnsToResourceIdMap = new Map();
    const asgResourceNameToResourceIdMap = new Map();

    for(let resource of resources) {
        const {id, resourceType, resourceId, resourceName, accountId, awsRegion, arn, configuration} = resource;
        const endpoint = getEndpoint(configuration);

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

        if(endpoint != null) {
            endpointToIdMap.set(endpoint, id);
        }

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
            case AWS_OPENSEARCH_DOMAIN:
                const endpoints = configuration.endpoints ?? configuration.Endpoints ?? [];
                Object.values(endpoints).forEach(endpoint => endpointToIdMap.set(endpoint, id));
                break;
            case AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER:
            case AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER:
                const dnsName = configuration.dnsname ?? configuration.dNSName;
                elbDnsToResourceIdMap.set(dnsName, {resourceId, resourceType, awsRegion});
                break;
            case AWS_RDS_DB_CLUSTER:
                if(configuration.readerEndpoint != null) endpointToIdMap.set(configuration.readerEndpoint, id);
                break;
            default:
                break;
        }
    }

    return {
        endpointToIdMap,
        resourceIdentifierToIdMap,
        targetGroupToAsgMap,
        elbDnsToResourceIdMap,
        asgResourceNameToResourceIdMap,
        envVarResourceIdentifierToIdMap
    }
}

module.exports = createLookUpMaps;