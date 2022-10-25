export const diagramSettingsReducer = (state, action) => {
  switch (action.type) {
    case 'saveEdges':
      return {
        ...state,
        edges: action.edges,
      };
    case 'setCanvas':
      return {
        ...state,
        canvas: action.canvas,
      };
    case 'setSelectedResources':
      return {
        ...state,
        selectedResources: action.selectedResources,
      };
    case 'setResources':
      return {
        ...state,
        resources: action.resources,
        selectedResources: state.selectedResources?.filter(selected => action.resources.map(i => i.id()).includes(selected.id()))
      };
    default:
      return state;
  }
};
