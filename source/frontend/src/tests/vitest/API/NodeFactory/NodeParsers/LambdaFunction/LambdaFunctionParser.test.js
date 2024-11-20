// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, test, expect} from 'vitest';
import {fetchImage} from '../../../../../../Utils/ImageSelector';
import {parseLambdaFunction} from '../../../../../../API/NodeFactory/NodeParsers/LambdaFunction/LambdaFunctionParser';

describe('LambdaFunctionParser', () => {
    test('it should parse lambda in failed state', () => {
        const node = {
            id: 'arn:aws:lambda:eu-west-1:yyyyyyyyyyyy:function:testLambda',
            label: 'AWS_Lambda_Function',
            md5Hash: '',
            properties: {
                accountId: 'yyyyyyyyyyyy',
                arn: 'arn:aws:lambda:eu-west-1:yyyyyyyyyyyy:function:testLambda',
                availabilityZone: 'eu-west-1a,eu-west-1b',
                awsRegion: 'eu-west-1',
                configuration:
                    '{"key":"prop","key1":"prop1","key2":"prop2","state":{"value":"failed"}}',
                configurationItemCaptureTime: '2023-06-06T22:21:58.169Z',
                configurationItemStatus: 'OK',
                configurationStateId: null,
                resourceCreationTime: null,
                resourceId: 'testLambda',
                resourceName: 'testLambda',
                resourceType: 'AWS::Lambda::Function',
                tags: '[{"tag":"lambdaTag=lambdaValue","value":"lambdaValue","key":"lambdaTag"}, {"tag":"lambdaTag1=lambdaValue1","value":"lambdaValue1","key":"lambdaTag1"}]',
                version: '1.3',
                vpcId: 'vpc-11111111111111111',
                subnetId: null,
                subnetIds: null,
                resourceValue: null,
                state: null,
                private: null,
                loggedInURL:
                    'https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/testLambda?tab=graph',
                loginURL:
                    'https://yyyyyyyyyyyy.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/testLambda?tab=graph',
                title: 'testLambda',
                dBInstanceStatus: null,
                statement: null,
                instanceType: null,
            },
        };

        const expectedResult = {
            icon: '/icons/AWS-Lambda-error.svg',
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

        const actual = parseLambdaFunction(node);
        expect(actual).toEqual(expectedResult);
    });

    test('it should parse lambda in inactive state', () => {
        const node = {
            id: 'arn:aws:lambda:eu-west-1:yyyyyyyyyyyy:function:testLambda',
            label: 'AWS_Lambda_Function',
            md5Hash: '',
            properties: {
                accountId: 'yyyyyyyyyyyy',
                arn: 'arn:aws:lambda:eu-west-1:yyyyyyyyyyyy:function:testLambda',
                availabilityZone: 'eu-west-1a,eu-west-1b',
                awsRegion: 'eu-west-1',
                configuration:
                    '{"key":"prop","key1":"prop1","key2":"prop2","state":{"value":"inactive"}}',
                configurationItemCaptureTime: '2023-06-06T22:21:58.169Z',
                configurationItemStatus: 'OK',
                configurationStateId: null,
                resourceCreationTime: null,
                resourceId: 'testLambda',
                resourceName: 'testLambda',
                resourceType: 'AWS::Lambda::Function',
                tags: '[{"tag":"lambdaTag=lambdaValue","value":"lambdaValue","key":"lambdaTag"}, {"tag":"lambdaTag1=lambdaValue1","value":"lambdaValue1","key":"lambdaTag1"}]',
                version: '1.3',
                vpcId: 'vpc-11111111111111111',
                subnetId: null,
                subnetIds: null,
                resourceValue: null,
                state: null,
                private: null,
                loggedInURL:
                    'https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/testLambda?tab=graph',
                loginURL:
                    'https://yyyyyyyyyyyy.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/testLambda?tab=graph',
                title: 'testLambda',
                dBInstanceStatus: null,
                statement: null,
                instanceType: null,
            },
        };

        const expectedResult = {
            icon: '/icons/AWS-Lambda-error.svg',
            state: {
                color: '#D13212',
                status: 'status-negative',
                text: 'inactive',
            },
            styling: {
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                borderStyle: 'dotted',
                colour: '#D13212',
                message: 'inactive',
            },
        };

        const actual = parseLambdaFunction(node);
        expect(actual).toEqual(expectedResult);
    });
});
