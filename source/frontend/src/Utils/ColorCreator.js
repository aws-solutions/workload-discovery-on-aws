// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import randomColor from 'randomcolor';
import hash from 'object-hash';

export const getAccountColour = account => {
    return randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 0.5,
        seed: hash(account),
    });
};

export const getRegionColour = region => {
    return randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 0.5,
        seed: hash(region),
    });
};

export const getAZColour = az => {
    return randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 0.5,
        seed: hash(az),
    });
};

export const getResourceTypeColor = type => {
    return randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 0.5,
        seed: hash(type),
    });
};
