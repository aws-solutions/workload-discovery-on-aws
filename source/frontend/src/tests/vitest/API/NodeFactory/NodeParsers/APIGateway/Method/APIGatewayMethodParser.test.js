// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {test, expect, describe} from 'vitest';
import {parseAPIGatewayMethod} from '../../../../../../../API/NodeFactory/NodeParsers/APIGateway/Method/APIGatewayMethodParser';
import {fetchImage} from '../../../../../../../Utils/ImageSelector';

describe('APIGatewayMethodParser', () => {
    test('ctest that a node passed with that is API Method POST it gets custom parsed icon.', () => {
        const node = {
            properties: {resourceId: 'blahblah_blah_POST'},
        };
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            icon: fetchImage('POST'),
        };

        const result = parseAPIGatewayMethod(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
    });

    test('when a node passed with that is API Method GET it gets custom parsed icon.', () => {
        const node = {
            properties: {resourceId: 'blahblah_blah_GET'},
        };
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            icon: fetchImage('GET'),
        };

        const result = parseAPIGatewayMethod(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
    });

    test('when a node passed with that is API Method gets custom parsed icon.', () => {
        const node = {
            properties: {resourceId: 'blahblah_blah_POST'},
        };
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            icon: fetchImage('POST'),
        };

        const result = parseAPIGatewayMethod(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
    });

    test('when a node passed with that is API Method PUT it gets custom parsed icon.', () => {
        const node = {
            properties: {resourceId: 'blahblah_blah_PUT'},
        };
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            icon: fetchImage('PUT'),
        };

        const result = parseAPIGatewayMethod(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
    });

    test('when a node passed with that is API Method DELETE it gets custom parsed icon.', () => {
        const node = {
            properties: {resourceId: 'blahblah_blah_DELETE'},
        };
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            icon: fetchImage('DELETE'),
        };

        const result = parseAPIGatewayMethod(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
    });

    test('when a node passed with that is API Method PATCH it gets custom parsed icon.', () => {
        const node = {
            properties: {resourceId: 'blahblah_blah_PATCH'},
        };
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            icon: fetchImage('PATCH'),
        };

        const result = parseAPIGatewayMethod(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
    });

    test('when a node passed with that is API Method of random string it gets custom parsed icon.', () => {
        const node = {
            properties: {resourceId: 'blahblah_blah_Random'},
        };
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            icon: fetchImage('AWS::ApiGateway::Method'),
        };

        const result = parseAPIGatewayMethod(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
    });

    test('when undefined is sent as the resourceId for API Gateway Method it returns standard icon', () => {
        const expectedResult = {
            styling: {
                borderStyle: 'solid',
                borderColour: '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            icon: fetchImage('AWS::ApiGateway::Method'),
        };

        const result = parseAPIGatewayMethod(undefined);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
    });
});
