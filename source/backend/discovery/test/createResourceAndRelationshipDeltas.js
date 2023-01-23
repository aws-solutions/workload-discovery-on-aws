// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {assert} = require('chai');
const R = require('ramda');
const {
    AWS_API_GATEWAY_METHOD,
    AWS_EKS_NODE_GROUP,
    AWS_API_GATEWAY_RESOURCE,
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP,
    AWS_EC2_SPOT,
    AWS_IAM_AWS_MANAGED_POLICY,
    AWS_ECS_TASK,
    AWS_EC2_INSTANCE,
    AWS_EC2_VPC,
    AWS_IAM_ROLE,
    CONTAINS,
    IS_CONTAINED_IN,
    IS_ASSOCIATED_WITH,
    VPC,
    AWS_LAMBDA_FUNCTION,
    AWS_RDS_DB_CLUSTER,
    AWS_RDS_DB_INSTANCE,
    AWS_SNS_TOPIC,
    AWS_SQS_QUEUE
} = require('../src/lib/constants');
const {generate} = require('./generator');
const createResourceAndRelationshipDeltas = require('../src/lib/createResourceAndRelationshipDeltas');
const {dbResources} = require("./fixtures/createResourceAndRelationshipDeltas/resources/sdkResources.json");
const {resources} = require("./fixtures/createResourceAndRelationshipDeltas/resources/deletedResources.json");

