// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';

export const getAllRegions = accounts =>
    R.chain(
        account => R.chain(region => region.label, account.regions),
        accounts
    );

export const getSelectedAccountRegions = selectedAccounts =>
    R.chain(
        account => R.chain(region => region.label, account.regions),
        selectedAccounts
    );

export const getSelectedRegions = selectedRegions =>
    R.chain(region => region.label, selectedRegions);
