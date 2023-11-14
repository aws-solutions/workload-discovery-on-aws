// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const gremlin = require('gremlin');
const R = require('ramda');
const {lambdaRequestTracker} = require('pino-lambda');
const __ = gremlin.process.statics;
const c = gremlin.process.column
const p = gremlin.process.P;
const {local} = gremlin.process.scope;
const {cardinality: {single}, t} = gremlin.process;
const logger = require('./logger');
const {create: createGremlinClient} = require('neptune-lambda-client');

const gremlinClient = createGremlinClient(process.env.neptuneConnectURL, process.env.neptunePort);

const withRequest = lambdaRequestTracker();

function getResourceGraph({query}, {ids, pagination: {start, end}}) {
    return query(async g => {
        if(R.isEmpty(ids)) {
            return {nodes: [], edges: []}
        }

        return g.with_('Neptune#enableResultCacheWithTTL', 30)
            .V(...ids).aggregate('nodes')
            .bothE().aggregate('edges').otherV().aggregate('nodes')
            .outE('IS_CONTAINED_IN_VPC', 'IS_ASSOCIATED_WITH_VPC', 'IS_CONTAINED_IN_SUBNET', 'IS_ASSOCIATED_WITH_SUBNET').aggregate('edges').inV().aggregate('nodes')
            .cap('nodes', 'edges')
            .fold()
            .select('nodes', 'edges')
            .by(__.unfold().dedup().elementMap().fold().range(local, start, end))
            .by(__.unfold().dedup()
                .project('id', 'label', 'target','source')
                    .by(t.id)
                    .by(t.label)
                    .by(__.inV())
                    .by(__.outV())
                .fold().range(local, start, end))
            .next()
            .then(x => x.value)
            .then(({nodes, edges}) => {
                return {
                    edges,
                    nodes: nodes.map(({id, label, md5Hash, ...properties}) => {
                        return {
                            id,
                            label,
                            md5Hash,
                            properties
                        };
                    })
                };
            });
    });
}

function createAccountPredicates(accounts) {
    return accounts.map(({accountId, regions}) => {
            return regions == null ?
                __.has('accountId', accountId) :
                __.has('accountId', accountId).has('awsRegion', p.within(R.pluck('name', regions)))

        }
    );
}

function getResources({query}, {resourceTypes = [], accounts = [], pagination: {start, end}}) {
    return query(async g => {
        let q = g.with_('Neptune#enableResultCacheWithTTL', 60).V();

        if (!R.isEmpty(resourceTypes)) q = q.hasLabel(...resourceTypes.map(R.replace(/::/g, '_')));

        if (!R.isEmpty(accounts)) {
            q = q.or(...createAccountPredicates(accounts));
        }

        return q.range(start, end).elementMap().toList()
            .then(R.map(({id, label, md5Hash, ...properties}) => {
                return {
                    id, label: label.replace(/_/g, '::'), md5Hash, properties
                };
            }));
    });
}

function addResources({query}, resources) {
    return query(async g => {
        return g.inject(resources).unfold().as('nodes')
            .addV(__.select('nodes').select('label')).as('v')
            .property(t.id, __.select('nodes').select('id'))
            .property('md5Hash', __.select('nodes').select('md5Hash'))
            .select('nodes').select('properties').unfold().as('kv')
            .select('v').property(__.select('kv').by(c.keys), __.select('kv').by(c.values))
            .toList();
    });
}

function updateResources({query}, resources) {
    return query(async g => {
        return resources.reduce((q, {id, md5Hash, properties}) => {
            return Object.entries(properties).reduce((acc, [k, v]) => {
                acc.property(single, k, v);
                return acc;
            }, q.V(id).property(single, 'md5Hash', md5Hash));
        }, g)
            .next()
            .then(() => resources.map(R.pick(['id'])));
    });
}

function addRelationships({query}, relationships) {
    return query(async g => {
        if (R.isEmpty(relationships)) return [];

        return relationships.reduce((q, {source, label, target}) => {
            return q.V(source)
                .addE(label).to(__.V(target))
                .project('id', 'label', 'target','source')
                    .by(t.id)
                    .by(t.label)
                    .by(__.inV())
                    .by(__.outV())
                .aggregate('edges')
        }, g)
            .select('edges')
            .next()
            .then(x => x.value)
    });
}

function getRelationships({query}, {pagination: {start, end}}) {
    return query(async g => {
        return g.with_('Neptune#enableResultCacheWithTTL', 60)
            .E()
            .range(start, end)
            .project('id', 'label', 'target','source')
                .by(t.id)
                .by(t.label)
                .by(__.inV())
                .by(__.outV())
            .toList()
    });
}

function deleteRelationships({query}, relationshipIds) {
    return query(async g => {
        return g.E(...relationshipIds)
            .drop()
            .next()
            .then(() => relationshipIds);
    });
}

function deleteAllResources({query}) {
    return query(async g => {
        return g.V().drop().next();
    });
}

function deleteResources({query}, resourceIds) {
    return query(async g => {
        return g.V(...resourceIds)
            .drop()
            .next()
            .then(() => resourceIds);
    });
}

const isArn = R.test(/arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):.*/);
const MAX_PAGE_SIZE = 2500;

function handler(gremlinClient) {
    return async (event, context) => {
        withRequest(event, context);

        const args = event.arguments;
        const fieldName = event.info.fieldName;

        logger.info({arguments: args, operation: fieldName}, 'GraphQL arguments:');

        const pagination = args?.pagination ?? {start: 0, end: 1000};

        if((pagination.end - pagination.start) > MAX_PAGE_SIZE) {
            return Promise.reject(new Error(`Maximum page size is ${MAX_PAGE_SIZE}.`));
        }

        switch (fieldName) {
            case 'addRelationships':
                return addRelationships(gremlinClient, args.relationships);
            case 'deleteRelationships':
                return deleteRelationships(gremlinClient, args.relationshipIds);
            case 'getRelationships':
                return getRelationships(gremlinClient, {pagination});
            case 'addResources':
                return addResources(gremlinClient, args.resources);
            case 'deleteAllResources':
                return deleteAllResources(gremlinClient);
            case 'deleteResources':
                if(R.isEmpty(args.resourceIds)) return [];
                return deleteResources(gremlinClient, args.resourceIds);
            case 'getResources':
                if (R.isEmpty(args.resourceTypes)) return []
                const resourceTypes = args.resourceTypes ?? [];
                const accounts = args.accounts ?? []
                return getResources(gremlinClient, {pagination, resourceTypes, accounts});
            case 'getResourceGraph':
                const invalidArns = R.filter(id => !isArn(id), args.ids);
                if (!R.isEmpty(invalidArns)) {
                    logger.error({invalidArns}, 'Invalid ARNs provided. ');
                    throw new Error('The following ARNs are invalid: ' + invalidArns);
                }
                return getResourceGraph(gremlinClient, {ids: args.ids, pagination});
            case 'updateResources':
                return updateResources(gremlinClient, args.resources);
            default:
                return Promise.reject(new Error(`Unknown field, unable to resolve ${event.info.fieldName}.`));
        }
    }
}

exports.handler = handler(gremlinClient);
