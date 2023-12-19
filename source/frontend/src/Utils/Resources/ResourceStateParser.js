// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';

const greenStates = ['available', 'running', 'in-use', 'active'].map(state => {
    return [state, {
        status: 'status-available',
        text: state,
        color: '#1D8102'
    }];
});

const redStates = [
    'stopped',
    'inactive',
    'deleted',
    'shutting-down',
    'terminated',
    'stopping',
    'failed'
].map(state => {
    return [state, {
        status: 'status-negative',
        text: state,
        color: '#D13212'
    }];
});

const amberStates = ['creating', 'pending', 'provisioning'].map(state => {
    return [state, {
        status: 'status-warning',
        text: state,
        color: '#FF9900'
    }];
});

const statesMap = new Map([
    ...greenStates,
    ...amberStates,
    ...redStates
    ]
);

function getStateValue(stateObj) {
    return stateObj.value ?? stateObj.name ?? stateObj.code ?? '';
}

export const getStateInformation = state => {
    const value = R.is(String, state) ? state : getStateValue(state ?? {});
    return statesMap.get(value.toLowerCase()) ?? {
        status: 'status-warning',
        text: 'no state data',
        color: '#FF9900'
    };
};
