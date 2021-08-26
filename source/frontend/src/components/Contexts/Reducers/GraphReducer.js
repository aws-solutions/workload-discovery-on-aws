export const graphReducer = (state, action) => {
  
  switch (action.type) {
    case 'updateGraphResources':
      return {
        ...state,
        graphResources: action.graphResources,
      };
    case 'selectNode':
      return {
        ...state,
        selectedNode: action.selectedNode,
      };
    case 'clearGraph':
      return {
        ...state,
        graphResources: [],
        selectedNode: undefined,
      };
    case 'updateCompound':
      return {
        ...state,
        cy: action.cy,
      };
    case 'updateFilters':
      return {
        ...state,
        graphFilters: action.graphFilters,
      };
    default:
      return state;
  }
};
