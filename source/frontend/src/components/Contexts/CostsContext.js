import React, {createContext, useContext, useReducer} from 'react';

export const CostsContext = createContext();
export const CostsProvider = ({reducer, initialState, children}) =>(
  <CostsContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </CostsContext.Provider>
);
export const useCostsState = () => useContext(CostsContext);