import {
  sendGetRequest,
  sendPostRequest,
  requestWrapper
} from '../../API/APIHandler';
import {
  processDeletedNodes,
  processHierarchicalNodeData
} from '../../API/APIProcessors';
import { handleSelectedResource } from '../../API/Processors/NodeProcessors';

export const getHierachicalLinkedNodes = async (
  params,
  currentGraphResources
) => {
  const query = {
    command: params.deleteDate
      ? `?command=linkedNodesHierarchy&id=${params.nodeId}&deleteDate=${params.deleteDate}`
      : `?command=linkedNodesHierarchy&id=${params.nodeId}`,
    params: { nodeId: params.nodeId },
    processor: params.deletedQuery
      ? processDeletedNodes
      : processHierarchicalNodeData
  };
  const response = await requestWrapper(sendGetRequest, query);
  if (!response.error) {
    if (params.focusing) {
      return response;
    } else {
      return handleSelectedResource(response, params, currentGraphResources);
    }
  } else {
    return response;
  }
};

export const getConnectedNodes = async (
  params
) => {
  const query = {
    command: `?command=linkedNodesHierarchy&id=${params.nodeId}`,
    params: { nodeId: params.nodeId },
    processor: (data) => data
  };
  const response = await requestWrapper(sendGetRequest, query);
  if (response.error) {
    console.error('Error fetching linked nodes')
    return response
  } else {
    return response;
  }
};

export const filterResources = async (resourceFilter, accountRegionFilters) => {
  const filtersToApply = Array.from(accountRegionFilters.values()).reduce(
    (h, obj) =>
      Object.assign(h, {
        [obj.accountId]: obj.region
          ? (h[obj.accountId] || []).concat(obj.region)
          : []
      }),
    {}
  );

  const queryResponse = {
    body: {
      command: 'filterNodesHierarchy',
      data: {
        resourceId: resourceFilter.resourceId,
        resourceType: resourceFilter.resourceType,
        resourceValue: resourceFilter.resourceValue,
        accountFilter: filtersToApply ? filtersToApply : undefined
      }
    },
    processor: processHierarchicalNodeData
  };

  return await requestWrapper(sendPostRequest, queryResponse);
};
