export const resourceReducer = (state, action) => {
  switch (action.type) {
    case 'updateResources':
      return {
        ...state,
        resources: action.resources
      };
    case 'updateAccountOrRegionFilters':
      return {
        ...state,
        filters: action.filters
      };
    default:
      return state;
  }
};
