// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, test, expect} from "vitest";
import {fetchImage} from "../../../../../../Utils/ImageSelector";
import {parseLambdaFunction} from "../../../../../../API/NodeFactory/NodeParsers/LambdaFunction/LambdaFunctionParser";

describe('SubnetParser', () => {

    test('it should parse lambda in subnet in available state', () => {
        const node = {
            "id": "subnetArn",
            "label": "AWS_EC2_Subnet",
            "md5Hash": "",
            "properties": {
                "accountId": "yyyyyyyyyyyy",
                "arn": "subnetArn",
                "availabilityZone": "eu-west-1a",
                "awsRegion": "eu-west-1",
                "configuration": "{\"key\":\"prop\",\"key1\":\"prop1\",\"key2\":\"prop2\",\"state\":{\"value\":\"available\"}}",
                "resourceType": "AWS::EC2::Subnet",
            }
        };

        const expectedResult = {
            icon: '/icons/VPC-subnet-private_light-bg.svg',
            state: {
                color: '#1D8102',
                status: 'status-available',
                text: 'available',
            },
            styling: {
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                borderStyle: 'dotted',
                colour: '#1D8102',
                message: 'available'
            }
        };

        const actual = parseLambdaFunction(node);
        expect(actual).toEqual(expectedResult);
    });

    test('it should parse lambda in subnet in pending state', () => {
        const node = {
            "id": "subnetArn",
            "label": "AWS_EC2_Subnet",
            "md5Hash": "",
            "properties": {
                "accountId": "yyyyyyyyyyyy",
                "arn": "subnetArn",
                "availabilityZone": "eu-west-1a",
                "awsRegion": "eu-west-1",
                "configuration": "{\"key\":\"prop\",\"key1\":\"prop1\",\"key2\":\"prop2\",\"state\":{\"value\":\"pending\"}}",
                "resourceType": "AWS::EC2::Subnet",
            }
        };

        const expectedResult = {
            icon: '/icons/VPC-subnet-private_light-bg-warning.svg',
            state: {
                color: '#FF9900',
                status: 'status-warning',
                text: 'pending',
            },
            styling: {
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                borderStyle: 'dotted',
                colour: '#FF9900',
                message: 'pending'
            }
        };

        const actual = parseLambdaFunction(node);
        expect(actual).toEqual(expectedResult);
    });

});