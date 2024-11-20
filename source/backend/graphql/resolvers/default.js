import { util } from '@aws-appsync/utils';

export function request(ctx) {
    return {
        operation: 'Invoke',
        payload: ctx,
    };
}

export function response(ctx) {
    const { error, result } = ctx;

    util.http.addResponseHeaders({
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security': 'max-age=13072000; includeSubdomains; preload',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
        'X-Frame-Options': 'DENY',
        'Cache-Control': 'no-store, no-cache'
    });

    if (error != null) {
        return util.error(error.message, error.type, result);
    }
    return result;
}