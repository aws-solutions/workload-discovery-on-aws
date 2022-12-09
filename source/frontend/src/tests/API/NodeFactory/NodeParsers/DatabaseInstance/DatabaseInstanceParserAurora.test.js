// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import DatabaseInstanceItem from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceDetails/DatabaseInstanceItem';
import { parseDatabaseInstance } from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceParser';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import { aurora } from './data/dbTypes';

const PUBLIC_URL = process.env;

beforeEach(() => {
  // jest.resetModules(); // this is important - it clears the cache
  process.env = { ...PUBLIC_URL };
});

afterEach(() => {
  delete process.env.PUBLIC_URL;
});

test('when node is an aurora rds instance with status as warning provisioning', () => {
  process.env.PUBLIC_URL = '';
  let auroraProvisioning = JSON.parse(aurora);
  auroraProvisioning.dBInstanceStatus = 'provisioning'
  const node = {
    name: 'aDatabaseInstance',
    properties: {
      resourceType: 'AWS::RDS::DBInstance',
      configuration: JSON.stringify(auroraProvisioning),
      dBInstanceStatus: 'provisioning',
    },
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#FF9900',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'provisioning',
      colour: '#FF9900',
    },
    icon: fetchImage('AWS::RDS::DBInstance-aurora', {
      status: 'status-warning',
    }),
    detailsComponent: (
      <DatabaseInstanceItem title='Instance Details' configuration={JSON.stringify(auroraProvisioning)} />
    ),
  };

  const result = parseDatabaseInstance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an aurora rds instance with status as warning pending', () => {
  process.env.PUBLIC_URL = '';
  let auroraPending = JSON.parse(aurora);
  auroraPending.dBInstanceStatus = 'pending'
  const node = {
    name: 'aDatabaseInstance',
    properties: {
      resourceType: 'AWS::RDS::DBInstance',
      configuration: JSON.stringify(auroraPending),
      dBInstanceStatus: 'pending',
    },
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#FF9900',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'pending',
      colour: '#FF9900',
    },
    icon: fetchImage('AWS::RDS::DBInstance-aurora', {
      status: 'status-warning',
    }),
    detailsComponent: (
      <DatabaseInstanceItem title='Instance Details' configuration={JSON.stringify(auroraPending)} />
    ),
  };

  const result = parseDatabaseInstance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an aurora rds instance with status as available', () => {
  process.env.PUBLIC_URL = '';
  let auroraAvailable = JSON.parse(aurora);
  auroraAvailable.dBInstanceStatus = 'available'
  const node = {
    name: 'aDatabaseInstance',
    properties: {
      resourceType: 'AWS::RDS::DBInstance',
      configuration: JSON.stringify(auroraAvailable),
      dBInstanceStatus: 'available',
    },
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#1D8102',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'available',
      colour: '#1D8102',
    },
    icon: fetchImage('AWS::RDS::DBInstance-aurora', {
      status: 'status-available',
    }),
    detailsComponent: (
      <DatabaseInstanceItem title='Instance Details' configuration={JSON.stringify(auroraAvailable)} />
    ),
  };

  const result = parseDatabaseInstance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an aurora rds instance with status as good active', () => {
  process.env.PUBLIC_URL = '';
  let auroraActive = JSON.parse(aurora);
  auroraActive.dBInstanceStatus = 'active'
  const node = {
    name: 'aDatabaseInstance',
    properties: {
      resourceType: 'AWS::RDS::DBInstance',
      configuration: JSON.stringify(auroraActive),
      dBInstanceStatus: 'active',
    },
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#1D8102',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'active',
      colour: '#1D8102',
    },
    icon: fetchImage('AWS::RDS::DBInstance-aurora', {
      status: 'status-available',
    }),
    detailsComponent: (
      <DatabaseInstanceItem title='Instance Details' configuration={JSON.stringify(auroraActive)} />
    ),
  };

  const result = parseDatabaseInstance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an aurora rds instance with status as error stopped', () => {
  process.env.PUBLIC_URL = '';
  let auroraStopped = JSON.parse(aurora);
  auroraStopped.dBInstanceStatus = 'stopped'
  const node = {
    name: 'aDatabaseInstance',
    properties: {
      resourceType: 'AWS::RDS::DBInstance',
      configuration: JSON.stringify(auroraStopped),
      dBInstanceStatus: 'stopped',
    },
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#D13212',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'stopped',
      colour: '#D13212',
    },
    icon: fetchImage('AWS::RDS::DBInstance-aurora', {
      status: 'status-negative',
    }),
    detailsComponent: (
      <DatabaseInstanceItem title='Instance Details' configuration={JSON.stringify(auroraStopped)} />
    ),
  };

  const result = parseDatabaseInstance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an aurora rds instance with status as error failed', () => {
  process.env.PUBLIC_URL = '';
  let auroraFailed = JSON.parse(aurora);
  auroraFailed.dBInstanceStatus = 'failed'

  const node = {
    name: 'aDatabaseInstance',
    properties: {
      resourceType: 'AWS::RDS::DBInstance',
      configuration: JSON.stringify(auroraFailed),
      dBInstanceStatus: 'failed',
    },
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#D13212',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'failed',
      colour: '#D13212',
    },
    icon: fetchImage('AWS::RDS::DBInstance-aurora', {
      status: 'status-negative',
    }),
    detailsComponent: (
      <DatabaseInstanceItem title='Instance Details' configuration={JSON.stringify(auroraFailed)} />
    ),
  };

  const result = parseDatabaseInstance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});
