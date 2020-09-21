const fs = require('fs');
const {assert} = require('chai');
const rewire = require('rewire');
const lambdaParser = rewire('../src/discovery/lambdaParser');

describe('testParser', () => {

    describe('removeLines', () => {

        const removeLines = lambdaParser.__get__('removeLines');

        it('it should remove require statements', () => {
            const input = fs.readFileSync('tests/fixtures/parser/required.js', 'utf8');
            const actual = removeLines(input);
            assert.strictEqual(actual, 'let a = 1;\r\na = 2;')
        });

        it('it should remove console.log statements', () => {
            const input = fs.readFileSync('tests/fixtures/parser/consolelog.js', 'utf8');
            const actual = removeLines(input);
            assert.strictEqual(actual, 'let a = 1;\r\na = 2;')
        });

    });
});