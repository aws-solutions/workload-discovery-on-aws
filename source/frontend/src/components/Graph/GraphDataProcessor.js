import { getAccountColour, getRegionColour } from '../../Utils/ColorCreator';

const fetchAccounts = (metadata, resources) => {
  const accounts = new Map();

  resources.size > 0 && metadata.forEach((regions, account) => {
    const regionResources = getRegionsForAccount(resources, account, regions)
    if (regionResources.size > 0) accounts.set(account, regionResources)
  })
  return accounts;
}

const getRegionsForAccount = (resources, accountId, regions) => {

  const regionsResources = new Map();
  regions.map(region => {
    const mainTypes = getMainTypesForRegionAndAccountId(resources, accountId, region.region);
    if (mainTypes.size > 0) regionsResources.set(region.region, mainTypes);
  })
  return regionsResources;
}

const getMainTypesForRegionAndAccountId = (resources, accountId, region) => {

  const mainTypes = new Map();
  resources.forEach(node => {
    if (node.resource.accountId === accountId && node.resource.region === region) {
      const mainType = getMainTypeName(node);
      mainTypes.set(mainType, getSubTypeForMainType(resources, accountId, region, mainType))
    }
  })
  return mainTypes;
}

const getMainTypeName = (node) => {
  return node.resource.type.split('::')[1]
}

const getSubTypeForMainType = (resources, accountId, region, mainType) => {

  const subTypes = new Map();
  resources.forEach(node => {
    if (node.resource.accountId === accountId && node.resource.region === region && getMainTypeName(node) === mainType) {
      const subType = getSubTypeName(node);
      subTypes.set(subType, getResourcesForSubType(resources, accountId, region, mainType, subType))
    }
  })
  return subTypes;
}

const getSubTypeName = (node) => {
  const splitType = node.resource.type.split('::');
  return splitType.length > 2 ? splitType[2] : splitType[1];
}

const getResourcesForSubType = (resources, accountId, region, mainType, subType) => {

  const resourceTypes = [];
  resources.forEach(node => {
    if (node.resource.accountId === accountId
      && node.resource.region === region
      && getMainTypeName(node) === mainType
      && getSubTypeName(node) === subType) {
      resourceTypes.push(node)
    }
  })
  return resourceTypes;
}

export const buildGraphDataSet = (metadata, resources) => {

  return fetchAccounts(metadata, resources);
}

export const buildAccount = (account, graphPositions) => {  
  const accountBoundingBox = {
    data: {
      id: account,
      label: account,
      color: '#fff',
      borderStyle: 'dashed',
      opacity: '0',
      accountColour: getAccountColour(account ? account : 'global')
    },
    classes: ['account']
  }
  if (graphPositions.size > 0 && graphPositions.get(account)) accountBoundingBox.renderedPosition = { x: graphPositions.get(account).x, y: graphPositions.get(account).y }
  return accountBoundingBox;
}

export const buildRegion = (account, region, graphPositions) => {
  const id = `${account}-${region}`;
  const regionBoundingBox = {
    data: {
      id: id,
      parent: account,
      label: region,
      color: '#fff',
      borderStyle: 'dashed',
      opacity: '0',
      regionColour: getRegionColour(region ? region : 'Multi-Region')
    },
    classes: ['region']
  }
  if (graphPositions.size > 0 && graphPositions.get(id)) regionBoundingBox.renderedPosition = { x: graphPositions.get(id).x, y: graphPositions.get(id).y }
  return regionBoundingBox;
}

export const buildMainType = (account, region, mainType, graphPositions) => {
  const id = `${account}-${region}-${mainType}`;
  const mainTypeBoundingBox = {
    data: {
      id: id,
      parent: `${account}-${region}`,
      label: mainType,
      color: '#fff',
      borderStyle: 'dashed',
      opacity: '0',
      borderColour: '#AAB7B8'
    },
    classes: ['mainType']
  }
  if (graphPositions.size > 0 && graphPositions.get(id)) mainTypeBoundingBox.renderedPosition = { x: graphPositions.get(id).x, y: graphPositions.get(id).y }
  return mainTypeBoundingBox;
}

export const buildSubType = (account, region, mainType, subType, graphPositions) => {
  const id = `${account}-${region}-${mainType}-${subType}`;
  const subTypeBoundingBox = {
    data: {
      id: id,
      parent: `${account}-${region}-${mainType}`,
      label: subType,
      color: '#fff',
      borderStyle: 'dashed',
      opacity: '0',
      borderColour: '#AAB7B8'
    },
    classes: ['subType']
  }
  if (graphPositions.size > 0 && graphPositions.get(id)) subTypeBoundingBox.renderedPosition = { x: graphPositions.get(id).x, y: graphPositions.get(id).y }
  return subTypeBoundingBox;
}

export const buildResourceType = (account, region, mainType, subType, resourceType, graphPositions) => {
  const resource = {
    data: {
      id: resourceType.id,
      parent: `${account}-${region}-${mainType}-${subType}`,
      label: `${resourceType.label.substring(0, 12)}...`,
      color: '#fff',
      image: resourceType.image,
      borderStyle: 'solid',
      opacity: '0',
      node: resourceType,
      clickedId: resourceType.id,

    },
    classes: [resourceType.state ? resourceType.state.className : undefined, 'image', 'selectable', resourceType.highlight ? 'highlight' : undefined, resourceType.existing ? 'existing' : undefined]
  }
  if (graphPositions.size > 0 && graphPositions.get(resourceType.id)) resource.renderedPosition = { x: graphPositions.get(resourceType.id).x, y: graphPositions.get(resourceType.id).y }
  return resource;
}