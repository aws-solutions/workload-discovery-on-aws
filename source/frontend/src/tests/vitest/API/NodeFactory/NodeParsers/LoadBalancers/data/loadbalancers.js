// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';

const createElbV2Config = R.curry((scheme, type, code) => {
    return JSON.stringify({scheme, type, state: {code}});
});

export const createInternalElb = createElbV2Config('internal');
export const createExternalElb = createElbV2Config('internet-facing');

export const createInternalAlb = createInternalElb('application');

export const createExternalAlb = createExternalElb('application');
export const createInternalNlb = createInternalElb('network');

export const createExternalNlb = createExternalElb('network');
