// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R  from 'ramda';
import {buildBoundingBox, buildNode} from "./NodeFactory/NodeFactory";

const isBoundingBox = R.includes(R.__, ['account', 'region', 'availabilityZone', 'vpc', 'subnet']);
const isRegional = R.includes(R.__, ['Not Applicable', 'Regional']);
const isSubnetOrVpc = R.includes(R.__, ['AWS_EC2_VPC', 'AWS_EC2_Subnet', 'AWS::EC2::VPC', 'AWS::EC2::Subnet']);

function createParent({accountId, awsRegion, availabilityZone, vpcId, subnetId}) {
    if (subnetId != null) {
        return `arn:aws:ec2:${awsRegion}:${accountId}:subnet/${subnetId}`.replace(/:/g, '-');
    } else if (vpcId != null && subnetId == null) {
        const vpcArn = `arn:aws:ec2:${awsRegion}:${accountId}:vpc/${vpcId}`.replace(/:/g, '-');
        if(!isRegional(availabilityZone)) {
           return  `${vpcArn}-${availabilityZone}`
        }
        return vpcArn;
    } else if (vpcId == null && subnetId == null && availabilityZone != null && !isRegional(availabilityZone)) {
        return `${accountId}-${awsRegion}-${availabilityZone}`;
    } else {
        return `${accountId}-${awsRegion}`;
    }
}

/* When we create the bounding boxes, there may be ones that have no children. This
   function creates an adjacency list from the nodes and edges and recursively identifies
   and deletes bounding boxes with no children until the only remaining bounding boxes are
   those with children.
* */
function removeEmptyBoundingBoxes(nodes) {
    const typeMap = new Map(nodes.map(({data: {id, type}}) => [id, type]));

    const adjList = nodes.reduce((acc, {data: {id}}) => {
        acc.set(id, new Set());
        return acc;
    }, new Map());

    nodes.forEach(({data: {id, parent}}) => {
        if(parent != null) {
            adjList.get(parent)?.add(id);
        }
    });

    const toDelete = new Set();
    for(const [id, edges] of adjList.entries()) {
        if(isBoundingBox(typeMap.get(id)) && edges.size === 0) {
            toDelete.add(id);
        }
    }

    toDelete.forEach(id => adjList.delete(id));

    return toDelete.size === 0 ? nodes : removeEmptyBoundingBoxes(nodes.filter(x => adjList.has(x.data.id)));
}

export function processElements({nodes, edges}) {
    const accountsBoundingBoxes = nodes.reduce((acc, {properties}) => {
        const {accountId} = properties;
        if(!acc.has(accountId)) {
            acc.set(accountId, buildBoundingBox({
                id: accountId, type: 'account', label: accountId, properties
            }));
        }
        return acc;
    }, new Map());

    const regionsBoundingBoxes = nodes.reduce((acc, {properties}) => {
        const {accountId, awsRegion} = properties;
        const id = `${accountId}-${awsRegion}`;
        if(!acc.has(id)) {
            acc.set(id, buildBoundingBox({
                id, type: 'region', label: awsRegion, properties
            }, accountId));
        }
        return acc;
    }, new Map());

    const availabilityZonesBoundingBoxes = nodes.reduce((acc, {properties}) => {
        const {accountId, awsRegion, availabilityZone, vpcId} = properties;
        const id = `${accountId}-${awsRegion}-${availabilityZone}`;
        const parent = `${accountId}-${awsRegion}`;
        if(availabilityZone != null && vpcId == null && !isRegional(availabilityZone) && !acc.has(id)) {
            acc.set(id, buildBoundingBox({
                id, type: 'availabilityZone', label: availabilityZone, properties
            }, parent));
        }
        return acc;
    }, new Map());

    const vpcBoundingBoxes = nodes.reduce((acc, {properties}) => {
        const {resourceType, vpcId, accountId, awsRegion, availabilityZone, arn, title} = properties;

        if(resourceType === 'AWS::EC2::VPC' || vpcId != null) {
            const vpcArn = (resourceType === 'AWS::EC2::VPC' ? arn : `arn:aws:ec2:${awsRegion}:${accountId}:vpc/${vpcId}`);
            const vpcBbId = vpcArn.replace(/:/g, '-');
            const azId = `${vpcBbId}-${availabilityZone}`;

            if(availabilityZone != null && !isRegional(availabilityZone) && !acc.has(azId)) {
                acc.set(azId, buildBoundingBox({
                    id: azId, type: 'availabilityZone', label: availabilityZone, properties
                }, vpcBbId));
            }

            if(resourceType === 'AWS::EC2::VPC') {
                const parent = `${accountId}-${awsRegion}`;
                if(!acc.has(vpcBbId)) {
                    acc.set(vpcBbId, buildBoundingBox({
                        id: vpcBbId, type: 'vpc', label: title, properties
                    }, parent));
                }
            }
        }

        return acc;
    }, new Map());

    const subnetBoundingBoxes = nodes.reduce((acc, {properties}) => {
        const {resourceType, accountId, awsRegion, availabilityZone, vpcId, private: isPrivate, arn, title} = properties;
        if(resourceType === 'AWS::EC2::Subnet') {

            const id = arn.replace(/:/g, '-');
            const parent = `arn:aws:ec2:${awsRegion}:${accountId}:vpc/${vpcId}`.replace(/:/g, '-');
            const azId = `${id}-${availabilityZone}`;

            if(availabilityZone != null && !['Not Applicable', 'Regional', 'Multiple Availability Zones'].includes(availabilityZone) && !acc.has(azId)) {
                acc.set(azId, buildBoundingBox({
                    id: azId, type: 'availabilityZone', label: availabilityZone, properties
                }, parent));
            }

            if(!acc.has(id)) {
                acc.set(id, buildBoundingBox({
                    id, type: 'subnet', label: title, isPrivate, properties
                }, azId));
            }
        }
        return acc;
    }, new Map());

    const typeBoundingBoxes = new Map();

    const elements = nodes
        .filter(x => !isSubnetOrVpc(x.properties.resourceType))
        .map(resource => {
            const {properties} = resource;
            const [, ,bbLabel] = properties.resourceType.split('::');

            const parent = createParent(properties);

            const bbId = `${bbLabel}-${parent}`
            if(!typeBoundingBoxes.has(bbId)) {
                typeBoundingBoxes.set(bbId, buildBoundingBox({
                    id: bbId, type: 'type', label: bbLabel, properties
                }, parent));
            }

            return buildNode(resource, bbId, false);
        });

    const allNodes = [
        ...Array.from(accountsBoundingBoxes.values()),
        ...Array.from(regionsBoundingBoxes.values()),
        ...Array.from(availabilityZonesBoundingBoxes.values()),
        ...Array.from(vpcBoundingBoxes.values()),
        ...Array.from(subnetBoundingBoxes.values()),
        ...Array.from(typeBoundingBoxes.values()),
        ...elements
    ];

    return [
        ...removeEmptyBoundingBoxes(allNodes),
        ...edges
            .filter(x => !(isSubnetOrVpc(x.target.label) || isSubnetOrVpc(x.source.label)))
            .map(({id, source, target}) => {
                return {group: "edges", data: {id, source: source.id, target: target.id}}
            })
    ];
}
