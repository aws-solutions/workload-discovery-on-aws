const {assert} = require('chai');
const {handler} = require('../src/index');

describe('index.js', () => {

    describe('handler', () => {

        describe('getLinkedNodesHierarchy', async () => {

            it('should reject payloads with no id and no arn', async () => {
                return handler({
                    info: {
                        fieldName: 'getLinkedNodesHierarchy',
                    },
                    arguments: {}
                }).catch(err => assert.strictEqual(err.message, 'You must specify either an id or arn parameter.'));
            });

            it('should reject payloads with invalid account id', async () => {
                return handler({
                    info: {
                        fieldName: 'getLinkedNodesHierarchy',
                    },
                    arguments: {id: '$th%'}
                }).catch(err => assert.strictEqual(err.message, 'The id parameter must be a valid md5 hash.'));
            });

            it('should reject payloads with invalid md5 hash', async () => {
                return handler({
                    info: {
                        fieldName: 'getLinkedNodesHierarchy',
                    },
                    arguments: {arn: 'foo'}
                }).catch(err => assert.strictEqual(err.message, 'The arn parameter must be a valid ARN.'));
            });
        });

        describe('unknown query', async () => {
            it('should reject payloads with unknown query', async () => {
                return handler({
                    info: {
                        fieldName: 'foo',
                    }
                }).catch(err => assert.strictEqual(err.message, 'Unknown field, unable to resolve foo.'));
            });
        });

    });

});