import React, {createContext, useContext, useReducer} from 'react';

export const GraphContext = createContext();
export const GraphProvider = ({reducer, initialState, children}) =>(
  <GraphContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </GraphContext.Provider>
);
export const useGraphState = () => useContext(GraphContext);