import React, {createContext, useContext, useReducer} from 'react';

export const ImportContext = createContext();
export const ImportProvider = ({reducer, initialState, children}) =>(
  <ImportContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </ImportContext.Provider>
);
export const useImportConfigState = () => useContext(ImportContext);