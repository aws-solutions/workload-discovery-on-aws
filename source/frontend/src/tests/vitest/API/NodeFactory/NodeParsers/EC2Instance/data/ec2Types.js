// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';

export const createInstanceConfiguration = R.curry(
    (instanceType, instanceState) => {
        return JSON.stringify({
            architecture: 'x64',
            imageId: '1234556789',
            instanceType,
            privateDnsName: 'test',
            privateIpAddress: '192.168.1.1',
            publicDnsName: 'test',
            publicIpAddress: '192.168.0.1',
            state: {
                name: instanceState,
            },
            monitoring: {
                state: 'available',
            },
            platform: 'linux',
            cpuOptions: {
                coreCount: 2,
                threadsPerCore: 4,
            },
            launchTime: '01-01-2020 01:00:00',
        });
    }
);
