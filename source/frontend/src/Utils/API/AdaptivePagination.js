// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// These must match source/backend/discovery/src/lib/constants.mjs
export const RESOLVER_CODE_SIZE_ERROR =
    'Reached evaluated resolver code size limit.';
export const FUNCTION_RESPONSE_SIZE_TOO_LARGE =
    'Response payload size exceeded maximum allowed payload size (6291556 bytes).';

const PAYLOAD_TOO_LARGE_ERRORS = new Set([
    RESOLVER_CODE_SIZE_ERROR,
    FUNCTION_RESPONSE_SIZE_TOO_LARGE,
]);

export function isPayloadTooLargeError(err) {
    const errors = err?.errors ?? [];
    return errors.some(e => PAYLOAD_TOO_LARGE_ERRORS.has(e.message));
}

export async function fetchWithAdaptivePageSize(
    fetchFn,
    {start, end},
    minPageSize = 1,
    mergeFn
) {
    let pageSize = end - start;

    if (pageSize <= 0) {
        throw new Error(`Invalid page range: start=${start}, end=${end}`);
    }

    let cursor = start;
    let lastErr;
    const results = [];

    while (cursor < end) {
        const subEnd = Math.min(cursor + pageSize, end);
        try {
            const result = await fetchFn({start: cursor, end: subEnd});
            results.push(result);
            cursor = subEnd;
        } catch (err) {
            lastErr = err;
            if (isPayloadTooLargeError(err) && pageSize > minPageSize) {
                pageSize = Math.max(Math.floor(pageSize / 2), minPageSize);
            } else {
                throw err;
            }
        }
    }

    if (results.length === 0) {
        throw lastErr ?? new Error(`Invalid page range: start=${start}, end=${end}`);
    }

    if (results.length === 1) return results[0];
    if (mergeFn) return results.reduce(mergeFn);
    return results;
}