describe('createResourceAndRelationshipDeltas',  () => {

    describe('resources', () => {

        it('should calculate sdk discovered resource updates and ignore unchanged resources', async () => {
            const {dbResources, resources} = require('./fixtures/createResourceAndRelationshipDeltas/resources/sdkResources.json');

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                resourceIdsToDelete, resourcesToStore, resourcesToUpdate
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            assert.lengthOf(resourceIdsToDelete, 0);
            assert.lengthOf(resourcesToStore, 0);

            const actualUpdateEksNg = resourcesToUpdate.find(x => x.md5Hash === resources[AWS_EKS_NODE_GROUP].md5Hash);
            assert.deepEqual(actualUpdateEksNg, {
                id: resources[AWS_EKS_NODE_GROUP].id,
                md5Hash: resources[AWS_EKS_NODE_GROUP].md5Hash,
                properties: R.omit(['g'], resources[AWS_EKS_NODE_GROUP].properties)
            });

            const actualUpdateTg = resourcesToUpdate.find(x => x.md5Hash === resources[AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP].md5Hash);
            assert.deepEqual(actualUpdateTg, {
                id: resources[AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP].id,
                md5Hash: resources[AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP].md5Hash,
                properties: R.omit(['e'], resources[AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP].properties)
            });


            const actualSpotInstance = resourcesToUpdate.find(x => x.md5Hash === resources[AWS_EC2_SPOT].md5Hash);
            assert.deepEqual(actualSpotInstance, {
                id: resources[AWS_EC2_SPOT].id,
                md5Hash: resources[AWS_EC2_SPOT].md5Hash,
                properties: R.omit(['i'], resources[AWS_EC2_SPOT].properties)
            });

            const actualManagedPolicy = resourcesToUpdate.find(x => x.md5Hash === resources[AWS_IAM_AWS_MANAGED_POLICY].md5Hash);
            assert.deepEqual(actualManagedPolicy, {
                id: resources[AWS_IAM_AWS_MANAGED_POLICY].id,
                md5Hash: resources[AWS_IAM_AWS_MANAGED_POLICY].md5Hash,
                properties: resources[AWS_IAM_AWS_MANAGED_POLICY].properties
            });

        });

        it('should calculate resources to store for config discovered resources', async () => {
            const {dbResources, resources} = require('./fixtures/createResourceAndRelationshipDeltas/resources/storedResources.json');

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                resourcesToStore
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            assert.lengthOf(resourcesToStore, 3);

            const actualStoreInstance = resourcesToStore.find(x => x.id === resources[AWS_EC2_INSTANCE].id);
            assert.deepEqual(actualStoreInstance, {
                id: resources[AWS_EC2_INSTANCE].id,
                md5Hash: resources[AWS_EC2_INSTANCE].md5Hash,
                label: AWS_EC2_INSTANCE.replace(/::/g, "_"),
                properties: resources[AWS_EC2_INSTANCE].properties
            });

            const actualStoreVpc = resourcesToStore.find(x => x.id === resources[AWS_EC2_VPC].id);
            assert.deepEqual(actualStoreVpc, {
                id: resources[AWS_EC2_VPC].id,
                md5Hash: resources[AWS_EC2_VPC].md5Hash,
                label: AWS_EC2_VPC.replace(/::/g, "_"),
                properties: resources[AWS_EC2_VPC].properties
            });

            const actualStoreRole = resourcesToStore.find(x => x.id === resources[AWS_IAM_ROLE].id);
            assert.deepEqual(actualStoreRole, {
                id: resources[AWS_IAM_ROLE].id,
                md5Hash: resources[AWS_IAM_ROLE].md5Hash,
                label: AWS_IAM_ROLE.replace(/::/g, "_"),
                properties: resources[AWS_IAM_ROLE].properties
            });
        });

        it('should calculate deleted resources', async () => {
            const {dbResources, resources} = require('./fixtures/createResourceAndRelationshipDeltas/resources/deletedResources.json');

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                resourceIdsToDelete
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            assert.lengthOf(resourceIdsToDelete, 3);

            assert.include(resourceIdsToDelete, dbResources[AWS_API_GATEWAY_RESOURCE].id);
            assert.include(resourceIdsToDelete, dbResources[AWS_API_GATEWAY_METHOD].id);
            assert.include(resourceIdsToDelete, dbResources[AWS_ECS_TASK].id);
        });

        it('should calculate resources from Config to update', async () => {
            const {dbResources, resources} = require('./fixtures/createResourceAndRelationshipDeltas/resources/configUpdated.json');

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                resourcesToUpdate
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            assert.lengthOf(resourcesToUpdate, 2);

            const actualStoreInstance = resourcesToUpdate.find(x => x.id === resources[AWS_EC2_INSTANCE].id);
            assert.deepEqual(actualStoreInstance, {
                id: resources[AWS_EC2_INSTANCE].id,
                md5Hash: resources[AWS_EC2_INSTANCE].md5Hash,
                properties: R.omit(['a'], resources[AWS_EC2_INSTANCE].properties)
            });

            const actualStoreVpc = resourcesToUpdate.find(x => x.id === resources[AWS_EC2_VPC].id);
            assert.deepEqual(actualStoreVpc, {
                id: resources[AWS_EC2_VPC].id,
                md5Hash: resources[AWS_EC2_VPC].md5Hash,
                properties: resources[AWS_EC2_VPC].properties
            });
        });

        it('should not calculate updates for tags', async () => {
            const {dbResources, resources} = require('./fixtures/createResourceAndRelationshipDeltas/resources/tags.json');

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                resourcesToUpdate
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            assert.lengthOf(resourcesToUpdate, 0);
        });
    });

    describe('relationships', () => {

        it('should calculate stored relationships', async () => {
            const schema = require('./fixtures/createResourceAndRelationshipDeltas/relationships/stored.json');
            const {dbResources, resources} = generate(schema);

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                linksToAdd
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            const actualVpcRelationship = linksToAdd.find(x => x.source === resources[AWS_EC2_VPC].id);
            assert.deepEqual(actualVpcRelationship, {
                source: resources[AWS_EC2_VPC].id,
                target: resources[AWS_EC2_INSTANCE].id,
                label: CONTAINS.toUpperCase().trim()
            });

            const actualEc2Relationship = linksToAdd.find(x => x.source === resources[AWS_EC2_INSTANCE].id);
            assert.deepEqual(actualEc2Relationship, {
                source: resources[AWS_EC2_INSTANCE].id,
                target: resources[AWS_EC2_VPC].id,
                label: (`${IS_CONTAINED_IN}${VPC}`).toUpperCase().replace(/ /g, '_')
            });

        });


        it('should calculate cross region relationships', async () => {
            const schema = require('./fixtures/createResourceAndRelationshipDeltas/relationships/crossRegion.json');
            const {dbResources, resources} = generate(schema);

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                linksToAdd
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            const actualSqsRelationship = linksToAdd.find(x => x.source === resources[AWS_SNS_TOPIC].id);
            assert.deepEqual(actualSqsRelationship, {
                source: resources[AWS_SNS_TOPIC].id,
                target: resources[AWS_SQS_QUEUE].id,
                label: IS_ASSOCIATED_WITH.toUpperCase().trim().replace(/ /g, '_')
            });

        });

        it('should skip relationships where target has not been discovered', async () => {
            const schema = require('./fixtures/createResourceAndRelationshipDeltas/relationships/unknownRelationships.json');
            const {dbResources, resources, eni} = generate(schema);

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                linksToAdd
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            assert.lengthOf(linksToAdd, 2);
            const unknownRelationship = linksToAdd.find(x => x.target === eni.resourceId);
            assert.notExists(unknownRelationship);
        });

        it('should handle links to resources that use resourceName', async () => {
            const schema = require('./fixtures/createResourceAndRelationshipDeltas/relationships/resourceName.json');
            const {dbResources, resources} = generate(schema);

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                linksToAdd
            } = createResourceAndRelationshipDeltas(dbResourcesMap, new Map(), Object.values(resources));

            const actualRoleRelationship = linksToAdd.find(x => x.source === resources[AWS_LAMBDA_FUNCTION].id);
            assert.deepEqual(actualRoleRelationship, {
                source: resources[AWS_LAMBDA_FUNCTION].id,
                target: resources[AWS_IAM_ROLE].id,
                label: `${IS_ASSOCIATED_WITH}Role`.toUpperCase().replace(/ /g, '_')
            });

            const actualDbInstanceRelationship = linksToAdd.find(x => x.source === resources[AWS_RDS_DB_CLUSTER].id);
            assert.deepEqual(actualDbInstanceRelationship, {
                source: resources[AWS_RDS_DB_CLUSTER].id,
                target: resources[AWS_RDS_DB_INSTANCE].id,
                label: CONTAINS.trim().toUpperCase()
            });
        });

        it('should skip relationships that are already present in db', async () => {
            const schema = require('./fixtures/createResourceAndRelationshipDeltas/relationships/unchanged.json');
            const {dbResources, dbRelationships, resources} = generate(schema);

            const dbRelationshipsMap = Object.values(dbRelationships).reduce((acc,item) => {
                acc.set(`${item.source}_${item.label}_${item.target}`, item);
                return acc;
            }, new Map());

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                linksToAdd, linksToDelete
            } = createResourceAndRelationshipDeltas(dbResourcesMap, dbRelationshipsMap, Object.values(resources));

            assert.lengthOf(linksToAdd, 0)
            assert.lengthOf(linksToDelete, 0);;
        });

        it('should handle relationships that have been deleted', async () => {
            const schema = require('./fixtures/createResourceAndRelationshipDeltas/relationships/deleted.json');
            const {dbResources, dbRelationships, resources} = generate(schema);

            const dbRelationshipsMap = Object.values(dbRelationships).reduce((acc,item) => {
                acc.set(`${item.source}_${item.label}_${item.target}`, item);
                return acc;
            }, new Map());

            const dbResourcesMap = Object.values(dbResources)
                .reduce((acc, item) => {
                    acc.set(item.id, item);
                    return acc;
                }, new Map());

            const {
                linksToDelete
            } = createResourceAndRelationshipDeltas(dbResourcesMap, dbRelationshipsMap, Object.values(resources));

            assert.include(linksToDelete, dbRelationships[AWS_EC2_INSTANCE].id);
            assert.include(linksToDelete, dbRelationships[AWS_EC2_VPC].id);;
        });

    });

});