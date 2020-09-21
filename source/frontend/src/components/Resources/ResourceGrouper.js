


const resourceIdForType = (resources) => {
  let resourceIds = [];
  resources.forEach(node => {
    node.parentId = getSubTypeforResource(node.data.resource.type, resources)
    node.id = node.data.id;
    resourceIds.push(node);
  })
  const resourceTypes = getResourceTypes(resources);
  const resourceSubTypes = getResourceSubTypes(resources)    
  resourceTypes.forEach(resource => resourceIds.push(resource))
  resourceSubTypes.forEach(resource => resourceIds.push(resource))
  return resourceIds;
}

const getSubTypeforResource = (type, resources) => {
  const splitType = type.split("::");
  const nodeType = splitType[2];

  // const mainTypes = resourceTypes(resources);
  const subTypes = getResourceSubTypes(resources);

  return subTypes.filter(item => {
    return item.subType === nodeType
  })[0].id;

}

const getResourceTypes = (resources) => {
  let resourceTypes = [];
  resources.forEach(node => {
    const mainType = node.data.resource.type.split('::')[1]
    resourceTypes.push({ id: mainType, mainType: mainType, region: node.data.resource.region, accountId: node.data.resource.accountId });
  })
  return resourceTypes;
}

const getResourceSubTypes = (resources) => {
  let resourceTypes = [];
  resources.forEach(node => {
    const splitType = node.data.resource.type.split('::');
    const subType = splitType[2];
    resourceTypes.push({ id: subType, data: node.data, subType: subType, parentId: splitType[1], imageUrl: node.data.image, state: node.data.state, accountColour: node.data.accountColour, regionColour: node.data.regionColour, region: node.data.resource.region, accountId: node.data.resource.accountId });
  })
  return resourceTypes;
}

export const getGroupedResources = (resources) => {
  return resourceIdForType(resources);
}