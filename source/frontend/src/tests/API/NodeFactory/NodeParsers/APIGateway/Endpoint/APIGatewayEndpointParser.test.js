// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { test, expect, describe } from 'vitest'
import React from 'react';
import { parseAPIGatewayEndpoint } from '../../../../../../API/NodeFactory/NodeParsers/APIGateway/Endpoint/APIGatewayEndpointParser';
import { fetchImage } from '../../../../../../Utils/ImageSelector';

describe('APIGatewayEndpointParser', () => {

    test('when node that is an API endpoint gets custom parsed it will have a custom hover over and icon', () => {
        const node = {
            name: 'anEndpoint',
            properties: { resourceType: 'AWS::ApiGateway::RestApi' }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff'
            },
            icon: fetchImage(node.properties.resourceType),
        };

        const result = parseAPIGatewayEndpoint(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);

    });

    test('when node that is undefined gets custom parsed it will return empty object', () => {
        const result = parseAPIGatewayEndpoint(undefined);
        expect(result).toEqual({});
    });

});
