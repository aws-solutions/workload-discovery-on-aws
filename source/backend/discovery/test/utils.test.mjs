// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, describe, it} from 'vitest';
import {createArn, createArnWithResourceType} from '../src/lib/utils.mjs';

describe('utils.mjs', () => {
    describe('createArn', () => {
        it('should create correct partition for China North region', async () => {
            const expected =
                'arn:aws-cn:ec2:cn-north-1:xxxxxxxxxxxx:volume/vol-1a2b3c4d';
            const actual = createArn({
                service: 'ec2',
                region: 'cn-north-1',
                accountId: 'xxxxxxxxxxxx',
                resource: 'volume/vol-1a2b3c4d',
            });

            assert.deepEqual(actual, expected);
        });

        it('should create correct partition for China Northwest region', async () => {
            const expected =
                'arn:aws-cn:ec2:cn-northwest-1:xxxxxxxxxxxx:volume/vol-1a2b3c4d';
            const actual = createArn({
                service: 'ec2',
                region: 'cn-northwest-1',
                accountId: 'xxxxxxxxxxxx',
                resource: 'volume/vol-1a2b3c4d',
            });

            assert.deepEqual(actual, expected);
        });

        it('should create correct partition for GovCloud East region', async () => {
            const expected =
                'arn:aws-us-gov:ec2:us-gov-east-1:xxxxxxxxxxxx:volume/vol-1a2b3c4d';
            const actual = createArn({
                service: 'ec2',
                region: 'us-gov-east-1',
                accountId: 'xxxxxxxxxxxx',
                resource: 'volume/vol-1a2b3c4d',
            });

            assert.deepEqual(actual, expected);
        });

        it('should create correct partition for GovCloud West region', async () => {
            const expected =
                'arn:aws-us-gov:ec2:us-gov-west-1:xxxxxxxxxxxx:volume/vol-1a2b3c4d';
            const actual = createArn({
                service: 'ec2',
                region: 'us-gov-west-1',
                accountId: 'xxxxxxxxxxxx',
                resource: 'volume/vol-1a2b3c4d',
            });

            assert.deepEqual(actual, expected);
        });

        it('should create correct partition for standard regions', async () => {
            const expected =
                'arn:aws:ec2:us-west-1:xxxxxxxxxxxx:volume/vol-1a2b3c4d';
            const actual = createArn({
                service: 'ec2',
                region: 'us-west-1',
                accountId: 'xxxxxxxxxxxx',
                resource: 'volume/vol-1a2b3c4d',
            });

            assert.deepEqual(actual, expected);
        });

        it('should default to an empty string if account id or region is absent', async () => {
            const expected = 'arn:aws:s3:::myBucket';
            const actual = createArn({
                service: 's3',
                resource: 'myBucket',
            });

            assert.deepEqual(actual, expected);
        });
    });

    describe('createArnWithResourceType', () => {
        it('should create an arn using a resource type and id', () => {
            const expected =
                'arn:aws:config:us-west-1:xxxxxxxxxxxx:resourcecompliance/resourceId';
            const actual = createArnWithResourceType({
                resourceType: 'AWS::Config::ResourceCompliance',
                accountId: 'xxxxxxxxxxxx',
                awsRegion: 'us-west-1',
                resourceId: 'resourceId',
            });

            assert.deepEqual(actual, expected);
        });

        it('should default to an empty string if account id or region is absent', () => {
            const expected = 'arn:aws:config:::resourcecompliance/resourceId';
            const actual = createArnWithResourceType({
                resourceType: 'AWS::Config::ResourceCompliance',
                resourceId: 'resourceId',
            });

            assert.deepEqual(actual, expected);
        });
    });
});
