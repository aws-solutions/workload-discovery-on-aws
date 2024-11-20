// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const resourceReducer = (state, action) => {
    switch (action.type) {
        case 'updateGraphResources':
            return {
                ...state,
                graphResources: action.graphResources,
            };
        case 'select':
            return {
                ...state,
                resources: action.resources,
            };
        default:
            return state;
    }
};
