import { fetchImage } from '../../Utils/ImageSelector.js';
import { getAccountColour, getRegionColour } from '../../Utils/ColorCreator.js';
import { getCostData } from '../../Utils/Resources/CostCalculator.js';
import { parseNode } from './NodeParserHandler.js';

const R = require('ramda');
export const buildBoundingBox = (node, parent, level) => {
  try {
    const boundingBox = {
      edge: false,
      data: {
        id: parent ? `${node.label}-${parent}` : `${node.label}`,
        parent: parent,
        level: level,
        title: node.label,
        label: node.label,
        plainLabel: node.label,
        type: node.type,
        borderStyle: 'solid',
        color: '#fff',
        borderColour: '#AAB7B8',
        opacity: '0',
        image: !node.children[0].children
          ? fetchImage(node.children[0].label)
          : fetchImage(node.type),
        clickedId: node.id,
        cost: Number(0),
        hasChildren: node.children ? true : false,
        children: node.children,
        accountColour: getAccountColour(
          node.type === 'account' ? node.label : 'global'
        ),
        regionColour: getRegionColour(
          node.type === 'region' ? node.label : 'Multi-Region'
        ),
        aZColour: '#00A1C9',
        subnetColour: node.data
          ? node.data.properties.private
            ? '#147eba'
            : '#248814'
          : '#545B64',
      },
      classes: [`${node.type}`, 'removeAll'],
    };

    if (node.data) {
      // boundingBox.data.image = fetchImage(node.data.properties);
      boundingBox.data.properties = node.data.properties;
      boundingBox.data.resource = {
        id: node.data.properties.resourceId,
        name: node.data.properties.resourceName,
        value: node.data.properties.resourceValue,
        type: node.data.properties.resourceType,
        tags: node.data.properties.tags,
        arn: node.data.properties.arn,
        region: node.data.properties.awsRegion
          ? node.data.properties.awsRegion
          : 'Multi-Region',
        state: node.data.properties.state,
        loggedInURL: node.data.properties.loggedInURL,
        loginURL: node.data.properties.loginURL,
        accountId: node.data.properties.accountId
          ? node.data.properties.accountId
          : 'global',
      };
    }
    return boundingBox;
  } catch (e) {
    return {};
  }
};

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

export const buildNode = (node, parent, level, clickedNode) => {
  try {
    const properties = node.data ? node.data.properties : node.properties;
    const parsedNode = parseNode(properties, node);
    const builtNode = {
      edge: false,
      data: {
        arn: !R.isNil(properties.arn) ? properties.arn : findARN(properties),
        resourceId: buildResourceId(properties),
        parent: parent,
        level: level,
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
        state: parsedNode.state,
        image: parsedNode.icon,
        softDelete: properties.softDelete,
        cost: Number(getCostData(node)),
        private: properties.private ? true : false,
        detailsComponent: parsedNode.detailsComponent,
        hoverComponent: parsedNode.hoverComponent,
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
      builtNode.classes.push(
        builtNode.data.softDelete ? 'softDelete' : undefined,
        builtNode.data.highlight ? 'highlight' : undefined,
        builtNode.data.existing ? 'existing' : undefined,
        clickedNode ? 'clicked' : undefined,
        builtNode.data.resource && builtNode.data.resource.state
          ? builtNode.data.resource.state.className
          : undefined,
        'image',
        'selectable',
        'hoverover'
      );
    }
    return builtNode;
  } catch (e) {
    console.error(e);
    return {};
  }
};
