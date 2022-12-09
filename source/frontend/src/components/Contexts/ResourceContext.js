// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {createContext, useContext, useReducer} from 'react';

export const ResourceContext = createContext();
export const ResourceProvider = ({reducer, initialState, children}) =>(
  <ResourceContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </ResourceContext.Provider>
);
export const useResourceState = () => useContext(ResourceContext);