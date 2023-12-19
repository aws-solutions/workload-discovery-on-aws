// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fetchImage } from '../../Utils/ImageSelector.js';
import { getAccountColour, getRegionColour } from '../../Utils/ColorCreator.js';
import { getCostData } from '../../Utils/Resources/CostCalculator.js';
import { parseNode } from './NodeParserHandler.js';

import * as R  from 'ramda';

export const buildBoundingBox = ({id, type, label, properties}, parent) => {
    try {
        const boundingBox = {
            group: "nodes",
            data: {
                id,
                parent: parent,
                title: label,
                label: label,
                plainLabel: label,
                type: type,
                borderStyle: 'solid',
                color: '#fff',
                borderColour: '#AAB7B8',
                opacity: '0',
                image: fetchImage(type),
                clickedId: id,
                cost: Number(0),
                accountColour: getAccountColour(
                    type === 'account' ? label : 'global'
                ),
                regionColour: getRegionColour(
                    type === 'region' ? label : 'Multi-Region'
                ),
                aZColour: '#00A1C9',
                subnetColour: subnetColour({data: {properties}})
            },
            classes: [`${type}`, 'removeAll'],
        };

        if (['vpc', 'subnet'].includes(type)) {
            boundingBox.data.properties = properties;
            boundingBox.data.resource = {
                id: properties.resourceId,
                name: properties.resourceName,
                value: properties.resourceValue,
                type: properties.resourceType,
                tags: properties.tags,
                arn: properties.arn,
                region: properties.awsRegion ?? 'Multi-Region',
                state: properties.state,
                loggedInURL: properties.loggedInURL,
                loginURL: properties.loginURL,
                accountId: properties.accountId ?? 'global'
            };
        }
        return boundingBox;
    } catch (e) {
        return {};
    }
};

const subnetColour = (node) => {
  if (node.data) {
    if (node.data.properties.private) {
      return '#147eba'
    }
    else return '#248814'
  } 
  return '#545B64'
}

const findARN = (properties) => {
  return R.head(
    R.reduce(
      (acc, val) => {
        if (R.startsWith('arn:', val)) acc.push(val);
        return acc;
      },
      [],
      R.filter((e) => !R.isNil(e), R.values(properties))
    )
  );
};

const buildResourceId = (properties) =>
  Array.of(
    properties.resourceId,
    !R.isNil(properties.arn) ? properties.arn : findARN(properties)
  );

export const buildNode = (node, parent, clickedNode) => {
    try {
        const properties = node.data ? node.data.properties : node.properties;
        const parsedNode = parseNode(properties, node);
        const builtNode = {
            group: "nodes",
            data: {
                arn: !R.isNil(properties.arn) ? properties.arn : findARN(properties),
                resourceId: buildResourceId(properties),
                parent: parent,
                id: node.id,
                title: properties.title,
                label:
                    properties.title.length > 12
                        ? `${properties.title.substring(0, 12)}...`
                        : properties.title,
                shape: 'image',
                type: 'resource',
                accountColour: getAccountColour(
                    properties.accountId ? properties.accountId : 'global'
                ),
                regionColour: getRegionColour(
                    properties.awsRegion ? properties.awsRegion : 'Multi-Region'
                ),
                color: parsedNode.styling.colour,
                borderStyle: parsedNode.styling.borderStyle,
                borderColour: parsedNode.styling.borderColour,
                //   borderColour: state ? state.color : '#545B64',
                borderOpacity: parsedNode.styling.borderOpacity,
                //   borderOpacity: state ? '0.25' : '0',
                //   borderSize: state ? state.borderSize : 1,
                borderSize: parsedNode.styling.borderSize,
                opacity: '0',
                clickedId: node.id,
                ...({state: parsedNode.state} ?? {}),
                image: parsedNode.icon,
                cost: Number(getCostData(node)),
                private: properties.private,
                ...({detailsComponent: parsedNode.detailsComponent} ?? {}),
                ...({hoverComponent: parsedNode.hoverComponent} ?? {}),
                resource: {
                    id: properties.resourceId,
                    name: properties.resourceName,
                    value: properties.resourceValue,
                    type: properties.resourceType,
                    tags: properties.tags,
                    arn: !R.isNil(properties.arn) ? properties.arn : findARN(properties),
                    region: properties.awsRegion ? properties.awsRegion : 'Multi-Region',
                    state: properties.state,
                    loggedInURL: properties.loggedInURL,
                    loginURL: properties.loginURL,
                    accountId: properties.accountId ? properties.accountId : 'global',
                },
                highlight: true,
                existing: false,
                properties: properties,
            },
            classes: [`resource`],
        };
        if (builtNode.data.type === 'resource') {
            builtNode.classes.push(...createClasses(builtNode, clickedNode));
        }
        return builtNode;
    } catch (e) {
        console.error(e);
        return {};
    }
};

function createClasses(builtNode, clickedNode) {
    return R.reject(R.isNil, [
        builtNode.data.highlight ? 'highlight' : undefined,
        builtNode.data.existing ? 'existing' : undefined,
        clickedNode ? 'clicked' : undefined,
        builtNode.data.resource && builtNode.data.resource.state
            ? builtNode.data.resource.state.className
            : undefined,
        'image',
        'selectable',
        'hoverover'
    ]);
}
