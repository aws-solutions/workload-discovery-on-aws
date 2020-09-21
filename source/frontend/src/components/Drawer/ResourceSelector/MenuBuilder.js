const sortTypes = (a, b) => {
  if (a.label.toLowerCase() > b.label.toLowerCase()) {
    return 1;
  }
  if (a.label.toLowerCase() < b.label.toLowerCase()) {
    return -1;
  }
  return 0;
};

export const buildResourceTypes = (resources) => {
  try {
    const resourceFilter = new Map();
    resources.map((filter) =>
      filter.nodes.map((node, index) => {
        if (resourceFilter.has(node.mainType)) {
          const subTypes = resourceFilter.get(node.mainType);
          subTypes.set(node.subType, buildSubType(node, false, resources));
        } else {
          const subTypeMap = new Map();
          subTypeMap.set(node.subType, buildSubType(node, false, resources));
          // subTypeMap.get(node.subType).nodes.sort((a, b) => sortTypes(a, b));
          resourceFilter.set(node.mainType, subTypeMap);
        }
      })
    );
    const resourceArray = [...resourceFilter.keys()]
      .map((mainType) => buildMainType(false, mainType, resourceFilter))
      .sort((a, b) => sortTypes(a, b));
    return resourceArray;
  } catch (e) {
    return [];
  }
};

export const buildResources = (resources) => {
  try {
    const resourceFilter = new Map();
    resources.map((filter) =>
      filter.nodes.map((node, index) => {
        if (resourceFilter.has(node.mainType)) {
          const subTypes = resourceFilter.get(node.mainType);
          if (subTypes.has(node.subType)) {
            subTypes.get(node.subType).nodes.push(buildResourceNode(node));
          } else {
            subTypes.set(node.subType, buildSubType(node, false, resources));
          }
          subTypes.get(node.subType).nodes.sort((a, b) => sortTypes(a, b));
        } else {
          const subTypeMap = new Map();
          subTypeMap.set(node.subType, buildSubType(node, false, resources));
          subTypeMap.get(node.subType).nodes.sort((a, b) => sortTypes(a, b));
          resourceFilter.set(node.mainType, subTypeMap);
        }
      })
    );
    const resourceArray = [...resourceFilter.keys()]
      .map((mainType) => buildMainType(false, mainType, resourceFilter))
      .sort((a, b) => sortTypes(a, b));
    return resourceArray;
  } catch (e) {
    return [];
  }
};

const buildMainType = (type, mainType, resourceFilter) => {
  const mainTypes = [...resourceFilter.get(mainType).keys()]
    .map((subType) => {
      return resourceFilter.get(mainType).get(subType);
    })
    .sort((a, b) => sortTypes(a, b));

  return {
    key: mainType,
    label: `${mainType} (${mainTypes.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.count;
    }, 0)})`,
    nodes: mainTypes,
  };
};

const buildResourceNode = (node) => {
  return {
    key: node.id,
    label:
      node.title.length > 30
        ? `${node.title.substring(0, 30)}...`
        : `${node.title}`,
    fullLabel: node.title,
    filter: {
      resourceId: node.id,
      resourceType: `AWS::${node.mainType}::${node.subType}`,
    },
    nodeId: node.id,
  };
};

const buildSubType = (node, resourceType, resources) => {
  const subTypeCount = getSubTypeCount(
    `AWS::${node.mainType}::${node.subType}`,
    resources
  );
  return {
    key: node.subType,
    label: `${node.subType} (${subTypeCount})`,
    count: subTypeCount,
    nodes: resourceType
      ? []
      : [
          {
            key: node.id,
            label:
              node.title.length > 30
                ? `${node.title.substring(0, 30)}...`
                : `${node.title}`,
            fullLabel: node.title,
            filter: {
              resourceId: node.id,
              resourceType: `AWS::${node.mainType}::${node.subType}`,
            },
            nodeId: node.id,
          },
        ],
    filter: { resourceType: `AWS::${node.mainType}::${node.subType}` },
  };
};

const getSubTypeCount = (resourceType, resources) => {
  let currentCount = 0;
  resources.map((filter) => {
    filter.metaData.resourceTypes.map((type) => {
      if (Object.keys(type)[0] === resourceType)
        currentCount += type[`${resourceType}`];
    });
  });
  return currentCount;
};

export const getResourceCount = (resources) =>
  resources.reduce((acc, filter) => {
    return (
      acc +
      filter.nodes.filter((node) => node.accountId)
        .length
    );
  }, 0);

export const getResourceTypeCount = (resources) =>
  resources.reduce((acc, filter) => {
    return acc + filter.metaData.resourceTypes.length;
  }, 0);
