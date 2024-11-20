// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    reduce,
    evolve,
    add,
    head,
    tail,
    curry,
    groupBy,
    values,
    prop,
    map,
    addIndex,
} from 'ramda';

export const sumBy = prop => vals =>
    reduce(
        (current, val) => evolve({[prop]: add(val[prop])}, current),
        head(vals),
        tail(vals)
    );

export const groupSumBy = curry((groupOn, sumOn, vals) =>
    values(map(sumBy(sumOn))(groupBy(prop(groupOn), vals)))
);

export const mapIndexed = addIndex(map);
