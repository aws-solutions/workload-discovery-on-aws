// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { test, expect } from 'vitest';
import { parseAPIGatewayResource } from '../../../../../../API/NodeFactory/NodeParsers/APIGateway/Resource/APIGatewayResourceParser';
import { fetchImage } from '../../../../../../Utils/ImageSelector';

test('when node that is an API Resource gets custom parsed it will have a custom hover over and icon', () => {
  const node = {
    properties: { resourceType: 'AWS::ApiGateway::Resource' }
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

  const result = parseAPIGatewayResource(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
});

test('when node that is undefined gets custom parsed it will return empty object', () => {
  const result = parseAPIGatewayResource(undefined);
  expect(result).toEqual({});
});
