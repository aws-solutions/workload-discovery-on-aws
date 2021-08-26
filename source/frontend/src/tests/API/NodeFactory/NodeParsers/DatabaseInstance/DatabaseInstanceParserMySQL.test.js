import React from 'react';
import DatabaseInstanceItem from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceDetails/DatabaseInstanceItem';
import { parseDatabaseInstance } from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceParser';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import { mysql } from './data/dbTypes';

const PUBLIC_URL = process.env;

beforeEach(() => {
  jest.resetModules(); // this is important - it clears the cache
  process.env = { ...PUBLIC_URL };
});

afterEach(() => {
  delete process.env.PUBLIC_URL;
});

test('when node is an mysql rds instance with status as provisioning', () => {
  process.env.PUBLIC_URL = '';
  let mysqlProv = JSON.parse(mysql);
  mysqlProv.dBInstanceStatus = 'provisioning'
  const node = {
    name: 'aDatabaseInstance',
    properties: {
      resourceType: 'AWS::RDS::DBInstance',
      configuration: JSON.stringify(mysqlProv),
      dBInstanceStatus: 'provisioning'
    }
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#FF9900',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'provisioning',
      colour: '#FF9900'
    },
    icon: fetchImage('AWS::RDS::DBInstance-mysql', {
      status: 'status-warning'
    }),
    detailsComponent: (
      <DatabaseInstanceItem
        title='Instance Details'
        configuration={JSON.stringify(mysqlProv)}
      />
    )
  };

  const result = parseDatabaseInstance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an mysql rds instance with status as pending', () => {
    process.env.PUBLIC_URL = '';
    let mysqlPending = JSON.parse(mysql);
    mysqlPending.dBInstanceStatus = 'pending'
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: JSON.stringify(mysqlPending),
        dBInstanceStatus: 'pending'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#FF9900',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'pending',
        colour: '#FF9900'
      },
      icon: fetchImage('AWS::RDS::DBInstance-mysql', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={JSON.stringify(mysqlPending)}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node is an mysql rds instance with status as available', () => {
    process.env.PUBLIC_URL = '';
    let mysqlAvailable = JSON.parse(mysql);
    mysqlAvailable.dBInstanceStatus = 'available'
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: JSON.stringify(mysqlAvailable),
        dBInstanceStatus: 'available'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#1D8102',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'available',
        colour: '#1D8102'
      },
      icon: fetchImage('AWS::RDS::DBInstance-mysql', {
        status: 'status-available'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={JSON.stringify(mysqlAvailable)}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node is an mysql rds instance with status as active', () => {
    process.env.PUBLIC_URL = '';
    let mysqlActive = JSON.parse(mysql);
    mysqlActive.dBInstanceStatus = 'active'
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: JSON.stringify(mysqlActive),
        dBInstanceStatus: 'active'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#1D8102',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'active',
        colour: '#1D8102'
      },
      icon: fetchImage('AWS::RDS::DBInstance-mysql', {
        status: 'status-available'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={JSON.stringify(mysqlActive)}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node is an mysql rds instance with status as stopped', () => {
    process.env.PUBLIC_URL = '';
    let mysqlStopped = JSON.parse(mysql);
    mysqlStopped.dBInstanceStatus = 'stopped'
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: JSON.stringify(mysqlStopped),
        dBInstanceStatus: 'stopped'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'stopped',
        colour: '#D13212'
      },
      icon: fetchImage('AWS::RDS::DBInstance-mysql', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={JSON.stringify(mysqlStopped)}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node is an mysql rds instance with status as failed', () => {
    process.env.PUBLIC_URL = '';
    let mysqlFailed = JSON.parse(mysql);
    mysqlFailed.dBInstanceStatus = 'failed'
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: JSON.stringify(mysqlFailed),
        dBInstanceStatus: 'failed'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'failed',
        colour: '#D13212'
      },
      icon: fetchImage('AWS::RDS::DBInstance-mysql', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={JSON.stringify(mysqlFailed)}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });