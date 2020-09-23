export const accountConfigReducer = (state, action) => {
    switch (action.type) {
      case 'updateAccounts&Regions':
        return {
          ...state,
          accounts: action.accounts
        };
     
      default:
        return state;
    }
  };
  