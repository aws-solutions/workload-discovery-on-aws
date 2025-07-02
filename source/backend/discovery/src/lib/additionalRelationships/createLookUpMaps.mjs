import * as R from 'ramda';
import {
    AWS_AUTOSCALING_AUTOSCALING_GROUP,
    AWS_ELASTICSEARCH_DOMAIN,
    AWS_OPENSEARCH_DOMAIN,
    AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER,
    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER,
    AWS_EVENT_RULE,
    AWS_RDS_DB_CLUSTER,
    EVENTS,
    EVENT_BUS,
} from '../constants.mjs';
import {
    createResourceNameKey,
    createResourceIdKey,
    createArn,
} from '../utils.mjs';

function getEndpoint(configuration) {
    const endpoint = configuration.endpoint ?? configuration.Endpoint;
    return endpoint?.value ?? endpoint?.address ?? endpoint;
}

function createResourceTypeLookUpMaps(resources) {
    const targetGroupToAsgMap = new Map();
    const endpointToIdMap = new Map();
    const elbDnsToResourceIdMap = new Map();
    const asgResourceNameToResourceIdMap = new Map();
    const eventBusRuleMap = new Map();

    const handlers = {
        [AWS_AUTOSCALING_AUTOSCALING_GROUP]: resource => {
            const {
                resourceId,
                resourceName,
                accountId,
                awsRegion,
                arn,
                configuration,
            } = resource;
            configuration.targetGroupARNs.forEach(tg =>
                targetGroupToAsgMap.set(tg, {
                    arn,
                    instances: new Set(
                        configuration.instances.map(R.prop('instanceId'))
                    ),
                })
            );
            asgResourceNameToResourceIdMap.set(
                createResourceNameKey({resourceName, accountId, awsRegion}),
                resourceId
            );
        },
        [AWS_ELASTICSEARCH_DOMAIN]: ({id, configuration: {endpoints = []}}) => {
            Object.values(endpoints).forEach(endpoint =>
                endpointToIdMap.set(endpoint, id)
            );
        },
        [AWS_OPENSEARCH_DOMAIN]: ({id, configuration: {Endpoints = []}}) => {
            Object.values(Endpoints).forEach(endpoint =>
                endpointToIdMap.set(endpoint, id)
            );
        },
        [AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER]: ({
            resourceId,
            resourceType,
            awsRegion,
            configuration,
        }) => {
            elbDnsToResourceIdMap.set(configuration.dnsname, {
                resourceId,
                resourceType,
                awsRegion,
            });
        },
        [AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER]: ({
            resourceId,
            resourceType,
            awsRegion,
            configuration,
        }) => {
            elbDnsToResourceIdMap.set(configuration.dNSName, {
                resourceId,
                resourceType,
                awsRegion,
            });
        },
        [AWS_EVENT_RULE]: ({
            id,
            accountId,
            awsRegion,
            configuration: {EventBusName},
        }) => {
            const eventBusArn = EventBusName.startsWith('arn:')
                ? EventBusName
                : createArn({
                      service: EVENTS,
                      accountId,
                      region: awsRegion,
                      resource: `${EVENT_BUS}/${EventBusName}`,
                  });
            if (!eventBusRuleMap.has(eventBusArn))
                eventBusRuleMap.set(eventBusArn, []);
            eventBusRuleMap.get(eventBusArn).push(id);
        },
        [AWS_RDS_DB_CLUSTER]: ({id, configuration: {readerEndpoint}}) => {
            if (readerEndpoint != null) endpointToIdMap.set(readerEndpoint, id);
        },
    };

    for (let resource of resources) {
        const {id, resourceType, configuration} = resource;
        const endpoint = getEndpoint(configuration);

        if (endpoint != null) {
            endpointToIdMap.set(endpoint, id);
        }

        const handler = handlers[resourceType];
        if (handler != null) handler(resource);
    }

    return {
        endpointToIdMap,
        targetGroupToAsgMap,
        elbDnsToResourceIdMap,
        asgResourceNameToResourceIdMap,
        eventBusRuleMap,
    };
}

function createLookUpMaps(resources) {
    const resourceIdentifierToIdMap = new Map();
    // we can't reuse resourceIdentifierToIdMap because we don't know the resource type for env vars
    const envVarResourceIdentifierToIdMap = new Map();

    for (let resource of resources) {
        const {
            id,
            resourceType,
            resourceId,
            resourceName,
            accountId,
            awsRegion,
        } = resource;

        if (resourceName != null) {
            envVarResourceIdentifierToIdMap.set(
                createResourceNameKey({resourceName, accountId, awsRegion}),
                id
            );
            resourceIdentifierToIdMap.set(
                createResourceNameKey({
                    resourceName,
                    resourceType,
                    accountId,
                    awsRegion,
                }),
                id
            );
        }

        resourceIdentifierToIdMap.set(
            createResourceIdKey({
                resourceId,
                resourceType,
                accountId,
                awsRegion,
            }),
            id
        );
        envVarResourceIdentifierToIdMap.set(
            createResourceIdKey({resourceId, accountId, awsRegion}),
            id
        );
    }

    return {
        resourceIdentifierToIdMap,
        envVarResourceIdentifierToIdMap,
        ...createResourceTypeLookUpMaps(resources),
    };
}

export default createLookUpMaps;
