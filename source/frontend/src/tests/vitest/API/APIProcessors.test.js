// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {beforeEach, describe, it, expect, vi} from 'vitest';
import {getResourceGraph as singleAccount} from '../../mocks/fixtures/getResourceGraph/default.json';
import {processElements} from '../../../API/APIProcessors';
import singleAccountExpected from './fixtures/expected/singleAccount.json';
import singleAccountDuplicates from './fixtures/expected/singleAccountDuplicates.json'
describe('APIProcessors.js', () => {

    describe('processElements', () => {

        it('should create bounding boxes for account, region, az, vpc and subnet for resources in one account', () => {
            const actual = processElements(singleAccount);
            expect(actual).toEqual(singleAccountExpected);
        });

        it('should handle node list with duplicate ids', () => {
            const {nodes, edges} = singleAccount;
            const duplicates = nodes.slice(0, 5);
            const actual = processElements({nodes: [...nodes, ...duplicates], edges});
            expect(actual).toEqual(singleAccountDuplicates);
        });

    });

});