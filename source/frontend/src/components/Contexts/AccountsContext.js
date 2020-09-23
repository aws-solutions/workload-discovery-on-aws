import React, { createContext, useContext, useReducer } from 'react';

export const AccountsContext = createContext();
export const AccountsProvider = ({ reducer, initialState, children }) => (
  <AccountsContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </AccountsContext.Provider>
);
export const useAccountsState = () => useContext(AccountsContext);
