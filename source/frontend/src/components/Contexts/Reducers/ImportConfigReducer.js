export const importReducer = (state, action) => {
  switch (action.type) {
    case 'updateImportConfig':
      return {
        ...state,
        importConfig: action.importConfig
      };
   
    default:
      return state;
  }
};
