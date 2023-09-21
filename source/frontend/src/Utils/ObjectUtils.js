// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from "ramda";
import * as CryptoJS from 'crypto-js'

export const clean = o => R.pipe(
  R.reject(R.either(R.isNil, R.isEmpty)),
  R.map(R.when(R.is(Object), clean))
)(o)

export const jsonParseKeys = keys => o => Object.fromEntries(
  Object.entries(o).map(([k, v]) => {
    try {
      if (keys.includes(k) && v) return [k, JSON.parse(v)]
      return [k, v]
    } catch (e) {
      console.warn(`Failed to parse '${k}' with value '${v}' as JSON`)
      return [k, v]
    }
  })
)

export function hashProperty(property) {
  return CryptoJS.SHA256(property);
}

export const getValue = R.curry((fallback, keys, obj) => {
    for(const key of keys) {
        const val = obj[key];
        if(val != null && !R.isEmpty(val)) return val;
    }
    return fallback;
});
