export const resourceReducer = (state, action) => {
  switch (action.type) {
    case 'updateGraphResources':
      return {
        ...state,
        graphResources: action.graphResources,
      };
    case 'select':
      return {
        ...state,
        resources: action.resources,
      };
    default:
      return state;
  }
};
