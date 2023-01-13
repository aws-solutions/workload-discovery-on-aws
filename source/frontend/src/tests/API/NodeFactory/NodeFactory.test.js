// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {beforeEach, describe, test, expect, vi} from 'vitest'

const nodeToBuild = require('./data/node-to-build.json')
const nodeThatWasBuilt = require('./data/node-that-was-built.json');
const nodeThatWasBuiltClicked = require('./data/node-that-was-built-clicked.json');
const boundingBoxNodeToBuild = require('./data/node-bounding-box-to-build.json');
const boundingBoxNodeThatWasBuilt = require('./data/node-bounding-box-that-was-built.json');
const boundingBoxNodeThatWasBuiltParent = require('./data/node-bounding-box-that-was-built-parent.json');
const boundingBoxNodeToBuildParent = require('./data/node-bounding-box-to-build-parent.json');
import {buildNode, buildBoundingBox} from '../../../API/NodeFactory/NodeFactory';

describe('NodeFactory', () => {

    test('when passing a node from the API to our node factory it will build the correct object', () => {
        const builtNode = buildNode(nodeToBuild, 'parent', 0, false);
        expect(JSON.stringify(builtNode)).toMatch(JSON.stringify(nodeThatWasBuilt));
    });

    test('when passing a node that was clicked from the API to our node factory it will build the correct object', () => {
        const builtNode = buildNode(nodeToBuild, 'parent', 0, true);
        expect(JSON.stringify(builtNode)).toEqual(
            JSON.stringify(nodeThatWasBuiltClicked)
        );
    });

    test('when passing a node that represents an account to our factory it returns a bounding box node', () => {
        const builtBox = buildBoundingBox(boundingBoxNodeToBuild, undefined, 0);

        expect(JSON.stringify(builtBox)).toMatch(
            JSON.stringify(boundingBoxNodeThatWasBuilt)
        );
    });

    test('when passing a node that represents a child to our factory it returns a bounding box node', () => {
        process.env.PUBLIC_URL = '';
        const builtBox = buildBoundingBox(boundingBoxNodeToBuildParent, 'woah-this-is-my-parent', 1);

        expect(JSON.stringify(builtBox)).toMatch(
            JSON.stringify(boundingBoxNodeThatWasBuiltParent)
        );
    });

    test('when passing undefined to our factory it should return empty object', () => {
        const builtBox = buildBoundingBox(undefined, 'woah-this-is-my-parent', 1);
        expect(builtBox).toEqual({})
    });

    test('when passing undefined to our factory it should return empty object', () => {
        const builtNode = buildNode(undefined, 'woah-this-is-my-parent', 1);
        expect(builtNode).toEqual({})
    });

});

