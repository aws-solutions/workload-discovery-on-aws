// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi} from 'vitest';
import {
    RESOLVER_CODE_SIZE_ERROR,
    FUNCTION_RESPONSE_SIZE_TOO_LARGE,
    isPayloadTooLargeError,
    fetchWithAdaptivePageSize,
} from '../../../../Utils/API/AdaptivePagination';

describe('isPayloadTooLargeError', () => {
    it('returns true for RESOLVER_CODE_SIZE_ERROR', () => {
        const err = {errors: [{message: RESOLVER_CODE_SIZE_ERROR}]};
        expect(isPayloadTooLargeError(err)).toBe(true);
    });

    it('returns true for FUNCTION_RESPONSE_SIZE_TOO_LARGE', () => {
        const err = {errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}]};
        expect(isPayloadTooLargeError(err)).toBe(true);
    });

    it('returns true when mixed with other errors', () => {
        const err = {
            errors: [
                {message: 'some other error'},
                {message: FUNCTION_RESPONSE_SIZE_TOO_LARGE},
            ],
        };
        expect(isPayloadTooLargeError(err)).toBe(true);
    });

    it('returns false for unrelated errors', () => {
        const err = {errors: [{message: 'Something else went wrong'}]};
        expect(isPayloadTooLargeError(err)).toBe(false);
    });

    it('returns false when errors array is empty', () => {
        expect(isPayloadTooLargeError({errors: []})).toBe(false);
    });

    it('returns false for null', () => {
        expect(isPayloadTooLargeError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
        expect(isPayloadTooLargeError(undefined)).toBe(false);
    });

    it('returns false when no errors property', () => {
        expect(isPayloadTooLargeError({message: 'plain error'})).toBe(false);
    });
});

describe('fetchWithAdaptivePageSize', () => {
    it('returns result on first successful attempt', async () => {
        const fetchFn = vi.fn().mockResolvedValue({data: 'ok'});
        const result = await fetchWithAdaptivePageSize(
            fetchFn,
            {start: 0, end: 100}
        );
        expect(result).toEqual({data: 'ok'});
        expect(fetchFn).toHaveBeenCalledOnce();
        expect(fetchFn).toHaveBeenCalledWith({start: 0, end: 100});
    });

    it('halves page size and retries on payload-too-large error', async () => {
        const fetchFn = vi
            .fn()
            .mockRejectedValueOnce({
                errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}],
            })
            .mockResolvedValue([1]);

        const result = await fetchWithAdaptivePageSize(
            fetchFn,
            {start: 0, end: 100},
            1,
            (a, b) => [...a, ...b]
        );
        expect(result).toEqual([1, 1]);
        expect(fetchFn).toHaveBeenCalledTimes(3);
        expect(fetchFn).toHaveBeenNthCalledWith(1, {start: 0, end: 100});
        expect(fetchFn).toHaveBeenNthCalledWith(2, {start: 0, end: 50});
        expect(fetchFn).toHaveBeenNthCalledWith(3, {start: 50, end: 100});
    });

    it('halves page size multiple times if needed', async () => {
        let callCount = 0;
        const fetchFn = vi.fn().mockImplementation(() => {
            callCount++;
            if (callCount <= 2) {
                return Promise.reject({
                    errors: [{message: RESOLVER_CODE_SIZE_ERROR}],
                });
            }
            return Promise.resolve([callCount]);
        });

        await fetchWithAdaptivePageSize(
            fetchFn,
            {start: 0, end: 100},
            1,
            (a, b) => [...a, ...b]
        );
        expect(fetchFn).toHaveBeenNthCalledWith(1, {start: 0, end: 100});
        expect(fetchFn).toHaveBeenNthCalledWith(2, {start: 0, end: 50});
        expect(fetchFn).toHaveBeenNthCalledWith(3, {start: 0, end: 25});
    });

    it('throws non-payload errors immediately', async () => {
        const otherError = new Error('network failure');
        const fetchFn = vi.fn().mockRejectedValue(otherError);

        await expect(
            fetchWithAdaptivePageSize(fetchFn, {start: 0, end: 100})
        ).rejects.toThrow('network failure');
        expect(fetchFn).toHaveBeenCalledOnce();
    });

    it('throws when page size cannot be reduced further', async () => {
        const payloadError = {
            errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}],
        };
        const fetchFn = vi.fn().mockRejectedValue(payloadError);

        await expect(
            fetchWithAdaptivePageSize(fetchFn, {start: 0, end: 1})
        ).rejects.toEqual(payloadError);
        expect(fetchFn).toHaveBeenCalledOnce();
    });

    it('preserves start offset when halving', async () => {
        const fetchFn = vi
            .fn()
            .mockRejectedValueOnce({
                errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}],
            })
            .mockResolvedValue({data: 'ok'});

        await fetchWithAdaptivePageSize(fetchFn, {start: 200, end: 400});
        expect(fetchFn).toHaveBeenNthCalledWith(1, {start: 200, end: 400});
        expect(fetchFn).toHaveBeenNthCalledWith(2, {start: 200, end: 300});
    });

    it('respects custom minPageSize', async () => {
        const payloadError = {
            errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}],
        };
        const fetchFn = vi.fn().mockRejectedValue(payloadError);

        await expect(
            fetchWithAdaptivePageSize(fetchFn, {start: 0, end: 10}, 10)
        ).rejects.toEqual(payloadError);
        expect(fetchFn).toHaveBeenCalledOnce();
    });

    it('throws when pageSize halves below minPageSize instead of returning undefined', async () => {
        const payloadError = {
            errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}],
        };
        const fetchFn = vi.fn().mockRejectedValue(payloadError);

        await expect(
            fetchWithAdaptivePageSize(fetchFn, {start: 0, end: 5}, 4)
        ).rejects.toBeDefined();
    });

    it('throws on zero-size page range instead of returning undefined', async () => {
        const fetchFn = vi.fn().mockResolvedValue({data: 'ok'});

        await expect(
            fetchWithAdaptivePageSize(fetchFn, {start: 10, end: 10})
        ).rejects.toBeDefined();
        expect(fetchFn).not.toHaveBeenCalled();
    });

    it('fetches the full original range when halving occurs, not just the sub-page', async () => {
        const fetchFn = vi
            .fn()
            .mockRejectedValueOnce({
                errors: [{message: FUNCTION_RESPONSE_SIZE_TOO_LARGE}],
            })
            .mockResolvedValueOnce([{id: 1}, {id: 2}, {id: 3}])
            .mockResolvedValueOnce([{id: 4}, {id: 5}]);

        const result = await fetchWithAdaptivePageSize(
            fetchFn,
            {start: 0, end: 10},
            1,
            (a, b) => [...a, ...b]
        );

        expect(result).toEqual([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]);
        expect(fetchFn).toHaveBeenCalledTimes(3);
        expect(fetchFn).toHaveBeenNthCalledWith(1, {start: 0, end: 10});
        expect(fetchFn).toHaveBeenNthCalledWith(2, {start: 0, end: 5});
        expect(fetchFn).toHaveBeenNthCalledWith(3, {start: 5, end: 10});
    });
});
