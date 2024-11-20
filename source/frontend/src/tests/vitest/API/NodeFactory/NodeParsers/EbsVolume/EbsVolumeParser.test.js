// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, test, expect} from 'vitest';
import {parseEbsVolume} from '../../../../../../API/NodeFactory/NodeParsers/EbsVolume/EbsVolumeParser';

describe('EbsVolumeParser', () => {
    test('it should parse EBS volume in use', () => {
        const node = {
            id: 'arn:aws:lambda:eu-west-1:yyyyyyyyyyyy:function:testLambda',
            label: 'AWS_Lambda_Function',
            md5Hash: '',
            properties: {
                version: '1.3',
                accountId: 'xxxxxxxxxxxx',
                configurationItemCaptureTime: '2020-08-26T16:48:19.398Z',
                configurationItemStatus: 'ResourceDiscovered',
                configurationStateId: '1598460499398',
                configurationItemMD5Hash: '',
                arn: 'arn:aws:ec2:eu-west-1:xxxxxxxxxxxx:volume/vol-1234567890abcdef',
                resourceType: 'AWS::EC2::Volume',
                resourceId: 'vol-1234567890abcdef',
                awsRegion: 'eu-west-1',
                availabilityZone: 'eu-west-1b',
                resourceCreationTime: '2020-08-26T16:46:16.596Z',
                tags: {},
                relatedEvents: [],
                relationships: [
                    {
                        resourceType: 'AWS::EC2::Instance',
                        resourceId: 'i-1234567890abcdef',
                        relationshipName: 'Is attached to Instance',
                    },
                ],
                configuration:
                    '{"volumeType":"gp2","volumeId":"vol-1234567890abcdef","key2":"prop2","state":{"value":"in-use"}}',
                supplementaryConfiguration: {},
            },
        };

        const expectedResult = {
            icon: '/icons/Amazon-Elastic-Block-Store-EBS_Volume_light-bg.svg',
            state: {
                color: '#1D8102',
                status: 'status-available',
                text: 'in-use',
            },
            styling: {
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                borderStyle: 'dotted',
                colour: '#1D8102',
                message: 'in-use',
            },
        };

        const actual = parseEbsVolume(node);
        expect(actual).toEqual(expectedResult);
    });

    test('it should parse EBS volume in failed state', () => {
        const node = {
            id: 'arn:aws:lambda:eu-west-1:yyyyyyyyyyyy:function:testLambda',
            label: 'AWS_Lambda_Function',
            md5Hash: '',
            properties: {
                version: '1.3',
                accountId: 'xxxxxxxxxxxx',
                configurationItemCaptureTime: '2020-08-26T16:48:19.398Z',
                configurationItemStatus: 'ResourceDiscovered',
                configurationStateId: '1598460499398',
                configurationItemMD5Hash: '',
                arn: 'arn:aws:ec2:eu-west-1:xxxxxxxxxxxx:volume/vol-1234567890abcdef',
                resourceType: 'AWS::EC2::Volume',
                resourceId: 'vol-1234567890abcdef',
                awsRegion: 'eu-west-1',
                availabilityZone: 'eu-west-1b',
                resourceCreationTime: '2020-08-26T16:46:16.596Z',
                tags: {},
                relatedEvents: [],
                relationships: [
                    {
                        resourceType: 'AWS::EC2::Instance',
                        resourceId: 'i-1234567890abcdef',
                        relationshipName: 'Is attached to Instance',
                    },
                ],
                configuration:
                    '{"volumeType":"gp2","volumeId":"vol-1234567890abcdef","key2":"prop2","state":{"value":"failed"}}',
                supplementaryConfiguration: {},
            },
        };

        const expectedResult = {
            icon: '/icons/Amazon-Elastic-Block-Store-EBS_Volume_light-bg-error.svg',
            state: {
                color: '#D13212',
                status: 'status-negative',
                text: 'failed',
            },
            styling: {
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                borderStyle: 'dotted',
                colour: '#D13212',
                message: 'failed',
            },
        };

        const actual = parseEbsVolume(node);
        expect(actual).toEqual(expectedResult);
    });
});
