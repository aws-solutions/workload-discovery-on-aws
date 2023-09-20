const {assert} = require('chai');
const pThrottle = require('p-throttle');
const rewire = require('rewire');
const {GLOBAL} = require("../src/lib/constants");
const awsClient = rewire('../src/lib/awsClient');

describe('awsClient', () => {

    describe('throttledPaginator', () => {
        const throttledPaginator = awsClient.__get__('throttledPaginator');

        const throttler = pThrottle({
            limit: 1,
            interval: 10
        });

        it('should handle one page', async() => {
            const asyncGenerator = (async function* () {
                yield 1;
            })();

            const results = [];
            for await(const x of throttledPaginator(throttler, asyncGenerator)) {
                results.push(x);
            }
            assert.deepEqual(results, [1]);
        });

        it('should handle multiple pages', async() => {
            const asyncGenerator = (async function* () {
                yield* [1, 2, 3];
            })();

            const results = [];
            for await(const x of throttledPaginator(throttler, asyncGenerator)) {
                results.push(x);
            }
            assert.deepEqual(results, [1, 2, 3]);
        });

    });

});