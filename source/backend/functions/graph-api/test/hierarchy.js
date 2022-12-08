// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {assert} = require('chai');
const R = require('ramda');
const {createHierarchy} = require('../src/hierarchy');

const createHierarchyTests = {
    'Gremlin Lambda': [
        require('./fixtures/hierarchy/gremlin-lambda-input.json'),
        require('./fixtures/hierarchy/gremlin-lambda-expected.json')
    ],
    'EC2 Instance': [
        require('./fixtures/hierarchy/gremlin-ec2-input.json'),
        require('./fixtures/hierarchy/gremlin-ec2-expected.json')
    ]
};

describe('hierarchy.js', () => {

    describe('createHierarchy', () => {

        Object.entries(createHierarchyTests).forEach(([name, [input, expected]]) => {
            it('should create hierarchy for ' + name, () => {
                const actual = createHierarchy(input);
                assert.deepEqual(actual, expected);
            })
        });

    });

});






