export const costsReducer = (state, action) => {  
  switch (action.type) {
    case 'updatePreferences':
      return {
        ...state,
        costPreferences: action.preferences
      };    
    default:
      return state;
  }
};
